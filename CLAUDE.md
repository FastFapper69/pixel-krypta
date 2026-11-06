# Pixel Krypta – poznámky pro Clauda

Mobilní webová hra (HTML5 canvas, čisté JS, bez buildu), survivors-like roguelike s tower-defense prvky a pixel artem.
UI je česky + anglická lokalizace (viz níže), s uživatelem se komunikuje česky. Hraje se hlavně na telefonu, testují to kamarádi (i přes Instagram in-app prohlížeč).

- Živá verze: GitHub Pages z větve `main`, kořen repa (`index.html`). Push na `main` = nasazení (~1 min).
  **Po pushi vždy ověř, že nasazení doběhlo:** `gh api repos/FastFapper69/pixel-krypta/actions/runs` → workflow „pages build and deployment“ pro daný commit `completed success`. GitHub občas nasazení zruší („Deployment failed, try again later“) – pak pomůže prázdný commit a push.
- Commity: autor `Claude <noreply@anthropic.com>`, na konci zprávy řádky `Co-Authored-By` / `Claude-Session` podle aktuální session.

## Soubory
- `index.html` – celá hra v jednom souboru (~330 kB, jedno IIFE). Obsahuje konfiguraci Supabase:
  `window.KRYPTA_ONLINE={url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'sb_publishable_…'}` (publishable klíč je veřejný, to je v pořádku).
  Prázdné `url/key` = offline režim (tak běží i verze publikovaná jako claude.ai artefakt).
- `lang-en.js` – anglický překlad `window.KRYPTA_EN` = {český text: anglický text}, načítá se před hrou.
- `EKONOMIKA.md` – dlouhodobá progrese: návrh, stav (fáze 1–5 hotové) a co zbývá (serverový inventář, monetizace).
- `COOP.md` – co-op: architektura, pravidla, stav fází a co zbývá.
- `VYDANI.md` – plán vydání na Google Play / App Store a monetizace: co je potřeba, pořadí, kdo co dělá (Claude vs. uživatel), realistická očekávání výdělku, hra vytvořená s AI.
- PWA: `manifest.webmanifest`, `sw.js` (network-first, cache jen jako offline záloha, cizí domény neřeší), ikony `icon-180/192/512(-maskable).png` (vygenerované z lebky `SPR.icon.skull`). SW se registruje jen na https.
- `tests/` – `supabase-mock.js` (mock Supabase přes BroadcastChannel) a `coop-test.js` (dvě stránky, WebRTC).
- `supabase-setup.sql`, `supabase-pin.sql` – schéma DB (už spuštěné uživatelem v Supabase SQL Editoru).
- Uživatel nemá přístup k terminálu, je na mobilu – vše nasazuj sám přes git push.

## Lokalizace (CZ/EN, 11/2026)
- Zdrojové texty jsou česky. Každý český řetězec v JS je obalený `_t('…')` (ne `L` – to je v kódu častá lokální proměnná). Klíč = přesný český text, překlad v `lang-en.js`.
- `LANG` se určí při startu: `localStorage['pixel-krypta-lang']` (nesynchronizuje se do cloudu), jinak podle telefonu (cs/sk → čeština, jinak angličtina). Přepínač `#mLang` v menu uloží volbu a stránku znovu načte (jazyk se za běhu nemění, takže `_t` funguje i v datových tabulkách při načtení).
- Statické HTML přeloží `i18nDom()` na začátku skriptu (textové uzly, placeholder/aria-label/title), ještě před `bindUi`. CSS text zuřivého bosse má variantu `html[lang=en]`.
- Pořadí slov: kde se angličtina skládá jinak, větev `EN?…:…` (např. příchod bosse). `cz()` v angličtině nechává desetinnou tečku. `onOff(b)` = zap/vyp.
- **Při přidání nebo změně textu**: obal ho `_t('…')` a přidej/uprav řádek v `lang-en.js` (i položky `NEWS`). Kontrola: `node tests/tools/i18n.js static` (chybějící překlady, neobalené české řetězce), bez `static` projde obrazovky v angličtině a vypíše viditelný český text. `en_shots.js` udělá anglické screenshoty.
- Anglický název hry je Pixel Crypt (manifest PWA zůstává Pixel Krypta).

