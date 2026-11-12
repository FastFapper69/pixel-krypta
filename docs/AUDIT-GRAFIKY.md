# Audit grafiky (12. 11. 2026, verze 12t)

Zadání uživatele: projet všechny grafické věci a aspekty hry, jestli jsou dobré a nemohly by být lepší (bič je obyčejný a nudný, postavičky a věže).
Postup: všech 38 zbraní (19 základních + 19 fúzí) na max. úrovni s kruhem nepřátel, snímek ve chvíli největšího efektu; archy spritů hrdinů, věží, nepřátel, bossů a mazlíčků (6× zvětšené); bot nováček přes první 2 běhy; `grafcheck.js` (CZ, iPhone SE) = **0 nálezů**.
Obrázky: `docs/audit-grafiky/` (`zbrane_zakladni.png`, `zbrane_fuze.png`, `zbrane_skutecna_velikost.png`, `hrdinove.png`, `veze.png`, `nepratele.png`, `bossove.png`, `mazlicci.png`).

Stav: ⬜ návrh · ✅ hotovo. Pracnost: S = do hodiny, M = pár hodin, L = den a víc.

## Shrnutí
UI obrazovky jsou technicky čisté a konzistentní (kámen, dřevo, pergamen). **Slabá místa jsou ve hře samotné:** tenké zbraně na telefonu nejsou vidět, hrdinové jsou jedna šablona v různých barvách a u silných fúzí přehluší dění čísla poškození. Věže a nepřátelé jsou nejlepší část grafiky.

## 1. Zbraně
| # | Nález | Návrh | Priorita | Pracnost | Stav |
|---|---|---|---|---|---|
| Z1 | **Bič a Řetězový bič jsou na telefonu neviditelné.** Bič = 19 teček po 1 px na vlnovce, žije 0,28 s, na konci jen slabý kroužek. Žádný nápřah, prásknutí ani zásah. | Švih ve 2 fázích (krátký nápřah za hrdinu → prásknutí obloukem), provaz 2 px s tmavým obrysem, na konci bílá jiskra/hvězdička „crack“, záblesk a odhoz zasaženého, vlastní zvuk prásknutí do rytmu. Označení nepřátelé (bonus mazlíčků) s viditelnou značkou drápů nad hlavou. | vysoká | M | ✅ 12u (nápřah, švih, 2px provaz s obrysem, jiskra, `crack`, značka drápů) |
| Z2 | **Halapartna a Světelné kopí** jsou ve špičce skoro neviditelné, **Šípy** a **Blesk** slabé (1–2px čáry, nízký kontrast na tmavé zemi). | Pravidlo čitelnosti pro všechny zbraně: stopa aspoň 2 px, světlé jádro + tmavý nebo barevný obrys, záblesk v místě zásahu, krátký dosvit. Halapartna = široký půlměsíc sečení, Kopí = paprsek s rozšířeným hrotem a otřesem, Šípy = delší stopy, Blesk = silnější zubatá čára s rozvětvením. | vysoká | M | ✅ 12u (Kopí dřív nekreslilo nic → paprsek `sspear`; Halapartna širší hrana; Šípy silnější. Halapartna byla vidět, jen mimo výřez auditu. Blesk beze změny) |
| Z3 | **Černá díra a Horizont událostí** kreslí velké oranžové výbuchy. Barvou nesedí k černé díře a zakrývají nepřátele. | Černý střed, fialový/bílý prstenec světla, částice vtahované dovnitř, výbuch jen krátký a tmavě fialový. | střední | S–M | ✅ 12u (`explode(...,1)` → `BOOM_VOID`) |
| Z4 | **Čísla poškození a obláčky smrti** u silných fúzí (Parní exploze, Plamenný prstenec, Trnová koruna) zakryjí půlku obrazovky. Kritická čísla jsou větší než nepřátelé. | Sloučit čísla na jednom nepříteli (součet místo deseti čísel), menší kritická, obláčky smrti menší a kratší. Volitelně v Nastavení: čísla vše / jen kritická / vypnout. | střední | M | ✅ 12u (součet do jednoho čísla za 0,25 s, kritická menší, velká až od 200) |
| Z5 | Plošné ohnivé fúze (Sopečné kladivo, max Ohnivá koule) zalijí výřez oranžovou, nepřátelé pod tím mizí. | Průhlednější výplň, výraznější okraj a pulz do rytmu místo plné plochy. | nízká | S | ✅ 12u (velké výbuchy ×0,6, ohnivé plochy průhlednější s okrajem v rytmu) |
| Z6 | Dobře fungují: Ohnivá koule, Bumerang, Kladivo, Krápníky, Kotva, Šlahouny, Aura; z fúzí Řetězová bouře, Meteorit, Ozvěna, Svatozář, Ledovcová lavina. | Nechat, jen sjednotit podle Z2. | – | – | – |

