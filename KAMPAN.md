# Pixel Krypta – kampaň a kapitoly

Stav: **kapitoly I, II a III hotové (III od verze 2026-11-07y)**. Další kapitoly IV–VI čekají (hrdinové Šamanka, Námořnice, Hvězdářka už jsou připravení).
Návrh pro uživatele je i v dokumentu „Pixel Krypta – kampaň a kapitoly“ (Claude Docs).

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

## Zbývá / nápady
- Kapitola IV–VI (Šamanka mrazu, Námořnice, Hvězdářka): podle stejného rámce, mechanika jen u některých map, 2–3 noví nepřátelé na kapitolu.
- Úkoly a Mistrovství pro nové mechaniky (zapálené pochodně `run.qc.torch`, zvony `bell`, pasti `trap` se už počítají).
- Ověřit na telefonu výkon tmy v Kostnici a mlhy v bažině.
