# Testovací skripty (Playwright)

Spouštěj z adresáře, kde leží `off.html` = offline kopie hry:

    sed "s#url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'[^']*'#url:'',key:''#" index.html > tests/tools/off.html
    cd tests/tools && node shot.js hrbitov s.png

- `shot.js <mapa> <png>` – smoke test běhu (90 kroků, chyby, šířka dokumentu) + screenshot
- `ui.js` – obrazovky menu, hrdina, obchod, kovárna
- `dps.js ['[["ult",["a","b"]]]']` – DPS ultimátek vs. rodičů (balanc fúzí, bez argumentu původní 4); `fuse4.js <prefix>` – nové fúze 08k: nabídka z rodičů a snímky v boji
- `fuse.js`, `chance.js` – rituál fúze a šance nabídky
- `perf.js` – fps
- `econB.js` – Ekonomika 2.0: převod staré pozice, ceny, odměny (Úlomky, Esence), denní limity truhel, Přebroušení, Nekonečná krypta; `shotB.js` – screenshoty jejích obrazovek; `econsim.py [param=hodnota]` – dlouhodobá simulace (Python)
- `econ1.js`, `econ2.js` (stará ekonomika do 08a), `legs.js` – ekonomika, truhly, legendárky
- `mech4.js` – kapitola IV: led (klouzání), mráz v Tajze, laviny, zamrzání arény, Halapartna a Bič; `shot4.js <prefix>` – snímky těchto mechanik, zbraní a věží Ohniště a Rampouchová věž; `camp4.js <png>` – kampaň s kapitolou IV; `drop8e.js` – výbava z kampaně jen za první výhru na NM
- `tree.js <prefix>` – strom vylepšení: screenshoty (nový a pokročilý hráč, detail uzlu), nákup, účinky v běhu (zbraň úr. 2, štít, 4 karty)
- `norf.js <png>` – v detailu předmětu, karty věže a mazlíčka není tlačítko Přebroušení (zrušeno 08i)
- `coppets.js <prefix>` – mazlíčci v co-opu: host + virtuální kamarád (Krotitel s Dráčetem a Sovou), snímky → guest, screenshoty obou stran
- `winbg.js` – po výhře a „Znovu“ nezůstane běh na pozadí; `forgeB.js` – Kovárna se sekcemi, sloučení mazlíčků na hvězdu + vrácení; `endless2.js` – Nekonečná krypta: příchody a evoluce bosse, rekord, Esence; `endless3.js <prefix>` – Nekonečná krypta jen na finále (výběr v Přípravě, boss fight na všech 4 finále vč. fylaktérií); `shot8l.js <prefix>` – screenshoty 08l (novinky s highlights, okno hrdiny, dlaždice „nasazeno“, žebříček Kombo)
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

- `chapcheck.js cN|hero:id|all` – kontrola kapitoly/hrdiny (všechna místa, překlady, pohlednice, set, Průvodce) + přehledový obrázek `cN_check.png`.
- `kitdemo.js <prefix>` – zkouška stavebnice kapitol (3 zkušební mapy a boss jen v testu).
- `bossintroall.js <prefix>` – snímek intra všech bossů; `bossintro.js`, `bossintrogif.js`, `introaudio.js` – náhledy intra.
- `wgallery.js <prefix> [zbraně]` – každá zbraň zvlášť ve hře (env `N` nepřátel, `CLIP`).
- `hraci.js zed|kapitola:cN|mapa:id[:vstup|grind] [běhů] [povahy] [hrdinové]` – hráči-boti se 7 povahami a účty podle postupu (`UCTY`), tabulka výher, verdikt „zeď“, podezřele snadné strategie, co zabíjí. Nahrazuje `bot.js` pro balanc kapitol.
- `texshot.js <prefix> [cs|en] [obrazovky]` – snímky obrazovek menu (místnosti 09n), `SCROLL=1` i posunuté; `domdump.js [obrazovky]` – struktura DOM obrazovek
- `savekeys.js` – každý klíč save se načítá i synchronizuje; `featreload.js` – karta Cesta mechanik a runy/Souhvězdí/týdenní výzva po restartu
- `skyrs.js <prefix> [cs|en]` – Souhvězdí: tlačítko Vrátit body a okno potvrzení
- `menu_mock3.js <prefix> <base|A|B|C> [cs|en]` – makety vzhledu menu se skutečnými písmy (CSS v `mock/`), viz skill pixel-ui-art-direction
- `tabflash.js` – přepnutí záložek bez probliknutí; `treeshot.js` – strom Vylepšení s koupenými uzly
- `dailysame.js` – denní/týdenní výzva stejná při jiném FPS; `vols.js <prefix> [cs|en]` – posuvníky hlasitosti a otřesů; `savekeys.js` teď testuje i zálohu a verzi savu
- `tabswipe.js` – přejetí mezi záložkami + historie jen mimo iPhone aplikaci; `edgeback.js [snímek]` – tah zpět od okraje s menu pod obrazovkou; `rplabel.js [cs|en]` – štítky rarity na kartách věží (skutečné fitCards, nejdelší jména)
- `treesep.js <prefix> [cs|en]` – předěl Nové schopnosti ve stromu Vylepšení
- `chipshot.js <prefix> [cs|en]` – zvětšený výřez Arzenálu (všechny rarity, nejdelší jména) a mazlíčka; `heroprev.js <prefix> [cs|en]` – náhled zamčených hrdinů v Přípravě
- `fitrow.js W cs|en [snímek]` – Arzenál na šířce displeje W (nejdelší jména, všechny rarity), exit 1 při oříznutí
