# Pixel Krypta – kampaň a kapitoly

Stav: **kapitoly I–V hotové (III od 2026-11-07y, IV od 2026-11-08e, V od 2026-11-08o)**. Kapitola VI hotová (hrdinka Astra, dřív Hvězdářka). **Kapitola VII Prázdnota hotová (11h, hrdinka Nyx).** **Kapitola VIII Úsvit hotová (11l, hrdinka Réva).** **Kapitola IX Zlatá říše hotová (11n, bez hrdiny, mazlíček Straka).** **Kapitola X Korunované slunce hotová (11p, finále aktu I, Paladin zdarma za Aurela).** **Žádná kapitola nepřidává nový materiál** (jen Úlomky a Esence).
Návrh pro uživatele je i v dokumentu „Pixel Krypta – kampaň a kapitoly“ (Claude Docs).

## Stavebnice kapitol (08y) – nové kapitoly dělej takhle
Postup a kontrolní seznam: skill `.claude/skills/nova-kapitola/SKILL.md` (hrdina: `novy-hrdina`). Kód: oddíl **chapter kit (08y)** v `index.html`.
- Mapa `style:'kit'` + `kit:{…}` → `buildKit` (palety, rozvržení paths/plaza/arena/open, rekvizity `KIT_PROPS`, zóna, tábor) a `MF.kit` s mechanikami `KIT_MECH` (`slow`, `strike`, `push`, `pull`; nové přidávat sem).
- Boss `pat:'kit'` + `kit:{move, moves, ph2, own}` → `BEH.kit` (tahy na doby/takty, 2. fáze, vlastní útok `KIT_OWN`). Čísla `kitBoss(ci,mi,fin)`, nepřátelé `kitFoe(ci,role)`.
- Hudba `songKit({…, motif})` z ručně psaného motivu. Obtížnost: mapa bez řádku v `MAP_TIER` dostane `kitTier` (schodiště 08p).
- Kontrola `tests/tools/chapcheck.js cN|hero:id|all` (chyby + přehledový obrázek), zkouška dílů `kitdemo.js`.

## Systém
- `CHAPTERS` = kapitoly: `{id, name, mat, col, maps:[5 map], soon?}`. `MAP_IDS` se skládá z kapitol, `CH_OF[mapa]` = kapitola, `MAT_OF` se odvozuje z kapitoly (žádné nové materiály).
- Kapitola I Říše mrtvých (Kostní prach): hrbitov, bazina, kostnice, zvonice, **trun** (finále).
  Kapitola II Písečná říše (Jantar): poust, kanon, karavana, hrobka, **brana** (finále). Kapitola III Hlubiny (Magmatit): doly, kovarna, reka, krystaly, **srdce** (finále).
- Odemykání `mapUnlocked`: další mapa v kapitole po výhře na předchozí, první mapa kapitoly po finále předchozí. Staré savy: `chMigrate` jednou zapíše `save.unl` (poušť/doly podle starých pravidel), příznak `save.ch`. Cloud save bez `ch` migraci spustí znovu.
- Obtížnost mapy `MAP_TIER[mapa]=[HP ×, spawn navíc, zlato za výhru]` → `map.hpm/spx/gb` (nahradilo `run.idx`).
- Finále (`map.finale`): materiál ×2, boss 40 místo 15, první výhra zlatá truhla (`save.fin`), od NM III 25 % na legendárku kapitoly (`FIN_LEG`: trun → `skull` Morvanova lebka, brana → `sphinx` Oko Sfingy; `LEGS[..].fin` = nepadají z truhel).
- Vylepšení předmětů +1 až +4 stojí Kostní prach (`ECON.upCost`), `upInvest` vrací `m` po materiálech.
- Hledaní jsou podle kapitoly (`WANT_OF` pro každou mapu, objeví se na kterékoli mapě kapitoly).
- Mistrovství `maps` = Přemožitel Morvana (trun), `sphinx` = Luštitel hádanek (brana).

## Obrazovka kampaně (Příprava)
`renderCampaign`: přepínač kapitol (‹ ›), stezka 5 karet map (`.mnode`, finále `.fin`), popis jen u vybrané mapy.
Pohlednice jsou statické soubory `thumbs/<mapa>.png` (generuje `tests/tools/thumbgen.js`, verze `MAP_ART` v URL – **po změně vzhledu mapy přegenerovat a zvýšit `MAP_ART`**). Jen když soubor chybí (offline kopie), vyrenderuje se ve hře (`thumbQueue`) a uloží do `localStorage`. `startRun` uvolní plátna ostatních map.
Pozadí menu (`menuBg`) nikdy nestaví mapu kvůli výběru: ukazuje už postavenou mapu (`MB.id` = poslední hraná `save.lastMap`, postavená jednou při startu). Stavba mapy trvá na telefonu 1–2 s a sekala menu.
Žebříček: záložky Celkem / Dnes / Mapy + vodorovný výběr mapy po kapitolách (`#boardMaps`).

## Rámec map (MF)
`MF[styl]` = háčky, volá je `mfCall(k,…)`: `init` (start, i guest), `update` (host), `gupdate` (guest), `move(p)` (lokální hrdina), `psp(p)`/`espd(e)` (rychlost), `dmgMul(e)`, `pl(p)` (efekty na hrdinu), `boss(e)`, `ground/top/over` (kreslení), `units(list)` (y-řazené objekty s `mfDraw`), `lights(L)`/`glows(GL)`, `snap()`/`apply(o)` (co-op, pole `mf` ve snímku).
Generátory `MAP_BUILD[styl]`; společné pomocníky `paintGround`, `pathMask`, `curvePath`, `wander`, `samplePath`, `artSprite` (malování + obrys), `shadeMask`, `borderWall`, `fogPuff`.

