-- 12o: „Smazat moje data“ smaže opravdu všechno, co patří hráči (kvůli stránce smazat-ucet.html a pravidlům Google Play).
-- Navíc proti verzi z 09. 11.: události (events), nahlášení, která míří na hráče, a co-op výsledky
-- (kde byl hostitel, se řádek smaže; kde byl spoluhráč, zůstane výsledek hostitele bez něj).
create or replace function public.delete_my_data()
 returns void
 language plpgsql
 security definer
 set search_path to 'public', 'auth'
as $function$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'Neprihlasen'; end if;
  delete from public.feedback where uid = me;
  delete from public.runs where uid = me;
  delete from public.events where uid = me;
  delete from public.reports where reporter = me or target = me;
  delete from public.coop_runs where host = me;
  update public.coop_runs set mate = null where mate = me;
  delete from public.profiles where id = me;
  delete from auth.users where id = me;
end $function$;
