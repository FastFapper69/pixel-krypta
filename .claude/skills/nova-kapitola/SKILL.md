---
name: "nova-kapitola"
description: "Postup a kontrolní seznam pro novou kapitolu Pixel Krypty (5 map, nepřátelé, bossové, set, legendárka, hudba, intro, Průvodce, Novinky). Použij vždy, když se dělá nová kapitola nebo nová mapa."
---

# Nová kapitola Pixel Krypty

Komunikuj česky. Nejdřív `git fetch` + `git pull --rebase` a přečti `KAMPAN.md` (rámec map, schodiště obtížnosti, co mají předchozí kapitoly). Stavebnice je v `game.js` v oddílu **chapter kit (08y)**, zkouška stavebnice `tests/tools/kitdemo.js`.

## Pravidla uživatele (neporušovat)
- **Žádné nové materiály** (jen Úlomky a Esence). Kapitola = 5 map, pátá je finále se speciálním bossem.
- **Každá kapitola je schod, některé zeď** (10j): se stejným účtem (`UCET=n node hraci.js mapa:X:vstup 6 agresor,sberatel,stavitel,fuzak`) musí být první mapa nové kapitoly těžší než poslední běžná mapa předchozí. Hráč se má vracet grindit Noční můry. Bossové jsou výzva. Ladí se hlavně **HP** (`hpm`, zvedá i nástrahy přes `hazDm`); `dmm` a `spx` jen dolaďují (viz KAMPAN.md 10j). Mechaniky s nástrahami (paprsky, střepy) s vyšším `hpm` rychle bolí víc – ověř i účet po grindu.
- **Loot roste sám** (10j): zlato, Úlomky i Esence finále mají násobek kapitoly, cena hrdiny kapitoly se dopočítá (`HERO_PRICE`). Po přidání kapitoly pusť `node tests/tools/lootcurve.js`.
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
5. **Hudba**: kapitola má **vlastní styl nástrojů** (`STYLES`, mix změřený `rolecal.js`) a každá mapa `songKit({…, motif, answer, boss})` – motiv, vlastní odpověď a vlastní boss téma (8 osmin ve stupních, `null` = pauza). Postup a cíle ve skillu `zvuk-a-hudba` („Hudba nové kapitoly“).
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
    `ph2:1` = zapne se až 2. fází bosse (boss `ph2:{mf:'ph2'}` → `MF.kit.ph2` → `KIT_MECH.x.ph2(o)`); `dy:0` je falsy a spadne na −220, střed mapy = `dy:1`.
  - `rifts` `{every:4, from:20, n:4, pool:['shade'], col, tip}` (11g) – u každého hrdiny se otevře trhlina, za takt bouchne a pustí nepřátele. Proti stylu „drž odstup“. Boss ji otevře `KIT_MECH.rifts.open(x,y,bar)`.
  - `echo` `{delay:2, from:25, r:24, dmg, pct, edmg}` (11g) – stín hrdiny jde jeho cestou o `delay` taktů později a na 1. dobu bouchne. Trestá běhání v kruhu.
  - `lantern` `{r:120, spd:15, from:6, dmg, pct}` (11g) – pro tmavou mapu (`dark` .9): bezpečí jen ve světle plující lucerny (nebo věže Lucerna), mimo tik poškození; `run.kn.dim` ji ztlumí.
  - Háčky `KIT_MECH`: `init, update, gupdate, psp, espd, ground, top, over, glows, lights` (světlo do tmy, 11g), `ph2`, `snap/apply`.
  Tma = `dark` na mapě + světla z rekvizit (`light`).
- **Boss**: `pat:'kit'`, `...kitBoss(ci,mi,fin)` (HP a poškození podle kapitoly), `kit:{move:'chase'|'keep'|'dash', keep:[far,near], dash:3.4, moves:[…], onDash:[…], ph2:{at:.5, txt, fast:.6, add:[…], mf:'hook'}, own:'jméno'}`.
  Tah `{on:'beat'|'bar', every, at, do, …}`: `ring {n,spd,mul}`, `fan {n,spread,spd}`, `aimed {n,spd}` (proud na hrdinu), `summon {e,n}`, `puddle {k,r,life}`, `strike {n,r}` (kruhy z nebe; mapa potřebuje mechaniku `strike` nebo `MF.kit`).
