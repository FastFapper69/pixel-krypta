# Výbava: kampaň vs. truhly (08e, 8. 11. 2026)
Problém: každá výhra na Noční můře dávala předmět (NM III Epický + 25 % legendárka), takže hráč měl časem tolik dobré výbavy, že truhly ztratily smysl.
Pravidlo od 08e:
- **Kampaň** dá předmět jen za **první výhru mapy na každé NM** (NM I Neobvyklý, II Vzácný, III Epický, `ECON.nmItem`), za první výhru finále na Normální (Zlatá truhla) a kusy **setů z finále** (25 % + pojistka). Opakované výhry dávají Úlomky. Celkem je to omezené číslo (20 map × 3 NM).
- **Truhly** jsou jediný stálý zdroj výbavy a jediný zdroj běžných legendárek (Zlatá truhla 5 %, pojistka 30). Legendárky kapitol (`LEGS[..].fin`) dál padají jen z finále na NM III.
- Denní výzva a Hledaný dávají předmět jako dřív (omezené denně).
- Dvě cesty k vrcholu: **sety** (farmit finále) vs. **legendárky z truhel** (zlato). Sloučení 3→1 dělá z běžných kusů z truhel materiál na vyšší raritu.
Test `tests/tools/drop8e.js`.

# Pixel Krypta – ekonomika

## Ekonomika 2.0 (návrh 8. 11. 2026, nasazení ve verzi 08b) – PLATÍ
Nahrazuje materiály kapitol. Starší text níže je historie.

### Proč
Skutečná data dvou hráčů (Supabase `profiles`, 8. 11.): za běh ~500–900 zlata a ~110 materiálu. Fappoleon (24 běhů) měl 560 zlata, ale 543 Kostního prachu a 518 Jantaru. Simulace starého systému (`tests/tools/econsim.py` má i starou logiku v historii) ukázala dvě chyby:
1. **Materiál nemá výdaj bez velkého zlata.** Skoro všechno chce hodně zlata (Vylepšení rostou ×1,13 za úroveň, předměty 7,5 zlata na 1 materiál), materiál jde bez zlata jen do úrovní hrdinů. Když je hrdina vylepšený, materiál leží.
2. **Materiály kapitol se navzájem blokují.** Kostní prach je potřeba na úrovně hrdinů i na první 4 stupně všech předmětů, Jantar jen na prsteny a Magmatit na amulety. V simulaci se progrese po 10 h zasekne na Kostním prachu, zatímco Jantar a Magmatit rostou donekonečna. Každá další kapitola by přidala další materiál a problém zhoršila.

### Měny
| Měna | Odkud | Na co |
|---|---|---|
| **Zlato** | každý běh (beze změny), úkoly, mistrovství | všechno, truhly jen za zlato |
| **Úlomky** (běžný materiál) | běžné mapy všech kapitol: dosavadní vzorec materiálu ×1,1 (`SH_K`), pozdější kapitoly +15 % za kapitolu; úkoly, poklad kapitoly, denní výzva | Vylepšení od úrovně 10, úrovně hrdinů, vylepšování předmětů, věží a mazlíčků, Věžová a Mazlíčkova truhla |
| **Esence** (vzácná) | jen finální bossové kapitol a Nekonečná krypta | Vylepšení 20+, úrovně hrdinů 10+, vylepšení +6 až +10 |

Žádná kapitola už nepřidá nový materiál. Pozdější kapitoly dávají víc Úlomků a Esence (silnější bossové).