## Struktura kódu (sekce `/* ==== … ==== */` v index.html)
helpers → save → pixel sprites → maps → weapons and passives → meta shop → audio (music + rhythm) → canvas → state → input → run → level-up → end of run → HUD → rendering → loop → menus → online (Supabase) → boot.

Obsah:
- Hrdinové: knight (Rytíř), archer (Lučištník), mage (Mág), builder (Stavitel), bard (Bard – start Noty, zásah kombo jen způlí, `ach:'combo'` = odemyká se v Mistrovství, talenty prefix `d`).
- Mapy: hrbitov (Zapomněný hřbitov, styl Graveyard Keeper), poust (Prašná poušť, bránění krystalu), doly (Lávové doly).
- Věže: arrow, fire, frost, tesla (stavění za mince z běhu, vylepšování, oprava krystalu).
- Bossové: slimeking, lich, demon. Nepřátelé: slime, bat, skeleton, zombie, ghost, spider, wolf, golem, flameskull…

Klíčové koncepty:
- Svět vs. pixely: `const Z=2`, canvas je VW*Z × VH*Z, `blit(g,img,s,cx,top)`, velikosti spritů ve světových jednotkách.
- Sprity: ASCII předlohy → scale2x → stínování (distance field + Bayer dithering, hue-shift stíny/světla, outline).
- Světla: offscreen vrstva s destination-out gradienty, additive glow, color grade `map.grade`, vinětace.
- Hřbitov: generátor `buildGraveyard` (šumová půda, cesty, dlažba, hroby, `GK_PROPS`, `makeTree`, y-sort, průhlednost za objekty).
- Poušť: generátor `buildDesert` (`style:'desert'`) – duny s větrnými vlnkami, jílové pláně s prasklinami, pískovcový chrám (plaza ±70 kolem krystalu, runový kruh, obelisky, pánve s ohněm), 4 zasypané cesty s kolonádami, 3 oázy s palmami (`run.built.oases`, voda léčí 1 HP / 0,4 s), kostra obra, stolové hory `makeMesa`, palmy `makePalm`, sprity `DS_PROPS`/`dsSprite` (`big:1` = scale 2).
- Doly: generátor `buildMines` (`style:'mines'`) – čedičová podlaha s puklinami, žhavé žíly, lávová jezírka s krustou (hazard v `pools`), dřevěná plošina s těžní věží uprostřed, kolejová smyčka `run.built.rails` (pts/cum/len, `railPos(s)`), sprity `MN_PROPS`/`mnSprite`.
  Speciální prvek: 3 důlní vozíky `run.carts` (`updateCarts`, 74 j/s) – běžné nepřátele zabijí, elitám ubere půlku, bossovi 90; hráče zraní (16) a odhodí. Vozíky mají světlo a jiskry.
- Fúze zbraní: `ULTS` (vortex Vír ostří = blade+aura, storm Řetězová bouře = bolt+lightning, meteor Meteorit = fireball+axe, blizzard Ledová smršť = arrows+frost) jsou v `WEAPONS` s `ult:1`, mimo `W_IDS`; úrovně I–III (`ROMAN`), `w.mul` = bonus z rytmu. `FUSIONS`, `fusable()` (obě zbraně lvl ≥ 5).
  `openLevelUp` nabídne kartu `{k:'fuse'}` s šancí 60 % (truhla 80 %), pity `run.fuseMiss` → nejpozději 3. pokus. Rodiče jdou pryč a už se nenabízí (`run.fused`), uvolní slot.
  Rituál: stav `'fuse'` (`#scr-fuse`, `startFuse`/`fuseTap`/`fuseTick`/`finishFuse`), boj stojí, hudba hraje, 4 cílové doby; `audioBeat()` = `M.beatPos` minus latence (50 ms plánování + outputLatency). Perfektní < 85 ms (+6 %), Dobré < 170 ms (+3 %), 4× Perfektní = ×1,25.
  Každá ultimátka: drop na začátku fráze (`ULT_DROP`, `s%64`) a vlastní hudební vrstva v `playStep`. Ledová smršť: `e.frz` (zmrazení, rychlost ×0,1), `iceHit` roztříští zmrzlé na střepy (`kind:'shard'`). Meteor/žár jsou fx `meteor`/`burn`.
  Balanc (měřeno na figurínách): ultimátka I ≈ 1,1–1,8× DPS obou rodičů na lvl 6, III ≈ 2,5–4×. Testovací tlačítko v pauze „Test: připrav fúzi“.
