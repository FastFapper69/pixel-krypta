---
name: "audit-projektu"
description: "Kompletní audit Pixel Krypty: chyby v kódu, chyby za běhu, testy, server (Supabase), výkon a pracovní postup. Použij, když uživatel chce audit, kontrolu projektu, „najdi chyby“, nebo před vydáním a po velkém balíku změn."
---

# Audit projektu Pixel Krypta

**Celý audit spouštěj jen na výslovné přání uživatele** (pravidlo 9. 11. 2026). Po běžných změnách stačí rychlý test v dotčené oblasti, viz „Testy po změně“ v CLAUDE.md.

Komunikuj česky. Nejdřív `git fetch` + `git pull --rebase`. Výsledek zapiš do `AUDIT.md` (přepiš, datum a verze nahoře) a krátce shrň uživateli: co prošlo, chyby podle priority, kde si ulehčit práci. **Chyby jen hlas, neopravuj bez souhlasu** – výjimka: malá jednoznačná oprava (přejmenování, překlep), kterou hned ověříš měřením. Bezpečnostní a serverové změny vždy nejdřív navrhni.

## 1. Automatická část (vždy)
```
cd tests/tools && node audit.js          # rychlý, ~2 min
node audit.js plny                        # + hráči-boti přes kapitoly a plynulost menu (~5 min)
```
Kontroluje: duplicitní funkce (platí jen poslední – tak zmizelo ztlumení hudby 09r), verzi = první Novinka, tajné klíče v repu, fialovou v UI (přání 09z2), velikost CLAUDE.md, testy (překlady, ukládání, `chapcheck all`, denní výzva, mechaniky po restartu, `menucheck`), 18 obrazovek × nový/pokročilý účet × CZ/EN (chyby JS, chybějící soubory), všech 30+ map 20 s + boss, běh do konce, pohlednice map. Výsledek i v `tests/tools/audit-last.txt`.

Nové testy a kontroly piš nad `tests/tools/lib.js` (`prep()`, `open({phone,lang,save})`, `SCREENS`). Když přibude obrazovka, přidej ji do `SCREENS` v lib.js; když přibude povinný test, přidej ho do seznamu v audit.js.

## 1b. Proklikání všech tlačítek (`proklik.js`, od 13. 11. 2026)
```
cd tests/tools && node proklik.js 2 cs 2      # hloubka 2, ~40 min v sandboxu (2 procesory) – pusť na pozadí
node proklik.js 1 en 2                         # angličtina, hloubka 1, ~7 min
node proklik.js 1 cs 2 'late:(hero|forge)'     # jen vybrané scénáře (regex)
```
46 scénářů (obrazovky z `L.SCREENS` + běh, pauza, nabídka úrovně, výhra, prohra; nový i pokročilý účet). Každé tlačítko se zmáčkne skutečným klepnutím; mezi kliky se hra vrátí do výchozího stavu bez načítání, chyba JS se vždy ověří na čistě načtené hře. Hlásí chyby JS, zakrytá tlačítka (jen když je nezakrývá otevřené okno) a tlačítka bez reakce (vybrané záložky jsou v pořádku). Výsledek `/tmp/proklik/vysledek-<jazyk>.json`. Nová obrazovka = přidat do `SCREENS` v lib.js a proklikávač ji projde sám.

## 2. Hlubší kontrola kódu (ESLint, ~1 min)
```
mkdir -p /tmp/lint && cd /tmp/lint && npm i -s eslint@8.57.0 >/dev/null
cp $HOME/pixel-krypta/game.js game.js   # 09z7: herní kód je v game.js
npx eslint --no-eslintrc --env browser,es2022 --parser-options ecmaVersion:2022 --global supabase,KRYPTA_EN \
  --rule '{"no-redeclare":2,"no-dupe-keys":2,"no-undef":2,"no-unreachable":1,"no-self-assign":1,"no-unused-vars":[1,{"args":"none"}]}' game.js
```
Skutečné chyby: `no-redeclare`, `no-undef`, `no-dupe-keys` (u exportu `window.__krypta` neškodné). `no-unused-vars` = mrtvý kód k úklidu.

## 3. Server (Supabase nástroje, projekt `mpxfppuigwvwlfhsnbgr`)
- `get_advisors` security i performance – zapsat WARN a výš.
- Pravidla a práva: `select tablename,policyname,cmd,roles,qual,with_check from pg_policies where schemaname='public'` a `information_schema.column_privileges` pro `anon`/`authenticated` (kdo smí číst/měnit které sloupce).
- Funkce SECURITY DEFINER (`pg_get_functiondef`): limit pokusů (PIN!), kontrola `auth.uid()`, nic nesmí jít bez klíče.
- Otevřená nahlášení: `select count(*) from reports where done=false` (moderovat do 24 h).
- Podezřelé skóre: `select nick,at,why from private.cheat_log order by at desc limit 20`; zamčené PINy: `select nick,count(*) from private.pin_fail group by 1`.
- Přezdívky z doby před filtrem: `select nick from profiles where public.nick_bad(nick) and not coalesce(hidden,false)`.
- Jen čtení. Migrace jen po souhlasu uživatele.

## 4. Ruční pohled (to, co skript nevidí)
- Nálezy z minulého `AUDIT.md`: co je opravené, co zůstává.
- iPhone: horní okraj (iOS 26 rozmazává pruh pod stavovým řádkem → nic důležitého do `--sat + 30px`), ostrost rámů – jen uživatel na telefonu, zeptej se.
- Balanc: `node hraci.js zed 1` (rychle) nebo `kapitola:cN 3`; porovnat s pravidlem „každá kapitola je zeď“. Telemetrie `fbread.js runs` (potřebuje `dev_key` od uživatele).
- Pracovní postup: velikost CLAUDE.md (cíl < 40 kB, historie do `docs/HISTORIE.md`), zastaralé testy v `tests/tools`, opakované ruční kroky → nástroj.

## Poučení z auditů
- 13. 11. 2026 (12z1): ~3 200 kliků bez chyby JS. Po změně chování (12y Fúze na Bažině, 12z čas v popisu mapy) zastaraly testy `prvnidny`, `ukazmi` a kontrola `chapcheck` (48 falešných chyb) – **při změně chování hledej testy, které staré chování hlídají** (`grep` názvu funkce/mapy v `tests/tools`). `kitTier`/`PWR` neodpovídá zkráceným běhům – přepočítat `krivka.js zapis` před novou kapitolou.
- 11. 11. 2026 (11x): `toast` se v menu nezobrazí (je v HUD běhu) – hlášky mimo běh přes `note`. `newsshot.js` potřebuje verzi o jednu starší než nová Novinka. Do repa se dostaly výstupy testů (`off2.html`, `net3_*.png` v kořeni webu) – kontrolovat `git ls-files | xargs du` a testy fotit do `/tmp`. Server: migraci zkoušet v `DO $$ … raise exception $$` i s vložením jako `authenticated` (`set local role`, `request.jwt.claims`).
- 9. 11. 2026 večer: okna otevřená během běhu (nabídka úrovně) zahazují kroky rytmu – úder ultimátky mizel.
- 9. 11. 2026: duplicitní `duckMusic` (09r ztlumení nikdy nefungovalo), PIN bez limitu pokusů, žebříček stahuje cizí savy kvůli jednomu obrázku, pokles plynulosti menu po rámech v plátně, 108 kB CLAUDE.md.
