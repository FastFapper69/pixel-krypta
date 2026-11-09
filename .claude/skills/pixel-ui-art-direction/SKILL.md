---
name: pixel-ui-art-direction
description: Art direction for Pixel Krypta menus and UI – how to make screens look hand-made for a crypt-themed pixel game and not like generic "AI slop". Use before designing or restyling any menu, button, panel, palette or font.
---

# Pixel Krypta – art direction UI

Testeři (11/2026): menu „vypadá jako AI slop“ kvůli **stejným fialovým obdélníkovým tlačítkům** a **výchozí tmavě fialové barvě**. Tenhle skill shrnuje, jak se tomu vyhnout.

## Proč UI vypadá generovaně (vyhýbej se)
- Jedna barva panelu (#211a30 fialová) na všem, stejný rámeček a stín na všech tlačítkách, mřížka stejně velkých tlačítek.
- Nápisy VELKÝMI PÍSMENY s prostrkáním, štítek nad každou sekcí, `A · B · C` řetězce, šipka → v tlačítku.
- Technické/sci-fi písmo (Chakra Petch) u fantasy krypty – písmo nesedí k světu.
- Efekty všude (záře, pulzy, gradienty) bez důvodu. Jedna výrazná věc na obrazovku stačí.

## Principy
1. **UI je součást světa.** Každá obrazovka je místo v kryptě (09n: zbrojnice, stánek, výheň, pamětní síň). Materiály: kámen, dřevo, železo, pergamen, vosk, svíčky, kost, samet. Žádné ploché „panely“.
2. **Barva má roli, ne náladu.** Neutrální podklad (kámen/saze), jedna primární akce (svíčkové zlato), vzácný akcent (krvavě červená jen pro upozornění), rarity zůstávají (šedá/zelená/modrá/fialová/zlatá). Fialová jen pro Epické a kouzla, ne pro podklad.
3. **Jedno hlavní tlačítko na obrazovku** s výrazně větší vahou (Hrát, Vyrazit). Ostatní tišší. Tlačítko má okraj, hloubku (spodní stín 4–5 px), stisk (posun o 2 px), čitelný popisek se slovesem.
4. **Nezakázaná tlačítka bez vysvětlení.** Místo šedého disabled ukaž proč (zámek + „Odemkneš výhrou na …“).
5. **Písmo nese osobnost.** Max 2–3 rodiny: nadpis (charakter), UI popisky (pixelové, čitelné), drobný text (čitelné, ne pixelové). Věty malými písmeny (sentence case), ne VERZÁLKY.
6. **Efektový rozpočet.** Rutinní akce klidné, velké chvíle (legendárka, boss, nová mechanika) dostanou záblesk, třes, zvuk. Viz Balatro: tři úrovně barev – neutrál, aktivní, výjimečné.
7. **Po každé vizuální změně zvětšený snímek (deviceScaleFactor 3, výřez dané části) a opravdu ho prohlédnout**: zarovnání na střed, oříznutý text, zdvojený text/stín, stejné velikosti v řadě, CZ i EN, nejdelší texty. Měření „vejde se“ nestačí – uživatel to opakovaně vytýká.
8. **Kontrola na snímku vždy se skutečnými písmy** (iPhone 393×852). Sandbox nestáhne Google Fonts – bez nich snímky lžou.


## Poučení z 09z (uživatel: „už je nedělej“) – povinné před nasazením menu
1. **`node tests/tools/menucheck.js` musí projít** (5 velikostí iPhonu, CZ/EN, nový i rozehraný účet). Hlídá materiály v liště, překryté nebo nevejité popisky, holý text v tlačítku, přetékání, polohu lišty pod rozmazáním iOS a rámy na celém pixelu. Neprošlo → nenasazovat.
2. Každý snímek projít **celý**, ne jen místo, které jsem měnil. Materiály i nápis Souhvězdí byly rozbité na mých vlastních snímcích a přehlédl jsem je.
3. Snímky dělat i **se skutečnými okraji** daného telefonu (SE: nahoře 20, dole 0), ne vždy s okraji velkého iPhonu.
4. Sandbox je Chromium, ne Safari. Cokoli s vrstvami, rozmazáním, `isolation`, `z-index:-1`, `filter` nebo zlomky pixelu na iPhonu může vypadat jinak – raději se tomu vyhnout. Když uživatel pošle screenshot s chybou, **nejdřív si ho zvětšit a změřit** (profil hrany), teprve pak hádat příčinu.
5. iOS 26 kreslí u horního okraje vlastní rozmazání – nic důležitého do `--sat + 30px`.
6. Po přidání plátna nebo překryvu do prvku zkontrolovat, jestli kód neměří `scrollWidth`/`clientWidth` téhož prvku (materiály zmizely přesně takhle).

## Písma (ověřeno s českou diakritikou, 9. 11. 2026)
- **Jacquard 12** – gotické pixelové, krásné na nadpisy a logo („Pixel Krypta“ malými písmeny, verzálky jsou nečitelné). Jen velké velikosti (≥32 px).
- **Jersey 10** – tlusté herní pixelové, čitelné od ~20 px, dobré na tlačítka a nadpisy sekcí.
- **Pixelify Sans** – v drobném textu splývají číslice (25 % vypadá jako 88 %), jen na nadpisy.
- **Silkscreen** chybí část české diakritiky, **Micro 5** moc malé → nepoužívat.
- Drobný text (popisy, čísla v kartách) nech v čitelném nepixelovém písmu.
- Lokálně pro testy: `cd ~/fonts && npm i @fontsource/<font>`; ve hře ideálně písma self-hostovat (`fonts/*.woff2`), funguje i offline a v Instagram prohlížeči.

## Nástroje
- `tests/tools/menu_mock3.js <prefix> <base|A|B|C> [cs|en]` – maketa vzhledu (CSS z `tests/tools/mock/menuX.css` + `menuX.js`) se skutečnými písmy, env `SCR=select,chests,hero,quests`.
- `tests/tools/texshot.js` – snímky obrazovek místností.
- Textury: `qTexInit` v `index.html` (`--tx-paper, cork, wood, stone, wall, dwood, iron, bronze, velvet, blue, wicker, cloth`), nové kresli přes `pxTex`.

## Postup pro nový vzhled
1. 2–3 opravdu odlišné směry (moodboard), maketa jedné klíčové obrazovky v každém.
2. Uživatel vybere, často kombinaci.
3. Aplikovat na menu, hlavičku, Přípravu, malá okna a výsledky běhu; snímky CZ i EN; `menuperf.js` kvůli plynulosti.

Zdroje: indieklem „Better-designed buttons“, Mighty Bear „How to find a UI theme“, daisyUI „How to make AI UI less generic“, rozbor art direction Balatro.
