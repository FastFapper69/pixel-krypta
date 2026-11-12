# Historie vývoje Pixel Krypty

Přesunuto z CLAUDE.md 9. 11. 2026 (audit: soubor měl 112 kB a čte se při každém startu). Záznamy verzí 07–09z5 v původním pořadí, beze změn. Když hledáš, proč je něco udělané tak, jak je, hledej tady (`grep -n "název funkce" docs/HISTORIE.md`).

## Stavy a verze z úvodu CLAUDE.md (08m–09k, staré předávky, plán, rozhodnutí)
- **Stav k 2026-11-08 17:40 (verze 08m):** po 08i přibylo: mazlíčci v co-opu (08j), 4 nové fúze (08k), balík 15:41 (08l, viz sekce „Balík 15:41“: Nekonečná krypta jako boss fight, hvězdy mazlíčků, Kovárna s věžemi a mazlíčky, žebříček Kombo, hazardy podle max. HP, revize textů, jasné popisy hrdinů, nasazené věci první, novinky s highlights) a Nekonečná krypta **jen jedna na kapitolu** na jejím finále (08m, uživatel to tak chtěl od začátku). 
- **Stav k 2026-11-08 ~18:00 (verze 08n):** popisy map mají klíčové mechaniky v `<b>` (zlatě: `.mnode p b`, v Průvodci `.gd small b` inline). Hřbitov a Ledová pevnost žádnou speciální mechaniku nemají, proto bez zvýraznění. U nových map piš mechaniky rovnou do `<b>` (CZ i EN). Screenshot kontrola: `tests/tools/descshot.js <prefix> cs|en <mapa>`. Další: návrh kapitoly V (bez nového materiálu!), ekonomiku řešit až budou data.
- **Stav k 2026-11-08 ~19:00 (verze 08o):** hotová **kapitola V Prokleté pobřeží** (viz `KAMPAN.md`): Vrakoviště (příliv), Pirátský přístav (bez mechaniky), Mlžný maják (paprsek +30 % poškození), Oko víru (vír vtahuje, střed zraňuje), finále Paluba v bouři (loď na výšku se naklání do rytmu, Kraken u boku, chapadla, v bouři díry v palubě). Noví nepřátelé krab, pirát, medúza, racek; set `tide`, legendárka `kheart`, hledaný `seawolf`, Námořnice za 1500 po odemčení Vrakoviště. Bez nového materiálu a bez vlastních věží. 
- **Stav k 2026-11-08 ~20:00 (verze 08p):** **Výbava 2.0** (boty, rukavice, druhy předmětů, vlastnosti ★, 2 nové legendárky; viz `EKONOMIKA.md`) a **každá kapitola jako zeď** (přání uživatele pro všechny kapitoly: nová kapitola má zarazit, hráč se vrací grindit Noční můry, bossové jsou výzva; schodiště obtížnosti v `KAMPAN.md`). Dál ladit podle telemetrie.
- **Stav k 2026-11-08 ~20:30 (verze 08q):** přepracovaná Síň slávy (vítěz s dlaždicemi statistik `boardStats`, 2. a 3. s mřížkou, řádky s ikonkami `boardFacts`, čísla s mezerami `bNum`; test `tests/tools/boardshot.js prefix [cs|en] [záložka]` s vymyšlenými hráči) a Novinky 08m–08q přepsané do formátu s ikonami.
- **Stav k 2026-11-08 ~21:00 (verze 08r):** nové truhly: kreslené `chestArt(kind)` (artSprite 36×32, víko horních ~40 %), gradace Truhla dobrodruha (prkna) → Okovaná (železo) → Královská (samet, zlato, koruna); Stavitelova bedna (věže: laťková bedna, ozubené kolo, plánek) a Kouzelný košík (mazlíčci: proutí, mašle, tlapka) vypadají jinak. Id zůstala (`wood`, `iron`, `gold`, `tower`, `pet`). Náhled `tests/tools/chestart.js out.png`.
- **Stav k 2026-11-08 ~22:00 (verze 08s):** překreslené boty, rukavice, kovářské rukavice, sandály a talisman; ikona `star` (zlatá hvězda); ikony Novinek opravené (bell, star, boss:lich).
- **Stav k 2026-11-08 ~22:00 (verze 08t):** (1) **zvuky dropů ultimátek**: `ultDropSfx(id,first)` na dobu dropu (s%64===0) = sub kick, crash, akord v tónině, krátké ztlumení hudby (`duckMusic`) + vrstva podle živlu v `ULT_SND`; takt předem `ultRiser()` (s%64===48). Poslech offline: `tests/tools/droprender.js <dir>` → WAV. Drobné zvuky zbraní jsme **nepřidávali** (zásahy už hrají noty do rytmu, další vrstva by melodii zahltila). (2) **Aura** = `drawAura` (kruh s runami do taktu, vnitřní kruh, lístky, vlna při zásahu, spóry), **Souhvězdí** výraznější hvězdy (`f.flT` záblesk při spojení) a jiskra po paprsku. Galerie zbraní: `tests/tools/wgallery.js <prefix> [ids]` (env `N` počet nepřátel, `CLIP`). (3) Síň slávy: `.tc>.stg{margin-top:auto}` – staty 2./3. místa zarovnané i bez titulu (`boardshot.js` dává lichým hráčům titul). (4) **Truhla setu**: kus setu z finále se nepřidá rovnou, ale do `save.setCh` [{sid,r}]; otevírá se tlačítkem na výsledkové obrazovce (`#ovSet`, `ovSetBtn`) nebo kartou v Přípravě, `openSetChest` → `revealItem(..., {roll})` s losováním (kusy setu blikají nad truhlou a zpomalují). Test `tests/tools/setchest.js`.
- **Stav k 2026-11-08 ~22:30 (verze 08u, uživatel vše schválil):** (1) **Intro bossů zapojené**: `spawnBoss` (ne Nekonečná krypta, ne co-op) volá `bossIntroStart(e)` místo toastu; během `BI` svět stojí (`step` jen `bossIntroTick`, `conductor` nevolá `gameStep`), HUD schovaný (`#hud.bi`), ťuk na plochu = `bossIntroSkip()`, konec `bossIntroEnd()` (otřes + záblesk). Data `BOSS_INTRO[id]={line,acc}` pro všech 25 bossů, barvy karty podle kapitoly `CH_BG` (Král slizů zelený). Finále (`map.finale`) = 7 dob, pruh FINÁLE KAPITOLY, žhnoucí obrys, hrom a chór. Kontrola všech: `tests/tools/bossintroall.js <prefix>`, animace `bossintrogif.js` + `introaudio.js`. **Nový boss = přidat řádek do `BOSS_INTRO` (CZ i EN).** (2) **Úrovně hrdinů do 40**: `HERO_MAX=40`, nad 20 cena ×(1,2+0,025·(L−20)) a Esence ×0,8 (`ECON.heroCost`), bonus +1 %/úroveň nad 20. Volba talentu `TAL_CH` na 25/30/35/40 (`save.htal[h][tier]=0|1`, výměna `TAL_SWAP`=300 zlata, 2× ťuknout), `wpn` = startovní zbraň +30 % zákl. poškození přes `talentW`. Prestiž po 40: `save.hpr[h]`, `prCost`, každá +0,5 % zdraví i poškození (`PR_PCT`). Test `tests/tools/herolv.js`. (3) **Profilové obrázky**: `save.av` (`AV_BASE` lebka/sliz/netopýr, `h:<hrdina>` po odemčení, `b:<boss>` po výhře mapy na NM III = `save.nmw['3|mapa']`), `avImg`, `avAll`, výběr `renderAvPick` v obrazovce profilu (režim `openNick('av')`, i při založení účtu), v Nastavení na tlačítku přezdívky `#mNick` (`nickBtn()`: obrázek + přezdívka; offline „Profilový obrázek a titul“ → `openNick('av')`; **uživatel nechce obrázek v horní liště menu**, 08v), Síň slávy: podium `.av` a řádky `.bav`, na konci běhu řádek „Profilový obrázek odemčen“ (`out.av`). Test `tests/tools/avshot.js`. (4) `setCh`, `htal`, `hpr`, `av` jsou v `loadSave` i `SYNC_KEYS` (truhla setu se dřív do cloudu neukládala).
- **08w (mazlíčci):** do sloučení na hvězdu jde i nasazený mazlíček (`petStarSet` řadí sel, sel2, vybraný; nasazený se ponechá a sloty se přepíšou na něj), tlačítko „Sundat ze slotu“ (`#ptOff`, `save.pets.none=true` = bez mazlíčka, `petInit` pak nepřiřazuje první kartu, prázdný slot +). Rytmus sloučení mazlíčků: `petRb(per,good)` (4× Perfektní +8 %, jinak 1,5 %/P a 0,8 %/D) se sčítá do `c.rb` → `petM`, ukazuje se na kartě („Síla z rytmu“). Rituály s `opts.gain(per,good)` ukážou po dokončení zlatý text, co časování dalo (mazlíčci, věže, výbava). Test `tests/tools/petmerge.js`.
- **08x (sety):** každý set má vlastní sloty `SETS[id].slots` (bone helm/armor/amulet/ring, sun helm/amulet/boots/gloves, forge armor/ring/gloves/boots, frost helm/armor/amulet/gloves); staré kusy v jiných slotech platí dál (`pieces` je nechává, `setCount` počítá všechny sloty). **Každá pátá kapitola = set 6 kusů** (`six:1`, `b6n`/`b6`, lepší rarita přes `setRarity(nm,id)` = +1 stupeň NM): `tide` (kap. V) má boty a rukavice, 6 kusů = `lg.st6` (+10 % poškození a zdraví, chapadla na 1. dobu každého taktu na 4 nejbližší). `makeSetItem` dává 50 % přednost chybějícímu slotu. Pomocníci `setSlots(id)`, `setMax(id)`. Obrázky bot/rukavic setů v `ITEM_ART` (`<set>_boots`, `<set>_gloves`). Test `tests/tools/setsix.js`. **Nový set kapitoly: zvol jiné sloty než předchozí; kapitola 10, 15… dostane `six:1` a bonus 6.**
- **08y (stavebnice kapitol, přání uživatele):** nové kapitoly a hrdinové se dělají přes skilly `.claude/skills/nova-kapitola` a `novy-hrdina` (kontrolní seznam všech míst + pravidla uživatele) a stavebnici v `index.html` (oddíl chapter kit: `buildKit`, `KIT_PROPS`, `KIT_MECH`, `BEH.kit`/`KIT_OWN`, `songKit`, `kitTier`, `kitBoss`, `kitFoe`; popis v `KAMPAN.md`). Kontrola `tests/tools/chapcheck.js cN|hero:id|all` – našla a opravené: popisy 4 nepřátel kap. V v Průvodci, obrázky `tide_helm/armor/amulet/ring`. Zkouška dílů `kitdemo.js`. **Další krok: kapitola VI s Hvězdářkou touhle cestou** (nejdřív návrh uživateli: téma, mapy, mechaniky, bossové, set ve slotech jiných než `tide`).
- **08z (hráči-boti s povahami, přání uživatele):** `tests/tools/hraci.js` – 7 povah (`POVAHY`: Nováček, Opatrný, Agresor, Sběratel, Stavitel, Fúzní lovec, Expert; liší se reakční dobou `react`, všímavostí k varováním `aware`, odstupem `keep`, útočností `approach`, chamtivostí `greed`/`gemR`, panikou `panic`, výběrem karet `cards`, věžemi a rytmem rituálu), účty podle postupu `UCTY[kapitola]` (kalibrace podle skutečného hráče 8. 11.: kap. III ≈ hrdina 16–18, Vylepšení ~15) a `grind()` (po Nočních můrách). Scénáře `zed`, `kapitola:cN`, `mapa:id[:vstup|grind]`; výstup tabulka výher, verdikt zdi, podezřele snadné strategie, co zabíjí. Mechaniky stavebnice (`kst`, `kp`) i staré hazardy (láva, vozíky, vír, chapadla, díry, erupce, laviny, pasti, runy královny, mráz) zná `decide()`. Postup je ve skillu `nova-kapitola`. Starý `bot.js` už nepoužívat pro balanc.
- **Měření hráči-boty 9. 11. (`hraci.js zed 3`, 420 běhů, opravený bot):** kapitoly I–III zeď funguje na finále (vstup → po grindu: Trůn 0 → 27 %, Brána 0 → 87 %, Srdce 27 → 87 %), první mapy II a III při vstupu dost lehké (Poušť 67 %, Doly 87 %). **Kapitola IV je díra**: 100 % všude i pro Nováčka; stejný účet (UCET=2) dá Srdce 29 %, Paluba 24 %, Zimní trůn 95 %. Příčina: slabé složení nepřátel (kostlivci a duchové z kap. I, přízrak 22 HP, žádný střelec). **Kapitola V** při vstupu 87–100 % (účty IV–V jsou jen odhad, nikdo tam ještě není). **Zuřivý boss nestačí** na nekonečné kitování (Opatrný přežil přes 13 min na Trůnu, Bráně i Palubě). Navrženo uživateli (čeká na odpověď): kap. IV silnější a pestřejší nepřátelé + ledový střelec, kap. V o stupeň tvrdší, zuřivost bosse sílí, dokud kitujícího nedostane.
- **09a (balanc podle hráčů-botů, 9. 11.):** kap. IV: nový `icearcher` Ledový lučištník (`BEH.icearcher`, odstup 70–100, dvojice ledových šípů se `slw`, elita trojici), silnější yeti/přízrak/sněhulák, kostlivci a duchové z kap. I pryč ze spawnů, vyšší `MAP_TIER`. Kap. V vyšší `MAP_TIER` (+~15 % HP, dmm 1,7–1,85). Zuřivý boss: rychlost roste bez stropu do ×3,2 a `rageHunt` (po 1 době varování výpad k hráči, každou minutu častěji a dál, od 1,5 min zuřivosti i kruh střel; Kraken místo výpadu vějíř). V Přípravě pod názvem kapitoly „Pokořené mapy x / 5“ (dřív matoucí „Úlomky x / 5“). Měření `hraci.js kapitola:c4 2`: vstup jezero 71 %, pevnost 57 %, tajga 79 %, soutěska 50 %, zima 43 % (dřív 100 %), po grindu 100 %. Kap. V při vstupu pořád 86–100 % (Vír 64 %), ale účet `UCTY[5]` je jen odhad, ladit až podle telemetrie.
- **09b (texty podle kontextu, přání uživatele):** popisek pod názvem kapitoly se ukazuje jen tam, kde dává smysl (Normální: „Pokořené mapy x / 5“, NM: „Pokořené na NM k: x / 5“, Nekonečná krypta: nic); řádek „Odemčeno: Noční můra“ na konci běhu jen při skutečném novém odemčení (`run.nmOpenNew` spočítané na začátku `finish`); v Nekonečné kryptě podtitul „Nekonečná krypta tě nakonec pohltila.“ a bez štítku NOVÉ; nápověda NM píše přesně zlato +30 %/stupeň a Úlomky +50 %/stupeň. **Pravidlo:** každý popisek a počítadlo musí sedět k režimu (Normální / NM / Nekonečná krypta / denní výzva / co-op); při novém režimu nebo obrazovce projdi, co se ukazuje, a co nedává smysl, schovej nebo přepiš.
- **09c (věže kapitoly V + věže jen z bedny, přání uživatele 9. 11.):** `cannon` Lodní dělo (odemkne `pristav`; fx `cball` = `cballStep`: koule skáče po zemi 3× / ★E 4×, výbuch `rad` při každém dopadu, ★L dvě koule; míří na nejhustší shluk) a `harpoon` Harpunářská věž (odemkne `vir`; fx `harp` = `harpStep`, cíl v `WeakMap HARP` (reference na nepřítele nesmí do co-op snímku): míří na nepřítele s nejvíc HP, přitáhne ho vedle věže a drží `e.pin` 1,2 s / ★E 1,8 s, bosse jen zraní; ★L značka `e.mk` +25 %; `t.hOut` = harpuna venku). **Pravidlo pro všechny věže:** výhra na mapě z `TW_UNL` věž jen **odemkne** (`save.twU`, řádek „Odemčená věž“ na konci běhu), kartu dá jen Stavitelova bedna; nevlastněné odemčené věže mají v bedně váhu 3×. Ve Vybavení → Věže sekce „Čekají ve Stavitelově bedně“ (zlaté, ťuk = Obchod) a „Zamčené“. Kdo už kartu má, nechává si ji. Test `tests/tools/tw5.js prefix [rarita]`, galerie spritů `twgallery.js out.png`.
- **09d (popisky podle režimu, dokončení bodu z 09b):** denní výzva má vlastní konec (`showOver`: „Výzva splněna!“ při přežití 3 min, jinak „Do splnění výzvy chybělo X s“, řádek „Denní výzva: modifikátor“, odměna výzvy, +20 Úlomků započtené do řádku Úlomky); `run.trial` = denní výzva na neodemčené mapě, výhra pak nepočítá kampaň (`cleared`, odemčení, věž, poklad finále); hledaný se v denní výzvě nespawnuje (`!run.mod`, seed běhu musí být pro všechny stejný); `Q_PL` má množné tvary všech nepřátel (u chybějícího je záložní „Zabij 40× Jméno“); texty odměn Nástěnky píšou Úlomky. Kovárna, Obchod, Síň slávy a co-op lobby prošly bez nálezu. Audit: `tests/tools/modeaudit.js prefix [cs|en] [new|mid]` (konce běhů ve všech režimech + obrazovky, vypíše texty).
- **09e Nová Nástěnka (přání uživatele: hlubší úkoly, týdenní formát, týdenní výzva, hezčí menu):** tři záložky `qTab` = `day` / `week` / `wk` (`renderQuests` → `qDayHtml`, `qWeekHtml`, `qWkHtml`). **Téma dne** `Q_THEMES[qDow(den)]` (Po lovecký, Út stavitelský, St rytmický, Čt bossové, Pá alchymie, So poklady, Ne hostina): `pool` = šablony pro první dva úkoly, bonus v běhu přes `run.thm` (jen normální běhy, ne výzvy/Nekonečná krypta): elity +20 % (`hurtEnemy`), věže +25 % (`towerFire`), kombo +1 s, boss −15 % HP (`spawnBoss`), XP +15 %, Úlomky +25 % (`runRewards`), zlato +20 % (`endCoins`) a 2 přehození. **Úkoly se 3 hvězdami:** `save.qd.v=2`, úkol `{ns:[3 prahy],xs:[3 texty],v,cl}` = staré lehký/střední/těžký čísla téže šablony (`qGen`), odměna za hvězdu `Q_SR`, `qStars`, vyzvedává se po hvězdách (`qClaim`, poslední papírek se „utrhne“). Svíčky: denní stezka `Q_DMS` 3/6/10 (řada svíček s plamenem `candleRow`), týdenní `Q_WMS` 10/25/45. **Týdenní kontrakty** `save.qw.k` (3 ze `QK_TPL`: tažení frontové kapitoly, lovecká smlouva, mistrovská zkouška), kroky ze `QK_STEP` v **libovolném pořadí** (`K.v/d/cl` po krocích), počítá `qkAdd(typ,n,{ch})` z `qCommit` (výhry/zabití/elity/bossové/NM bossové/věže/kombo), `qClaim` (hvězdy), `qClaimWanted`, denní výzvy v `runRewards`, bronz týdenní výzvy; odměna kroku `QK_SRW[j]`, za celý kontrakt `T.rw` (Okovaná truhla / Stavitelova bedna `twCrateRoll()` / 10 Esence + 200 zl). **Týdenní výzva** `wkInfo()` (seed `weekKey`): mapa, hrdina z `HERO_LIVE` (i nevlastněný), 2 modifikátory; `startRun(h,m,{wk:1})` → `run.wk`, `run.mods` (modifikátory teď přes `hasMod(id)`, víc najednou), seed `weekly|týden`, bez hledaného a bez tématu dne. Medaile `WK_TIER` bronz = přežít do bosse (`t≥map.dur`), stříbro = výhra, zlato = výhra s ≥50 % HP; `wkResult` ve `runRewards` (`out.wkT`), konec běhu ukáže medaili, vyzvedává se na Nástěnce (`wkClaim`). `save.wk={w,got,cl,best}`, žebříček záložka **Týden** (`stats.weekly`, `boardTab==='tyden'`). Ikony `medal_b/s/g`, `candle_off`, `pin`. Testy `tests/tools/qboard.js prefix [cs|en] [new|mid]`.
- **09h Cesta mechanik (schváleno 9. 11.):** `FEATS` = mechaniky a mapa, jejíž výhra je odemkne (`featCheck()` ve `finish` po `save.cleared`): I-1 gear (Vybavení+Obchod), I-2 fuse (fúze v běhu, `fusable`), I-3 quests (Nástěnka, `qClaimable`, `qLive`), I-4 forge (Kovárna Vylepšení + vylepšování předmětů), I-5 nm (jen karta, zámky NM/krypty už byly), II-1 daily (`#dailyBox`), II-2 arsenal (`runDeck` jinak `T_BASE`, záložka Věže, Stavitelova bedna v Obchodě), II-3 wanted (plakát + `updateWanted`), II-4 merge (záložka Kování), II-5 pets (`petStart`, záložka, Kouzelný košík), III-1 talents (`heroBonus`), III-3 contracts (záložka Týden), III-5 weekly (záložka Výzva). `featOn(id)` (testovací režim a běžící co-op = vše), `featLock(id)` text, `featUi()` (třída `.flock` se zámkem, volá `setState`), karta `featShow()` (`#featPop`, fronta `save.featNew`, v menu a Přípravě), v Přípravě `.fnext` u mapy. Staří hráči (`stats.runs>0` při prvním `featInit`) mají vše + jednu souhrnnou kartu (`save.featSum`). Co-op zůstává hned dostupný jako beta (uživatel: později odemknout až po kapitole I a dát mu vlastní kampaň, zatím jen nápad). Test `tests/tools/featpath.js prefix [cs|en] [old]`.
- **Plán (schválený návrh 9. 11.):** příběh **Padlé hvězdy** (pod Kryptou leží padlá hvězda, Úlomky jsou její střepy, každý finální boss nese velký střep) a **mosty mezi kapitolami**: v poslední fázi finálního bosse náznak další kapitoly + karta „Cesta dál“ po výhře (I Morvan → znak slunce/písek, II Sfinga → brána se propadne, magma, III Titán → srdce vychladne, sněží, IV Královna → led taje, voda, V Kraken → padají hvězdy, VI Zatmění → chapadla Prázdnoty = kap. VII). **Kapitola VI Nebeská hvězdárna**: mapy Hvězdárna (paprsek dalekohledu), Mlhovina (mlha), Plovoucí ostrovy (mosty do rytmu), Souhvězdí (hvězdy v pořadí → paprsek), finále Brána zatmění, boss Zatmění; nepřátelé Hvězdný skřítek (teleport do rytmu), Meteorit (valí se a odráží), Souhvězdní vlci (pálící čára mezi nimi), elita Kometa; Hvězdářka (zbraň Souhvězdí), věže Dalekohled + Gravitační studna, set, hledaný Bludná kometa. Pak nové mechaniky do Cesty: **Runy** (finále IV, runa do Epických+ předmětů za Esenci) a **Souhvězdí** (finále VI, hvězdná mapa trvalých bonusů účtu).
- **09i Mosty kapitol (příběh Padlé hvězdy):** `BRIDGE[finále]={k,line}` a `bridgeDraw(g,ox,oy)` (volá `render` před zábleskem, jen finále mimo Nekonečnou kryptu): když má boss ≤35 % HP, `run.brOn`, toast s větou, vrstva v souřadnicích obrazovky `run.brP` (sun = padající písek + teplý nádech + sluneční znak u bosse, magma = žhavé praskliny a jiskry zdola, snow = sníh, thaw = stoupající voda a kapky, stars = padající hvězdy a hvězdné nebe). `STORY[finále]` = text karty **Cesta dál** (`storyShow`, fronta `save.storyNew` z první výhry finále v `runRewards`, ukáže se po kartách mechanik; tlačítko pošle do první mapy další kapitoly, u kapitoly V teaser „Kapitola VI · připravujeme“ s `skyThumb()`). Test `tests/tools/bridges.js prefix`.
- **09j Kapitola VI Nebeská hvězdárna (stavebnice):** detaily v `KAMPAN.md`. Nové `KIT_MECH`: `beam` (otáčivé paprsky ze středu, `c6On`), `gaps` (zóna = prázdnota, bolí/zpomaluje, `run.kg.on` na každý 2. takt = mosty), `stars` (souhvězdí v pořadí, `run.ks`, ukazatel na okraji obrazovky v `over`), `links` (čáry mezi `starwolf`, `run.kl`). `KIT_ROLE` přesunuté před `ENEMY_DEFS` (kvůli `kitFoe` v tabulce), `KIT_OWN.*` až za `const KIT_OWN`. `ROMAN_CH` do VIII. Boti: řádek účtu kapitoly VI v `hraci.js` `UCTY`.
- **Ladění kap. VI (boti `hraci.js`, umí se vyhnout paprskům, prázdnotě a čarám):** `MAPS[id].hpmK` a `spxAdd` násobí/přičítají vzorec `kitTier` (hvezdarna 1,2/.08, mlhovina 1,65/.4); paprsek od 44 px od středu, 6 + 1,2 % HP za 0,5 s; prázdnota 2 + 1,5 % za 0,6 s. Výsledek: vstup hvezdarna ~67 %, mlhovina ~67 %, ostrovy 20 %, souhvezdi 50 %, zatmeni 20 %; po grindu 67–90 %. Doladit podle telemetrie.
- **09k Runy (nová mechanika, `FEATS.runes` odemkne `zima`):** `RUNES` (fire, ice, bolt, life, haste, luck, ward, rhythm), klíč `typ+úroveň` (`fire1`…`fire5`), zásoba `save.runes`, v předmětu `it.rn=[k,k]` (sloty `runeSlots`: Epický 1, Legendární/set 2). Bonus `runeBonus`+`runeApply` v `heroBonus` (`B.rn` → `st.rn`), útoky do rytmu `runeBeat(s)` na začátku `fireAll` (oheň na takt, led na takt+8, blesk každé 2 doby). **Proti zneužití jen kořist:** `runeDrop('boss')` po výhře mapy s bossem na NM (šance .35+.15·NM, max 1 za běh, `save.runeDay` max 3 denně), `'chest'` Okovaná 6 % / Královská 15 % (v `openChest`), `'contract'` 1 za dokončený týdenní kontrakt (v `qClaimK`). Slučování 3→1 v Kovárně (`runeForgeHtml`, `runeMerge`), vložení/vyjmutí v okně předmětu (`runeSockHtml`, `runeSock`, vyjmutí `RUNE_OUT`=5 Esence, runa se vrátí). Ikony `runeIcon(t)` se kreslí za běhu (`SPR.icon.rune_*`). Test `tests/tools/runes.js prefix [cs|en]`.
- **Předávka 2026-11-09 13:20 (verze 09k, vše na main):** Runy hotové. Další: **Souhvězdí** (schváleno: hvězdné body jen za výkony – první výhra mapy na NM I/II/III, finále kapitol, zlatá medaile týdenní výzvy, vybraná mistrovství; 5 souhvězdí Válečník/Strážce/Stavitel/Krotitel/Hudebník po 6–8 hvězdách, dokončené dá velký bonus; přeskládání 1× týdně zdarma, jinak Esence; odemkne `zatmeni`). Pak ladění kap. V/VI podle telemetrie.
- **Předávka 2026-11-09 09:50 (verze 09e, vše na main):** nic rozpracovaného. Další na řadě: kapitola VI s Hvězdářkou (nejdřív návrh; nová kapitola potřebuje i `Q_PL` tvary nových nepřátel a hledaného do `WANTED`/`WANT_OF`). Pak ladění ekonomiky Nástěnky podle telemetrie (kolik hvězd/kontraktů hráči reálně plní).
- **Předávka 2026-11-09 08:40 (verze 09d, vše na main):** další na řadě podle uživatele: **týdenní výzvy + hlubší systém úkolů s hezčím menu** (denně se střídající opakovatelné úkoly, větší týdenní formát). Nejdřív návrh ke schválení. Pak kapitola VI.
- **Předávka 2026-11-09 06:45 (verze 09c, vše na main):** nic rozpracovaného. Otevřené: (1) popisky podle režimu i v Kovárně, Obchodu, Nástěnce, Síni slávy, co-opu a denní výzvě; (2) kap. V ladit podle telemetrie; (3) kapitola VI s Hvězdářkou (nejdřív návrh, věže už rovnou jen z bedny).
- **Předávka 2026-11-09 05:55 (verze 09b, vše na main):** nic rozpracovaného. Otevřené: (1) projít touhle optikou „popisek musí sedět k režimu“ i Kovárnu, Obchod, Nástěnku, Síň slávy, co-op a denní výzvu; (2) kap. V ladit až podle telemetrie (boti s odhadnutým účtem dávají 90–100 %); (3) kapitola VI s Hvězdářkou (nejdřív návrh).
- **Předávka 22:30:** nic rozpracovaného. Otevřené: data z `runs` (ekonomika a obtížnost), kapitola VI s Hvězdářkou (nezapomenout `BOSS_INTRO` hlášky nových bossů), věže pro kapitolu V; ověřit na telefonu, jestli intro bossů nesekne a jestli ceny úrovní 21–40 nejsou moc vysoké.
- **Předávka 2026-11-08 20:50 (konec chatu, verze 08s, vše na main):** nic rozpracovaného. Odpovídat vždy **česky** (i závěrečná shrnutí). Otevřené náměty: (1) kontrola ekonomiky a obtížnosti na datech ze Supabase (`runs`), až budou data, hlavně nové schodiště obtížnosti z 08p; (2) kapitola VI s Hvězdářkou (bez nového materiálu, pár nových nepřátel, Novinky v hezkém formátu s poznatelnými ikonami); (3) kapitola V nemá vlastní věže, dají se doplnit; (4) Síň slávy ověřit se skutečnými hráči (screenshot od uživatele).
- **Starší stav (08i, strom vylepšení v Kovárně, bez Přebroušení):** hotové kapitoly I–IV (20 map), Noční můry I–III, karty věží, sety, mazlíčci, Ekonomika 2.0 s Nekonečnou kryptou, hrdinové Zbrojmistr (Halapartna) a Krotitel (Bič), **kapitola IV Ledová říše** (viz `KAMPAN.md`), **výbava z kampaně jen za první výhry** (truhly = jediný stálý zdroj a jediný zdroj legendárek, viz začátek `EKONOMIKA.md`). Šamanka mrazu se kupuje po odemčení kapitoly IV.
- **Další na řadě (schválené přání uživatele, zatím nezačaté):**
  1. ~~Mazlíčci~~ **hotovo ve verzi 07z.** Uživatel nechtěl bláznivé návrhy (Kostík, Žvejka…), chtěl „normální“ zvířata. Zbývá doladit podle jeho dojmů a telemetrie; kooperace hotová v 08j.
  - **Otevřené po 08c:** ověřit ekonomiku na skutečných datech (`runs`, `profiles` v Supabase: zda se Úlomky nebo zlato nehromadí), případně doladit `SH_K`, ceny a denní limity; Věžová truhla teď chce Úlomky, takže je dostupná i novým hráčům. Zbrojmistr má Halapartnu (`halberd`, +6 % za každou další zbraň), Krotitel Bič (`whip`, značka `e.wm` → mazlíčci +30 % v `petHit`), obě zbraně všem od úrovně hrdiny 8 (`W_HERO`).
  - **Sandbox (8. 11.):** push jde přes git proxy sezení; když hlásí, že repo není v sezení, přidej ho s právem zápisu (nástroj pro přidání repozitáře, access push) a pushni znovu, token není potřeba. Proxy blokuje `*.github.io` i `api.github.com`, takže nasazení na Pages ověří uživatel (Novinky ve hře ukazují poslední verzi). Supabase je dostupný přes konektor (projekt `mpxfppuigwvwlfhsnbgr`, tabulky `profiles`, `runs`, `feedback`), skutečná data hráčů jdou číst SQL dotazem bez `dev_key`.
  2. ~~Kapitola IV~~ **hotovo 08e**, ~~kapitola V~~ **hotovo 08o**. Další: **kapitola VI** (Hvězdářka čeká zamčená, `HEROES.astro.soon`).
  - Raid pro víc hráčů a 1v1 aréna: uživatel řekl „zatím se na to vyprdni“. Kdyby se vrátil: reálné 1v1 je těžké (síťová vrstva, výhoda hosta), schůdnější je asynchronní aréna proti uloženému buildu ovládanému botem.
