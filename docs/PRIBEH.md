# Pixel Krypta – příběh a plán aktů (schváleno 11. 11. 2026, červená nit I–VII hotová v 11k, páteř přes akty a akt II přepsané v 11y)

Struktura: **akt = 10 kapitol**, na konci aktu dynamický těžký boss přes celou kapitolu X.
Akt I = kapitoly I–X (všechny hotové, X v 11p). Akt II = XI–XX.
Obtížnost dál podle `DIFF_CIL`: každá 3. kapitola je zeď (IX, XII, XV, XVIII), finále aktu má vlastní špičku.

---

## Páteř příběhu přes všechny akty (11y, zadání uživatele 11. 11.: ne random, ne obsáhlé, zvraty a drama, počítat s dalšími akty)

**Tajemství, které se odkrývá po vrstvách:** pod světem spí **Spáč**. Svět a všechno v něm existuje jen, dokud spí. **Hvězda** nebyla dar ani slunce, ale **zámek**: ukolébavka, kterou ukovali **Bdělí**, aby se nikdy nevzbudil. A **hrdina** není člověk: je to Spáčova vůle probudit se, kterou z něj Bdělí vyřízli a pohřbili v kryptě. Jiskra z rozbité hvězdy ho vzbudila.

Každý akt odhalí jednu vrstvu a **obrátí smysl toho předchozího**:
| Akt | Co hráč sbírá | Co si myslí | Zvrat v půlce | Zvrat na konci | Otázka, která táhne dál |
|---|---|---|---|---|---|
| I Padlá hvězda | 7 střepů | zastavuju tyrany | IX: střepy jsem nosil Aurelovi | X: Aurelovi to poradil hlas ze snu, hvězda hlídala něčí spánek | kdo spí pod světem a proč mu odpovídá moje jiskra? |
| II Spáč | 9 tónů ukolébavky | uspím netvora a zachráním svět | XV: Spáč je vězeň, hvězdu ukovali Bdělí a mě pohřbili oni | XVIII–XX: jsem jeho kus; desátý tón je moje jiskra; zaváhám a Spáč se vzbudí | svět bledne od okrajů a na obloze se otevírají dveře |
| III Bdělí (jen háček) | zatím neurčeno | bráním svět před Bdělými | neurčeno | neurčeno (otevřené: kdo sní Bdělé?) | – |

**Motivy, které se vracejí a mění význam (nic nového nevymýšlet, používat tyhle):**
- **Zlaté oko:** v aktu I vypadá jako Aurelovo. Ve skutečnosti je to pootevřené oko Spáče (proto hádanka Sfingy „Co se dívá, i když spí?“ a finále aktu II „Spáčovo oko“).
- **Jiskra v hrudi = tlukot = rytmus hry:** hrdina bojuje do rytmu, protože jeho jiskra tluče stejně jako Spáčovo srdce (odhalení v XIX).
- **Hlas ze snu:** poradil Aurelovi rozbít hvězdu; v aktu II mluví k hrdinovi a pomáhá mu. Hráč mu nemá věřit, a přece nelže.
- **„Ty ho vzbudíš.“** (Královna, IV): hráč si myslí, že jde o Aurela; platí to až na konci aktu II.
- **Nicota** (VII: „Byl jsem tu před první hvězdou.“) byla Spáčova noční můra, první, která unikla.

**Pravidla psaní (hlídá `tests/tools/pribeh.js`):** zápis `STORY` nejvýš 240 znaků a 3–4 krátké věty: co padlo, jedna nová informace, kam to táhne dál. Jedna kapitola = jedna nová informace, ne víc. Zvrat má zaznít **v boji** (hláška bosse, 2. fáze), text po finále ho jen potvrdí. Žádné nové jméno bez důvodu. Nový akt musí mít řádek v tabulce výše dřív, než se začne stavět.

---

## AKT I – „Padlá hvězda“