- **Co-op (extra režim, sólo beze změny):** menu „Hrát s kamarádem“ → `#scr-coop` (kód 4 číslice, odkaz `?hra=1234`, výběr hrdiny, host vybírá mapu). Host simuluje oba hrdiny (`run.pls`, `withPl`), guest kreslí snímky (`isGuest()`, `guestApply`). Síť `NET` = WebRTC + signalizace/záloha přes Supabase broadcast. Detaily v `COOP.md`.
  Pravidla: společné XP/úroveň/mince, level-up čeká na oba (`run.lv`, stav `'wait'`, 25 s limit), padnutí → duch (×0,55 rychlost, nestřílí), oživení stáním u něj 4 doby (`coopBeat`), oba padlí = konec. Škálování: spawn ×1,7, HP ×1,25, elity ×1,5, boss ×1,8. Rytmické pouto `bondStr(d)` (zlatá zóna 60–140, zásah na dobu, ×2 na takt). Pauza je společná. Co-op se nepočítá do žebříčku/rekordů.
- Zvuk po zamčení telefonu: iOS nechá AudioContext ve stavu `interrupted` (nebo hlásí `running` a mlčí). `audioInit` obnovuje z jakéhokoliv stavu (gesta pointerdown/touchend/click, návrat do aplikace), `audioWatch` po 0,8 s zkontroluje, že běží `currentTime`, jinak `M.dead` → při dalším dotyku nový kontext. `playStep`/`sfx` nic neplánují, když kontext neběží.
- **Progrese (EKONOMIKA.md):** materiály map (`MAT_OF`: hřbitov Kostní prach, poušť Jantar, doly Magmatit; drop z elit 3–5, 1 % z běžných, `k:'mat'`; odměna `runRewards`: sebrané + 2/min + 15 za bosse, ×1,5 výhra, ×(1+0,5·NM)), úrovně hrdinů 1–20 (`heroUp`, +2 % HP/poškození za úroveň, talenty na 5/10/15/20), výbava (4 sloty, 5 rarit, `heroBonus` → `run.bonus` → `recalc`), obrazovky `#scr-hero` (úroveň, talenty, sloty, inventář, detail předmětu: nasadit/vylepšit +10/rozebrat), `#scr-chests` (denní truhla, 3 truhly se šancemi a pity, kovárna: sloučení 3→1 rituálem `startFuse(...,opts)`), `#scr-codex` (fúze + legendárky).
  Kovárna a materiály po revizi 11/2026 (viz začátek `EKONOMIKA.md`): `upInvest`, rozebrání a sloučení vrací 50 % vylepšení, sloučení s výběrem slotu (`openMerge`), `matInfo`/`missHint`, nové ceny úrovní 15–20 (víc Magmatitu). `#newsPop` je sdílené okno (novinky, ovládání, sloučení, sdílení) a `setState` ho při změně obrazovky zavře.
  Noční můry I–V (`run.nm`, `nmTiers`, nepřátelé +40 % HP / +20 % poškození za stupeň, zlato +30 %, výhra na NM dá předmět a odemkne další stupeň), denní výzva (`dailyInfo`, modifikátory fast/glass/horde/noheal, `run.mod`, odměna 1× denně). Legendárky (`st.lg`): metro, bass, heart, crown, chain, compass. Co-op: kamarád posílá `bonus` v `hello`, host vybírá NM, odměny dostanou oba (zpráva `end` nese autoritativní čísla).
