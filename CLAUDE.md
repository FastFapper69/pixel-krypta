# Pixel Krypta – poznámky pro Clauda

Mobilní webová hra (HTML5 canvas, čisté JS, bez buildu), survivors-like roguelike s tower-defense prvky a pixel artem.
UI je česky + anglická lokalizace (viz níže), s uživatelem se komunikuje česky. Hraje se hlavně na telefonu, testují to kamarádi (i přes Instagram in-app prohlížeč).

- Živá verze: GitHub Pages z větve `main`, kořen repa (`index.html`). Push na `main` = nasazení (~1 min).
  **Po pushi vždy ověř, že nasazení doběhlo:** `gh api repos/FastFapper69/pixel-krypta/actions/runs` → workflow „pages build and deployment“ pro daný commit `completed success`. GitHub občas nasazení zruší („Deployment failed, try again later“) – pak pomůže prázdný commit a push.
- Commity: autor `Claude <noreply@anthropic.com>`, na konci zprávy řádky `Co-Authored-By` / `Claude-Session` podle aktuální session.

## Předávka – čti jako první (nový chat / jiný účet)
Uživatel střídá víc Claude účtů. Paměť ani historie chatů se mezi nimi nepřenáší, **tento soubor je jediný zdroj pravdy**. Všechno potřebné je v repu.
- **Kdo je uživatel:** autor hry, je na iPhonu (hraje i jako aplikace z plochy), terminál nemá. Většinu práce dělá Claude. Komunikuj **česky**, stručně, po každé dávce řekni číslo verze.
- **Cíl hry:** návykový survivors-like („opakovatelný, ale pořád zábavný“), časem vydání na Google Play / App Store s monetizací (prodej truhel/kosmetiky, viz `VYDANI.md`). Zatím jen herní měna mezi kamarády-testery.
- **Preference (dodržuj):**
  - Po každém návrhu UI/designu ho **sám důkladně zkontroluj na screenshotu** (iPhone viewport 393×852 se simulovanými okraji): je řešení elegantní, jednoduché, dobře využité, **bez divných prázdných mezer a tmavých pruhů**? Teprve pak posílej.
  - Nemá rád přeplněné obrazovky. Preferuje ikonová tlačítka v menu před spodním dockem. Výběr hrdiny patří do Vybavení a Přípravy, ne do hlavního menu.
  - Animace menu musí být plynulé (žádné sekání).
  - Speciální mechanika nemusí být na každé mapě. Každá kapitola přidá jen pár nových nepřátel.
  - Odměny za zpětnou vazbu skromné, ne přehnané.
  - **Novinky (changelog) vždy v hezkém formátu** (přání uživatele 8. 11.): `NEWS` položka s `hl:[{ic,t,d}]` = to hlavní nahoře, každý bod s **ikonou, která k bodu patří**, drobnosti dole v `items` (zobrazí se jako „Drobnosti“). Ikona přes `newsIcon`: název ikony/mazlíčka, nebo `boss:id`, `enemy:id`, `hero:id`, `tower:id`, `map:id` (pohlednice), `item:slot:rarita`, `base:druh`, `leg:id`, `set:id`. Kontrola: `tests/tools/newsshot.js prefix [cs|en] [od verze]`. **Ikona musí být na první pohled poznat a sedět k bodu** (uživatel si stěžoval na náhodné ikony); před nasazením projít `tests/tools/itemsheet.js out.png [klíče]` (umí `slot:rarita`, `b:druh`, `boss:id`, `hero:id` a názvy ikon). Obrázky výbavy v `ITEM_ART`: s `full:1` jsou řádky 12 široké a nezrcadlí se (boty, rukavice jsou kreslené jako jeden kus, zrcadlení z nich dělalo nesmysly).
