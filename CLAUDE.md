# Pixel Krypta – poznámky pro Clauda

Mobilní webová hra (HTML5 canvas, čisté JS, bez buildu), survivors-like roguelike s tower-defense prvky a pixel artem.
UI je česky, s uživatelem se komunikuje česky. Hraje se hlavně na telefonu, testují to kamarádi (i přes Instagram in-app prohlížeč).

- Živá verze: GitHub Pages z větve `main`, kořen repa (`index.html`). Push na `main` = nasazení (~1 min).
- Commity: autor `Claude <noreply@anthropic.com>`, na konci zprávy řádky `Co-Authored-By` / `Claude-Session` podle aktuální session.

## Soubory
- `index.html` – celá hra v jednom souboru (~137 kB, jedno IIFE). Obsahuje konfiguraci Supabase:
  `window.KRYPTA_ONLINE={url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'sb_publishable_…'}` (publishable klíč je veřejný, to je v pořádku).
  Prázdné `url/key` = offline režim (tak běží i verze publikovaná jako claude.ai artefakt).
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
Háčky na `window.__krypta`: `step(dt)` (tick vč. conductoru), `startRun`, `applyOption`, `levelOptions`, `openMenu`, `buildTower`, `upgradeTower`, `repairCrystal`, `force`, `god`, `M`, `setSel`, `save`, `run`, `state`, `ON`, `onlineInit`, `openBoard`, `saveNick`.
V simulacích vypni zvuk (`save.sound=false; save.music=false`). Online toky testuj s mock Supabase (`addInitScript`). Multitouch přes CDP `Input.dispatchTouchEvent`.
Po změně vždy: smoke test (start běhu, ~90 kroků, žádné `pageerror`, šířka dokumentu = viewport) a screenshot.

## Hotovo
Survivors základ, 4 hrdinové, 3 mapy, věže + Stavitel, krystal v poušti, testovací režim, rytmická chiptune hudba, propracovaný pixel art (hřbitov ve stylu Graveyard Keeper), žebříček + cloud save + přezdívka/PIN, hosting na GitHub Pages, joystick ve 3 režimech + multitouch, čitelnější písmo, plynulý šikmý pohyb (kamera), propracovaná poušť (chrám, oázy s léčením, kostra obra), propracované doly (koleje, rozjeté vozíky, těžní věž), skrytý testovací režim (podržení „Hudba“ 3 s).

## Nápady / plán
- Online co-op pro 2 hráče: host-authoritative, host simuluje a posílá snapshoty ~15–20/s přes Supabase Realtime broadcast, druhý telefon posílá jen vstupy; kód místnosti, sdílený level-up, odpojení, interpolace, balanc pro 2. Odhad: pár hodin práce.
- Alternativa: lokální co-op na jednom telefonu (dva joysticky) – cca čtvrtina práce.
- **Fúze zbraní (schválený návrh, zatím neimplementováno):**
  - Podmínka: 2 zbraně podle receptu, obě lvl ≥ 5. Pak level-up nabídne zlatou kartu „Fúze!“ s šancí 60 % (pity: nejpozději 3. level-up jistě), truhla z elity/bosse 80 %. Odmítnutá karta se vrací. Fúze uvolní slot (2 zbraně → 1).
  - Recepty: Čepele+Aura = Vír ostří, Střela+Blesk = Řetězová bouře, Ohnivá koule+Sekera = Meteorit, Šípy+Mrazivá vlna = Ledová smršť.
  - Ultimátka má úrovně I–III (další karty), cca 1,4× DPS obou rodičů; každá přidá do hudby vlastní vrstvu a na začátku fráze (4 takty) udělá „drop“ útok.
  - Ťukání do rytmu po výběru karty: boj stojí, hudba hraje, 4× pulzující kruh na dobu; ťuk kamkoliv, Perfektní +6 %, Dobré +3 %, 4× Perfektní = „Perfektní fúze“ (+25 %). Netrefa nic nebere. Čas podle audio hodin (případně později kalibrace).
  - Postup: 1) podmínka + karta + recepty + I–III + slot, 2) ťukání + hudební vrstvy, 3) Kodex fúzí v menu (??? s nápovědou) + stat v žebříčku.
- Čekáme na feedback k balancu a ovládání od testerů.

## Údržba tohoto souboru
Na konci každé pracovní session aktualizuj sekce „Hotovo“ a „Nápady / plán“ a případně strukturu.
