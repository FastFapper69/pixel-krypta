-- Pixel Krypta: žebříček, přezdívky a online ukládání
-- Vlož celé do Supabase → SQL Editor → New query a klikni na Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null check (char_length(nick) between 2 and 16),
  save jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- každá přezdívka jen jednou (bez ohledu na velká a malá písmena)
create unique index if not exists profiles_nick_unique on public.profiles (lower(nick));

alter table public.profiles enable row level security;

-- žebříček vidí všichni, ale každý hráč smí zapisovat jen svůj vlastní záznam
drop policy if exists "Kdokoli cte zebricek" on public.profiles;
create policy "Kdokoli cte zebricek" on public.profiles
  for select using (true);

drop policy if exists "Hrac vklada sebe" on public.profiles;
create policy "Hrac vklada sebe" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Hrac meni sebe" on public.profiles;
create policy "Hrac meni sebe" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