### Jádro příběhu (co hráč pochopí až v kapitole IX)
Nad světem visela **Hvězda**. Její strážce **Aurel** ji roztříštil, protože mu to poradil hlas ze snu, a z jejího světla si chtěl ukout vlastní slunce.
Velké střepy popadaly do říší a každý z někoho udělal tyrana (kdo drží střep, slyší Spáčovy sny). **Střep jde vzít jen poraženému**, proto Aurel potřeboval někoho, kdo tyrany porazí za něj (říká to Herold v úvodní kartě).
**Prolog (11y):** jiskra z rozbité hvězdy spadla do krypty, uvízla hrdinovi v hrudi a probudila ho. Neví, kdo je, ani kdo ho pohřbil (odpověď až v aktu II). Jiskra ho táhne ke střepům.
Hrdina sbírá střepy. **Netuší, že je nosí Aurelovi.** Po Nicotě (VII) se mu všech sedm vytrhne z rukou a vzlétne; Aurel z nich ve Hvězdné kovárně ukuje slunce a nosí je v koruně (2. fáze boje v X).

**Červená nit (11k, texty zkrácené a upravené v 11y):** oko vyryté ve střepu (I), hádanka „Co se dívá, i když spí?“ (II), otisk oka v popelu (III), „Ty ho vzbudíš.“ (IV), oko na roztržené obloze (V), místa dopadu střepů tvoří oko (VI), „Neneseš je sobě…“ a střepy odlétají (VII). Nad každým finále se při mostu otevře zlaté oko (`bridgeEye`). Kronika ve Sbírce (`#cxStory`) má prolog a zápis každého finále. Astra v textech nevystupuje (je to hratelná hrdinka).

### Kapitoly I–VII (hotové) – jak na sebe navazují
| Kap. | Říše | Co se stane | Most dál |
|---|---|---|---|
| I | Říše mrtvých | Z Morvanovy lebky vypadne žhnoucí střep | ukazuje na jih → poušť |
| II | Písečná říše | Sfinga padá, Brána slunce se propadne | pod ní žár hor |
| III | Hlubiny | Srdce hory vychladne | popel ztuhne ve sníh |
| IV | Ledová říše | Ledový trůn praskne | voda teče k moři |
| V | Prokleté pobřeží | Kraken klesne, obloha se roztrhne | padají hvězdy |
| VI | Nebeská hvězdárna | Zatmění se rozpadne | za měsícem je Prázdnota |
| VII | Prázdnota | Nicota se zhroutí, poslední střep se rozzáří | rodí se nové slunce |

### Kapitola VIII – Úsvit (`c8`, hrdinka Réva) – HOTOVO 11l
**Příběh:** svět se po Nicotě rodí znovu. Pod novým sluncem všechno roste až moc rychle: zlaté louky, obří květy, trny přes trosky. Světlo, které v kapitole VII chránilo, tady pálí.
**Pocit:** po černé Prázdnotě konečně barvy. Zlatá, teplá zelená a bílá. Hudba „ranní hymna“ (vlastní styl `dawn`, durová/lydická, jasná arpeggia, teplé plochy).
**Nové mechaniky (postupně):**
- **Růst:** na takt dopadají semena a vyrostou z nich trnité keře, které zpomalují a zavírají cesty (proti stylu „utíkej v kruhu“). Útoky a věže je spálí.
- **Stín hodin:** obří obelisk vrhá rotující stín. Ve stínu je bezpečí, na světle hrdinu v poledne pálí a nepřátelé sílí. Je to obrácená lucerna ze VII: tam bylo potřeba světlo, tady stín.
- **Květy:** na první dobu taktu rozkvetou a léčí každého, kdo u nich stojí, i nepřátele. Je to taktické rozhodnutí.

| Mapa | Rozvržení | Mechanika | Boss |
|---|---|---|---|
| Rozbřesk | open | Růst | Matka trnů (rozsévá keře) |
| Zlatá pole | paths, pšenice, strašáci | žádná | Žnec (kosa přes pole v pruzích na takt) |
| Sluneční hodiny | plaza s obeliskem | Stín hodin | Gnómon, živé hodiny (sám točí stínem) |
| Zahrada světla | open, obří květy | Květy | Medová královna (roje včel) |
| **Kolébka slunce** (finále) | arena | Růst + Stín | **Fénix úsvitu**: po smrti se změní ve vejce a hráč ho musí rozbít do 4 taktů, jinak Fénix vstane s plným zdravím |

