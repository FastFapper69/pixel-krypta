# Nová grafika UI – specifikace (zadání V3, 10. 11. 2026)

Zdroj: dokument uživatele „Pixel Krypta – UI Design System a Specifikace Hry“ (V2 na Disku + doplněk V3 o redukci textu).
Stav: **návrhy pěti obrazovek poslané uživateli 10. 11. večer, čeká se na schválení.** Makety: `tests/tools/mock/grafika/` (`node gshot.js <složka> levelup,pause,shop,forge,forge_fill,hero [cs|en] [15|se] [dpr]`; `old_*` = dnešní stav). Práce poběží na větvi `grafika`, na `main` až po schválení.
Skill k tomu: `.claude/skills/pixel-ui-art-direction`.

## 1. Tři pravidla, která platí všude

### 1.1 Text jen tam, kde ho nic nenahradí
Co dokáže říct ikona, barva, slot nebo sama mechanika, to se nepíše.

| Smí zůstat | Musí pryč |
| :-- | :-- |
| čísla a staty (`+8 % Rychlost útoků`) | vysvětlující věty na obrazovkách |
| názvy tlačítek (1–2 slova) | popisky slotů („Přilba“, „Boty“) |
| vlastní jména (hrdina, mapa, předmět, boss) | štítky tříd slovem (BARD, MÁG) |
| nadpis obrazovky | nadpisy sekcí, kde je obsah jasný z obrázku |
| prázdný stav jedním krátkým pokynem („Vyber 3 předměty“) | odstavce o tom, jak systém funguje |

**Nápověda:** každá obrazovka má v hlavičce jednu malou ikonu `?`. Ťuknutí otevře lístek pergamenu s vysvětlením (texty, které dnes stojí přímo na obrazovce, se přesunou sem a do Průvodce). Podržení prstu na ikoně nebo předmětu ukáže jeho jméno a staty.

**Výjimky, kde text zůstává** (jinak by hra ztratila obsah nebo porušila pravidla):
- hlášky bossů a příběh mezi kapitolami (jsou to vtipy a děj, ne návod),
- Novinky,
- zadání úkolů na Nástěnce, ale zkrácené na ikonu + číslo + 2–3 slova,
- první běh (tutoriál) – jedna krátká věta na krok,
- Soukromí a licence, mazání dat, chyby přezdívky a PINu (povinné texty).

**Měřitelný limit:** nový test `textcheck.js` projde všechny obrazovky a spadne, když je na obrazovce text delší než 32 znaků mimo povolený seznam, nebo víc než 220 znaků celkem. Dnes má hra 2 284 různých textů, z toho 468 delších než 60 znaků.

### 1.2 Jedna pixelová mřížka
- **1 pixel UI = 2 CSS px** (`--u:2px`), stejně jako herní plátno (`Z=2`). Všechny rozměry, okraje, mezery a posuny jsou násobky 2 px.
- Žádné zaoblení, rozmazání, plynulé přechody barev ani poloviční pixely. Stín = tvrdý posun o 2 nebo 4 px. Průhlednost jen u HUD ve hře.
- Ikony se kreslí ve dvou velikostech: **16×16** (zobrazeno 32 px) a **8×8** (zobrazeno 16 px, odznáčky v rozích). Nic se nezvětšuje jiným poměrem než celým násobkem.
- Rámy panelů a tlačítek se kreslí procedurálně do plátna jako devítidílný rám (`uiFrame(materiál)`), stejně jako dnešní textury (`pxTex`). Jedna funkce = jeden zdroj pravdy, žádné ručně skládané stíny v CSS.
- Dotykové plochy nejméně 44×44 px.