- **Jak pracovat:** před velkou změnou krátce shrň návrh a zeptej se; po „udělej“ dělej celý balík najednou, ověř (testy + screenshoty), nasaď, ověř Pages, řekni verzi. Když uživatel řekne „zastav po tomhle“, dál nepokračuj. Dlouhé simulace drž krátké.
- **Synchronizace dvou účtů (pravidlo uživatele od 8. 11. 2026, vždy dodržuj):** uživatel pracuje se dvěma Claude účty **souběžně** na stejném repu.
  - **Na začátku každé akce** (i krátké): `git fetch origin main` a porovnej `HEAD` s `origin/main`. Když je repo napřed, nejdřív `git pull --rebase` a přečti si nové commity a změny v tomhle souboru. Teprve pak začni pracovat.
  - **Na konci každé akce** (nejen na „zálohuj se“): commit všeho podstatného (kód, `lang-en.js`, testy, skilly v `.claude/skills/`, tenhle soubor se stavem a dalšími kroky) a push na `main`. Před pushem znovu `git fetch` + `git pull --rebase`; při konfliktu ho vyřeš ručně a nic nepřepisuj.
  - **Po pushi ověř Pages:** `bash tests/tools/pagescheck.sh` (čeká na běh „pages build and deployment“ pro HEAD přes `gh api …/actions/runs`; stránka *.github.io ani API `/pages` ze sandboxu nejdou). Vypíše „Pages nasazené: <commit>“.
  - **Nikdy** `push --force`. Nic důležitého nesmí zůstat jen v paměti účtu nebo v sandboxu.
  - Když push nejde (sandbox nemá repo v sezení), přidej repo do sezení s právem zápisu a zkus to znovu. Token do repa ani do paměti nikdy neukládej.
- **Testy po změně (pravidlo uživatele 9. 11.):** celý audit (`node tests/tools/audit.js`, `audit.js plny`, skill `audit-projektu`, zpráva `AUDIT.md`) **jen když o něj uživatel řekne**. Po běžné změně pusť jen malý rychlý test v oblasti, které se změna týká, a u vizuálních změn snímky (CZ i EN, malý iPhone):
  - menu a tlačítka → `menucheck.js` (+ `topcheck.js` u horního okraje); obrazovky → snímky přes `lib.open` + `SCREENS`
  - texty a Novinky → `i18n.js static` a `newsshot.js prefix cs|en od-verze`
  - ukládání → `savekeys.js`; server, přezdívky, žebříček → `cloudstub.js` (+ SQL v transakci, která se vrátí)
  - kapitoly, mapy, hrdinové → `chapcheck.js <kapitola>`; mechaniky Cesty → `featreload.js`; denní/týdenní výzva → `dailysame.js`
  - během běhu: pauza `pausetabs.js`, oslava `celeb.js`, ultimátka `ulthold.js`
  - Vždy aspoň: hra se načte bez chyb JS a `?v=` v index.html = `GAME_VER`.
  Nové testy psát nad `tests/tools/lib.js`.
- **Skilly projektu** jsou v `.claude/skills/` (html5-mobile-game-dev, survivors-design-balance, mobile-store-launch, **nova-kapitola, novy-hrdina, zvuk-a-hudba**). Když je session nenačte sama, přečti si příslušný `SKILL.md` ručně.
- **Zpětná vazba a telemetrie hráčů:** čtení potřebuje klíč `dev_key`, který **nesmí do repa** (repo je veřejné). Uživatel ho zná, popros ho o něj a o povolení domény `mpxfppuigwvwlfhsnbgr.supabase.co` (claude.ai → Settings → Capabilities). Pak `KRYPTA_DEV_KEY=… node tests/tools/fbread.js feedback|runs`.
- **Rozjetí testů v novém sandboxu:** `git clone https://github.com/FastFapper69/pixel-krypta`, pak `cd tests/tools && node -e "require('./lib').prep()"` (vytvoří off.html bez klíče a vedle něj game.js, krypta.css, lang-en.js a symlinky). Audit to dělá sám. Playwright je předinstalovaný.

