# Pixel Krypta – poznámky pro Clauda

Mobilní webová hra (HTML5 canvas, čisté JS, bez buildu), survivors-like roguelike s tower-defense prvky a pixel artem.
UI je česky, s uživatelem se komunikuje česky. Hraje se hlavně na telefonu, testují to kamarádi (i přes Instagram in-app prohlížeč).

- Živá verze: GitHub Pages z větve `main`, kořen repa (`index.html`). Push na `main` = nasazení (~1 min).
- Commity: autor `Claude <noreply@anthropic.com>`, na konci zprávy řádky `Co-Authored-By` / `Claude-Session` podle aktuální session.

## Soubory
- `index.html` – celá hra v jednom souboru (~137 kB, jedno IIFE). Obsahuje konfiguraci Supabase:
  `window.KRYPTA_ONLINE={url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'sb_publishable_…'}` (publishable klíč je veřejný, to je v pořádku).
  Prázdné `url/key` = offline režim (tak běží i verze publikovaná jako claude.ai artefakt).
- `EKONOMIKA.md` – dlouhodobá progrese: návrh, stav (fáze 1–5 hotové) a co zbývá (serverový inventář, monetizace).
- `COOP.md` – co-op: architektura, pravidla, stav fází a co zbývá.
- `tests/` – `supabase-mock.js` (mock Supabase přes BroadcastChannel) a `coop-test.js` (dvě stránky, WebRTC).
- `supabase-setup.sql`, `supabase-pin.sql` – schéma DB (už spuštěné uživatelem v Supabase SQL Editoru).
- Uživatel nemá přístup k terminálu, je na mobilu – vše nasazuj sám přes git push.

## Struktura kódu (sekce `/* ==== … ==== */` v index.html)
helpers → save → pixel sprites → maps → weapons and passives → meta shop → audio (music + rhythm) → canvas → state → input → run → level-up → end of run → HUD → rendering → loop → menus → online (Supabase) → boot.

Obsah:
- Hrdinové: knight (Rytíř), archer (Lučištník), mage (Mág), builder (Stavitel).
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
- **Co-op (extra režim, sólo beze změny):** menu „Hrát s kamarádem“ → `#scr-coop` (kód 4 znaky, odkaz `?hra=KÓD`, výběr hrdiny, host vybírá mapu). Host simuluje oba hrdiny (`run.pls`, `withPl`), guest kreslí snímky (`isGuest()`, `guestApply`). Síť `NET` = WebRTC + signalizace/záloha přes Supabase broadcast. Detaily v `COOP.md`.
  Pravidla: společné XP/úroveň/mince, level-up čeká na oba (`run.lv`, stav `'wait'`, 25 s limit), padnutí → duch (×0,55 rychlost, nestřílí), oživení stáním u něj 4 doby (`coopBeat`), oba padlí = konec. Škálování: spawn ×1,7, HP ×1,25, elity ×1,5, boss ×1,8. Rytmické pouto `bondStr(d)` (zlatá zóna 60–140, zásah na dobu, ×2 na takt). Pauza je společná. Co-op se nepočítá do žebříčku/rekordů.
- Zvuk po zamčení telefonu: iOS nechá AudioContext ve stavu `interrupted` (nebo hlásí `running` a mlčí). `audioInit` obnovuje z jakéhokoliv stavu (gesta pointerdown/touchend/click, návrat do aplikace), `audioWatch` po 0,8 s zkontroluje, že běží `currentTime`, jinak `M.dead` → při dalším dotyku nový kontext. `playStep`/`sfx` nic neplánují, když kontext neběží.
- **Progrese (EKONOMIKA.md):** materiály map (`MAT_OF`: hřbitov Kostní prach, poušť Jantar, doly Magmatit; drop z elit 3–5, 1 % z běžných, `k:'mat'`; odměna `runRewards`: sebrané + 2/min + 15 za bosse, ×1,5 výhra, ×(1+0,5·NM)), úrovně hrdinů 1–20 (`heroUp`, +2 % HP/poškození za úroveň, talenty na 5/10/15/20), výbava (4 sloty, 5 rarit, `heroBonus` → `run.bonus` → `recalc`), obrazovky `#scr-hero` (úroveň, talenty, sloty, inventář, detail předmětu: nasadit/vylepšit +10/rozebrat), `#scr-chests` (denní truhla, 3 truhly se šancemi a pity, kovárna: sloučení 3→1 rituálem `startFuse(...,opts)`), `#scr-codex` (fúze + legendárky).
  Noční můry I–V (`run.nm`, `nmTiers`, nepřátelé +40 % HP / +20 % poškození za stupeň, zlato +30 %, výhra na NM dá předmět a odemkne další stupeň), denní výzva (`dailyInfo`, modifikátory fast/glass/horde/noheal, `run.mod`, odměna 1× denně). Legendárky (`st.lg`): metro, bass, heart, crown, chain, compass. Co-op: kamarád posílá `bonus` v `hello`, host vybírá NM, odměny dostanou oba (zpráva `end` nese autoritativní čísla).
- Rytmus: WebAudio, `SONGS` per mapa (BPM, akordy, motiv), `conductor(dt)` krokuje 16tiny → `playStep` + `gameStep(s)`.
  Zbraně/věže střílí na kvantovaných krocích (`qsteps`, `W_OFF`), nepřátelé/spawny na `run.beatNow`/`run.barNow`, SFX přes `qTime` v tónech akordu. Combo, hit-stop.
