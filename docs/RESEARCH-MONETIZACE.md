# Research: monetizace a game design mobilních her (11. 11. 2026)

Celý dokument se zdroji: https://claude.ai/artifact/D68r4PQdngBuZHR5oxbouT
Tady je jen výtah pro další chaty. Není to právní rada.

## Hlavní závěry
- Hybridní model (nákupy + reklamy za odměnu + battle pass) je standard. Akční hybrid-casual hry ~82 % příjmů z nákupů, ~18 % z reklam.
- Survivor.io (Habby) = skoro náš návrh: kapitoly, boss každých 5 min, Trials (= naše NM), výbava s raritami a slučováním. Přes 500 mil. $ z nákupů. Nejvíc se kupují levné startovní balíčky a nabídky po kapitole.
- Vampire Survivors mobil: jen dobrovolné reklamy (oživení, bonus zlata po běhu) + DLC. Férové, menší měřítko.
- Reklamy za odměnu nekazí retenci (A/B test Rovio). Čísla Tapjoy (4,5× víc nákupů) jsou jen korelace.
- Webové reklamy platí ~3,6 $ / 1000, v aplikaci 10–30 $ (tier 1). Reklamy až v aplikaci (Capacitor + AdMob + UMP).
- Retence: dobrá hra D1/D7/D30 ≈ 35/15/5 %, špička 40/20/10 %. Náš stav (11z4): 6 testerů, nikdo se nevrátil druhý den → priorita je retence, ne monetizace.

## Regulace (stav 11. 11. 2026)
- **EU Digital Fairness Act – návrh představen 10.–11. 11. 2026** (není zákon, účinnost nejdřív ~konec 2028):
  hry pro děti / hry, o kterých se ví, že je hrají děti: zákaz placených náhodných odměn, zákaz pay-to-win/pay-to-progress
  (vč. „umělých bariér obtížnosti“), placená měna vypnutá bez souhlasu rodiče. Ostatní: zveřejnit šance + vypínač.
  Všude: cena v reálné měně u herní měny; zákaz falešné vzácnosti, zahanbování za odmítnutí, předvybraných placených voleb.
- **PEGI od června 2026:** placené náhodné věci (i za koupenou měnu) = PEGI 16; placený pass / časově omezené nabídky = PEGI 12.
- **Brazílie ECA Digital od 17. 3. 2026:** lootboxy pro nezletilé zakázané (nebo verze bez nich / vypnuté ve výchozím stavu).
- Starší přehled: `PRAVNI.md`.

## Rozhodnutí k potvrzení uživatelem
- Zlato nikdy neprodávat za peníze → truhly za zlato zůstanou mimo „placené náhodné věci“. Za peníze jen kosmetika, Kryptová cesta (pass), přímý prodej konkrétních věcí.

## Plán (pořadí podle dopadu)
1. Délka běhu – 11z4 hotovo (boss do 300 s); dál zvážit elitní mezi-boss ve 2:30.
2. Metriky jako Slay the Spire: pick rate a win rate zbraní, fúzí, talentů, hrdinů z `runs`; D1/D7.
3. První minuta – 11z4 nový tutoriál; měřit dokončení 1. běhu a návrat do 2. relace.
4. Juice podle „The Art of Screenshake“ + okázalé otevření in-run truhly v rytmu.
5. Bossové si pamatují hráče (hláška podle výher/proher) – jako Hades, jednoduše.
6. Reklamy za odměnu (jen v aplikaci): oživení 1×/běh, ×2 odměna 1×/běh, denní truhla navíc, strop 6–8 denně. Žádné mezireklamy/bannery. Odměna z reklamy < nejlevnější nákup. Žádná reklama za náhodnou věc.
7. Kryptová cesta: 4 týdny, ~30 stupňů, free řada ze svíček, prémiová hlavně kosmetika, zpětný výběr odměn.
8. Kosmetika (vzhledy hrdinů, barvy pouta, efekty fúzí, rámečky profilovek), startovní balíček 1× za účet.
9. Vykování vybrané legendárky za Esenci (pevná cesta místo náhody).
10. U duplikátu ukázat „2/3 ke sloučení“.

Nedělat: prodávat zlato / sílu na překonání zdí / náhodné truhly za peníze, vynucené reklamy, energii, falešné odpočty.

## Knihovna
Knihy: Luton – Free-to-Play; Schell – The Art of Game Design; Schreiber & Romero – Game Balance; Swink – Game Feel;
Koster – A Theory of Fun; Hodent – The Gamer's Brain; Seufert – Freemium Economics; Sylvester – Designing Games; Derek Yu – Spelunky.
Přednášky: The Art of Screenshake (youtube AJdEqssNZ-U), Juice It or Lose It (youtube Fy0aCDmgnxg), Slay the Spire: Metrics Driven
Design and Balance (GDC 2019), Noclip dokument o Vampire Survivors, GDC Podcast ep. 16 (Kasavin, Hades).
Blogy: mobilefreetoplay.com (F2P Bible), deconstructoroffun.com, naavik.co, Brutally Honest (Lancaric), GameRefinery, GameAnalytics benchmarky.
