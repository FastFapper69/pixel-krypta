# Pixel Krypta – návrh dlouhodobé progrese: materiály, výbava, obchod, rarity

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
