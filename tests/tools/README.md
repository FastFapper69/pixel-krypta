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
- `mines.js`, `desert.js`, `cart.js` – mapy a vozíky

Co-op testy jsou o úroveň výš (`tests/coop-test.js`, viz CLAUDE.md).
Starší skripty mohou mít natvrdo cestu `/home/claude/pixel-krypta` – uprav podle potřeby.