- **Úkoly (Nástěnka, `#scr-quests`, menu `#mQuest` s červenou tečkou při odměně):** 3 denní úkoly (lehký/střední/těžký) ze seedu dne (`qNewDay`, `qGen`, šablony `Q_TPL` – každá má `gen` a `val(q,C)`, `max:1` = nejlepší běh, jinak součet, `grp` = max 1 ze skupiny), 1 přehození denně (`qReroll`). Počítadla běhu `run.qc` (`qNewC`, zabití podle typu, elity, vozíky, oáza, věže, kombo, krystal nad 50 %, boss, fúze/Perfektní, oživení), zápis na konci `qCommit(qFinishC())` ve `finish` (i při Ukončit běh), výsledky v `run.qres` na konci běhu. Živě `qLive` – připnutý úkol v HUD `#qPin` a hláška při splnění. Svíčky `save.qd.c` / `save.qw.c` (týden od pondělí, `weekKey`), milníky `Q_DMS` (2/4/6) a `Q_WMS` (6…40, truhly přes `revealItem(...,{pop,done})`).
  Hledaní (`WANTED`, `WANT_OF`): denní plakát `save.qd.w` (st 0 nepřijato / 1 přijato / 2 dopaden / 3 vyzvednuto), v příštím běhu na mapě se ve 110–165 s objeví (`updateWanted`, `spawnWanted`), 80 s, pak uteče; baron (kruhy kostí, kostlivci), widow (`e.bur` zahrabání – nezranitelná, bez kontaktu, vyskočí s kruhem), smith (vozíky ho jen odstrčí, kruhy strusky). Ukazatel mimo obrazovku, `#qPin.hot`. Co-op: host posílá `q:run.qc` ve zprávě `end`, guest používá `run.qcR` (+ vlastní fúze `run.qcL`), příznaky 64/128 ve snímku.