| Mapa | Styl | Mechanika |
|---|---|---|
| bazina Utopené hroby | swamp | voda (`built.wet`: 1 voda, 2 chodník) zpomaluje hrdinu ×0,66 a nepřátele ×0,7 (ne utopence), vlnky, mlha, bludičky (`ambient:'wisp'`) |
| kostnice Kostnice | crypt | tma 0,86, pochodně (`run.torches`) se zapálí dotykem, ve světle +25 % poškození, Strážce je zhasíná |
| zvonice Zvonice | village | zvony bijí každé 2 takty, hrdina v kruhu (`BELL_R`) vyšle rázovou vlnu |
| trun Trůn kostí | throne | 3 fylaktérie (`phyl`) chrání Morvana (`e.shield`), pod 50 % se aréna zužuje (`run.arena`) |
| kanon Kaňon větrů | canyon | písečná bouře každých 55 s na 12 s tlačí hrdinu i nepřátele, závětří za skalami (`built.shelters`) |
| karavana Karavanní stezka | caravan | `run.crystal` = velbloud na trase (`routePos`), jde jen když je hrdina do 70, u něj se léčí, půlka nepřátel jde na hrdinu |
| hrobka Hrobka faraona | tomb | pasti 3×3 (`built.traps`) vyjedou na první dobu taktu, varování na 4. dobu |
| kovarna Kovárny trpaslíků | deep (`deep:'forge'`) | bez zvláštní mechaniky: dlaždice, výhně (`furnace`), kovadliny, kaluže lávy |
| reka Podzemní řeka | deep (`river`) | řeka `built.wet` (1 voda zpomaluje ×0,62 / nepřátelé ×0,7, letci ne; 2 = 3 kamenné mosty), svítící houby |
| krystaly Krystalové jeskyně | deep (`crystal`) | bez zvláštní mechaniky: tma 0,8, světlo dávají jen krystaly (`cluster*`, velké) |
| srdce Srdce hory | deep (`core`) | finále: magmové srdce (`built.heart`, láva), **erupce** `run.erupt` (`eruptUpdate`): od 45 s každý druhý takt (pod 50 % titána každý) varovné kruhy u hrdinů, za 1 takt bouchnou (16 × NM, zraní i nepřátele) a nechají magma |
| brana Brána slunce | sun | rotující paprsek (`run.beam`, dosah `SUN_L`), stín obelisků (`run.obs`), Sfinga je potápí a ve 3. fázi jsou paprsky dva |

Nepřátelé kapitoly III: imp Ohnivý skřet (rychlý letec), magslime Magmový sliz (po smrti `fx magma` = pálí 3/0,45 s), miner Duch horníka (střílí). Bossové: forgelord Mistr výhně (`forge`), eel Jeskynní úhoř (`worm` s `puff`), colossus Krystalový kolos (`colossus`), titan Magmový titán (`titan`, finále). Generátor `buildDeep` + háčky `MF.deep`, sprity `DP_PROPS`. Set kapitoly `forge` (2 kusy: poškození +10 %, brnění +1; 4 kusy `lg.sf4` = `anvilStrike` každý 2. takt), legendárka `mheart` (finále srdce, výbuch lávy při zásahu). Věže `forge` Výheň (kovarna) a `ram` Parní beran (krystaly). Kovářka (`HEROES.smith.need:'doly'`) se kupuje za 1500 po odemčení kapitoly III.
Nepřátelé: drowned (louže po smrti), bonearcher, digger (vykopává kostlivce), scorp (jed `p.psn`), mummy (zpomalení `p.slw`), cultist (vějíř nožů, `ranged3`), phyl (statická). Chování v `BEH`, bossové priest, warden, ringer, morvan, scorpking, worm, priestess (kletba `run.curse` obrací ovládání), sphinx.
Hudba: každá mapa vlastní skladba v `SONGS` (styl kapitoly), zvuky `bell`, `trap`, `wind`.

## Obtížnost podle síly hráče (11i, 11. 11. 2026) – PLATÍ
Zadání uživatele: obtížnost map má růst stejně jako síla hráče (všechna vylepšení hrdiny), nové kapitoly se tím mají řídit samy.
- **Účet typického hráče** pro každou kapitolu a mapu: `tests/tools/ucty.js` (úroveň hrdiny, Prestiž, talenty 25–40, Vylepšení, strom, výbava, sety, runy, Souhvězdí, mazlíček, věže a **odemčené funkce** podle vyhraných map). Během kapitoly hráč sílí (kapitola I z nuly ~1,5 úrovně na mapu, jinak ~0,6). Kapitoly za tabulkou se dopočítají.
- **Síla** `tests/tools/sila.js`: útok U a výdrž V přímo z `st` po `recalc` (vše, co hra počítá). Mazlíčci, věže, legendárky a 4kusové sety jsou jen v botech.
- **Cílová úspěšnost** průměrného hráče (5 povah z `hraci.js`) s účtem, se kterým na mapu přijde: `DIFF_CIL` v game.js = `CIL` v `ladeni.js`. Kapitola I vítá (Hřbitov 70 → Zvonice 45 %, Trůn 25 %), běžná kapitola 40 % −3 na mapu a finále 20 %, **každá 3. kapitola zeď** (III, VI, IX: 25 %, finále 12 %). Po grindu Nočních můr má být výrazně víc.
- **Ladění** `node tests/tools/ladeni.js <cN|vse|mapa,…> [kola] [běhů]`: změří výhry, posune `hpm` podle logistického modelu (sklon b ≈ 2,7 = HP ×1,45 ubere 1 logit), `dmm` s odmocninou; `ladeni.js zapis` → `MAP_TIER`. 11i: 3 kola × 30 map × 20 běhů, výsledné hodnoty proložené ze všech kol společným sklonem.
- **Nová kapitola** bez řádků v `MAP_TIER`: `kitTier` = poslední dvě vyladěné kapitoly přepočtené přes růst síly (`PWR.u/v`) a cílovou křivku, děleno vlastními nepřáteli mapy. `node tests/tools/krivka.js` ukáže index každé mapy, `krivka.js zapis` přepočítá `PWR`. Postup ve skillu `nova-kapitola` („Čísla“), `chapcheck.js` hlásí mapy ze vzorce.
- **Poučení:** samotný poměr HP nepřátel / útok hráče obtížnost nepředpoví (vyladěné mapy se liší až 3×, rozhodují mechaniky, střelci, rychlost). Vzorec je jen start, rozhodují boti. Maják a Vír na HP skoro nereagují (vyladěno na ×15–17), Mlhovina a Souhvězdí jdou vykitovat (×12–15): spravit by je měla mechanika, ne čísla.
- **Předtím (do 11h)** měli boti v `hraci.js` vypnuté fúze, talenty, mazlíčky, runy i Souhvězdí (prázdný `save.feat`), takže starší čísla (10d, 10j) platila pro slabšího hráče. Stav před 11i (vstup): I 0–30 % (Trůn 0), II 0–65 %, V a VI 55–85 % (moc lehké).
- **Výsledek 11i** (ověření 25 nových běhů na mapu, vstup): I 28–60 %, II 32–48 %, III 8–32 %, IV 24–28 %, V 32–44 %, VI 8–28 %, VII 20–50 % (předtím I 0–30 %, V a VI až 85 %). Po grindu: I–V 60–100 %, VI 20–53 % (zeď i po grindu). Kapitola VII měla s hodnotami z 11h 70–90 % (laděná boty bez fúzí a talentů), teď 40/50/30/35/20 %.
- **Hrdinové** (`tests/tools/herostat.js`, 11 hrdinů × 3 povahy, kapitoly III a IV, 60 běhů na hrdinu): o výsledku rozhoduje hlavně styl (Opatrný vyhrává s každým), hrdinové v rozmezí ±15 bodů: Rytíř, Kovářka a Bard nahoře, Astra a Stavitel dole. 11i: Hvězdy +25 %, Kotva +12 %, Stavitel +25 zdraví (bylo 15), Krápníky −12 % (v davu nejsilnější zbraň).