### 1.3 Jedno pixelové písmo
- Rodina **Jersey** ve třech řezech, každý v jediné velikosti, aby měl pixel písma vždy 2 px jako zbytek UI: **Jersey 10 ve 20 px** (základ, čísla, popisky), **Jersey 15 ve 30 px** (názvy, tlačítka), **Jersey 20 ve 40 px** (nadpis obrazovky, velké chvíle). Jiné velikosti se nepoužívají (Jersey 10 ve 30 px by měl pixel 3 px = míchání hustot).
- Celá česká diakritika, číslice se nepletou (dnešní Pixelify Sans plete 25 a 88). Soubory v `fonts/`, licence `licenses/OFL-Jersey.txt`.
- Gotické písmo (Jacquard) vyzkoušeno a zamítnuto: velké O, V, S nejdou přečíst („Obchod“ vypadal jako „Vbchod“).
- Chakra Petch zůstane jen v Soukromí a licencích. Věty malými písmeny, ne verzálkami.

## 2. Materiály a barvy

Barvy z tabulky V2 jsou výchozí paleta Tailwindu, proto jsou tady přeladěné do teplejší palety hry. Přesné odstíny se doladí na snímku pilotu.

| Materiál | Použití | Světlo / základ / stín / obrys |
| :-- | :-- | :-- |
| **Zlato** | hlavní akce: Hrát, Vyrazit, Pokračovat, Rozsvítit | `#ffd75e` `#f2b632` `#b9781a` `#5a3610` |
| **Dub** | Obchod, Vybavení, Nástěnka, police, cedulky | `#8a5a2e` `#6b4222` `#4a2c16` `#2a180c` |
| **Břidlice** | běžná tlačítka, HUD, řádky žebříčku, Nastavení | `#6c6a66` `#4a4946` `#33322f` `#1e1d1b` |
| **Runový kámen** | Kovárna, karty nové úrovně, zámky | `#56606a` `#3a434c` `#262d34`, runa `#7fd4e8` |
| **Bronz** | Souhvězdí (astroláb), plakety, malé knoflíky | `#d49a52` `#a8703a` `#6e4522` `#3a2412` |
| **Pergamen** | Průvodce, lístek nápovědy, úkoly | `#ecdcb0` `#d2bb86` `#9c8250`, inkoust `#3a2a16` |
| **Plátno** | záložky jako prapory | aktivní `#b8352c` `#8a221d`, neaktivní `#6b6258` `#4a443d` |
| **Krev / krystal** | HP / XP a ukazatele postupu | `#e2453a` `#a81f1c` / `#62c8f0` `#2f8fd0` |
| **Mech** | oltáře mazlíčků, „můžeš koupit“ | `#5fa046` `#3d7434` `#26502a` |
| **Noc** | Souhvězdí | `#0e1030` `#1c1f52`, hvězda `#dfe8ff` |

Rarity zůstávají (šedá, zelená, modrá, fialová, zlatá). Fialová jinak jen pro kouzla a fúze.
**Jedna zlatá věc na obrazovku.** Ostatní tlačítka jsou tišší (břidlice, dub, bronz).

## 3. Stavebnice (UI kit)

Třídy jsou nové a žijí vedle starých, dokud se obrazovka nepřevede. Materiál se volí jedním atributem, např. `<button class="k-btn" data-m="gold">`.

| Prvek | Třída | Popis |
| :-- | :-- | :-- |
| Tlačítko | `.k-btn` + `data-m` | rám materiálu, výška 44 nebo 56 px, stisk = posun o 2 px a zmizení spodní hrany; `gold`, `slate`, `oak`, `bronze`, `danger` (tmavě červený kámen) |
| Ikonové tlačítko | `.k-ibtn` | čtverec 44 px, jen ikona 16×16; Zpět, `?`, Nastavení |
| Deska | `.k-slab` + `data-m` | panel z materiálu, okraj 4 px UI |
| Slot | `.k-slot` | vyhloubený čtverec 56 px; prázdný = vyrytá silueta toho, co do něj patří; plný = předmět + rámeček v barvě rarity; odznáček 8×8 vpravo dole (třída, „v běhu“) |
| Záložky | `.k-flags` | dřevěná tyč, na ní prapory; aktivní červený a o 4 px delší, neaktivní zašedlé |
| Ukazatel | `.k-gauge` + `data-k` | koryto v kameni s tekutinou; `hp`, `xp`, `goal` (zelený krystal), číslo uprostřed |
| Stat | `.k-stat` | `[ikona] Název → číslo`, číslo zarovnané vpravo a zlaté |
| Rovnice | `.k-eq` | `[A] + [B] → [C]`, ikony 16×16, fialová šipka |
| Cenovka | `.k-price` | mince nebo materiál 8×8 + číslo; nedostatek = číslo červeně |
| Odznak | `.k-badge` | malý štítek s ikonou a číslem (záruka truhly, denní limit, „nové“ = červená pečeť bez textu) |
| Nápověda | `.k-help` | ikona `?` + lístek pergamenu |
| Posuvník | `.k-slider` | drážka v kameni, zlaté závaží, číslo v procentech |
| Přepínač | `.k-toggle` | dřevěná páka, zapnutá strana zlatá |
| Plaketa | `.k-plaque` | mosazná destička se dvěma hřeby (Mistrovství) |
| Police | `.k-shelf` | dubová police se sloty (mazlíčci, věže, sbírka) |

