---
name: zvuk-a-hudba
description: Pravidla pro hudbu a zvukové efekty Pixel Krypty (procedurální WebAudio v game.js). Použij při každé změně skladeb, nástrojů, efektů, mixu nebo časování rytmu.
---

# Zvuk a hudba v Pixel Kryptě

Komunikuj česky. Kód je v `game.js`, oddíl `audio: music + rhythm` (mapa v `docs/KOD.md`).

## Jak engine funguje (09z9)
- **Skladby** `SONGS`: 4taktové sekce (`prog` akord na takt, `lead` 32 osmin ve stupních stupnice, `e` energie 0–3), `form0` jednou, `form` ve smyčce, `bossForm` od bosse. **Styl** (`STYLES.grave/desert/forge/frost/sea`) = nástroje: `drums, bass, pad, arp, lead`.
- **Graf** `musicGraph()`: každý nástroj hraje do své role (`M.roles.drums/bass/pad/arp/lead/fx`) → stereo místo + dozvuk → `musicBus` (posuvník) → `trim` (`STYLE_TRIM`) → `energy` (`ENERGY_GAIN` podle `M.int`) → `duck` → `filter` (tlumení v pauze) → 35 Hz highpass → lowshelf → ven. Paralelně „telefonní basy“: lowpass → saturace → highpass 170 Hz (reproduktor iPhonu nezahraje nic pod ~200 Hz, harmonické ano).
- **Master** `masterChain()`: `MASTER_PRE` → kompresor s tvrdým kolenem → limiter −3 dB. Nikdy nevracet měkké koleno 30 dB (zploštilo celou dynamiku, boss nebyl hlasitější).
- **Časování**: kroky běží na herních hodinách (`M.step`, `M.acc`, kvůli co-opu a gameplay), čas zvuku = herní čas + vyhlazený rozdíl `M.off` + 0,05 s. Nikdy neplánovat noty přímo z `ac.currentTime` v každém snímku (kolísá s FPS). `audioBeat()` počítá s těmi 0,05 s – při změně posunu uprav i ji.

## Pravidla
- **Hlasitost hudby mění jen posuvník** (`setBuses`). Ztlumení, ducking a efekty jdou přes `M.duck` (`duckMusic`, `duckBeat`), nikdy nezapisovat do `M.musicBus.gain` (dřív to přebilo posuvník).
- Nový nástroj ve stylu hraje přes `tone()` / `noiz(..., B)` – `playStep` mu sám přepne roli. Nový styl dostane `STYLE_TRIM` a `STYLE_REV` podle měření.
- Efekty ladí do akordu (`chordNote`) a padají do mřížky (`qTime`). Velké momenty ducknou hudbu o 6–12 dB.
- Gradace: klid (`M.int` 0) tišší a řidší, boss hlasitější a hustší. Cíl: boss o 3–5 dB nad během.

