# Kovárna – strom vylepšení

## 12w: postupné odhalování (uživatel 12. 11.: „nemělo by se tohle odemykat postupně?“)
- `treeVis(T)`: 1. statistika sloupce vždy; další až když má předchozí ≥ `TREE_STAT_SHOW` (5) úrovní nebo je sama koupená.
- Schopnosti: koupené + další v řadě, pokud jde koupit; první zamčená jako tajná „?“ (`data-sec`, okno ukáže jen podmínku); zbytek skrytý.
- Mistrovství až po otevření (50 úrovní ve větvi). Viditelnost závisí jen na rostoucích číslech → nic se znovu neschová.
- Nový viditelný uzel = druh `tree` v `newAll` (`'n'+id`) → pečeť na Kovárně (`refreshNew`), po otevření stromu `spotOn` na první nový uzel. Stávajícím hráčům `seenInit` jednou označí známé uzly (`save.seen._tree`).
- Test `tests/tools/kovarna-postupne.js`.

## Stav návrhů (12z1, uživatel: „udělej všechno“)
- ✅ 1 milníky (`MILES`, `milesApply` v `recalc`, seznam v okně statistiky, hláška „Milník!“ při nákupu)
- ✅ 3 rytmus jen jako milník Síla 30 (`st.ms.beat`, kritická šance na 1. dobu); další rytmické uzly nedělané
- ✅ 4 úder kladiva (`sfx('anvil')` na nejbližší osminu hudby, `.tn.hit` ostré kroky)
- ✅ 5 přerozdělení (`treeRefund`, `treeRespecAsk`: vrátí 90 % zlata a celé Úlomky/Esenci; mistrovství a Druhá šance zůstanou)
- ⏸ 2 volba variant schopností – mění balanc 15 schopností, zvlášť dávka po rozhodnutí uživatele

## Návrhy, jak strom udělat zajímavější (12w)
1. **Milníky statistik** – na 10/20/30 úrovni statistika dá viditelnou schopnost, ne jen další %: např. Síla 10 = první zásah elity je vždy kritický; Odolnost 20 = štít při příchodu bosse; Magnetismus 30 = krystaly z elit přiletí samy. Cíl, na který se těšíš, místo 30× +1 %.
2. **Volba na každém stupni schopností** – dvě varianty, vybereš jednu, přepnout jde zdarma v Přípravě (např. „Úder do rytmu“ × „Synkopa“ = krit mimo dobu). Vzniknou buildy a důvod zkoušet.
3. **Rytmus jako jádro stromu** – víc uzlů navázaných na takt (rázová vlna každý 8. takt, věž dvakrát rychleji na první dobu), protože rytmus je to, co hru odlišuje.
4. **Pocit z nákupu** – úder kladiva do rytmu, jiskry, uzel se rozzáří, plný sloupec dostane plamen; mistrovství s vlastní animací.
5. **Přerozdělení** za malý poplatek (Esence), ať se hráč nebojí zkoušet.
Doporučené pořadí: 1 + 4 (malá práce, velký rozdíl), pak 2.