**Nepřátelé (4):** Slunečnice (střílí semena), Zlatý chroust (výpad), Světluška (rychlá, letí), Strašák (tank, ve slunci se uzdravuje).
**Proč je Fénix nepřítel:** je to první tvor nového slunce a hlídá jeho kolébku (služebník oka). Říká to popis finále, Průvodce i hláška „Hlídám kolébku.“ V půlce souboje: „Slunce nad kolébkou se na tebe dívá.“
**Hrdinka Réva** (druidka): zbraň Trnité šlahouny, na první dobu taktu přikovají nepřátele k zemi.
**Věže:** Slunečnice (paprsek), Úl (roj včel).
**Set** Roucho úsvitu, **legendárka** Fénixovo pero (jednou za běh vstaneš z popela).
**Hledaný:** Zlatý jelen.
**Most:** Fénix shoří a už nevstane. Slunce nad zahradou se otevře jako oko a všechno, na co pohlédne, se mění ve zlato.

### Kapitola IX – Zlatá říše (`c9`, ZEĎ, bez hrdiny, mazlíček Straka) – HOTOVO 11n
**Příběh:** město, na které slunce pohlédlo jako první. Obyvatelé jsou zlaté sochy, ulice dlážděné mincemi, všude poklady a chamtivost. Vládne tu **Herold**, Aurelův služebník. **Tady hráč poprvé uslyší Aurelovo jméno** a dojde mu, že střepy celou dobu nosil jemu.
**Pocit:** zlato, sytě rudá, černá. Hudba „dvorní pochod“ (pompézní žestě, cembalo, slavnostní bubny).
**Nové mechaniky:**
- **Pohled slunce:** po mapě kluže kužel světla (oko). Kdo v něm zůstane, pomalu zezlátne (zpomalení, pak krátké zkamenění). Schovat se jde za sloupy. Nepřátelé v něm zezlátnou taky: jsou odolnější, ale nechají víc zlata.
- **Chamtivost:** po mapě leží hromádky pokladu. Sebrat je dá sílu v běhu (ne moc zlata, ekonomika zůstává těsná), ale každá probudí strážce nebo zrychlí vlny. Riziko proti odměně.
- **Sochy:** zlaté sochy na každý 4. takt ožívají. Dají se rozbít předem.

| Mapa | Mechanika | Boss |
|---|---|---|
| Pozlacené předměstí | Pohled slunce | Lichvář (krade ti zlato z běhu, když zasáhne) |
| Mincovna | lisy dupou na takt v pruzích | Mincmistr |
| Síň soch | Sochy | Zlatý rytíř |
| Pokladnice | Chamtivost | Drak Zlatohlav (leží na pokladu, čím víc jsi sebral, tím je vzteklejší) |
| **Zlatý dvůr** (finále) | Pohled + Sochy | **Herold slunce**: „Střep jde vzít jen poraženému. Díky za špinavou práci.“ Pod 50 % zavolá Aurelův pohled přes celou arénu |

**Odhalení Aurela musí zaznít silně (oprava z kontroly 11. 11.):** jméno nezazní poprvé v textu po výhře, ale **přímo v boji**. Úvodní karta Herolda: „Střep jde vzít jen poraženému. Díky za špinavou práci.“ Při přechodu do 2. fáze (`ph2.txt` + zpomalení na 1 takt + zlatý záblesk, oko z `bridgeEye` se otevře naplno uprostřed arény): **„Sedm střepů jsi nesl Aurelovi. Králi slunce. Děkujeme.“** Text po finále (`STORY.dvur`): „Herold padl a jeho poslední slova zněla v celém městě: Aurel. Strážce hvězdy, který ji sám rozbil. Ze dvora vede schodiště ze světla přímo do slunce.“ Od IX se Aurelovo jméno objevuje i v hláškách bossů.

**Nepřátelé (4):** Pozlacený (pomalý obrněný grunt, praská), Výběrčí (rychlý, krade mince), Alchymista (střílí, mění zem ve zlato), **Mimik** (truhla, která kouše; vtip na naše truhly).
**Bez nového hrdiny** (zeď = čas na grind, ne na nákupy). Místo hrdiny **mazlíček Straka**: krade zlaté krovky a mince z nepřátel, na zezlátlé nepřátele útočí silněji; vlastní truhla za zlato a Úlomky jako ostatní mazlíčci.
**Věže:** Zrcadlo (odráží pohled slunce jako paprsek do nepřátel), Lis.
**Set** Šat zlatého dvora, **legendárka** Midasova rukavice.
**Most:** Herold padá. Z dvora vede schodiště ze světla přímo do slunce.