## Předávka 2026-11-10 ~20:00 (verze 10j = schody a zeď kapitol, loot podle kapitoly, ceny hrdinů, vše na main)
- Obtížnost: II schod nad I, **III zeď**, IV a V zvednuté, aby schodiště drželo; VI beze změny. Čísla, metodika (měřit se stejným účtem `UCET=n`) a poučení (rozhoduje HP, `dmm`/`spx` málo) v `KAMPAN.md` „10j“. Otevřené: styl „drž odstup“ (Opatrný vyhrává skoro všude), Vrakoviště nereaguje na HP, účet po grindu ve IV vyhraje i finále.
- Loot: zlato ×(1+0,15·kapitola) (`chGoldMul`), Esence finále taky; nový test `tests/tools/lootcurve.js`. Ceny hrdinů kapitol samy z `HERO_PRICE` (II 1 000 … VI 4 000), viz `EKONOMIKA.md` a skilly `nova-kapitola`, `novy-hrdina`.
- Novinky 10j (ikony `map:doly`, `coin`, `ess`, `hero:astro`), snímky CZ i EN zkontrolované.

## Předávka 2026-11-10 ~17:30 (verze 10i = menu skladba hypnotický darksynth, vše na main)
- Menu: nová skladba vybraná po 6 kolech náčrtů (postup, co prošlo a co ne, je ve skillu `zvuk-a-hudba` „Menu“). Styl `title` = basový sekvencer + vrstvy, bez melodie. Engine: `spb` (3/4, 6/8 jen pro menu), `drive()`, nástroje `IN`, `pure` skladby bez enginového víru. `hudba-pravidla.js`: takt bez melodie projde, když ho nese psaný basový riff.
- Novinky 10i (ikona `tune`). Hlasitost menu: běh −29,6 dB (`zvuk.js menu`).
- Celý audit 10. 11. večer: `AUDIT.md` (vše prošlo; otevřené: slabší zeď kapitol II a IV, tiché selhání uložení, plynulost menu na pomalém telefonu, drobnosti na serveru).

## Předávka 2026-11-10 ~16:40 (verze 10h = banger hudba + nová menu skladba, vše na main, Pages nasazené)
- **Banger ve všech skladbách** (uživatel schválil podle poslechu pilotu na Hřbitově): `bangKit` šablona (táhlá oktávová basa, kopák do čtvrtin od E2, virbl s tleskem, 16. hi-haty, pumpování `pumpAt`/`M.pump`), kit pro každý styl (`STYLES.x.bang`), `BANG_TRIM` po stylech (běh −31 dB v `zvuk.js`), náběhy (vír + riser) a crash na nové sekci, pulzní vlny `p12`/`p25`, rychlejší gradace (int 1 od 10 s, 2 od 60 s). Tempo beze změny (spawny na taktech). `skladby.js`: změřeno 11/30 (hrbitov, poust, bazina, kostnice, zvonice, doly, kovarna, reka, pristav, majak, vir), všechny VERDIKT v cíli; zbytek uživatel nechtěl doměřovat.
- **Menu**: nová skladba (outrun E moll 118, refrén 3+3+2), styl `title`, `free`+`pure`; vybraná po 3 kolech náčrtů – co neprošlo, je ve skillu `zvuk-a-hudba` („Menu“). Engine umí `lead[64]`, `bass[64]`, `cm[64]`, `pure`, stupnici `phryg`.
- Novinky 10h s novými ikonami `tune` (zlaté noty) a `drum` (bubínek). Kontrola `hudba-pravidla.js` hlídá banger kit a BANG_TRIM u každého stylu.

