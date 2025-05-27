# Villa Orders PWA

Villa Orders je Progressive Web App (PWA) pro správu objednávek a inventáře v luxusních vilách. Aplikace umožňuje jednoduché vytváření objednávek, správu položek a generování účtenek.

## Funkce

- Výběr vily z nabídky
- Správa objednávek nápojů, služeb a dárků
- Přidávání vlastních položek
- Aplikace slev
- Generování účtenek
- Sdílení a stahování účtenek ve formátu PDF
- Správa inventáře
- Plná podpora offline režimu (PWA)

## Technologie

- HTML5, CSS3, JavaScript
- Progressive Web App (PWA)
- Responzivní design pro mobilní zařízení
- Animace a moderní UI

## Nasazení

Aplikaci lze nasadit pomocí:

1. **GitHub Pages** - automaticky z tohoto repozitáře
2. **Vercel** - pro rychlé nasazení s CDN
3. **Railway** - pro komplexnější nasazení

## Instalace a lokální spuštění

1. Naklonujte repozitář:
   ```
   git clone https://github.com/Martyparty1988/villa-orders.git
   ```

2. Otevřete soubor `index.html` v prohlížeči nebo použijte lokální server:
   ```
   cd villa-orders
   npx serve
   ```

## Struktura projektu

- `index.html` - Hlavní stránka aplikace
- `inventory.html` - Stránka pro správu inventáře
- `app.js` - Hlavní JavaScript soubor pro objednávky
- `inventory.js` - JavaScript pro správu inventáře
- `style.css` - Styly aplikace
- `manifest.json` - Manifest pro PWA
- `sw.js` - Service Worker pro offline funkcionalitu
- `icon-192.svg` a `icon-512.svg` - Ikony aplikace

## Licence

Tento projekt je licencován pod MIT licencí.