## Rozbor „drž odstup“ (11. 11. dopoledne, data `tests/tools/data/11j/`)
Měřeno `hraci.js` s variantami povah (`POVX`, `safeSet`; výsledek nově ukládá `vAvg` = průměrná rychlost a `ndAvg` = vzdálenost nejbližšího nepřítele), účet při vstupu, kapitoly III–V, 8 běhů na buňku.
- **Hrdina nerozhoduje:** Opatrný mág vyhrává stejně jako Opatrný lučištník (75–100 %).
- **Rozhodují dvě věci najednou:** obranné karty (Srdce, Štít, Regenerace) a odstup. Stejný pohyb s běžnými kartami 0–100 % (průměr ~50), Agresor s odstupem 0–88 %, Agresor s obrannými kartami 0–50 %. Z karet nejvíc Regenerace (bez ní doly 88 → 0 %), Srdce a Štít málo.
- **Není to útěk, ale uhýbání:** bot jede průměrně polovinou rychlosti (vAvg ~30 z 58) a drží nejbližšího nepřítele 35–50 px (ostatní 22–35). Proto nepomohlo ani rodit nepřátele před běžícím hrdinou, ani vracet opozdilce na okraj obrazovky (větev `balanc-odstup`, Opatrný dál 88–100 %).
- **Ostatní povahy lezou do nepřátel** (`keep` < 1, `approach` až 1) a na vstupu do III umírají za 1–2 min. Průměr 5 povah (`DIFF_CIL`) je tak průměr dvou světů: Opatrný a Expert ~100 %, ostatní 0–20 %.
- HP mapy (`hpm`) ani poškození (`dmm`) uhýbajícího hráče skoro nezmění (nemusí zabíjet, nedostává zásahy), boss má HP nezávislé na `MAP_TIER`.

## Balanc (bot, 2026-11-07g) – historie, čísla neplatí
Profil `zkuseny` (hrdina 10): hřbitov 93 %, kapitola I 87–93 %, Trůn kostí 62 %; poušť ~43 %, kaňon ~50 %, karavana ~66 %, hrobka ~50 %, Brána slunce ~29 %.
Profil `novy`: hřbitov 83 %, bažina 50 %, zvonice 16 %, Trůn 0 % (postup vyžaduje úrovně hrdiny). Bot je průměrný hráč, ladit podle telemetrie (`runs`).

## Kapitola IV Ledová říše (08e)
Generátor `buildIce` (`def.ice` = lake | fort | taiga | gorge | throne) + háčky `MF.ice`, sprity `ICE_PROPS`/`icSprite`, ambient `snow`, hudební styl `STYLES.frost` (zvonkohra, celesta).
| Mapa | Mechanika |
|---|---|
| jezero Zamrzlé jezero | led `built.ice` (`iceAt`): hrdina má setrvačnost (`MF.ice.move`, `p.ivx/ivy`), nepřátelé na ledu ×0,84; boss `serpent` (= `worm`) |
| pevnost Ledová pevnost | bez mechaniky: nádvoří s dlaždicemi, ledové zdi, sochy, modré pánve; boss `fknight` (výpad + kruh, volá přízraky) |
| tajga Tajga | mráz `p.cold` 0→1 za 38 s mimo oheň (`built.fires`, věž Ohniště), zpomalí až o 35 %, na maximu 3 dmg/s; ukazatel nad hrdinou, modré okraje; boss `wendigo` (rychlé výpady, vlci) |
| soutezka Lavinová soutěska | laviny `run.aval` (`avalUpdate`): od 40 s každý 3. takt pruh u hrdiny, za takt sjede (18 × NM, odhodí, nepřátelé 90 dmg); `run.qc.aval`; boss `yetiking` |
| zima Trůn zimy | finále, polární záře; královna `queen` pod 50 % volá `mfCall('freeze')` → `run.frz2`, `frostUpdate`: každé 3 takty 2 takty varování, bezpečné jsou 3 zářící runy z 6 (`built.runes`), jinak 24 × NM + zpomalení |
Nepřátelé: `yeti` (sněhové koule `eshots` se `snow`/`slw`), `wraith` (ghost, dotek zpomalí), `snowman` (`die:'snow'` = kruh střepů). Věže `hearth` Ohniště (pálí okolí, zahřívá, p5 léčí; odemkne pevnost) a `icelance` Rampouchová věž (průrazné kopí, zpomalí, p5 zmrazí; odemkne soutezka). Set `frost` (2 = zdraví +10 % a zásahy zpomalí `lg.sfr2`, 4 = mrazivá vlna na 1. dobu každého 2. taktu `lg.sfr4`), legendárka `wheart` (zima). Hledaný `bigfoot`. Šamanka mrazu `need:'jezero'`, 1500 zlata. Mistrovství `queen`. Testy `tests/tools/mech4.js`, `shot4.js`, `c3shots.js <prefix> jezero,…`.

