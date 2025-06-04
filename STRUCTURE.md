# 📁 Struktura složek - Dokumentace

Tento dokument popisuje organizaci a strukturu složek v refaktorované aplikaci.

## 🎯 Cíle reorganizace

1. **Přehlednost** - Logické seskupení souvisejících komponent
2. **Škálovatelnost** - Snadné přidávání nových komponent
3. **Maintainability** - Rychlé nalezení a upravování souborů
4. **DRY principle** - Eliminace duplikací pomocí barrel exports

## 📂 Struktura komponent

```
src/components/
├── 📋 panels/                    # Panel komponenty pro UI
│   ├── ApiTestPanel.tsx          # Panel pro testování API
│   ├── DataInfoPanel.tsx         # Panel s informacemi o datech
│   ├── DebugPanel.tsx            # Debug panel
│   ├── LiveDebugPanel.tsx        # Živý debug panel
│   ├── QuickApiTestPanel.tsx     # Rychlý API test panel
│   └── RemoteApiStatusPanel.tsx  # Status vzdáleného API
├── 🗺️ map/                       # Vše spojené s mapou
│   ├── Map.tsx                   # Hlavní mapa komponenta
│   ├── Map.css                   # Styly pro mapu
│   ├── mapIcons.ts               # Ikony map markerů
│   ├── MapStatistics.tsx         # Statistiky mapy
│   └── RegionDemo.tsx            # Demo regionů
├── 🧩 ui/                        # Základní UI komponenty
│   ├── InfoBlock.tsx             # Informační blok
│   ├── LogView.tsx               # Zobrazení logů
│   ├── Panel.tsx                 # Základní panel
│   └── TestResultItem.tsx        # Položka výsledku testu
└── 📦 index.ts                   # Barrel export - centrální exporty
```

## 🎨 Struktura stylů

```
src/styles/
├── 🎯 utilities.css              # Hlavní utility třídy (refaktorované)
├── ➕ additional-utilities.css    # Specializované utility třídy
├── 📱 responsive.css             # Responzivní styly
└── 📁 backup/                    # Zálohy původních souborů
    ├── utilities-old.css         # Záloha původního utilities.css
    └── additional-utilities-old.css # Záloha původního additional-utilities.css
```

## 🔄 Barrel Exports

### Výhody použití `index.ts`:

```typescript
// ❌ Před refaktorizací - mnoho importů
import { ApiTestPanel } from '@/components/ApiTestPanel';
import { DebugPanel } from '@/components/DebugPanel';
import { MapStatistics } from '@/components/MapStatistics';
// ... další importy

// ✅ Po refaktorizaci - jeden import
import { 
    ApiTestPanel, 
    DebugPanel, 
    MapStatistics 
} from '@/components';
```

### Podporované exporty:

- **UI komponenty**: `InfoBlock`, `LogView`, `Panel`, `TestResultItem`
- **Panel komponenty**: `ApiTestPanel`, `DataInfoPanel`, `DebugPanel`, `LiveDebugPanel`, `QuickApiTestPanel`, `RemoteApiStatusPanel`
- **Map komponenty**: `Map`, `MapStatistics`, `RegionDemo`
- **Typy**: `LogEntry`

## 🔧 Import patterns

### Dynamické importy (pro SSR optimalizaci):
```typescript
const Map = dynamic(() => import('@/components/map/Map'), {
    loading: () => <p>Načítání mapy...</p>,
    ssr: false
});
```

### Standardní importy:
```typescript
import { ApiTestPanel, DebugPanel } from '@/components';
```

### Přímé importy (pokud je potřeba):
```typescript
import { Map } from '@/components/map/Map';
```

## 🎯 Výhody refaktorované struktury

### ✅ Přehlednost
- Logické seskupení podle funkcionality
- Jasné oddělení UI komponent, panelů a map komponent
- Čistší file explorer

### ✅ Škálovatelnost  
- Snadné přidávání nových panelů do `panels/`
- Nové UI komponenty do `ui/`
- Map-related komponenty do `map/`

### ✅ Developer Experience
- Faster imports díky barrel exports
- Menší cognitive load při hledání souborů
- Konzistentní import patterns

### ✅ Maintenance
- Snadnější refaktoring - vše související na jednom místě
- Méně merge conflicts
- Lepší code organization

## 🚀 Migrace

Všechny importy byly automaticky aktualizovány v:
- `src/app/page.tsx`
- `src/app/test/page.tsx`

Aplikace funguje bez breaking changes! 🎉

## 📝 Poznámky pro vývojáře

1. **Nové komponenty** přidávejte do příslušné složky podle jejich funkce
2. **Aktualizujte `index.ts`** při přidání nových exportů
3. **Používejte barrel exports** pro cleaner imports
4. **Zálohy** zůstávají v `styles/backup/` pro případ potřeby rollback

---

*Refaktorizováno pro lepší developer experience a maintainability* 🛠️