## Poslech (10. 11. 2026) – „slyšet“ hru
- `node tests/tools/poslech.js <mapa> <hrdina> <s> <boss_od> <prefix>` nahraje **skutečný výstup hry v reálném čase** (hudba + efekty, stereo WAV) a časy všech efektů. `M.master` je místo nahrávání, `M.log` sbírá efekty.
- `node tests/tools/poslech-offline.js <skladba> ...` = jen hudba, offline render ve stereu (rychlé ladění).
- `python3 tests/tools/poslech.py <prefix>` → PNG (spektrogram s událostmi, hlasitost plná vs. **reproduktor telefonu** (highpass 300 Hz), stereo v čase) + čísla: LUFS, ztráta přes telefon, pásma, šířka sterea, efekty nad hudbou. **Rytmus** porovnávej jen hra vs. offline téže skladby (bicí mají synkopy).
- Cílové hodnoty (hrbitov, 10. 11.): ztráta přes telefon ≤ 5 dB, pásmo 300 Hz–2 kHz ≥ 35 %, šířka side/mid kolem −15 dB, boss o 6–10 dB nad během, špička pod −6 dB, efekty ≥ 0 dB nad hudbou.
- **Hlasitost nástrojů** = `ROLE_DB` + `STYLE_ROLE[styl]` (dB), měřeno sólo (`musicRender(...,{solo:'lead'})`). Bez toho byly melodie o 15–40 dB pod bicími. Nový styl nebo nástroj → změř sólo a dopočítej (cíl vůči bicím: basa −3, melodie −4, arpeggio −9, akordy −10).
- Telefonní harmonické basů: highpass 400 Hz (níž padají pod reproduktor a jen zahušťují spodek).
- **Rozbor všech skladeb** (10b): `node tests/tools/skladby.js [skladby] [json]` – po taktech hlasitost přes reproduktor telefonu, průběh klid/běh/vrchol/boss. Cíl: **0 propadů** (takt o víc než 6 dB, v klidu 9 dB, pod mediánem běhu), klid o 2–6 dB pod během, boss o 3–5 dB nad. Trvá ~2 min na skladbu (při 3 souběžných ~6 min), 31 skladeb ~1 h. Na pozadí pouštěj s timeoutem 7200000 ms a po 4–10 skladbách, jinak běh zabije limit 40 min.
- **Melodie hraje v každé sekci** (10b). Dřív sekce s `e:1` (hlavní téma A) neměly melodii až do intenzity 2 (~110 s hry) → propad 12–18 dB. Teď jen tišeji (`lv` v `playStep`: klid .6, běh .8). Neschovávat melodii znovu podmínkou.
- **Žádný celý prázdný takt v `lead`** (ani v intru): na telefonu je to −16 až −25 dB díra. Pauzu udělej půltaktem nebo krátkou odpovědí v tónech akordu toho taktu.
- Boss: `ENERGY_GAIN[3]=1.3` (dřív 1.12 → boss jen +1–2 dB).

## Hudba nové kapitoly (10f) – stavebnice to hlídá sama
- Skladby kapitoly dělej **jen přes `songKit`** (v2): `motif` + vlastní `answer` (odpověď, 8 osmin, jiný obrys) + vlastní `boss` (+ `bossAnswer` u finále). Generátor sám dodá 7sekční smyčku `A B R C D B A`, bosse `X Y X Z`, melodii v každé sekci a žádný prázdný takt.
- **Každá kapitola má vlastní styl** v `STYLES` (I grave, II desert, III forge, IV frost, V sea, VI star). Nový styl = kopie nejbližšího + vlastní nástroje, pak:
  1. `node tests/tools/rolecal.js <skladby stylu>` → řádek `STYLE_ROLE` (cíl = poměry nástrojů odposlouchaných stylů frost a sea; hotovo při odchylce ≤ 1,5 dB). Absolutní cíle „basa −3, melodie −4…“ tímhle měřením nesedí ani na hotové styly – nepoužívat.
  2. `STYLE_TRIM` podle `zvuk.js` (běh jako ostatní styly), `STYLE_REV` (.1–.3).
  3. Boss: telefon přenese hlavně středy, takže síla bosse = **rytmické akordy v `pad` při `E>=3`** (a hustší arpeggio), ne bicí a basa. Bez nich vycházel boss jen +1,7–3 dB (star, frost, forge). Když jedné skladbě boss pořád chybí, `SONGS.x.bossDb` (dB navíc jen pro bosse té skladby; `skladby.js` ho navrhne).
  4. Konec fráze s jedinou držanou notou řeší engine sám (ozvěna o kvintu výš v půlce taktu; níž by spadla pod reproduktor telefonu ~300 Hz) – nespoléhat na to schválně, ale díra v klidu z toho už nevznikne.
- **Kontroly:** `node tests/tools/hudbacheck.js cN` (rychlá, pravidla v `hudba-pravidla.js`: vlastní styl s mixem, žádný prázdný takt, jedinečný úvodní motiv mezi všemi skladbami, pestrost ≥ 12 různých taktů, songKit s vlastní odpovědí a bossem; volá ji i `chapcheck.js`) a `node tests/tools/skladby.js cN` (po taktech, řádek **VERDIKT**: propady 0, klid −2 až −6 dB, boss +3 až +5,5 dB). Kapitola je hotová, až obě projdou.
- Úvodní motiv nesmí kopírovat jinou skladbu (10f: Zima = Hřbitov, Soutěska = Srdce hory, Řeka ≈ Bažina, Přístav ≈ Pevnost – přepsané).