## 4. Obrazovky

Zápis: rozložení shora dolů, pak **Škrty** = co z obrazovky zmizí.

### Ve hře

**HUD.** Vlevo nahoře kamenná konzole: koryto s krví (HP, číslo `62/120`), těsně pod ním tenký krystalový pásek XP s číslem úrovně na konci. Vpravo nahoře časovač v kamenné schránce a pauza. Pod konzolí řádek ikon s čísly (zlato, zabití, krystaly). Kombo zlatě pod časovačem, od ×50 se leskne víc. Krystal mapy: azurový pruh v železném rámu s drahokamem. Vpravo dole svislá břidlicová lišta věží: rytina věže + cenovka; když na věž máš, rozsvítí se a dostane zelený proužek. Lišty jsou zpola průhledné, ať nezakrývají boj.
Škrty: „Stavitel 0 / 2“ → ikona kladiva + `0/2`. Nápovědy uprostřed obrazovky jen v prvním běhu.

**Nová úroveň.** Hra ztmavne s vinětou, nahoře zlatý nápis a jiskry, pod ním proužek času. Tři karty z runového kamene: vlevo ikona v kamenném čtverci, vpravo název (30 px, zlatě) a pod ním jeden nebo dva řádky `.k-stat`. Nová zbraň má v rohu červenou pečeť. Vybraná karta se rozzáří zlatě a povystoupí o 4 px.
Škrty: žádné věty. `útočíš o 8 % rychleji` → `+8 % Rychlost útoků`. Nová zbraň místo popisu ukáže své hlavní číslo (`Poškození 12`, `Cíle 2`). **Texty karet se skládají z čísel v datech**, takže změny balancu se propíšou samy.

**Pauza.** Dřevěná cedulka s lebkou („Pauza“). Tři kamenné dlaždice: čas, úroveň, zabití (ikona + číslo). Prapory Výbava / Hrdina / Úkoly. Kamenné lůžko se zbraněmi: ikona, název, `1/6` jako dílky. Dole velké zlaté Pokračovat, břidlicové Ovládání, tmavě červené Ukončit.
Škrty: `Fúze s: Kouzelná střela → Řetězová bouře` → `.k-eq` se třemi ikonami (chybějící zbraň je šedá silueta). Pasivky jen ikona + úroveň.

**Výsledky běhu, rituál fúze, představení bosse.** Výsledky: deska s velkým výsledkem, řada ikon s čísly, odměny ve slotech, jedno zlaté tlačítko. Rituál a představení bosse se mění jen písmem a rámy; hlášky bossů zůstávají.

### Menu

**Hlavní menu.** Rozložení zůstává (líbí se), mění se materiály: Hrát zlato, Souhvězdí noční nebe (beze změny), ostatní tlačítka dub a břidlice místo železa se šrouby. Horní lišta: měny jako ikona + číslo, čtyři ikonová tlačítka.
Škrty: štítky „NOVÉ“ → červená pečeť bez textu.