- Save: `localStorage['pixel-krypta-v1']`, objekt `save` (coins, heroes, cleared, best, meta, stats, nick, stick, updated…).
- Online: supabase-js 2.45.4 (jsdelivr UMD), anonymní přihlášení, tabulka `profiles` s RLS, přezdívka + PIN přes RPC `set_pin` / `claim_profile` (bcrypt). Merge savu podle `save.updated`. In-memory storage fallback pro in-app prohlížeče. Testovací režim (`save.cheat`) se do žebříčku nepočítá.
- Testovací režim je skrytý: tlačítka `#mCheat`/`#mGold` uvidí jen vývojář – odemkne je podržení tlačítka „Hudba“ v menu 3 s (znovu = skryje). Příznak v `localStorage['pixel-krypta-dev']` (`isDev`/`setDev`), nesynchronizuje se do cloudu; bez něj se `save.cheat` vynuluje (i z cloud savu).
- Písmo: texty/čísla `Chakra Petch` (`--font`), pixelový `Pixelify Sans` (`--font-px`) jen pro velké nadpisy (.logo, .title, .head h2) – malý Pixelify byl na mobilu nečitelný.
- Kamera: pevně na hráči (bez zpoždění), zaokrouhlená na art-pixel mřížku `RZ`; všechny pozice na obrazovce přes `RZ(x+ox)`, ne `Math.round` – jinak hrdina při šikmém pohybu poskakuje.
- Ovládání: joystick má režimy `save.stick` = `touch` (pevný v místě dotyku, výchozí) / `fixed` (vlevo dole) / `follow` (plovoucí). Tlačítka HUD používají `onTap()` (reagují na pointerdown) kvůli multitouch. Stavění věží je svislý sloupec vpravo dole.

## Testování
Playwright + Chromium jsou předinstalované (`require('playwright')`, neinstalovat znovu). Mobilní viewport 390×800, `hasTouch`, `isMobile`.
Pro offline test nahraď konfiguraci prázdnou (`url:'',key:''`) – síť ze shellu na Supabase nefunguje.
Háčky na `window.__krypta`: `step(dt)` (tick vč. conductoru), `startRun`, `applyOption`, `levelOptions`, `openMenu`, `buildTower`, `upgradeTower`, `repairCrystal`, `force`, `god`, `M`, `setSel`, `save`, `run`, `state`, `ON`, `onlineInit`, `openBoard`, `saveNick`, `fusable`, `startFuse`, `fuseTap`, `audioBeat`, `FUSIONS`, `FZ`, `CO`, `NET`, `LO`, `openCoop`, `coHostStart`, `coJoin`, `coHostGo`, `withPl`, `players`, `econInit`, `makeItem`, `openChest`, `heroBonus`, `heroUp`, `upgradeItem`, `doMerge`, `dismantleItem`, `mergeCandidates`, `openHero`, `openChestShop`, `openCodex`, `dailyInfo`, `runRewards`, `itemById`, `ECON`, `ac`.
`startRun(hrdina, mapa, {nm, mod})`.
Co-op test: `python3 -m http.server 8765` v kořeni repa, pak `node tests/coop-test.js` (a `nortc` pro zálohu). Virtuální partner bez sítě: `NET.open=true; CO.on=true; CO.role='host'; coHostGo()`.
V simulacích vypni zvuk (`save.sound=false; save.music=false`). Online toky testuj s mock Supabase (`addInitScript`). Multitouch přes CDP `Input.dispatchTouchEvent`.
Po změně vždy: smoke test (start běhu, ~90 kroků, žádné `pageerror`, šířka dokumentu = viewport) a screenshot.

## Hotovo
Survivors základ, 4 hrdinové, 3 mapy, věže + Stavitel, krystal v poušti, testovací režim, rytmická chiptune hudba, propracovaný pixel art (hřbitov ve stylu Graveyard Keeper), žebříček + cloud save + přezdívka/PIN, hosting na GitHub Pages, joystick ve 3 režimech + multitouch, čitelnější písmo, plynulý šikmý pohyb (kamera), propracovaná poušť (chrám, oázy s léčením, kostra obra), propracované doly (koleje, rozjeté vozíky, těžní věž), skrytý testovací režim (podržení „Hudba“ 3 s), fúze zbraní (4 ultimátky I–III, rytmický rituál, drop na frázi, hudební vrstvy), online co-op pro 2 (WebRTC, lobby s kódem, oživení, rytmické pouto), oprava zvuku po zamčení telefonu, progrese: materiály map, úrovně hrdinů a talenty, výbava s raritami, obchod s truhlami, kovárna, Noční můry I–V, legendárky, Sbírka, denní výzva.

## Nápady / plán
- Co-op – zbývá (viz `COOP.md`): **ověřit naostro na dvou telefonech** (Supabase Realtime + WebRTC přes mobilní data/Instagram), Souhra, Duetní fúze, co-op karty pouta, co-op žebříček, návrat po odpojení.
- Fúze – zbývá krok 3: Kodex fúzí v menu (neobjevené recepty jako ??? s nápovědou, uložit do savu) + stat „Objevené fúze“ v žebříčku. Případně tajné recepty (Ohnivá koule+Mráz = Parní exploze) a kalibrace rytmu pro BT sluchátka.
- Progrese – zbývá (viz `EKONOMIKA.md`): ladění čísel podle testerů (ceny, drop materiálů), serverový inventář (fáze 6, podmínka monetizace), monetizace (fáze 7: nejdřív kosmetika/Kryptová cesta, placené truhly až po právní kontrole).
- Čekáme na feedback k balancu a ovládání od testerů.

## Údržba tohoto souboru
Na konci každé pracovní session aktualizuj sekce „Hotovo“ a „Nápady / plán“ a případně strukturu.
