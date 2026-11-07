-- Pixel Krypta: statistiky běhů (telemetrie pro ladění hry)
-- Vlož celé do Supabase → SQL Editor → New query a klikni na Run. Stačí jednou.
-- Hra po každém běhu zapíše jeden řádek. Hráči smí jen přidávat své řádky, číst je nemůže nikdo z hry
-- (čte je jen vývojář v Supabase / Claude přes SQL).

create table if not exists public.runs (
  id bigint generated always as identity primary key,
  uid uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  ver text, lang text,
  hero text, map text, nm int default 0, mod text, coop boolean default false,
  "end" text,            -- win / death / crystal / quit
  won boolean,
  t int, lv int, kills int,
  cause text,            -- co hráče zabilo naposled (např. elite:golem, boss:lich, haz, cart)
  dmg_by jsonb, weapons jsonb, passives jsonb,
  towers int, boss boolean,
  runs_before int, hero_lv int
);

alter table public.runs enable row level security;

drop policy if exists "Hrac zapisuje sve behy" on public.runs;
create policy "Hrac zapisuje sve behy" on public.runs
  for insert to authenticated with check (auth.uid() = uid);

create index if not exists runs_created on public.runs (created_at desc);

-- Přehled pro vývojáře (spouštěj v SQL Editoru):
-- select hero, map, count(*) behu, round(avg(won::int)*100) vyhry_pct, percentile_cont(.5) within group (order by t) median_s
--   from runs where not coop group by 1,2 order by 1,2;
-- select cause, count(*) from runs where "end"='death' group by 1 order by 2 desc;
