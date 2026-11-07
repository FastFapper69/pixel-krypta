-- Pixel Krypta: zpětná vazba od hráčů + čtení pro vývojáře (a Clauda)
-- Vlož celé do Supabase → SQL Editor → New query a klikni na Run. Stačí jednou.
-- Hráči smí jen přidávat svou zpětnou vazbu (max 5 za den), číst ji nikdo z hry nemůže.
-- Číst ji jde jen funkcemi feedback_export / runs_export s tajným klíčem (ten se nastaví
-- zvlášť příkazem, který ti Claude pošle do chatu – klíč do tohohle veřejného souboru nepatří).

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  uid uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  nick text,
  kind text,                       -- napad / chyba / balanc / jine
  rating int check (rating between 1 and 5),
  msg text not null check (char_length(msg) between 3 and 1000),
  ver text, lang text,
  ctx jsonb,                       -- verze, zařízení, postup ve hře (žádné osobní údaje)
  done boolean not null default false
);

alter table public.feedback enable row level security;

drop policy if exists "Hrac posila zpetnou vazbu" on public.feedback;
create policy "Hrac posila zpetnou vazbu" on public.feedback
  for insert to authenticated with check (auth.uid() = uid);

create index if not exists feedback_created on public.feedback (created_at desc);

-- ochrana proti spamu: nejvýš 5 zpráv od jednoho hráče za 24 hodin
create or replace function public.feedback_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.feedback where uid = new.uid and created_at > now() - interval '24 hours') >= 5 then
    raise exception 'feedback_limit';
  end if;
  return new;
end $$;
drop trigger if exists feedback_limit on public.feedback;
create trigger feedback_limit before insert on public.feedback for each row execute function public.feedback_limit();

-- tajný klíč pro čtení (tabulka bez přístupu z hry)
create schema if not exists private;
create table if not exists private.app_secret (name text primary key, value text not null);
revoke all on schema private from anon, authenticated;
revoke all on all tables in schema private from anon, authenticated;

create or replace function public.dev_key_ok(p_key text) returns boolean
language sql stable security definer set search_path = public, private as $$
  select exists (select 1 from private.app_secret where name = 'dev_key' and value = p_key and length(p_key) >= 24);
$$;
revoke all on function public.dev_key_ok(text) from public, anon, authenticated;

-- čtení zpětné vazby: od data, volitelně jen nevyřízené
create or replace function public.feedback_export(p_key text, p_since timestamptz default now() - interval '30 days', p_open_only boolean default true)
returns setof public.feedback
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.dev_key_ok(p_key) then raise exception 'denied'; end if;
  return query select * from public.feedback f where f.created_at >= p_since and (not p_open_only or not f.done) order by f.created_at;
end $$;

-- označení přečtené/vyřízené zpětné vazby
create or replace function public.feedback_done(p_key text, p_ids bigint[]) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.dev_key_ok(p_key) then raise exception 'denied'; end if;
  update public.feedback set done = true where id = any(p_ids);
  get diagnostics n = row_count; return n;
end $$;

-- čtení telemetrie běhů (tabulka runs z supabase-runs.sql) pro ladění balancu – jen když tabulka runs existuje
do $do$ begin
  if to_regclass('public.runs') is not null then
    execute $f$
      create or replace function public.runs_export(p_key text, p_since timestamptz default now() - interval '7 days')
      returns setof public.runs
      language plpgsql stable security definer set search_path = public as $b$
      begin
        if not public.dev_key_ok(p_key) then raise exception 'denied'; end if;
        return query select * from public.runs r where r.created_at >= p_since order by r.created_at;
      end $b$;
    $f$;
    execute 'grant execute on function public.runs_export(text, timestamptz) to anon, authenticated';
  end if;
end $do$;

grant execute on function public.feedback_export(text, timestamptz, boolean) to anon, authenticated;
grant execute on function public.feedback_done(text, bigint[]) to anon, authenticated;

-- Přehled v SQL Editoru: select created_at, nick, kind, rating, msg from feedback order by created_at desc;