### Příjem
- **10j – odměna roste s kapitolou:** zlato za běh ×(1 + 0,15 × index kapitoly) (`chGoldMul`, mimo Nekonečnou kryptu), stejně jako Úlomky; boti ukázali, že výhra v II dala jen o 6 % víc zlata než v I. Esence z finále (první i opakovaná) ×(1 + 0,15 × index kapitoly), Zatmění NM III poprvé 123. Kontrola `node tests/tools/lootcurve.js [hraci-results.json]` (pevná část odměn po mapách, kapitolách a NM, Esence finále, ceny hrdinů).
- **10j – ceny hrdinů kapitol** se počítají samy z kapitoly, ve které jdou koupit (`HERO_PRICE(heroCh(h))`): II 1 000, III 1 500, IV 2 000, V 3 000, VI 4 000, VII 5 500, dál ×1,4. Výjimka jen s `costFix:1`. Kdo hrdinu už má, nic neplatí.
- **Úlomky:** výhra na běžné mapě v kapitole I ≈ 65–70, v kapitole II ≈ 100 (bot 8. 11.: hřbitov 510 zlata / 52 materiálu při násobku 0,85 → 1,1 dá ~67; poušť 768 / 80 → ~103). Prohra zhruba polovina (podle přežitých minut jako dřív).
- **Esence z finále:** první výhra na každé obtížnosti (normál, NM I, II, III) **25 / 35 / 50 / 70**, opakovaná výhra **4 / 6 / 8 / 10**, ale jen **3 výhry finále denně** dávají Esenci.
- **Nekonečná krypta:** 0,4 Esence za minutu od 5. minuty. Denně plně **20 Esence**, nad strop jen čtvrtina.
- **Poklad kapitoly:** 50 Úlomků + 10 Esence (dřív 50 materiálu).

### Výdaje (gold / Úlomky / Esence)
- **Vylepšení (Kovárna):** zlato `base·1,115^L` (dřív 1,13). Úroveň 10–19 navíc Úlomky `(3+(L−10))·2·base/35`, úroveň 20–29 navíc Esence `2+(L−20)`. Druhá šance 400 / 1500 + 40 Úl. / 4000 + 40 Úl. + 10 Es.
- **Úroveň hrdiny L→L+1:** zlato `45·L` (+`90·(L−9)` od 10), Úlomky `10·L`, Esence od úrovně 10 `2+(L−10)` a +10 při dosažení 15 a 20. Celkem 1→20: 13 500 zlata, 1 900 Úlomků, 85 Esence.
- **Vylepšení předmětu, karty věže i mazlíčka** (stejný vzorec): zlato `24·(lv+1)·(r+1)`, Úlomky `6·(lv+1)·(r+1)`, od +6 navíc Esence `(lv−4)·(r+1)`.
- **Rozebrání:** základ + 50 % vloženého (i Esence). **Sloučení:** 3 stejné kusy stejné rarity → 1 o raritu vyšší, vrací 50 % vylepšení.
- **Truhly:** výbava jen za zlato (250 / 750 / 2000). Věžová 700 zl + 60 Úl., Mazlíčkova 600 zl + 60 Úl. **Karty věží jen z Věžové (Stavitelovy) bedny** (09c): výhra na mapě věž jen odemkne do bedny, nevlastněné odemčené věže v ní mají váhu 3×. **Denní limity:** Železná 4, Zlatá 2, Věžová 3, Mazlíčkova 3 (Dřevěná bez limitu). Tím nejde nahromaděné zlato utratit za nekonečně beden.
- ~~Přebroušení~~ (zrušeno 08i): přelosuje jeden bonus předmětu, věže nebo mazlíčka. 600 zl + 150 Úl., každé další přebroušení téhož kusu ×1,25 (strop po 12.).
- **Strop skladu Úlomků 6 000.** Co přeteče, se změní na zlato 1 : 3 (horší než běžný poměr příjmu ~6 : 1, takže se nevyplatí farmit).

### Výsledek simulace (`econsim.py`, 5 hrdinů, 2 hlavní, ~1,5 h hraní denně)
| hodin | Vylepšení (průměr) | hlavní hrdina | hlavní výbava | sklad zlato / Úlomky / Esence |
|---|---|---|---|---|
| 3 | 11,7 | 6 | +4,9 | 470 / 2 / 33 |
| 10 | 16,3 | 9 | +6,4 | 70 / 35 / 51 |
| 20 | 21,8 | 10 | +7,4 Vzácná–Epická | 100 / 80 / 1 |
| 40 | 22,3 | 14 | +7,5 | 3 900 / 2 300 / 0 |
| 70 | 24,5 | 14 | +7,8 Epická | 8 500 / 8 / 0 |
| 100 | 28,3 | 18 | +8,4 | 27 000 / 70 / 1 |
| 150 | 30 (max) | 20 | +10 | 60 000 / 110 / 6 |

