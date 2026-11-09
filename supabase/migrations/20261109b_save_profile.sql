-- 09z4, část 2a: ukládání přes funkci (upsert do profiles by po zavření sloupce save nefungoval) + vizitka do žebříčku
create or replace function public.save_profile(p_nick text, p_save jsonb, p_stats jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'Neprihlasen'; end if;
  if pg_column_size(p_save) > 262144 or pg_column_size(p_stats) > 32768 then raise exception 'Save je prilis velky'; end if;
  insert into public.profiles(id, nick, save, stats, updated_at) values (me, p_nick, p_save, coalesce(p_stats,'{}'::jsonb), now())
  on conflict (id) do update set nick = excluded.nick, save = excluded.save, stats = excluded.stats, updated_at = excluded.updated_at;
end $$;
revoke all on function public.save_profile(text, jsonb, jsonb) from public, anon;
grant execute on function public.save_profile(text, jsonb, jsonb) to authenticated;
update public.profiles set stats = coalesce(stats,'{}'::jsonb) || jsonb_build_object('card', jsonb_build_object(
  'av', save->'av', 'tl', save->'title',
  'cl', (select count(*) from jsonb_each(coalesce(save->'cleared','{}'::jsonb)) e where e.value = 'true'::jsonb),
  'hc', (select count(*) from jsonb_each(coalesce(save->'heroes','{}'::jsonb)) e where e.value = 'true'::jsonb)))
 where not coalesce(stats,'{}'::jsonb) ? 'card';