## Kapitola V Prokleté pobřeží (08o)
Generátor `buildCoast` (`def.coast` = wreck | port | light | vortex | deck) + háčky `MF.coast`, sprity `CO_PROPS`/`coSprite`, vrak lodi `wreckSprite(seed,W)` (artSprite), domy přístavu přes `makeHouse` ze Zvonice, déšť `ambient:'rain'`, hudební styl `STYLES.sea` (shanty: oom-pah bas, tlesk na 2 a 4, akordeon na offbeatech), stupnice `dorian`.
| Mapa | Mechanika |
|---|---|
| vrakoviste Vrakoviště | příliv `tideK()` (perioda `TIDE_T`=44 s, výška `TIDE_H`=170): voda nad `floodY` zpomalí hrdinu ×0,62, nepřátele ×0,72 (ne `wet`, `fly`, `wave`, `ghost`, bossy); boss `crabking` (výpady + vějíř bublin, kraby) |
| pristav Pirátský přístav | bez mechaniky: mola, kotvící loď, nábřeží s děly, řada skladů, uličky z prken, městečko; boss `captain` (salvy dělových koulí, piráti) |
| majak Mlžný maják | tma 0,8, mlha, paprsek majáku (`coBeam`, `BEAM_L`=380, otočka 0,75 rad/s): světla podél paprsku, nepřátelé v něm +25 % poškození; boss `seawitch` (mizí a objeví se u hrdiny, kruhy bublin, medúzy) |
| vir Oko víru | vír `built.vc` (posunutý o `VORTEX_DY` na sever od startu): tah hrdiny do 260 od středu až 26/s (na 1. dobu ×1,4, hrdina má 58), nepřátel až 44/s, střed `VCORE`=46 zraňuje (hrdina tick, nepřátelé 12+t/20 každých 0,3 s); boss `seasnake` (krouží, vějíře, každý 4. takt výpad) |
| paluba Paluba v bouři | finále, loď na výšku (`DECK_W`/`DECK_H`, příď `BOW`, záď `STERN`), hráči i nepřátelé zavření na palubě; náklon `coTilt()` (sin přes 2 takty) posouvá vše do stran 26/s (bouře 40); Kraken `kraken` stojí ve vodě u boku (`e.side`), každý 8. takt přeplave; chapadla `run.tent` (`tentUpdate`): vodorovný pruh u hrdiny z Krakenovy strany, za takt udeří (12 × NM); pod 50 % `mfCall('storm')` → `run.storm`: chapadla každý takt a lámou palubu (`run.holes`: zpomalí ×0,5 a zraňují) |
**10j – schody a zeď (přání uživatele 10. 11.: „vždy schod a někde zeď“, boti `hraci.js`, 4–5 běhů × 5 středních povah, ~1 700 běhů):** pravidlo měření: **se stejným účtem** (`UCET=n node hraci.js mapa:X:vstup`) musí být první mapa kapitoly těžší než poslední běžná mapa předchozí kapitoly (finále s bossem je špička navíc). Zeď = kapitola III Hlubiny. `MAP_TIER` II 1,45–1,75 HP / `dmm` 1,22–1,3; III 3,1–4 / 1,7–1,9; IV 3,9–5,8 / 1,75–2,2; V 6,4–7 / 2–2,15; VI beze změny (kit základ 3,85; její paprsky a střepy rostou s `hpm` přes `hazDm`, vyšší základ ji udělal neporazitelnou i po grindu). Stav (střední povahy, vstup / po grindu): Hřbitov 50/65, Trůn 0/20, Poušť 40/75, Brána 5/75, **Doly 25/95, Srdce 10/55**, Jezero 30/100, Zima 5/95, Paluba 0/90, Hvězdárna 30/40. Stejný účet: Brána 67 % → Doly 4 % (zeď), Srdce 0 % → Jezero 13 %, Soutěska 4 % → Přístav 33 %.
**Poučení pro ladění:** boti buď build rozjedou a vyhrají, nebo umřou brzy. `dmm` (poškození) jen urychlí prohry, které by stejně nastaly, spawn (`spx`) přidává málo (sčítá se do počtu na vlnu, strop 170 nepřátel). O tom, **jestli** se build stihne rozjet, rozhoduje **HP** (`hpm`, a ten zvedá i poškození nástrah `hazDm`). Šum je velký (±15 bodů při 20 bězích), soudit až z 20+ běhů na mapu. **Otevřené:** Opatrný lučištník vyhrává skoro všude (drž odstup), Vrakoviště nereaguje ani na +60 % HP (Stavitel s věžemi a Fúzní lovec 100 %) – obojí spraví jen mechanika/nepřátelé, ne čísla. Účet po grindu ve IV vyhraje i finále ~95 %.

**10d – balanc všech kapitol (boti `hraci.js zed`, 5 povah):** III, IV, V víc tlaku (spawn a poškození, ne jen HP – opatrný lučištník vyhraje i při +90 % spawnu, víc HP jen prodlouží běh). `kitTier` pro kap. VI+: základ 3,85×1,25^(ci−5), finále ×1,1, `dmm` 2+0,12·(ci−5) (dřív 2,7×1,22 → VI byla lehčí než finále V). Stav: vstup 0–50 % (průměrné povahy), po grindu 50–100 %. **Otevřené (design):** styl „drž odstup a střílej“ vyhrává skoro všude 100 % → zeď proti němu udělají jen mechaniky (střelci, nájezdníci, plošné útoky); Vrakoviště zůstává lehké (~80 %, zabíjí jen racek), Jezero hranice. Telemetrie (30 dní, ~40 běhů, 3–4 hráči) potvrzuje: hráč s hrdinou 15–18 prošel III–IV napoprvé.