- Zlato a Úlomky docházejí zhruba stejně rychle, nic se nehromadí do ~40 h. Esence je záměrně úzké hrdlo pro vrchol (úroveň hrdiny 10+, výbava +6+, Vylepšení 20+).
- Hráč, který výbavu nevylepšuje, Úlomky hromadí (strop je zastaví), ale má na co je utratit.
- Po ~100 h roste zlato (truhly mají denní limit). To pohltí kapitoly IV–VI a noví hrdinové; kdyby ne, přidat další výdaj za zlato.

### Převod starých uložených pozic (`econ2Migrate`)
Kostní prach + Jantar + Magmatit → Úlomky 1 : 1. Za už poražená finále hráč dostane Esenci, jako by je vyhrál poprvé (normál 25, NM I 35, NM II 50, NM III 70) a ta se označí v `save.esF`, aby se nevyplatila dvakrát. Příklad: Fappoleon (Trůn a Brána na normál, Trůn na NM I) → 1 088 Úlomků a 85 Esence. Úrovně hrdinů, Vylepšení i předměty zůstávají. `save.econV=2`.

### Nekonečná krypta
Odemkne se po prvním finále (Trůn): v Přípravě záložka ∞ vedle Nočních můr (`sel.endless`, `run.endless`). Hraje se na libovolné dohrané mapě, boss nepřijde, od 5. minuty každou minutu +8 % zdraví a +5 % poškození nepřátel navíc ke stávajícímu růstu. Konec jen smrtí. Odměny: zlato a Úlomky za celý čas (`rewT` bez stropu), Esence podle pravidel výše (`essGain`, `save.endD`). Rekord na mapu v `save.endB`, ukazuje se u map a na konci běhu.

**Od 08m jen jedna na kapitolu** – na jejím finále, odemkne ji první výhra finále. **Od 08l je to boss fight:** běžné vlny slabší (×0,6), boss přijde po 30 s a po každém poražení znovu za 12 s silnější a s novým útokem (evoluce II–VII). Poražení bosse: léčení 25 %, zlato, Esence 1 + 0,5 za každou další evoluci (v rámci denního stropu). Rekord evolucí v `save.endW`.

---

## Výbava 2.0 (08p)
- **Sloty:** přilba, zbroj, amulet, prsten + nové **boty** (`spd`, `mag`, `dodge`) a **rukavice** (`cd`, `crit`, `dmg`). Sety mají dál 4 kusy (`SET_SLOTS`), nové sloty v nich nejsou.
- **Druhy předmětů** `BASES` (pole `it.b`, bez něj původní druh slotu): kápě, čelenka, kabátec, róba, talisman, znak (věže), pečeť, sandály, kovářské rukavice. Každý má vlastní statistiky, 4 jména podle rarity a vlastní obrázek (`ITEM_ART[b]`, `g`/`e` = barva rarity). `makeItem` druh losuje stejně často jako základní.
- **Nové statistiky:** `dodge` Úhyb (strop 30 %, v `hurtPlayer` před brněním, i proti hazardům), `tdmg` Poškození věží (násobí škodu věží).
- **Vlastnosti** `AFX` (pole `it.af`, jen Epická a Legendární, ne sety): `vamp` léčení za zabití, `thorn` trny při zásahu (CD 1,5 s), `rhythm` krit na 1. dobu, `gold` zlato za elitu, `swift` rychlost s kombem 25+, `hunter` poškození bossům a elitám. Hodnoty [Epická, Legendární], stejné se sčítají (`B.af`, `st.af`). Ve výpisu bonusů hrdiny s ★.
- **Legendárky pro nové sloty:** `stride` Sedmimílové boty (krok 44 ve směru pohybu na 1. dobu každého 2. taktu + krátká nezranitelnost), `storm` Hromové pěsti (krit vybuchne kolem cíle, max 2× za s).
- Sloučení (3 stejného slotu a rarity) dá náhodný druh; od Epické náhodnou vlastnost. Test obrazovky: `tests/tools/gearshot.js prefix [cs|en]`.