## Předávka 2026-11-10 ~14:15 (verze 10g = 10f + ledová hrdinka Vločka, vše na main, Pages nasazené)
- 10f **hudba kapitoly VI + nástroje, ať další kapitoly projdou napoprvé**:
  - `songKit` v2: `answer` (vlastní odpověď), `bossAnswer`, smyčka `A B R C D B A`, boss `X Y X Z`, prázdný takt generátor neudělá. Kapitola VI má vlastní styl `STYLES.star` (dřív půjčený `frost`), mix změřený `rolecal.js`.
  - Engine: takt s jedinou držanou notou dostane v půlce tichou ozvěnu (o kvintu výš) – dřív díra 9–12 dB v klidu (hrobka, majak, paluba, trun). Bossové frost, forge a star mají v `pad` rytmické akordy při `E>=3` (dřív boss +1,7 až +2,8 dB).
  - `SONGS.x.bossDb` = zesílení bosse jedné skladby (trun 1.5, vir 1.1, vrakoviste 1.2, krystaly 1.5, srdce 1.1, soutezka .8); `skladby.js` ho navrhne. Maják: konec fráze A o oktávu výš (byl pod reproduktorem telefonu).
  - Výsledek: `skladby.js` všech 31 skladeb VERDIKT v cíli (propady 0, klid −2 až −6, boss +3 až +5).
  - Úvodní motivy Trůnu zimy, Řeky, Soutěsky a Přístavu přepsané (kopírovaly Hřbitov, Bažinu, Srdce hory, Pevnost).
  - Nové nástroje: `tests/tools/hudbacheck.js [cN|all]` + pravidla `hudba-pravidla.js` (volá je i `chapcheck.js`), `rolecal.js` (mix nového stylu proti odposlouchaným frost/sea), `skladby.js cN` s řádkem VERDIKT. Postup ve skillech `zvuk-a-hudba` („Hudba nové kapitoly“) a `nova-kapitola`.
- 10f **jména hrdinů**: limit 85 % dlaždice (49 px při 12 px na telefonu 360 px), CZ i EN, písmo se nesmí zmenšovat. Přejmenováno: Lučištník → Střelec, Zbrojmistr → Žoldák (EN Warlord), Šamanka mrazu → Vločka (EN zůstává Frost Shaman, v kartě Shaman; „Vědma mrazu“ uživatel zamítl), Námořnice → Pirátka (EN Pirate), Hvězdářka → Astra (CZ i EN; v příběhu „hvězdářka Astra“), EN Blacksmith → Smith. Kontrola `tests/tools/jmenahrdinu.js`, volá ji `chapcheck.js hero:id`. Pravidlo ve skillu `novy-hrdina`. Staré Novinky nechávají stará jména (historie).

## Předávka 2026-11-10 ~11:00 (verze 10e, vše na main, Pages nasazené)
- 10d: balanc všech kapitol (viz KAMPAN.md „10d“) + plynulost menu (paprsky `.fc-rays` na GPU vrstvě, `heroStrip`/`bartFit` bez layout thrash, dozvuk levněji a po prvním snímku, Novinky po 6 + dočítání). Měření: `menuperf.js`; zaseknutí obrazovek dřív 200–340 ms, teď 60–130 ms (CPU 4× zpomalené).
- 10e: **projeto všech 31 skladeb** (`tests/tools/skladby.js`). Melodie hraje v každé sekci (dřív hlavní téma A mlčelo ~110 s → propady na telefonu), doplněné prázdné takty v intrech pouště, kostnice, dolů, kovárny, krystalů, v Kaňonu C a menu B, boss `ENERGY_GAIN[3]` 1.12→1.3. Propady 225 → 0, klid −10 až −20 dB → −3 až −6 dB, boss +1–2 → +3–4,5 dB. Pravidla v skillu `zvuk-a-hudba`.
- Otevřené ve zvuku (10e) vyřešeno v 10f: krystaly boss, variace kap. VI.
- 10c: představení bosse trvá podle délky hlášky (`BI_TYPE` 30 znaků/s + 2,6 s čtení, finále 3,2 s; dřív 5/7 dob ≈ 2,7 s), hláška je HTML `#biLine` písmem UI (dřív 10px pixel font v canvasu = nečitelné háčky). Ověřeno SE/15, CZ/EN, nejdelší hláška (Orion), přeskočení i odchod do menu.
- 10b: `#combo` top `calc(100px + var(--sat))` – na iPhonech s výřezem dřív vjížděl do tlačítka pauzy (pevných 100 px); teď je pod lištou XP, ověřeno SE/15/Max, poušť s krystalem a bossem, kombo ×1240.
- Pravidla: celý audit jen na požádání, po změně rychlý test v dotčené oblasti; vizuální změny vždy prohlédnout (CZ i EN, malý iPhone); Novinky v hezkém formátu s ikonami.

