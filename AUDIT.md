# Audit projektu – 11. 11. 2026 (verze 11x)

Opakovat: skill `.claude/skills/audit-projektu`, příkaz `node tests/tools/audit.js` (rychlý, ~3 min) nebo `node tests/tools/audit.js plny` (s boty a výkonem). Serverovou část kontroluje skill přes Supabase nástroje. Předchozí audit (10. 11., 10i) je v historii gitu.

## Co prošlo
- **`audit.js plny` celý zelený** (na 11w i po čistce na 11x): 18 obrazovek × nový i pokročilý účet × CZ/EN, **50 map** 20 s + boss, konec běhu, pohlednice, 76 běhů botů (první mapa a finále všech 10 kapitol, vstup i grind), plynulost menu – žádná chyba JS ani chybějící soubor.
- **Testy:** překlady, ukládání, kapitoly a hrdinové (`chapcheck all`), denní výzva, mechaniky po restartu, menu, server (stub), horní okraj, pauza, oslava, úder ultimátky. Nový `ulozeni-plne.js` (plné úložiště).
- **Statické kontroly:** žádné duplicitní funkce, verze = první Novinka i `?v=` u souborů, žádné tajné klíče, fialová jen 4 tlumené v CSS, CLAUDE.md 40 kB → po čistce 32 kB.
- **ESLint:** žádné `no-undef` ani `no-redeclare`.
- **Server:** 0 otevřených nahlášení, 0 podvodů za 2 dny, 0 chybných PINů, žádná viditelná závadná přezdívka. Sloupec `save` v `profiles` nejde číst ani anonymně, ani přihlášeně (jen `id, nick, stats, hidden, updated_at`). Exporty chrání `dev_key`. Za 24 h 14 běhů, 2 zprávy ve `feedback` celkem, rychlá otázka po běhu zatím 0 odpovědí, 0 co-op běhů, 10 profilů.

## Opraveno v rámci čistky (11x)
1. **Tiché selhání uložení** (otevřené od 9. 11.): `persist()` při chybě `localStorage` smaže mezipaměť pohlednic `pk-th-*` a zkusí to znovu; když to pořád nejde, jednou za spuštění ukáže hlášku „Postup se neuložil – telefon je plný.“ Test `ulozeni-plne.js`, snímky CZ i EN zkontrolované.
2. **`storyShow`** (otevřené od 9. 11.): pojistka proti poškozenému `save.storyNew`.
3. **Mrtvý kód:** pryč `CHEST_ROWS`, `ROMAN_NM`, `MAX_LV`, `twMat`, `teleRing`, `money`, `EN_RATE`, `FEAT_BTN`, `CO_ABC`, `sharp` a 12 nepoužitých lokálních proměnných; 3 duplicitní klíče v `window.__krypta` (`renderSelect`, `openChestShop`, `MAPS`). Palety `C9P`, `C9R`, `C10L` zůstávají (popsané v `KAMPAN.md`, hodí se pro další mapy).
4. **Soubory navíc v repu:** smazané `tests/tools/off2.html` (1 MB stará kopie hry), `net3_g.png`, `net3_h.png` (1,3 MB snímky z co-op testu v kořeni webu); `coop-test.js` teď fotí do `/tmp`, obojí v `.gitignore`.
5. Popisky: audit a `hraci.js zed` tvrdily „kapitoly I–VI“, boti ale hrají všech 10 kapitol. `docs/KOD.md` ukazoval na smazané `CHEST_ROWS`.

## Nálezy (podle priority)

### Střední
1. **Server – výkon (z minula, roste s hráči):** 6 RLS pravidel volá `auth.uid()` pro každý řádek (`auth_rls_initplan`: profiles ×2, feedback, runs, reports, coop_runs), chybí indexy `feedback.uid` a `runs.uid`. **Vyřešeno** migrací `20261111c_audit_vykon.sql` (spuštěná 11. 11. po souhlasu, ověřená nanečisto: vlastní zápis projde, cizí ne, denní limit zpráv funguje).
2. ~~CLAUDE.md 40 kB~~ – vyřešeno v čistce: předávky z 10. 11. přesunuté do `docs/HISTORIE.md`, v CLAUDE.md zůstala platná rozhodnutí (teď ~32 kB).

### Nízká
3. **Server – `stats_clean` a `stats_entry_ok` bez pevného `search_path`** (WARN, z minula). **Vyřešeno** stejnou migrací.
4. **`feedback_limit()`** je triggerová funkce, ale jde volat přes `/rpc` (anon i přihlášení). Zavolání samo selže, škodu neudělá; **vyřešeno** stejnou migrací (`revoke execute`).
5. **Zbylých 20 nepoužitých lokálních proměnných** uvnitř dlouhých řádků kreslení a mechanik – neškodné, nechávám (riziko úpravy > přínos).
6. **Upozornění serveru, která jsou v pořádku:** SECURITY DEFINER funkce volatelné hráči (záměr, kontrolují `auth.uid()`/klíč), `coop_board` pro anon (veřejný žebříček), RLS bez pravidel na `private.*` (nikdo zvenku), anonymní přihlášení u `profiles` (hra jinak nefunguje), „leaked password protection“ (hra hesla nepoužívá).
7. Jeden hráč má pořád vynucené přejmenování (`rename_req`) – ještě nespustil hru.
8. Plynulost menu na pomalém telefonu (z minula) – audit už ji hlásí jako ✓.

## Kde si ulehčit práci
1. **Automatická kontrola na GitHubu** (z minula): GitHub Actions pustí po pushi `audit.js` a u commitu ukáže ✓/✗ – při dvou souběžných chatech by hned bylo vidět, kdo co rozbil.
2. **`newsshot.js`** potřebuje verzi o jednu *starší*, než je nová Novinka (`save.newsSeen`); s aktuální verzí nic neotevře. Stálo by za to, aby bez třetího parametru vzal předposlední položku `NEWS` sám.
3. **ESLint do `audit.js`** (dnes ruční krok skillu, ~1 min): hlídat aspoň `no-undef` a `no-redeclare`.
