-- 09z7: vynucené přejmenování závadných přezdívek z doby před filtrem (09y).
-- Moderátor označí profil (rename_req = true, hidden = true). Hra po spuštění pozná rename_req z my_profile()
-- a hráč si musí vybrat novou přezdívku. Jakmile save_profile() dostane jinou (filtrem prošlou) přezdívku,
-- rename_req i hidden se samy zruší a hráč se vrátí do žebříčku i se skóre.
-- Ruční použití: update public.profiles set rename_req = true, hidden = true where id = '<uuid>';

alter table public.profiles add column if not exists rename_req boolean not null default false;

drop function if exists public.my_profile();
create function public.my_profile()
returns table(nick text, save jsonb, updated_at timestamptz, rename_req boolean)
language sql stable security definer set search_path to 'public'
as $$
  select p.nick, p.save, p.updated_at, p.rename_req from public.profiles p where p.id = auth.uid();
$$;
revoke all on function public.my_profile() from public, anon;
grant execute on function public.my_profile() to authenticated;

create or replace function public.save_profile(p_nick text, p_save jsonb, p_stats jsonb)
returns void language plpgsql security definer set search_path to 'public'
as $function$
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
  on conflict (id) do update set nick = excluded.nick, save = excluded.save, stats = excluded.stats, updated_at = excluded.updated_at,
    -- a new nick (the nick trigger already refused a bad one) lifts a forced rename and the hiding that came with it
    hidden = case when profiles.rename_req and excluded.nick is distinct from profiles.nick then false else profiles.hidden end,
    rename_req = case when excluded.nick is distinct from profiles.nick then false else profiles.rename_req end;
end $function$;

-- every profile whose nick fails today's filter gets a forced rename (and stays hidden until then)
update public.profiles set rename_req = true, hidden = true where public.nick_bad(nick);