### Kapitola X – Korunované slunce (`c10`, finále aktu, hrdina Paladin zdarma za Aurela) – HOTOVO 11p
**Příběh:** uvnitř slunce, které Aurel ukoval ze střepů. Každá síň je postavená z jednoho ukradeného střepu, takže kapitola **připomíná celý akt**, jen spálený a pozlacený.
**Pocit:** bílé světlo, zlato, rudé jádro. Hudba „korunovace“ (sbor, varhany, banger kit naplno).
**Nové mechaniky:** hroutící se schody (plošiny mizí na takt), ozvěny starých bossů jako minibossové, údery kladiva v mřížce na takt.

| Mapa | Mechanika | Boss |
|---|---|---|
| Schody světla | úzké cesty, schody se hroutí na takt | Strážce schodů |
| Síň trofejí | sochy Morvana, Sfingy, Titána, Královny, Krakena, Zatmění a Nicoty ožívají jako minibossové (ochutnávka odložené Síně bossů) | Kurátor |
| Hvězdná kovárna | kladivo dopadá v mřížce na takt | Aurelův kovář |
| Dvůr věčnosti | elitní mix nepřátel I–IX | Den a Noc (dva bossové najednou, musí padnout do 2 taktů od sebe) |
| **Korunované slunce** (finále aktu) | aréna se mění podle fáze | **Aurel** |

**Boss aktu – Aurel, Korunované slunce (4 fáze):**
1. **Král (100–70 %):** zlatý král s korunou ze sedmi střepů. Seky mečem na takt, volá královskou gardu.
2. **Sedm střepů (70–40 %):** koruna se roztříští a střepy krouží kolem arény. Každé 2 takty jeden z nich použije mechaniku své kapitoly: kostěné ruce ze země (I), písečná bouře (II), praskliny s magmatem (III), mrazivé runy (IV), chapadla (V), padající hvězdy (VI), trhliny (VII). Střepy jdou rozbít: rozbitý střep vypne svou mechaniku a ubere Aurelovi zdraví. Pořadí je v každém běhu jiné.
3. **Slunce (40–10 %):** Aurel splyne se sluncem přes celou obrazovku. Světelný kruh se zmenšuje a bezpečí je jen ve stínu tvých věží (tower defense má ve finále smysl). Spirály střel v rytmu, hudba na maximu.
4. **Poslední jiskra (10–0 %):** slunce zhasne a jediné světlo je hrdina. Aurelovo oko ho honí 20 s. Poslední úder musí padnout na první dobu taktu (zpomalení a záblesk).

**Úvodní karta:** speciální pro finále aktu. Hudba utichne, obrazovka praskne, pak drop.
**Odměna:** **hrdina Paladin zdarma** (trofej za celý akt, ne za zlato; jeho zbraň má fúzi se základní zbraní), titul a profilový obrázek aktu, legendárka Koruna sedmi střepů, otevření aktu II. **Návrh:** odložená Síň bossů se odemkne tady (dává smysl hned po Síni trofejí).
**Závěrečný text aktu I (`STORY.korunace`, od 11y):** hvězda se vrátí na oblohu a je zase noc. Aurel: „Hlupáku. Rozbít ji mi poradil hlas ze snu. Hlídala JEHO spánek.“ Pod světem se něco pohne a jiskra v hrdinově hrudi tomu odpoví. (Prasklou pečeť vysvětluje až úvod aktu II.) Karta konce aktu: z Aurelova prvního rytíře opadlo zlato = Paladin.

---

## AKT II – „Spáč“ (kapitoly XI–XX, plán přepsaný v 11y)