**08p – každá kapitola je zeď (přání uživatele, platí pro všechny kapitoly):** postup do další kapitoly má zarazit, hráč se vrací grindit Noční můry předchozích kapitol; bossové mají být výzva. `MAP_TIER` = [HP, spawn navíc, zlato za výhru, násobek poškození nepřátel `map.dmm` (ne bossové)]. Schodiště: vstup každé kapitoly ~×1,3 HP proti vstupu předchozí, v kapitole +5 % na mapu, finále +10–15 %; `dmm` I 1 / II 1,1 / III 1,2 / IV 1,3 / V 1,45 (finále o 0,05 víc). Bossové násobeni podle kapitoly (I ×1,2, II ×1,4, III ×1,5, IV ×1,6, V ×1,7 proti 08o) a poškození +1–2. Nepřátelé kapitoly V mají silnější základ (krab 42, pirát 62, medúza 34, racek 20 HP), jinak by V byla lehčí než IV (led a mráz jsou zrádnější).
Bot 8. 11. (2 běhy na mapu, bez výbavy): `zkuseny` trun 50 %, poust 50 %, brana 0 %, doly 50 %, srdce 0 %, jezero 0 %, zima 0 %; `max` jezero 25 %, zima 0 %, vrakoviste ~33 %, paluba 0–50 %. Hráči v pozdějších kapitolách mají výbavu z Nočních můr, ladit podle telemetrie (`runs`).
Starší balanc (08o, bot `zkuseny`, 3–4 běhy na mapu): jezero ~50 %, zima ~17 %; po úpravě `MAP_TIER` V: vrakoviste ~100 % → zvednuto na 1,78/0,58, pristav ~50 %, majak ~83 %, vir ~33 %, paluba ~50 % (Kraken 15 500). Bot zná vír, chapadla a díry (`bot.js`). Ladit podle telemetrie.
Nepřátelé: `crab` (charger, `wet`), `pirate` (chase, louže, `wet`), `jelly` (BEH `jelly`: na každou dobu vyrazí, dotek zpomalí), `gull` (BEH `gull`: krouží a střemhlav, `fly`). Věže `cannon` Lodní dělo (koule skáče po zemi, odemkne přístav) a `harpoon` Harpunářská věž (přitáhne a drží nejodolnějšího, odemkne vír), od 09c karty jen ze Stavitelovy bedny. Set `tide` Výstroj mořského vlka (2 = pohyb +8 %, sbírání +15 %; 4 = `lg.st4` vlna na 3. dobu každého 2. taktu, `kb` u `ring`), legendárka `kheart` Oko krakena (prsten, chapadla inkoustu na 3 nejbližší každé 2 takty). Hledaný `seawolf` Mořský vlk. Námořnice `need:'vrakoviste'`, 1500 zlata. Mistrovství `kraken` Pán moří. Testy `tests/tools/c5shots.js <prefix> [mapy] [s]` (level-upy vybírá sám), pohlednice nových map `thumbgen5.js mapa,…`.

## Kapitola VI Nebeská hvězdárna (09j, stavebnice)
Příběh Padlé hvězdy: po Krakenovi padají hvězdy, Hvězdářka je sleduje; finále Zatmění otevírá Prázdnotu (most do kap. VII, `BRIDGE.zatmeni` k:'void'). Paleta `C6G/C6W/C6T/C6B`, rekvizity `c6_*` v `KIT_PROPS`, hudba `songKit` v2 s vlastním stylem `star` (10f: pulzující basy, třpytivé arpeggio s ozvěnou, skleněná melodie, rytmické akordy u bosse), každá mapa motiv + odpověď + boss téma.

| Mapa | Rozvržení | Mechanika |
|---|---|---|
| hvezdarna Hvězdárna | plaza | `beam`: 2 paprsky dalekohledu ze středu (od 15 s), pálí hrdinu i nepřátele (40/0,3 s) |
| mlhovina Mlhovina | open, tma .86 | `slow` v hvězdném plynu, světlušky jako světla |
| ostrovy Plovoucí ostrovy | paths + zóna prázdnoty | `gaps`: prázdnota bolí a zpomaluje, na každý 2. takt hvězdné mosty (bezpečné); `push` hvězdný vítr |
| souhvezdi Souhvězdí | paths | `stars`: 5 hvězd v pořadí (stůj 0,35 s), celé souhvězdí zasáhne nepřátele do 300 px (60 % HP + 60, boss 3 %), ukazatel na další hvězdu; `links` čáry mezi `starwolf` pálí |
| zatmeni Brána zatmění | arena, finále | `strike` střepy hvězdy (od 60 s), `links`; boss Zatmění (`KIT_OWN.eclipse` dvojitý kruh + tma) |

Nepřátelé: `starimp` (fast, `BEH.blink` přenos k hrdinovi na takt), `meteor` (charger), `starwolf` (grunt, čáry), `comet` (tank, letí, `BEH.comet` průlet s ohnivým ohonem). Bossové kit: astrolab (keep, spirály), nebula (chase, sliz, přenos), griffin (dash, hvězdy z nebe), orion (keep, šípy, strike, vlci), eclipse (finále). Věže `scope` Dalekohled (odemkne mlhovina) a `gwell` Gravitační studna (souhvezdi). Set `star` (armor, amulet, ring, boots; 4 = padající hvězda `lg.sst4`), legendárka `eheart` Srdce zatmění. Hledaný `comet` Bludná kometa. Hrdinka `astro` Hvězdářka (`need:'hvezdarna'`, 1500 zl). Kontrola `tests/tools/c6shots.js prefix`.

