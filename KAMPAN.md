# Pixel Krypta – kampaň a kapitoly

Stav: **kapitoly I–V hotové (III od 2026-11-07y, IV od 2026-11-08e, V od 2026-11-08o)**. Kapitola VI čeká (hrdinka Hvězdářka je připravená). **Žádná kapitola nepřidává nový materiál** (jen Úlomky a Esence).
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

## Balanc (bot, 2026-11-07g)
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
**08p – každá kapitola je zeď (přání uživatele, platí pro všechny kapitoly):** postup do další kapitoly má zarazit, hráč se vrací grindit Noční můry předchozích kapitol; bossové mají být výzva. `MAP_TIER` = [HP, spawn navíc, zlato za výhru, násobek poškození nepřátel `map.dmm` (ne bossové)]. Schodiště: vstup každé kapitoly ~×1,3 HP proti vstupu předchozí, v kapitole +5 % na mapu, finále +10–15 %; `dmm` I 1 / II 1,1 / III 1,2 / IV 1,3 / V 1,45 (finále o 0,05 víc). Bossové násobeni podle kapitoly (I ×1,2, II ×1,4, III ×1,5, IV ×1,6, V ×1,7 proti 08o) a poškození +1–2. Nepřátelé kapitoly V mají silnější základ (krab 42, pirát 62, medúza 34, racek 20 HP), jinak by V byla lehčí než IV (led a mráz jsou zrádnější).
Bot 8. 11. (2 běhy na mapu, bez výbavy): `zkuseny` trun 50 %, poust 50 %, brana 0 %, doly 50 %, srdce 0 %, jezero 0 %, zima 0 %; `max` jezero 25 %, zima 0 %, vrakoviste ~33 %, paluba 0–50 %. Hráči v pozdějších kapitolách mají výbavu z Nočních můr, ladit podle telemetrie (`runs`).
Starší balanc (08o, bot `zkuseny`, 3–4 běhy na mapu): jezero ~50 %, zima ~17 %; po úpravě `MAP_TIER` V: vrakoviste ~100 % → zvednuto na 1,78/0,58, pristav ~50 %, majak ~83 %, vir ~33 %, paluba ~50 % (Kraken 15 500). Bot zná vír, chapadla a díry (`bot.js`). Ladit podle telemetrie.
Nepřátelé: `crab` (charger, `wet`), `pirate` (chase, louže, `wet`), `jelly` (BEH `jelly`: na každou dobu vyrazí, dotek zpomalí), `gull` (BEH `gull`: krouží a střemhlav, `fly`). Set `tide` Výstroj mořského vlka (2 = pohyb +8 %, sbírání +15 %; 4 = `lg.st4` vlna na 3. dobu každého 2. taktu, `kb` u `ring`), legendárka `kheart` Oko krakena (prsten, chapadla inkoustu na 3 nejbližší každé 2 takty). Hledaný `seawolf` Mořský vlk. Námořnice `need:'vrakoviste'`, 1500 zlata. Mistrovství `kraken` Pán moří. Testy `tests/tools/c5shots.js <prefix> [mapy] [s]` (level-upy vybírá sám), pohlednice nových map `thumbgen5.js mapa,…`.

## Zbývá / nápady
- Kapitola VI (Hvězdářka): podle stejného rámce, mechanika jen u některých map, pár nových nepřátel, bez nového materiálu. Kapitola V nemá vlastní věže (IV měla dvě), dají se doplnit.
- Úkoly a Mistrovství pro nové mechaniky (zapálené pochodně `run.qc.torch`, zvony `bell`, pasti `trap` se už počítají).
- Ověřit na telefonu výkon tmy v Kostnici a mlhy v bažině.