**Výchozí stav:** hvězda zase svítí, ale pečeť zůstala prasklá. Lidé usínají a nebudí se, do světa prosakují noční můry. Jiskra v hrdinově hrudi tluče do rytmu něčeho pod světem.
**Cíl hrdiny:** sestoupit snem dolů a zacelit pečeť **ukolébavkou**. Její tóny pohltily noční můry: finále každé kapitoly XI–XIX vydá jeden **tón** (místo střepů; v Kronice a na kartě po finále přibývá nota). Desátý tón chybí.
**Hlas ze snu** hrdinu provází (krátké hlášky při mostu a po finále). Je to Spáč. Nelže, jen neříká všechno.

| Kap. | Název | Téma a mechanika | Co se hráč dozví (jedna věc) | Most dál |
|---|---|---|---|---|
| XI | Mělký sen | pastelová snová krajina, létající nábytek; mapa se na takt přeskládá (mrknutí) | lidé nespí sami od sebe; hlas ze snu promluví poprvé: „Pojď níž. Ukážu ti, kdo tě pohřbil.“ | sen ztmavne |
| XII | Říše strachu (zeď) | tma, strachy jsou vidět, jen když se na ně díváš | noční můry nosí tváře bossů z aktu I; Nicota byla první, která unikla | strach rozbije hodiny |
| XIII | Rozbité hodiny | zóny zpomaleného a přetočeného času; boss si vrací zdraví, když ho netrefíš do rytmu | v přetočeném čase je vidět, jak hvězdu někdo **kuje**. Nevznikla sama | čas stéká ke kořenům |
| XIV | Kořeny světa | kořeny, svítící houby; kořeny rostou a uzavírají mapu | kořeny světa nerostou ze země, ale z něj. Svět stojí na Spáči | kořeny omotávají stroj |
| XV | Hodinový stroj (zeď) | město z ozubených kol; podlahy se točí, automaty | **zvrat:** stroj postavili **Bdělí**, aby Spáč nikdy nevstal. Hvězda je zámek. Boss Žalářník: „Ty tu nemáš být. Tebe jsme pohřbili.“ | rozbitý stroj: Spáč se začne převalovat |
| XVI | Bouřné výšiny | Spáč se převaluje a sen se bouří; blesky na takt, vítr | čas běží: nahoře ve světě začínají blednout okraje (první je Hřbitov z kapitoly I) | blesk prorazí dno moře |
| XVII | Potopené vzpomínky | ruiny světa, který se zdál před tím naším; bubliny vzduchu | minulý svět skončil, když se Spáč naposled vzbudil. Probuzení = konec všeho | v ruinách je knihovna |
| XVIII | Knihovna osudu (zeď) | každý život je kniha; boss ti píše kletby do běhu | **zvrat:** hrdinova kniha je prázdná, jen na hřbetu má Spáčovo jméno. Hrdina je jeho vůle se probudit, kterou Bdělí vyřízli a pohřbili | poslední stránka vede dovnitř |
| XIX | Tělo spáče | uvnitř obra, žíly; **tlukot srdce řídí hudbu i vlny** | rytmus, do kterého celou hru bojuješ, je jeho srdce. Devět tónů máš; desátý je tvoje jiskra | srdce vede k oku |
| XX | Spáčovo oko | finále aktu: boss Spáč | viz níže | akt III |

**Boss aktu II – Spáč:** oko, které se během boje otevírá. Sní kopie bossů z aktu I (noční můry). **Poslední fáze: stín tvého hrdiny s tvojí výbavou a zbraněmi** („Jsi já.“).
**Konec aktu II (jiný zvrat než v aktu I, hrdina tentokrát není oklamaný, rozhoduje sám):** hrdina zahraje devět tónů a oko se zavírá. Desátý tón je jeho jiskra: dohrát ukolébavku znamená vrátit se navždy do krypty. Zaváhá. Spáč: „Nechci nic zničit. Chci jen jednou vidět ráno.“ Oko se otevře. Přijde první opravdové ráno, okraje světa začnou blednout a tam, kde visela hvězda, se otevřou dveře. **Bdělí přicházejí.**

**Hrdinové aktu II (návrh jmen, projdou `jmenahrdinu.js`):** XI Náměsíčná (usnula a ve snu chodí dál), XV Strojník (automat, který utekl Žalářníkovi), XX Stín (tvůj stín z finále se k tobě přidá). **Probuzení** hrdinů z aktu I dává příběhově smysl: Spáčovy sny v nich budí skrytou sílu.

