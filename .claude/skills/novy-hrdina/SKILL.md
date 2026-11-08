---
name: "novy-hrdina"
description: "Postup a kontrolní seznam pro nového hrdinu Pixel Krypty (sprite, popis s bonusem, tematická zbraň, talenty, odemčení, Průvodce, Novinky). Použij vždy, když se přidává hrdina nebo jeho zbraň."
---

# Nový hrdina Pixel Krypty

Komunikuj česky. Nejdřív `git fetch` + `git pull --rebase`. Vzor: Námořnice (`sailor`, kotva `anchor`) a Kovářka (`smith`, kladivo `hammer`).

## Pravidla uživatele
- Současných 5 hrdinů (Rytíř, Mág, Lučištník, Bard, Stavitel) zůstává základ. **Noví hrdinové nesou tematickou zbraň** (všem v nabídce od úrovně hrdiny 8, `W_UNL_LV`).
- **Popis musí jasně říct bonus**, důležité v `<b>` (žádné „Pevná ruka“ bez vysvětlení). Okno koupě `confirmHero` ukazuje zbraň, bonus a talenty.
- Hrdina kapitoly se kupuje (typicky 1500 zlata) po odemčení první mapy kapitoly (`need:'mapa'`); dokud kapitola není, `soon:'cN'` + `SOON_CH`.
- Úrovně 1–40: talenty na 5/10/15/20 jsou vlastní, volby na 25–40 (`TAL_CH`) a Prestiž jsou společné, nic dalšího nepřidávat.

## Kontrolní seznam
1. `HEROES[id]`: `name`, `sname` (krátké jméno do pásu, když je dlouhé), `desc` s `<b>`, `start` (zbraň), `hp`, `armor`, `dmg`, `spd`, `cost`, `need` nebo `soon`, `pal`, `rows` (sprite). Pořadí v `HERO_IDS` = pořadí v pásu.
2. Zbraň v `WEAPONS` (6 úrovní `lv`, `labels`, `desc`), chování v `LOGIC[id]` (`fire` na krocích a/nebo `cont` každý snímek), rytmický posun `W_OFF[id]`, ikona `SPR.icon[id]` (řádky v ikonách), kreslení efektu (`ULT_DRAW`/fx), případně hudební vrstva v `playStep`.
3. `W_HERO[zbraň]=id` (zbraň jen pro něj do úrovně 8).
4. `TALENTS[id]` – 4 talenty `[5,…],[10,…],[15,…],[20,…]`; prefix v `heroBonus` (mapa `pre`) a účinky (`T.<prefix>5`…), změny zbraně v `talentW`.
5. Bonus hrdiny, který není v číslech `HEROES`, do `heroBonus` (`if(h==='id')…`) nebo do běhu (`run.heroId==='id'`).
6. Mistrovství (pokud se odemyká úspěchem, `ach:`), jinak cena.
7. Průvodce se bere z dat (`HEROES`), zkontroluj text. Profilový obrázek se přidá sám (`avAll`).
8. `lang-en.js`, `NEWS` s `hero:id` ikonou, `GAME_VER`, `CLAUDE.md`.

## Ověření
- `node tests/tools/chapcheck.js hero:<id>` – musí skončit „Vše v pořádku“.
- `node tests/tools/wgallery.js <prefix> <zbraň>` – vzhled zbraně ve hře (zbraň nesmí být nudná: pohyb do rytmu, výrazný zásah).
- `node tests/tools/dps.js` – síla zbraně proti ostatním (na úr. 6 podobně jako ostatní zbraně).
- `node tests/tools/heroesC.js` jako vzor testu hrdiny, smoke `shot.js`, `i18n.js static`, `newsshot.js`.