## Aktuální stav (verze 10k, 10. 11. 2026 ~13:00, vše na main, Pages nasazené)
- Hra: 6 kapitol (30 map, I–VI), 11 hrdinů, Noční můry I–III, Nekonečná krypta na finále, Runy, Souhvězdí, Nástěnka (denní úkoly, kontrakty, týdenní výzva), co-op beta, mazlíčci, věže jen z bedny. Podrobnosti kapitol `KAMPAN.md`, ekonomika `EKONOMIKA.md`, historie všech verzí `docs/HISTORIE.md`, mapa kódu `docs/KOD.md`.
- Vzhled: kámen a železo (paleta 09z2), kovaná tlačítka všude; **v hlavním menu mají vlastní vzhled jen Hrát (zlato) a Souhvězdí (noční nebe), ostatní jsou jednotné železo** (09z8: uživateli vadil hnědý co-op a Nástěnka i rohy na Vybavení – nepřidávat), fialová jen pro Epické a kouzla. Hlavní menu = pixelové rámy v plátně (`bartDraw`), ostatní tlačítka = CSS rám `.btn:not(.art)` měněný jen proměnnými.
- Server: hra mluví s `profiles` jen přes `my_profile` / `save_profile` / `claim_profile_v2` (limit PINu), skóre čistí `stats_clean`, protokoly `private.pin_fail` a `private.cheat_log`. Migrace v `supabase/migrations/`.
- Hotovo dnes večer: audit (`AUDIT.md`), bezpečnější účty (09z4), kontrola skóre, pauza se záložkami, oslava hrdiny a nové zbraně, horní okraj (09z5), úder ultimátky před nabídkou úrovně (09z6), úklid CLAUDE.md a testů; **09z7** rozdělení na index.html + krypta.css + game.js, `lang-en.js` jen pro EN, vynucené přejmenování (`profiles.rename_req`, migrace 20261109e/f; `save_profile` teď dělá UPDATE, takže starý profil se závadnou přezdívkou se dál ukládá, jen zůstane skrytý).; **09z8** jednotné menu; **09z9** nový zvuk (role, stereo, dozvuk, telefonní basy, gradace, srovnané styly, nový master, přesnější rytmus, oprava posuvníku hudby) – pravidla ve skillu `zvuk-a-hudba`, měření `tests/tools/zvuk.js`
- 10. 11.: **poslech** (`tests/tools/poslech.js`, `poslech-offline.js`, `poslech.py` – nahrávka skutečného zvuku hry + spektrogram, telefon, stereo), podle něj **10a** mix nástrojů (`ROLE_DB`, `STYLE_ROLE`), jas 2,5 kHz, telefonní harmonické na 400 Hz, hlasitější celek. Podrobnosti ve skillu `zvuk-a-hudba`.
- Otevřené ve zvuku: nic známého, `skladby.js` všech 31 skladeb v cíli (10f). Nová kapitola: vlastní styl + `hudbacheck.js` + `skladby.js cN`.
- **Nová grafika UI (zadání uživatele 10. 11. večer):** specifikace `docs/GRAFIKA.md` (redukce textu, jedna pixelová mřížka, písmo Jersey 10, materiály místo železa). Makety pěti obrazovek (nová úroveň, pauza, obchod, kovárna, vybavení) jsou v `tests/tools/mock/grafika/` a uživatel je dostal 10. 11. večer ke schválení; do hry zatím nic nešlo. Uživatel styl schválil („začni“). **Od 10k na `main`** (uživatel řekl „dej to do hry“; sprity hrdinů/nepřátel/věží se nepředělávají, další kusy posílat snímkem a nasazovat po částech): stavebnice `KIT` v `game.js` (`KIT.paint(kořen)` nakreslí prvky s `data-k`), styly na konci `krypta.css`, hotová **nabídka nové úrovně** (`optInfo` vrací `st` = dvojice popisek/hodnota, `luCard`, `luPaint`; pasivky mají `st` vedle `txt`; test `tests/tools/lushot.js`) a **pauza** (`renderPauseBuild` + `pausePaint`, všechny tři záložky, joystick jako ikona s hláškou; `pausetabs.js`). Prvky centrované na střed vždy přes `kSnap` (celé pixely). Další: HUD, výsledky běhu, pak menu podle `docs/GRAFIKA.md`. `tests/coop-test.js` padá už na `featPop` v menu (nesouvisí), cesta hosta ověřena ručně. Souběžně běží balanc v druhém chatu – ten ať nesahá do `krypta.css` a šablon obrazovek; popisy karet se budou skládat z čísel v datech.
- Otevřené: kapitola VII Prázdnota (most `zatmeni` → void připraven); balanc: zeď proti stylu „drž odstup“ jen mechanikami (návrh pro uživatele), Vrakoviště lehké.
- Moderace přezdívek: `update public.profiles set rename_req = true, hidden = true where id = '<uuid>';` – hráč si při dalším spuštění musí vybrat novou přezdívku (nejde přeskočit), pak se sám vrátí do žebříčku i se skóre.

