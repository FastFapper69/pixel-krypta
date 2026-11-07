# Testovací skripty (Playwright)

Spouštěj z adresáře, kde leží `off.html` = offline kopie hry:

    sed "s#url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'[^']*'#url:'',key:''#" index.html > tests/tools/off.html
    cd tests/tools && node shot.js hrbitov s.png

- `shot.js <mapa> <png>` – smoke test běhu (90 kroků, chyby, šířka dokumentu) + screenshot
- `ui.js` – obrazovky menu, hrdina, obchod, kovárna
- `dps.js` – DPS ultimátek vs. rodičů (balanc fúzí)
- `fuse.js`, `chance.js` – rituál fúze a šance nabídky
- `perf.js` – fps
- `econ1.js`, `econ2.js`, `legs.js` – ekonomika, truhly, legendárky
- `audio.js` – obnova zvuku po zamčení
- `chestanim.js`, `menushot.js`, `thumbs.js` – screenshoty animace truhly, menu, pohlednic map
- `qtest.js <mapa>`, `qover.js` – úkoly, hledaní, svíčky, konec běhu
- `i18n.js` (`static` = jen kontrola kódu), `en_shots.js` – anglická lokalizace (vedle `off.html` musí ležet kopie `lang-en.js`)
- `vfx.js`, `vfx2.js`, `vfxperf.js` – efekty a věže (screenshoty, detailní snímky, fps v těžkém boji)
- `mines.js`, `desert.js`, `cart.js` – mapy a vozíky
- `bot.js [běhů] [hrdinové|all] [mapy|all] [nm] [novy|zkuseny|max]` – bot odehraje celé běhy a vypíše míru výher, medián času, příčiny smrti, úspěšnost zbraní a kdo dává poškození (60 běhů ≈ 30 s). Profil: `novy` = čerstvý účet, `zkuseny` = hrdina 10 + obchod napůl, `max` = hrdina 20 + obchod naplno (vždy bez výbavy). Řádky jsou ve stejném formátu jako telemetrie (`bot-results.json`). Bot je „průměrný hráč“ – věř hlavně **rozdílům** mezi hrdiny/mapami, ne absolutním číslům.

Co-op testy jsou o úroveň výš (`tests/coop-test.js`, viz CLAUDE.md).
Starší skripty mohou mít natvrdo cestu `/home/claude/pixel-krypta` – uprav podle potřeby.
