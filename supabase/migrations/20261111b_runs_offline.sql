-- 11r: běhy odehrané offline. Hra si běh uloží do fronty v zařízení a pošle ho, až je zase online.
-- rid = náhodné id běhu (stejný běh poslaný dvakrát se zapíše jen jednou), played_at = kdy se běh hrál,
-- offline = běh se hrál bez připojení k serveru. Staré verze hry tyhle sloupce neposílají (zůstanou null).
alter table public.runs add column if not exists rid text;
alter table public.runs add column if not exists played_at timestamptz;
alter table public.runs add column if not exists offline boolean default false;
create unique index if not exists runs_rid on public.runs (rid);
