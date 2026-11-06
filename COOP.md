# Pixel Krypta – návrh co-opu pro 2 hráče

Stav: **fáze 0–3 a Rytmické pouto jsou hotové a nasazené** (listopad 2026). Zbývá: Souhra, Duetní fúze, co-op karty pouta, co-op žebříček, návrat po odpojení.

### Jak je to postavené (odchylky od návrhu)
- Místo velkého refaktoru `run.p → run.players[]` hra používá **`withPl(pl, fn)`**: dočasně prohodí `run.p/W/P/hero/heroId/fused/fuseMiss/revived/meta` a `st` na partnera a pustí stávající kód. Sólo tak běží přesně stejnou cestou jako dřív.
- Host: `run.pls=[{p:hostP}, partner]`, `run.coop=true`. Partnerova pozice přichází ze sítě (`NET.h.in`), host ji jen ořízne. Při odhození vozíkem nastaví `p.forced` + krátký `p.lock` a pošle opravu pozice (`gp`).
- Guest: vlastní `run` jen pro vykreslení (`guestStartRun`, `guestApply`, `guestUpdate`), `isGuest()` vypíná simulaci (`hurtEnemy`, `explode`, `addXP`, `gameStep`…). Nepřátelé a střely se párují podle `nid`/`sid`, nepřátelé se plynule dotahují, střely letí podle rychlosti.
- **Mince jsou společné** (jedna pokladna na věže i opravu krystalu), XP a úroveň taky. Každý dostane na konci mince do svého savu. Co-op se nezapisuje do sólo rekordů ani žebříčku.
- Síť: `NET` (WebRTC `evt` reliable + `snap` unreliable, signalizace i záloha přes Supabase kanál `krypta-KÓD`), snímky 15/s (záloha 8/s), ping každou 1 s, odpojení: zavření kanálu / `bye` při `pagehide` / 6,5 s ticha.
- Testy: `tests/supabase-mock.js` + `tests/coop-test.js` (dvě stránky, skutečné WebRTC; `nortc` = záloha s latencí 60 ms a 5% ztrátou).
- **Neověřeno naostro:** skutečný Supabase Realtime (ze sandboxu není dostupný) a WebRTC mezi telefony přes mobilní data / Instagram. Pokud se nepůjde spojit, nejdřív zkontrolovat v Supabase, že Realtime broadcast na veřejných kanálech je povolený.

## 1. Cíl a zážitek

Dva kamarádi, každý na svém telefonu, hrají jeden běh na stejné mapě. Spojí se kódem místnosti nebo odkazem poslaným přes Instagram. Každý ovládá svého hrdinu a má vlastní kameru, zbraně a level-up karty. Hrají ale proti společné hordě, sdílí zkušenosti a ten, kdo padne, potřebuje, aby ho druhý oživil.

Hlavní co-op prvek: **Rytmické pouto** (paprsek mezi hráči, viz kap. 5).

## 2. Síťová architektura

### Kdo co počítá
- **Host** (kdo místnost založil) simuluje celou hru: nepřátele, zbraně obou hráčů, drop, XP, bosse, vozíky, krystal.
- **Každý hráč řídí pohyb svého hrdiny sám** (lokálně, bez zpoždění) a posílá svou pozici. V co-opu se nepodvádí, takže tomu můžeme věřit. Pohyb bude i pro druhého hráče okamžitý, bez lagu.
- **Host je autorita pro všechno ostatní.** Druhý hráč (guest) vykresluje svět ze snímků od hosta.

Lockstep (obě zařízení počítají totéž) nepřipadá v úvahu. Hra používá `Math.random` ve zhruba 33 místech a floaty se mezi telefony rozjedou.

