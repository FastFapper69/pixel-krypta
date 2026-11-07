---
name: "survivors-design-balance"
description: "Návrh a balancování survivors-like/roguelike her (zbraně, fúze, vlny, meta-progrese, ekonomika, truhly). Použij při designu nebo ladění Pixel Krypty."
---

# Survivors-like design & balancování

Komunikuj česky. Než navrhneš změnu, zjisti aktuální stav hry (v repu: CLAUDE.md, EKONOMIKA.md, tests/tools/). Nikdy nebalancuj naslepo z paměti.

## Jak přemýšlet o designu
- **MDA**: každou mechaniku popiš jako Mechanika → Dynamika (co hráč reálně dělá) → Estetika (jaký pocit to vyvolá). Když estetika chybí, mechanika je zbytečná.
- **Pilíře hry**: drž 3 pilíře (např. „pocit síly“, „čitelný chaos“, „rytmus a juice“). Každý nápad otestuj proti nim; co žádný pilíř nepodporuje, škrtni.
- **Core loop survivors**: zabij → seber XP → level-up volba → silnější build → větší hordy. Smyčka musí v prvních 30 s ukázat první volbu.
- **Run struktura**: jasná křivka – klidný začátek, první power spike do 2–3 min, mid-run boss/elitka, finální vrchol. Hráč má cítit „ještě jeden run“.

## Zbraně, synergie, fúze
- Každá zbraň má jednu jasnou roli (plošná, průrazná, zóna, single-target, obranná). Dvě zbraně se stejnou rolí = jedna navíc.
- Synergie dělej přes sdílené tagy (oheň, projektil, aura…), ne přes ručně párované výjimky.
- Tajné fúze: vyžaduj max level zbraně + konkrétní pasivku; výsledek musí být viditelně jiný (nový vizuál, ne jen větší čísla).
- DPS rozptyl: na stejném levelu by žádná zbraň neměla mít víc než ~1,5× DPS průměru, pokud za to neplatí nevýhodou.

## Vlny a obtížnost
- Obtížnost řiď rozpočtem: každá vlna má „threat budget“, nepřátelé mají cenu. Snadno se ladí jedním číslem.
- Mezi tlakovými vlnami dej krátké oddechy – rytmus napětí/úlevy.
- Tower defense prvky (krystal, věže, Stavitel) nesmí dominovat: věže doplňují hrdinu, nenahrazují ho.

## Ověřování čísel (povinné)
- Balancuj výpočtem, ne odhadem: napiš skript (simulace / Monte Carlo) – např. 10 000 simulovaných level-up voleb, rozložení času do smrti, očekávaná hodnota truhly.
- Hlídej: medián délky runu, % runů, kde se hráč dostane k fúzi, výdělek měny za run vs. ceny v obchodě.
- Výsledky ukaž jako tabulku nebo graf, ne jen větu.

## Meta-progrese a ekonomika
- Model zdroje (sources) vs. odtoky (sinks) měny; spočítej, za kolik runů si hráč koupí klíčové upgrady. Cíl: první smysluplný nákup po 1–2 runech.
- Meta upgrady mají zrychlit, ne nahradit skill. Nováček s maximem upgradů nesmí vyhrát bez hraní.
- Truhly za skutečné peníze: navrhuj eticky – zobraz šance, nedávej placenou výhodu do soutěžních žebříčků, preferuj kosmetiku. Před spuštěním upozorni, že pravidla app storů a některých zemí (loot boxy) je potřeba ověřit aktuálně.

## Výstup
U každého návrhu uveď: co se mění, proč (pilíř/MDA), čísla před/po, jak to otestovat, a co může rozbít.