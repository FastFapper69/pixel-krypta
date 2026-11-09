-- 09z7: save_profile() zapisuje existující profil čistým UPDATE (dřív INSERT … ON CONFLICT).
-- Důvod: trigger profiles_nick_check běží i na pokus o INSERT, takže starý profil se závadnou přezdívkou
-- (z doby před filtrem 09y) se nemohl uložit ani s nezměněnou přezdívkou. UPDATE kontroluje jen změněnou přezdívku.
create or replace function public.save_profile(p_nick text, p_save jsonb, p_stats jsonb)
returns void language plpgsql security definer set search_path to 'public'
as $function$
declare me uuid := auth.uid(); o public.profiles%rowtype; c record; had boolean;
begin
  if me is null then raise exception 'Neprihlasen'; end if;
  if pg_column_size(p_save) > 262144 or pg_column_size(p_stats) > 32768 then raise exception 'Save je prilis velky'; end if;
  select * into o from public.profiles where id = me;
  had := found;
  select * into c from public.stats_clean(o.stats, p_stats, case when had then now() - o.updated_at end);
  if array_length(c.why, 1) > 0 then
    insert into private.cheat_log(uid, nick, why, raw) values (me, p_nick, c.why, p_stats);
    delete from private.cheat_log where at < now() - interval '60 days';
  end if;
  if had then
    update public.profiles set nick = p_nick, save = p_save, stats = c.clean, updated_at = now(),
      -- a new nick (the nick trigger already refused a bad one) lifts a forced rename and the hiding that came with it
      hidden = case when o.rename_req and p_nick is distinct from o.nick then false else o.hidden end,
      rename_req = case when p_nick is distinct from o.nick then false else o.rename_req end
    where id = me;
  else
    insert into public.profiles(id, nick, save, stats, updated_at) values (me, p_nick, p_save, c.clean, now())
      on conflict (id) do nothing; -- two first saves at once: the next save updates
  end if;
end $function$;
