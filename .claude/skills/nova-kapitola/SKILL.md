---
name: "nova-kapitola"
description: "Postup a kontrolní seznam pro novou kapitolu Pixel Krypty (5 map, nepřátelé, bossové, set, legendárka, hudba, intro, Průvodce, Novinky). Použij vždy, když se dělá nová kapitola nebo nová mapa."
---

# Nová kapitola Pixel Krypty

Komunikuj česky. Nejdřív `git fetch` + `git pull --rebase` a přečti `KAMPAN.md` (rámec map, schodiště obtížnosti, co mají předchozí kapitoly). Stavebnice je v `index.html` v oddílu **chapter kit (08y)**, zkouška stavebnice `tests/tools/kitdemo.js`.

## Pravidla uživatele (neporušovat)
- **Žádné nové materiály** (jen Úlomky a Esence). Kapitola = 5 map, pátá je finále se speciálním bossem.
- **Každá kapitola je zeď**: vstup ~×1,22 HP proti předchozí kapitole, hráč se má vracet grindit Noční můry. Bossové jsou výzva.
- Speciální mechanika **jen u některých map** (typicky 3 z 5, finále vždy). Kapitola přidá **jen pár nových nepřátel** (3–4).
- Set kapitoly v **jiných slotech** než set předchozí kapitoly. **Každá pátá kapitola (V, X, XV…) má set 6 kusů** (`six:1`, `b6n`/`b6`), lepší kořist (`setRarity` +1 stupeň).
- Popisy map: klíčová mechanika v `<b>…</b>` (CZ i EN). Mapa bez mechaniky bez `<b>`.
- Každý boss má hlášku v `BOSS_INTRO` (krátká, vtipná, ve stylu Borderlands). Finále je delší intro samo (`map.finale`).
- Novinky vždy v hezkém formátu: `hl:[{ic,t,d}]` s ikonou, která k bodu patří (`map:id`, `boss:id`, `enemy:id`, `hero:id`, `set:id`, `leg:id`), drobnosti v `items`.
- Před velkou změnou krátce shrň návrh a zeptej se. Po „udělej“ celý balík, ověř, nasaď, řekni verzi.

## Co dělat ručně (to dělá kapitolu jedinečnou)
1. **Téma a paleta**: 4–6 barev země, cesty, akcenty, zeď (`kit.ground`, `path`, `accent`, `tile`, `wall`, `zone.pal`, `spark`, `shadow`), `grade`, `dark`, `amb`, `ambient`.
2. **Sprity**: rekvizity map do `KIT_PROPS` (řádky + paleta, `big:1` = 2× větší), nepřátelé do `ENEMY_DEFS` (rows, pal), bossové do `BOSS_DEFS` (rows, pal, `big:1` u finále), kusy setu do `ITEM_ART` (`<set>_<slot>`, boty a rukavice `full:1` 12 široké).
3. **Podpisová mechanika**: jedna z `KIT_MECH` (viz níže) s vlastní barvou a textem, nebo vlastní háček, když je to finále (jako loď v bouři, erupce). Vlastní mechanika = nový záznam do `KIT_MECH` (init/update/gupdate/ground/top/over/glows/snap/apply), ať jde použít znovu.
4. **Vlastní útok každého bosse**: `KIT_OWN[jméno]=(e,dt,c,ph)=>{…}` (vrátí rychlost `[vx,vy]` nebo nic).
5. **Motiv hudby**: 8 osmin ve stupních stupnice (`null` = pauza) pro každou mapu, `songKit` z něj složí celou skladbu.
6. **Texty**: jména, popisy, hlášky, Průvodce (`N` nepřátelé a `B` bossové v `renderGuide`), Novinky, vše přes `_t()` + `lang-en.js`.

## Co dává stavebnice (nepsat znovu)
- **Mapa**: `style:'kit'`, `kit:{ground,path,accent,tile,wall,zone,layout,R,paths,pathW,plaza,camp,props,bits,mech}`.
  `layout`: `paths` (cesty od středu), `plaza` (dlážděný čtverec ±R), `arena` (kruhová aréna R, hodí se na finále), `open`.
  `props`: `{k:'klíč'|['a','b'], n, tall, r (rozestup), sh (stín), at:'any'|'ring'|'edge'|'zone'|'path', ring, sq, light:{r,col,a,dy}, lightEvery}`. `camp`: 4 rekvizity kolem startu.
  `zone`: šumová oblast (`pal`, `thr`, `cells`) – voda, bažina, láva, krystaly… zpomaluje jen s mechanikou `slow`.
- **Mechaniky `KIT_MECH`** (`kit.mech:[{id,...}]`, víc najednou jde):
  - `slow` `{slow:.65, eslow:.75}` – zóna zpomaluje (ne letce, bossy a nepřátele se `zone:1`).
  - `strike` `{every:3 (takty), bossEvery, from:40 (s), warn:1, r:30, n:1, dmg:14, pct:.12, edmg:60, col, leave:'magma'|'puddle', slow, tip, src}` – kruh pod hrdinou, za takt bouchne.
  - `push` `{period:40, dur:9, force:24, from:30, col, tip}` – nárazy větru jedním směrem.
  - `pull` `{dx, dy, r:240, core:40, force:22, dmg:4, col}` – vír/černá díra, střed zraňuje.
  Tma = `dark` na mapě + světla z rekvizit (`light`).