- **Historie rozhodnutí (stručně):** obtížnost jako schodiště, každá kapitola je zeď a hráč grinduje Noční můry (08p); co-op jen jako extra režim, sólo beze změny; **žádné nové materiály** (od Ekonomiky 2.0 jen Úlomky a Esence pro všechny kapitoly, nové kapitoly dávají jen víc Úlomků a Esence); finále každé kapitoly má speciálního bosse; sety kapitol (poklad + 3 stupně NM = celý set); věže jako karty s raritou + samostatná Věžová truhla; Oáza (léčivý paprsek) je nápad uživatele; současných 5 hrdinů zůstává základ, noví hrdinové nesou tematickou zbraň (všem od úrovně hrdiny 8).


## Balík 15:41 (08l)
- **Nekonečná krypta = boss fight, jedna na kapitolu (08m)**: hraje se jen na finále kapitoly, odemkne ji výhra toho finále (`save.fin[finále]`); v režimu ∞ Příprava ukáže jen finále (bez popisu a pokladu). Na Trůnu kostí se s každým novým Morvanem vrátí i fylaktérie. běžné vlny slabší (×0,6, strop spawnu), boss přichází v `run.enNext` (první 30 s), `spawnBoss` škáluje podle `run.enW`, `bossEvo(e,tp)` přidává útoky po evolucích (II prstence, III elity, V vějíře, VI magma, VII rychlejší), `enBossDown` léčí 25 % a nastaví další příchod +12 s. Rekord `save.endW` (v SYNC_KEYS), římské číslice `romanN`, Esence Σ(1+0,5(k−1)).
- **Hvězdy mazlíčků**: `PET_STMAX=5`, každá ×1,15 (`petM`). Sloučení `petStarGo` – nechá nejlepší kartu, ostatní stejného druhu spotřebuje, vrátí 50 % jejich vylepšení. Tlačítko `#ptStar` v detailu mazlíčka.
- **Kovárna** má sekce Výbava / Věže / Mazlíčci (`renderForge`, `twMergeGo`).
- **Použité napřed**: dlaždice výbavy, věží a mazlíčků řazené nasazené první, zlatý rámeček + popisek `.inb` dole (NASAZENO / zkratka hrdiny / ARZENÁL / V BĚHU).
- **Hazardy map** počítají `hazDm(base,pct,p)` = základ × NM × `map.hpm` + procento max. HP – škálují s hrdinou.
- **Žebříček Kombo** (`bCombo`, záložka `kombo`).
- **Popisy hrdinů**: `confirmHero` ukazuje zbraň, bonus a talenty. **Pravidlo:** každý nový hrdina musí mít v popisu jasně napsaný bonus (žádné „Pevná ruka“ bez vysvětlení), důležité věci v `<b>`.
- **Novinky**: položka `NEWS` může mít `hl:[{ic,t,d}]` (velké karty highlights, ikona z `SPR.icon`/`SPR.pet`) a `items` jako drobnosti malým písmem. Highlights piš vždy pro větší update.
- Obrazovka výhry: „Znovu“ opouští běh jako `openMenu` (jinak zůstal zamrzlý snímek na pozadí).

## Strom vylepšení (08g, předělaný 08h)
- Záložka Vylepšení v Kovárně (`renderShop`) je strom `TREE`: větve Útok (`dmg`, `build`), Obrana (`hp`, `spd`, `revive`), Kořist (`mag`, `xp`). Statistiky jsou původní řádky `META` (30 úrovní, hodnosti beze změny), pod nimi 5 klíčových uzlů na větev s **10 úrovněmi** (`save.meta.a1…a5`, `d1…d5`, `l1…l5`, `KEY_MAX`, cena `keyCost(patro,úroveň)`), dole nekonečné Mistrovství (`ma`/`md`/`ml`, `mastCost`).
- **Odemykání nikdy nezamyká zpět** (přání uživatele): uzel patra i se otevře poraženou kapitolou (`TIER_NEED`) a 3 úrovněmi uzlu nad ním (`KEY_PREV`); uzel s úrovní > 0 je otevřený navždy. Mistrovství se otevře po `MAST_NEED`=50 koupených úrovních ve větvi (počet jen roste). Nové kapitoly přidávají jen nové uzly, staré podmínky neměnit.
- Účinky na úroveň: a1 krit +3 % na 1. dobu, a2 6 % šance nová zbraň úr. 2 (`applyOptCore`), a3 10 % šance 4. karta, a4 ultimátky +3 % (`st.fuse`), a5 strop komba +2,5 %; d1 štít s obnovou 90−5·(L−1) s, d2 jednorázové léčení 5 %·L pod 30 % zdraví, d3 věže +6 % zdraví a +3 % poškození, d4 brnění +0,2, d5 regenerace +0,05/s; l1 8 % šance na 2 vylepšení z truhly, l2 přitáhne krystaly každých 17−L taktů, l3 zlato +2 %, l4 elity +0,3 Úlomku, l5 Esence +3 %.
- Vše je v `save.meta` (cloud i co-op), `recalc` → `st.tr` = úrovně (jen když `meta.treeV===2`). `treeMigrate()` vrátila plnou cenu za jednorázové uzly z 08g. Test `tests/tools/tree.js <prefix>`.

## Noví hrdinové (08c)
- **Zbrojmistr** (`warlord`, start `axe`): `maxW()` = `MAX_W`+1 (podle `run.heroId`, v co-opu se přepíná). Talenty `w5` +5 % poškození, `w10` druhá náhodná zbraň na startu (v `startRun`), `w15` +10 % rychlost útoků, `w20` +10 % poškození.
- **Krotitel** (`tamer`, start `rang`): druhý mazlíček `save.pets.sel2` (`run.pet2`, `petStart(2)`), mazlíčci jsou v `petUpdate` smyčkou (`petStep`, `petFire`). Talenty přes `heroBonus`: `B.petd` (+15 % / +25 %), `B.petr` (+15 %), `B.petp` (+20 %), uplatní se v `petStart`. Obrazovka Mazlíčci má druhý slot s odznakem Krotitele, v detailu mazlíčka tlačítko „Jako druhý“.
- Oba stojí 1 000 zlata a odemknou se po Trůnu kostí (`need:'trun'`). Test `tests/tools/heroesC.js`.

## Ekonomika 2.0 (08b) – podrobnosti v `EKONOMIKA.md`
- Měny: `MAT_IDS=['shard','ess']` (Úlomky, Esence). Kapitoly mají `mat:'shard'`, `MATX(m)` převádí staré klíče (úkoly v uložených pozicích) na `shard`. Staré pozice převádí `econ2Migrate()` v `econInit` (`save.econV=2`).
- Ceny jedním vzorcem: `upF(r,lv)` (předměty, karty věží, mazlíčci), `investF`, `refundF`, `ECON.heroCost`, `metaCost`. Placení `canPay`/`payC`/`gainC`.
- Příjem: `runRewards` (Úlomky ×`SH_K` a +15 % za kapitolu), `essGain` (první výhra finále na obtížnosti `ES_FIRST`, opakovaná `ES_REP` max `ES_FIN_DAY`× denně, Nekonečná krypta `EN_RATE` za minutu od `EN_T0`, denně plně `EN_CAP`). Strop `SH_CAP` 6 000, přebytek na zlato 1 : 3 (i v `persist`).
- Truhly: denní limity `CH_LIMIT` (`chLeft`, `chUse`, `save.chD`). Věžová a Mazlíčkova chtějí zlato + 60 Úlomků.
- Přebroušení: **zrušeno v 08i na přání uživatele** (tlačítka pryč; `openReforge`/`rfCost` zůstaly v kódu nepoužité, `o.rf` v savu nevadí). Nevracet.
- Nekonečná krypta: `sel.endless`, `run.endless` (bez bosse, `makeEnemy` škáluje, `rewT` bez stropu), rekordy `save.endB`.
- Nové klíče v `SYNC_KEYS` a `loadSave`: `econV, esF, esD, endD, endB, chD`.
- Testy: `econB.js` (převod, ceny, odměny, limity, Přebroušení, Nekonečná krypta), `shotB.js` (screenshoty), `econsim.py` (dlouhodobá simulace). `econ1.js` a `econ2.js` jsou ze staré ekonomiky.