**Příprava.** Denní výzva jako pergamen s pečetí: mapa, dvě ikony úprav s čísly (`+60 %` nepřátel, `+30 %` zkušeností), odměna ve slotu, tlačítko. Řada hrdinů (portrét, jméno, úroveň nebo cenovka). Vybraný hrdina: jméno + startovní zbraň ikonou + dva staty. Kapitola: název se šipkami, tečky map `0/5`. Obtížnost jako pět kamenných knoflíků (lebky podle stupně). Mapy: pohlednice, jméno, ikona zvláštní mechaniky. Dole zlaté Vyrazit.
Škrty: popis denní výzvy (3 věty), popis mapy (2–3 věty) → do `?` a Průvodce; nadpisy „HRDINA“ a „KAMPAŇ“; popis hrdiny větou → dva staty.

**Vybavení – Hrdina.** Dubová zbrojnice. Uprostřed postava hrdiny, kolem ní sloty těla s vyrytými siluetami (přilba, zbroj, zbraň, boty, rukavice, amulet). Pod tím úroveň (dílky do 40) a staty v `.k-stat`. Talenty: řada po dvou kamenných runách na každých 5 úrovní, vybraná svítí.
Škrty: popisky slotů; štítky tříd slovem → ikona 8×8 v rohu předmětu (harfa, hůlka, kladivo, meč, luk…); „Zatím žádné bonusy…“; „VOLBA TALENTU (VYBER JEDEN ZE DVOU)“; popisy talentů → jen číslo.

**Vybavení – Věže.** Nahoře čtyři (Stavitel pět) kamenné výklenky „do běhu“, pod nimi police s vlastněnými věžemi (rámeček = rarita, odznak = v běhu). Zamčené věže jako siluety se zámkem.
Škrty: „Do běhu si bereš 4 věže…“; nadpisy sekcí; „Kapitola I / Odemčeno“ → římská číslice a ikona zámku.

**Vybavení – Mazlíčci.** Dva kruhové kamenné oltáře s mechem (druhý se zámkem a ikonou hrdiny, který ho odemyká). Dubová police: vlastnění s hvězdami, neobjevení jako silueta ve fialové mlze s rámečkem rarity.
Škrty: „Do běhu bereš jednoho mazlíčka…“; u neobjevených `???` a „Padá z Kouzelného košíku“ → ikona košíku. Proutěný vzor pryč.

**Obchod.** Dubový stánek s markýzou. Každá truhla jeden řádek: obrázek, název, pruh šancí v barvách rarit s čísly, cenovka jako tlačítko.
Škrty: celý horní pergamen o tom, odkud je výbava; „Epická nejpozději za 10 truhel“ → odznak s drahokamem v barvě rarity a číslem; „Dnes zbývá 4 / 4“ → odznak se sluncem `4/4`; „Truhla dobrodruha zdarma každý den“ → odznak „zdarma“ + odpočet.

**Kovárna – Kování.** Runový kámen. Tři kamenné oltáře, rýhy z nich vedou do kovadliny, pod ní slot výsledku. Dole inventář; co jde sloučit, svítí. Runy mají stejné rozložení o záložku vedle.
Škrty: oba odstavce o slučování a celý text o runách → `?`. Prázdný stav jen „Vyber 3 předměty“.

**Kovárna – Vylepšení.** Strom zůstává (pergamen se třemi sloupci), uzly jako kamenné runy s `0/30`.
Škrty: úvodní odstavec; „Nové schopnosti“ → ikona hvězdy na dělicí čáře; oznámení o nové hodnosti → pečeť.

**Nástěnka.** Dubová prkna, úkoly jako pergameny s voskovou pečetí (barva = obtížnost). Úkol: ikona, zkrácené zadání, `.k-gauge`, odměny jako ikony s čísly. Svíčky dne jako řada svíček (zapálené = splněno).
Škrty: `Nech důlní vozíky rozdrtit 15 nepřátel` → `[vozík] Rozdrť 15`; „Bonus dne: Věže dávají o 25 % víc poškození“ → `[věž] +25 %`; „nové úkoly za 5 h 2 min“ → ikona hodin + `5:02`; „Jiný úkol“ → ikonové tlačítko se šipkami.

**Síň slávy – Žebříček.** Pódium: 1. místo velká zlatá deska s pohárem, portrétem a čtyřmi ikonami s čísly; 2. a 3. menší stříbrná a bronzová; dál břidlicové řádky. Filtry jako prapory.
Škrty: text o nepřipojeném serveru → ikona přeškrtnutého mraku + Obnovit.

