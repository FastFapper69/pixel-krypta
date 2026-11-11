# Pixel Krypta – příběh a plán aktů (schváleno 11. 11. 2026, červená nit I–VII hotová v 11k, páteř a akt II zjednodušené v 11z)

Struktura: **akt = 10 kapitol**, na konci aktu dynamický těžký boss přes celou kapitolu X.
Akt I = kapitoly I–X (všechny hotové, X v 11p). Akt II = XI–XX.
Obtížnost dál podle `DIFF_CIL`: každá 3. kapitola je zeď (IX, XII, XV, XVIII), finále aktu má vlastní špičku.

---

## Páteř příběhu (11z: uživatel odmítl verzi 11y jako moc složitou a nucenou, „keep it simple“)

**Celý příběh ve třech větách:**
1. **Akt I:** hvězda se rozbila, její střepy udělaly ze sedmi vládců tyrany. Sbíráš střepy. **Zvrat:** nosil jsi je Aurelovi, který hvězdu rozbil. Porazíš ho a hvězda je zpátky.
2. **Akt II:** hvězda držela ve spánku **Spáče** pod světem. Teď se budí a jeho noční můry lezou ven. Jdeš ho dolů uspat. **Zvrat:** Spáč není zlý a vstát nechce. Někdo ho budí schválně.
3. **Akt III (jen háček):** kdo ho budí a proč.

**Pravidla (závazná):**
- **Jeden akt = jeden padouch, jeden cíl, jeden zvrat.** Žádné vrstvy, skryté identity hrdiny, vedlejší frakce ani motivy s dvojím významem.
- Hráč musí v každé chvíli umět říct jednou větou, co dělá a proč (akt I: beru střepy tyranům; akt II: jdu uspat Spáče).
- Zápis `STORY` po finále ≤ 240 znaků: co padlo a kam se jde dál. Nová jména jen pro bosse. Hlídá `tests/tools/pribeh.js`.
- Kapitoly nemusí nic odhalovat, stačí, že na sebe místy navazují (most). Zvrat zazní v boji, jednou větou.

---

## AKT I – „Padlá hvězda“

### Jádro příběhu (co hráč pochopí až v kapitole IX)
Nad světem visela **Hvězda**. Její strážce **Aurel** ji roztříštil, aby si z jejího světla ukoval vlastní slunce. Střepy popadaly do říší a každý z někoho udělal tyrana. **Střep jde vzít jen poraženému**, proto Aurel potřeboval někoho, kdo tyrany porazí za něj (říká to Herold).
**Prolog (11y/11z):** rána rozbité hvězdy probudila hrdinu v kryptě; střepy drží tyrani, jde si pro ně.
Hrdina sbírá střepy a **netuší, že je nosí Aurelovi.** Po Nicotě (VII) se mu všech sedm vytrhne z rukou a Aurel z nich ukuje slunce; nosí je v koruně (2. fáze boje v X).

**Červená nit:** oko vyryté ve střepu (I), hádanka „Kdo sbírá střepy, ale ne pro sebe?“ (II), otisk oka v popelu (III), „Nes je dál. On už čeká.“ (IV), oko na roztržené obloze (V), místa dopadu střepů tvoří oko (VI), „Neneseš je sobě…“ a střepy odlétají (VII). Nad každým finále se při mostu otevře zlaté oko (`bridgeEye`). Kronika ve Sbírce má prolog a zápis každého finále. Astra v textech nevystupuje (je hratelná).

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
**Závěrečný text aktu I (`STORY.korunace`, 11z):** hvězda se vrátí na oblohu a je zase noc. Aurel: „Hlupáku. Ta hvězda držela ve spánku JEHO.“ Pod světem se něco pohne. Karta konce aktu: z Aurelova prvního rytíře opadlo zlato = Paladin.

---

## AKT II – „Spáč“ (kapitoly XI–XX, jednoduchá verze 11z)

**Příběh:** hvězda držela ve spánku Spáče pod světem. Byla rozbitá moc dlouho, Spáč se budí a jeho noční můry lezou do světa. Hrdina sestupuje snem dolů, aby ho znovu uspal. Každá kapitola je o vrstvu hlouběji a divnější (čas, gravitace, proměny mapy).
**Zvrat (zazní až ve finále XX):** Spáč není zlý a vstát nechce. Někdo ho budí schválně. Kdo, to je akt III.

| Kap. | Název | Téma a mechanika | Most dál |
|---|---|---|---|
| XI | Mělký sen | pastelová snová krajina, létající nábytek; mapa se na takt přeskládá (mrknutí) | sen ztmavne |
| XII | Říše strachu (zeď) | tma, strachy jsou vidět, jen když se na ně díváš | strach rozbije hodiny |
| XIII | Rozbité hodiny | zóny zpomaleného a přetočeného času; boss si vrací zdraví, když ho netrefíš do rytmu | čas stéká ke kořenům |
| XIV | Kořeny světa | kořeny, svítící houby; kořeny rostou a uzavírají mapu | kořeny omotávají stroj |
| XV | Hodinový stroj (zeď) | město z ozubených kol; podlahy se točí, automaty | stroj se rozbije, sen se rozbouří |
| XVI | Bouřné výšiny | Spáč se převaluje; blesky na takt, vítr | blesk prorazí dno moře |
| XVII | Potopené vzpomínky | zatopené ruiny; bubliny vzduchu | v ruinách je knihovna |
| XVIII | Knihovna osudu (zeď) | boss ti píše kletby do běhu | poslední stránka vede dovnitř |
| XIX | Tělo spáče | uvnitř obra; **tlukot srdce řídí hudbu i vlny** | srdce vede k oku |
| XX | Spáčovo oko | finále aktu: boss Spáč | akt III |

**Boss aktu II – Spáč:** oko, které se během boje otevírá. Sní kopie bossů z aktu I. Poslední fáze: stín tvého hrdiny s tvojí výbavou.
**Konec aktu II:** Spáč znovu usíná a stihne říct: „Já vstát nechtěl. Někdo mě budí.“ Nad světem zhasne hvězda podruhé.

**Hrdinové aktu II:** 3 noví (XI, XV, XX), jména se vymyslí s kapitolou. Probuzení hrdinů z aktu I: Spáčovy sny v nich budí skrytou sílu.

## AKT III (jen háček)
Někdo Spáče budí schválně. Kdo a proč, se vymyslí, až na akt III dojde; platí pravidla páteře (jeden padouch, jeden cíl, jeden zvrat).

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