# Historie: návrh dlouhodobé progrese (materiály kapitol, do verze 08a)

> **Aktualizace 07w (2026-11-07 večer):** čísla níže jsou starší. Platí: po běhu se ze zlata z běhu bere jen část (`keepGold`: 30 % z prvních 2000, 10 % nad), kombo max 40 zlata každých 25, materiál z komba každých 200, za minutu 2, elita 2–3, výhra 10 / finále 25, finále ×1,25; truhly 250/750/2000, Věžová 700. Noční můry od 07x jen I–III (`NM_HP` .75, `NM_DMG` .3). Detaily v `CLAUDE.md` (sekce Menu a ekonomika 07w).

Stav: **fáze 1–5 jsou hotové a nasazené** (listopad 2026). Zbývá: serverový inventář (fáze 6) a monetizace (fáze 7). Zatím jen herní měna pro kamarády a testery.

### Jak je to postavené
- Data a konfigurace: `MAT_OF`, `RAR`, `SLOTS`, `STATS` (rozsahy podle rarity), `LEGS`, `ECON` (truhly, šance, pity, ceny kování/rozebrání/úrovní hrdiny, předmět za NM), `TALENTS`, `DAILY_MODS`.
- Save: `mats`, `hlv`, `inv` (předmět `{u,s,r,lv,st,lg}`), `eq[hrdina][slot]=uid`, `nm[mapa]`, `pity`, `daily`, `codex{f,l}`, `uidc`. Synchronizuje se do cloudu (`SYNC_KEYS`). Inventář max. 200 předmětů.
- Statistiky: `heroBonus(h)` sečte výbavu, úroveň hrdiny a talenty → `run.bonus` → `recalc()`. Bez výbavy na úrovni 1 jsou nuly, takže sólo hraje přesně jako dřív. Talenty zbraní přes `w.xn` a `wP(id,w)`.
- **Pro budoucí server:** losování a změny inventáře jsou jen v `openChest`, `makeItem`, `upgradeItem`, `dismantleItem`, `doMerge`, `heroUp` a `runRewards`. Tyhle funkce se dají nahradit voláním Edge Function, obrazovky se měnit nemusí.
- Odchylky od návrhu: denní výzva nemá pevný seed ani vlastní žebříček (hra používá `Math.random`). Mapa a modifikátor jsou ale pro všechny stejné podle data. Materiál z bosse se připisuje rovnou do odměny (výhra ukončí běh dřív, než by se dal sebrat).
- **Známé riziko:** cloud save pořád vyhrává jako celek podle `updated`, takže při hraní na dvou zařízeních zároveň se může ztratit předmět. Řeší to až fáze 6.

### Kontrola ekonomiky botem (2026-11-07, verze 07m)
Bot (`bot.js` teď zapisuje i `gain` = zlato a `rw` = materiál za běh), 2 hrdinové × 4 běhy na mapu. Medián za běh:
| profil | mapa | výhry | zlato | materiál | zlato/min |
|---|---|---|---|---|---|
| nováček | hřbitov | 6/8 | 474 | 64 | 98 |
| nováček | bažina / trůn | 2/8, 1/8 | 276 / 227 | 27 / 45 | 65–76 |
| nováček | poušť / kaňon | 0/8 | 104 / 72 | 14 / 11 | 34–38 |
| hrdina 10 | poušť / brána / doly | 1/8, 0/8, 0/8 | 124 / 36 / 56 | 16 / 11 / 6 | 17–52 |
| hrdina 20 | hřbitov / poušť / doly | 6/6 všude | 528 / 609 / 1326 | 70 / 82 / 110 | 110 / 119 / 202 |