## Pravidla kódu, na která se snadno zapomene
- **Nový klíč `save.X`** se ukládá a synchronizuje sám; klíč jen pro zařízení přidej do `LOCAL_KEYS`. Test `savekeys.js`.
- **Novinky:** `NEWS` s `hl:[{ic,t,d}]` + `items`, ikona musí sedět k bodu, `GAME_VER` = první položka (hlídá audit). Každý nový text `_t('…')` přeložit v `lang-en.js` (test `i18n.js`).
- **Tlačítka:** u `.btn` nepřepisovat `background` (zničí kovaný rám), měnit `--f1/--f2/--f3`, `--fh/--fl/--fd/--fdd`, `--u`. Žádné `isolation`/`z-index:-1`/zlomky pixelů u rámů (iPhone rozmaže).
- **Horní okraj:** nic důležitého do `--sat + 30px` (iOS 26 rozmazání), test `topcheck.js`.
- **Server:** žádný `select('…save…')` ani `upsert` do `profiles` z klienta; nová veřejná informace hráče = `boardCard()` → `stats.card`. Změny serveru nejdřív nanečisto v `DO $$ … raise exception $$`.
- **Duplicitní funkce** (stejné jméno dvakrát) přepíše první bez varování – hlídá audit.
- **Rytmus:** útoky se počítají jen ve stavu `play`, hudba běží dál. Cokoli, co otevře okno během běhu, musí počítat s tím, že zahodí kroky (viz `ultHold` u nabídky úrovně).

## Soubory
- **Od 09z7 je hra ve třech souborech** (dřív jeden 1,1MB `index.html`):
  - `index.html` (~20 kB) – kostra: HTML obrazovek, výběr jazyka a odkazy `game.js?v=GAME_VER`, `krypta.css?v=GAME_VER`. **Při každé nové verzi přepiš `?v=` v index.html na nový `GAME_VER`** (hlídá audit „Verze souborů“), jinak by prohlížeč mohl spojit novou kostru se starým kódem z cache.
  - `krypta.css` – všechny styly. `game.js` – celý herní kód (jedno IIFE), mapa v `docs/KOD.md`.
  - Statické kontroly v testech čtou zdroják přes `require('./lib').src()` (spojí všechny tři soubory dohromady jako dřív).
  - `index.html` obsahuje konfiguraci Supabase:
  `window.KRYPTA_ONLINE={url:'https://mpxfppuigwvwlfhsnbgr.supabase.co',key:'sb_publishable_…'}` (publishable klíč je veřejný, to je v pořádku).
  Prázdné `url/key` = offline režim (tak běží i verze publikovaná jako claude.ai artefakt).