- **Zuřivý boss:** `BOSS_RAGE=120` s po objevení (`e.born`) boss zuří (`bossRage(e)` v `updateEnemies`): rychlost ×1,3–1,9, poškození +60 % za každou minutu, toast a červený `#bossbar.rage`. Brání nekonečnému obíhání/farmení. Časové odměny počítá `rewT()` = čas, ale max. `dur + BOSS_RAGE + 60`.
- **Odměna zlata** `endCoins`: sebrané zlato (utracené za věže/opravy se nestrhává, `run.spent`, v co-opu ve zprávě `end` jako `sp`) + `rewT()/4` + bonus za výhru, × zlato z výbavy a NM.
- **Žebříček map** `mapScore`: vyšší NM > výhra > prohra; výhry podle nejkratšího času, prohry podle nejdelšího přežití (zabití jen jako tiebreak).
- Pauza ukazuje přehled buildu `renderPauseBuild()` (`#pBuild`: čas, úroveň, zdraví, poškození, zbraně s partnerem pro fúzi, pasivky).
- **Nový obsah (11/2026):** zbraně `note` (Noty, vlnící se střely, `s.a0/s.wt`) a `rang` (Bumerang, `s.t`, po 0,5 s se vrací k hráči), pasivky `eye` (krit +6 %) a `greed` (zlato +10 %). Fúze `echo` Ozvěna (note+rang) a tajná `steam` Parní exploze (fireball+frost, `secret:1`, v Sbírce jen hádanka; rodiče patří i do jiných receptů). Výbuch ohnivých střel přes `shotBoom(s)`. Nové druhy střel jsou v `SKINDS` (co-op).
- **Mistrovství** (`#scr-master`, menu `#mMaster` s tečkou): `ACH` (17 cílů, `v(S)` čte save + `save.stats.tot`), `achTrack(C,won)` ve `finish` (elity, vozíky, Perfektní rituály `pf`, max kombo, výhry hrdinů `stats.hw`, NM, co-op), `achClaim` dá zlato, titul (`save.title`, `titleOf(sv)` – v žebříčku a na tlačítku přezdívky) a případně hrdinu. `achInit()` mění `stats.tot` na místě (nevytvářet novou kopii!).
- **Denní výzva:** stejná mapa pro všechny (`dailyInfo` z hashe data, i zamčená mapa), běh na seedu dne (`seedRng('daily|'+den)` přepíše `Math.random`, vrací se v `finish`/`openMenu`). Nejlepší pokus dne `stats.daily`, záložka žebříčku **Dnes**. Nováček (0 běhů) denní výzvu nevidí.
- **Tutoriál** prvního běhu: `run.tut`, `tutTick` (banner `#tut`), hotovo = `save.tut`.
- **Novinky:** pole `NEWS` (nejnovější první, `v` roste), okno `#newsPop` se ukáže jednou na novou verzi (`save.newsSeen`), vše pod tlačítkem Novinky. **Při každé změně, kterou hráči uvidí, přidej položku do `NEWS`.** Nový hráč novinky nevidí.
- **Sdílení:** `shareImage()` kreslí obrázek 1080×1920 (pohlednice mapy, hrdina, statistiky, zbraně, přezdívka+titul, odkaz), `shareResult()` → `navigator.share` se souborem, jinak okno s obrázkem a stažením. Tlačítko `#ovShare` na konci běhu.
- **Instalace:** `#mInstall` (jen https, ne v in-app prohlížeči, ne v režimu aplikace): Android `beforeinstallprompt`, iOS návod.
- Save: `loadSave` načítá i `qd`, `qw`, `ach`, `title`, `tut`, `newsSeen` (dřív se úkoly po obnovení stránky offline ztrácely).
- Rytmus: WebAudio, `conductor(dt)` krokuje 16tiny → `playStep` + `gameStep(s)`.
- **Hudba (11/2026):** `SONGS[mapa]` = `bpm`, `root`, `scale` (`SCALES`: harm/hijaz/minor), `style` (`STYLES`: grave/desert/forge – nástroje `drums/bass/pad/arp/lead`), sekce po 4 taktech (`prog` akord na takt, `lead` 32 osmin ve stupních, `e` energie 0 klid/1/2/3 boss), `form0` jednou, pak `form` dokola s posunem tóniny `keys`, boss přepne na `bossForm` (`M.bossBar`). `songPos(step)` → sekce/takt/opakování, `chordAt` (používají ho i SFX). Energie = min(energie sekce, `M.int` podle času běhu). Melodie se při opakování obměňuje (oktáva, průchodné tóny), harmonie při vysoké energii. `tone()` = hlas s glide/vibratem/filtrem. Test/poslech: `__krypta.musicRender(id,sekundy,{int,boss})` vyrenderuje offline (OfflineAudioContext), chyby v `playStep` jsou v `M.err` (`__krypta.musicErr`). Krátké rendery (20–50 s) jsou rychlé, celá skladba trvá dlouho.
  Zbraně/věže střílí na kvantovaných krocích (`qsteps`, `W_OFF`), nepřátelé/spawny na `run.beatNow`/`run.barNow`, SFX přes `qTime` v tónech akordu. Combo, hit-stop.
