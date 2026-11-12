# Webové portály: Poki a CrazyGames (zjištěno 12. 11. 2026)

Plán práce #6. Zdroje jsou oficiální dokumentace portálů (odkazy u bodů). Podmínky se mění, před přihláškou je ověř znovu.

## CrazyGames – otevřené přihlášky, nejlepší testovací laboratoř
- **Basic Launch** = zkušební zveřejnění na 7–21 dní: končí po aspoň 7 dnech a 500 hrách, nejpozději po 21 dnech. Portál sám měří a denně ukazuje **průměrnou délku hraní, D1 a konverzi** (kolik hráčů hraje aspoň minutu). SDK není potřeba, reklamy jsou vypnuté. ([basic launch](https://docs.crazygames.com/resources/basic-launch-metrics/))
- Měřítka „silné hry“ na CrazyGames: hraní 10+ min, **D1 10–15 %**, konverze 80+ %, načtení do 10 s, build pod 20 MB. Na webu je D1 přirozeně nižší než v aplikacích.
- Podmínky Basic: první stažení ≤ 50 MB (pro mobilní hlavní stránku ≤ 20 MB), ≤ 1 500 souborů, relativní cesty, kontrola PEGI 12, **žádné externí přihlašování** a žádné cizí reklamy. Na výšku smí být, okraje portál doplní. Zvuk na iOS spustit až po dotyku. ([technické](https://docs.crazygames.com/requirements/technical/), [úvod](https://docs.crazygames.com/requirements/intro/))
- **Full Launch** (jen po výběru): SDK, reklamy jen přes SDK, účet CrazyGames místo vlastního (jejich `userId`, jméno a avatar, žádná vlastní přezdívka ani přihlášení PINem), uložení přes jejich Data modul nebo backend navázaný na `userId`. Nákupy jen na pozvání přes Xsolla. ([účty](https://docs.crazygames.com/requirements/account-integration/))
- Smlouva je ve výchozím stavu **neexkluzivní** (hra může zůstat na GitHub Pages i jinde). Výplaty měsíčně přes Tipalti od 100 €.

**Co by Krypta potřebovala pro Basic Launch (odhad 1–2 dny):** portálový režim, který se zapne podle adresy nebo přepínače v buildu. Skryje přihlášení přezdívkou a PINem a obnovu účtu. Zápis do žebříčku buď vypne, nebo nechá anonymní. Události a běhy pošle anonymně, s krátkým upozorněním na zásady soukromí. Co-op přes odkaz bude zatím vypnutý. Hra se zabalí jako zip s relativními cestami. Vlastní měření `events` a `runs` poběží dál, takže se dá srovnat s čísly portálu.

## Poki – výběrový portál, výhodný jen s exkluzivitou
- **Poki Playtesting:** malá skupina hráčů Poki dostane pozvánku. Za jeden test dostaneš **10 videozáznamů hraní** se stisky tlačítek a výpisem konzole a k tomu délku hraní, zemi a zařízení. Cílit jde na zařízení a publikum. Stránka neuvádí cenu ani žádný závazek. ([playtesting](https://developers.poki.com/guide/playtesting)) → **10 videí cizích lidí, kteří hru neznají, je přesně tichý test (#9), jen ve větším.**
- **Smlouva:** výchozí je **webová exkluzivita na 5 let**. Platí pro celý otevřený web včetně Discordu a YouTube Playables, takže verze na GitHub Pages by musela zmizet. Obchody s aplikacemi, Steam a konzole exkluzivita nezahrnuje. Z hráčů, které přivede Poki, je dělení příjmu 50/50, z vlastních hráčů jde 100 % autorovi. Neexkluzivní varianta = jednorázový poplatek bez podílu. ([typy smluv](https://developers.poki.com/guide/revenue-deal-types), [průvodce](https://developers.poki.com/guide))
- **Požadavky:** desktop, mobil i tablet, poměr 16:9 na počítači, první stažení pod 8 MB, cutscény jde přeskočit, tutoriál obrázkem, víc jazyků. **Žádné nákupy ani tlačítko „bez reklam“.** Externí požadavky jsou ve výchozím stavu blokované: Supabase by se posuzovalo jednotlivě a vyžaduje zásady soukromí. **Produkty Google jsou zakázané vždy**, což se týká STUN serveru Google v co-opu. Reklamy jen přes Poki SDK a tlačítko odměny musí mít vedle sebe zelené Pokračovat. ([požadavky](https://sdk.poki.com/new-requirements))

## Doporučení
1. **Hned: Poki Playtesting.** Uživatel si založí účet na developers.poki.com, nahraje hru a objedná test. Dostaneme 10 videí cizích hráčů a podle nich opravíme začátek hry. Nic se tím neslibuje. Před nahráním: ověřit cenu a jestli test nevyžaduje SDK.
2. **Pak: CrazyGames Basic Launch.** Přinese stovky cizích hráčů a jejich D1 a délku hraní zadarmo a bez exkluzivity. Claude udělá portálový režim (1–2 dny). Čísla porovnáme s branou v `docs/PLAN-PRACE.md` (pro web D1 10–15 % = silná hra).
3. **Poki smlouvu teď ne.** Pětiletá webová exkluzivita, zákaz nákupů a zákaz produktů Google se nehodí, dokud nevíme, jestli hra drží hráče. Vrátit se k ní, až CrazyGames ukáže silná čísla.
