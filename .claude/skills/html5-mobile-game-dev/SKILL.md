---
name: "html5-mobile-game-dev"
description: "Vývoj a ladění mobilní HTML5/Canvas hry (výkon, pixel art, zvuk, PWA, iOS/Instagram prohlížeč, Supabase). Použij při práci na kódu Pixel Krypty."
---

# Mobilní HTML5 hra – inženýrské zásady

Komunikuj česky. Začni vždy přečtením CLAUDE.md v repu a drž se jeho konvencí. Po každé změně zvyš verzi a zapiš ji do CLAUDE.md.

## Herní smyčka
- requestAnimationFrame + fixní timestep pro logiku (např. 60 Hz akumulátor), render interpolovaně. Delta času omez (max ~100 ms), ať se po přepnutí tabu nic neteleportuje.
- Pauzuj hru i zvuk na `visibilitychange`.

## Výkon na telefonu
- Žádné alokace v hot loopu: object pooly pro projektily, nepřátele, částice, čísla poškození.
- Kolize přes prostorový hash/mřížku, ne O(n²).
- Statické vrstvy (mapa, dekorace) předrenderuj do offscreen canvasu.
- Omez počet částic a nepřátel podle FPS (adaptivní kvalita).
- Měř: jednoduchý FPS/frame-time overlay v debug módu, testuj na slabém Androidu.

## Pixel art
- `imageSmoothingEnabled = false`, CSS `image-rendering: pixelated`, celočíselné škálování a zaokrouhlené pozice kamery – jinak se pixely „třesou“.
- Respektuj devicePixelRatio, ale renderuj v nízkém interním rozlišení a škáluj nahoru.
- Procedurálně kreslené sprity cachuj do canvasů, nekresli je každý frame.

## Zvuk a juice
- Web Audio API; AudioContext odemkni až prvním dotykem (iOS).
- Juice: screen shake (krátký, tlumený), hit-stop pár ms, flash při zásahu, čísla poškození, zvuky s malou náhodnou výškou tónu. Volitelně kvantuj důležité zvuky na rytmus hudby.

## Prohlížeče a zařízení
- Instagram/Facebook in-app prohlížeč: omezený fullscreen a úložiště; detekuj ho a nabídni „otevřít v prohlížeči“.
- iOS Safari: fullscreen API neplnohodnotné – použij PWA (manifest + „Přidat na plochu“), `viewport-fit=cover`, safe-area insets, `100dvh`.
- Zablokuj nechtěný zoom/scroll (`touch-action: none` na canvasu), velká dotyková tlačítka (min. ~44 px).

## Ukládání a online
- Lokální save do localStorage s verzí schématu a migrací; zabal do try/catch.
- Supabase: veřejný anon klíč je v klientu v pořádku jen s Row Level Security. Skóre validuj na serveru (RPC/edge funkce, limity rozumných hodnot), klient je podvoditelný.

## Postup práce
1. Přečti relevantní kód, ne celé repo naslepo.
2. Malé, ověřitelné změny; po každé spusť testy/nástroje v tests/tools/.
3. Popiš změnu do Novinek a CLAUDE.md.