Ceny: obchod vylepšení celkem 4 900 zl (≈ 10 běhů na hřbitově), hrdina 1→10 = 900 zl + 270 Kostního prachu (≈ 5 běhů), 10→20 = 2 900 zl + 630 / 510 / 300 materiálů, vzácný předmět +10 = 4 950 zl + 540 materiálu slotu, legendární 8 250 zl + 900. Mistrovství dá celkem 7 650 zl.
Závěr: zlato má dost výdajů a začátek je rychlý (dobře). Slabé místo je **prohra = skoro nic** (poušť 14 Jantaru proti 82 při výhře), takže hráč zaseknutý na kapitole II sbírá Jantar na úrovně 10–20 desítky běhů; doly dávají na maximu 2× víc zlata/min než ostatní mapy; Magmatit má jen 1 mapu. Čeká se na skutečná data z `runs` (tabulka založena 2026-11-07).
**Úprava 07p:** materiál za přežitou minutu 4 místo 2 (bot: prohra v poušti ~20 místo 14, výhra ~104). Sety kapitol (kusy na epické úrovni z finále + poklad kapitoly) jsou nový cíl pro opakované hraní finále.

### Revize 11/2026 (smysl materiálů)
- Hrdina 1→20 stojí 900 Kostního prachu, 540 Jantaru, 300 Magmatitu a 3 800 zlata (dřív 1 140 / 540 / 100). Úrovně 15–19 mají pevně 54 Kostního prachu a Magmatit `12·(L−12)`, takže nejtěžší mapa má podíl i na hrdinech.
- Vylepšení předmětu +0→+10: 220 materiálu (běžná) až 1 100 (legendární), 1 650 až 8 250 zlata. Poměr zlato : materiál ≈ 7,5 odpovídá příjmu z běhů, nic se nehromadí.
- `upInvest(it)` = co šlo do vylepšení. Rozebrání vrací základ + 50 % vylepšení (dřív ~3 %). Sloučení vrátí 50 % vylepšení všech tří předmětů a hráč si vybere slot výsledku (`openMerge`, `doMerge(r,q,slot)`).
- Ťuknutí na materiál v liště nebo v ceně ukáže `matInfo(m)` (kde padá, na co je), chybějící materiál má pod cenou nápovědu `missHint`.

## 1. Proč a co je dnes špatně
- Dnes dá běh cca 100–400 zlata. Meta vylepšení stojí dohromady cca 4 900 zlata a hrdinové 700, takže se **všechno dá vykoupit za 20–40 běhů**. Pak hráč nemá důvod se vracet.
- Cíl: hra, která je **opakovatelná a pořád zábavná**. Každý běh má přinést něco, co hráče posune, a každá mapa musí mít vlastní důvod se na ni vracet.

## 2. Měny (záměrně málo)
| Měna | Odkud | Na co |
|---|---|---|
| **Zlato** (už existuje) | každý běh | truhly v obchodě, meta vylepšení, kování výbavy |
| **Kostní prach** | jen Zapomněný hřbitov | úrovně hrdinů, kování přileb a zbrojí (obrana) |
| **Jantar** | jen Prašná poušť | úrovně hrdinů, kování prstenů (rychlost, užitek) |
| **Magmatit** | jen Lávové doly | úrovně hrdinů, kování amuletů (útok) |
| *(později)* **Krystaly** | za skutečné peníze, vzácně ze hry | kosmetika, truhly, viz kap. 9 |

**Proč tři materiály:** každý je potřeba na něco jiného, takže hráč musí střídat mapy. Kdo chce silný amulet, musí do dolů. Na vyšší úrovně hrdiny potřebuje všechny tři.

**Jak padají materiály** (nejsou to předměty na mapě, jen sbíratelný „drop“ jako mince):
- elita 3–5, boss 15, běžný nepřítel vzácně 1 (cca 1 %),
- na konci běhu bonus za přežité minuty (2/min) a ×1,5 za výhru,
- v co-opu dostanou materiály oba.

## 3. Úrovně hrdinů (za materiály)
- Každý hrdina má **úroveň 1–20**. Každá úroveň dává +2 % zdraví a +2 % poškození.
- Na úrovních **5 / 10 / 15 / 20 se odemkne talent** specifický pro hrdinu, například:
  - Rytíř 10: čepele startují se 3 kusy. Rytíř 20: po zásahu krátce neprůstřelný.
  - Lučištník 10: první salva každého taktu je dvojitá.
  - Mág 10: kouzelná střela se na první dobu taktu rozštěpí.
  - Stavitel 10: věže se staví s úrovní 2.
