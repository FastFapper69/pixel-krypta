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

## Kontrola po změně zvuku (rychlá, ne celý audit)
- `node tests/tools/zvuk.js <skladby>`: běh všech stylů kolem −31 dB (±1,5), boss o 3–5 dB výš, špička pod −3 dB, žádné `musicErr`.
- `node tests/tools/ulthold.js` u změn časování ultimátek.
- Poslech nejde v sandboxu – u nových zvuků požádej uživatele, ať to pustí z telefonu.