## Kapitola VII Prázdnota (11h, stavebnice)
Příběh: Zatmění otevřelo díru do Prázdnoty, Nicota chce poslední střep hvězdy; po finále se z nicoty rodí nové slunce (`BRIDGE.nicota` k:`dawn`, náznak kapitoly VIII). Paleta `C7G/C7W/C7T/C7P/C7Z/C7B` (téměř černá, tyrkysové trhliny, fialová jen jako hloubka – fialová je zakázaná jen v UI), rekvizity `c7_*` (`c7_lantern` je sprite lucerny). Hudba: vlastní styl `void` (frygická stupnice `KIT_PROG.phryg`, sub basa + pulzní oktáva, pomalu nabíhající plochy, kovové pingy s ozvěnou, „glitch“ hi-haty, dutá pulzní melodie), mix `rolecal.js` odchylka 0,1 dB, běh −30,5 dB.
**Cíl mechanik:** všechny tři míří na otevřený problém „drž odstup a utíkej“ (10j): trhliny pouští nepřátele přímo k hrdinovi, ozvěna trestá běhání v kruhu, lucerna drží hráče v jednom putujícím kruhu.

| Mapa | Rozvržení | Mechanika |
|---|---|---|
| okraj Okraj prázdnoty | paths + zóna prasklin (jen vzhled) | `rifts`: od 20 s každé 4 takty trhlina 30–60 px od každého hrdiny, za takt bouchne (zraní v kruhu 22) a pustí `n` nepřátel z `pool`; boss Chřtán ji otevírá sám (`KIT_OWN.maw`) |
| trosky Trosky světů | open | bez mechaniky; rekvizity = trosky kapitol I–VI (`c7_tomb`, `c7_block`, `c7_ember`, `c7_ice`, `c7_plank`, `c6_scope`, `c6_orrery`) |
| ozveny Síň ozvěn | plaza | `echo`: stín každého hrdiny jde jeho cestou o `delay`=2 takty později, na 1. dobu taktu bouchne (hrdina v kruhu `r` dostane `hazDm`, nepřátelé `edmg`) |
| svetlo Poslední světlo | open, tma .9 | `lantern`: lucerna pluje po mapě (`spd` 15, s bossem ×1,3), mimo světlo (`r` 120, nebo dosah věže Lucerna) tik poškození; Můra ji každé 4 takty ztlumí na 60 % (`run.kn.dim`); šipka k lucerně mimo obrazovku (`kitArrow`) |
| nicota Srdce nicoty | arena, finále | `rifts` (každé 3 takty od 45 s) + `pull` s `ph2:1` = černá díra ve středu až od 2. fáze Nicoty (`ph2:{mf:'ph2'}` → `MF.kit.ph2` → `KIT_MECH.x.ph2`) + `strike` (jen pro tahy bosse) |

Nepřátelé: `shade` Stín (fast), `hollow` Vyhaslý (grunt, `die:'split'` → 2 stíny, `voidSplit`), `voideye` Oko prázdnoty (ranged3, letí), `devourer` Požírač (tank, dotek zpomalí). Bossové kit: maw (chase, trhliny), hoarder (keep, trosky), mirror (dash, přenos na zrcadlovou stranu od hrdiny), moth (chase, hasí lucernu), nothing (finále, spirály, černá díra). Věže `espire` Věž ozvěn (zásah + ozvěna `tech` o 2 doby později; odemkne ozveny) a `lantern` Lucerna (zpomalí, +15 % poškození, v Posledním světle bezpečí, p5 léčí; odemkne svetlo). Set `void` Výstroj poutníka nicotou (helm, armor, ring, gloves; 2 = úhyb +5 %, poškození +6 %; 4 = trhlina `lg.sv4` na 3. dobu 2. taktu). Legendárka `vheart` Kroky nicoty (boty, ozvěna kroku každé 2 takty). Hledaný `nameless` Bezejmenný (Vyhaslý, přenáší se za záda). Hrdinka `nyx` Nyx (`need:'okraj'`, cena z `HERO_PRICE` = 5 500, úhyb 8 %, zbraň `voidorb` Černá díra). Mistrovství `nothing` Světlonoš. Čísla: `kitTier` (vstup 4,81 HP, finále 5,29). Testy: `chapcheck.js c7`, `c7shots.js prefix [mapy] [s] [hrdina]` (odehraje s Nyx, věžemi, setem a legendárkou), boti `hraci.js kapitola:c7` (účet UCTY[6], boti znají trhliny, ozvěnu a lucernu).

## Kapitola VIII Úsvit (11l, stavebnice)
Příběh (`docs/PRIBEH.md`): po Nicotě se svět rodí pod novým sluncem a všechno roste až moc rychle. Světlo, které ve VII chránilo, tady pálí. Fénix je první tvor nového slunce a hlídá jeho kolébku; po finále se slunce otevře jako zlaté oko a svět zlátne (`BRIDGE.kolebka` k:`gild`, most do IX Zlatá říše). Paleta `C8G/C8W/C8T/C8P/C8Z/C8B`, rekvizity `c8_*`. Hudba: styl `dawn` (lydická stupnice `SCALES.lyd`, `KIT_PROG.lyd`, trojúhelníková basa, skleněná arpeggia, flétnová melodie), `STYLE_ROLE` z `rolecal.js`.
**Cíl mechanik:** růst trestá běh pořád jedním směrem (keře vyrostou tam, kam míříš), stín hodin drží hráče v pohyblivém stínu (opak lucerny ze VII), květy jsou volba (léčí tebe i nepřátele).