## Banger (10h) – všechny skladby, uživatel schválil podle poslechu
- **Každá skladba je „bang“** (`isBang(S)`, vypnout jde jen `bang:false` – nedělat). Engine přidá sám: pumpování basy a padu při každém kopáku (`pumpAt`, uzel `M.pump`), virblový vír před sekcí se stejnou nebo vyšší energií + riser jen před vyšší, crash na první době nové sekce od E2, 16. pulzní arpeggio od E2, k melodii pulzní vrstvu `p25`, ozvěnu `p12` a oktávový švih.
- **Pulzní vlny**: `tone('p12'|'p25', …)` = NES pulz 12,5 / 25 % (`pulseWave`). Na ostrý chiptune zvuk používej je, ne `square`.
- **Kit stylu** = `STYLES.x.bang=bangKit({kick:Hz, snare:Hz, hat:Hz, push:krok, bass:{calm,run,full}, voice(f,t,d,acc,E), extra(x)})`: táhlá basa (osminy v běhu, 16. od E2), kopák do čtvrtin od E2, virbl s tleskem, 16. hi-haty. `voice` = vlastní zvuk basy stylu (zachovat hlasitost původní basy, mix STYLE_ROLE se na ni měřil), `extra` = vlastní perkuse stylu (zvon, darbuka, kovadlina…).
- **Hlasitost**: hustší aranžmá je o ~4 dB hlasitější → `BANG_TRIM[styl]` tak, aby běh v `zvuk.js` byl −31 dB (±1). Bossy pak `skladby.js` (VERDIKT) a případně `SONGS.x.bossDb`.
- **Gradace**: bang skladby mají `M.int` 1 od 10 s a 2 od 60 s (dřív 35/110 s). **Tempo neměnit** – spawny, bouře a další herní události jsou navázané na takty.
- **Hi-haty** dřív nebyly na spektrogramu vůbec vidět (vršky −18 dB pod kopákem) – v kitu jsou o ~8 dB silnější; neubírat.

## Menu = vlastní skladba (10h, vybral uživatel po třech kolech náčrtů)
- `SONGS.menu`: `free:true` (hraje vlastní energii sekcí, `M.int` v menu = 2), `pure:true` (engine nepřidává osmibitové vrstvy – pulzní arpeggio, ozvěnu, tercii; styl dělá celý zvuk), styl `title` (outrun: kopák s rychlým pádem výšky + klik, virbl s tleskem a dozvukem od E2, otevřený hi-hat na „a“, pad ze 4 pil pumpující s kopákem, melodie ze 3 rozladěných pil s ozvěnou na tečkovanou osminu, arpeggio ve střední poloze od E2), E moll, 118 BPM.
- Stavba: intro (náznak háčku) → sloka (opakovaný tón h-h-h-c-h posouvaný po akordech Em C Am H) → sloka s virblem → **refrén v G dur** s háčkem 3+3+2 (dvakrát níž, potřetí jednou nahoru na e2) → refrén s jiným koncem → breakdown → build (jeden tón stoupá po taktech, riser) → refrén ×2.
- Melodie `lead[64]` (šestnáctiny, hraje se přesně), sekce smí mít `bass[64]` a `cm[64]`.
- **Co uživatel odmítl** (ať se to neopakuje): hustý běh šestnáctin po stupnici místo motivu, okoukané akordy i–VI–III–V bez nápadu, přeplácané aranžmá, drop „o oktávu výš“, vysoké pípavé osmibitové vrstvy nad synťákovým zvukem, melodie bez myšlenky (jen tvar). Funguje: krátký rytmický motiv, který se opakuje a posouvá, střední poloha, nejvyšší tón jen jednou ve vrcholu, zvuk s údernými bicími a širokými pumpujícími akordy.
- Náčrty se dělají jako dočasné `SONGS.skN` + styl a renderují `node tests/tools/poslech-offline.js skN <s> 999 <prefix>` (volné skladby renderuje s int 2), ukázky MP3 přes ffmpeg `loudnorm` na stejnou hlasitost.

## Kontrola po změně zvuku (rychlá, ne celý audit)
- `node tests/tools/zvuk.js <skladby>`: běh všech stylů kolem −31 dB (±1,5), boss o 3–5 dB výš, špička pod −3 dB, žádné `musicErr`.
- `node tests/tools/ulthold.js` u změn časování ultimátek.
- Poslech nejde v sandboxu – u nových zvuků požádej uživatele, ať to pustí z telefonu.