- `lang-en.js` – anglický překlad `window.KRYPTA_EN` = {český text: anglický text}. Od 09z7 ho stahuje **jen anglický hráč** (malý skript v index.html rozhodne jazyk, uloží `window.KRYPTA_LANG` a případně přes `document.write` vloží `lang-en.js` před `game.js`).
- `EKONOMIKA.md` – dlouhodobá progrese: návrh, stav (fáze 1–5 hotové) a co zbývá (serverový inventář, monetizace).
- `COOP.md` – co-op: architektura, pravidla, stav fází a co zbývá.
- `KAMPAN.md` – kampaň: kapitoly po 5 mapách (bez nových materiálů), finále, rámec map `MF`, nové mapy, nepřátelé a bossové, balanc. **Při práci na mapách čti nejdřív tohle.**
- `VYDANI.md` – plán vydání na Google Play / App Store a monetizace: co je potřeba, pořadí, kdo co dělá (Claude vs. uživatel), realistická očekávání výdělku, hra vytvořená s AI.
- PWA: `manifest.webmanifest`, `sw.js` (network-first, cache jen jako offline záloha, cizí domény neřeší), ikony `icon-180/192/512(-maskable).png` (vygenerované z lebky `SPR.icon.skull`). SW se registruje jen na https.
- `tests/` – `supabase-mock.js` (mock Supabase přes BroadcastChannel) a `coop-test.js` (dvě stránky, WebRTC).
- `supabase-setup.sql`, `supabase-pin.sql` – schéma DB (už spuštěné uživatelem v Supabase SQL Editoru).
- `supabase-feedback.sql` – tabulka `feedback` (hráči jen vkládají, max 5/den), `private.app_secret` s klíčem `dev_key`, funkce `feedback_export`, `feedback_done`, `runs_export` (čtení jen s klíčem). Klíč **není v repu** (repo je veřejné); uživatel ho zná a nastavil v SQL Editoru. Čtení: `KRYPTA_DEV_KEY=… node tests/tools/fbread.js` – ze sandboxu jen když uživatel povolí doménu `mpxfppuigwvwlfhsnbgr.supabase.co` (claude.ai → Settings → Capabilities), jinak si zprávy přečte v Supabase (Table Editor → feedback).
- `supabase-runs.sql` – tabulka `runs` pro telemetrii (uživatel ji musí spustit jednou; dokud neexistuje, hra po prvním selhání zápis tiše vypne `ON.noRuns`). Na konci souboru jsou dotazy pro přehled.
- Uživatel nemá přístup k terminálu, je na mobilu – vše nasazuj sám přes git push.

## Lokalizace (CZ/EN, 11/2026)
- Zdrojové texty jsou česky. Každý český řetězec v JS je obalený `_t('…')` (ne `L` – to je v kódu častá lokální proměnná). Klíč = přesný český text, překlad v `lang-en.js`.
- `LANG` se určí při startu: `localStorage['pixel-krypta-lang']` (nesynchronizuje se do cloudu), jinak podle telefonu (cs/sk → čeština, jinak angličtina). Přepínač `#mLang` v menu uloží volbu a stránku znovu načte (jazyk se za běhu nemění, takže `_t` funguje i v datových tabulkách při načtení).
- Statické HTML přeloží `i18nDom()` na začátku skriptu (textové uzly, placeholder/aria-label/title), ještě před `bindUi`. CSS text zuřivého bosse má variantu `html[lang=en]`.
- Pořadí slov: kde se angličtina skládá jinak, větev `EN?…:…` (např. příchod bosse). `cz()` v angličtině nechává desetinnou tečku. `onOff(b)` = zap/vyp.
- **Při přidání nebo změně textu**: obal ho `_t('…')` a přidej/uprav řádek v `lang-en.js` (i položky `NEWS`). Kontrola: `node tests/tools/i18n.js static` (chybějící překlady, neobalené české řetězce), bez `static` projde obrazovky v angličtině a vypíše viditelný český text. `en_shots.js` udělá anglické screenshoty.
- Anglický název hry je Pixel Crypt (manifest PWA zůstává Pixel Krypta).

## Jak pracovat (pro nový chat)
- Uživatel je na iPhonu (hraje i jako aplikace z plochy), terminál nemá – vše nasazuj sám, po pushi ověř Pages a řekni číslo verze (`GAME_VER`), ať si ho zkontroluje dole v menu.
- Každá viditelná změna = zvýšit `GAME_VER` + položka v `NEWS`.
- Před velkou změnou krátce shrň návrh a zeptej se; po „udělej/začni“ dělej vše najednou a nasaď.
- Dlouhé simulace a rendery hudby drž krátké (uživatel nechce čekat).

