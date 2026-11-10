# Audit projektu – 10. 11. 2026 (verze 10i)

Opakovat: skill `.claude/skills/audit-projektu`, příkaz `node tests/tools/audit.js` (rychlý, ~2 min) nebo `node tests/tools/audit.js plny` (s boty a výkonem). Serverovou část kontroluje skill přes Supabase nástroje. Předchozí audit (9. 11., 09z3) je v historii gitu.

## Co prošlo
- **Hra běží bez chyb:** 18 obrazovek × nový i pokročilý účet × CZ/EN, všech 30 map 20 s + boss, konec běhu (nová úroveň, pauza, výsledky), 48 běhů hráčů-botů přes kapitoly I–VI – žádná chyba JS ani chybějící soubor.
- **Testy:** překlady, ukládání, kapitoly a hrdinové (`chapcheck all`), denní výzva, mechaniky po restartu, hlavní menu, server (stub: ukládání, PIN, žebříček), horní okraj pod rozmazáním iOS, pauza se záložkami, oslava hrdiny, úder ultimátky.
- **Statické kontroly:** žádné duplicitní funkce, verze = první Novinka (10i) i v odkazech na soubory, žádné tajné klíče v repu, fialová jen 1 tlumená v CSS, CLAUDE.md 24 kB.
- **ESLint:** žádné `no-undef` ani `no-redeclare`.
- **Hudba (10h–10i):** `hudbacheck` v pořádku, `zvuk.js` všech 6 stylů běh −31 ±1,5 dB, menu −29,6 dB, `skladby.js` 11/30 skladeb VERDIKT v cíli (zbytek uživatel nechtěl doměřovat).
- **Server:** 0 otevřených nahlášení, 0 podvodů (`cheat_log`) a 0 chybných PINů za 2 dny, žádná viditelná závadná přezdívka. Exporty (`runs_export`, `feedback_export`, `feedback_done`) chrání `dev_key_ok` (klíč 32 znaků, kratší než 24 se odmítne). Za 24 h 12 běhů v telemetrii.

## Nálezy (podle priority)

### Střední
1. **Balanc – zeď na vstupu kapitol II a IV je slabá.** Boti s účtem „při vstupu“ vyhráli Poušť i Ledové jezero 2/2 (ostatní první mapy kapitol 1/2, Trůn 0/2). Jen 2 běhy na mapu – ověřit `node hraci.js kapitola:c2 3` a `kapitola:c4 3`, případně telemetrií (`fbread.js runs`, potřebuje `dev_key`).
2. **Tiché selhání uložení** (z minula, pořád otevřené): `persist()` chybu `localStorage` spolkne (`catch(e){}`), hráč offline / s plným úložištěm přijde o postup bez varování. Návrh: hláška + uvolnění mezipaměti pohlednic `pk-th-*` a nový pokus.
3. **Plynulost menu na pomalém telefonu** (známé, ne regrese – 10g měřeno stejně): CPU 4× zpomalené, menu v klidu ~38 fps, otevření Hrát / Hrdina jednou 200–270 ms. `audit.js plny` to hlásí jako ⚠. Ověřit na iPhonu, jestli je to znát.

### Nízká
4. **Server – výkon** (z minula): 5 RLS pravidel volá `auth.uid()` pro každý řádek (`auth_rls_initplan`), chybí indexy `feedback.uid` a `runs.uid`. Jednoduchá migrace, až bude víc hráčů.
5. **Server – `stats_clean` a `stats_entry_ok` nemají pevný `search_path`** (WARN). Jedna řádka migrace (`set search_path = public`).
6. **`storyShow`** (z minula): spadne, když `save.storyNew` není id mapy (jen poškozený save). Pojistka `if(!CH_OF[mp])return;`.
7. **Mrtvý kód:** 28 nepoužitých proměnných (`CHEST_ROWS`, `teleRing`, `EN_RATE`, `FEAT_BTN`, `CO_ABC`…); 3 duplicitní klíče v testovacím exportu `window.__krypta` (neškodné).
8. **Upozornění serveru, která jsou v pořádku:** SECURITY DEFINER funkce volatelné přihlášenými (záměr – `my_profile`, `save_profile`… kontrolují `auth.uid()`), RLS bez pravidel na `private.*` (záměr – nikdo zvenku), „leaked password protection“ (hra hesla nepoužívá).
9. Jeden hráč má pořád vynucené přejmenování (`rename_req`) – ještě nespustil hru, nic dělat.
10. `hudbacheck menu` varuje „málo pestrá: 0 taktů“ – menu nemá melodii (háček je basový riff), varování je očekávané.

## Kde si ulehčit práci
1. **Automatická kontrola na GitHubu** (z minula): GitHub Actions spustí po pushi `audit.js` a u commitu ukáže ✓/✗ – oba účty hned vidí, když druhý něco rozbil.
2. **Rozbor skladeb je pomalý** (~5 min na skladbu na 2 jádrech, 30 skladeb > 2 h): `skladby.js` renderovat s nižší vzorkovací frekvencí nebo jen klíčové úseky (klid, běh, boss), aby šel pustit celý.
3. **Náčrty hudby:** postup pro rychlé návrhy (dočasné `SONGS.skN`, render, MP3 se stejnou hlasitostí) je ve skillu `zvuk-a-hudba` – při dalších hudebních přáních začít rovnou náčrty k poslechu.