- Save: `localStorage['pixel-krypta-v1']`, objekt `save` (coins, heroes, cleared, best, meta, stats, nick, stick, updated…).
- Online: supabase-js 2.45.4 (jsdelivr UMD), anonymní přihlášení, tabulka `profiles` s RLS, přezdívka + PIN přes RPC `set_pin` / `claim_profile` (bcrypt). Merge savu podle `save.updated`. In-memory storage fallback pro in-app prohlížeče. Testovací režim (`save.cheat`) se do žebříčku nepočítá.
- Testovací režim je skrytý: tlačítka `#mCheat`/`#mGold` uvidí jen vývojář – odemkne je podržení tlačítka „Hudba“ v menu 3 s (znovu = skryje). Příznak v `localStorage['pixel-krypta-dev']` (`isDev`/`setDev`), nesynchronizuje se do cloudu; bez něj se `save.cheat` vynuluje (i z cloud savu).
- Menu: za obrazovkami menu běží živé pozadí `menuBg` (posouvající se mapa podle `sel.map` vč. propů, světel, světlušek, viněty). UI má pixelové rohy (`clip-path: var(--px)`), textury `--tex`/`--ground` generované při startu, ikony na tlačítkách (`ico()` v `bindUi`, texty přes `setLbl`). Náhledy map ve výběru = pohlednice `mapThumb(id)` (88×88, nejzajímavější výřez mapy podle propů/světel/lávy/oáz, záře, grade, boss v rohu, cache `thumbs`). Otevření truhly = animace na plátně v `revealItem` (třesení, 3 poskoky, výbuch, paprsky, předmět vyletí; ťuk přeskočí).
- **Vzhled (11/2026):** `#app` je `position:fixed` s výškou `--appH` z `fitApp()` (na iPhonu v režimu z plochy hlásí stránka výšku o stavový řádek menší → bere se `screen.height`). Verze hry `GAME_VER` je dole v menu (`#mVer`, rozměry v `title`) – při změně, kterou hráči uvidí, ji zvyš. SW (`sw.js`) stahuje s `cache:'no-cache'`, jinak by iPhone držel 10 min starou verzi z GitHub Pages. Safe area přes CSS proměnné `--sat`/`--sab` (canvas jde od okraje k okraji, HUD/obrazovky/buildbar/note se odsazují; dřív `html{padding}` dělal prázdný pruh ve fullscreenu). Podobrazovky mají `.wrap` nahoře (centrované jen menu a `.clear` overlaye). Jeden styl ukazatele postupu `.qbar` (i Mistrovství), `.lvbar` stejně vykreslený. Lišta měn `matsHtml()` v Hrdinovi, Obchodu i Vylepšení (`#shopMats`). `setState` mimo `play` schová `#toast` a `#tut`. `HERO_DAT` = 3. pád jmen hrdinů. Truhly jsou sprity `CHEST_ROWS`+`CHEST_PAL` (wood/iron/gold, přepíší ikony). Konec běhu: `#ovHead` (pohlednice mapy + hrdina) a `#ovW` (zbraně a pasivky).
- Písmo: texty/čísla `Chakra Petch` (`--font`), pixelový `Pixelify Sans` (`--font-px`) jen pro velké nadpisy (.logo, .title, .head h2) – malý Pixelify byl na mobilu nečitelný.
- Kamera: pevně na hráči (bez zpoždění), zaokrouhlená na art-pixel mřížku `RZ`; všechny pozice na obrazovce přes `RZ(x+ox)`, ne `Math.round` – jinak hrdina při šikmém pohybu poskakuje.
- Ovládání: joystick má režimy `save.stick` = `touch` (pevný v místě dotyku, výchozí) / `fixed` (vlevo dole) / `follow` (plovoucí). Tlačítka HUD používají `onTap()` (reagují na pointerdown) kvůli multitouch. Stavění věží je svislý sloupec vpravo dole.

## Efekty a věže (11/2026)
- Částice `run.parts` mají druhy `k`: bez = čtvereček, `chunk` (kus spritu z `shatter(img,cx,top,gy,n,pow)` – rozpad nepřítele/věže), `smoke` (roste, `grow`, `drag`, `a`), `streak` (jiskra se stopou, `sparks()`), `ember` (blikající uhlík, světlo). Přidávat přes `addP()` (limit `P_MAX`=520). `smokePuff()`.
- Zásah: `e.sq` = squash při vykreslení, čísla mají oblouk (`vx/vy`), krit má `!` (glyf v `DIG`). Smrt: kousky spritu + kouř + jiskry + `pop`.
- Fx: `boom` (fáze záblesk → ohnivá koule s laloky → tmavne), `shock` (rázová vlna bez poškození, i u dropu ultimátek, barvy `ULT_COL`), `scorch` (spálená zem), `burn` s plamínky `flame(g,x,y,h,w,seed)`, blesky přes `zap(g,pts,col,al,core)` s větvemi, frost ring s jinovatkou.
- Věže: větší sprity 16 řádků, `drawTower()` kreslí vršek podle typu (kuše `SPR.misc.xbow` míří na `t.aim`, plameny, krystal `SPR.misc.ice`, jiskry cívky), úroveň 2 = zlatý pás + prapor (`TW_FLAG`), 3 = dva prapory, `t.born` = animace vyrůstání. Střely vylétají z vršku věže.
- Test: `tests/tools/vfx.js`, `vfx2.js` (detailní snímky efektů), `vfxperf.js` (fps v těžkém boji).

