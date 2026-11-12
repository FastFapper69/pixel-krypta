# Pixel Krypta – zásady ochrany osobních údajů

Platné od 9. 11. 2026. Ve hře: Nastavení → Soukromí a licence (zkrácená verze stejného obsahu).

> **Před vydáním v obchodech doplnit:** jméno nebo firmu provozovatele (správce údajů) a kontaktní e-mail. Obchody i GDPR to vyžadují; teď je kontakt jen přes formulář ve hře.

## Kdo údaje zpracovává
Autor hry Pixel Krypta (správce). Kontakt: formulář „Napsat názor na hru“ v Nastavení.

## Co ukládáme a proč
| Údaj | Kde | Proč | Jak dlouho |
|---|---|---|---|
| Postup a nastavení | ve tvém zařízení (localStorage) | aby hra pokračovala | dokud je nesmažeš |
| Anonymní účet (náhodné ID) | Supabase, EU (Irsko) | přihlášení bez e-mailu | do smazání |
| Přezdívka, otisk PINu (bcrypt) | Supabase | žebříček, obnova postupu na jiném zařízení | do smazání |
| Postup a statistiky | Supabase | synchronizace, žebříček | do smazání |
| Souhrn běhu (mapa, hrdina, čas, zabití, zbraně, verze, jazyk) | Supabase | ladění obtížnosti a ekonomiky | do smazání |
| Záznam prvních kroků (které obrazovky a kroky návodu hráč viděl, vyzvednuté odměny, verze, jazyk) | Supabase | zjistit, kde noví hráči končí | do smazání |
| Zpětná vazba (text, hodnocení, typ zařízení a prohlížeče) | Supabase | oprava chyb | do smazání |
| Nahlášení hráčů | Supabase | moderace přezdívek | do vyřízení / smazání |

Neukládáme jméno, e-mail, telefon ani polohu. Žádné reklamy, žádné sledovací nástroje, údaje neprodáváme.
Právní základ: plnění smlouvy (hraní, synchronizace, žebříček) a oprávněný zájem (ladění hry, moderace).

## Kdo údaje vidí
- Ostatní hráči: přezdívku, titul, profilový obrázek, statistiky v žebříčku a počet pokořených map a hrdinů. Tvoje uložená hra (výbava, měna, nastavení) je soukromá – čte ji jen tvoje zařízení.
- Autor hry: vše výše kvůli ladění, opravám a moderaci.
- Zpracovatelé: Supabase (databáze, EU), GitHub Pages (hosting – vidí IP adresu jako každý web), Google STUN server (jen při hře s kamarádem, kvůli navázání spojení – vidí IP adresu).
- Písma a knihovny hra načítá ze svého serveru, ne od Googlu ani z CDN.

## Tvoje práva
Přístup, oprava, výmaz, omezení, přenositelnost a námitka. **Smazat všechna data** jde přímo ve hře (Nastavení → Soukromí a licence → Smazat moje data): smaže účet, přezdívku, postup, statistiky, běhy, zpětnou vazbu i nahlášení na serveru a postup v zařízení. Ostatní žádosti přes formulář ve hře. Stížnost: Úřad pro ochranu osobních údajů (uoou.gov.cz) nebo úřad tvé země.

## Pravidla pro přezdívky
Urážlivé, vulgární, nenávistné a sexuální přezdívky nejsou povolené (filtr ve hře i na serveru). Hráče jde v žebříčku nahlásit nebo skrýt; nahlášení autor prověří do 24 hodin a nevhodný profil skryje (`profiles.hidden`). Nahlášení najdeš v Supabase v tabulce `reports` (`done=false`).

---

# Pixel Krypta – Privacy policy (English)
Same content as above: progress on your device; on Supabase (EU – Ireland) an anonymous account, nickname and PIN hash, progress and stats, run summaries, feedback with device/browser type and player reports; no name, e-mail or location; no ads or tracking; other players see your nickname, title, avatar, stats and progress in the leaderboard; processors Supabase, GitHub Pages, Google STUN (co-op only). Delete everything in Settings → Privacy and licences → Delete my data; other requests via Send feedback; complaints to your data protection authority. Offensive nicknames are not allowed; reports are reviewed within 24 hours.
