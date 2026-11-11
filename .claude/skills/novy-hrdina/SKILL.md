---
name: "novy-hrdina"
description: "Postup a kontrolní seznam pro nového hrdinu Pixel Krypty (sprite, popis s bonusem, tematická zbraň, talenty, odemčení, Průvodce, Novinky). Použij vždy, když se přidává hrdina nebo jeho zbraň."
---

# Nový hrdina Pixel Krypty

Komunikuj česky. Nejdřív `git fetch` + `git pull --rebase`. Vzor: Pirátka (`sailor`, kotva `anchor`), Kovářka (`smith`, kladivo `hammer`) a nejnovější Nyx (`nyx`, černá díra `voidorb`, 11h: zbraň jako efekt `fx` `bhole` s vtahováním a výbuchem na konci taktu, bonus přes existující `B.dodge`, prefix talentů `y`).

## Pravidla uživatele
- **Hrdinů je málo a každý je událost (rozhodnutí 11. 11.):** nový hrdina jen tam, kde ho plánuje `docs/PRIBEH.md` (akt I: X Paladin zdarma za Aurela; akt II: XI, XV, XX). Jinak se prohlubují stávající hrdinové (Probuzení v aktu II).
- Současných 5 hrdinů (Rytíř, Mág, Lučištník, Bard, Stavitel) zůstává základ. **Noví hrdinové nesou tematickou zbraň** (všem v nabídce od úrovně hrdiny 8, `W_UNL_LV`).
- **Popis musí jasně říct bonus**, důležité v `<b>` (žádné „Pevná ruka“ bez vysvětlení). Okno koupě `confirmHero` ukazuje zbraň, bonus a talenty.
- Hrdina kapitoly se kupuje po odemčení první mapy kapitoly (`need:'mapa'`); dokud kapitola není, `soon:'cN'` + `SOON_CH`. **Cenu nezadávej** (10j): dopočítá se z kapitoly přes `HERO_PRICE` (II 1 000, III 1 500, IV 2 000, V 3 000, VI 4 000, VII 5 500, dál ×1,4); vlastní cenu jen s `costFix:1`. V Novinkách piš cenu s `&nbsp;` (`4&nbsp;000`), jinak se číslo zalomí. Kontrola `lootcurve.js` (hrdina pozdější kapitoly musí být dražší).
- Úrovně 1–40: talenty na 5/10/15/20 jsou vlastní, volby na 25–40 (`TAL_CH`) a Prestiž jsou společné, nic dalšího nepřidávat.

## Kontrolní seznam
1. `HEROES[id]`: `name`, `sname` (krátké jméno do pásu, když je dlouhé; **limit jména v dlaždici: nejvýš 85 % = 49 px při 12 px písmu na telefonu 360 px, CZ i EN** – zhruba 7 znaků; písmo se nesmí zmenšovat, „Armsmaster“, „Námořnice“, „Hvězdářka“ byly přes – viz `tests/tools/jmenahrdinu.js`; jméno nesmí kolidovat s jiným `_t` textem, např. „Válečník“ už je), `desc` s `<b>`, `start` (zbraň), `hp`, `armor`, `dmg`, `spd`, `cost`, `need` nebo `soon`, `pal`, `rows` (sprite). Pořadí v `HERO_IDS` = pořadí v pásu.
2. Zbraň v `WEAPONS` (6 úrovní `lv`, `labels`, `desc`), chování v `LOGIC[id]` (`fire` na krocích a/nebo `cont` každý snímek), rytmický posun `W_OFF[id]`, ikona `SPR.icon[id]` (řádky v ikonách), kreslení efektu (`ULT_DRAW`/fx), případně hudební vrstva v `playStep`.
3. `W_HERO[zbraň]=id` (zbraň jen pro něj do úrovně 8).
3b. **Fúze zbraně (11m, povinné):** nová zbraň musí mít aspoň jednu fúzi se základní zbraní (`ULTS`, ikona v `ICONS`, logika s `w.mul`), jinak ji Pečetě (`sealWhy`) nemají s čím hlídat a hráč by ji mohl mít v buildu bez kombinace.
4. `TALENTS[id]` – 4 talenty `[5,…],[10,…],[15,…],[20,…]`; prefix v `heroBonus` (mapa `pre`) a účinky (`T.<prefix>5`…), změny zbraně v `talentW`.
5. Bonus hrdiny, který není v číslech `HEROES`, do `heroBonus` (`if(h==='id')…`) nebo do běhu (`run.heroId==='id'`).
6. Mistrovství (pokud se odemyká úspěchem, `ach:`), hrdina zdarma za výhru mapy `win:'mapa'` + `cost:0` (Paladin za Aurela, 11p: přidá se v `finish`, oslava po kartě konce aktu), jinak cena.
7. Průvodce se bere z dat (`HEROES`), zkontroluj text. Profilový obrázek se přidá sám (`avAll`).
8. `HERO_DAT` (3. pád jména, „Nyx“ zůstává Nyx), `lang-en.js`, `NEWS` s `hero:id` ikonou, `GAME_VER`, `CLAUDE.md`.
9. Procenta v popisech a Novinkách piš s `&nbsp;` (`8&nbsp;%`), jinak se číslo na telefonu odlomí od znaku procenta.

## Ověření
- `node tests/tools/chapcheck.js hero:<id>` – musí skončit „Vše v pořádku“ (měří i šířku jména CZ/EN v dlaždici).
- `node tests/tools/wgallery.js <prefix> <zbraň>` – vzhled zbraně ve hře (zbraň nesmí být nudná: pohyb do rytmu, výrazný zásah).
- `node tests/tools/dps.js` – síla zbraně proti ostatním (na úr. 6 podobně jako ostatní zbraně).
- `node tests/tools/heroesC.js` jako vzor testu hrdiny, smoke `shot.js`, `i18n.js static`, `newsshot.js`.
