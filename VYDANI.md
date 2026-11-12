# Pixel Krypta – vydání na Android / iOS a monetizace

Stav: **jen plán** (sepsáno 6. 11. 2026, nic z toho zatím není hotové). Navazuje na `EKONOMIKA.md` (fáze 6 serverový inventář, fáze 7 monetizace).
Research monetizace a regulace k 11. 11. 2026 (DFA, PEGI 16, reklamy, battle pass): `docs/RESEARCH-MONETIZACE.md`.
Rozbor Survivor.io, srovnání s konkurencí, šance na výdělek, technické mezery a plán s branami (12. 11. 2026): `docs/RESEARCH-SURVIVORIO.md` (dokument: https://claude.ai/artifact/EXKsd5UoARaXwd2CFWWMCv).
Údaje o obchodech (poplatky, pravidla testování, pravidla k AI) se mění – před každým krokem je ověř znovu.

## 1. Co je potřeba
1. **Zabalit hru do aplikace** – Capacitor (`index.html` → nativní aplikace pro Android i iOS skoro beze změn).
   - Přibalit lokálně supabase-js (teď z jsdelivr) a fonty z Google Fonts, aby hra běžela offline.
   - Co-op odkazy `?hra=1234` přepsat na deep linky (App Links / Universal Links).
   - Znovu ověřit zvuk po zamčení telefonu (WebView se může chovat jinak než Safari/Chrome).
   - Sestavení bez počítače: GitHub Actions (Android AAB, iOS přes macOS runner). Uživatel nemá terminál ani počítač.
2. **Účty v obchodech**
   - Google Play: 25 $ jednorázově + ověření totožnosti. Nový osobní účet musí mít **uzavřený test s 12 testery po dobu 14 dní**, než smí vydat veřejně (testeři = kamarádi).
   - Apple: 99 $ ročně. Přísnější kontrola, aplikace nesmí působit jako obalený web (pravidlo 4.2) – offline běh a nativní dojem pomáhají.
   - **Začít Androidem** (levnější, jednodušší), iOS až potom.
3. **Monetizace**
   - Digitální zboží (krystaly, kosmetika, Kryptová cesta) se v aplikaci **musí prodávat přes nákupy v obchodě**, ne Stripe. Poplatek 15 % (program pro malé vývojáře), jinak 30 %. DPH v EU odvádí obchod.
   - Technicky: plugin pro nákupy (např. RevenueCat) + **ověření nákupu na serveru** (Supabase Edge Function připíše krystaly).
   - Snadný začátek: **reklama za odměnu** (AdMob) – oživení / dvojnásobná odměna za shlédnutí. Nutné GDPR souhlasové okno (UMP).
   - Placené truhly (loot boxy) zatím ne – nejdřív kosmetika a battle pass, truhly až po právní kontrole (viz `EKONOMIKA.md` kap. 9).
   - **Podmínka: serverový inventář** (fáze 6) před jakýmkoliv prodejem.
4. **Papíry a povinnosti**
   - Živnostenský list, zdanění příjmů (ověřit s účetním).
   - Zásady ochrany osobních údajů (veřejná stránka, může být na GitHub Pages).
   - **Mazání účtu přímo ve hře** (vyžadují oba obchody).
   - Dotazník věkového hodnocení (IARC), formulář o sběru dat (Data safety / App Privacy).
   - Šance truhel zveřejněné (už hotovo). Pokud hrají nezletilí, přísnější pravidla pro reklamy a nákupy.

## 2. Doporučené pořadí
1. Serverový inventář (fáze 6)
2. Capacitor + Android build přes GitHub Actions
3. Uzavřený test na Google Play s kamarády (12 testerů, 14 dní)
4. Nákupy kosmetiky / reklama za odměnu
5. iOS (TestFlight, pak App Store)

Sdílení výsledku, denní žebříček, tutoriál a PWA už hotové jsou – na oblíbenosti dál pracovat (obsah, kosmetika, týdenní kontrakty), hráče přivede spíš to než samotná monetizace. PWA (`manifest.webmanifest`, `sw.js`, ikony) se dá v Capacitoru znovu použít, SW ve WebView vypnout/neregistrovat.

## 3. Rozdělení práce
**Claude:**
- Capacitor projekt, offline přibalení knihoven a fontů, deep linky
- GitHub Actions pro sestavení Android i iOS
- Serverový inventář: SQL tabulky, RLS, Edge Functions (truhly, nákupy)
- Kód pro nákupy, ověřování nákupů na serveru, reklamy za odměnu + souhlasové okno
- Mazání účtu ve hře
- Zásady ochrany osobních údajů (stránka na GitHub Pages)
- Texty do obchodů (CZ + EN), ikona v pixel artu, screenshoty (Playwright)
- Připravené odpovědi do formulářů (věkové hodnocení, sběr dat)
- Testování a opravy po vydání

**Uživatel:**
- Založit a zaplatit účty Google Play a Apple Developer, ověřit totožnost
- Živnost, daně, bankovní a daňové údaje v konzolích (případně s účetním)
- Klíč App Store Connect API a podpisový klíč pro Android vložit do GitHub Secrets (návod připraví Claude). **Zálohu podpisového klíče si uložit** – bez něj nejde vydat aktualizaci.
- Sehnat 12 testerů na 14 dní a hlídat, že hrají
- Vyplnit formuláře v konzolích podle podkladů, založit produkty k prodeji, odeslat ke schválení, reagovat na zamítnutí
- Účty RevenueCat a AdMob, předat klíče
- Testovat na telefonech (pro iOS je potřeba iPhone / TestFlight)
- Rozhodnutí: ceny, co se prodává, reklamy ano/ne, právní kontrola placených truhel

Odhad: uživatel zhruba 1–2 večery klikání a papírování, rozložené podle postupu. První krok: založit Google Play účet (ověření trvá i několik dní), mezitím Claude připraví Android verzi.

## 4. Realistická očekávání
- Většina indie mobilních her bez marketingu vydělá velmi málo (pár set až tisíc Kč celkem). Výdělky jsou extrémně nerovnoměrné.
- Hrubý odhad: příjem ≈ denní hráči × výdělek na hráče za den (u podobných her orientačně pár centů až ~10–20 centů). 100 hráčů denně ≈ stovky Kč měsíčně, 1 000 ≈ desítky tisíc Kč, 10 000+ už reálný příjem (vyžaduje virální efekt nebo placenou reklamu).
- Nejtěžší je sehnat a udržet hráče, ne vydání.

## 5. Hra vytvořená s AI
- Obchody hry vytvořené s pomocí AI nezakazují. Pravidla Google Play o označování AI obsahu (od 2026) se týkají aplikací, které generují obsah AI za běhu pro hráče – Pixel Krypta to nedělá (grafika i hudba vznikají z kódu).
- Mobilní obchody zatím obecné přiznání použití AI nevyžadují (Steam ano). Před odesláním ověřit aktuální pravidla.
- Autorská práva: čistě AI generované dílo nemusí být chráněné (chybí lidský autor). Návrh, rozhodnutí a směr hry jsou uživatelovy, to pomáhá. Není to právní rada.
- Část hráčů hry od AI nemá ráda – nejlepší obrana jsou vlastní nápady (rytmus, fúze rituálem).
