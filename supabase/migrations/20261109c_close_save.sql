-- 09z4, část 2b (až po nasazení hry 09z4): cizí save nikdo nepřečte, stará funkce bez limitu pokusů pryč
revoke select (save) on public.profiles from anon, authenticated;
drop function if exists public.claim_profile(text, text);
