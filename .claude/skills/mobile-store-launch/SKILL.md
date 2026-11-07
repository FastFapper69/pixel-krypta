---
name: "mobile-store-launch"
description: "Příprava HTML5 hry na vydání v App Store / Google Play a monetizace (obalení, nákupy v aplikaci, truhly, zásady). Použij při plánování vydání Pixel Krypty."
---

# Vydání webové hry do app storů

Komunikuj česky. Pravidla obchodů, ceny a zákony se mění – před každým konkrétním doporučením je ověř webovým vyhledáváním a uveď zdroj. Nejsi právník; u právních otázek to řekni.

## Technická cesta
- Obal existující HTML5 hru nativním kontejnerem (např. Capacitor); hra zůstane jedna kódová základna.
- Ověř: offline běh (assety v balíčku, ne jen z GitHub Pages), safe-area, zvuk po návratu z pozadí, výkon WebView.
- Pro iOS je potřeba Mac/Xcode nebo cloudový build a placený Apple Developer účet; pro Android Google Play Console účet. Ceny a podmínky ověř aktuálně.

## Monetizace
- Digitální obsah (truhly, měna, kosmetika) se v app storech obvykle musí prodávat přes jejich systém nákupů v aplikaci – ověř aktuální pravidla.
- Náhodné odměny za peníze: obchody typicky vyžadují zveřejnění šancí a některé země placené loot boxy omezují. Ověř pro cílové trhy (vč. EU/ČR).
- Preferuj férový model: kosmetika, battle pass, odstranění reklam, přímý nákup místo náhody. Žádná placená výhoda v žebříčcích.
- Herní měnu modeluj se skillem survivors-design-balance (zdroje vs. odtoky).

## Checklist před vydáním
- Zásady ochrany osobních údajů (Supabase účty, přezdívky), mazání účtu na žádost, věkové hodnocení.
- Store stránka: ikona, screenshoty z telefonu, krátké video, popis CZ + EN.
- Analytika (minimální, s ohledem na soukromí): retence D1/D7, délka runu, kde hráči umírají.
- Uzavřený test (TestFlight / interní test Google Play) s kamarády před veřejným vydáním.

## Výstup
Plán v krocích s odhadem náročnosti, co musí udělat uživatel sám (účty, platby, podpisy) a co zvládne Claude.