## Testování
- **Před nasazením:** `cd tests/tools && node audit.js` (~3 min, vše podstatné; `audit.js plny` přidá boty a plynulost). Změna menu: `menucheck.js`. Výsledek `audit-last.txt`.
- **Nové testy a snímky piš nad `tests/tools/lib.js`:** `L.prep()` připraví `off.html` a odkazy, `L.open({phone:'se|small|13|15|16|max',lang:'cs|en',save:'fresh|mid|late'})` vrátí stránku s okraji iPhonu, jazykem a účtem, chytá chyby JS i chybějící soubory; `L.SCREENS` = jak otevřít každou obrazovku.
- Testy podle oblasti: `savekeys`, `i18n`, `chapcheck all`, `dailysame`, `featreload`, `cloudstub` (server), `topcheck`, `pausetabs`, `celeb`, `ulthold`, `menucheck`; hráči-boti `hraci.js`; snímky obrazovek `texshot.js`, `homeshot.js`, `newsshot.js`. Jednorázové staré skripty jsou v `tests/tools/archiv/` (nepouštět bez úpravy, předpoklady jsou zastaralé).
- Původní poznámky k testům:
  Playwright + Chromium jsou předinstalované (`require('playwright')`, neinstalovat znovu). Mobilní viewport 390×800, `hasTouch`, `isMobile`.
  Pro offline test nahraď konfiguraci prázdnou (`url:'',key:''`) – síť ze shellu na Supabase nefunguje.
  Háčky na `window.__krypta`: `finish`, `ACH`, `achTrack`, `achClaim`, `achProg`, `openMaster`, `openNews`, `NEWS`, `shareImage`, `shareResult`, `seedRng`, `tutTick`, `titleOf`, `step(dt)` (tick vč. conductoru), `startRun`, `applyOption`, `levelOptions`, `openMenu`, `buildTower`, `upgradeTower`, `repairCrystal`, `force`, `god`, `M`, `setSel`, `save`, `run`, `state`, `ON`, `onlineInit`, `openBoard`, `saveNick`, `fusable`, `startFuse`, `fuseTap`, `audioBeat`, `FUSIONS`, `FZ`, `CO`, `NET`, `LO`, `openCoop`, `coHostStart`, `coJoin`, `coHostGo`, `withPl`, `players`, `econInit`, `makeItem`, `openChest`, `heroBonus`, `heroUp`, `upgradeItem`, `doMerge`, `dismantleItem`, `mergeCandidates`, `openHero`, `openChestShop`, `openCodex`, `openQuests`, `qEnsure`, `qCommit`, `qClaim`, `qClaimMs`, `qClaimWanted`, `qReroll`, `qSnap`, `spawnWanted`, `qNewDay`, `dailyInfo`, `runRewards`, `itemById`, `ECON`, `ac`.
  `startRun(hrdina, mapa, {nm, mod})`.
  Co-op test: `python3 -m http.server 8765` v kořeni repa, pak `node tests/coop-test.js` (a `nortc` pro zálohu). Virtuální partner bez sítě: `NET.open=true; CO.on=true; CO.role='host'; coHostGo()`.
  V simulacích vypni zvuk (`save.sound=false; save.music=false`). Online toky testuj s mock Supabase (`addInitScript`). Multitouch přes CDP `Input.dispatchTouchEvent`.
  Hotové testovací skripty jsou v `tests/tools/` (viz README tam: smoke `shot.js`, UI, DPS, úkoly `qtest.js`…).
  Po změně vždy: smoke test (start běhu, ~90 kroků, žádné `pageerror`, šířka dokumentu = viewport) a screenshot.
- Ověření nasazení: `gh api repos/FastFapper69/pixel-krypta/actions/runs --jq '.workflow_runs[0] | [.head_sha[0:7],.status,.conclusion] | @tsv'`.

## Údržba tohoto souboru
- Sem patří jen pravidla, aktuální stav a jak pracovat (cíl < 40 kB, hlídá audit). **Popis nové verze piš do `docs/HISTORIE.md`** (nakonec, s číslem verze); sem jen řádek do „Aktuální stav“ a nové pravidlo, pokud vzniklo.
- Předávku na konci akce: přepiš „Aktuální stav“, nepřidávej další sekci „Předávka …“.