- Ceny rostou a postupně vyžadují všechny mapy: úrovně 1–7 jen Kostní prach, 8–14 navíc Jantar, 15–20 navíc Magmatit. Nováček tak začne na hřbitově a k dalším mapám ho to přirozeně dovede.
- Dává to hráči důvod hrát za různé hrdiny, protože každý má vlastní postup.

## 4. Výbava
- **4 sloty pro každého hrdinu:** Přilba, Zbroj, Amulet, Prsten. Zbraně zůstávají jen uvnitř běhu, to je jádro hry a nechci ho rozbít.
- Výbava je sdílená v **inventáři** a nasazuje se na hrdinu. Nasazený předmět nemůže mít víc hrdinů naráz.
- Statistiky podle slotu:
  - Přilba / Zbroj: zdraví, brnění, regenerace.
  - Amulet: poškození, šance na kritický zásah, síla fúzí.
  - Prsten: rychlost útoků, rychlost pohybu, dosah sbírání, zkušenosti, zlato z běhu.

### Rarity
| Rarita | Barva | Vlastností | Navíc |
|---|---|---|---|
| Běžná | šedá | 1 | – |
| Neobvyklá | zelená | 2 | – |
| Vzácná | modrá | 2 (silnější rozsahy) | – |
| Epická | fialová | 3 | – |
| Legendární | zlatá | 3 | **unikátní efekt** |

Hodnoty se losují v rozsahu dané rarity, třeba Vzácná: poškození +6–10 %. Dva předměty stejné rarity tak nejsou stejné, a to je motivace k dalším truhlám.

### Legendární efekty (napojené na rytmus a mechaniky hry)
- **Metronom** (Prsten): každá 4. doba udělá všem zbraním dvojnásobné poškození.
- **Basový tep** (Amulet): na první dobu taktu vyšle kolem hrdiny rázovou vlnu.
- **Srdce krypty** (Zbroj): oživení v co-opu trvá 2 doby místo 4 a sólo „Druhá šance“ se dobije po 3 minutách.
- **Dirigentská koruna** (Přilba): ťukání při fúzi má dvojnásobné okno pro Perfektní.
- **Zlatý řetěz** (Amulet): rytmické pouto má širší zlatou zónu a dává o 50 % víc poškození.
- **Kompas pouště** (Prsten): oázy léčí 2× víc, vozíky tě nezraní.

### Kování (Kovárna v menu)
- **Vylepšení +1 až +10:** každý stupeň dá +8 % ke všem hodnotám předmětu. Platí se zlatem a materiálem podle slotu (Přilba/Zbroj Kostní prach, Prsten Jantar, Amulet Magmatit). Tady je hlavní dlouhodobá „spotřeba“ materiálů.
- **Rozebrání:** nechtěný předmět vrátí trochu zlata a materiálu, takže žádná truhla není úplně k ničemu.
- **Sloučení 3 předmětů stejné rarity → 1 o raritu vyšší.** Provede se **rituálem do rytmu** stejně jako fúze zbraní: Perfektní ťuknutí zlepší losované hodnoty. Navazuje to na mechaniku, kterou hra už má, a duplikáty tím dávají smysl.

## 5. Obchod s truhlami (jen za zlato, žádné předměty na mapě)
| Truhla | Cena | Běžná | Neobvyklá | Vzácná | Epická | Legendární |
|---|---|---|---|---|---|---|
| Dřevěná | 150 zl | 70 % | 25 % | 5 % | – | – |
| Železná | 450 zl | 35 % | 40 % | 20 % | 5 % | – |
| Zlatá | 1 200 zl | – | 30 % | 45 % | 20 % | 5 % |

- **Šance jsou v obchodě vždy vidět** (u peněžních truhel je to v řadě zemí povinnost, u nás férovost).
- **Pojistka (pity):** Železná truhla dá Epickou nejpozději na 10. pokus, Zlatá dá Legendární nejpozději na 30. pokus. Počítadlo je vidět.
- **Denní truhla zdarma** (Dřevěná) jako důvod otevřít hru každý den.
- Otevírání truhly má mít efekt: truhla poskakuje do rytmu menu hudby a rarita se odhalí na dobu, u Legendární zlatý záblesk.

