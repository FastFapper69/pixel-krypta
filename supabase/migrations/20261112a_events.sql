-- 12n: drobné události prvních dnů hráče (kde noví hráči končí). Research 12. 11.: chyběl trychtýř prvních minut.
-- Hra si události ukládá do fronty v zařízení (save.evQ) a posílá je po dávkách jako běhy. Hráč smí jen přidávat své řádky,
-- číst je nemůže nikdo z hry (čte je jen vývojář v Supabase / Claude přes SQL). Smazání účtu (delete_my_data → auth.users)
-- smaže i události (on delete cascade).
-- ev  = druh: open (spuštění hry), tut (krok tutoriálu), feat / featgo / featlater (karta nové mechaniky),
--       scr (první otevření obrazovky v relaci), chest (truhla zdarma), lw (Týden v kryptě), gift (dárek po prohrách),
--       tmrw (karta Zítra tě čeká), qclaim (vyzvednutý denní úkol)
-- k   = upřesnění (krok, mechanika, obrazovka, mapa), v = číslo (sekunda běhu, den…)
-- rn  = kolik běhů měl hráč za sebou, d0 = kolikátý den od prvního běhu (0 = první den), at = kdy se to stalo v zařízení
create table if not exists public.events (
  id bigint generated always as identity primary key,
  uid uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  at timestamptz,
  ev text not null check (char_length(ev) <= 16),
  k text check (char_length(k) <= 48),
  v int,
  ver text check (char_length(ver) <= 16),
  lang text check (char_length(lang) <= 4),
  rn int,
  d0 int
);

alter table public.events enable row level security;

drop policy if exists "Hrac zapisuje sve udalosti" on public.events;
create policy "Hrac zapisuje sve udalosti" on public.events
  for insert to authenticated with check ((select auth.uid()) = uid);

grant insert on public.events to authenticated;
revoke select, update, delete on public.events from anon, authenticated;

create index if not exists events_uid_at on public.events (uid, at);
create index if not exists events_ev on public.events (ev, created_at desc);
