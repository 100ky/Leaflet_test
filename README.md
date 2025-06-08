# 🗺️ České spalovny - Interaktivní mapa

Profesionální webová aplikace pro zobrazení a správu dat spaloven odpadů v České republice. Aplikace využívá moderní technologie Next.js 15, TypeScript a knihovnu Leaflet pro poskytování intuitivního mapového rozhraní.

## ✨ Klíčové funkce

- **📍 Interaktivní mapa** s real-time zobrazením spaloven a jejich stavů
- **🔍 Pokročilé filtrování** podle stavu, kapacity a regionu spaloven
- **📱 Responzivní design** optimalizovaný pro desktop, tablet i mobil
- **🏭 Detailní informace** o spalovnách včetně technických parametrů
- **🌐 Moderní navigace** s centralizovaným menu a breadcrumbs
- **⚡ Vysoký výkon** s optimalizovaným cachingem a lazy loadingem
- **🛠️ Debug nástroje** pro vývojáře a monitoring API
- **🔒 Produkčně připravené** s kompletním error handlingem

## 🛠️ Technologie

### Frontend
- **[Next.js 15](https://nextjs.org)** - React framework s App Router a Turbopack
- **[React 19](https://react.dev)** - UI knihovna s nejnovějšími funkcemi
- **[TypeScript 5+](https://typescriptlang.org)** - typovaný JavaScript pro bezpečnost
- **[Leaflet 1.9](https://leafletjs.com)** - open-source mapová knihovna  
- **[React Leaflet 5](https://react-leaflet.js.org)** - React komponenty pro Leaflet
- **[Tailwind CSS 3](https://tailwindcss.com)** - utility-first CSS framework

### Backend & API
- **Next.js API Routes** - serverless API endpoints
- **TypeScript** - typované API rozhraní
- **Edge Runtime** - optimalizovaný běhový čas

### Vývojové nástroje
- **ESLint** - statická analýza kódu
- **PostCSS** - pokročilé zpracování CSS
- **Turbopack** - rychlý bundler pro vývoj

## 🚀 Rychlý start

### Požadavky
- **Node.js 18+** (doporučeno 20+)
- **npm 9+**, yarn, pnpm nebo bun
- Moderní webový prohlížeč s podporou ES2022

### Vývojové prostředí

```bash
# Klonování repozitáře
git clone https://github.com/100ky/Leaflet_test.git
cd Leaflet_test

# Instalace závislostí
npm install

# Spuštění vývojového serveru s Turbopack
npm run dev
```

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000)

### 📱 Přístup z telefonu/tabletu pomocí ngrok

Pro testování aplikace na mobilních zařízeních nebo sdílení s ostatními můžete použít ngrok:

#### 1. Instalace ngrok

**Windows (Chocolatey):**
```bash
choco install ngrok
```

**Windows (Scoop):**
```bash
scoop bucket add extras
scoop install ngrok
```

**macOS (Homebrew):**
```bash
brew install ngrok/ngrok/ngrok
```

**Linux (nebo ruční instalace):**
```bash
# Stáhnout z https://ngrok.com/download
# Rozbalit a přidat do PATH
```

#### 2. Spuštění s ngrok

```bash
# 1. Spusťte vývojový server
npm run dev

# 2. V novém terminálu spusťte ngrok
ngrok http 3000
```

#### 3. Použití

Po spuštění ngrok vám poskytne veřejnou URL, například:
```
https://a442-2a02-830a-8400-9c00.ngrok-free.app
```

**Tuto URL můžete:**
- 📱 Otevřít na telefonu nebo tabletu
- 🌐 Sdílet s kolegy pro testování
- 🔗 Používat z jakéhokoli místa s internetem

#### 4. Výhody ngrok

- ✅ **HTTPS automaticky** - bezpečné připojení
- ✅ **Žádná konfigurace** firewallu nebo routeru
- ✅ **Veřejně přístupné** - funguje odkudkoli
- ✅ **Rychlé sdílení** - ideální pro demo a testování

#### 5. Alternativní místní přístup

Pokud chcete používat pouze lokální síť (bez ngrok):

```bash
# Spuštění serveru na všech síťových rozhraních
npm run dev -- --hostname 0.0.0.0
```

Pak použijte lokální IP adresu na telefonu (musí být na stejné WiFi):
- `http://192.168.x.x:3000` (zjistěte svou IP pomocí `ipconfig`)

### 🎯 Dostupné stránky

- **/** - Klasická mapa spaloven (základní rozhraní)
- **/map-modern** - Moderní mapa s pokročilými funkcemi
- **/incinerators** - Seznam všech spaloven s filtry
- **/about** - Informace o projektu a použitých datech
- **/contact** - Kontaktní informace a zpětná vazba
- **/test** - Testovací prostředí s debug nástroji (pouze vývoj)

### 🔧 Dostupné příkazy

```bash
npm run dev          # Vývojový server s hot reload
npm run build        # Produkční build
npm run start        # Spuštění produkční verze
npm run lint         # Kontrola kvality kódu
```

## 📋 Struktura projektu

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # Stránka "O projektu"
│   ├── api/               # API routes (remote-incinerators)
│   ├── contact/           # Kontaktní stránka
│   ├── incinerators/      # Seznam spaloven
│   ├── map-modern/        # Moderní mapové rozhraní
│   ├── test/              # Testovací prostředí (dev only)
│   ├── globals.css        # Globální styly
│   ├── layout.tsx         # Root layout komponenta
│   └── page.tsx           # Hlavní stránka (klasická mapa)
├── components/            # React komponenty
│   ├── map/              # Mapové komponenty a logika
│   ├── panels/           # Debug a admin panely
│   └── ui/               # Obecné UI komponenty
├── contexts/             # React Context providers
├── data/                 # Statická data spaloven
├── hooks/                # Custom React hooks
├── services/             # API služby a external calls
├── styles/               # Doplňkové CSS styly
├── types/                # TypeScript definice typů
└── utils/                # Pomocné utility a helper funkce
```

## 🚀 Produkční nasazení

### Příprava k nasazení

1. **Kontrola kvality kódu**
```bash
npm run lint
```

2. **Vytvoření produkčního buildu**
```bash
npm run build
```

3. **Test produkční verze lokálně**
```bash
npm run start
```

### Nasazení na Vercel (doporučeno)

```bash
# Instalace Vercel CLI
npm i -g vercel

# Nasazení
vercel

# Nebo automatické nasazení přes Git
# 1. Push do GitHub repositáře
# 2. Připojit repository na vercel.com
# 3. Automatické nasazení při každém push
```

### Nasazení na vlastní server

```bash
# 1. Vytvoření produkčního buildu
npm run build

# 2. Kopírování souborů na server
# - .next/standalone/ (pokud je povoleno)
# - .next/static/
# - public/

# 3. Spuštění na serveru
npm start
# nebo
node server.js  # pokud používáte standalone
```

### Environment proměnné

Vytvořte `.env.local` soubor pro lokální vývoj:

```env
# Vývojové prostředí
NODE_ENV=development

# API konfigurace (volitelné)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Pro produkci nastavte:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Požadavky na server

- **Node.js 18+**
- **RAM**: Minimálně 512MB, doporučeno 1GB+
- **CPU**: Single core je dostačující
- **Storage**: ~100MB pro aplikaci + cache
- **Bandwidth**: Závisí na počtu uživatelů

### Performance optimalizace

Aplikace je automaticky optimalizována pro:
- ✅ **Static Site Generation (SSG)**
- ✅ **Image optimization**
- ✅ **Code splitting**
- ✅ **Tree shaking**
- ✅ **Compression (gzip/brotli)**
- ✅ **Cache headers**

### Monitoring a debugging

Pro produkční monitoring doporučujeme:
- **Vercel Analytics** (při nasazení na Vercel)
- **Google Analytics** 
- **Sentry** pro error tracking
- **Next.js built-in metrics**

## 🐛 Troubleshooting

### Běžné problémy

**Mapa se nezobrazuje:**
- Zkontrolujte, že je `ssr: false` v dynamic importu
- Ověřte, že jsou načteny Leaflet CSS styly
- Zkontrolujte console pro JavaScript chyby

**Hydration chyby:**
- Komponentní state se inicializuje až po mountnutí
- Používáme `mounted` flag pro předcházení hydration mismatch

**API nefunguje:**
- Zkontrolujte dostupnost endpointů v `/api/`
- Ověřte CORS nastavení pro externí API

**Build chyby:**
- Spusťte `npm run lint` pro kontrolu syntaxe
- Zkontrolujte TypeScript chyby: `npx tsc --noEmit`

**Přístup z telefonu nefunguje:**
- Použijte ngrok pro jednoduché sdílení: `ngrok http 3000`
- Pro lokální síť: ujistěte se, že firewall neblokuje port 3000
- Zkontrolujte, že telefon je na stejné WiFi síti
- Zkuste IP adresu místo localhost: `http://192.168.x.x:3000`

**Ngrok problémy:**
- Zkontrolujte, že je ngrok správně nainstalován: `ngrok version`
- Ujistěte se, že Next.js server běží na portu 3000
- Pro stabilnější URL použijte ngrok auth token (zdarma na ngrok.com)
- Při problémech restartujte ngrok: `Ctrl+C` a znovu `ngrok http 3000`

### Debug režim

Pro zapnutí debug módu:
1. Přejděte na `/test`
2. Otevřete browser dev tools
3. Sledujte network tab pro API calls

## 📖 Dokumentace

### Externí dokumentace
- [Next.js Documentation](https://nextjs.org/docs) - kompletní Next.js reference
- [React Documentation](https://react.dev) - oficiální React dokumentace
- [Leaflet Documentation](https://leafletjs.com/reference.html) - Leaflet API reference
- [React Leaflet Documentation](https://react-leaflet.js.org/docs/) - React Leaflet guides
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility třídy

### Vnitřní architektura

**Mapové komponenty:**
- `MapClient.tsx` - Klasická mapa (SSR-safe wrapper)
- `ModernMapClient.tsx` - Moderní mapa s pokročilými funkcemi
- `Map.tsx` - Core mapová logika společná pro obě verze

**Data management:**
- `IncineratorDataContext.tsx` - Globální state pro data spaloven
- `useIncineratorData.ts` - Hook pro práci s daty
- `incineratorApi.ts` - API layer pro data spaloven

**Utility a helper funkce:**
- `logger.ts` - Centralizované logování
- `mapHelpers.ts` - Helper funkce pro mapu
- `statusHelpers.ts` - Funkce pro práci se stavy

## 🤝 Přispění

### Vývojové workflow

1. **Fork** tohoto repositáře
2. **Vytvořte feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit změny** (`git commit -m 'Add amazing feature'`)
4. **Push do branch** (`git push origin feature/amazing-feature`)
5. **Otevřete Pull Request**

### Coding standards

- **TypeScript** pro všechny nové soubory
- **ESLint** konfigurace musí projít bez chyb
- **Komponenty** by měly být memoizované kde je to vhodné
- **CSS** používat Tailwind utility třídy
- **Komentáře** v češtině pro business logiku

### Testing

Před submissionem PR:
```bash
npm run lint          # ESLint kontrola
npm run build         # Production build test
npm run start         # Runtime test
```

## 📄 Licence

Tento projekt je šířen pod **MIT licencí**. Můžete ho svobodně používat, upravovat a distribuovat.

Části využívající knihovnu Leaflet podléhají **BSD 2-Clause licenci**.

Podrobné znění licencí najdete v souboru [LICENSE](./LICENSE).

## 📞 Podpora

- **Issues**: [GitHub Issues](https://github.com/100ky/Leaflet_test/issues)
- **Diskuze**: [GitHub Discussions](https://github.com/100ky/Leaflet_test/discussions)
- **Email**: Viz kontaktní stránka aplikace

---

**Vytvořeno s ❤️ pro transparentní zobrazení dat o spalovnách v České republice**