## 2. Hrdinové (`hrdinove.png`)
| # | Nález | Návrh | Priorita | Pracnost | Stav |
|---|---|---|---|---|---|
| H1 | **Všech 14 hrdinů má stejné tělo** (fazole s čepicí a sukní). Liší se barvou a pokrývkou hlavy, nikdo nic nedrží, siluety jsou stejné. V Přípravě i na mapě splývají (Rytíř/Námořník, Mág/Astra/Nyx). | Každý hrdina dostane 1–2 prvky siluety, které ho prozradí i ve stínu: zbraň nebo nástroj v ruce (meč a štít, hůl, luk, loutna, kladivo, kotva, kosa…), plášť, vousy, rohy. Velikost spritu zůstane, mění se obrys. | vysoká | L (14 spritů) | ✅ 12x (nástroj v ruce `HERO_PROP`, složený do všech snímků `heroPropsApply`) |
| H2 | Hrdina nemá chůzi ani nečinnost (stojí jako obrázek). | 2snímková chůze (kroky nohou) + dýchání při stání; směr pohledu podle pohybu. Hodně přidá živosti při malé práci. | vysoká | M | – už bylo (kroky na osminy a dýchání na dobu, `c2`; audit hodnotil statický arch) |
| H3 | Paladin (odměna za konec aktu I) vypadá jako ostatní. | Výraznější: zlatá aura, plášť, kopí. | střední | S | ✅ 12x (Paladin drží kopí se sluncem) |

## 3. Věže (`veze.png`)
Nejsilnější sada: 25 věží, každá jiný tvar a materiál, společný sokl drží jednotný styl.
| # | Nález | Návrh | Priorita | Pracnost | Stav |
|---|---|---|---|---|---|
| V1 | **Šípová věž a Dělo** jsou si podobné hranaté bloky; **Krb** (hearth) je šedý kvádr bez čitelného znaku; **Pískoviště** je ploché. | Dokreslit: Šípová = štíhlá věž s lukem nebo střílnou a praporkem, Dělo = hlaveň vepředu, Krb = komín s ohněm, Pískoviště = vír písku nahoře. | střední | M | ✅ 12v (Střelecká věž se špičatou střechou, střílnou a praporkem; Dělo s hlavní a koly; Ohniště = mísa s plameny; Písečný vír s vírem) |
| V2 | Věže stojí bez pohybu. | Nečinnost: praporek, dým, záře krystalu, kmitání plamene (2–3 snímky). | střední | M | – už bylo (oheň, praporky a pohyb věží se kreslí v `drawTower`; audit hodnotil jen statické sprity) |
| V3 | Úroveň věže (1–3, rarita karty) není na spritu vidět. | Malé odznaky na soklu (proužky / drahokam podle rarity). | střední | S | – už bylo (zlatý pás od úrovně 2, praporky na 2. a 3. úrovni) |