## Feedback 8. 11. – balík A (08a)
- **Kovárna** je samostatná obrazovka (`scr-forge`, `openForge`, `renderForge`) se záložkami Kování | Vylepšení (`scr-shop`, nadpis Kovárna). Obchod (`scr-chests`) má jen truhly. Menu: Vybavení | Kovárna, Obchod | Nástěnka; Síň slávy je ikona v `#mTop` (`#mBoard`, `#icBoard`). Odznak hodnosti Vylepšení je na `#mForge`.
- **Sloučení:** 3 stejné kusy = stejný slot, rarita i set (`mergeGroups()`, klíč `slot|r|set`), výsledek stejný slot o raritu výš (`doMerge(key,q)`, u setu `makeSetItem(set,slot,r+1,q)`). Legendární a nasazené se neslučují.
- **Sety:** kus setu má vlastní raritu (`SET_RAR` podle NM, poklad `SET_TRE`), slot je náhodný (`makeSetItem(id,slot,r,q)`). Barvy rámečků a spritu (`e`,`g`) jsou podle rarity, set poznáš podle bílého kosočtverce vlevo dole. Každý hráč si losuje sám (i v co-opu).
- **NOVÉ:** předměty a karty věží mají štítek `.nwt`, dokud na ně hráč neťukne (`isFresh` čte `save.seen`, `seeOne(key)` v `openItem`/`openTwCard`). Ostatní druhy (mapy, hrdinové, hodnosti) mizí při otevření obrazovky jako dřív.
- **Vybavení:** řádek kategorií `#invCats` (Vše + 4 sloty s počty), ťuknutí na slot přepne kategorii.
- **Věže:** rarita jako štítek `.rp`, slot Stavitele jen s malým odznakem (`.bt`).
- **Konec běhu:** jen „Pokračovat“ (`#ovAgain`) → Příprava, po výhře vybraná další mapa; Sdílet a Menu jsou skryté v DOM (kód na ně odkazuje).
- Menu bez podtextu pod logem, horní lišta `#mTop` a `.head` plné bez přechodu a stínu.
- Testy: `shotA.js <prefix> [obrazovky]`, `scrollshot.js <png> <setup>` (sjede obrazovku dolů), `mergeA.js`; v `__krypta` je `_ev(x)` pro přístup k vnitřním funkcím z testů.

## Mazlíčci (07z, 11/2026)
- **Co to je:** do běhu bereš **jednoho** mazlíčka (záložka Vybavení → Mazlíčci, `scr-pets`). Osm druhů s pevnou raritou: Vlk, Havran (Běžní), Sova, Liška, Netopýr (Vzácní), Salamandr, Dráče (Epičtí), Fénix (Legendární). Data v `PETS` (sprite `rows`+`pal`, `dmg`, `cd`, `kind` chase/fly, texty `info` a `ab`).
- **Karty:** `save.pets={v:1,cards:[{u,k,r,lv,b,pet:1}],sel:uid}` (v `SYNC_KEYS` i `loadSave`). Rarita je dána druhem (`PETS[k].r`), bonusy `b` (Poškození mazlíčka, Rychlost útoků, Síla schopnosti) se losují podle `PET_NB`, vylepšení +0…+10 za zlato + Magmatit (`petUpCost`), rozebrání `petRefund`. **Sloučení 3→1 není**, protože rarita je pevná. Nový hráč dostane zdarma Vlka (`petInit`).
- **Truhly:** `PET_CHEST` (600 zl + 20 Magmatit, šance 56/0/30/12/2, Epická nejpozději za 12) a Věžová truhla teď taky zlato + Magmatit (`TW_CHEST_COST` 700 + 20). Pozor: hráč bez Magmatitu (kapitola III) Věžovou truhlu zatím neotevře. Zvaž, jestli to neomezit.
- **V běhu:** `petStart` (v `startRun`), `petUpdate(dt)` (volá `update`), `drawPet`, `drawPFire`, `petRevive` (Fénix v `hurtPlayer`), `petGoldMul` (Liška v `endCoins`), značka Sovy `e.mk/e.mkm` v `hurtEnemy`. Mazlíček je jednotka v y-řazení (`isPet`). Výpočet síly: `petStat` (`m`=RARM×(1+.07·lv), `dm`, `rt`, `pw`). `petHit` sčítá `run.pdm` (poškození mazlíčka), `hurtEnemy` sčítá `run.tdm` (celkové) – jen pro měření.
- **Balanc:** poškození mazlíčka = pomocník, ne druhá zbraň. `PET_DK=.2` a `1+.12·úroveň`. Měřeno `tests/tools/petbal2.js`: podíl mazlíčka na poškození je v 1. minutě kolem 20–35 %, později klesá k 5–15 %. Test je hodně šumivý (náhodné volby vylepšení). Fénix v testu nepoužije oživení (god mode).
- **Kooperace (08j):** kamarád posílá karty svých mazlíčků v `hello` (`pets:petsHello(hero)`, Krotitel dvě) → `LO.matePets`; host je postaví `petMake(c,p,two,bonus)` do `run.pls[1].pet/pet2` (`pet`, `pet2` jsou v klíčích `withPl`) a simuluje v `petUpdate` přes `withPl`. `allPets()` = všichni mazlíčci (kreslení, světla, snímek). Snímek nese `pt` (druh, x, y, směr, příznaky) a `pf` (ohně Salamandra), guest je drží v `run.gpets` a vyhlazuje v `guestUpdate`. Fénix funguje i pro kamaráda (`hurtP` → `withPl`). Zlato Lišky na konci se v co-opu nepočítá. Test `tests/tools/coppets.js`.
- **Testy:** `tests/tools/pets.js` (všech 8 v běhu + screenshoty obrazovky, karty, truhel), `petshot.js` (detaily mazlíčků), `petbal.js`/`petbal2.js` (balanc).

## Efekty a věže (11/2026)
- Částice `run.parts` mají druhy `k`: bez = čtvereček, `chunk` (kus spritu z `shatter(img,cx,top,gy,n,pow)` – rozpad nepřítele/věže), `smoke` (roste, `grow`, `drag`, `a`), `streak` (jiskra se stopou, `sparks()`), `ember` (blikající uhlík, světlo). Přidávat přes `addP()` (limit `P_MAX`=520). `smokePuff()`.
- Zásah: `e.sq` = squash při vykreslení, čísla mají oblouk (`vx/vy`), krit má `!` (glyf v `DIG`). Smrt: kousky spritu + kouř + jiskry + `pop`.
- Fx: `boom` (fáze záblesk → ohnivá koule s laloky → tmavne), `shock` (rázová vlna bez poškození, i u dropu ultimátek, barvy `ULT_COL`), `scorch` (spálená zem), `burn` s plamínky `flame(g,x,y,h,w,seed)`, blesky přes `zap(g,pts,col,al,core)` s větvemi, frost ring s jinovatkou.
- Věže: větší sprity 16 řádků, `drawTower()` kreslí vršek podle typu (kuše `SPR.misc.xbow` míří na `t.aim`, plameny, krystal `SPR.misc.ice`, jiskry cívky), úroveň 2 = zlatý pás + prapor (`TW_FLAG`), 3 = dva prapory, `t.born` = animace vyrůstání. Střely vylétají z vršku věže.
- Test: `tests/tools/vfx.js`, `vfx2.js` (detailní snímky efektů), `vfxperf.js` (fps v těžkém boji).

## Hotovo
Survivors základ, 4 hrdinové, 3 mapy, věže + Stavitel, krystal v poušti, testovací režim, rytmická chiptune hudba, propracovaný pixel art (hřbitov ve stylu Graveyard Keeper), žebříček + cloud save + přezdívka/PIN, hosting na GitHub Pages, joystick ve 3 režimech + multitouch, čitelnější písmo, plynulý šikmý pohyb (kamera), propracovaná poušť (chrám, oázy s léčením, kostra obra), propracované doly (koleje, rozjeté vozíky, těžní věž), skrytý testovací režim (podržení „Hudba“ 3 s), fúze zbraní (4 ultimátky I–III, rytmický rituál, drop na frázi, hudební vrstvy), online co-op pro 2 (WebRTC, lobby s kódem, oživení, rytmické pouto), oprava zvuku po zamčení telefonu, progrese: materiály map, úrovně hrdinů a talenty, výbava s raritami, obchod s truhlami, kovárna, Noční můry I–V, legendárky, Sbírka, denní výzva, hezčí menu (pixelové rohy, ikony, živé pozadí), animace otevírání truhly, pohlednice map ve výběru, úkoly (Nástěnka: denní úkoly, svíčky, týdenní odměny, hledaní elity), audit hry (11/2026): zuřivý boss, žebříček výher podle času, věže nesnižují odměnu, víc zlata za čas, přehled buildu v pauze, drobné opravy textů. Velká aktualizace (11/2026): Bard, Mistrovství a tituly, zbraně Noty/Bumerang, pasivky, fúze Ozvěna a tajná Parní exploze, denní výzva se seedem a žebříčkem Dnes, sdílení výsledku, PWA, tutoriál, okno Novinky. Nová hudba per mapa (forma, nástroje, boss). Grafické sjednocení a oprava fullscreenu (iPhone z plochy), číslo verze v menu, okno Ovládání s výběrem joysticku, revize ekonomiky (vracení vylepšení, sloučení s výběrem slotu, víc Magmatitu na úrovně 15–20, nápověda k materiálům). Anglická lokalizace (celá hra, přepínač jazyka v menu). Šťavnatější efekty (rozpad nepřátel, výbuchy, blesky, stopy) a nové animované věže. Telemetrie běhů do Supabase a bot pro balanc. Vyladěná obtížnost podle bota (poušť, doly, NM, Stavitel, Bard). Ve výběru hrdiny lišta zlata/materiálů (`#selMats`) a potvrzení koupě hrdiny (`confirmHero` v `#newsPop`). Efektní ultimátky (nový vzhled všech fúzí, aura, náraz dropu). Průvodce hrou v menu. Přehlednější menu (6 tlačítek, horní lišta, Nastavení, Obchod a Síň slávy se záložkami). Kampaň: 2 kapitoly po 5 mapách, 8 nových map s vlastními mechanikami, grafikou a hudbou, 6 nových nepřátel, 8 bossů, legendárky kapitol, obrazovka kampaně, žebříček s výběrem mapy (viz `KAMPAN.md`). Plynulejší menu (okno Nastavení, náběh oken, pohlednice map jako soubory, menu bez přestavby map). Zpětná vazba z hry s malou denní odměnou (čtení přes `fbread.js`). Session 2026-11-07 odpoledne (07k–07u): viditelná písečná bouře, výběr titulu, moment smrti, pevná hlavička + navigace zpět, pás hrdinů, nová Síň slávy, vysvětlení rituálu, ceny s množstvím, sety kapitol + poklad kapitoly + nové ikony předmětů, limit výběru 10 s, Vybavení se záložkou Věže, karty věží s raritou + Věžová truhla, 5 nových věží (krypta, zvon, obelisk, písečný vír, oáza), 4 hrdinové budoucích kapitol se zbraněmi, rostoucí odměna za kombo, Vylepšení na 30 úrovní ve 3 hodnostech. Optimalizace velkých bitev + adaptivní kvalita (07v). Značky NOVÉ, zkrácené měny, pevná lišta měn, úvodní obrazovka, výraznější věže, ekonomika zlata a materiálů (07w). Noční můry jako obtížnost kapitoly I–III (07x). Kapitola III Hlubiny celá (4 mapy, 3 nepřátelé, 4 bossové, erupce, věže Výheň a Parní beran, set a legendárka, Kovářka), věže na vozech v Karavaně (07y). Kapitola IV Ledová říše, zbraně Zbrojmistra a Krotitele, výbava z kampaně jen za první výhry (08e). Bot (zkuseny) po vyladění 08f: kapitola IV 0–50 % výher, finále ~33 %, hrdinové přežívají 3,5–8 min. Strom vylepšení (08g, uzly s úrovněmi 08h). Bez Přebroušení (08i). Mazlíčci v co-opu (08j). Čtyři nové fúze (08k). Nekonečná krypta jako boss fight, hvězdy mazlíčků, věže a mazlíčci v Kovárně, žebříček Kombo, silnější hazardy, revize textů, výraznější novinky (08l). Nekonečná krypta jen na finále každé kapitoly (08m). Poslední verze: `GAME_VER` 2026-11-09b.

## Nápady / plán
- **Plán od uživatele (2026-11-07, schváleno, pořadí 1 → 2 → 5 → 3 → 4):**
  1. ~~Opravy~~ **hotovo 07k**: bouře, titul, smrt, náhledy map.
  2. **hotovo 07l** – Navigace a menu: pevná hlavička se Zpět + swipe od levého okraje + historie prohlížeče (Android zpět); hrdinové jako vodorovný pás stejných portrétů + detail (obrazovka Hrdina i Příprava, ať se kampaň a VYRAZIT vejdou); Síň slávy znovu (stupně vítězů top 3, vlastní řádek vždy vidět, mapy po kapitolách).
  3. **hotovo 07p** – Kapitoly a výbava: set 4 kusů na kapitolu v jejím vizuálním stylu (2 kusy bonus, 4 kusy jedinečná schopnost), drop z finálního bosse s pojistkou, finální poklad za 1. dokončení kapitoly = zaručený kus; revamp vzhledu itemů spojit se sety.
  4. **hotovo 07q–07s** – limit výběru, 4 hrdinové budoucích kapitol se zbraní odemčenou všem na úrovni 8 (současných 5 zůstává základ), arzenál věží.
  5. **první kolo hotovo (bot, `EKONOMIKA.md`)** – materiál za minutu 4, kombo roste, Vylepšení 30 úrovní. Klíč `dev_key` i tabulka `runs` jsou od 2026-11-07 v Supabase funkční (`fbread.js feedback|runs` čte) → **další krok: po pár dnech hraní porovnat ekonomiku a obtížnost se skutečnými daty z `runs`.**
- **Výkon – zbývá:** ověřit na iPhonu plynulost velkých bitev (07v); kdyby to nestačilo: stíny zapéct do spritů nepřátel, částice dávkovat podle barvy, prostorová mřížka kolizí.
- **Otevřené po 07y:** ověřit na telefonu sílu setů a karet věží, swipe zpět v iPhone aplikaci, obtížnost kapitoly III podle telemetrie (bot ji má těžkou pro hrdinu úr. 10). Další na řadě: **mazlíčci** (balík 5), pak kapitoly IV–VI.
- **Kampaň – zbývá (viz `KAMPAN.md`):** kapitoly IV–VI, úkoly/Mistrovství pro nové mechaniky, ověřit výkon tmy a mlhy na telefonu, ladit obtížnost map podle telemetrie.
- Co-op – zbývá (viz `COOP.md`): **ověřit naostro na dvou telefonech** (Supabase Realtime + WebRTC přes mobilní data/Instagram), Souhra, Duetní fúze, co-op karty pouta, co-op žebříček, návrat po odpojení.
- Fúze – Sbírka s ??? a tajné Parní exploze a Plamenný prstenec hotové, 10 fúzí celkem (08k). Zbývá: stat „Objevené fúze“ v žebříčku, další tajné recepty, kalibrace rytmu pro BT sluchátka.
- Progrese – zbývá (viz `EKONOMIKA.md`): ladění čísel podle testerů (ceny, drop materiálů), serverový inventář (fáze 6, podmínka monetizace), monetizace (fáze 7: nejdřív kosmetika/Kryptová cesta, placené truhly až po právní kontrole).
- Úkoly – zbývá: týdenní kontrakty (těžší, kombinují systémy, železná/zlatá truhla). Ladit cíle úkolů a Mistrovství podle testerů.
- Další nápady: kosmetika (vzhledy hrdinů, barvy pouta) jako odměny Mistrovství a později za peníze, víc tajných fúzí, týdenní kontrakty, push notifikace přes PWA (denní truhla), ověřit sdílení a instalaci na iPhonu/Androidu naostro.
- **Vydání na Google Play / App Store s monetizací – plán v `VYDANI.md`** (zatím nic nezačato). Pořadí: serverový inventář → Capacitor + Android build přes GitHub Actions → uzavřený test (12 testerů / 14 dní) → nákupy kosmetiky / reklama za odměnu → iOS. Platby jen přes nákupy v obchodech. První krok uživatele: založit Google Play účet.
- Ověřit naostro na telefonu: sdílení výsledku, instalace na plochu (Android), nová hudba, nové okno sloučení.
- Čekáme na feedback k balancu, hudbě a ovládání od testerů. **Balanc**: první kolo podle bota hotové (2026-11-07b). Po týdnu porovnat se skutečnými daty z `runs` (dotazy v `supabase-runs.sql`). Otevřené: Rytíř v poušti (nápad: talent/pasivka chránící krystal), Bard, náročnost hřbitova na NM s výbavou.
- Další nápady ze skillů: prostorová mřížka kolizí (výkon), serverová kontrola skóre, postupné odemykání menu, volba méně třesení/záblesků.

## 09l – vzhled Nástěnky a run (2026-11-09)
- Uživatel: bílé bloky na Nástěnce a stránka vkládání run působily „cheap“. Nově procedurální pixelové textury `qTexInit()` (CSS proměnné `--tx-paper`, `--tx-cork`, `--tx-wood`, `--tx-stone`, generované canvasem, žádné obrázky).
- Úkol = `.qnote` (připínáček, náklon, stín) + `.qn-in` (potrhaný papír přes clip-path, pečeť `seal_r/b/g`, rámeček ikony `.qn-ic`, hvězdy `qStarImg`). Svitky kontraktů mají dřevěné tyče (`.qscroll::before/after`), svíčky stojí na polici.
- Runy: `.pop-card.stone` (kamenná deska), řádky s objímkou `.rsk`, ukazatel úrovně `runePip(l)`, počet `.rcnt`; stejné pro sloty v předmětu a váček v Kovárně. Nové obrazovky ve stejném duchu: textury z `qTexInit`, ne ploché barvy.

## 09m – Souhvězdí (2026-11-09)
- Mechanika `sky` ve `FEATS`, odemkne ji finále `zatmeni` (kapitola VI). Tlačítko `#mSky` v menu (hvězdné pozadí) se ukáže až po odemčení, obrazovka `#scr-sky` (`openSky`, `renderSky`, plátno `#skyCv` 128×128 pixel art, `skyDraw`/`skyLoop`/`skyTap`).
- Data `SKY` (war, guard, build, tame, music): 7 hvězd (`st` souřadnice 0–100, `ln` čáry, `b` bonus), ceny `SKY_COST` 1,1,2,2,3,3,4 (16 na souhvězdí, 80 celkem). Hvězda jde rozsvítit od první nebo od rozsvíceného souseda.
- Body (`skySrc`) se **počítají ze save**, nekupují se: výhry `save.nmw` (1), finále `SKY_FIN` (3), zlaté medaile týdenní výzvy `save.sky.wg` (2, počítá se v `wkResult`), Mistrovství ze `SKY_ACH` (1). Uloženo `save.sky={lit:{id:bitmaska},wg,rw}`.
- Bonusy `skyApply(B)` na konci `heroBonus`. Dokončené: `skyW` +15 % na bossy/elity (`hurtEnemy`), `skyG` jednou za běh přežití se 40 % HP (`hurtPlayer`), `skyB` +1 věž (`tmax`), `skyP` mazlíčci, `skyM` širší okno fúze (`startFuse` wide).
- Vrácení bodů (`skyRespec`, ve hře „Vrátit body“, dřív „Zhasnout hvězdy“, uživateli to nebylo jasné) jednou týdně zdarma (`rw`=weekKey), jinak 10 Esence. Test `tests/tools/sky.js`, snímky `skyrs.js`.

## Předávka 2026-11-09 (verze 09m)
- Hotovo: 09l nový vzhled Nástěnky a run (textury), 09m Souhvězdí. Další: ladění obtížnosti kapitol V–VI a ekonomiky Nástěnky podle telemetrie, kapitola VII Prázdnota (most `zatmeni` → void připraven, nová mechanika do `FEATS`), co-op kampaň jen jako nápad.

- **Ověření nasazení na Pages (funguje):** `gh api repos/FastFapper69/pixel-krypta/actions/runs --jq '.workflow_runs[0] | [.head_sha[0:7],.status,.conclusion] | @tsv'` – běh „pages build and deployment“ pro poslední commit musí být `completed success`. Přímo `*.github.io` je ze sandboxu blokované (curl i WebFetch), proto vždy přes `gh`.

