# Audit projektu – 9. 11. 2026 (verze 09z3)

Opakovat: skill `.claude/skills/audit-projektu`, příkaz `node tests/tools/audit.js` (rychlý, ~2 min) nebo `node tests/tools/audit.js plny` (s boty a výkonem). Serverovou část kontroluje skill přes Supabase nástroje.

## Co prošlo
- **Hra běží bez chyb:** 18 obrazovek × nový i pokročilý účet × CZ/EN, všech 30 map 20 s + boss, běh do konce (nová úroveň, pauza, výsledky), 48 běhů hráčů-botů přes kapitoly I–VI – žádná chyba JS ani chybějící soubor.
- **Testy:** překlady, ukládání (verze, záloha, sync), kapitoly a hrdinové (`chapcheck all`), stejná denní/týdenní výzva, mechaniky po restartu, hlavní menu, runy, Souhvězdí, soukromí, Nástěnka, mosty kapitol, Nekonečná krypta, sety, úrovně hrdinů, popisky v režimech.
- **Bezpečnost klientu:** v repu nejsou tajné klíče, localStorage je všude v try/catch, service worker je „nejdřív síť“ (aktualizace dorazí hned).
- **Výkon:** těžký boj 61 fps (simulovaný telefon ×4), start do menu ~3,3 s (×4), ~0,7 s bez zpomalení.

## Nalezené chyby a rizika (podle priority)

### Vysoká
1. **Převzetí cizího účtu hádáním PINu** (server). `claim_profile(přezdívka, PIN)` nemá žádný limit pokusů. Přezdívky jsou vidět v žebříčku, PIN má 4 číslice → stačí ≤ 10 000 pokusů a útočník si přesune cizí profil (postup, výbavu) k sobě. Před vydáním a před prodejem truhel nutné opravit: tabulka pokusů + zámek (např. 5 chybných za hodinu na přezdívku), delší PIN.
2. **Ztlumení hudby při bossovi, smrti a ultimátce nikdy nefungovalo** – funkce `duckMusic` byla v kódu dvakrát s jinými parametry, platila ta druhá. ✅ **Opraveno v 09z3** (druhá přejmenovaná na `duckBeat`), ověřeno měřením hlasitosti (−10 dB a návrat). Audit teď duplicitní funkce hlídá.

### Střední
3. **Žebříček stahuje celé savy všech hráčů** (`select('id,nick,stats,save,hidden')`, až 300 řádků) – a přitom z nich čte jen profilový obrázek (`save.av`). Zároveň si kdokoli bez přihlášení může přečíst save kteréhokoli hráče. Oprava: `av` ukládat do `stats`, žebříček bez `save`, sloupec `save` číst jen vlastní (RPC), odebrat `SELECT(save)` pro `anon`.
4. **Výsledky v žebříčku si hráč zapisuje sám** (`stats` v `profiles`) → přes API jde podvádět. Pro kamarády OK, před vydáním aspoň kontrola věrohodnosti v triggeru (max. výhry/kombo za čas) nebo zápis jen přes RPC.
5. **iOS 26 rozmazává horní okraj stránky** – menu je opravené (lišta od `--sat + 30px`), ale HUD ve hře a hlavičky obrazovek (Příprava, Zpět) začínají těsně pod stavovým řádkem. Ověřit na iPhonu, případně posunout stejně.
6. **Plynulost menu v klidu klesla** po kovaných rámech 09z: na simulovaném pomalém telefonu 60 → ~53 fps (měřeno opakovaně po commitech; s obrázkovými rámy d25c926 bylo 61). Pravděpodobně plátna rámů pod animovanými prvky (jiskry, štítky NOVÉ). Na iPhonu ověřit; případná oprava: rámy jako obrázek v přesných pixelech displeje místo živého plátna.
7. **Tiché selhání uložení** – `persist()` při plném/zablokovaném úložišti chybu jen spolkne; hráč offline by přišel o postup bez varování. Přidat hlášku a pokus o uvolnění místa (mezipaměť pohlednic `pk-th-*`).

### Nízká
8. RLS pravidla volají `auth.uid()` pro každý řádek (5 pravidel) a chybí indexy `feedback.uid`, `runs.uid` – na výkon při větším počtu hráčů, jednoduchá migrace.
9. `lang-en.js` (222 kB, 85 kB zabalené) se načítá i českým hráčům – načítat jen pro EN.
10. 28 nepoužitých proměnných a funkcí (např. `CHEST_ROWS`, `teleRing`, `EN_RATE`, `FEAT_BTN`, `CO_ABC`) – mrtvý kód k úklidu.
11. `storyShow` spadne, když `save.storyNew` není id mapy (jen při poškozeném savu) – přidat pojistku.
12. **Balanc (boti, 1 běh na mapu):** první mapy kapitol III–VI (Doly, Jezero, Vrakoviště, Hvězdárna) vyhraje i Nováček na 100 % s účtem při vstupu – to je v rozporu s přáním „každá kapitola je zeď“. Ověřit víc běhy (`hraci.js kapitola:cN 3`) a telemetrií (`runs` má zatím 26 běhů).

## Kde si ulehčit práci
1. **Audit jedním příkazem** ✅ hotovo: `tests/tools/audit.js` + skill `audit-projektu`. Spouštět před každým větším nasazením.
2. **Společný základ testů** ✅ hotovo: `tests/tools/lib.js` (`prep()` připraví off.html a symlinky, `open({phone,lang,save})` dá iPhone s okraji, jazykem a účtem `fresh/mid/late`, chytá chyby JS i chybějící soubory, `SCREENS` = jak otevřít každou obrazovku). Nové testy psát nad ním – odpadne opisování 10 řádků přípravy a ruční `sed` na off.html.
3. **Úklid `tests/tools`** (141 souborů): skutečných testů je ~30, zbytek jsou jednorázové snímky starých verzí a makety. Návrh: přesunout do `tests/tools/archiv/`, sjednotit argumenty (všude `prefix`, ne jednou soubor, jednou složka). Zastaralé testy: `nmtest` (zasekne se o okno nové mechaniky), `pets` (mazlíčci jsou teď zamčení Cestou mechanik), `edgeback`, `chap`, `coopmaps` (jiné pořadí argumentů) – opravit přes `lib.js`.
4. **CLAUDE.md má 108 kB** a čte se při každém startu obou účtů: 13 předávek a 9 „Stav k…“, které si navzájem odporují („další krok: kapitola VI“ je dávno hotové). Návrh: CLAUDE.md jen pravidla + jak pracovat + aktuální stav (~15 kB), historie verzí do `docs/HISTORIE.md`.
5. **Automatická kontrola na GitHubu:** GitHub Actions může po každém pushi spustit `audit.js` a u commitu ukázat ✓/✗ – oba účty hned vidí, když druhý něco rozbil, i bez sandboxu.
6. **`index.html` má 1,1 MB v jednom souboru** – úpravy se dělají skripty, dva účty si snadno lezou do stejných řádků. Postupně oddělit: nejdřív CSS (124 kB, nejmenší riziko) do `style.css`, pak datové tabulky (mapy, nepřátelé, Novinky). Service worker už umí cachovat víc souborů.
7. **Migrace databáze** jsou rozházené v `supabase-*.sql` bez pořadí – číslované soubory v `supabase/migrations/` (co a kdy se na server pustilo).
8. **Číslování verzí:** po `09z` přišlo `09z2`, `09z3`. Další den začít `10a`; případně přejít na datum + písmeno bez závislosti na abecedě.
