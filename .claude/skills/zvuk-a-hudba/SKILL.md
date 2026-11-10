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
- Otevřené: v některých sekcích skladeb hrají jen bicí + basa → na telefonu propad ~10 dB (kompozice, ne mix).

## Kontrola po změně zvuku (rychlá, ne celý audit)
- `node tests/tools/zvuk.js <skladby>`: běh všech stylů kolem −31 dB (±1,5), boss o 3–5 dB výš, špička pod −3 dB, žádné `musicErr`.
- `node tests/tools/ulthold.js` u změn časování ultimátek.
- Poslech nejde v sandboxu – u nových zvuků požádej uživatele, ať to pustí z telefonu.
