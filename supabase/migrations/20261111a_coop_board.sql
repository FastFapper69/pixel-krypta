-- 11j: co-op žebříček. Zapisuje jen hostitel svůj běh (host = auth.uid()), nejvýš 1× za minutu.
-- Číst jde jen přes coop_board(): přezdívky bere z profiles (hostitel nemůže podstrčit cizí jméno), skryté profily vynechá,
-- každá dvojice jen se svým nejlepším během. Běhy s botem se nezapisují.
create table if not exists public.coop_runs(
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  host uuid not null default auth.uid(),
  mate uuid,
  host_hero text not null check (length(host_hero) <= 16),
  mate_hero text not null check (length(mate_hero) <= 16),
  map text not null check (length(map) <= 16),
  nm int not null default 0 check (nm between 0 and 3),
  won boolean not null default false,
  t int not null check (t between 0 and 7200),
  kills int not null check (kills between 0 and 200000),
  sh int not null default 0 check (sh between 0 and 100000),
  ver text check (length(ver) <= 24));
alter table public.coop_runs enable row level security;
drop policy if exists "Hostitel zapisuje co-op beh" on public.coop_runs;
create policy "Hostitel zapisuje co-op beh" on public.coop_runs for insert to authenticated
  with check (host = auth.uid() and (mate is null or mate <> host));
create index if not exists coop_runs_host_at on public.coop_runs (host, created_at desc);
create or replace function private.coop_rate() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.coop_runs where host = new.host and created_at > now() - interval '60 seconds') then
    raise exception 'too many coop runs';
  end if;
  return new;
end $$;
drop trigger if exists coop_rate on public.coop_runs;
create trigger coop_rate before insert on public.coop_runs for each row execute function private.coop_rate();
create or replace function public.coop_board(p_map text default null)
returns table(host_nick text, mate_nick text, host_hero text, mate_hero text, map text, nm int, won boolean, t int, kills int, sh int, at timestamptz)
language sql stable security definer set search_path = '' as $$
  select s.hn, s.mn, s.host_hero, s.mate_hero, s.map, s.nm, s.won, s.t, s.kills, s.sh, s.created_at from (
    select distinct on (least(r.host, coalesce(r.mate, r.host)), greatest(r.host, coalesce(r.mate, r.host)))
      ph.nick hn, pm.nick mn, r.host_hero, r.mate_hero, r.map, r.nm, r.won, r.t, r.kills, r.sh, r.created_at
    from public.coop_runs r
    join public.profiles ph on ph.id = r.host and not coalesce(ph.hidden, false)
    left join public.profiles pm on pm.id = r.mate
    where (p_map is null or r.map = p_map) and (pm.id is null or not coalesce(pm.hidden, false))
    order by least(r.host, coalesce(r.mate, r.host)), greatest(r.host, coalesce(r.mate, r.host)), r.won desc, r.nm desc, r.kills desc, r.t desc) s
  order by s.won desc, s.nm desc, s.kills desc, s.t desc limit 20 $$;
revoke all on function public.coop_board(text) from public;
grant execute on function public.coop_board(text) to anon, authenticated;