## AKT III – „Bdělí“ (jen háček, nestavět, dokud nemá řádek v tabulce páteře)
Spáč je vzhůru a svět bledne od okrajů (říše z aktu I se vracejí vybledlé = nové mapy ze starých kulis). Bdělí přišli Spáče znovu uspat a vyříznutý kus, tedy hrdinu, tentokrát zničit. Spáč je poprvé na hrdinově straně. Otevřené otázky pro zvraty: proč se ho Bdělí bojí; kdo sní Bdělé; jde svět zachránit, aniž by někdo zůstal vězněm?

---

## Co to znamená pro systémy (návrh)
- **Akt v Přípravě:** přepínač Akt I / Akt II nad seznamem kapitol (ať jich není 20 pod sebou).
- **Kronika:** po každém finále se odemkne stránka příběhu (text `STORY` + pohlednice), dá se kdykoli znovu přečíst. Přirozeně vysvětlí návaznost.
- **Mechaniky pořád přibývají:** 2–3 nové v každé kapitole, finále aktu všechny spojí.
- **Hrdinové:** viz „Hrdinové, zbraně a odměny kapitol“ níže (rozhodnuto 11. 11.). Jména projdou `jmenahrdinu.js`.
- **Pořadí práce:** VIII → IX → X (Aurel jako samostatný větší balík) → kronika a přepínač aktu → akt II.


## Kontrola příběhu (11. 11. 2026) – co se opravilo
- Rozpor „hvězda rozbitá dávno“ × „hvězdy padají až po Krakenovi“: velké střepy dávno (I–V), prasklé jádro na obloze do VI (hotovo v 11k).
- Aurelovo jméno: odhalení přímo v boji s Heroldem v IX (výše, závazné pro IX).
- Proč je Fénix nepřítel: první tvor nového slunce, hlídá kolébku (hotovo ve VIII).
- Proč se Spáč budí, když je hvězda celá: pečeť zůstala prasklá (závěrečný text X výše, úvod aktu II).

## Hrdinové, zbraně a odměny kapitol (ROZHODNUTO uživatelem 11. 11. 2026, závazné)
**Méně hrdinů, ale každý je událost; místo nových hrdinů se prohlubují ti stávající.** Důvod: hrdina je hluboká investice (40 úrovní, talenty, Prestiž), při ~25 hrdinech by se tříštila a nový hrdina by nic neznamenal.
- **Akt I:** VIII Réva (hotovo, 11l), **IX bez hrdiny** (zeď), **X Paladin zdarma** jako odměna za poražení Aurela.
- **Akt II: jen 3 hrdinové** – v XI (uvítání v aktu), v XV (kapitola se 6dílným setem), ve XX (odměna za Spáče). Na konci aktu II tedy 17 hrdinů, ne 25.
- **Probuzení (akt II):** každý hrdina z aktu I dostane v některé kapitole aktu II úkol a po splnění Probuzení = druhá ultimátka nebo silnější podoba startovní zbraně (ne nová zbraň do nabídky). Stojí zlato a Esenci, takže nahradí výdaje za nové hrdiny (ekonomika nesmí přijít o hlavní žrout zlata). Příběh: Spáčovy sny probouzí skrytou sílu hrdinů. Rozpis, který hrdina se probouzí ve které kapitole, se udělá s aktem II.
- **Kapitoly bez hrdiny dostanou nového mazlíčka** (s vlastním kouskem do truhly mazlíčků), k tomu jako vždy set, 1–2 věže, legendárka, hledaný.
- **Zbraně:** základních zbraní celkem ~20, nové přibývají hlavně jako **fúze** (cíl, který hráč skládá). Každá nová zbraň musí mít aspoň jednu fúzi se základní zbraní (pečetě 11m to hlídají). Zbraně hrdinů zůstávají jen pro ně do úrovně hrdiny 8.
- **Ekonomika:** kde ubude cena hrdiny, musí být jiný výdaj (Probuzení, truhla mazlíčků). Ověřit `lootcurve.js` a `EKONOMIKA.md` při každé kapitole bez hrdiny.
