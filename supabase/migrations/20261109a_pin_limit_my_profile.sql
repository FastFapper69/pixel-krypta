-- 09z4 (audit 9. 11. 2026), část 1 – nic nerozbije starší verzi hry.
-- Limit pokusů PINu: chybné pokusy se zapisují do private.pin_fail; zámek 5 chyb / hodinu nebo 20 / den na přezdívku
-- a 15 chyb / hodinu z jednoho účtu (zkoušení mnoha přezdívek). Funkce vrací stav místo výjimky, aby se zápis pokusu nevrátil.
create schema if not exists private;
create table if not exists private.pin_fail(id bigint generated always as identity primary key, nick text not null, uid uuid, at timestamptz not null default now());
create index if not exists pin_fail_nick_at on private.pin_fail(nick, at);
create index if not exists pin_fail_uid_at on private.pin_fail(uid, at);
alter table private.pin_fail enable row level security;
revoke all on private.pin_fail from anon, authenticated;

create or replace function public.claim_profile_v2(p_nick text, p_pin text)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare r public.profiles%rowtype; me uuid := auth.uid(); n text := lower(btrim(coalesce(p_nick,'')));
begin
  if me is null then return 'auth'; end if;
  delete from private.pin_fail where at < now() - interval '2 days';
  if (select count(*) from private.pin_fail where nick = n and at > now() - interval '1 hour') >= 5
     or (select count(*) from private.pin_fail where nick = n and at > now() - interval '1 day') >= 20
     or (select count(*) from private.pin_fail where uid = me and at > now() - interval '1 hour') >= 15 then
    return 'locked';
  end if;
  select * into r from public.profiles where lower(nick) = n;
  if not found or r.pin_hash is null or coalesce(p_pin,'') !~ '^[0-9]{4,8}$' or r.pin_hash <> crypt(p_pin, r.pin_hash) then
    insert into private.pin_fail(nick, uid) values (n, me);
    return 'bad';
  end if;
  delete from private.pin_fail where nick = n;
  if r.id <> me then
    delete from public.profiles where id = me;
    update public.profiles set id = me where id = r.id;
  end if;
  return 'ok';
end $$;
revoke all on function public.claim_profile_v2(text, text) from public, anon;
grant execute on function public.claim_profile_v2(text, text) to authenticated;

-- Vlastní profil včetně savu (sloupec save už nebude veřejně čitelný – část 2).
create or replace function public.my_profile()
returns table(nick text, save jsonb, updated_at timestamptz) language sql stable security definer set search_path = public as $$
  select p.nick, p.save, p.updated_at from public.profiles p where p.id = auth.uid();
$$;
revoke all on function public.my_profile() from public, anon;
grant execute on function public.my_profile() to authenticated;

-- Profilový obrázek do stats (žebříček ho pak nepotřebuje číst ze savu).
update public.profiles set stats = coalesce(stats, '{}'::jsonb) || jsonb_build_object('av', save->'av')
 where save ? 'av' and not coalesce(stats, '{}'::jsonb) ? 'av';

-- Zbytečně široká práva (přes API nedosažitelná, ale pryč s nimi).
revoke truncate, trigger, references on all tables in schema public from anon, authenticated;
