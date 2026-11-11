# Data ladění 11i (11. 11. 2026)
Výsledky botů (`hraci.js`, pole běhů: map, hero, pov, won, t, kills…) a ladění (`ladeni.js`: tier, hist, info).
- `base-vstup.json` – stav před 11i, účet na vstupu, 5 povah × 4 běhy na mapu (kapitoly I–VI)
- `heroes2.json`, `heroes4.json` – 11 hrdinů × 3 povahy, účet kapitoly III (doly, kovarna, reka) a IV (jezero, pevnost); souhrn `node herostat.js data/11i/heroes2.json data/11i/heroes4.json`
- `ladeni-r3.json` – 3 kola ladění všech map I–VI (hist = hpm a výhry po kolech); `fit-out.json` = proložení společným sklonem
- `ladeni7.json` – 2 kola ladění kapitoly VII (+ hvezdarna, paluba)
- `val-vstup.json`, `val-grind.json` – ověření hodnot 11i (vstup 5 povah × 5 běhů, grind × 3)
Další ladění může začít z `hist` (víc bodů = menší šum).