## 09n – místnosti v menu (2026-11-09)
- Přání uživatele: ručně dělaný vzhled i mimo Nástěnku. Sekce mají třídu `room` + druh: `armory` (Vybavení: hero, towers, pets), `market` (Obchod: chests), `smithy` (Kovárna: forge, shop), `hall` (Síň slávy: master, codex, board). CSS blok „09n: rooms“ na konci stylů.
- Nové textury v `qTexInit`: `--tx-wall` (cihly), `--tx-dwood` (tmavá prkna), `--tx-iron`, `--tx-bronze`, `--tx-velvet`, `--tx-blue` (plánek), `--tx-wicker`, `--tx-cloth`/`--tx-cloth-d` (praporky); nýty `--rv` (4 radial-gradienty do rohů). `qTexInit` se volá v `setState` pro `room` obrazovky a hlavně **v klidu ~1 s po startu** (requestIdleCallback), aby první otevření nesekalo.
- **Záložky `.sectabs` všude** = látkové praporky na dřevěné tyči (aktivní červený se zlatým lemem a delší). Nadpisy `.room .sec` a `.smithy .fsec` = dřevěné cedulky se dvěma hřebíky.
- Vybavení: karta hrdiny tmavé dřevo v železném rámu, sloty železné pláty s nýty (rarita stále jako vnitřní rámeček), inventář otevřená truhla, věže modré plánky na korkové desce, mazlíčci proutěné košíky. Obchod: markýza (mask se zaoblením), truhly na policích, ceny = papírové visačky (`.card.chest>.btn`). Kovárna: železné pláty, kovadlina pod úvodem, strom Vylepšení na pergamenu s dřevěnými tyčemi. Síň slávy: Mistrovství kamenné (zamčené) / bronzové plakety, Sbírka vitrína se sametem.
- Snímky: `tests/tools/texshot.js prefix [cs|en] [obrazovky]` (env `SCROLL=1` přidá snímky v polovině a na konci), struktura DOM `tests/tools/domdump.js obrazovky`.

## Předávka 2026-11-09 (verze 09n)
- Hotovo: 09n místnosti v menu. Další: ladění kapitol V–VI a ekonomiky Nástěnky podle telemetrie (zatím jen ~24 běhů), kapitola VII Prázdnota, případně stejný vzhled pro Přípravu, Průvodce a co-op.

## 09o – oprava ukládání (2026-11-09)
- Chyba od 09h: `loadSave` načítá jen vyjmenované klíče a `SYNC_KEYS` posílá do cloudu taky jen vyjmenované. Chyběly `feat, featNew, featSum, storyNew, runes, runeDay, sky, wk, twU` → karta Cesta mechanik při každém spuštění, runy, Souhvězdí a týdenní výzva se po restartu ztrácely.
- **Pravidlo: každý nový klíč `save.X` přidej do seznamu v `loadSave` i do `SYNC_KEYS`.** Kontrola `node tests/tools/savekeys.js` (spusť před každým pushem, když přibude nový klíč), test restartu `tests/tools/featreload.js`.

## 09q – Kovárna (2026-11-09)
- Přepnutí záložek jedné skupiny (sectabs) dá nové obrazovce třídu `tabsw` (v `setState`): obrazovka se neanimuje z průhlednosti, animuje se jen obsah pod hlavičkou → neprobliká mapa v pozadí. Pozor na specifičnost: pravidlo `.scr:not([hidden]):not(#scr-levelup):not(#scr-fuse)` obsahuje ID, přebíjet stejným `:not(#…)`. Test `tests/tools/tabflash.js`.
- Strom Vylepšení: spojnice `.tln` jednotné inkoustové (dřív barevné jen u koupených = působilo levně), podtržení nadpisů sloupců taky jednotné. Snímek `tests/tools/treeshot.js`.
- Menu makety (09q odpoledne): uživatel zamítl A/B/C (jen obdélníky s texturou), koncepty H1 rozcestník s předměty a H2 výklenky jsou v `tests/tools/mock`, zatím odloženo („zatím to nech být“).

## 09r – zásady z gamedev skillů (2026-11-09)
- **Ukládání:** `SAVE_VER` + `SAVE_MIG` (řetěz převodů celé savu) + `migrateSave()` pro lokální i cloudový save; `loadSave` načítá **všechny** klíče kromě `LOCAL_KEYS` (nastavení zařízení: zvuk, hudba, ovládání, `vol`, `shk`, nick…), `syncKeys()` posílá do cloudu vše kromě nich. Záloha `pixel-krypta-v1-bak` = save, se kterým začalo sezení; poškozený JSON se obnoví z ní. Nový klíč save už nikam zapisovat nemusíš; nový klíč, který patří jen zařízení, přidej do `LOCAL_KEYS`. Test `tests/tools/savekeys.js` (načtení, sync, záloha, verze).
- **Výzvy:** `seedRng` vytvoří i oddělené řady `GR.s` (kdo se spawne), `GR.p` (kde), `GR.u` (nabídky úrovní); `withRng(k,f)` obaluje `updateSpawns`, `spawnEnemy`, `openLevelUp`. Efekty dál berou `Math.random` (počet závisí na FPS), takže denní/týdenní běh je stejný pro všechny. Test `tests/tools/dailysame.js` (jiný dt + šum v náhodě). Pozor: test musí každý běh pouštět na znovu načtené stránce (dvojí obalení dávalo falešné duplikáty).
- **Otřes:** `shakeOff()` – `run.shake` 0–9 → trauma, výchylka trauma²×6 px po hladkých sinech; `save.shk` posuvník síly, `RM` = žádný.
- **Zvuk:** `busVol(k)` (vypínač × posuvník², `save.vol={m,s}`), `M.duck` mezi hudební sběrnicí a filtrem, `duckMusic(db,hold)` při `boss` (−10 dB), `death` (−12 dB), první drop ultimátky (−6 dB).
- Nastavení: blok `.vols` s posuvníky hudba/efekty/otřesy, test a snímek `tests/tools/vols.js`.

## 09s – gesta a štítky (2026-11-09)
- **Gesto zpět na iPhonu (aplikace z plochy):** `navArm` tam nezapisuje historii (`navigator.standalone`) – iOS by z ní udělal vlastní swipe-back se snímkem stránky a kreslily se tři vrstvy přes sebe. Zůstává herní tah od okraje; u obrazovek s `[data-back]` ukáže pod sebou menu (ztmavené, parallax). V prohlížeči a na Androidu historie zůstává kvůli tlačítku zpět. Test `tests/tools/edgeback.js`.
- **Přejíždění mezi záložkami:** vodorovný tah (ne od levého okraje, ne v posuvníku nebo vodorovně rolovaném řádku) klikne na sousední tlačítko v `.tabs.sectabs` aktuální obrazovky (zamčené záložky tak ukážou svou hlášku). `tabSwipeDir` → nová obrazovka vjede z dané strany (`@keyframes tabIn`, `--tx/--ty`). Test `tests/tools/tabswipe.js`.
- **Štítek rarity** `.tslot small.rp` bez zděděného stínu (vypadal jako druhý řádek), malými písmeny, úroveň zvlášť jako `.tlv` v rohu. Test `tests/tools/rplabel.js`.

## 09t – strom Vylepšení (2026-11-09)
- Nadpis „Klíčové“ (`.tsep`) uživatele mátl (vypadal jako štítek jen prvního uzlu). Teď je to předěl přes celý sloupec: inkoustová linka s kosočtvercem + „Nové schopnosti“ (nad = bonusy k číslům, pod = uzly s novou schopností). Snímek `tests/tools/treesep.js`.

## 09u – karty věží a náhled hrdinů (2026-11-09)
- **Štítek rarity** na kartách Arzenálu/mazlíčků: malý vycentrovaný čip dole (`.tslot small.rp`), `fitCards(root)` zmenší jména a čipy jen když se nevejdou (min. 8 px) a celé řadě dá stejnou velikost. Arzenál má 5 stejně širokých sloupců. Kontrola vzhledu **zvětšeným výřezem** `tests/tools/chipshot.js prefix [cs|en]` (všechny rarity, nejdelší jména) – uživatel opakovaně žádá: po každé vizuální změně udělat zvětšený snímek a opravdu ho prohlédnout (zarovnání, oříznutí, zdvojení), ne jen měřit, že se text vejde.
- **Zamčený hrdina v Přípravě:** ťuknutí vždy otevře detail (`confirmHero`), `heroLock(id)` vrací důvod (kapitola/mapa, Mistrovství, „přijde s kapitolou“); bez zámku a bez zlata ukáže „Chybí ti“ a jen „Rozumím“. Cena jako tabulka `.hcost`. Test `tests/tools/heroprev.js`.
- 09v: `fitCards` čeká na načtení písma (`document.fonts.ready`) – dřív měřil se záložním písmem a čip pak přetekl; jména se zmenšují každé zvlášť (bez dělení slov), čipy mají v řadě jednotnou velikost; pod 370 px užší mezery Arzenálu. Test na 360/375/393/430 px: `tests/tools/fitrow.js W cs|en [snímek]`. **Push jen když testy prošly** (v 09u se commit odeslal i s neprošlým testem).

## 09w – Přidat na plochu (2026-11-09)
- iOS **nemá žádné API**, kterým by stránka přidala ikonu sama (Safari ani Chrome/Edge/Firefox na iPhonu; beforeinstallprompt tam není, ověřeno 11/2026). Skutečná instalace jedním ťuknutím jen přes `beforeinstallprompt` (Android/desktop Chromium) – `pwaInstall()` ji použije, když `pwaEvt` existuje.
- Jinak `pwaGuide()` podle prohlížeče (`iosBrowser()`: CriOS/EdgiOS/FxiOS/Safari, Android bez okna): 3 kroky s ikonami (`SVG_SHARE/MORE/DOTS/PLUS`) a blikající šipka `.ig-arrow` (b/br/tr) k místu tlačítka. Tlačítko v Nastavení i na Androidu bez instalačního okna. Test a snímky `tests/tools/pwaguide.js prefix [cs|en]`.

## 09x – Souhvězdí dlouhodobě (2026-11-09)
- Uživatel: hvězdy málo výrazné, vše se odemkne moc rychle (80 ✦ na vše, body z výkonů ~120+). Nově **úrovně hvězd** `save.sky.rk[c][i]` (0–2 navíc k rozsvícení), `SKY_RK=3`; zjasnit jde jen v dokončeném souhvězdí (`skyCanUp`), cena L→L+1 = `SKY_COST[i]+2L` (`skyNextCost`), bonus ×úroveň v `skyApply`, `skySpent` počítá i úrovně, Vrátit body vrací i úrovně. Vše na 1. úrovni 80 ✦, vše na maximum 450 ✦ – každá nová kapitola přidá další body z Nočních můr a finále.
- Kreslení: každá hvězda má jemnou záři; otevřené pulzují kruhem (dostupné v barvě souhvězdí), větší hvězda = vyšší úroveň, malý třpyt = jde zjasnit. Úroveň jako kosočtverečky v panelu (`.sk-pips`). Test `tests/tools/skylv.js prefix [cs|en]`.
- **Právní kontrola (9. 11. 2026):** viz PRAVNI.md – co je v pořádku a co vyřešit před vydáním (GDPR, přezdívky, truhly za peníze, hosting).

## 09y – soukromí, moderace, písma ve hře (2026-11-09)
- Písma `fonts/*.woff2` (@fontsource, latin + latin-ext) a `vendor/supabase-2.45.4.js` jsou přímo v repu, licence v `licenses/`. Žádné Google Fonts ani jsDelivr. SW cache `krypta-v3`. Testy mají symlinky `tests/tools/{fonts,vendor,licenses}` → snímky teď ukazují skutečná písma.
- Přezdívky: `nickBad()` ve hře = `public.nick_bad()` na serveru (stejný seznam kořenů a výjimek – měnit oboje), trigger `profiles_nick_check` kontroluje jen novou/změněnou přezdívku. Žebříček: ťuknutí na hráče → `playerMenu` (nahlásit do `public.reports`, skrýt do `save.blk`), `profiles.hidden=true` skryje profil všem (moderace: projít `reports where done=false` do 24 h).
- Nastavení → Soukromí a licence (`openPrivacy`): zásady (zkrácený `PRIVACY.md`), licence, zobrazit skryté hráče, Smazat moje data (`rpc delete_my_data` smaže feedback, runs, reports, profil i auth uživatele + localStorage). Test `tests/tools/privacy.js prefix [cs|en]`.
- Zásady v `PRIVACY.md` – před vydáním v obchodech doplnit jméno/firmu a e-mail provozovatele.

## Předávka 2026-11-09 18:45 (verze 09y, vše na main, Pages nasazené)
- Dnes hotovo: 09n místnosti v menu, 09o–09r oprava a pojistky ukládání (verze, záloha, sync všeho kromě `LOCAL_KEYS`), férová denní/týdenní výzva, plynulé otřesy, posuvníky hlasitosti, ducking; 09s–09w gesta (přejetí mezi záložkami, zpět na iPhonu), štítky věží, náhled zamčených hrdinů, předěl Nové schopnosti, návod Přidat na plochu podle prohlížeče; 09x zjasňování hvězd v Souhvězdí; 09y soukromí, moderace přezdívek, smazání dat, písma ve hře.
- Skilly projektu: `.claude/skills/pixel-ui-art-direction`, `.claude/skills/gamedev-zasady` (+ `nova-kapitola`).
- **Před nasazením změny menu vždy `node tests/tools/menucheck.js`** (poučení z 09z, viz skill pixel-ui-art-direction).
- Pravidla od uživatele: po každé vizuální změně zvětšený snímek a opravdu ho prohlédnout (CZ i EN, malý iPhone); pushovat jen když projdou testy; ověřit nasazení přes `gh api …/actions/runs`.
- Otevřené: makety menu H1/H2 odložené (`tests/tools/mock`); kapitola VII Prázdnota; ladění kap. V–VI podle telemetrie; před vydáním: jméno/e-mail provozovatele do `PRIVACY.md`, vlastní doména, rozhodnutí o truhlách za peníze (PEGI 16, Belgie), TMview; moderovat `reports` do 24 h.

