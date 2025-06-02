# 🗺️ Mapa spaloven v ČR

Responzivní webová aplikace pro zobrazení a správu dat spaloven v České republice. Využívá moderní technologie Next.js, TypeScript a knihovnu Leaflet pro interaktivní mapování.

## ✨ Klíčové funkce

- **📍 Interaktivní mapa** s real-time zobrazením spaloven
- **🔍 Dynamické načítání dat** podle aktuálního viewportu
- **📱 Responzivní design** optimalizovaný pro všechna zařízení
- **🏭 Detailní informace** o spalovnách včetně oficiálních údajů
- **🌓 Podpora tmavého režimu** a moderní UI
- **⚡ Vysoký výkon** s optimalizovaným cachingem
- **🛠️ Debug nástroje** pro vývojáře a testování API

## 🛠️ Technologie

- **[Next.js 14](https://nextjs.org)** - React framework s App Router
- **[TypeScript](https://typescriptlang.org)** - typovaný JavaScript
- **[Leaflet](https://leafletjs.com)** - open-source mapová knihovna  
- **[Tailwind CSS](https://tailwindcss.com)** - utility-first CSS framework
- **[React Leaflet](https://react-leaflet.js.org)** - React komponenty pro Leaflet

## 🚀 Rychlý start

### Požadavky
- Node.js 18+ 
- npm, yarn, pnpm nebo bun

### Instalace

```bash
# Klonování repozitáře
git clone https://github.com/100ky/Leaflet_test.git
cd Leaflet_test

# Instalace závislostí
npm install

# Spuštění vývojového serveru
npm run dev
```

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000)

### Dostupné stránky

- **/** - Hlavní mapa spaloven
- **/test** - Testovací prostředí s debug nástroji

## 📋 Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   └── test/              # Testovací stránka
├── components/            # React komponenty
│   ├── Map/              # Mapové komponenty
│   └── *.tsx             # Debug a UI komponenty
├── contexts/             # React Contexts
├── data/                 # Statická data spaloven
├── hooks/                # Custom React hooks
├── services/             # API služby
├── styles/               # CSS styly
├── types/                # TypeScript definice
└── utils/                # Pomocné utility
```

## Dokumentace

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Leaflet Documentation](https://leafletjs.com/reference.html) - dokumentace knihovny Leaflet

## Licence

Tento projekt je šířen pod licencí MIT. Části využívající knihovnu Leaflet podléhají licenci BSD 2-Clause (viz níže).

Podrobné znění licencí najdete v souboru LICENSE.
