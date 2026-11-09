---
name: gamedev-zasady
description: Gamedev principles for Pixel Krypta distilled from gamedev-skills/awesome-gamedev-agent-skills (game feel, save systems, game UI/UX, audio, performance, economy, procedural gen, tower defense, roguelike), mapped onto this vanilla HTML5/canvas game, with an audit of what the game already does and what is missing. Read before work on juice, saving, menus, audio, performance, economy or daily/weekly seeds.
---

# Gamedev zásady pro Pixel Kryptu

Zdroj: github.com/gamedev-skills/awesome-gamedev-agent-skills (77 skillů, většina pro Godot/Unity/Unreal/Roblox). Pro nás relevantní: game-feel, save-systems, game-ui-ux, audio-design, performance-optimization, procedural-gen, tower-defense, roguelike, roblox-simulator-economy (vzorce ekonomiky), create-game-assets, level-design, camera-systems, prototype-fast. Níže je to přeložené na naši hru (jeden `index.html`, canvas, WebAudio, localStorage + Supabase). Audit 2026-11-09.

## 1. Game feel (juice)
- Jeden úder = 5–8 drobných reakcí najednou do ~100 ms (zvuk, částice, hit-stop, záblesk, odhoz, otřes, číslo). Krátce přehnat a vrátit do klidu.
- **Úrovně důležitosti** malá/střední/velká, každá událost patří do jedné: malá (mince, zásah) bez hit-stopu; střední (elita, sebrání) hit-stop 0,04–0,06 s; velká (boss, smrt, legendárka) hit-stop 0,10–0,15 s, záblesk, zoom.
- **Otřes jako „trauma“:** událost trauma přičte (0–1), lineárně klesá ~1,2/s, výchylka = trauma² × max × hladký šum (součet sinů), **ne `rnd()` každý snímek** (bzučí). Otřásá se kamera, ne hráč.
- Pohyb UI s easingem: „pop“ = ease-out-back (přestřelí a usadí), dosednutí = ease-out, nikdy lineárně.
- Přístupnost: posuvník síly otřesů, vypnutí záblesků (max 3 velké záblesky za sekundu).
- **Hra už má:** `run.hitstop` (elity .08, boss .25, smrt .14), `run.flashScr`, `RM` (omezení pohybu), SFX zarovnané na beat přes `qTime` a tóny z akordu (lepší než náhodná výška).
- **Chybí:** otřes je `rnd(-1,1)*run.shake` každý snímek (bzučivý, lineární) a události ho jen přepisují `Math.max` → přepsat na trauma model; jednotná tabulka úrovní.

## 2. Ukládání (save-systems)
- Ukládej data, ne objekty. **Každý save má `version`** a řetěz migrací v→v+1 (čisté funkce). Starší save se postupně převede, novější se odmítne.
- Načítání defenzivně: parse → migrace → validace → záloha poslední dobré verze, při chybě fallback na zálohu.
- Zápis atomicky (v localStorage stačí zapsat záložní klíč před přepsáním hlavního).
- Autosave na bezpečných hranicích (konec běhu, nákup), ne uprostřed boje.
- Ověření: uložit, úplně zavřít, znovu otevřít, porovnat; načíst save z minulé verze.
- **Hra:** whitelist klíčů v `loadSave` způsobil ztrátu run/Souhvězdí/týdne (opraveno 09o + `tests/tools/savekeys.js`). Chybí `save.version`, migrace jsou roztroušené (`treeMigrate`, …), chybí záložní kopie pro poškozený JSON.

## 3. UI/UX
- Rozložení přes flex/grid a kotvy, ne absolutní pixely; bezpečné oblasti (`env(safe-area-inset-*)` hra má).
- Obrazovky jako zásobník (push/pop, „Zpět“ = pop). HUD řízený událostmi, ne čtením stavu každý snímek.
- Písmo: drobný text na mobilu min. ~14–16 px, škálovat; řetězce mimo layout kvůli překladu (máme `_t` + `lang-en.js`).
- Vždy jasný fokus a stav (aktivní/zamčené s důvodem). Viz i skill `pixel-ui-art-direction`.

## 4. Zvuk
- Sběrnice Master ← Hudba/SFX/UI, posuvníky ovládají sběrnice, hlasitost kvadraticky (slider²), 0 = ticho.
- **Ducking:** při důležitém zvuku (boss, legendárka, ultimátka) hudba na ~0,25 s klesne o ~6–12 dB a vrátí se.
- Opakované SFX variovat (výška/hlasitost/vzorky); u nás variace přes tóny akordu – zachovat.
- Mobil: cílová hlasitost kolem −18 LUFS, špičky pod −1 dBTP.
- **Hra:** `M.sfxBus`, `muffle()`; zvuk/hudba jen zapnuto/vypnuto (chybí posuvníky), ducking chybí.

## 5. Výkon
- Rozpočet snímku 16,7 ms (60 FPS); nejdřív změřit (`tests/tools/menuperf.js`, profil běhu), opravit největší položku, znovu změřit, uvést čísla.
- Poolovat střely, částice a čísla poškození místo vytváření/zahazování; žádné nové pole/objekty v horké smyčce.
- Méně přepínání stavů canvasu (fillStyle, globalAlpha, filtry) – dávkovat kreslení podle barvy.

## 6. Ekonomika
- Cena úrovně `floor(b0 * g^n)`: g 1,07–1,15 pro mnohokrát kupované, 1,5–3 pro vzácné velké. Cena se zdvojí každých log2/log g úrovní.
- Prestiž: čekání na další má být jen o trochu delší (×1,2–1,5). Aditivní multiplikátor → poměr se blíží růstu požadavku.
- **Šance v truhlách:** zobrazené procento a skutečný los musí číst stejný seznam vah; pity/štěstí = nový seznam vah pro obojí.
- Čísla nad ~1e15 ztrácí přesnost (u nás nehrozí).

## 7. Náhoda a výzvy
- Generování z vlastního seedovaného RNG, ne globálního. **Hra:** `mulberry32` + `seedRng('daily|'+today())` – správně, vlastní PRNG přežije aktualizace prohlížeče. Pozor: kód, který během denní/týdenní výzvy volá `Math.random()` (163×), rozbíjí „stejný běh pro všechny“, pokud ovlivňuje herní dění (spawny, nabídky).
- Ladit s pevným seedem, pak projet víc seedů (`tests/tools/hraci.js`).

## 8. Tower defense a roguelite
- Hráč má **skoro** stačit na další vlnu; HP nepřátel rostou geometricky ~1,1–1,2×, tempo vlna → oddech → vlna.
- Proti jedné dominantní strategii: nepřátelé s protiopatřením (obrnění vs rychlopalba, létající), klesající výnos vylepšení.
- **Ohlášení další vlny/bosse** (telegraf), jinak působí nefér. Hra má intro bossů a varování výpadu.
- Roguelite: bohatá interakce předmětů, objevování, metaprogres jen jako odemykání/bonusy.

## 9. Postup prototypu
- Jedna otázka na prototyp, časový limit, šedé tvary, předem napsané „zahodit, pokud …“, dát to zkusit někomu bez vysvětlování.

## Nápady z auditu (zatím neudělané, čekají na souhlas)
1. Otřes obrazovky na trauma model + posuvník síly otřesů v Nastavení.
2. `save.version` + migrace na jednom místě + záložní kopie savu.
3. Ducking hudby při velkých momentech.
4. Posuvníky hlasitosti hudby a efektů místo vypínačů.
5. Kontrola, že denní/týdenní výzva nepoužívá `Math.random()` pro herní dění.