**Kontrola čísel:** při 150–400 zlata za běh je to zhruba Dřevěná za každý běh, Železná za 2 běhy a Zlatá za 4 běhy. Legendární předmět ze Zlatých truhel vychází v průměru zhruba na 20 truhel, tedy cca 80 běhů, s pojistkou nejpozději 120 běhů. K Legendárnímu se dá dostat i slučováním Epických. Je to dlouhodobý cíl, ale ne beznadějný. Po zavedení obtížností (kap. 6) zlata přibude a čísla se doladí.

## 6. Obtížnosti: aby výbava měla smysl (nutné!)
**Bez tohohle systém nefunguje.** S výbavou a úrovněmi hrdiny by byly tři mapy brzy triviální a nuda by přišla dřív než dnes.
- Po výhře mapy se odemkne **Noční můra I**, po výhře na ní NM II a tak dál až do **NM V**.
- Každý stupeň: nepřátelé +40 % zdraví a +20 % poškození, **materiálů +50 %, zlata +30 %**, a od NM III se v truhlách z bosse objevuje Epická výbava.
- To je ten opakovatelný cyklus: silnější výbava → vyšší obtížnost → víc materiálů → silnější výbava. Každá mapa má 6 stupňů, celkem tedy 18 „výzev“.
- Žebříček dostane sloupec „nejvyšší Noční můra“.

## 7. Další motivace k návratu (levné na výrobu)
- **Denní výzva:** jedna mapa s pevným seedem a modifikátorem (např. „jen věže“, „dvojnásobná rychlost“, „bez léčení“) a vlastní žebříček na ten den. Odměna je materiál.
- **Týdenní truhla** za odehrání 5 běhů za týden.
- **Sbírka (Kodex):** všechny předměty, legendárky a fúze jako „???“, dokud je hráč neobjeví. Navazuje na plánovaný Kodex fúzí.

## 7b. Úkoly a svíčky (hotovo: denní úkoly, svíčky, hledaní)
- Nástěnka v menu: 3 denní úkoly (lehký 60 zlata + 6 materiálu + 1 svíčka, střední 100 + 10 + 2, těžký 150 + 15 + 3), 1 přehození denně. Stejný seed dne pro všechny se stejným postupem.
- Hledaný: denní plakát (jedna elita na mapu), po přijetí se objeví v příštím běhu na té mapě, 80 s na dopadení. Odměna 150 zlata, 20 materiálu, 2 svíčky, 35 % šance na předmět (šance železné truhly).
- Svíčky: denní lišta 2/4/6 (60 zlata, 8 od každého materiálu, dřevěná truhla), týdenní lišta 6/12/18/24/30/40 (150 zlata, železná, 15 materiálu, 400 zlata, železná, zlatá). Vynechaný den nic nemaže.
- Hrubá hodnota: den ≈ 450 zlata + materiál + dřevěná truhla, týden navíc ≈ 2 železné + zlatá truhla. Ladit podle testerů.
- Týdenní lišta je připravená jako bezplatná větev budoucí „Kryptové cesty“ (fáze 7).
- Zbývá: týdenní kontrakty, Mistrovství (tituly, kosmetika).

## 8. Menu (nové obrazovky)
- Hlavní menu: Hrát · Hrát s kamarádem · **Hrdina** · **Obchod** · Vylepšení · Žebříček
- **Hrdina:** výběr hrdiny, jeho úroveň a talenty, 4 sloty výbavy, souhrn statistik („Poškození +34 %“), tlačítko vylepšit úroveň.
- **Inventář** (z obrazovky Hrdina): mřížka předmětů s barevným rámečkem podle rarity, filtr podle slotu, řazení. Ťuknutí na předmět zobrazí detail s tlačítky Nasadit, Vylepšit a Rozebrat.
- **Obchod:** 3 truhly + denní truhla, vidět šance a pojistka.
- **Kovárna** (záložka Obchodu nebo Hrdiny): vylepšení, sloučení, rozebrání.
- Stávající „Vylepšení“ (meta obchod za zlato) zůstane jako levný začátek progrese pro všechny hrdiny. Výbava a úrovně hrdinů jsou dlouhý ocas.

