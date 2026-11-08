# Testovací skripty (Playwright)

Spouštěj z adresáře, kde leží `off.html` = offline kopie hry:

    sed "s#url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'[^']*'#url:'',key:''#" index.html > tests/tools/off.html
    cd tests/tools && node shot.js hrbitov s.png

- `shot.js <mapa> <png>` – smoke test běhu (90 kroků, chyby, šířka dokumentu) + screenshot
- `ui.js` – obrazovky menu, hrdina, obchod, kovárna
- `dps.js` – DPS ultimátek vs. rodičů (balanc fúzí)
- `fuse.js`, `chance.js` – rituál fúze a šance nabídky
- `perf.js` – fps
- `econB.js` – Ekonomika 2.0: převod staré pozice, ceny, odměny (Úlomky, Esence), denní limity truhel, Přebroušení, Nekonečná krypta; `shotB.js` – screenshoty jejích obrazovek; `econsim.py [param=hodnota]` – dlouhodobá simulace (Python)
- `econ1.js`, `econ2.js` (stará ekonomika do 08a), `legs.js` – ekonomika, truhly, legendárky
- `heroesC.js` – Zbrojmistr (6 slotů na zbraň, druhá zbraň od úrovně 10) a Krotitel (dva mazlíčci, talenty) + screenshoty
- `shotA.js`, `scrollshot.js`, `mergeA.js` – screenshoty a test úprav UI z 8. 11. (Kovárna, kategorie, sloučení)
- `audio.js` – obnova zvuku po zamčení
- `chestanim.js`, `menushot.js`, `thumbs.js` – screenshoty animace truhly, menu, pohlednic map
- `qtest.js <mapa>`, `qover.js` – úkoly, hledaní, svíčky, konec běhu
- `i18n.js` (`static` = jen kontrola kódu), `en_shots.js` – anglická lokalizace (vedle `off.html` musí ležet kopie `lang-en.js`)
- `vfx.js`, `vfx2.js`, `vfxperf.js` – efekty a věže (screenshoty, detailní snímky, fps v těžkém boji)
- `guide_shots.js <prefix> [cs|en]` – screenshoty menu a všech záložek Průvodce
- `menu_mock.js <prefix>` – návrh nového menu (spodní lišta, Nastavení) vykreslený ve hře, zatím jen maketa
- `menu_mock2.js <prefix> [iphone]` – návrh 2 menu: původní tlačítka, jen 6 + horní lišta s ikonami (Novinky, Průvodce, Nastavení)
- `menu_shots.js <prefix> [cs|en] [iphone]` – hlavní menu, Nastavení, záložky Obchodu a Síně slávy
- `mines.js`, `desert.js`, `cart.js` – mapy a vozíky
- `mapview.js <mapa> <prefix> [x,y;…]` – celá mapa shora (`-over.png`) + snímky ve hře na zadaných místech
- `chap.js [mapy] [složka]` – každá mapa kampaně: běh, boss, chvíle boje (nesmrtelnost), chyby, snímek bosse
- `sprites.js <png> [id,…]` – zvětšené sprity nepřátel a bossů
- `camp.js <prefix> [cs|en]` – obrazovka kampaně v Přípravě (kapitola I a II)
- `thumbgen.js` – vyrenderuje pohlednice map do `thumbs/*.png` (po změně vzhledu mapy spusť a zvyš `MAP_ART`; pro testy `ln -s ../../thumbs tests/tools/thumbs`)
- `menuperf.js [zpomalení=4]` – plynulost menu: časy snímků při otevírání obrazovek se zpomaleným CPU jako na telefonu
- `fbtest.js <prefix> [cs|en]` – okno zpětné vazby (odeslání se stubem serveru, odměna 1× denně)
- `fbread.js [feedback|runs|done id,id] [dní] [all]` – **čtení zpětné vazby a telemetrie ze Supabase** (potřebuje `KRYPTA_DEV_KEY` a povolenou doménu Supabase v nastavení claude.ai)
- `coopmaps.js [mapy]` – co-op snímky (host s virtuálním kamarádem → guest) na nových mapách
- `pets.js [prefix]` – všech 8 mazlíčků v běhu (chyby, zásahy) + screenshoty obrazovky Mazlíčci, karty a truhel; `petshot.js` – detailní snímky mazlíčků v boji; `petbal.js`, `petbal2.js [sekund]` – podíl poškození mazlíčka (petbal2 po minutách)
- `bot.js [běhů] [hrdinové|all] [mapy|all] [nm] [novy|zkuseny|max]` – bot odehraje celé běhy a vypíše míru výher, medián času, příčiny smrti, úspěšnost zbraní a kdo dává poškození (60 běhů ≈ 30 s). Profil: `novy` = čerstvý účet, `zkuseny` = hrdina 10 + obchod napůl, `max` = hrdina 20 + obchod naplno (vždy bez výbavy). Řádky jsou ve stejném formátu jako telemetrie (`bot-results.json`). Bot je „průměrný hráč“ – věř hlavně **rozdílům** mezi hrdiny/mapami, ne absolutním číslům.

- **Výkon v boji (11/2026, verze 07v):**
  - `rast.js <file> [mapa] [ults=1]` – **hlavní měřítko**: deterministický čas snímku (update + render + rasterizace, CPU canvas jako Safari na iPhonu), nepřátelé umírají a doplňují se; env `N=snímků`, `PQ=0|1|2` (úroveň kvality), `PROF=30` (profil JS). Vypisuje i počet nových canvasů za snímek (= mrskání cache spritů).
  - `secTime.js <file> [mapa] [ults]` – čas po sekcích `render()` (mezi sekcemi flush, absolutní čísla jsou nafouknutá, ber jen poměry)
  - `callcount.js [mapa] [file]` – počet volání canvasu na snímek po sekcích
  - `heavy.js <file> [mapa] [zpomalení] [ults]` – fps ve skutečné smyčce rAF se zpomaleným CPU (v headless hodně šumí, kvůli SwiftShaderu)
  - `prof.js` – CPU profil těžkého boje; `shotcmp.js <file> <out.png> [mapa] [ults]`, `darkshot.js <file> <out.png> [mapa]` – snímky pro porovnání vzhledu před/po

Co-op testy jsou o úroveň výš (`tests/coop-test.js`, viz CLAUDE.md).
Starší skripty mohou mít natvrdo cestu `/home/claude/pixel-krypta` – uprav podle potřeby.