## Testování
Playwright + Chromium jsou předinstalované (`require('playwright')`, neinstalovat znovu). Mobilní viewport 390×800, `hasTouch`, `isMobile`.
Pro offline test nahraď konfiguraci prázdnou (`url:'',key:''`) – síť ze shellu na Supabase nefunguje.
Háčky na `window.__krypta`: `finish`, `ACH`, `achTrack`, `achClaim`, `achProg`, `openMaster`, `openNews`, `NEWS`, `shareImage`, `shareResult`, `seedRng`, `tutTick`, `titleOf`, `step(dt)` (tick vč. conductoru), `startRun`, `applyOption`, `levelOptions`, `openMenu`, `buildTower`, `upgradeTower`, `repairCrystal`, `force`, `god`, `M`, `setSel`, `save`, `run`, `state`, `ON`, `onlineInit`, `openBoard`, `saveNick`, `fusable`, `startFuse`, `fuseTap`, `audioBeat`, `FUSIONS`, `FZ`, `CO`, `NET`, `LO`, `openCoop`, `coHostStart`, `coJoin`, `coHostGo`, `withPl`, `players`, `econInit`, `makeItem`, `openChest`, `heroBonus`, `heroUp`, `upgradeItem`, `doMerge`, `dismantleItem`, `mergeCandidates`, `openHero`, `openChestShop`, `openCodex`, `openQuests`, `qEnsure`, `qCommit`, `qClaim`, `qClaimMs`, `qClaimWanted`, `qReroll`, `qSnap`, `spawnWanted`, `qNewDay`, `dailyInfo`, `runRewards`, `itemById`, `ECON`, `ac`.
`startRun(hrdina, mapa, {nm, mod})`.
Co-op test: `python3 -m http.server 8765` v kořeni repa, pak `node tests/coop-test.js` (a `nortc` pro zálohu). Virtuální partner bez sítě: `NET.open=true; CO.on=true; CO.role='host'; coHostGo()`.
V simulacích vypni zvuk (`save.sound=false; save.music=false`). Online toky testuj s mock Supabase (`addInitScript`). Multitouch přes CDP `Input.dispatchTouchEvent`.
Hotové testovací skripty jsou v `tests/tools/` (viz README tam: smoke `shot.js`, UI, DPS, úkoly `qtest.js`…).
Po změně vždy: smoke test (start běhu, ~90 kroků, žádné `pageerror`, šířka dokumentu = viewport) a screenshot.

