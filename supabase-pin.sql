-- Pixel Krypta: přihlášení přezdívkou a PINem (spusť jednou v SQL Editoru)
create extension if not exists pgcrypto with schema extensions;
alter table public.profiles add column if not exists pin_hash text;
-- staré profily bez PINu (vznikly před touto opravou) už nejdou obnovit, uvolníme jejich přezdívky
delete from public.profiles where pin_hash is null;
revoke select, insert, update on public.profiles from anon, authenticated;
grant select (id, nick, save, stats, updated_at) on public.profiles to anon, authenticated;
grant insert (id, nick, save, stats, updated_at), update (id, nick, save, stats, updated_at) on public.profiles to authenticated;

create or replace function public.set_pin(p_pin text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if p_pin !~ '^[0-9]{4,8}$' then raise exception 'PIN musi mit 4 az 8 cislic'; end if;
  update public.profiles set pin_hash = crypt(p_pin, gen_salt('bf')) where id = auth.uid();
  if not found then raise exception 'Profil neexistuje'; end if;
end $$;

create or replace function public.claim_profile(p_nick text, p_pin text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare r public.profiles%rowtype;
begin
  if auth.uid() is null then raise exception 'Neprihlasen'; end if;
  select * into r from public.profiles where lower(nick) = lower(p_nick);
  if not found or r.pin_hash is null or r.pin_hash <> crypt(p_pin, r.pin_hash) then
    raise exception 'Spatna prezdivka nebo PIN';
  end if;
  if r.id <> auth.uid() then
    delete from public.profiles where id = auth.uid();
    update public.profiles set id = auth.uid() where id = r.id;
  end if;
end $$;

revoke execute on function public.set_pin(text), public.claim_profile(text, text) from public, anon;
grant execute on function public.set_pin(text), public.claim_profile(text, text) to authenticated;
