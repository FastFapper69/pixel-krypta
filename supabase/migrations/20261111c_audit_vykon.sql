-- Audit 11. 11. 2026 (verze 11x): výkon RLS, indexy, pevný search_path, triggerová funkce mimo /rpc.
-- Chování pro hráče se nemění: pravidla kontrolují totéž, jen auth.uid() se spočítá jednou za dotaz, ne pro každý řádek.

-- 1) RLS: auth.uid() -> (select auth.uid())
alter policy "Hrac meni sebe" on public.profiles
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
alter policy "Hrac vklada sebe" on public.profiles
  with check ((select auth.uid()) = id);
alter policy "Hrac posila zpetnou vazbu" on public.feedback
  with check ((select auth.uid()) = uid);
alter policy "Hrac zapisuje sve behy" on public.runs
  with check ((select auth.uid()) = uid);
alter policy "Hrac nahlasuje" on public.reports
  with check (reporter = (select auth.uid()));
alter policy "Hostitel zapisuje co-op beh" on public.coop_runs
  with check ((host = (select auth.uid())) and ((mate is null) or (mate <> host)));

-- 2) indexy na cizí klíče (feedback_limit počítá zprávy hráče za 24 h)
create index if not exists feedback_uid_created on public.feedback (uid, created_at);
create index if not exists runs_uid on public.runs (uid);

-- 3) pevný search_path (funkce volají jen public.* a vestavěné funkce)
alter function public.stats_clean(jsonb, jsonb, interval) set search_path = public, pg_temp;
alter function public.stats_entry_ok(jsonb) set search_path = public, pg_temp;

-- 4) feedback_limit je trigger, přes /rpc ho nikdo volat nemá
revoke execute on function public.feedback_limit() from public, anon, authenticated;