## Hotovo
Survivors základ, 4 hrdinové, 3 mapy, věže + Stavitel, krystal v poušti, testovací režim, rytmická chiptune hudba, propracovaný pixel art (hřbitov ve stylu Graveyard Keeper), žebříček + cloud save + přezdívka/PIN, hosting na GitHub Pages, joystick ve 3 režimech + multitouch, čitelnější písmo, plynulý šikmý pohyb (kamera), propracovaná poušť (chrám, oázy s léčením, kostra obra), propracované doly (koleje, rozjeté vozíky, těžní věž), skrytý testovací režim (podržení „Hudba“ 3 s), fúze zbraní (4 ultimátky I–III, rytmický rituál, drop na frázi, hudební vrstvy), online co-op pro 2 (WebRTC, lobby s kódem, oživení, rytmické pouto), oprava zvuku po zamčení telefonu, progrese: materiály map, úrovně hrdinů a talenty, výbava s raritami, obchod s truhlami, kovárna, Noční můry I–V, legendárky, Sbírka, denní výzva, hezčí menu (pixelové rohy, ikony, živé pozadí), animace otevírání truhly, pohlednice map ve výběru, úkoly (Nástěnka: denní úkoly, svíčky, týdenní odměny, hledaní elity), audit hry (11/2026): zuřivý boss, žebříček výher podle času, věže nesnižují odměnu, víc zlata za čas, přehled buildu v pauze, drobné opravy textů. Velká aktualizace (11/2026): Bard, Mistrovství a tituly, zbraně Noty/Bumerang, pasivky, fúze Ozvěna a tajná Parní exploze, denní výzva se seedem a žebříčkem Dnes, sdílení výsledku, PWA, tutoriál, okno Novinky. Nová hudba per mapa (forma, nástroje, boss). Grafické sjednocení a oprava fullscreenu (iPhone z plochy), číslo verze v menu, okno Ovládání s výběrem joysticku, revize ekonomiky (vracení vylepšení, sloučení s výběrem slotu, víc Magmatitu na úrovně 15–20, nápověda k materiálům). Anglická lokalizace (celá hra, přepínač jazyka v menu). Šťavnatější efekty (rozpad nepřátel, výbuchy, blesky, stopy) a nové animované věže. Poslední verze: `GAME_VER` 2026-11-06j.

## Nápady / plán
- Co-op – zbývá (viz `COOP.md`): **ověřit naostro na dvou telefonech** (Supabase Realtime + WebRTC přes mobilní data/Instagram), Souhra, Duetní fúze, co-op karty pouta, co-op žebříček, návrat po odpojení.
- Fúze – Sbírka s ??? a tajná Parní exploze hotové. Zbývá: stat „Objevené fúze“ v žebříčku, další tajné recepty, kalibrace rytmu pro BT sluchátka.
- Progrese – zbývá (viz `EKONOMIKA.md`): ladění čísel podle testerů (ceny, drop materiálů), serverový inventář (fáze 6, podmínka monetizace), monetizace (fáze 7: nejdřív kosmetika/Kryptová cesta, placené truhly až po právní kontrole).
- Úkoly – zbývá: týdenní kontrakty (těžší, kombinují systémy, železná/zlatá truhla). Ladit cíle úkolů a Mistrovství podle testerů.
- Další nápady: kosmetika (vzhledy hrdinů, barvy pouta) jako odměny Mistrovství a později za peníze, víc tajných fúzí, týdenní kontrakty, push notifikace přes PWA (denní truhla), ověřit sdílení a instalaci na iPhonu/Androidu naostro.
- **Vydání na Google Play / App Store s monetizací – plán v `VYDANI.md`** (zatím nic nezačato). Pořadí: serverový inventář → Capacitor + Android build přes GitHub Actions → uzavřený test (12 testerů / 14 dní) → nákupy kosmetiky / reklama za odměnu → iOS. Platby jen přes nákupy v obchodech. První krok uživatele: založit Google Play účet.
- Ověřit naostro na telefonu: sdílení výsledku, instalace na plochu (Android), nová hudba, nové okno sloučení.
- Čekáme na feedback k balancu, hudbě a ovládání od testerů.

## Jak pracovat (pro nový chat)
- Uživatel je na iPhonu (hraje i jako aplikace z plochy), terminál nemá – vše nasazuj sám, po pushi ověř Pages a řekni číslo verze (`GAME_VER`), ať si ho zkontroluje dole v menu.
- Každá viditelná změna = zvýšit `GAME_VER` + položka v `NEWS`.
- Před velkou změnou krátce shrň návrh a zeptej se; po „udělej/začni“ dělej vše najednou a nasaď.
- Dlouhé simulace a rendery hudby drž krátké (uživatel nechce čekat).

## Údržba tohoto souboru
Na konci každé pracovní session aktualizuj sekce „Hotovo“ a „Nápady / plán“ a případně strukturu.