- **Boss**: `pat:'kit'`, `...kitBoss(ci,mi,fin)` (HP a poškození podle kapitoly), `kit:{move:'chase'|'keep'|'dash', keep:[far,near], dash:3.4, moves:[…], onDash:[…], ph2:{at:.5, txt, fast:.6, add:[…], mf:'hook'}, own:'jméno'}`.
  Tah `{on:'beat'|'bar', every, at, do, …}`: `ring {n,spd,mul}`, `fan {n,spread,spd}`, `aimed {n,spd}` (proud na hrdinu), `summon {e,n}`, `puddle {k,r,life}`, `strike {n,r}` (kruhy z nebe; mapa potřebuje mechaniku `strike` nebo `MF.kit`).
- **Nepřátelé**: `...kitFoe(ci,'swarm'|'grunt'|'charger'|'fast'|'tank'|'ranged')` + existující chování `beh` (`chase`, `charger`, `wave`, `ghost`, `ranged`, `ranged3`, `digger`, `jelly`, `gull`, `yeti`…), `fly:1`, `touch:'slow'|'poison'`, `die:'puddle'|'snow'`.
- **Čísla**: mapa bez řádku v `MAP_TIER` dostane schodiště `kitTier(id)` samo. Hodnoty uprav jen podle bota nebo telemetrie.
- **Hudba**: `SONGS[mapa]=songKit({bpm, root, scale:'minor'|'harm'|'dorian'|'hijaz', style, motif:[8], boss?:[8], prog?, keys?})`. Nový styl nástrojů = záznam do `STYLES` (drums/bass/pad/arp/lead).

## Kontrolní seznam (všechna místa, kterých se kapitola dotkne)
1. `MAPS` – 5 map (`name`, `desc` s `<b>`, `dur`, `size`, `seed`, `style:'kit'`, `kit`, `grade`, `gradeA`, `dark`, `amb`, `ambient`, `c1`, `boss`, `spawns`, `elites`, `events`, finále `finale:1`).
2. `CHAPTERS` – `{id:'cN', name, mat:'shard', col, maps}`; `ROMAN_CH` má dost čísel; `SOON_CH` pokud čeká hrdina.
3. `ENEMY_DEFS` (+ `BEH`, pokud nové chování) a `BOSS_DEFS`; `BOSS_INTRO` hláška každého bosse.
4. `SONGS` pro každou mapu.
5. `SETS` (ch, fin, col, name, slots, pieces, b2, b4n, b4, u páté kapitoly six/b6n/b6) + bonusy v `heroBonus` (`sc.<set>`) + schopnost 4 (a 6) v `fireAll` přes `st.lg` + `ITEM_ART` obrázky.
6. Legendárka finále: `LEGS` (s `fin:1`) + `FIN_LEG[finále]` + účinek.
7. Hledaný: `WANTED` + `WANT_OF` (mapování kapitola → hledaný).
8. Věž kapitoly (doporučeno 1–2): `TOWERS` + `TW_UNL`.
9. Hrdina kapitoly (pokud je): viz skill `novy-hrdina`; `need:'první mapa'` místo `soon`.
10. Mistrovství za finále: `ACH` (`v:()=>save.cleared.<finále>?1:0`).
11. Průvodce: `N` (nepřátelé) a `B` (bossové) v `renderGuide`.
12. `lang-en.js` pro všechny nové texty (`node tests/tools/i18n.js static`).
13. Pohlednice: `node tests/tools/thumbgen5.js mapa,mapa,…` (soubory do `thumbs/`).
14. Bot: pokud má mapa mechaniku, kterou se musí bot naučit (vyhýbání), doplň `tests/tools/bot.js`.
15. `NEWS` + `GAME_VER`, `KAMPAN.md` (tabulka map a mechanik), `CLAUDE.md` (stav, předávka).

## Ověření (vždy)
- `node tests/tools/chapcheck.js cN` – vypíše chyby a udělá přehled `cN_check.png` (pohlednice, nepřátelé, bossové, set). Musí skončit „Vše v pořádku“.
- `node tests/tools/bossintroall.js <prefix>` – intro všech bossů (dlouhá jména se vejdou).
- `node tests/tools/c5shots.js <prefix> mapa,…` nebo `kitdemo.js` jako vzor pro snímky map ve hře.
- **Hráči-boti s povahami** (`tests/tools/hraci.js`, 08z) – hlavní test obtížnosti:
  - `node hraci.js kapitola:cN 3` – všech 5 map, 7 povah (Nováček, Opatrný, Agresor, Sběratel, Stavitel, Fúzní lovec, Expert), účet při vstupu i po grindu.
  - Čekáme **zeď**: střední povahy při vstupu na první mapě ~10–60 %, na finále ~0–45 %; po grindu Nočních můr o 10+ bodů víc. Nováček může prohrávat, Expert má vyhrávat aspoň občas.
  - Hlídej řádek **PODEZŘELE SNADNÁ STRATEGIE** (jedna povaha o 40+ bodů nad průměrem = mechanika jde obejít, např. kitování) a **CO ZABÍJÍ** (umírá se na novou mechaniku, nebo na nudné běžné nepřátele?).
  - Účet nové kapitoly: přidej řádek do `UCTY` v `hraci.js` (vstup do kapitoly N+1 = o ~5 úrovní hrdiny, ~3 Vylepšení a 1 úroveň výbavy víc, set předchozí kapitoly). Mechaniky ze stavebnice (`kst`, `kp`) boti znají sami; vlastní nebezpečí finále doplň do `decide()` (vyhýbání) nebo jako cíl (bezpečná místa).
  - Starý `bot.js` je jeden „průměrný“ hráč se zastaralými účty, nepoužívat pro nové kapitoly.
- Smoke `shot.js`, `heavy.js` (výkon), `newsshot.js` (Novinky s ikonami), `i18n.js static`.