### Přenos: WebRTC napřímo, Supabase jen jako „ústředna“
- Free plán Supabase Realtime má [limit 100 zpráv/s na projekt](https://supabase.com/docs/guides/realtime/limits) a [2 mil. zpráv měsíčně](https://supabase.com/pricing). Posílat stav světa přes Supabase (10–15 snímků/s + vstupy, započítává se odeslání i doručení) by znamenalo cca 40–60 zpráv/s na hru. Současně by tak šly odehrát jen 2 hry a měsíčně cca 100–150 her. To nestačí.
- **Řešení:** přes Supabase broadcast kanál `room:KÓD` se pošle jen domluva spojení (offer/answer/ICE, cca 10–30 zpráv za hru). Pak telefony komunikují přímo přes **WebRTC DataChannel**. Je to bez limitů, s nižší latencí a zdarma.
  - Kanál `snap`: unreliable + unordered (snímky; ztracený snímek nevadí, přijde další).
  - Kanál `evt`: reliable + ordered (level-up volby, smrt, oživení, fúze, pauza, konec).
  - STUN: veřejné Google STUN servery. TURN (relé pro mobilní sítě s CGNAT) nemáme. Pokud se P2P nepodaří do ~5 s, **záloha přes Supabase broadcast** se sníženou frekvencí (8 snímků/s, vstupy 8/s) a hráčům se ukáže upozornění „pomalé spojení“.
- **Vrstva `Net`** s jedním rozhraním (`send(kanál, data)`, `on(kanál, fn)`) a třemi implementacemi: `rtc`, `broadcast` (záloha) a `local` (BroadcastChannel mezi dvěma záložkami, pro testy v Playwrightu včetně simulace latence, jitteru a ztrát).
- **Riziko:** WebRTC v Instagram in-app prohlížeči. iOS WKWebView ho podporuje od iOS 14.3, Android WebView taky, ale je potřeba ověřit hned ve fázi 1 na reálných telefonech.

### Snímek světa (host → guest), 15× za sekundu
- Nepřátelé: `[id, typ, x, y, hp %, příznaky (elita/zmrazení/záblesk)]`, celá čísla, pole místo objektů. Při ~150 nepřátelích to je cca 3–5 kB na snímek, tedy desítky kB/s, což je pro DataChannel v pohodě.
- **Projektily a efekty se neposílají každý snímek.** Posílá se jen událost „vznikl projektil (x, y, vx, vy, druh)“. Guest ho nechá letět sám, pohyb je přímočarý. Totéž pro fx (výbuch, blesk, meteor) a čísla poškození. Ušetří to většinu dat.
- Ostatní: pozice/HP partnera (z pohledu hosta), drahokamy (jen vznik/sebrání), truhly, věže, krystal, vozíky (stačí pozice na kolejích `s`), boss, čas běhu, XP, mince.
- **Interpolace:** guest vykresluje nepřátele cca 100 ms v minulosti mezi dvěma snímky, takže pohyb je plynulý i při kolísání sítě.

### Synchronizace rytmu
Hra stojí na rytmu (zbraně střílí na 16tiny), takže oba telefony musí hrát hudbu ve stejné fázi.
- Při spojení se 5× pošle ping, odhadne se RTT a rozdíl hodin.
- Každý snímek nese `M.step` hosta a jeho čas. Guest jemně doladí svůj `conductor` (malé posuny `M.acc`, žádné skoky), aby doby seděly do ±20 ms.
- Zvukové efekty (zásahy, sebrání) si guest přehrává sám, kvantované na mřížku jako dnes (`qTime`). Zpoždění snímku tak není slyšet.

## 3. Lobby a průběh hry

1. Menu → **„Hrát s kamarádem“** → *Založit hru* / *Připojit se*.
2. Založení vygeneruje 4znakový kód bez zaměnitelných znaků (např. `KR4X`) a tlačítko **Sdílet** (`navigator.share` s odkazem `…/?hra=KR4X`). Kamarád klikne v Instagram DM a rovnou se připojí.
3. Oba si vyberou hrdinu (může být i stejný). Host vybere mapu z těch, které má odemčené. Oba ťuknou **Připraven** a zobrazí se kvalita spojení (ping).
4. Start: odpočet 3-2-1 **na doby hudby** a běh začne pro oba ve stejný takt.
5. Po konci oba vidí společné shrnutí (kdo kolik zabil, kolikrát kdo koho oživil) a každý dostane mince do svého savu.

## 4. Pravidla co-opu

- **Sdílené XP a úroveň.** Při level-upu se hra pozastaví oběma. Každý si vybere svou kartu; u partnera svítí „Kamarád vybírá…“. Po 15 s se vybere náhodně, aby nikdo nečekal věčně.
- **Pauza** od jednoho pozastaví oba.
- **Padnutí a oživení do rytmu:** při 0 HP hrdina padne a stane se z něj duch, který se pomalu pohybuje a smí sbírat drahokamy. Partner si stoupne do kruhu kolem něj a kruh se plní **na každou dobu** (4 doby = oživení se 40 % HP). Když padnou oba, běh končí. Druhá šance z obchodu funguje dál.
- **Škálování pro 2:** spawn ×1,7, HP nepřátel ×1,25, elity ×1,5, bossové ×1,8. Doladit simulací stejně jako u fúzí.
- **Spawny** kolem obou hráčů. Na krystalové mapě to pěkně funguje: jeden brání, druhý loví.
- **Mince z běhu** jsou zvlášť pro každého (věže si staví každý sám). Krystal opravují oba.
- **Vzdálenost:** žádné vodítko. Když je partner mimo obrazovku, u okraje se ukáže šipka s jeho portrétem.
- **Odpojení:** když vypadne guest, host hraje dál a 30 s čeká na návrat (stejný kód, obnoví se jeho hrdina). Když vypadne host, guest dostane konec běhu s dosud vydělanými mincemi. Migrace hosta je mimo rozsah.
- **Žebříček:** co-op běhy se nemíchají se sólo rekordy. Přibude záložka **Co-op** (dvojice, čas, zabití). Výhra mapy v co-opu odemyká další mapu oběma.

## 5. Zajímavé co-op prvky

### Rytmické pouto (hlavní prvek)
Mezi hráči se táhne energetický paprsek, který **pulzuje na doby hudby**.
- Nepřítel, který paprsek protne, dostane zásah na každou dobu a na první dobu taktu dvojnásobný.
- **Síla podle vzdálenosti:** do 40 jednotek je paprsek slabý a tenký, **60–140 je zlatá zóna** (nejsilnější, zlatý paprsek), od 140 do 200 slábne a nad 200 se přetrhne (s cvaknutím, nic dalšího se neděje).
- Taktika: „nůžky“, kdy hráči obíhají hordu z opačných stran a paprsek ji kosí. Hra tím odmění souhru, a ne jen to, že se hraje vedle sebe.
- **Co-op karty v level-upu** (jen v co-opu) pouto vylepšují:
  - *Pouto: výboj*: na první dobu taktu přeskočí z paprsku blesk na nejbližšího nepřítele.
  - *Pouto: mráz*: zasažení nepřátelé zpomalí.
  - *Pouto: život*: v zlaté zóně se oba pomalu léčí.
  - *Pouto: tah*: paprsek přitahuje drahokamy.

### Souhra
Když oba hráči zabijí nepřítele **na stejnou dobu**, naskočí „Souhra ×N“ a sdílené kombo roste rychleji. Za každých 10 souher padne bonusová truhla. Hudbu to propojí s tím, co dělá partner.

### Duetní fúze (napojení na fúze zbraní)
- Recept může být **rozdělený mezi oba hráče**, např. ty máš Čepele lvl 5 a kamarád Auru lvl 5.
- Oběma se pak (se stejnou šancí jako u fúze) nabídne karta **„Duetní fúze“**.
- Rituál se hraje jako **otázka a odpověď**: host ťuká doby 1 a 3, kamarád doby 2 a 4. Bonus se počítá ze společného výsledku a 4× Perfektní = „Perfektní duet“.
- **Oba** dostanou ultimátku a oba přijdou o svou rodičovskou zbraň. Odměňuje to domluvu nad buildem („vezmi Auru, já mám Čepele“).

### Hudba jako kapela
Už dnes každá ultimátka přidává do hudby nástroj. V co-opu se vrstvy obou hráčů sčítají, takže s dvěma ultimátkami hraje plná kapela na obou telefonech.

## 6. Úkoly po fázích

### Fáze 0: příprava kódu (bez viditelné změny, nasaditelné)
- [x] ~~`run.p` → `run.players[]`~~ (vyřešeno přes `withPl`) (+ `me()`, `nearestPlayer(x,y)`). Kód sahá na hráče 47× (`const p=run.p` 32×).
- [x] Nepřátelé cílí na nejbližšího živého hráče (a krystal jako dnes).
- [x] Zbraně, pasivky, statistiky (`st`) a `run.W/run.P` jako vlastnost hráče, ne běhu.
- [x] Sbírání drahokamů a předmětů pro každého hráče, magnet podle vlastních statistik.
- [x] Kamera a HUD sledují `me()`.
- [x] Regresní test: sólo běh na všech 3 mapách musí hrát stejně (porovnat DPS z `dps.js`, žádné `pageerror`).

### Fáze 1: síť a lobby
- [x] Vrstva `Net` s implementacemi `local`, `rtc`, `broadcast`.
- [x] Supabase kanál `room:KÓD` pro signalizaci, generátor kódů, `?hra=KÓD` v URL.
- [x] Obrazovky: Hrát s kamarádem → Založit/Připojit → výběr hrdinů, mapa, Připraven, ping.
- [ ] **Otestovat WebRTC na dvou reálných telefonech, včetně Instagram in-app prohlížeče a mobilních dat.**

### Fáze 2: síťová hra (základní co-op hratelný)
- [x] Host: simulace obou hráčů, snímky 15/s, události projektilů a fx.
- [x] Guest: lokální pohyb, odesílání pozice 15/s, interpolace nepřátel, vlastní simulace projektilů.
- [x] Synchronizace rytmu (ping, offset, doladění `conductor`).
- [x] Testy: dvě stránky v Playwrightu přes `local` transport s latencí 80 ms, jitterem 30 ms a ztrátou 5 %.

### Fáze 3: pravidla co-opu
- [x] Sdílený level-up s čekáním na partnera a 15s limitem.
- [x] Padnutí, duch a oživení do rytmu.
- [x] Škálování pro 2, sdílená pauza, šipka k partnerovi.
- [x] Odpojení, konec běhu a mince oběma. **Zbývá:** návrat po odpojení (30 s), společné shrnutí.

### Fáze 4: co-op prvky
- [x] Rytmické pouto. **Zbývá:** 4 co-op karty pouta.
- [ ] Souhra.
- [ ] Duetní fúze (rituál otázka–odpověď).

### Fáze 5: dokončení
- [ ] Záložka Co-op v žebříčku (nová tabulka v Supabase, RLS).
- [ ] Ladění balancu podle testerů.
- [ ] Případně lokální co-op na jednom telefonu (dva joysticky). Po fázi 0 už je to malá práce.

## 7. Odhad a rizika
- **Rozsah:** realisticky 3–4 pracovní sezení. Fáze 0 + 1 tvoří jedno, fáze 2 + 3 jedno až dvě, fáze 4 + 5 jedno. Dřívější odhad „pár hodin“ byl příliš optimistický.
- **Největší rizika:**
  1. WebRTC přes mobilní sítě bez TURN serveru. Část dvojic se nemusí spojit napřímo; záloha přes broadcast je pomalejší a čerpá kvótu. Řešení: placený TURN nebo zdarma tier (např. Cloudflare/metered) až podle skutečných dat.
  2. Výkon hosta: jeho telefon počítá dva hrdiny a víc nepřátel. Hlídat fps na slabším Androidu.
  3. Instagram in-app prohlížeč (WebRTC, uspávání při přepnutí aplikace). Při přepnutí do DM se spojení může přerušit, proto je v plánu 30s návrat.