## 9. Kontrola: dává to smysl? Rizika a co je potřeba vyřešit

**Co sedí:**
- Materiály vázané na mapy plní cíl „hraj levely znovu“.
- Rarity a losované hodnoty dávají dlouhodobý cíl.
- Napojení na rytmus (legendárky, sloučení rituálem) dělá hru jedinečnou a ne jen další survivors klon.

**Rizika:**
1. **Bez obtížností (kap. 6) se hra rozbije.** Výbava zničí výzvu a hráči odejdou rychleji. Obtížnosti musí přijít nejpozději spolu s výbavou.
2. **Moc měn mate.** Proto jen zlato a tři materiály, žádné „esence“ ani „úlomky“.
3. **Podvádění.** Save je dnes v telefonu (localStorage) a cloud save zapisuje sám klient. Kdokoliv si může v konzoli dát legendárky. Pro žebříček je to otrava, **pro placené věci je to nepřípustné.** Než se začne cokoliv prodávat za peníze, musí inventář, materiály a otevírání truhel běžet **na serveru**: tabulky v Supabase, do kterých klient nesmí zapisovat (RLS), a otevírání truhly ve funkci na serveru (Supabase Edge Function), kde se losuje.
4. **Synchronizace savu.** Dnes vyhrává novější save jako celek, takže při hraní na dvou zařízeních by se mohly ztratit předměty. Inventář potřebuje slučování po jednotlivých předmětech (každý má id), nebo rovnou serverový inventář z bodu 3.
5. **Pay-to-win kazí co-op a žebříček.** Když si někdo koupí sílu, ostatní to vnímají jako nefér. Žebříček by měl mít oddělené kategorie nebo počítat jen výkony na stejné obtížnosti.

**Peníze (dlouhodobý cíl) – doporučení:**
- **Placené náhodné truhly (loot boxy) jsou právně citlivé.** V Belgii jsou zakázané, v dalších zemích EU se regulují a vždy se musí zveřejnit šance. Navíc hru hrají i mladší kamarádi. Než se zavedou, je potřeba si ověřit aktuální pravidla, nejlépe s někým, kdo se v tom vyzná. Já nejsem právník.
- **Bezpečnější a pro hráče příjemnější:** kosmetika za peníze (vzhledy hrdinů, barvy pouta, efekty fúze, mazlíček, který běhá vedle hrdiny) a **sezónní „Kryptová cesta“** (battle pass), tedy odměny za hraní a placená prémiová řada. Peníze tak nekupují sílu a co-op i žebříček zůstanou férové.
- **Technicky:** platby přes Stripe (vyžaduje podnikatele, DPH přes OSS a podmínky vrácení). Kdyby byla hra v App Store nebo Google Play, platby musí jít přes ně a berou si 15–30 %.
- **Rozhodnuto (11/2026):** cílem je vydání v Google Play / App Store, takže platby přes nákupy v obchodech. Podrobný plán v `VYDANI.md`.

## 10. Postup po fázích
1. **Materiály a úrovně hrdinů:** drop materiálů, ukazatel v HUD a na konci běhu, obrazovka Hrdina s úrovněmi a talenty. *Samo o sobě už nutí hrát všechny mapy.*
2. **Noční můry I–V:** obtížnosti, odměny, sloupec v žebříčku.
3. **Výbava:** inventář, 4 sloty, rarity, losované hodnoty, nasazování, obrazovka Hrdina a Inventář.
4. **Obchod a Kovárna:** truhly za zlato se šancemi a pojistkou, denní truhla, vylepšení, rozebrání, sloučení rituálem.
5. **Legendárky a Sbírka:** 6+ unikátních efektů, Kodex předmětů a fúzí, denní výzva.
6. **Serverový inventář** (Supabase tabulky + Edge Function pro truhly). Je to podmínka pro cokoliv za peníze.
7. **Monetizace:** nejdřív kosmetika a Kryptová cesta, placené truhly jen po právní kontrole.

Fáze 1–2 jsou zhruba jedno sezení, 3–4 jedno až dvě, 5 jedno, 6–7 podle toho, jak se rozhodneš.
