# Právní a licenční kontrola před vydáním (9. 11. 2026)

Orientační přehled sestavený z veřejných zdrojů, **není to právní rada**. Před spuštěním plateb a vydáním v obchodech nechat zkontrolovat právníkem.

## V pořádku
- **Grafika, mapy, ikony, postavy, hudba a zvuky** – vše generuje kód hry (procedurální pixel art, WebAudio syntéza). Žádné cizí obrázky, zvuky ani asset packy. PNG v repu (`thumbs/`, `icon-*`, `net3_*`) jsou vygenerované ze hry.
- **Písma** Pixelify Sans a Chakra Petch – SIL Open Font License 1.1: komerční použití i ve hrách povoleno; zakázaný je jen prodej samotných písem. Při přibalení písem do aplikace přiložit text licence OFL.
- **supabase-js** – licence MIT: povoleno, do hry/repa přidat upozornění na licenci.
- **Žánr a inspirace** (survivors-like, rytmus v kryptě jako Crypt of the NecroDancer, styl Graveyard Keeper, intro bossů ve stylu Borderlands) – nápady, mechaniky a styl nejsou autorsky chráněné. Ve hře nejsou žádné cizí názvy, postavy ani assety (ověřeno grepem). Jediné „Blizzard“ je anglický překlad kouzla Ledová smršť = běžné slovo, nízké riziko (případně „Snowstorm“).
- **Název Pixel Krypta** – hra stejného jména nenalezena. Existují „Krypta“ (itch.io, IndieDB) a „Pixel Crypt“ (game jam na itch.io). Před vydáním ověřit ochranné známky v TMview / ÚPV (nebylo hledáno přímo v databázích).
- **Supabase** běží v EU (eu-west-1, Irsko).

## Hotovo ve verzi 09y
- Písma a supabase-js jsou přímo ve hře (`fonts/`, `vendor/`), žádné načítání z Google Fonts ani jsDelivr. Licence v `licenses/`.
- Filtr přezdívek ve hře (`nickBad`) i na serveru (`public.nick_bad` + trigger), nahlášení hráče (`public.reports`), skrytí hráče lokálně (`save.blk`) a moderátorem (`profiles.hidden`). Jeden existující urážlivý profil skrytý.
- Smazání všech dat ve hře (`public.delete_my_data()` smaže i anonymní účet).
- Zásady ochrany osobních údajů: `PRIVACY.md` + okno Nastavení → Soukromí a licence (CZ/EN).
- **Zbývá:** doplnit jméno/firmu a e-mail provozovatele do zásad, vlastní doména, rozhodnutí o truhlách za peníze, ochranné známky v TMview.

## Potřeba vyřešit před vydáním
1. **Osobní údaje (GDPR)** – hra ukládá anonymní účet, přezdívku, postup, statistiky běhů včetně údaje o prohlížeči, zpětnou vazbu (volný text) a IP adresy jdou na Supabase, Google Fonts, jsDelivr a Google STUN (co-op).
   - Zásady ochrany osobních údajů (povinné i pro App Store a Google Play).
   - Možnost smazat svá data ve hře (Apple 5.1.1(v) u aplikací s účty).
   - **Google Fonts hostovat u sebe** – rozsudek LG Mnichov 20. 1. 2022: načítání z Google serverů předává IP adresu Googlu bez souhlasu. jsDelivr IP agreguje a maže, stačí zmínit v zásadách (nebo supabase-js přibalit).
2. **Přezdívky v žebříčku = obsah od uživatelů** (Apple 1.2): podmínky s nulovou tolerancí, filtr nevhodných přezdívek, nahlášení, blokování, kontakt ve hře, reakce do 24 h. Teď žádný filtr není.
3. **Truhly za skutečné peníze (plán)** – placené náhodné předměty = loot boxy:
   - **Belgie:** od 2018 nelegální hazard (pokuty až 800 000 €) → vypnout nákup pro Belgii, nebo truhly jen za herní měnu.
   - **Nizozemsko:** rozsudek 2022 ve prospěch EA, riziko zůstává hlavně u předmětů prodejných za peníze.
   - **ČR:** MF (2018) – hazard hrozí hlavně, když jde výhru přeprodat dráž; u nás předměty nejdou směnit ani prodat → nižší riziko.
   - **Apple 3.1.1 a Google Play:** šance zveřejnit před nákupem (hra je u truhel už ukazuje ✔).
   - **PEGI od června 2026:** hry s placenými náhodnými předměty minimálně **PEGI 16** (nové hodnocení). Přímý prodej konkrétních věcí nebo kosmetiky to obejde.
   - **EU CPC zásady (21. 3. 2025):** cena i v korunách/eurech u herní měny, co nejméně měn (máme zlato, Úlomky, Esenci), žádné nucené balíčky, informace o odstoupení do 14 dnů, ochrana dětí.
   - **Digital Fairness Act:** návrh EU očekáván ve 2. pol. 2026, možný zákaz loot boxů pro nezletilé.
4. **Hosting** – GitHub Pages nesmí sloužit k provozu online byznysu ani e-shopu → při spuštění plateb přesunout (vlastní doména). Adresa teď obsahuje jméno účtu FastFapper69 a je vidět i na sdílených obrázcích výsledku; pro obchody vlastní doména.
5. **Autorská práva ke kódu psanému s AI** – Městský soud v Praze: výstup AI bez lidské tvůrčí činnosti není chráněný. Vydání to nebrání, ale ochrana proti kopírování může být slabší. Repo je veřejné → zvážit soukromé repo a schovávat doklady vlastního tvůrčího podílu (návrhy a rozhodnutí v CLAUDE.md, KAMPAN.md, EKONOMIKA.md).

## Zdroje
- PEGI 2026: https://shattered.io/loot-box-pegi-16-crackdown-2026/
- Loot boxy podle zemí: https://blog.promise.legal/lootbox-laws-jurisdiction-indie-game-studios/
- EU CPC zásady: https://www.reedsmith.com/articles/qas-on-the-eu-consumer-protection-authorities-joint-guidance-paper/
- MF ČR a loot boxy: https://www.lupa.cz/aktuality/ministerstvo-financi-se-zameri-na-loot-boxy-ve-hrach-mohou-predstavovat-hazard/
- Google Fonts a GDPR: https://wptavern.com/german-court-fines-website-owner-for-violating-the-gdpr-by-using-google-hosted-fonts
- jsDelivr a GDPR: https://www.jsdelivr.com/blog/how-the-german-courts-ruling-on-google-fonts-affects-jsdelivr-and-why-it-is-safe-to-use/
- Apple 1.2 (obsah od uživatelů): https://developer.apple.com/forums/thread/807358
- Apple 5.1.1(v) mazání účtu: https://developer.apple.com/support/offering-account-deletion-in-your-app
- GitHub Pages limity: https://docs.github.com/en/enterprise-server@3.22/pages/getting-started-with-github-pages/github-pages-limits
- AI a autorské právo v ČR: https://www.twobirds.com/en/insights/2024/czech-republic/czech-court-denies-copyright-protection-of-ai-generated-work-in-first-ever-ruling
