-- 09z5: kontrola věrohodnosti výsledků v žebříčku. Server nemožné hodnoty ořízne (nic neodmítne – save se uloží vždy)
-- a zapíše do private.cheat_log. Meze jsou s velkou rezervou nad skutečnými hráči (11/2026: max ~11 zabití/s, kombo ~1000).
create table if not exists private.cheat_log(id bigint generated always as identity primary key, uid uuid, nick text, at timestamptz not null default now(), why text[], raw jsonb);
alter table private.cheat_log enable row level security;
revoke all on private.cheat_log from anon, authenticated;

create or replace function public.stats_entry_ok(e jsonb) returns boolean language sql immutable as $$
  select e is not null and jsonb_typeof(e) = 'object'
    and coalesce((e->>'t')::numeric, 0) between 0 and 3600
    and coalesce((e->>'kills')::numeric, 0) between 0 and greatest(300, coalesce((e->>'t')::numeric, 0) * 40)
    and coalesce((e->>'lv')::numeric, 0) between 0 and 400
    and coalesce((e->>'nm')::numeric, 0) between 0 and 9
$$;

create or replace function public.stats_clean(p_old jsonb, p_new jsonb, p_since interval, out clean jsonb, out why text[])
language plpgsql immutable as $$
declare runs numeric; wins numeric; kills numeric; combo numeric; orun numeric; maxrun numeric; k text; v jsonb; b jsonb := '{}'::jsonb;
begin
  why := '{}'; clean := coalesce(p_new, '{}'::jsonb);
  if jsonb_typeof(clean) <> 'object' then clean := '{}'::jsonb; why := why || 'stats nejsou objekt'; return; end if;
  runs := greatest(0, coalesce((clean->>'runs')::numeric, 0));
  wins := greatest(0, coalesce((clean->>'wins')::numeric, 0));
  kills := greatest(0, coalesce((clean->>'kills')::numeric, 0));
  -- přírůstek běhů za čas od posledního uložení (běh trvá aspoň ~20 s; offline hraní se dožene, protože čas běží dál)
  orun := coalesce((p_old->>'runs')::numeric, 0);
  if p_since is not null then
    maxrun := orun + 3 + extract(epoch from p_since) / 20;
    if runs > maxrun then why := why || ('běhů ' || runs || ' > ' || floor(maxrun)); runs := floor(maxrun); end if;
  end if;
  if runs > 100000 then why := why || 'běhů > 100000'; runs := 100000; end if;
  if wins > runs then why := why || ('výher ' || wins || ' > běhů ' || runs); wins := runs; end if;
  if kills > runs * 40000 then why := why || ('zabití ' || kills || ' > běhy × 40000'); kills := runs * 40000; end if;
  clean := clean || jsonb_build_object('runs', runs, 'wins', wins, 'kills', kills);
  -- nejlepší výsledky na mapách, denní a týdenní výzva
  if jsonb_typeof(clean->'best') = 'object' then
    for k, v in select * from jsonb_each(clean->'best') loop
      if public.stats_entry_ok(v) then b := b || jsonb_build_object(k, v); else why := why || ('mapa ' || k || ': ' || left(v::text, 80)); end if;
    end loop;
    clean := jsonb_set(clean, '{best}', b);
  end if;
  foreach k in array array['daily','weekly'] loop
    if clean ? k and not public.stats_entry_ok(clean->k) then why := why || (k || ': ' || left((clean->k)::text, 80)); clean := clean - k; end if;
  end loop;
  -- kombo (žebříček Kombo)
  combo := coalesce((clean#>>'{tot,combo}')::numeric, 0);
  if combo > 20000 or combo > kills + 100 then
    why := why || ('kombo ' || combo); clean := jsonb_set(clean, '{tot,combo}', to_jsonb(least(20000, kills + 100)));
  end if;
end $$;

create or replace function public.save_profile(p_nick text, p_save jsonb, p_stats jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); o public.profiles%rowtype; c record;
begin
  if me is null then raise exception 'Neprihlasen'; end if;
  if pg_column_size(p_save) > 262144 or pg_column_size(p_stats) > 32768 then raise exception 'Save je prilis velky'; end if;
  select * into o from public.profiles where id = me;
  select * into c from public.stats_clean(o.stats, p_stats, case when found then now() - o.updated_at end);
  if array_length(c.why, 1) > 0 then
    insert into private.cheat_log(uid, nick, why, raw) values (me, p_nick, c.why, p_stats);
    delete from private.cheat_log where at < now() - interval '60 days';
  end if;
  insert into public.profiles(id, nick, save, stats, updated_at) values (me, p_nick, p_save, c.clean, now())
  on conflict (id) do update set nick = excluded.nick, save = excluded.save, stats = excluded.stats, updated_at = excluded.updated_at;
end $$;
revoke all on function public.save_profile(text, jsonb, jsonb) from public, anon;
grant execute on function public.save_profile(text, jsonb, jsonb) to authenticated;
revoke all on function public.stats_clean(jsonb, jsonb, interval) from public, anon, authenticated;
revoke all on function public.stats_entry_ok(jsonb) from public, anon, authenticated;

-- přímý zápis do profiles už hra nepoužívá (09z4) – bez něj nejde kontrolu obejít
revoke insert, update on public.profiles from anon, authenticated;