| Mapa | Rozvržení | Mechanika |
|---|---|---|
| rozbresk Rozbřesk | paths | `growth`: každé 3 takty od 20 s semena na směr pohybu každého hrdiny (`p.gvx/gvy`), za takt keř (`r` 18, `life` 16 s): zpomalí ×0,55 (nepřátele ×0,7, ne letce a bossy) a píchá (`hazDm`); boss Matka trnů zasévá sama (`KIT_OWN.thornmom`) |
| pole Zlatá pole | paths + pšeničná zóna | bez mechaniky (`strike` jen pro tahy Žnece: řada kruhů přes řádek hrdiny) |
| hodiny Sluneční hodiny | plaza | `sundial`: obelisk uprostřed, stín se otočí za `turn` taktů; každé `every` takty poledne: kdo není ve stínu (obelisk nebo 16 px u věže), dostane `hazDm`; takt předem varování (záře, prstenec, šipka ke stínu); nepřátelé na slunci ×1,1; Gnómon stínem cuká |
| zahrada Zahrada světla | open | `bloom`: 7 obřích květů, každé 2 takty rozkvetou: hrdina v kruhu +6 % zdraví, nepřátelé +15 % (bossové 3 %) |
| kolebka Kolébka slunce | arena, finále | `growth` + `sundial` (od 70 s) + `strike` (tahy Fénixe); Fénix (`egg:4`) po smrti → vejce (`phoenixEgg`, 22 % zdraví, 4 takty podle `run.t`), nerozbité se vylíhne s 60 % (`phoenixHatch`) |

Nepřátelé: `sunfl` Slunečnice (ranged3), `beetle` Zlatý chroust (charger), `firefly` Světluška (fast, letí), `scarecrow` Strašák (tank). Bossové kit: thornmom, reaper (dash, kosa `KIT_OWN.reaper`), gnomon (keep), honeyq (keep, žihadla), phoenix (finále, vejce). Věže `prism` Sluneční hranol (paprsek celou řadou; odemkne hodiny) a `hive` Úl (včely na 3 nejbližší; odemkne zahrada). Set `dawn` Roucho úsvitu (helm, amulet, boots, gloves; 2 = regenerace +0,5/s a zdraví +6 %; 4 = Rozkvět `lg.sd4`). Legendárka `fpen` Fénixovo pero (prsten, jednou za běh vzkřísí). Hledaný `rohac` Zlatý roháč. Hrdinka `reva` Réva (`need:'rozbresk'`, 8 000, regenerace 0,4/s, zbraň `vines` Trnité šlahouny, talenty prefix `v`). Mistrovství `phoenix` Lovec fénixe. Testy: `chapcheck.js c8`, `c8shots.js prefix [mapy] [s] [hrdina]`, boti znají semena, keře, poledne a květy (`hraci.js`).
**Poučení:** nástraha s `hazDm(base,…)` roste s `hpm` mapy. S `dmg:8` u slunce a `dmg:3` u keřů byla Kolébka i Hodiny 0 % při jakémkoli HP nepřátel; base nástrah drž nízko (1,5–3) a sílu dej do `pct`.

## Kapitola IX Zlatá říše (11n, stavebnice, ZEĎ)
Příběh (`docs/PRIBEH.md`): město, na které slunce pohlédlo jako první, všechno je zlaté. Herold slunce v půlce souboje (2. fáze, `KIT_OWN.herald`) poprvé vysloví Aurelovo jméno (toast + záblesk + most a zlaté oko už od 50 %); po finále `STORY.dvur`, most `BRIDGE.dvur` k:`stairs` (schodiště ze světla do X). **Bez hrdiny** (rozhodnutí 11. 11.), místo něj mazlíček **Straka** (`PETS.magpie`, r 3, `ch:'c9'` = v truhle mazlíčků až od odemčení Předměstí).
Paleta `C9G/C9W/C9T/C9P/C9Z/C9B` (zlato, temně rudá), rekvizity `c9_*`. Hudba: styl `gold` (harmonická moll, tympány, víření virblu, tuba, žestě, cembalo, trubka), `STYLE_ROLE` z `rolecal.js`.
**Zezlátnutí** (`gildEnemy`): +50 % zdraví, 1,3× XP, 15 % šance na minci, zlatý sprite (`gildSprite`). Dělá ho oko, Zrcadlo (p5), hledaný Pokladník.

| Mapa | Rozvržení | Mechanika |
|---|---|---|
| predmesti Pozlacené předměstí | paths | `gaze`: světelné oko (`r` 56) pluje k nejbližšímu hrdinovi; v něm roste ukazatel `p.gz`, plný = zpomalení + `hazDm`; nepřátele v něm na dobu zezlatí; boss Lichvář krade zlato z běhu (vrátí po smrti) |
| mincovna Mincovna | plaza | `press`: každé 2 takty pruhy (vodorovné/svislé střídavě) přes hrdinu, takt varování, úder zraní hrdinu a nepřátelům sebere 50 % max. zdraví; Mincmistr pouští kříž lisů |
| sochy Síň soch | plaza | `statues`: 20 soch (`statue`, `beh:'statue'`), každé 4 takty ožijí 2 nejbližší (do 220), zásah probudí hned, doplňují se; Zlatý rytíř budí sochy |
| pokladnice Pokladnice | open + zóna mincí | `greed`: 5 hromad, sebrání = +5 % poškození do konce běhu (max 6×), 3 mince, mimikové; hromada se po 25 s objeví jinde; Drak Zlatohlav sílí s počtem sebraných |
| dvur Zlatý dvůr | arena, finále | `gaze` (od 40 s) + `statues` (12) + `strike` (tahy Herolda); ve 2. fázi Herold každé 4 takty postaví oko na hrdinu a zvětší ho (`kz.big`) |