## 4. Nepřátelé, bossové, mazlíčci (`nepratele.png`, `bossove.png`, `mazlicci.png`)
| # | Nález | Návrh | Priorita | Pracnost | Stav |
|---|---|---|---|---|---|
| N1 | Nepřátelé jsou pestří a čitelní. Šablonu „panák s rukama“ sdílí Zombie, Utopenec, Horník, Pirát, Prázdný a Alchymista. | Při nové kapitole dávat jiné siluety (zvíře, létající, plazivé). Stávající nechat. | nízká | – | ⬜ |
| B1 | **Červ, Jeskynní úhoř a Stín pod ledem** jsou stejný sprite (`pat:'worm'`, `rows:[]`). Úhoř a Stín mají skoro stejnou paletu. | Úhoř: ploutve a světélkující skvrny; Stín pod ledem: ledové krystaly na hřbetě, bledé oči. | střední | M | ✅ 12v (úhoř: ploutve, světélkující skvrny; Stín: ledové krystaly, bledé oči) |
| B2 | **Aurel, finální boss aktu I**, vypadá jako Herold a není nejokázalejší. | Největší sprite ve hře, koruna se střepem, zlatý plášť, svatozář, 2 snímky pohybu. | vysoká | M | ✅ 12v (24×21, paprsky, koruna se střepem, plášť, slunce na hrudi; úvodní karta bosse drží vysoké bosse v obraze) |
| B3 | Bossové mají jiné stínování (šum/dither) než ostatní sprity, několik jich je ze šablony „kvádr s rukama“ (Mincmistr, Zlatý rytíř, Kurátor, Slunečný kovář). | Nechat jako odlišení bossů, ale u šablonových dodat znak (nástroj, zbraň, tvar hlavy). | nízká | M | ⬜ |
| P1 | Mazlíčci jsou v pořádku, čitelní a s charakterem. | – | – | – | – |

## 5. Obrazovky a UI
| # | Nález | Návrh | Priorita | Pracnost | Stav |
|---|---|---|---|---|---|
| U1 | `grafcheck.js` 0 nálezů; menu, Obchod, Nástěnka, Příprava, konec běhu, Novinky drží styl. | – | – | – | ✅ |
| U2 | Na nabídce nové úrovně má **každá** karta pečeť „Nový bonus“, takže pečeť nic neodlišuje. | Pečeť jen u úplně nové zbraně / fúze. | nízká | S | ✅ 12u |
| U3 | Konec 1. běhu ukáže „Rytmus v krvi – Mistrovství!“, ale rytmus nikdo nováčkovi nevysvětlil. | Krok v tutoriálu nebo vysvětlivka (?) u mistrovství. | střední | S | – není potřeba („Rytmus v krvi“ je mistrovství za kombo 300, kombo tutoriál vysvětluje) |

## 6. Zvuk interaktivních věcí v mapách (přání uživatele 12. 11.)
Zvon a všechny interaktivní věci v mapách mají mít zvuk a jít do rytmu (např. prskání lávy na takt).
| # | Nález | Návrh | Stav |
|---|---|---|---|
| S1 | Zvon (Zvonice, věž Zvon, boss Zvoník) má `sfx('bell')` na takt, měřeno +7 dB nad hudbou, ale jen sinusovky s hlubokým základním tónem → **telefonní reproduktor ho skoro nezahraje**. | Zvon s kovovými harmonickými nad 400 Hz, úder (noise) a dozvuk. | ✅ 12u (alikvoty nad 520 Hz + úder, na Zvonici +8–10 dB nad hudbou) |
| S2 | Erupce v jádru (finále lávové kapitoly) bez zvuku, lávové louže bez zvuku. | Varování na takt + výbuch na první dobu, louže občas „prsknou“ do rytmu. | ✅ 12u (láva prskne na každou druhou dobu `lavaSpit` + `lava`; erupce, laviny a chapadla `warn` na takt; `boom` se středním pásmem) |
| S3 | Další mechaniky map bez vlastního zvuku: soupis a doplnění podle skillu `zvuk-a-hudba`. | | ✅ 12u (Hvězdné mosty `bridge`; ostatní mechaniky map zvuk mají) |

## Doporučené pořadí
1. Z1 bič + Z2 čitelnost zbraní (uživatel to vidí v každém běhu).
2. S1–S3 zvuky map do rytmu.
3. H2 chůze hrdinů, B2 Aurel.
4. H1 siluety hrdinů (největší práce, největší rozdíl v Přípravě).
5. Z3, Z4, V1–V3, B1, U2–U3.