## 09z – kované tlačítka hlavního menu (2026-11-09)
- Podle předlohy uživatele (herní, ale pixelová duše). Rámy kreslí `bartDraw(kind,aw,ah,ex)` po pixelech (1 px kresby = `BART_S`=3 css px), obrázek je v `<i class="bart">` uvnitř tlačítka (ne `::before` – ten používá zámek `.flock`). Kreslí se v přesné velikosti tlačítka a hned se zvětší po celých pixelech na rozlišení displeje (Safari jinak rozmaže).
- Druhy `BART_KIND`: `play` zlatá deska v železném rámu, `coop` fialový, `hero` rohy, `forge` výheň (teplý nádech dole), `shop` markýza, `quest` dřevěný rám s hřeby, `sky` hvězdné nebe ve zlatém rámu (hvězdy se vyhýbají textu – `ex` z naměřené šířky popisku), `ico`/`cur` malé rámy nahoře. Nové ikony 16×16 `MICO` + `micoUrl` (meč, helma, kovadlina, truhla, svitek).
- `bartAll()` = `bartFit()` (stejná velikost písma ve dvojicích, zmenší se jen když se nevejde) + překreslení; volá se z `refreshMenu`, ResizeObserveru a po načtení písem; `fitMenuCur` po přepsání obsahu volá `bartApply`.
- Štítky NOVÉ (`.new::after`, `.newtag`) mají `text-shadow:none` – jinak dědí stín z tlačítka a na každém vypadají jinak tučně.
- Horní lišta `#mTop` je plná (#0e0b14 + pixelová hrana), **žádný průhledný přechod** – na iPhonu se slil s rámy ikon a vypadaly rozmazaně (uživatel 9. 11.). Rám `.bart` je **`<canvas>` v pixelech displeje** (`devicePixelRatio`) posunutý na celý pixel podle `getBoundingClientRect` (`snap`). **Nepoužívat `isolation:isolate` ani `z-index:-1`** – na iPhonu z toho vznikla samostatná vrstva na zlomku pixelu a rozmazalo se celé tlačítko i s ikonou; obsah tlačítka má `z-index:1`, plátno `0`. Lišta má `align-items:flex-start` a celočíselné výšky.
- **iOS 26 kreslí u horního okraje stránky vlastní plynulé rozmazání** (scroll edge effect, nejde vypnout CSS). Ikony v něm vypadaly rozmazaně (spodek ostrý, vršek rozmazaný – poznáš podle toho). Proto `#mTop` začíná na `--sat + 30px` (na nízkých displejích +14). Stejně pozor na HUD ve hře a hlavičky obrazovek – nic důležitého těsně pod bezpečný okraj.
- `fitMenuCur` vkládá rám až **po** vejití materiálů (plátno přečnívá → `scrollWidth` by vyhodil všechny materiály). Holý text v tlačítku (Souhvězdí) obalí `bartWrap` do `.lbl`, jinak ho plátno překryje.
- Zamčené: neprůhledné, šedé, zámek visí na horním okraji vlevo. Krátké displeje (≤700 px) mají menší mezery.
- Snímky: `tests/tools/homeshot.js prefix [cs|en] [šířka] [výška]` (env `ZOOM=1` výřez, `PRESS=1` stisk, `FRESH=1` nový účet, `SKY=1` Souhvězdí).

## Předávka 2026-11-09 ~20:30 (verze 09z)
- Hotovo: 09z kované menu. Další podle uživatele; stejný styl se dá přenést na tlačítka v Přípravě a výsledcích běhu.

## Předávka 2026-11-09 20:05 (verze 09z, vše na main, Pages nasazené)
- Hotovo: 09z kované menu (pixelové rámy tlačítek a horní lišty, ikony MICO, štítky NOVÉ, lišta pod rozmazáním iOS 26, materiály a Souhvězdí opravené), povinná kontrola `tests/tools/menucheck.js`, poučení ve skillu pixel-ui-art-direction.
- Uživatel potvrdil na iPhonu (20:11): ikony nahoře ostré – posun lišty na `--sat + 30px` funguje, platí i pro další obrazovky.
- Možné další kroky: stejné rozmazání iOS u HUD ve hře a hlaviček obrazovek; kovaný styl i pro tlačítka v Přípravě a výsledcích běhu; kapitola VII Prázdnota; ladění podle telemetrie.

## 09z2 – kámen a železo, kovaná tlačítka všude (2026-11-09)
- Přání uživatele: kovaná tlačítka všude, pryč s dominantní fialovou. **Paleta:** podklad kámen/železo (`--bg #131518`, `--panel #212429`, `--panel-hi #2e3137`, `--line #4b4f5a`, `--fg #f8f7f4`, `--muted #b3b0a9`), zlatá = hlavní akce, karmínová = Noční můra, červená = upozornění. **Fialová jen pro Epické předměty a kouzla.** Nové barvy UI nevolit do fialova (odstín 245–330°).
- Přebarvení bylo pravidlem (tlumené fialové v CSS → břidlice/kámen, výrazné fialové s chroma > 0,3 zůstaly). Ručně: praporky `--tx-cloth-d` šedé, samet `--tx-velvet` rudý, nebe `skyBg` tmavomodré, tlačítko Souhvězdí tmavomodré, co-op rám bronzový (`BART_PAL.pur`).
- **Tlačítka `.btn:not(.art)`** = rám jen z CSS vrstev (`background` gradienty: destičky s nýty v rozích, obrys, zkosená hrana `--fh/--fl/--fd/--fdd`, zapuštěná linka, výplň `--f1/--f2/--f3`), žádné obrázky ani plátno → ostré i na iPhonu. Varianty přes proměnné: `.alt` železná výplň, `.danger` červený rám, `#goBtn.nm` karmínová výplň, `.sm`/`.ic` menší jednotka `--u:2px`. **Nepřepisovat `background` u `.btn` jinde** (zničí rám) – měnit jen proměnné. Cenovky v Obchodě (`.market .card.chest>.btn`) zůstávají papírové.
- Přepínače `.tabs:not(.sectabs) button` a `.nmtabs button` = malé železné destičky, vybraná zlatá (NM karmínová).
- Snímky všech obrazovek: `tests/tools/_scr.js prefix cs|en obrazovky` (menu, select, hero, towers, pets, chests, forge, shop, quests, master, codex, board, guide, sky, settings, news, coop, confirm, feat), běh `tests/tools/_game.js prefix cs|en` (HUD, nová úroveň, pauza, konec běhu).

## Předávka 2026-11-09 ~21:00 (verze 09z3)
- Hotovo: audit projektu (`AUDIT.md`), skill `audit-projektu`, `tests/tools/audit.js` + `lib.js`, oprava duplicitní `duckMusic` (ztlumení hudby z 09r konečně funguje).
- Čeká na rozhodnutí uživatele (viz AUDIT.md): limit pokusů PINu (vysoká), žebříček bez cizích savů, ověřit horní okraj HUD na iPhonu, plynulost menu, úklid tests/tools a zeštíhlení tohoto souboru.

## 09z4 – bezpečnější účty (2026-11-09)
- **Server mluví s hrou jen přes funkce:** `my_profile()` (vlastní nick+save), `save_profile(p_nick,p_save,p_stats)` (ukládání; max 256 kB savu), `claim_profile_v2(nick,pin)` → `'ok'|'bad'|'locked'|'auth'` (zámek: 5 chyb/h nebo 20/den na přezdívku, 15/h z účtu; pokusy v `private.pin_fail`). Stará `claim_profile` smazaná. **Sloupec `profiles.save` nikdo kromě funkcí nečte** – nepřidávat `select('…save…')` ani `upsert` do `profiles` (upsert potřebuje SELECT na všech sloupcích).
- Žebříček čte jen `id,nick,stats,hidden`; vizitka hráče `stats.card={av,tl,cl,hc}` z `boardCard(sv)` (pro staré řádky fallback ze savu). Nová veřejná informace v žebříčku = přidat do `boardCard`, ne číst save.
- Migrace v `supabase/migrations/` (číslované podle data). Serverové změny nejdřív nanečisto: `DO $$ … raise exception 'VYSLEDEK: %' $$` se `set local role authenticated` a `request.jwt.claims` – vše se vrátí.
- Test bez serveru: `tests/tools/cloudstub.js` (je v auditu).

- Uživatel potvrdil (21:02): po 09z4 přihlášení, ukládání i žebříček fungují.

## 09z5 – pauza se záložkami, oslava hrdiny, kontrola skóre (2026-11-09)
- **Skóre:** `save_profile` volá `stats_clean(old,new,čas od posledního uložení)` – ořízne nemožné hodnoty (běhy max +3 + 1 za 20 s, výhry ≤ běhy, zabití ≤ 40/s běhu a 40 000/běh, čas ≤ 3600 s, kombo ≤ 20 000) a zapíše do `private.cheat_log` (projít v auditu: `select * from private.cheat_log order by at desc`). Přímý INSERT/UPDATE do `profiles` je zakázaný. Migrace `20261109d_stats_check.sql`.
- **Horní okraj:** `#hud` a `.head` obrazovek začínají na `--sat + 30/32px` (iOS 26 rozmazání). Test `tests/tools/topcheck.js`.
- **Pauza:** `renderPauseBuild` + `pauseTab` ('run'|'hero'|'q'): nahoře čas/úroveň/zabití + pruh zdraví, záložky Výbava (zbraně, pasivky), Hrdina (dlaždice `.pt`, zlatě `.up` nad základem; hodnoty z `st` po `recalc`), Úkoly (`Q.q` s živým `qProg(q,qSnap())`, popis `q.xs[k]`, kontrakty `save.qw.k`). Rámeček `.pbuild` má skutečný `border` (inset stín text při posunu přetékal). Test `tests/tools/pausetabs.js`.
- **Oslava:** `celebPop(cls,html,after)` (záblesk, paprsky, jiskry `.hs`), `heroCelebrate(id)` po koupi v `confirmHero` a po Mistrovství s hrdinou, `weaponCelebrate(wid)` při dosažení `W_UNL_LV` hrdiny v Hrdinovi. `save.wNew` = nově odemčené zbraně: hláška na začátku běhu, v nabídce úrovně karta `.fresh` se štítkem `.frk` (pak se z `wNew` smaže). Test `tests/tools/celeb.js`.

## 09z6 – úder ultimátky (2026-11-09)
- Rytmus (`conductor`) běží i mimo stav `play`, `gameStep` jen ve hře → nabídka úrovně otevřená během náběhu zahodila úder `ULT_DROP` (krok `s%64===0`). `ultHold(dt)` v `update` odloží `openLevelUp`, když hráč má ultimátku s úderem a další krok `M.step%64` je ≥ 46 nebo 0; max 3 s (`run.ultHoldT`), ne v co-opu. Test `tests/tools/ulthold.js`.
- Úklid: CLAUDE.md 112 → 15 kB, historie sem, mapa kódu `docs/KOD.md`, 39 skriptů do `tests/tools/archiv/`, opravené `nmtest.js` (karta Cesty mechanik zakrývala klikání) a `pets.js` (mazlíčci zamčení Cestou).

## 09z7 – rozdělení souborů, angličtina jen pro EN, vynucené přejmenování (2026-11-09)
- `index.html` (1,1 MB) rozdělen na `index.html` (kostra, ~20 kB), `krypta.css` (styly, pořadí bloků zachované) a `game.js` (celé IIFE). Odkazy nesou `?v=GAME_VER` kvůli cache GitHub Pages (max-age 600) a Instagram prohlížeči bez service workeru; audit „Verze souborů“ hlídá shodu. Rozdělení ověřené pixelovým porovnáním 38 snímků obrazovek před/po (rozdíly jen v náhodném pozadí).
- Jazyk rozhoduje malý skript v `index.html` (`window.KRYPTA_LANG`, stejné pravidlo jako `LANG`), `lang-en.js` se přes `document.write` stáhne jen pro EN. Čeština ušetří 227 kB.
- `sw.js` cache `krypta-v4`: předem game.js a krypta.css (lang-en.js už ne), z cache se mažou staré `?v=` kopie, offline se soubor najde i bez dotazu.
- Testy: `lib.src()` vrací spojený zdroják pro statické kontroly (audit, i18n, savekeys), `lib.prep()` kopíruje game.js a krypta.css k off.html; `cloudstub.js` testuje vynucené přejmenování.
- Server: `profiles.rename_req`; `my_profile()` ho vrací; `save_profile()` nově dělá UPDATE místo INSERT … ON CONFLICT (trigger filtru přezdívek běžel i na pokus o INSERT, takže starý profil se závadnou přezdívkou se nemohl uložit ani beze změny jména). Nová přezdívka zruší `rename_req` i `hidden`. Hra při `rename_req` otevře okno „Nová přezdívka“ bez tlačítka Zpět a bez PINu, z menu se do něj vrací, dokud se nové jméno neuloží. Jediný takový hráč v žebříčku je označený.

## 09z8 – jednotné menu (2026-11-09)
- `bartDraw`: co-op a Nástěnka z bronzu/dřeva na železo (palety `pur`/`wood` odstraněné, i léta dřeva a hřeby), Vybavení bez kostěných rohů. Vlastní vzhled zůstal jen Hrát a Souhvězdí.

## 09z9 – nový zvuk (2026-11-09)
- Měření (offline render, `tests/tools/zvuk.js`): 65–80 % energie pod 200 Hz, téměř žádné výšky, klid/běh/boss se lišily o 1–3 dB (master kompresor s měkkým kolenem 30 dB stlačoval vše nad ~−29 dB), styl forge o 4 dB hlasitější, plánování not kolísalo s FPS (9 % not o víc než 10 ms vedle při zasekávání).
- `musicGraph()`: role nástrojů se stereem (pad Haas 14 ms, arp vlevo, lead mírně vpravo) a generovaným dozvukem, `STYLE_TRIM` (forge −8 dB), `STYLE_REV`, `ENERGY_GAIN`, telefonní basy (saturace + highpass 170 Hz), highpass 35 Hz, lowshelf −3 dB.
- `masterChain()`: `MASTER_PRE` .32 → kompresor (tvrdé koleno, poměr 2,5) → limiter −3 dB. Výsledek: klid→boss ~12 dB místo ~8, běh všech stylů kolem −31 dB.
- Časování: `M.off` = vyhlazený rozdíl zvukových a herních hodin (krok .06, skok nad .12 s) → simulace zasekávání: noty o víc než 10 ms vedle 9 % → 3 %.
- Opravy: `duckBeat` a smrt zapisovaly do `musicBus` pevné .3 a přebily posuvník hlasitosti (teď přes `M.duck`).
- Skill `.claude/skills/zvuk-a-hudba`.

## 10a – poslech a mix nástrojů (2026-11-10)
- Nástroje `poslech.js` (nahrávka výstupu hry v reálném čase přes ScriptProcessor na `M.master`, log efektů v `M.log`), `poslech-offline.js` (stereo offline render, `musicRender(...,{ch:2,solo})`), `poslech.py` (spektrogram, LUFS, simulace reproduktoru telefonu, stereo, rytmus vs. offline).
- Nález: 95 % energie 100–300 Hz, melodie/arp/pad 15–40 dB pod bicími → mono (korelace 1,0), přes telefon −15,6 dB. Rytmus hra = ideální render (14 vs. 15 ms, synkopy), kolísání nenalezeno.
- Oprava: `ROLE_DB` + `STYLE_ROLE` (dB na nástroj a styl), peaking 2,5 kHz +3 dB, telefonní harmonické highpass 400 Hz, `STYLE_TRIM` přeměřen, `MUSIC_LVL` 1,9, `MASTER_PRE` .55, `ENERGY_GAIN` [.82,.92,1,1.12]. Výsledek (hrbitov naostro): ztráta přes telefon 3,8 dB, pásmo 300 Hz–2 kHz 40–75 %, šířka −15 dB, boss +9 dB nad během, LUFS −30 (bylo −31), špička −7 dB.

## 10k – nová grafika UI, první část (2026-11-10)
- Stavebnice `KIT` v `game.js` (kresba prvků s `data-k` podle velikosti, 1 pixel = 2 px), styly na konci `krypta.css`, písma Jersey 10/15/20. Specifikace `docs/GRAFIKA.md`, makety `tests/tools/mock/grafika/`.
- Nabídka nové úrovně: `optInfo` vrací `st` (dvojice popisek/hodnota z dat zbraní a `PASSIVES.x.st`), `luCard`, `luPaint`; test `lushot.js`.
- Pauza: `renderPauseBuild` + `pausePaint` (tři záložky, fúze jako rovnice, joystick ikonou s hláškou), `kSnap` pro celé pixely; test `pausetabs.js`.

## 10l – hlavní menu v nové grafice (2026-11-10)
- Podle návrhu, který uživatel poslal (obrázek z Gemini): scéna `#mScene` (`KIT` druh `crypt`: cihly, dlažba, mech, pavučiny, tečkované světlo od pochodní a ohniště; `menuScene()` ji natáhne od lišty po tlačítka a srovná podlahu pod nohy postav), živé plameny (`.k-flame`, `.k-fire`).
- Tlačítka menu kreslí `KIT` (`BART_MAT`, `kitBtn`) na mřížce 2 px: zlato, natřené dřevo, kámen, dub s markýzou, prkno nástěnky, noční kámen. Popisky Jersey 15/30 px, ve dvojicích při nedostatku místa Jersey 10/20 px (`#mStack.k20`). Horní lišta zatím stará.
- `KIT.paint` zvětšuje kresby už v obrázku na pixely displeje (`sharp`), prohlížeč nic nepřepočítává.

## 10m – horní lišta menu bez rámečků (2026-11-10)
- Přání uživatele: `bartApply` pro druhy `ico` a `cur` rám nekreslí, ikony 44 px (2× sprite), měny písmem Jersey 10.

## 10n – nová grafika v celé hře (2026-11-10)
- Písmo: všechny velikosti v `krypta.css` převedené na tři (Jersey 10/20 px, Jersey 15/30 px, Jersey 20/40 px), pravidlo `#app *` ruší tučné řezy, prostrkání a verzálky. Logo zůstává.
- Staré prvky kreslí stavebnice automaticky: `kAuto()` (tabulka `KA`: `.btn`, záložky, prapory `.sectabs`, cenovky, listy Průvodce) běží po změně stránky přes `MutationObserver` (`kaKick`, mimo stav `play`). HUD kreslí `hudPaint()` při vstupu do běhu.
- Místnosti: `#kRoom` (zeď `crypt` s `data-wall`, živé pochodně) za všemi obrazovkami menu; scény `astro` (Souhvězdí), `forge2` (Kovárna), `niche` + `.kslot` (Vybavení), `.k-hall` (Síň slávy), `.k-camp` (co-op) – podle návrhů z Gemini, které uživatel poslal.
- Méně textu: třída `kh` = vysvětlivka schovaná pod otazník (`kHelpSync`, `kHelpOpen`, `#kHelp`); Obchod: `chBadges` (záruka, denní limit), procenta bez opakovaného znaku.
- `KIT.toCanvas` přes ImageData, kresby v původní velikosti s `image-rendering:pixelated` (zvětšování v obrázku bylo pomalé).

## 10o – dotažení nové grafiky (2026-11-10)
- Příprava: denní výzva jako odznaky (čas, truhla, Úlomky), popisy výzvy a map pod otazníkem (`kh`). Talenty: tlačítka kreslí `kAuto` (runový kámen, vybraný zlato). Mazlíčci bez proutí, posuvníky v Nastavení jako drážka se zlatým závažím.

## 10q – kamenné karty, věže, oltáře, ostré písmo (2026-11-10; 10p mezitím vydal druhý chat)
- Všechny `.card`, `.brow`, `.tcard`, `.pop-card`, dlaždice předmětů a věží: kamenný rám tvrdými stíny (konec `krypta.css`), bez textur. Věže bez modrého vzoru. Kovárna: `onAltar` v `renderForge` položí první slučitelnou skupinu na oltáře `.k-forge`, ťuknutí otevře sloučení.
- Ostré písmo (připomínka uživatele z iPhonu): Jersey má pixel 75/1400 em (10), 50/1350 (15), 38/1292 (20) – ostré jen ve velikostech 18,6667 / 27 / 34 px (pixel písma = 1 CSS px) s řádkem 24 / 31 / 40 px (celé pixely nad i pod písmem). Dřív 20/30/40 px = rozmazané.
- Vybavení: inventář hned pod výbavou, karta hrdiny pod ním; dlaždice bez nápisů (zlatý rám = nasazeno, portrét = nosí jiný hrdina, pečeť `sealDot` = nové).

## 10s – Nástěnka v nové grafice (2026-11-10)
- `qNoteHtml`: nadpis = zadání `q.xs` (hravý název `q.t` jen jako `aria-label`), přehoz úkolu ikonou `reroll`; svíčky a odpočet jako ikony; text hledaného a postup lovu pod otazníkem (`kh`); „Bonus dne:“ pryč.

## 10t – nová Nástěnka a oprava kolize `data-k` (2026-11-10)
- Uživatel: Nástěnka „furt stejná a hnusná“. `qNoteHtml` → `.kq` (pergamen `KIT` slab parch, ikona v dubovém lůžku, koryto `.kq-bar` s číslem vedle), kontrakty → `.kc` (zaškrtávátka `boxOn/boxOff`, pohár + odměna), deska `.qboard` = dub, plakát hledaného = pergamen. Svíčky a týdenní pruh bez textur.
- **Chyba z 10n:** stavebnice používá `data-k` a `kAuto` přepisovala herní `data-k` u tlačítek → nefungovalo vyzvednutí týdenního kontraktu (`data-kc`), volba druhu zpětné vazby (`data-fk`) a staré přeskování (`data-rk`). Pravidlo do CLAUDE.md.

## 10u – vybraná mapa v Přípravě (2026-11-10)
- Připomínka uživatele: výběr mapy nebyl vidět. Kamenný rám karet z 10q přebil `.mnode.sel` a popis mapy byl od 10o pod otazníkem. Teď `.card.mnode.sel` zlatý rám + `.mdesc` s popisem vybrané mapy.

## 11a – čitelný plakát hledaného (2026-11-11)
- Připomínka uživatele: text na plakátu špatně čitelný. Třída `.ka` (stavebnice) dává černý stín textu, na světlém pergamenu ho zdvojovala. Na pergamenech (`.poster.ka`, `.gd.ka`, `.kq`, `.kc`) stín vypnutý, tmavší inkoust.

## 11b (11. 11. 2026) – grafická kontrola celé hry
- Nový test `tests/tools/grafcheck.js`: projde všechny obrazovky, okna a stavy běhu (CZ/EN, SE/15) a hledá rozmazané velikosti písma, tmavý text s tmavým stínem, text mimo displej nebo přes rám, překrývající se texty (jen viditelné, ořezané scrollováním) a nevykreslené prvky KIT.
- Opravy: nadpisy oken 24/26/28 px → `--k30`; `small` dědí velikost (prohlížeč dával 15,56 px); balíček věží bez nápisů (jméno se zmenšovalo o 1 px), rarita jako barevný proužek; lišta věží neprosvítá do výsledků běhu; NOVÉ v menu nahrazeno pečetí `sealDot` (na iPhonu SE zakrývalo název tlačítka).

## 11c (11. 11. 2026)
- Souhvězdí: záložky jako posuvný pruh do strany (karty 104 px, scroll-snap, vybrané se posune doprostřed). Je to 5 témat (Válečník, Strážce, Stavitel, Krotitel, Hudebník) společných pro všechny hrdiny, ne hrdinové.
- Lišta věží v boji: `data-s` byl id věže, ale KIT ho bere jako semínko otlučení rámu → každé tlačítko mělo jinak vysoký spodek a ceny vypadaly posunuté. Teď `data-tw`.

## 11d (11. 11. 2026)
- Nápověda `#kHelp` (pergamen): text bez stínu, tmavý inkoust, jen řez 400 (Jersey nemá tučný – syntetický byl rozmazaný), řádky zdrojů hvězdných bodů jako zápis v knize. Tlačítka v kopii nápovědy předávají klik originálu (Vrátit body dřív nefungovalo), neaktivní se skryjí. `grafcheck.js` prochází i nápovědy (help_sky, help_hero, help_select).

## 11e (11. 11. 2026)
- `audioInit()` hned při startu (po `setSong(menu)`): v prohlížečích, které to dovolí, hraje menu bez dotyku; jinde (iOS Safari/PWA) zůstane kontext `suspended` a rozjede ho první dotyk (posluchače pointerdown/pointerup/touchstart/touchend/click/keydown). Ověřeno v Chromiu se třemi autoplay politikami.

## 11f (11. 11. 2026)
- **Co-op s botem**: `#coBot` v lobby, `coBotOpen`, `coHostGo(true)`, `run.bot`, `botStep(dt)` (pohyb), `botPick` (karty). Bot žije v simulaci hostitele jako síťový partner, bez sítě, jde i offline. Neutrácí zlato, hlídá krystal, oživuje a nechá se oživit. Popis v `COOP.md` „Bot“.
- Lobby co-opu: vybraný hrdina/mapa je zase zlatě (kamenná karta z 10q přebíjela `.co-pick.on`), `#coGo` je v `.sticky` dole, nadpis „S botem“.
- Testy: `botcoop.js`; `bot.js` umí `BOT=hrdina` (co-op s botem pro balanc).

## 11g (11. 11. 2026)
- Krystaly XP v co-opu: `g.pull` nese hrdinu (dřív `true`, takže po přitažení je `updatePickups0` táhl k oběma hrdinům a krystaly visely na čáře pouta). Magnet, talent `l2`, Havran i dosah magnetu nastaví vlastníka; starý `true` nebo vlastník po odpojení kamaráda přejde na hráče. Test v `botcoop.js` (před opravou 18 z 21 krystalů viselo, po ní 0).

## 11h (11. 11. 2026) – kapitola VII Prázdnota
- 5 map ze stavebnice: okraj (trhliny `rifts`), trosky (bez mechaniky, trosky kapitol I–VI), ozveny (ozvěna `echo`), svetlo (lucerna `lantern`, tma .9), nicota (finále: trhliny + černá díra `pull` s `ph2:1` až od 2. fáze). Nové háčky stavebnice: `lights`, `ph2` (boss `ph2.mf:'ph2'`), `die:'split'`.
- Nepřátelé shade, hollow, voideye, devourer; bossové maw, hoarder, mirror, moth, nothing (vlastní útoky `KIT_OWN`), hlášky v `BOSS_INTRO`, `CH_BG` rozšířené o VI a VII.
- Hrdinka Nyx (`need:'okraj'`, 5 500 z `HERO_PRICE`, úhyb 8 %, talenty prefix `y`), zbraň Černá díra `voidorb` (efekt `bhole`: vtahuje, tiká, na konci taktu výbuch); síla na úr. 6 jako Kladivo a Krápníky.
- Věže Věž ozvěn `espire` (efekt `tech` = ozvěna zásahu) a Lucerna `lantern` (zpomalí, +15 % poškození, světlo v Posledním světle). Set `void` (helm, armor, ring, gloves; 4 = trhlina `lg.sv4`), legendárka `vheart` Kroky nicoty, hledaný `nameless`, mistrovství Světlonoš, most `nicota` → `dawn`.
- Hudba: styl `void` (frygická stupnice, `KIT_PROG.phryg`), `STYLE_ROLE` z `rolecal.js` (odchylka 0,1 dB), běh −30,5 dB (`zvuk.js`). Hi-haty max ~9,6 kHz (vyšší frekvence zahlcovaly `skladby.js` varováními).
- Balanc (boti `hraci.js`, UCTY[6]): `hpmK` 1,75/1,85/1,65/1,2/1,7, trhliny na Okraji každé 3 takty po 5. Vstup okraj 53 % (stejný účet na Souhvězdí 75 % = schod), ozveny 40 %, svetlo 13 % (lucerna poráží i Opatrného), nicota 40 %; po grindu 47–80 %.
- Testy: `c7shots.js`, opravený `newsshot.js` (přes `lib.open`), boti znají trhliny, ozvěnu a lucernu.

## 11i (11. 11. 2026)
- **Obtížnost podle síly hráče.** Účty typického hráče `tests/tools/ucty.js` (společné pro boty, měřič síly a ladění; nově i runy, Souhvězdí, Prestiž, druhý mazlíček Krotitele a odemčené funkce podle vyhraných map – dřív boti hráli bez fúzí, talentů a mazlíčků). Měřič `sila.js` (útok/výdrž z `st`). Ladění `ladeni.js` (logistický model, `TIER` env v `hraci.js`), 3 kola × 30 map × 20 běhů + ověření 25 běhů: `MAP_TIER` přepsané, cíl `DIFF_CIL` (I vítá 70→45 %, běžná 40 % −3/mapa, finále 20 %, zeď III/VI 25 %/12 %). Model nových kapitol: `PWR` + `kitTier` (poslední dvě vyladěné kapitoly × růst síly × cílová křivka ÷ nepřátelé mapy), `krivka.js zapis`. Kapitola VII (11h z druhého chatu) dostala řádky v `MAP_TIER` se svými vyladěnými hodnotami a pak ladění na stejnou křivku.
- **Hrdinové** (`herostat.js`): Hvězdy +25 %, Kotva +12 %, Stavitel 25 HP, Krápníky −12 %. Nikdo není drasticky OP (±15 bodů), rozhoduje styl.
- `chapcheck.js` hlásí mapy ze vzorce a vlastní řádky daleko od vzorce.

## 11j (11. 11. 2026) – dokončení co-opu
- Karty pouta (výboj, mráz, život, tah), Souhra (zabití na stejnou dobu, každá 10. truhla), Duetní fúze (recept rozdělený mezi hráče, rituál otázka–odpověď, ultimátka oběma), společné shrnutí na konci (zabití, poškození, oživení po hráčích), návrat po odpojení do 30 s (i po zavření stránky), co-op žebříček (`coop_runs`, `coop_board`). Podrobnosti `COOP.md` „11j“.
- Oprava: karta duetu u kamaráda nesla recept (`cards[].f` i pro `duet`).
- SQL co-op žebříčku je v `supabase/migrations/20261111a_coop_board.sql`; zkouška nanečisto prošla, 11. 11. spuštěné naostro (Supabase MCP).

## 11k (11. 11. 2026) – červená nit aktu I
- `STORY` finále I–VII přepsané: každý boss nese střep, hrdina je sbírá, stopy zlatého oka (Aurel). `bridgeEye` kreslí při mostu nad finále zlaté oko (síla podle kapitoly, zornice sleduje hrdinu). Kronika: `#cxStory` ve Sbírce (pergameny `.kr`, odemčené finále + jedno zamčené). Plán příběhu `docs/PRIBEH.md`.

## 11l (11. 11. 2026) – kapitola VIII Úsvit
- 5 map (rozbresk, pole, hodiny, zahrada, kolebka), mechaniky stavebnice `growth`, `sundial`, `bloom`, Fénix s vejcem (`egg` na bossovi, `phoenixEgg`/`phoenixHatch`). Nepřátelé sunfl, beetle, firefly, scarecrow; bossové thornmom, reaper, gnomon, honeyq, phoenix. Hrdinka Réva (`vines`), věže Úl a Sluneční hranol, set `dawn`, legendárka `fpen`, hledaný `rohac`, mistrovství `phoenix`, hudební styl `dawn` (lydický), most `gild`. Oprava z kontroly příběhu: Fénix hlídá kolébku nového slunce (popis, Průvodce, hláška, 2. fáze). `ROMAN_CH` do XX. Boti `hraci.js` znají semena, keře, poledne a květy.

## 11m (11. 11. 2026) – pečetě zbraní a nové fúze
- Pečetě: `save.seal` (synchronizuje se), tlačítko se zámkem `#sealBtn` vedle Vyrazit (jen s odemčenými fúzemi), okno `openSeals()` v `#selPop`. `levelOptions` vynechá zapečetěné zbraně (ne startovní zbraň hrdiny, v co-opu jen pro místního hráče). Hlídání `sealWhy`: v nabídce zůstane aspoň `SEAL_MIN`=8 zbraní a žádná zbraň v nabídce nepřijde o poslední fúzi.
- 8 nových fúzí, aby měla fúzi každá zbraň hrdinů: volcano (kladivo+ohnivá koule), glacier (krápníky+mrazivá vlna), maelstrom (kotva+bumerang), skysong (souhvězdí+noty), reapwind (halapartna+čepele), bramble (šlahouny+aura), singul (černá díra+střela), lash (bič+sekera). Skládají se z hotových efektů (icicle s `ring`, `bhole` s `mark`, constellation pro skysong).

## 11n (11. 11. 2026) – kapitola IX Zlatá říše (zeď)
- 5 map (predmesti, mincovna, sochy, pokladnice, dvur), mechaniky stavebnice `gaze`, `press`, `statues`, `greed`, zezlátnutí nepřátel (`gildEnemy`). Nepřátelé gilded, taxman (`touch:'steal'`), alchem, mimic, statue; bossové usurer, mintmaster, gknight, dragon, herald (odhalení Aurela ve 2. fázi). Bez hrdiny, mazlíček Straka (`magpie`, v truhle až od kapitoly IX). Věže Zrcadlo a Lis, set `gold`, legendárka `midas`, hledaný `treasurer`, mistrovství `herald`, hudební styl `gold`, most `stairs`.

## 11o (11. 11. 2026) – tvář map Zlaté říše
- Uživatel: „design mapy je celkem nuda, propracuj to a mysli i do budoucna“. Stavebnice map dostala návrhové nástroje: `kit.decor` (`kitDecor`: koberce, mozaiky, koleje, výstražné pruhy, lem dlažby, drť), `kit.set` (památky na přesném místě), `kit.rows` (řady podél cest, čáry, oblouky, čtvrti mřížkou, jen v zóně), `kit.pathTurn` (rovné ulice). Rekvizity jsou dál jen kresba.
- 11 nových rekvizit IX (fontána, stánek, zlatý strom, pec, bedna, podstavec, svícen, drahokamy, koruna, trůn, prapor). Předělané všechny mapy IX: Předměstí = město s ulicemi a náměstím, Mincovna = dílna s kolejemi, Síň soch = koberce do kříže a les sloupů, Pokladnice = hromady pokladu, Zlatý dvůr = trůnní sál.
- Nový test `tests/tools/mapfull.js` (celá mapa naráz). Výkon `heavy.js` (4× CPU) Předměstí 12 fps vs. Doly 9 fps. Postup ve skillu `nova-kapitola` „Návrh mapy“.

## 11p (11. 11. 2026) – kapitola X Korunované slunce, konec aktu I
- Pět map uvnitř Aurelova slunce (Schody světla, Síň trofejí, Hvězdná kovárna, Dvůr věčnosti, Korunované slunce), postavené nástroji z 11o (nové `decor` `channel` a `split`).
- Mechaniky stavebnice: `collapse` (hroutící se schody), `trophies` (ožívající sochy bossů I–VII), `anvil` (kladivo na šachovnici), `twins` (Den a Noc musí padnout spolu), `crown` (Aurelova aréna).
- Aurel ve 4 fázích (král, sedm střepů s útoky kapitol a citátem jejich hudby, slunce se stínem sloupů a věží, poslední jiskra ve tmě se zásahem na první dobu). Úvod finále aktu: ticho a prasknutí obrazovky.
- Paladin zdarma za Aurela (`win:'korunace'`), Světelné kopí a fúze Svatozář (s Aurou). Věže Kovadlina a Svatyně, šestidílný set Zbroj padlé hvězdy, legendárka Koruna sedmi střepů, hledaný Korunní strážce, titul Přemožitel slunce, karta Konec aktu I.
- Hudební styl `crown`. Testy `c10shots.js` (všechny fáze Aurela a dvojčata), `aktx.js` (úvod, konec aktu, zamčený Paladin). `wgallery.js` bere počet úrovní zbraně z dat (dřív padal na nových ultimátkách).

## 11q (11. 11. 2026) – obtížnost na dva cíle
- Uživatel: pokračovat v balancu („drž odstup“ vyhrává, Vrakoviště lehké); chce funkční systém pro další kapitoly a žádnou okamžitou smrt za chybu.
- Rozbor (`hraci.js` s `POVX`/`safeSet`, `paky.js`): Opatrný vyhrává uhýbáním + obrannými kartami, ne útěkem; hrdina nerozhoduje. Pokus s nepřáteli před běžícím hrdinou a návratem opozdilců (větev `balanc-odstup`) na boty nepůsobil, do hry nešel.
- `ladeni.js` ladí na dva cíle (průměrný hráč výhry přes `hpm`, neopatrný přežití přes `dmm`), `prolozeni.js` proloží všechna kola. Mapy I–VIII přeladěné (2 průchody, 5 kol × 36 běhů), `PWR` přepočtené. Podrobnosti `KAMPAN.md` „Dva cíle“.
- Regenerace 0,3 zdraví/s za úroveň (dřív 0,4). Bot: stav `run.kg`/`run.kb` sdílí kapitoly VI a VIII (různé mechaniky), `hraci.js` to rozliší.

## 11r (11. 11. 2026) – běhy offline do žebříčku a dat
- Fronta běhů v zařízení `save.runQ` (LOCAL_KEYS, načítá `loadSave`, max 300), `runsFlush` po dávkách 50 (insert, duplicitní `rid` = 23505 → po jednom a duplicity přeskočí; při starém serveru `insert` bez nových sloupců), `ON.noRuns` jen když tabulka chybí (dřív stačila jedna chyba sítě a telemetrie byla do konce sezení vypnutá – proto chyběla část běhů).
- `onlineRetry`: znovupřihlášení po návratu signálu; `onlineInit` hlídá souběh (`ON.initBusy`) a znovu použije klienta.
- `statsMerge`: když je cloud novější, offline statistiky a rekordy map se neztratí.
- `docs/DATA-HRACU.md`: jak Claude čte data hráčů.

## 11s (11. 11. 2026) – rychlá otázka po běhu
- Karta `#ovAsk` na obrazovce konce běhu (kamenná deska `rune`, 5 hvězd ze `SPR.icon.star`, tři volby obtížnosti). Odešle se po obou odpovědích, nebo při odchodu z obrazovky, když je aspoň jedna (`fbAskLeave` v `setState`). Fronta `save.fbQ`, `fbqFlush` po `runsFlush`. `openFeedback(pre)` umí předvyplnit hvězdy a druh.

## 11t (11. 11. 2026) – přehlednější Novinky
- Uživatel: drobnosti zajížděly pod posuvník, Novinky měly moc textu a hlavní body často nebyly to hlavní. Nový vzhled záznamu (`.ne`, `.neh`, `.nic`, `<details class="nmore">`), `padding-right` u `.nl`, datum jen když se změní. Záznamy 11k–11s přepsané (max 3 body, jedna krátká věta). Nový test `novinky.js` hlídá délky od 11k dál.

## 11u (11. 11. 2026) – ikona pečeti
- Uživatel: ikona pečeti působila jako zamčené tlačítko. Nová ikona `seal` (červený vosk s otiskem a kapkami) na `#sealBtn`, na zapečetěných dlaždicích v okně pečetí (dřív zašedlý 16px zámek) a v Novinkách 11m.

## 11v (11. 11. 2026) – karta denní výzvy
- Uživatel: karta denní výzvy v Přípravě byla graficky slabá a měla moc prázdného místa. Nové rozložení: pohlednice mapy se zlatým rámem, štítek + odpočet do nové výzvy, název mapy (k30), modifikátor s ikonou (`DAILY_MOD_IC`), oddělená spodní řada s odměnami a tlačítkem Hrát; splněná výzva = zelená fajfka přes zašedlou pohlednici. Ověřeno nejdelším názvem mapy CZ (Pozlacené předměstí) i EN (Heart of the Mountain).
## 11w (11. 11. 2026) – mechaniky pro mapy, které čísla nesrovnají, boss jako třetí páka, kapitola X přeladěná
- Nové `KIT_MECH`: `shrink` (prázdnota ukusuje okraj mapy po krocích, takt varování, venku bolí a zpomaluje; Trosky světů), `goldblood` (nepřítel, který padne do 64 px, léčí 1,2 % max. zdraví, nejvýš 4 %/s; Předměstí, Síň soch, Pokladnice), `statues` s parametrem `e` (spící nepřítel jakéhokoli druhu, chování `statue`, dokud se neprobudí; Zlatá pole se strašáky), `bloom` s rojem `swn`/`swR`/`sw` (Zahrada světla: 3 světlušky z květu u hrdiny). Háček `kill(o,e)` (`mfCall('kill')` v `killEnemy`, jen hostitel).
- Oko víru: `VSPIT_EV`=8 taktů od 50 s takt nádechu (tah nepřátel ×1,7, prstence na hladině), pak `vortexSpit` odhodí nepřátele ven (`kx/ky`) a pustí 2 prstence bublin `hazDm(.8,.04)`; `vortexPhase()` počítá z čísla taktu, takže ho vidí i host co-opu.
- `MAP_TIER[id][4]` = `bhm` (násobek HP bosse, `spawnBoss`; Noc dědí max. zdraví Dne). Nástroj `tests/tools/bossladeni.js` (2 hodnoty `bhm`, proloží logit, zápis 5. čísla), `hraci.js` `TIER` umí 5. číslo.
- `hraci.js`: bot na Ostrovech padal (`run.kg` používají `gaps` i `growth`), boti drží kruh `shrink`. Kapitola X: `ladeni.js c10` 5 kol (strop HP z dvojnásobku výchozích čísel), Věčnost a Korunace `bhm`.
- Popisy map (Vír, Trosky, Pole, Zahrada, Předměstí, Síň soch, Pokladnice) s novou mechanikou v CZ i EN, Novinky 11s. Snímky `tests/tools/mech11r.js`.

## Předávky 10. 11. 2026 (přesunuto z CLAUDE.md při auditu 11x)

### Předávka 2026-11-10 ~21:15 (verze 10r = vylepšení věže postáním, nad grafickou 10q; chat „logika a funkce“)
- Hotový třetí bod z rozboru dokumentu „Herní Design a Systémová Architektura“: **postůj u věže `DW_BEATS`=2 doby (min. 1,1 s, `dwTime()`) → `towerUp(t)`** = stejná cena a účinek jako tlačítko; na úr. 3 se poškozená věž opraví. Jen nejbližší věž v okruhu `DW_R`=20 od každého hráče (co-op přes `players()`), čerstvá věž `DW_BORN`=4 s klid, bez zlata nic. `towerDwell(dt)` volá `updateTowers` jen u hostitele; průběh `t.dwk`/`t.dwA` jde kamarádovi jako 9. položka věže ve snímku (`T`). Kreslení: prstenec na zemi pod věží (zlatý, oprava zelená). Tlačítko Vylepšit zůstává. Jednorázový tip `save.tipDw`.
- Proč 1,1 s minimum: při 142 BPM jsou 2 doby 0,85 s a průchod středem kruhu základní rychlostí 58 trvá ~0,7 s.
- Bot (`bot.js 8 knight,builder,mage hrbitov,poust 0 zkuseny`) před/po: výhry i zlato v šumu, na Poušti méně smrtí kvůli krystalu. Test `tests/tools/vezpostat.js`.
- Z dokumentu dál **nedělat** bez nového rozhodnutí uživatele (viz 10p níže): sokly, Krystal na všech mapách, Safíry, sběr všemi mazlíčky, minihra slučování, fialová pečeť.

### Předávka 2026-11-10 ~21:00 (verze 10p = odznak fúze na kartě + kroužek rytmu; chat „logika a funkce“)
- **Rozdělení práce (uživatel 10. 11. večer):** jeden chat dělá grafiku, druhý logiku a funkce. Oba pushují na `main`, takže platí pravidlo fetch + rebase před prací i před pushem.
- **Dokument z Drive „Herní Design a Systémová Architektura“** (core loop a meta-game) jsem porovnal s hrou. Uživatel rozhodnutí nechal na mně. Závěr:
  - **Hotovo v 10p:** odznak fúze na kartě nové úrovně (`fuseHint(id,lv)` → `optInfo().fz` → `.fzb` v `luCard`; jeden odznak = ultimátka, ke které zbraň vede, když hráč nese druhou půlku; `.rdy` zlatě = po vybrání jsou obě na 5; tajný recept až po ukutí; jde i do co-op karet). Kroužek rytmu pod hrdinou (v `render` u hrdiny, z `M.beatPos`; první doba taktu zlatá, protože na ni jedou bonusy za rytmus a mazlíčci; síla `save.bt` 0–1, posuvník `#vBt` v Nastavení, klíč jen v zařízení).
  - **Další krok (nezačato):** vylepšení a oprava věže průchodem kolem ní (ušetří tlačítko v boji); po změně pustit boty, jestli to nerozhodí zlato v běhu.
  - **Nedělat bez nového rozhodnutí uživatele:** pevné sokly a plně automatická stavba (berou volbu kam a co; rozbily by Stavitele, limit 8 věží, rostoucí ceny, Karavanu), Krystal jako jádro všech map (má ho jen Poušť a Karavana), Safíry (další měna proti Ekonomice 2.0; smysl až s vydáním v obchodech), sběr lootu všemi mazlíčky (je to schopnost Havrana a magnetu), rytmická minihra u slučování 3→1 bez přeskočení, fialová pečeť (fialová jde ze hry pryč).
- Nastavení: čtvrtý posuvník se musel vejít na malý telefon → těsnější `.vols`, nápověda ke klávesnici jen s myší (`pointer:coarse` ji skrývá), `.sheet` má `max-height:100%` a posouvá se.
- Test: `node tests/tools/fuzemark.js <složka> [cs|en] [telefon]` (pravidla odznaku, přetékání karet, snímky karet a fází kroužku). Novinky 10p (ikony `vortex`, `drum`), snímky CZ i EN zkontrolované.

### Předávka 2026-11-10 ~20:00 (verze 10j = schody a zeď kapitol, loot podle kapitoly, ceny hrdinů, vše na main)
- Obtížnost: II schod nad I, **III zeď**, IV a V zvednuté, aby schodiště drželo; VI beze změny. Čísla, metodika (měřit se stejným účtem `UCET=n`) a poučení (rozhoduje HP, `dmm`/`spx` málo) v `KAMPAN.md` „10j“. Otevřené: styl „drž odstup“ (Opatrný vyhrává skoro všude), Vrakoviště nereaguje na HP, účet po grindu ve IV vyhraje i finále.
- Loot: zlato ×(1+0,15·kapitola) (`chGoldMul`), Esence finále taky; nový test `tests/tools/lootcurve.js`. Ceny hrdinů kapitol samy z `HERO_PRICE` (II 1 000 … VI 4 000), viz `EKONOMIKA.md` a skilly `nova-kapitola`, `novy-hrdina`.
- Novinky 10j (ikony `map:doly`, `coin`, `ess`, `hero:astro`), snímky CZ i EN zkontrolované.

### Předávka 2026-11-10 ~17:30 (verze 10i = menu skladba hypnotický darksynth, vše na main)
- Menu: nová skladba vybraná po 6 kolech náčrtů (postup, co prošlo a co ne, je ve skillu `zvuk-a-hudba` „Menu“). Styl `title` = basový sekvencer + vrstvy, bez melodie. Engine: `spb` (3/4, 6/8 jen pro menu), `drive()`, nástroje `IN`, `pure` skladby bez enginového víru. `hudba-pravidla.js`: takt bez melodie projde, když ho nese psaný basový riff.
- Novinky 10i (ikona `tune`). Hlasitost menu: běh −29,6 dB (`zvuk.js menu`).
- Celý audit 10. 11. večer: `AUDIT.md` (vše prošlo; otevřené: slabší zeď kapitol II a IV, tiché selhání uložení, plynulost menu na pomalém telefonu, drobnosti na serveru).

### Předávka 2026-11-10 ~16:40 (verze 10h = banger hudba + nová menu skladba, vše na main, Pages nasazené)
- **Banger ve všech skladbách** (uživatel schválil podle poslechu pilotu na Hřbitově): `bangKit` šablona (táhlá oktávová basa, kopák do čtvrtin od E2, virbl s tleskem, 16. hi-haty, pumpování `pumpAt`/`M.pump`), kit pro každý styl (`STYLES.x.bang`), `BANG_TRIM` po stylech (běh −31 dB v `zvuk.js`), náběhy (vír + riser) a crash na nové sekci, pulzní vlny `p12`/`p25`, rychlejší gradace (int 1 od 10 s, 2 od 60 s). Tempo beze změny (spawny na taktech). `skladby.js`: změřeno 11/30 (hrbitov, poust, bazina, kostnice, zvonice, doly, kovarna, reka, pristav, majak, vir), všechny VERDIKT v cíli; zbytek uživatel nechtěl doměřovat.
- **Menu**: nová skladba (outrun E moll 118, refrén 3+3+2), styl `title`, `free`+`pure`; vybraná po 3 kolech náčrtů – co neprošlo, je ve skillu `zvuk-a-hudba` („Menu“). Engine umí `lead[64]`, `bass[64]`, `cm[64]`, `pure`, stupnici `phryg`.
- Novinky 10h s novými ikonami `tune` (zlaté noty) a `drum` (bubínek). Kontrola `hudba-pravidla.js` hlídá banger kit a BANG_TRIM u každého stylu.

### Předávka 2026-11-10 ~14:15 (verze 10g = 10f + ledová hrdinka Vločka, vše na main, Pages nasazené)
- 10f **hudba kapitoly VI + nástroje, ať další kapitoly projdou napoprvé**:
  - `songKit` v2: `answer` (vlastní odpověď), `bossAnswer`, smyčka `A B R C D B A`, boss `X Y X Z`, prázdný takt generátor neudělá. Kapitola VI má vlastní styl `STYLES.star` (dřív půjčený `frost`), mix změřený `rolecal.js`.
  - Engine: takt s jedinou držanou notou dostane v půlce tichou ozvěnu (o kvintu výš) – dřív díra 9–12 dB v klidu (hrobka, majak, paluba, trun). Bossové frost, forge a star mají v `pad` rytmické akordy při `E>=3` (dřív boss +1,7 až +2,8 dB).
  - `SONGS.x.bossDb` = zesílení bosse jedné skladby (trun 1.5, vir 1.1, vrakoviste 1.2, krystaly 1.5, srdce 1.1, soutezka .8); `skladby.js` ho navrhne. Maják: konec fráze A o oktávu výš (byl pod reproduktorem telefonu).
  - Výsledek: `skladby.js` všech 31 skladeb VERDIKT v cíli (propady 0, klid −2 až −6, boss +3 až +5).
  - Úvodní motivy Trůnu zimy, Řeky, Soutěsky a Přístavu přepsané (kopírovaly Hřbitov, Bažinu, Srdce hory, Pevnost).
  - Nové nástroje: `tests/tools/hudbacheck.js [cN|all]` + pravidla `hudba-pravidla.js` (volá je i `chapcheck.js`), `rolecal.js` (mix nového stylu proti odposlouchaným frost/sea), `skladby.js cN` s řádkem VERDIKT. Postup ve skillech `zvuk-a-hudba` („Hudba nové kapitoly“) a `nova-kapitola`.
- 10f **jména hrdinů**: limit 85 % dlaždice (49 px při 12 px na telefonu 360 px), CZ i EN, písmo se nesmí zmenšovat. Přejmenováno: Lučištník → Střelec, Zbrojmistr → Žoldák (EN Warlord), Šamanka mrazu → Vločka (EN zůstává Frost Shaman, v kartě Shaman; „Vědma mrazu“ uživatel zamítl), Námořnice → Pirátka (EN Pirate), Hvězdářka → Astra (CZ i EN; v příběhu „hvězdářka Astra“), EN Blacksmith → Smith. Kontrola `tests/tools/jmenahrdinu.js`, volá ji `chapcheck.js hero:id`. Pravidlo ve skillu `novy-hrdina`. Staré Novinky nechávají stará jména (historie).

### Předávka 2026-11-10 ~11:00 (verze 10e, vše na main, Pages nasazené)
- 10d: balanc všech kapitol (viz KAMPAN.md „10d“) + plynulost menu (paprsky `.fc-rays` na GPU vrstvě, `heroStrip`/`bartFit` bez layout thrash, dozvuk levněji a po prvním snímku, Novinky po 6 + dočítání). Měření: `menuperf.js`; zaseknutí obrazovek dřív 200–340 ms, teď 60–130 ms (CPU 4× zpomalené).
- 10e: **projeto všech 31 skladeb** (`tests/tools/skladby.js`). Melodie hraje v každé sekci (dřív hlavní téma A mlčelo ~110 s → propady na telefonu), doplněné prázdné takty v intrech pouště, kostnice, dolů, kovárny, krystalů, v Kaňonu C a menu B, boss `ENERGY_GAIN[3]` 1.12→1.3. Propady 225 → 0, klid −10 až −20 dB → −3 až −6 dB, boss +1–2 → +3–4,5 dB. Pravidla v skillu `zvuk-a-hudba`.
- Otevřené ve zvuku (10e) vyřešeno v 10f: krystaly boss, variace kap. VI.
- 10c: představení bosse trvá podle délky hlášky (`BI_TYPE` 30 znaků/s + 2,6 s čtení, finále 3,2 s; dřív 5/7 dob ≈ 2,7 s), hláška je HTML `#biLine` písmem UI (dřív 10px pixel font v canvasu = nečitelné háčky). Ověřeno SE/15, CZ/EN, nejdelší hláška (Orion), přeskočení i odchod do menu.
- 10b: `#combo` top `calc(100px + var(--sat))` – na iPhonech s výřezem dřív vjížděl do tlačítka pauzy (pevných 100 px); teď je pod lištou XP, ověřeno SE/15/Max, poušť s krystalem a bossem, kombo ×1240.
- Pravidla: celý audit jen na požádání, po změně rychlý test v dotčené oblasti; vizuální změny vždy prohlédnout (CZ i EN, malý iPhone); Novinky v hezkém formátu s ikonami.

## 11x – audit a technická čistka (11. 11. 2026)
- Plný audit zelený, zpráva `AUDIT.md`. Uložení při plném úložišti (`saveRetry`, hláška přes `note`), pojistka `storyShow`, odstraněn mrtvý kód (`CHEST_ROWS`, `teleRing`, `FEAT_BTN`, `CO_ABC`, `sharp`…), 3 duplicitní klíče v `window.__krypta`, smazané `tests/tools/off2.html` a `net3_*.png`. Staré předávky z 10. 11. přesunuté sem z CLAUDE.md.
- Server (po souhlasu uživatele): migrace `20261111c_audit_vykon.sql` – RLS s `(select auth.uid())`, indexy `feedback_uid_created` a `runs_uid`, pevný `search_path` u `stats_clean`/`stats_entry_ok`, `feedback_limit` už nejde volat přes `/rpc`.

## 11y (11. 11. 2026) – příběh od začátku, páteř přes akty
Zadání uživatele: projít příběh, najít díry, opravit; příběh nemá být random ani obsáhlý, má mít zvraty a drama a počítat s dalšími akty.
- **Prolog** (`STORY.prolog`, `prologShow`, `save.prolog`): karta jednou pro nového hráče v menu (stávající hráči ji mají v Kronice jako první zápis). Jiskra z rozbité hvězdy uvízla hrdinovi v hrudi a probudila ho.
- **Zápisy `STORY` I–X přepsané nakrátko** (≤ 240 znaků). Opravené díry: sedmý střep z Nicoty, střepy se po VII hrdinovi vytrhnou a slunce z nich kuje Aurel (dřív slunce vzniklo samo a zároveň ho ukoval Aurel), Astra z textů pryč (je hratelná), hádanka Sfingy a slova Královny mají dvojí význam (Aurel × Spáč), Aurel v závěru řekne, že mu rozbití poradil hlas ze snu.
- Herold v úvodní kartě: „Střep jde vzít jen poraženému. Díky za špinavou práci.“ (proč Aurel potřeboval hrdinu). Karta konce aktu: Paladin = Aurelův první rytíř, ze kterého opadlo zlato.
- `docs/PRIBEH.md`: nová sekce **Páteř příběhu přes všechny akty** (tabulka aktů, motivy, pravidla psaní), akt II přepsaný (tóny ukolébavky, hlas ze snu, zvraty v XV, XVIII a XX), háček aktu III.
- Test `tests/tools/pribeh.js`; `lib.prep()` vypíná prolog v testech (`KRYPTA_NOPROLOG`), zapne ho `L.open({prolog:1})`.

## 11z (11. 11. 2026) – příběh zjednodušený
Uživatel verzi 11y odmítl („too much, strašně nucený, zamotal jsem se, keep it simple“). Páteř v `docs/PRIBEH.md` zkrácená na tři věty a pravidlo jeden akt = jeden padouch, jeden cíl, jeden zvrat; z plánu pryč Bdělí, tóny ukolébavky, hlas ze snu, hrdina jako kus Spáče. Ve hře pryč jiskra v hrudi a hlas ze snu (prolog, I, X), Sfinga a Královna mají zpět původní jasné věty. Zůstává: prolog, krátké zápisy, opravy děr (sedmý střep, odlet střepů, Herold, Paladin).

## 11z1 (11. 11. 2026) – hlášky finálních bossů mluví o střepech
Přání uživatele: spojit úvodní hlášky bossů s příběhem. Jen finále I–VII (`BOSS_INTRO` morvan, sphinx, titan, queen, kraken, eclipse, nothing): jedna věta s humorem, ve které zazní střep. Ostatní bossové si nechávají vtipy; Fénix, Herold a Aurel už k příběhu mluvili.

## 11z2 (11. 11. 2026) – bedny, šipka k bossovi, zlato na věže
Připomínky uživatele z testování s kamarády: bedna zaniká, boss se ztrácí v hordě, v těžších mapách skoro nejde postavit věž (zásahy nulovaly kombo, zlato padalo jen za kombo), hra je dlouhá.
- Bedna: zlatý sloup světla, kruh, dvojnásobná velikost, jiskry, zvuk `chestdrop` při pádu; `it.born` = krátké vysunutí sloupu.
- `edgePtr(g,cx,cy,barva,sprite,velikost)`: šipka na okraji obrazovky (rámeček s ikonou + hrot k cíli), drží se pod horní lištou (y ≥ 130) a uhne buildbaru. Boss (lebka, červená) a nejbližší bedna (zlatá). Pod bossem na obrazovce pulzuje červený kruh.
- Zlato: `run.kg` počítá zabití; každých 25 zabití `min(40,max(10,5·⌊kombo/25⌋))` zlata (dřív jen při kombu 25, 50… a zásah ho vynuloval). Úlomky dál každých 200 komba, talent `d20` dál na kombu. **Pravidla komba se nemění** (Bard dál drží půlku, žebříček komba beze změny).
- Měření `hraci.js` (nové pole `t1` = čas první věže, `c90` = zlato v 1:30) + `prvniVez.js`: zlato v 1:30 zima 41–62 → 57–100, Nicota 25 → 45, první věž Nováček na Nicotě 3:47 → 1:51. Ve Zlatém dvoře boti skoro nezabíjejí (0–2 zabití za 2 min u Nováčka a Agresora), to je jiný problém (síla účtu nebo mechanika `goldblood`).
- Délka běhu (bod 4 uživatele) zatím ne: zkrácení map a řidší horda u bosse potřebují přeladit obtížnost.

## 11z3 (11. 11. 2026) – značky v menu, čísla v Síni slávy
Připomínky uživatele: v menu byly dvě značky pro novou věc (pečeť u `.new`, červený čtvereček u `.has`) → všude pečeť `sealDot` (`--kNew`, `kNewInit` v `openMenu`), v horní liště 18 px nad ikonou. Číslo 2. a 3. místa v Síni slávy bylo useknuté (rámeček 16 px pro řádek 24 px) → `.tc .rk` 20×24.

## 11z4 (11. 11. 2026) – první minuty hry, kratší běhy, data o odchodech
Rozbor postupu (uživatel: „děláme něco v procesu špatně?“): obsah roste rychleji, než ho kdo hraje. Data 11. 11.: 6 hráčů, 54 běhů (37 vývojář),
5 testerů 17 běhů, nikdo se nevrátil druhý den, nikdo za kapitolu I, 2 z 6 umřeli v prvním běhu a už nehráli. Proto teď začátek hry místo nových kapitol.
- **Tutoriál znovu** (`tutTick`, uživatel: „první level jako tutorial strašný, nápisy divné a nejasné“): pruh s ikonou a jednou krátkou větou, každý krok čeká
  na hráče a odškrtne se (zelený rámeček, ✓, zvuk): pohyb → útočí sám → krystaly (zlatá šipka nad nejbližším krystalem `tutPtr`) → zlato → věž (blikající
  tlačítko `tutHi`, `.tuton`) → věž sílí. Přerušení: bedna, málo zdraví, vylepšení věže (bliká `#upBtn`), boss se blíží, boss. Test `tests/tools/tutorial.js`.
- První běh: Hrát jde rovnou na Hřbitov (bez Přípravy), v liště jen jedna věž, poškození hráče ×0,6 (s bossem ×0,8) – `TUT_DMG`.
- **Hřbitov v noci** (uživatel: „první level je oproti druhému ošklivý a jednoduchý“): měsíční paleta trávy a cest, `dark` .5, modrý `grade`,
  rozpadlá podlaha kaple s runovým kruhem místo cihlového disku, 30 hrobových řad, otevřené hroby, tmavé stromy, světla luceren a svíček.
- **Kratší běhy** (uživatel: 7 min do bosse): boss nejpozději `DUR_CAP` 300 s, finále `DUR_FIN` 330 s. Běh se nezředí, ale stlačí: `map.ts` = stará délka / nová,
  `runMin()` (HP nepřátel, nabídka druhů) a spawn běží ve starém čase, elity a události posunuté, `rewT` počítá staré sekundy → stejně nepřátel, XP, zlata
  a materiálu za běh. Během boje s bossem chodí jen každý 3. běžný spawn (`BOSS_HORDE`). Kapitoly I–III přeladěné boty (`data/11z4`).
- **Obtížnost začátku**: `DIFF_CIL`/`CIL` kapitola I 85/75/60/50 % (dřív 70/60/50/45), přežití neopatrného na prvních dvou mapách 65 %.
  **Boti začátek přeceňují** (data 11. 11.: Hřbitov lidé 4/8, boti 92 %; Utopené hroby lidé 1/6, boti 67–92 %), proto Hřbitov a Utopené hroby nastavené ručně
  podle bota Nováček (`hrbitov:[0.62,0,0,0.6,0.85]` = i boss ×0,85, `bazina:[0.7,.1,15,0.75]`): Nováček bez úlev prvního běhu Hřbitov ~60 %, Hroby ~75 %.
  **`ladeni.js zapis` by je přepsal – kapitolu I přes něj nepouštět bez kontroly Nováčkem.** Hřbitov bez pavouků, Utopené hroby bez lučištníků
  (zabili 3 z 5 nováčků), v Kostnici lučištníci od 1. minuty a méně (`kostnice:[0.9,.2,30,0.75]`).
  **Oprava:** šípy lučištníků/čarodějů/horníků (`beh:'ranged'`) měly pevné poškození mimo páku mapy `dmm`; teď `×min(1,dmm)` – změkčení mapy
  na ně platí, těžší mapy se nezměnily. (Noční můra je dál nezesiluje – kdyby se to mělo změnit, přeladit.)
- **Nový hráč**: v okně přezdívky jen obrázky, které si může vybrat (dřív 60 zamčených siluet a Uložit hluboko dole), Uložit přilepené dole (`.nsv`).
  Opravený skrytý řádek `$('#nickSave').hidden` (byl za komentářem).
- **Data o odchodech**: běh opuštěný zavřením aplikace se zapíše jako `end='left'` (`runPendKeep` při skrytí, `save.runPend` v zařízení, odejde při dalším
  spuštění; test `opusteny.js`). Dotazy na návraty D1/D7 a první běhy v `docs/DATA-HRACU.md`.

## 12a (12. 11. 2026) – tutoriál blbuvzdorný
Uživatel po hraní od nuly: chybí vysvětlení komba, animace textu tutoriálu se seká, výběr zbraní nejasný („mělo by to být blbuvzdorné“).
- Pruh tutoriálu najíždí plynule (`tutIn`: posun + průhlednost, ease-out) místo stupňovitého zvětšení `rvIn` steps(3), které rozmazávalo a sekalo písmo.
- Krok komba: když hráč poprvé dosáhne komba 12 – „Kombo = zabití bez zásahu. Vyšší kombo dá víc zlata.“, ukazatel komba bliká (`#combo.tuton`).
- Karty nové úrovně v prvních běhech (`luEasy()`: tutoriál nebo < `LU_EASY_RUNS` = 3 běhy) píšou slovy, co karta je (`luKind`): Nová zbraň · popis,
  Silnější zbraň · úroveň N, Nový/Silnější bonus · účinek; čísla se vrátí od 4. běhu. První dvě nabídky tutoriálu mají nad kartami dva řádky
  `#luHint` („Vyber jednu kartu. / Zbraně útočí samy, bonusy tě posílí.“). Odpočet 10 s na výběr karty až od 4. běhu (dřív od 2.).

## 12b (12. 11. 2026) – prvních 15 minut botem
Zadání uživatele: projet prvních 15 minut boty, ať je to zábavné a vše vysvětlené. Nový nástroj `tests/tools/prvnich15.js` (rozumný nováček:
tutoriál, karty mechanik s „Ukaž mi to“, Příprava → Vyrazit, minihra fúze; časová osa v `/tmp/p15/osa.txt`, hlídá ticho > 30 s). Výsledek: 3 běhy
(Hřbitov, Utopené hroby, Kostnice), žádné ticho, fúze přijde ve 3. běhu s vlastním úvodem, Kostnice je první opravdová výzva (zdraví až 19 %).
- Hláška „Kombo N! +X zlata“ chodila každé 2–3 s → zlato je číslo nad hrdinou, hláška jen při nové stovce komba (`run.cbT`, ne na dvoustovkách s Úlomky).
- Tutoriál: krok Elita (první elitní nepřítel) a Úlomky (první Úlomky na zemi, ikona materiálu mapy).
- Karta mechaniky Vybavení a Obchod: „Ukaž mi to“ otevře Obchod s denní truhlou (dřív prázdný inventář).
- Příprava: vybraná mapa se posune doprostřed, ať ji nezakrývá Vyrazit. Dvouřádkové karty nové úrovně vyšší (`data-kd2`, 116 px).
- Ponecháno k rozhodnutí uživatele: zlato za běh v kapitole I (+420 až +730) stačí po 1. běhu na Mága (150) i Stavitele (250).

## 12c (12. 11. 2026) – ubrat zlato
Uživatel: „ubrat zlato“ (12b ukázalo +420…730 za běh v kapitole I, Mág 150 a Stavitel 250 hned po prvních bězích). Příčina: zlato za kombo z 11z2
(10–40 každých 25 zabití) se po běhu z 30 % připisovalo do banky (`keepGold`). Teď se sčítá do `run.kgG` a `endCoins` ho odečte – v běhu na věže
zůstává stejně. Boti (`hraci.js` vstup, 6 běhů): výhra Hřbitov ~200, Hroby ~245, Kostnice ~235, Zvonice ~290, Trůn ~360 = cíl 150–400 z `EKONOMIKA.md`.

## 12d (12. 11. 2026) – komiksové cutscény
Uživatel: „chci jednoduché cutscény u důležitých momentů… pixel komiks?“ Po maketě (statické stránky) a animovaném prototypu (video z enginu, rozbor:
odhalení Aurela splývalo s Heroldem, oko vypadalo jako křížek, na konci 4 s nic, tenké rámy) „udělej to“. Ve hře `CMX`: 11 komiksů (prolog, finále I–VIII
šablonou `fin()`, zvrat IX, konec aktu X), stránka 393×774 art px škálovaná nearest, písmo Jersey v nativní velikosti, pixelový rozpad panelu (Bayer),
rám s nýty a barvou scény (`FR`: kost, zlato, kámen, led, žár, prázdnota), bossové se rozpadnou na vlastní pixely a zůstane po nich hromádka (Morvanovi koruna),
oko kreslené po 2px (víčko, duhovka, štěrbina). Výkon ~2–6 ms na snímek (desktop Chromium). Test `komiks.js`, `pribeh.js` přepsaný na komiksy.

## 12e (12. 11. 2026) – přeladění kapitol IV–X po zkrácení běhů, oprava pádu
Zadání uživatele: pustit boty na kapitoly IV–X (11z4 stlačilo čas, ale nepřeladilo je). `ladeni.js` 2 kola × 6 běhů, dvě sady souběžně v kopiích
(`/tmp/lad*`), data `tests/tools/data/12d/`. Většina map vyšla po zkrácení **lehčí** (hustší vlny = rychlejší úrovně), boti je přitvrdili;
skok na jedno kolo omezen na −23 až +30 % (12 běhů na skupinu je rozkolísaných). Pak `krivka.js zapis`.
- **Oprava pádu hry:** počítadlo zabití pro zlato za kombo (11z2) používalo `run.kg`, které patří mechanikám `growth` (trny, Kolébka a kapitola VIII)
  a `gaps` (Ostrovy). Po prvním zabití se z objektu stalo číslo → `inBush`/`psp` hodily chybu každý snímek. Teď `run.kn`.
  **Pravidlo: nové pole na `run` vyhledej (`grep "run\.jméno"`), krátká jména jako `kg`, `kb` už mají mechaniky.**
- Bot (`hraci.js`): na Hvězdárně hledal květiny v `run.kb` paprsku (`R.kb.F`) – opraveno, hra to netýkalo.
- Kapitola I se nepřepisovala (nastavená podle skutečných nováčků).


## 12f (12. 11. 2026) – bedna ze světla, pauza
Uživatel: „záře z dropnuté bedny je nudná“ (11z2 byl plochý průsvitný obdélník). Nově `CHEST_BEAM` (ditherovaný sloup: bílé jádro, zlaté boky, nahoře se rozpadá), bedna na něm spadne (0,32 s), při dopadu se zmáčkne, rozběhne se prstenec světla a prach; potom paprsek pulzuje s `M.pulse`, stoupají jiskry, kolem bedny krouží 10 jisker (vedoucí na dobu), přes víko běží odlesk. Pauza: pasivky zajížděly pod spodní lištu lůžka – posouvá se vnitřní `.pin`, rám zůstává čistý.

## 12g (12. 11. 2026) – chybějící zvuky
Uživatel: „chybí mi sfx, jako poražení bosse, otvírání beden jak ve hře tak v obchodě atd.“ Boss měl jen obyčejné `kill`, truhla v obchodě `hit` při poskocích a `win/level/coin` při otevření, bedna v běhu `coin`. Nově (vše v akordu skladby, velké momenty duckují hudbu): `bossdie` (rána 170→28 Hz, crash, rozpadlý akord, vítězný akord na další takt), `elite`, `chestdrop` (svist dolů a dopad za 0,31 s = obraz 12f), `chestopen` (zámek, víko, stoupající běh, mince), `hop` (dřevěné ťuknutí o stupeň výš), `riser` (do otevření), `open` podle rarity (běžná pop, vzácná akord, epická fanfára, legendární + zvon + rána), `anvil` (Kovárna), `equip`, `buy`. Měření `sfxposlech.js`: všechny efekty 0 až +14 dB nad hudbou, špička max −8 dB.

## 12h (12. 11. 2026) – truhla za svíčky
Uživatel (snímek z Nástěnky): u truhly za svíčky nejde kliknout na Super. Příčina: `revealItem` bral `$('#rvOk')` a `$('#rvCv')` z celé stránky – po dřívějším otevření v Obchodě zůstaly ve skrytém `#chestPop` staré prvky se stejným id, takže se tlačítko i animace napojily na ně. Teď `pop.querySelector`. Test `revealpop.js` (na staré verzi padá).

## 12i (12. 11. 2026) – pečeti v menu
Uživatel: jedna „plusko“ pečeť pulzuje, druhá ne. `.new` měla starou animaci `qdot` (plynulé zvětšení ×1,3, rozmazává pixel art), `.has` měla `animation:none`. Teď všechny pečeti (menu i horní lišta) `sealHop` – poskok o 3 px v krocích + zjasnění, vypnuté při omezeném pohybu.

## 12j (12. 11. 2026) – pečeť Nástěnky bez ničeho
Uživatel: plusko na Nástěnce, ale nic k vyzvednutí ani odemčení. `qClaimable` počítal i týdenní milníky svíček (10/25/45), ty ale byly jen na záložce Týden, zamčené do odemčení kontraktů; tečka záložky se kvůli zámku neukázala. Nově `qDots()` (stejný výpočet pro tečky i pečeť, se zámky, hledaný jen při `featOn('wanted')`), týdenní svíčky na Dnes, dokud je Týden zamčený. Test `boardseal.js` (na staré verzi padá).

## 12k (12. 11. 2026) – výzvy jen na vyhraných mapách
Data hráčů 12. 11.: hráč z kapitoly II (hrdina úr. 9) dostal denní výzvu na Posledním světle (kapitola VII), čtyřikrát za minutu umřel do 11–26 s na tmu. `dailyInfo` i `wkInfo` vybíraly mapu ze všech `MAP_IDS`. Volba uživatele „mapa z odemčených map“: `chalPool()` = mapy v `save.cleared` (v pořadí kampaně, prázdné → první mapa), index ze stejného hashe dne/týdne jako dřív, takže hráči na stejném postupu mají stejnou mapu. Mapa se zamkne: denní v `save.daily.pk={d,map}`, týdenní v `save.wk.map`, aby se nezměnila, když hráč během dne vyhraje další mapu. Modifikátory a týdenní hrdina zůstávají pro všechny stejné. Žebříček Dnes/Týden ukazuje pod časem mapu (dřív hrdinu a zabití), dlouhý název se zkrátí na řádek (`.brow .val small` nowrap, `.brow .nm` min. 96 px). Texty výzev v Cestě, Průvodci a na kartě upravené. Test `tests/tools/vyzvamapa.js`.

## 12l (12. 11. 2026) – kapitola II podle dat, oprava Posledního světla
- **Poslední světlo padalo (12e–12k):** 12e přesunulo počítadlo zabití (zlato každých 25) z `run.kg` na `run.kn`, jenže `run.kn` je lucerna mechaniky `lantern`. Po prvním zabití se z lucerny stal řetězec „[object Object]1“, aktualizace mapy padala a tma zabíjela za pár sekund (data: 4 smrti do 26 s, příčina `dark`). Počítadlo je teď `run.killCnt`. Statická kontrola `tests/tools/runpole.js` (žádné pole `run` nesmí být číslo i objekt), běh `tests/tools/lucerna.js`. Boti v `hraci.js` na tom také padali (`map.kit` u mapy bez stavebnice).
- **Kapitola II:** nejdál postoupený tester (Bard úr. 9) vyhrál Poušť 1/4, Kaňon 1/1, Karavanu 0/3 (smrt kolem 3. minuty, ~45 % poškození od kultistů). Kapitola II se po zkrácení běhů (11z4) nepřelaďovala. `ladeni.js c2 3 6` + `prolozeni.js` (data `tests/tools/data/12l/`): Karavana byla nad stropem HP (3,46 při stropu 2,63) a průměrný bot vyhrával 8–17 % (cíl 34 %). Zapsaná **jen ulehčení**: Karavana `hpm` 3,46 → 2,63 (`dmm` beze změny 0,98; průměrný bot pak 62 %), Hrobka `dmm` 0,98 → 0,87 (průměrný 29 %, cíl 31). Boti by Poušť a Kaňon přitvrdili (Stavitel 100 %), ale skuteční hráči tam už padají, takže zůstaly. Brána beze změny (v cíli).
- Nejčastější zabiják celé kapitoly II jsou kultisté (vějíř 3 střel na dobu). Mechaniky Karavany a Hrobky mají v běhu nápovědu (`cvTip`, `trapTip`).
- **Kapitola III (měření bez změny):** `ladeni.js c3 3 6` – průměrný bot vyhrával v průměru kol zhruba cíl zdi (Doly 25/25, Kovárny 25/22, Řeka 22/19, Krystaly 17/16, Srdce 20/12 %), neopatrný přežil 40–46 % (hranice 40). `prolozeni.js` by HP mírně zvedl (Doly 3,71, Kovárny 3,96, Řeka 3,84, Krystaly 5,44, Srdce 2,97); nezapsáno – v šumu a skuteční hráči tam ještě nejsou. Data `tests/tools/data/12l/c3-kola.json`, `ladeni-c3.txt`.

## 12m (12. 11. 2026) – Týden v kryptě (odměna za návrat)
Zadání uživatele: důvod vrátit se každý den, na týdenní bázi, odměna se stupňuje a je různorodá. Schválené varianty: vynechaný den nic nemaže (deska počká), vyzvednutí hned po otevření hry.
- `save.lw = {v, n (další den 0–6), d (datum posledního vyzvednutí), wk (dokončené týdny = věrnost), tid (téma rozjetého týdne), av (získané obrázky)}`. Deska se ukáže od 4. běhu (`LW_RUNS`), v menu jednou denně ve frontě `featShow` (po kartách mechanik a příběhu), okno `#featPop` `.fc.lw`; v testech vypnutá (`KRYPTA_NOLW`, zapne `L.open({lw:1})`).
- Dny: 1 zlato, 2 úlomky, 3 Truhla dobrodruha, 4 svíčky (bez Nástěnky zlato), 5 tématická (výbava/mazlíčci úlomky, věže zlato, hrdinové esence), 6 zlato, 7 tématická velká (Okovaná truhla, karta věže, mazlíček z košíku, 6 esence). Témata se střídají po týdnech (`LW_TH`), věže a mazlíčci jen po odemčení (`arsenal`, `pets`). Zlato a úlomky × (1 + 0,15·nejvyšší kapitola) × věrnost (+10 % za týden, max +50 %).
- Každý 4. týden na 7. den navíc profilový obrázek, který jinde nejde získat (`LW_AV`: duch, mumie, přízrak; sekce „Týden v kryptě“ ve výběru obrázku), po všech třech Královská truhla místo odměny 7. dne.
- Plný inventář: truhla počká, nic se neposune. `petCrateRoll()` vytaženo z `openPetChest` (košík zdarma). Hodnota týdne ≈ třetina denních úkolů Nástěnky.
- Test `tests/tools/tydenkrypta.js [cs|en] [se|15]` (8 týdnů všech témat, obrázky, vynechané dny, snímky `out/tyden_*.png`).

## 12n (12. 11. 2026) – první dny hráče (podle researche a dat testerů)
Research `docs/RESEARCH-SURVIVORIO.md` + soupis prvních dnů: kdo odešel, měl nejvýš 2 výhry a žádný denní důvod se vrátit (Nástěnka byla až na 3. mapě). Uživatel: „pusť se do toho“.
- **Cesta mechanik:** Nástěnka (`quests`) se odemyká na Hřbitově spolu s Vybavením, Fúze (`fuse`) až na Kostnici. Nic se nezamyká znovu (`save.feat` zůstává).
- **Den prvního běhu** `save.day0` (nastaví `recordRun`; hráči z doby před 12n mají `'old'`), `dayN()` = kolikátý den od něj (−1 neznámo).
- **Karta „Zítra tě čeká“** (`tmrwShow`, `save.tmrw`): jednou za účet, první den po 2. běhu, ve frontě `featShow` před Týdnem v kryptě (v testech vypnutá s ním, `KRYPTA_NOLW`).
- **Týden v kryptě hned po návratu:** `lwDue` platí i pro hráče s méně než 3 běhy, když se vrátí další den (`dayN()>0`).
- **Dárek na cestu** (`loseGift`): 2. prohra za sebou na stejné nevyhrané mapě (normální obtížnost, ne výzvy, co-op ani Nekonečná krypta) dá 80 zlata a 10 Úlomků × `chGoldMul`, nejvýš jednou za mapu a den (`save.lose`, `save.loseG`), a tip podle stavu hráče (`loseTip`). Řádek v tabulce po běhu + tip přes celou šířku (`td.ovtip`).
- **Události** → tabulka `events` (migrace `supabase/migrations/20261112a_events.sql`, spuštěná 12. 11. se svolením uživatele, předtím nanečisto): `evLog(ev,k,v)` do fronty `save.evQ` (jen v zařízení, max 400), `evFlush` po dávkách 100 (`onlineRetry`, po přihlášení). Události: `open`, `tut` (krok tutoriálu `ikona:krok`, v = čas běhu), `feat`/`featgo`/`featlater`, `scr` (první otevření obrazovky v relaci, `setState`), `chest` (truhla zdarma), `lw`, `gift`, `tmrw`, `qclaim`. Každá nese `ver`, `lang`, `rn` (běhů za sebou), `d0` (den od prvního běhu). Zásady soukromí (`PRIVACY.md` a text v Nastavení) to uvádějí.
- Test `tests/tools/prvnidny.js [cs|en] [se|15]` (odemykání, karta Zítra, dárek, Týden v kryptě po návratu, starý hráč, události, snímky `out/prvnidny_*`). Dotazy na trychtýř v `docs/DATA-HRACU.md` „Události prvních dnů“.

## 12o (12. 11. 2026) – otázka na rytmus, hlášení chyb, stránka pro smazání účtu (plán práce #1–#3)
- **Rychlá otázka po běhu** má třetí řádek Rytmus: Baví / Nevím / Ruší (`FBQ_RH`, `ctx.rh`); odešle se, až jsou vyplněné všechny tři části (nebo při odchodu z obrazovky). Test `fbask.js` rozšířený.
- **Chyby JS do `events`** (`evErr`, ev `err`, k = zpráva @ soubor:řádek), nejvýš 5 různých za relaci; náhrada za Sentry. Dotaz v `docs/DATA-HRACU.md`.
- **`smazat-ucet.html`** (CZ + EN) na GitHub Pages: jak smazat účet ve hře, co se smaže, co zůstane; odkaz z `PRIVACY.md`. Povinné pro Google Play.
- Migrace `supabase/migrations/20261112b_delete_my_data.sql` (mazání i událostí, nahlášení mířících na hráče a co-op výsledků) je **připravená a nanečisto ověřená, ale NEspuštěná** – spuštění změny na serveru zastavilo povolení; čeká na souhlas uživatele. Po spuštění upravit odstavec „Co zůstane“ v `smazat-ucet.html`.

## 12p (12. 11. 2026) – porovnání výbavy s nasazeným kusem
Přání uživatele (snímek okna předmětu ve Vybavení): porovnat s tím, co má hrdina nasazené. `openItem` předá `itemCardHtml(it,cmp)` kus ze stejného slotu vybraného hrdiny (když okno ukazuje jiný předmět). Nad hodnotami řádek „Proti nasazenému: ikona + jméno +úroveň“, u každé hodnoty rozdíl `cmpDelta` (zeleně plus, červeně minus, nulový rozdíl se nepíše), hodnoty, které nový kus nemá, šedě s „0“ a červeným úbytkem. Legendární schopnosti, ★ vlastnosti a sety se číslem neporovnávají. Styly `.ic-vs`, `.ic-st .cmp` na konci `krypta.css`.

## 12q (12. 11. 2026) – Kořist krypty a 2minutová denní výzva (plán práce #7, #8; schválil uživatel)
- **Kořist krypty** (`save.loot.t`, `lootInit`, `lootFill`, `lootFull`, `lootUi`, `lootClaim`): truhla v horní liště menu hned za měnou se plní 8 hodin (i offline). Plná = 140 zlata a 20 Úlomků × (1 + 0,15·nejvyšší vyhraná kapitola), tedy zhruba půlka odměny za výhru. Vyzvednout jde od 1 hodiny, dá poměrnou část. Pod truhlou je 8dílný ukazatel, plná truhla poskakuje (`sealHop`). Odemkne se 2. výhrou (`FEATS` `loot`); při odemčení je napůl plná, ať hráč hned vidí, jak funguje. Pod průvodem v síni na malém iPhonu nebylo místo, proto horní lišta.
- **Denní výzva na 2 minuty** (`DAILY_T=120`): odemkne se 2. výhrou (dřív Poušť), odměna (truhla s předmětem + 20 Úlomků) přijde hned ve 2:00 (`dailyTick` → `dailyGrant`, hláška počká, když zrovna svítí jiná), běh pokračuje kvůli žebříčku Dnes; konec běhu už druhou truhlu nedá. Události `daily`, `loot`.
- Test `tests/tools/korist.js [cs|en] [se|15]` (odemčení, vyzvednutí, plná truhla, nic nepřekrývá, výzva ve 2:00 jen jednou, snímky `out/korist_*`).

- 12o dodatek: migrace `20261112b_delete_my_data.sql` spuštěná 12. 11. večer se souhlasem uživatele (předtím nanečisto). `smazat-ucet.html` upravená: smaže se i co-op a nahlášení mířící na hráče; termín 30 dní u žádosti přes formulář uživatel schválil.

## 12r (12. 11. 2026) – „Ukaž mi to“ ukáže cestu, Zvonice lehčí
- Uživatel po spuštění dostal karty Denní výzva a Kořist krypty; „Ukaž mi to“ u obou jen volalo `openMenu()`, přes menu hned vyskočila další karta a pak Novinky (`newsBoot` po 700 ms nehlídal karty). Nově `spotOn`/`spotOff` (rám `.kspot`, šipka `#spotAr`, v `#mTop` jen záře), Denní výzva otevře Přípravu a ukáže `#dailyBox`, Kořist ukáže `#mLoot`. `featShow` čeká na `SPOT.on` a otevřené Novinky; Novinky čekají na 1,5 s klidu v menu. Test `tests/tools/ukazmi.js`.
- Zvonice: `MAP_TIER.zvonice` HP ×1,18 → ×1,0, `bonearcher` váha 3 → 2. Data `runs`: uživatel 2 smrti (Rytíř úr. 3 ve 3:43, Bard úr. 1 ve 2:30), lučištníci dali ~půlku poškození; jediný výherce měl hrdinu úr. 7–8.
- Karta denní výzvy ukazovala natvrdo 3:00, teď `DAILY_T` (2:00).


## 12s (12. 11. 2026) – opravy z bota nováčka
- Chyby JS hráčů (`events`, `ev='err'`): od 12o žádná (hrál 1 hráč); zápis ověřen vyvolanou chybou. Feedback bez hlášení chyb.
- Bot nováček (`prvnich15.js cs 10`, 2 běhy, obě výhry, 0 chyb JS) našel: (1) šipka `spotOn` zůstala v levém horním rohu menu, když se obrazovka změnila bez klepnutí (cíl skrytý → `getBoundingClientRect` 0,0). Oprava: `place()` volá `spotOff()`, když cíl nemá `offsetParent`; regrese v `ukazmi.js`. (2) Konec běhu: hodnota „Bleskový sloup · ve Stavitelově bedně“ zúžila sloupec popisků („Lovec / bossů“). Oprava: hodnota jen název věže, poznámka „Najdeš ji ve Stavitelově bedně v Obchodě.“ jako řádek `ovtip`. Pravidlo `nowrap` na popisky zkoušené a zahozené (u „Přemožitel Morvana“ + „Mistrovství!“ přetékalo o 16 px na SE).
- Návrhy z bota (neudělané, čekají na uživatele): značka na Obchodě, když čeká denní truhla zdarma; Příprava zbytečně odroluje k mapě, i když se vejde (název kapitoly pak useknutý nahoře).
