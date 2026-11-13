# Audit projektu – 13. 11. 2026 (verze 12z1)

Opakovat: skill `.claude/skills/audit-projektu`, `node tests/tools/audit.js plny` (~25 min v sandboxu) a nově **proklikání všech tlačítek** `node tests/tools/proklik.js [hloubka] [cs|en] [souběh]` (hloubka 2 v češtině ~40 min, hloubka 1 v angličtině ~7 min).

## Co prošlo
- **Proklikání celé hry (nové, `proklik.js`):** 46 scénářů = 18 obrazovek menu + běh, pauza, nabídka úrovně, výhra, prohra, vždy pro nového i pokročilého hráče. Každé viditelné tlačítko zmáčknuté skutečným klepnutím, do hloubky 2 (tlačítka v oknech, která se po kliku otevřou). **CZ ~2 750 kliků, EN 477 kliků: 0 chyb JS, 0 pádů, 0 tlačítek zakrytých něčím jiným než otevřeným oknem.**
  - „Bez reakce“ zůstaly jen vybrané záložky, šipka „‹“ na první kapitole, už zvolený jazyk/ovládání a hvězdy v okně názoru (mění jen výběr). Vypnutá tlačítka (nový hráč nemá zlato na hrdinu, truhlu, hvězdu; co-op offline) jsou správně `disabled` a proklikávač je od teď přeskakuje.
- **`audit.js plny`:** 24 kontrol ✓ – duplicitní funkce, verze a `?v=`, tajné klíče, fialová v UI, překlady, ukládání, denní výzva, mechaniky po restartu, menu, server (stub), horní okraj, pauza, oslava, ultimátka, 18 obrazovek × 2 účty × CZ/EN, **50 map** 20 s + boss, běh do konce, pohlednice, boti přes všechny kapitoly.
- **Oblastní testy (29):** `boardseal`, `fbask`, `komiks`, `korist`, `kovarna-milniky`, `kovarna-postupne`, `novinky`, `obchod-znacka`, `offline`, `offline-navrat`, `opusteny`, `pribeh`, `priprava-rolovani`, `prvnidny`, `revealpop`, `runpole`, `tutorial` (nový hráč vyhrál Hřbitov ve 4:03), `tydenkrypta`, `ukazmi` (CZ/EN, malý i velký iPhone), `ulozeni-plne`, `vezpostat`, `vyzvamapa`, `fuzemark`, `jmenahrdinu`, `botcoop`, `prvnich15` (nováček 16 min hry, bez chyb), `grafcheck` CZ/SE + EN/15 (0 nálezů), `i18n static` (0 chybějících překladů) – vše ✓.
- **ESLint:** žádné `no-undef` ani `no-redeclare`.
- **Server:** 0 otevřených nahlášení, 0 podvodů za 3 dny, 0 chybných PINů, 0 závadných přezdívek, **0 chyb JS od hráčů v `events`**. Za 2 dny 30 běhů od 2 hráčů; na verzi 12z1 zatím nikdo nehrál (kontrolu výher v kapitole I udělat, až budou data).

## Opraveno v rámci auditu (beze změny hry pro hráče)
1. **`chapcheck.js` hlásil 48 chyb „chybí anglický popis“** u všech map – falešný poplach po 12z (hra přepisuje čas „Vydrž M:SS“ v popisu podle skutečné délky, kontrola porovnávala už přepsaný text). Ve hře anglické popisy fungují (ověřeno). Kontrola teď čas při porovnání ignoruje → `chapcheck all` „Vše v pořádku“.
2. **Zdvojené barvy v paletě věže Ohniště** (`o`, `y` dvakrát, platila druhá) – první dvojice smazaná, vzhled beze změny.
3. **Testy `prvnidny.js` a `ukazmi.js` zastaralé po 12y** (Fúze se odemyká výhrou na Bažině, po ní přijdou 3 karty místo 2) – upravené, ověřují nové chování (3. karta Fúze bez „Ukaž mi to“, Novinky až po ní).
4. `lib.open({init})` – vlastní skript před načtením hry (pro proklikávač); `vezpostat.js` a `fuzemark.js` si složku na snímky vytvoří samy (bez ní padaly).

## Nálezy (podle priority)

### Střední
– žádné. (Původně tu byl „zastaralý vzorec `kitTier`“ – po přepočtu `krivka.js` 13. 11. se ukázalo, že model z kapitol IX–X sedí (kh 2733 proti zapsaným 2774). Je určený pro **další** kapitolu, ne pro staré, a dává spíš přísný výchozí odhad, který postup nové kapitoly vždy doladí boty (`ladeni.js`). `chapcheck` ho teď srovnává jen s posledními dvěma kapitolami: 53 upozornění → 6.)

### Nízká
2. **Plynulost menu v sandboxu:** první otevření Hrdiny ~430 ms a Přípravy ~370 ms jedno zaseknutí. Rozbor (trace Chromia): JavaScript nejvýš ~145 ms (z toho `kaKick` = kreslení kamenných rámů ~70 ms), zbytek je skládání vrstev (`Commit`) bez grafické karty – na telefonu výrazně kratší. **Na telefonu ověří uživatel**; když se sekne, zrychlit `kaKick` (kreslit jen viditelné rámy).
3. ~~CLAUDE.md 45 kB~~ – vyřešeno: popisy verzí 11f–11x přesunuté do `docs/HISTORIE.md` („Stav k 12. 11.“), pravidla z nich shrnutá v jednom bodu → 39 kB.
4. **Nepoužité proměnné:** 6 bezpečných pryč v 13a (`C9P`, `C9R`, `C10L`, `S` v `renderMaster`, `K`/`X` v Nástěnce); zbylých 19 je uvnitř kreslicích výpočtů – neškodné, nechávám.
5. **Server (beze změny, záměr):** SECURITY DEFINER funkce volatelné hráči (kontrolují `auth.uid()` nebo klíč), `coop_board` pro anon, RLS bez pravidel na `private.*` (nikdo tam nesmí), nepoužitý index `feedback_uid_created` (zatím málo dat), vypnutá ochrana proti uniklým heslům (hra hesla nepoužívá, jen PIN).
6. Jeden hráč má pořád vynucené přejmenování (`rename_req`) – ještě nespustil hru.
7. ~~Pohár v Síni slávy visel nad deskou~~ – opraveno v 13a.

## Kde si ulehčit práci
1. **`proklik.js`** je nový nástroj: po větší změně UI ho pustit s hloubkou 1 (`node proklik.js 1 cs 2 'late:'` ~10 min) – chytí chybu JS za kterýmkoli tlačítkem.
2. **Automatická kontrola na GitHubu** (z minula): GitHub Actions s `audit.js` po pushi.
3. **ESLint do `audit.js`** (z minula): dnes ruční krok skillu.