**Síň slávy – Mistrovství.** Mosazné plakety na dubu: ikona, název, zelený krystalový ukazatel, odměna ikonou. Malý bronzový knoflík Nosit; nasazený titul má zlatý rám.
Škrty: úvodní odstavec; „Zatím nemáš titul…“; popis cíle větou → ikona + číslo, kde to jde; „titul Přeživší · 100 zlata“ → ikona stuhy + cenovka.

**Souhvězdí.** Bronzový astroláb s runami po obvodu, uvnitř noční klenba. Rozsvícené hvězdy modrobílé, spojené světelnou linkou; vybraná hvězda má otáčející se kruh (místo dnešního čtverečku). Dole jeden stat hvězdy a zlatý runový kámen Rozsvítit s cenou.
Škrty: „hvězdných bodů“ → ikona hvězdy + číslo; „Jak získat body“ → `?`.

**Průvodce.** Otevřená kniha s koženým hřbetem, záložky kapitol jako barevné kožené proužky. Řádek = ikona ve vyřezávaném rámečku, nadpis, **jedna** krátká věta. Sem se stěhují všechna vysvětlení škrtnutá jinde, proto je to jediná obrazovka, kde je víc textu v pořádku.

**Nastavení.** Kamenná deska. Posuvníky jako drážky se zlatým závažím, jazyk jako dřevěná páka, zvuk a hudba jako přepínače s ikonou. Verze a ovládání na počítači drobně na spodním soklu.
Škrty: „Napsat názor · +60 zlata“ → ikona pera + cenovka; popisky posuvníků → ikony (nota, reproduktor, otřes).

**Co-op, Novinky, malá okna.** Stejná stavebnice; Novinky zůstávají ve formátu hlavní body s ikonou + drobnosti.

## 5. Postup

1. **Pilot:** stavebnice (rámy, písmo, tlačítko, slot, stat, prapory) + jedna obrazovka. Snímky CZ i EN na malém i velkém iPhonu → schválení stylu.
2. **Ve hře:** nová úroveň, pauza, HUD, výsledky.
3. **Menu:** hlavní menu, Příprava, Vybavení, Obchod, Kovárna.
4. **Zbytek:** Nástěnka, Síň slávy, Souhvězdí, Průvodce, Nastavení, co-op, malá okna.
5. **Úklid:** smazat staré styly a nepoužité překlady, `textcheck.js` do rychlých testů, zápis do skillu.

Po každém kroku: snímky všech dotčených obrazovek (CZ i EN, SE i velký iPhone, se skutečnými písmy), `menucheck.js`, `i18n.js static`, `menuperf.js`.

**Souběh s balancem (druhý chat):** grafika mění `krypta.css`, kreslení UI a šablony obrazovek; balanc mění čísla v datech. Riziková místa jsou popisy zbraní, pasivek, talentů a úkolů v `game.js` – tam se popisy nebudou přepisovat ručně, ale skládat z čísel. Větev `grafika` si bere `main` po každém kroku, sloučení na `main` až po schválení.

## 6. Co ukázaly makety (10. 11.)
- Rámy se nekreslí devítidílným rámem, ale **každý prvek dostane vlastní kresbu podle své velikosti** (`KIT.paint`, atribut `data-k`): oštípané rohy a praskliny jsou u každé desky jiné, nic se nenatahuje.
- Karty nové úrovně: kamenná deska s vytesanými runami, bez železných rohů (vypadaly jako staré šrouby). Vybraná karta má zlatý obrys a runy se rozsvítí, fúze má fialový.
- Obchod: šance jako barevná čísla bez opakovaného znaku %, záruka = přesýpací hodiny + drahokam v barvě rarity + číslo, denní limit = slunce + `4/4`. Všech šest truhel se vejde na jednu obrazovku bez posouvání.
- Úzké telefony (375 px): sloupec 360 px se vystředí; na 360 px bude potřeba užší sloupec (kresby se přizpůsobí samy).
- Zatím nenakreslené: talenty hrdiny, HUD, hlavní menu a zbytek obrazovek.
