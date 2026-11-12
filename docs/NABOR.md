# Nábor cizích testerů a tichý test (plán práce #4, #5, #9)

Cíl: 30–50 lidí, kteří hru neznají, a jejich čísla v `events` / `runs` (`docs/DATA-HRACU.md`).
Odkaz na hru: https://fastfapper69.github.io/pixel-krypta/ (hraje se v prohlížeči, na telefonu i počítači, bez instalace).
Videa: `node tests/tools/video.js [mapa] [hrdina] [sekund] [boss_od] [výstup] [jazyk]` vyrobí MP4 na výšku (1080×1920, se zvukem hry) a GIF. Hotové: `zvonice` (CZ), `jezero` (EN).
**Před zveřejněním si přečti pravidla každé skupiny** (sebepropagace bývá omezená, někde jen v určitý den nebo ve vlákně pro vlastní hry).

## Kam to dát
| Kde | Jazyk | Proč | Co přiložit |
|---|---|---|---|
| r/playmygame | EN | přímo pro zpětnou vazbu na rozpracované hry | GIF + odkaz |
| r/WebGames | EN | hry v prohlížeči bez instalace | odkaz, krátký popis |
| r/roguelites, r/survivorslikes | EN | lidé, kteří žánr znají a hrají | video |
| r/IndieGaming (sobotní vlákno), r/indiegames | EN | širší publikum | video |
| itch.io (stránka hry, HTML5) | EN | výloha, komentáře, devlog | GIF jako náhled, snímky |
| Discord: servery indie her a survivors-like | EN | rychlé reakce | GIF + odkaz |
| české skupiny (Facebook „Indie hry CZ/SK“, Discord herních komunit, r/czech) | CZ | čeština, kamarádi kamarádů | video CZ |
| TikTok, Reels, Shorts | CZ/EN | jediná „reklama“, která nic nestojí | video MP4 |

## Texty

### Reddit (EN)
**Titulek:** I made a free browser roguelite where your attacks hit on the music beat – would love blunt feedback on the first 10 minutes

**Text:**
Hi! Pixel Crypt is a survivors-like with a twist: your attacks land on the beat of a procedural chiptune soundtrack, and you build towers from chests that drop mid-run. Runs are short (boss in ~5 minutes), it's free, no ads, no sign-up, works on phones.

Play: https://fastfapper69.github.io/pixel-krypta/

I'm looking for honest feedback on:
- Was it clear what to do in the first minute?
- Does the rhythm feel fun or annoying?
- Would you come back tomorrow? Why / why not?

Thanks for playing – every comment helps.

### Reddit / Discord (krátká verze, EN)
Free browser roguelite: attacks hit on the music beat, build towers from mid-run chests, 5-minute runs, no ads, no sign-up. Feedback on the first 10 minutes would mean a lot → https://fastfapper69.github.io/pixel-krypta/

### Česky (Facebook, Discord, kamarádi kamarádů)
Dělám hru do prohlížeče **Pixel Krypta**: hordy nepřátel, útoky do rytmu hudby a věže, které stavíš během běhu. Běh trvá kolem 5 minut, hra je zdarma, bez reklam a bez registrace, jede i na mobilu.
Hledám lidi, kteří ji ještě neviděli: zahraj si 10 minut a napiš mi upřímně, co bylo nejasné, co bavilo a jestli by ses vrátil(a). 👉 https://fastfapper69.github.io/pixel-krypta/

### Popisek k videu (TikTok / Reels)
CZ: Útoky do rytmu, horda a věže 🎵⚔️ Pixel Krypta, zdarma v prohlížeči (odkaz v profilu) #indiegame #pixelart #roguelike #gamedev
EN: Every attack hits on the beat 🎵⚔️ Free browser roguelite (link in bio) #indiegame #pixelart #roguelite #survivorslike #gamedev

### itch.io – stránka hry (EN)
**Krátký popis:** A survivors-like roguelite where your attacks hit on the beat. Build towers from mid-run chests, beat the boss in five minutes.
**Popis:**
Fight hordes in a dark pixel crypt. Your weapons fire on the beat of a procedural chiptune soundtrack. Tap in rhythm during fusion rituals for stronger ultimates, and build towers from chests that drop mid-run.
- 5-minute runs with a boss at the end
- 10 chapters, 14 heroes, weapon fusions, gear and pets
- Plays on phone and desktop, free, no ads
Made by one person with a lot of help from AI. Feedback is very welcome!
**Nastavení na itch.io:** Kind = HTML, „This file will be played in the browser“, viewport 405×720, zapnout Mobile friendly (orientace na výšku) a Fullscreen button. Jako soubor nahraj zip celé hry (Claude ho připraví s relativními cestami), nebo zatím jen odkaz na GitHub Pages.

## Tichý test (#9) – návod pro tebe
1. Najdi 2–3 lidi, kteří hru nikdy neviděli. Ideálně někoho, kdo hraje hry na telefonu.
2. Dej jim telefon s otevřenou hrou (nebo odkaz) a řekni jen: „Zahraj si to 10 minut. Já nebudu nic říkat, mluv nahlas, co si myslíš.“
3. **Nic neraď a neodpovídej na otázky.** Když se zeptají, řekni „co bys zkusil(a)?“. Každá otázka je místo, kde hra něco nevysvětlila.
4. Zapisuj (stačí poznámky v telefonu):
   - kde se zasekli nebo váhali déle než 5 sekund,
   - co nepochopili nebo přehlédli (tlačítko, věž, karta, rytmus),
   - kdy se usmáli nebo řekli „hustý“,
   - kdy se začali nudit nebo koukat jinam,
   - jestli po 10 minutách chtějí hrát dál.
5. Na konci se zeptej na tři věci: Co to je za hru (jednou větou)? Co bylo nejlepší? Co bylo nejvíc otravné?
6. Poznámky mi pošli. Porovnám je s daty z `events` a opravím nejčastější zádrhel.

Lepší varianta bez práce: **Poki Playtesting** dá 10 videí cizích hráčů (`docs/PORTALY.md`).