- **Nepřátelé**: `...kitFoe(ci,'swarm'|'grunt'|'charger'|'fast'|'tank'|'ranged')` + existující chování `beh` (`chase`, `charger`, `wave`, `ghost`, `ranged`, `ranged3`, `digger`, `jelly`, `gull`, `yeti`…), `fly:1`, `touch:'slow'|'poison'`, `die:'puddle'|'snow'|'magma'|'split'` (split = rozpadne se na 2 stíny, 11g).
- **Čísla**: mapa bez řádku v `MAP_TIER` dostane schodiště `kitTier(id)` samo. Hodnoty uprav jen podle bota nebo telemetrie.
- **Hudba**: `SONGS[mapa]=songKit({bpm, root, scale:'minor'|'harm'|'dorian'|'hijaz', style, motif:[8], answer:[8], boss:[8], bossAnswer?:[8], prog?, keys?})` (v2 od 10f: smyčka A B R C D B A, boss X Y X Z, melodie v každém taktu vynucená). Nový styl nástrojů = záznam do `STYLES` (drums/bass/pad/arp/lead) + `STYLE_ROLE`/`STYLE_TRIM`/`STYLE_REV`.

## Kontrolní seznam (všechna místa, kterých se kapitola dotkne)
1. `MAPS` – 5 map (`name`, `desc` s `<b>`, `dur`, `size`, `seed`, `style:'kit'`, `kit`, `grade`, `gradeA`, `dark`, `amb`, `ambient`, `c1`, `boss`, `spawns`, `elites`, `events`, finále `finale:1`).
2. `CHAPTERS` – `{id:'cN', name, mat:'shard', col, maps}`; `ROMAN_CH` má dost čísel; `SOON_CH` pokud čeká hrdina.
3. `ENEMY_DEFS` (+ `BEH`, pokud nové chování) a `BOSS_DEFS`; `BOSS_INTRO` hláška každého bosse.
4. `SONGS` pro každou mapu + vlastní styl kapitoly **včetně banger kitu** (`STYLES.x.bang=bangKit({kick,snare,hat,bass,voice,extra})` + `BANG_TRIM.x` podle `zvuk.js`, viz skill `zvuk-a-hudba` „Banger“); projít `hudbacheck.js cN` a `skladby.js cN` (VERDIKT: vše v cíli).
5. `SETS` (ch, fin, col, name, slots, pieces, b2, b4n, b4, u páté kapitoly six/b6n/b6) + bonusy v `heroBonus` (`sc.<set>`) + schopnost 4 (a 6) v `fireAll` přes `st.lg` + `ITEM_ART` obrázky.
6. Legendárka finále: `LEGS` (s `fin:1`) + `FIN_LEG[finále]` + účinek.
7. Hledaný: `WANTED` + `WANT_OF` (mapování kapitola → hledaný).
8. Věž kapitoly (doporučeno 1–2): `TOWERS` + `TW_UNL` + `TW_INFO` + `TW_FLAG` + chování v `towerFire` a vrchol v `drawTower`. Výhra na mapě věž jen odemkne, **kartu dává jen Stavitelova bedna** (pravidlo uživatele 09c, nic dalšího se nastavovat nemusí). Kontrola `tests/tools/tw5.js` (upravit mapy a věže) a `twgallery.js`.
9. Hrdina kapitoly (pokud je): viz skill `novy-hrdina`; `need:'první mapa'` místo `soon`.
10. Mistrovství za finále: `ACH` (`v:()=>save.cleared.<finále>?1:0`).
11. Průvodce: `N` (nepřátelé) a `B` (bossové) v `renderGuide`.
12. `lang-en.js` pro všechny nové texty (`node tests/tools/i18n.js static`).
13. Pohlednice: `node tests/tools/thumbgen5.js mapa,mapa,…` (soubory do `thumbs/`).
14. Bot: pokud má mapa mechaniku, kterou se musí bot naučit (vyhýbání), doplň `tests/tools/bot.js`.
15. `NEWS` + `GAME_VER`, `KAMPAN.md` (tabulka map a mechanik), `CLAUDE.md` (stav, předávka).