Nepřátelé: `gilded` Pozlacený (grunt), `taxman` Výběrčí (fast, `touch:'steal'` krade 3 mince, vrátí po smrti), `alchem` Alchymista (ranged3), `mimic` Mimik (charger); `statue` jen z mechaniky (XP jen 2, jinak by stojící sochy byly farma zkušeností). Bossové: usurer, mintmaster, gknight, dragon, herald (finále). Věže `gmirror` Zrcadlo (odemkne predmesti; u oka 3 cíle ×2) a `mint` Lis (mincovna). Set `gold` Šat zlatého dvora (armor, ring, helm, boots; 2 = zlato +10 % a poškození +6 %; 4 = Zlatý déšť `lg.sg4`). Legendárka `midas` Midasova rukavice (každý 12. zabitý vybuchne). Hledaný `treasurer` Pokladník. Mistrovství `herald` Poslední slovo. Testy: `chapcheck.js c9`, `c9shots.js`, boti se vyhýbají oku a lisům (`hraci.js`).
**Čísla:** ladění dalo vysoké HP (predmesti 125, sochy 105, pokladnice 188, dvur 94; mincovna 29, protože lisy berou nepřátelům půlku zdraví) – oko, sochy a poklad bez vysokého HP nestačí (zezlátlí nepřátelé dávají víc XP, poklad sílí). Prvotní verze měla 2× XP za zezlátnutí, plné XP ze soch a +8 % za poklad a mapy na HP skoro nereagovaly; po zmírnění (1,3× XP, socha XP 2, poklad +5 % max 6×) ladění konvergovalo. Kontrola schodu stejným účtem (UCET=7): Zahrada světla 25 % → Předměstí 6 % = zeď funguje.

**Vzhled (11o):** mapy IX stojí na `kit.decor`/`set`/`rows` – Předměstí: rovné dlážděné ulice (`pathTurn` .22), domy podél ulic, fontána a mozaika na náměstí, trhy ve čtvrtích; Mincovna: koleje, výstražné pruhy, řady lisů a beden, pece u zdí; Síň soch: koberce do kříže, uličky podstavců se svícemi, les sloupů; Pokladnice: tři hromady pokladu (oblouky truhel, korun, drahokamů); Zlatý dvůr: mozaika, koberce, trůn, kruh praporů a svící. Celá mapa: `tests/tools/mapfull.js`.

## Kapitola X Korunované slunce (11p, stavebnice, finále aktu I)
Příběh (`docs/PRIBEH.md`): uvnitř slunce, které Aurel ukoval ze sedmi střepů; každá síň připomíná akt. Paleta `C10G/C10W/C10T/C10S/C10F/C10K/C10L/C10B/C10R`, rekvizity `c10_*`, barvy střepů `SH7_COL` (kapitoly I–VII). Hudba: styl `crown` (varhany, sbor, žestě, banger kit), útok střepu přehraje začátek hlavního motivu finále své kapitoly (`aurQuote`).

| Mapa | Rozvržení | Mechanika |
|---|---|---|
| schody Schody světla | paths (rovné, `pathTurn` .12) nad oblaky | `collapse`: každé 2 takty kolem hrdiny praskne 8 dlaždic 40 px (takt varování), pak se na 1,5 taktu propadnou; díra = `hazDm` + zpomalení, nepřátelé spadnou (50 % zdraví); Strážce schodů boří schody pod hrdinou |
| trofeje Síň trofejí | plaza, koberce do kříže | `trophies`: 7 pozlacených soch finálních bossů I–VII (`trophy`, `beh:'trophy'`) na podstavcích v kruhu r 250; každých 6 taktů ožije nejbližší (útok podle bosse, `trophyMove`), rozbité se po 45 s vrátí; Kurátor je budí |
| hkovarna Hvězdná kovárna | plaza, lávové kanály (`decor` `channel`) | `anvil`: každé 2 takty šachovnice 5×5 políček 44 px kolem hrdiny (4 vzory se střídají), takt varování, rozsvícená políčka udeří (hrdina `hazDm`, nepřátelé −50 %) |
| vecnost Dvůr věčnosti | arena, den/noc (`decor` `split`) | `twins`: Den a Noc (`den` + druhý boss `noc` přes háček `boss`); padlé dvojče (`twinFall`) se po 2 taktech zvedne s 50 %, padnou jen spolu; elitní mix nepřátel I–IX |
| korunace Korunované slunce | arena, 6 sloupů `C10_COLS`, 7 podstavců střepů `C10_SH` | `crown` + `KIT_OWN.aurel`: 4 fáze podle zdraví (viz níže) |

**Aurel** (`aurel:1`, `aurelHold`): 1) král 100–70 % (vějíře, garda); 2) 70–40 % sedm střepů (`shard7`, `beh:'orbit'`), každé 2 takty jeden použije útok své kapitoly (`SH7_ATK`), rozbitý ubere Aurelovi 4 %; 3) 40–10 % slunce: Aurel ve středu, spirály, každé 4 takty výšleh (takt varování, zbělání), bezpečí jen ve stínu za sloupem (`aurShade`, pryč od Aurela) nebo u věže (Svatyně má velký stín); 4) pod 10 % tma (`run.kdark`), 16 s nesmrtelný a honí hrdinu, pak padne jen zásahem na první dobu taktu (`e.ls===2`). Úvodní karta finále aktu: 2 doby ticho a prasknutí (`actCrack`, `actHush`).
Nepřátelé: `sunguard` (tank), `spark` (fast, létá, `die:'burst'` kruh jisker), `chorist` (`beh:'chorus'`, každý 2. takt léčí okolí o 12 %). Konec aktu: `actEndShow` (STORY.korunace, Paladin, „Akt II připravujeme“), Paladin `win:'korunace'`, titul `aurel`.

## Zbývá / nápady
- **Plán příběhu aktů I a II (kapitoly VIII–XX, boss aktu Aurel): `docs/PRIBEH.md`** (návrh 11. 11., čeká na schválení).
- Akt I hotový (X v 11p). Další: akt II (`docs/PRIBEH.md`: XI Mělký sen, hrdina; Probuzení hrdinů; přepínač aktu v Přípravě). Kapitola VII zatím nic do `FEATS` nepřidává. **Odložený nápad** (uživatel 11. 11.: nemazat, jen teď nedělat): Síň bossů = vybraná kapitola, všech 5 bossů za sebou bez vln, odměna jen za první dokončení.
- Úkoly a Mistrovství pro nové mechaniky (zapálené pochodně `run.qc.torch`, zvony `bell`, pasti `trap` se už počítají).
- Ověřit na telefonu výkon tmy v Kostnici a mlhy v bažině.
