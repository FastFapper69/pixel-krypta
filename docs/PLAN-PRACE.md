# Plán práce podle researche (od 12. 11. 2026)

Zdroj: `docs/RESEARCH-SURVIVORIO.md` (dokument „Survivor.io a šance Pixel Krypty“) a soupis prvních dnů.
Hlavní pravidlo: **nejdřív udržet hráče, teprve potom vydělávat.** Každá fáze má bránu, bez ní se nejde dál.
Stav aktualizuj tady (✅ hotovo, 🔜 další na řadě, ⏳ čeká na data/rozhodnutí, 🔒 zamčeno branou). Kdo: **C** = Claude, **U** = uživatel.

## Hotovo
- ✅ 12m Týden v kryptě (denní odměna za návrat)
- ✅ 12n Nástěnka hned 1. výhrou, Fúze na Kostnici, karta Zítra tě čeká, Týden v kryptě hned po návratu, Dárek na cestu po 2 prohrách
- ✅ 12n tabulka `events` + měření prvních kroků (tutoriál, karty novinek, obrazovky, truhla zdarma, dárky, úkoly)
- ✅ soupis „co nový hráč potká v den 0–7“ (v researchi)

## Fáze 0–1: měření a retence (teď)
| # | Úkol | Kdo | Pracnost | Stav | Poznámka |
|---|---|---|---|---|---|
| 1 | Chyby JS do `events` (`err`), náhrada za Sentry | C | 0,5 dne | 🔜 | `window` error + unhandledrejection, max 5 za relaci, bez duplicit; dotaz v DATA-HRACU |
| 2 | Otázka na rytmus v rychlé otázce po běhu | C | 0,5 dne | 🔜 | „Rytmus: baví / nevím / ruší“, uloží se do `feedback.ctx` |
| 3 | Webová stránka „Jak smazat účet“ | C | 0,5 dne | 🔜 | povinná pro Google Play; GitHub Pages, CZ + EN, odkaz ze zásad soukromí |
| 4 | Materiály pro nábor 30–50 cizích testerů | C → U | 1 den | 🔜 | texty pro Reddit (r/WebGames, r/roguelites, r/incremental_games?), Discord, itch.io; snímky; U je zveřejní |
| 5 | Krátká videa / GIF ze hry (TikTok, Reels, Reddit) | C | 1 den | 🔜 | nahrávka z Playwrightu + ffmpeg, 15–30 s: horda → věže → fúze → boss, na výšku |
| 6 | Zjistit podmínky Poki a CrazyGames | C | 0,5 dne | 🔜 | exkluzivita, SDK, vlastní účty a Supabase, velikost, reklamy, výplaty, jak se přihlásit |
| 7 | Návrh pasivní truhly („postup i když jsem zaseklý“) | C → U | návrh 0,5 dne, stavba 1–2 dny | ⏳ návrh | hlídat těsnou ekonomiku; plní se časem do stropu, vyzvednutí v menu |
| 8 | Návrh 2minutového denního módu | C → U | návrh 0,5 dne, stavba 2–3 dny | ⏳ návrh | jistá odměna, krátký boss nebo aréna, na mobil „na zastávku“ |
| 9 | Tichý test se 2–3 lidmi, kteří hru neznají | U | 1 večer | ⏳ | hrají 10 minut, nikdo neradí, U zapíše, kde se zasekli; C připraví návod |
| 10 | Rozbor `events` + `runs` po 3–5 dnech | C | 0,5 dne | ⏳ data | kde noví hráči končí, kliky na karty, D1; podle toho další úpravy |
| 11 | Novinky po dnech, ne jen po výhrách | C | 1 den | ⏳ data | rozhodnout podle dat z #10 (silní hráči dostanou 5 novinek za večer) |

**Brána k fázi 3:** na 30–50 nových (cizích) hráčích **D1 ≥ 30–35 %, D7 ≥ 7–10 %**, aspoň čtvrtina dojde do kapitoly III.
Při splnění brány se rozmrazí i nové kapitoly (rozhodnutí 11. 11.: až testeři dojdou do kapitoly III).

## Fáze 2: webové portály (souběžně s 1, po #6 a rozhodnutí U)
| # | Úkol | Kdo | Pracnost | Stav |
|---|---|---|---|---|
| 12 | Rozhodnutí: Poki, CrazyGames, nebo obojí | U | – | ⏳ po #6 |
| 13 | Portálová verze hry (přepínač v buildu: bez Supabase účtu nebo s ním, SDK portálu, reklama za odměnu přes portál, pauza při reklamě) | C | 2–4 dny | 🔒 #12 |
| 14 | Stránka hry na portálu (texty, ikona, snímky, video) | C → U | 0,5 dne | 🔒 #12 |
| 15 | itch.io stránka jako výloha a sběr testerů | C → U | 0,5 dne | 🔜 může hned |

## Fáze 3: Android (🔒 brána retence)
| # | Úkol | Kdo | Pracnost |
|---|---|---|---|
| 16 | **Serverová peněženka a inventář** (záznam pohybů, ne slučování; losování truhel na serveru ze stejné tabulky šancí; idempotence) – pozor: `statsMerge` „lepší z obou“ se na měnu nesmí použít | C | 5–10 dní |
| 17 | Capacitor 8 + build Android přes GitHub Actions, soubory hry přibalené v aplikaci (ne z GitHub Pages, kvůli Apple 4.7) | C | 3–4 dny |
| 18 | Vzdálené nastavení (tabulka `config` v Supabase) pro ladění bez nové verze ve storu | C | 1–2 dny |
| 19 | Reklamy za odměnu: AdMob + souhlas GDPR (UMP), ověření na serveru (SSV); jen dobrovolné: oživení 1×/běh, ×2 odměna, truhla navíc, strop 6–8/den | C | 2–4 dny |
| 20 | Nákupy: RevenueCat + webhook do Edge Function, „bez reklam“, startovní balíček 1×, kosmetika; **žádné placené náhodné truhly** (PEGI 16) | C | 3–5 dní |
| 21 | Podklady: věkové hodnocení (IARC), Data safety, texty a snímky do obchodu | C → U | 1 den |
| 22 | Účet Google Play (25 $), ověření totožnosti, uzavřený test 12 testerů × 14 dní | U | 14+ dní |

**Brána k fázi 4:** D30 ≥ 2–3 %, ≥ 20 min hraní denně, 2–3 reklamy na hráče denně, platí ≥ 1–2 %, bez pádů.

## Fáze 4: růst (🔒)
- iOS (99 $/rok, TestFlight, build přes macOS runner), Kryptová cesta (pass 4 týdny, hlavně kosmetika), časové události
- malý test placené reklamy (300–1 000 $) jen při dobré retenci; návratnost ≥ 130 % → vydavatel nebo škálování
- Steam (placená verze), jen pokud se ukáže silný hák (věže + rytmus)

## Úkoly pro uživatele (souhrn)
- teď: tichý test (#9), zveřejnit nábor (#4), rozhodnout o portálu (#12), schválit návrhy #7 a #8
- později: účty v obchodech, živnost a daně, 12 testerů na 14 dní, klíče do GitHub Secrets, účty RevenueCat a AdMob

## Nedělat (platí dál)
Nové kapitoly a akt II před branou, energie, prodej zlata nebo síly, placené náhodné truhly, vynucené reklamy a bannery,
falešné odpočty, trestání za vynechaný den, placená reklama před branou, monetizace před serverovou peněženkou.