## Poučení z kapitoly VII (11g)
- **Testy běží nad kopií**: `lib.prep()` kopíruje `game.js` a `lang-en.js` do `tests/tools/`. Po každé úpravě kódu znovu `node -e "require('./lib').prep()"`, jinak test hlásí staré chyby (chapcheck „chybí hláška“, i když v kódu je).
- Pořadí, které fungovalo: data (palety, nepřátelé, bossové, hrdina, mapy, kapitola) → stavebnice (rekvizity, mechaniky, útoky bossů, hudba) → zbraň, efekty a věže → set, legendárka, hledaný, mistrovství, Průvodce, příběh → `chapcheck.js cN` → angličtina (skript níž) → `thumbgen5.js` → `rolecal.js` → `zvuk.js` → `skladby.js cN` (běží ~20 min, pusť na pozadí) → `cNshots.js` → boti.
- Chybějící překlady všech `_t()` najednou: projdi `game.js` regexem `_t\('…'\)` proti `window.KRYPTA_EN` (i18n.js static vypíše jen prvních 30).
- Sprity bossů jsou zrcadlené: oko/ústa ve středu (`kkkwwww`) vyjdou jako vodorovná kapsle a vypadá to jako brýle VR. Oko kresli svisle (zornice ve dvou sloupcích uprostřed), ústa se zuby `tmtmtm`.
- `ITEM_ART`: klíč `e` v paletě předmětu vyjde barvou rarity – na barvu oka použij jiné písmeno (`y`).
- Fialová je zakázaná jen v UI, ve světě hry (mapy, efekty, bossové) je v pořádku (uživatel 11. 11.).
- Nová mechanika = nový záznam v `hraci.js` (`decide`): vyhnout se varování, nebo cíl (lucerna `goal=R.kn`), jinak boti umírají na něco, čemu se hráč vyhne.

## Ověření (vždy)
- `node tests/tools/chapcheck.js cN` – vypíše chyby (včetně hudebních pravidel) a udělá přehled `cN_check.png` (pohlednice, nepřátelé, bossové, set). Musí skončit „Vše v pořádku“.
- `node tests/tools/skladby.js cN` – hlasitost skladeb po taktech, musí skončit „VERDIKT: vše v cíli“.
- `node tests/tools/bossintroall.js <prefix>` – intro všech bossů (dlouhá jména se vejdou).
- `node tests/tools/c7shots.js <prefix> [mapy] [s] [hrdina]` – odehraje mapy s hrdinou, věžemi kapitoly, setem a legendárkou, vyfotí běh a bosse ve 2. fázi, vypíše stav mechanik (vzor pro novou kapitolu; starší `c5shots.js`, `c6shots.js`).
- **Hráči-boti s povahami** (`tests/tools/hraci.js`, 08z) – hlavní test obtížnosti:
  - `node hraci.js kapitola:cN 3` – všech 5 map, 7 povah (Nováček, Opatrný, Agresor, Sběratel, Stavitel, Fúzní lovec, Expert), účet při vstupu i po grindu.
  - Čekáme **zeď**: střední povahy při vstupu na první mapě ~10–60 %, na finále ~0–45 %; po grindu Nočních můr o 10+ bodů víc. Nováček může prohrávat, Expert má vyhrávat aspoň občas.
  - Hlídej řádek **PODEZŘELE SNADNÁ STRATEGIE** (jedna povaha o 40+ bodů nad průměrem = mechanika jde obejít, např. kitování) a **CO ZABÍJÍ** (umírá se na novou mechaniku, nebo na nudné běžné nepřátele?).
  - Účet nové kapitoly: přidej řádek do `UCTY` v `hraci.js` (vstup do kapitoly N+1 = o ~5 úrovní hrdiny, ~3 Vylepšení a 1 úroveň výbavy víc, set předchozí kapitoly). Mechaniky ze stavebnice (`kst`, `kp`) boti znají sami; vlastní nebezpečí finále doplň do `decide()` (vyhýbání) nebo jako cíl (bezpečná místa).
  - Starý `bot.js` je jeden „průměrný“ hráč se zastaralými účty, nepoužívat pro nové kapitoly.
- Smoke `shot.js`, `heavy.js` (výkon), `newsshot.js` (Novinky s ikonami), `i18n.js static`.

- Nástěnka (09e): každý nový nepřítel potřebuje množný tvar v `Q_PL` (jinak úkol píše „Zabij 40× Jméno“), kapitola hledaného v `WANTED` + `WANT_OF`; kontrakty a týdenní výzva si novou kapitolu/mapy vezmou samy.
- Příběh (09h): finální boss kapitoly má v poslední fázi **náznak další kapitoly** a po první výhře kartu „Cesta dál“ (most). Od kapitoly IV přidává každá kapitola i jednu novou mechaniku do `FEATS` (odemkne ji finále), s kartou NOVÁ MECHANIKA.
