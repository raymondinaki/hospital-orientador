# 🏥 Hospital Orientador — HCSBA

> Aplicación web interactiva para orientar pacientes en el Hospital Clínico San Borja Arriarán (Chile). Diseñada para ser usada por orientadores hospitalarios en su día a día.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Scripts](#-scripts)
- [i18n — Multi-idioma](#-i18n--multi-idioma)
- [Datos Externalizados](#-datos-externalizados)
- [PWA — Funcionamiento Offline](#-pwa--funcionamiento-offline)
- [Accesibilidad](#accesibilidad)
- [Licencia](#-licencia)

---

## 📝 Descripción

Hospital Orientador es una aplicación web progresiva (PWA) que permite a los orientadores del hospital ayudar a pacientes a encontrar rápidamente la especialidad y módulo que necesitan. Soporta **4 idiomas** (español, creole haitiano, inglés y mapudungún) y funciona **sin conexión** después de la primera carga.

**Problema que resuelve:**
- Los pacientes se pierden en un hospital con ~10 módulos y 2 pisos
- Los orientadores deben dar instrucciones de memoria
- Barreras idiomáticas (pacientes haitianos, mapuches, extranjeros)
- El hospital no confiable tiene Wi-Fi

---

## ✨ Características

| Feature | Descripción |
|---------|-------------|
| 🔍 **Búsqueda fuzzy** | Busca especialidades en los 4 idiomas simultáneamente |
| 🗺️ **Mapa interactivo SVG** | 2 pisos con cambio de piso, marcadores de módulos, rutas animadas |
| 🌐 **4 idiomas** | Español (default), Kreyòl Ayisyen, English, Mapudungún (placeholder) |
| 🏷️ **Tips contextuales** | Info de recaudación, horarios, instrucciones por módulo |
| 🚨 **Plan de emergencia** | Rutas de evacuación en rojo, contactos de emergencia, instrucciones por piso |
| 📱 **PWA / Offline** | Service worker, manifest, funciona sin conexión |
| ♿ **Accesibilidad** | Skip-to-content, ARIA roles, navegación por teclado, touch targets 44px |
| 📊 **Datos externalizados** | Especialidades, módulos y tips en JSON — actualizables sin rebuild |

---

## 🛠 Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Estilos** | Tailwind CSS 4 + tw-animate-css + tailwind-animations |
| **UI** | shadcn/ui (Radix primitives) |
| **i18n** | react-i18next |
| **Estado** | Zustand |
| **Routing** | Wouter |
| **Mapas** | SVG interactivo (no Three.js) |
| **PWA** | Service Worker manual (vite-plugin-pwa incompatible con Vite 7) |
| **Servidor** | Express (static serve) |

---

## 📁 Estructura del Proyecto

```
hospital-orientador/
├── client/                        # Frontend React
│   ├── src/
│   │   ├── app/                    # App shell, routing, providers
│   │   │   ├── Router.tsx          # Wouter routes con lazy loading
│   │   │   └── providers/          # I18nProvider, ThemeProvider
│   │   ├── features/               # Feature modules (domain-driven)
│   │   │   ├── search/             # Búsqueda de especialidades
│   │   │   │   ├── SearchPage.tsx   # Home page con hero + search
│   │   │   │   ├── SearchInput.tsx  # Input con debounce y fuzzy match
│   │   │   │   ├── SearchResults.tsx # Resultados animados con badges
│   │   │   │   └── useSearch.ts     # Hook con lógica de búsqueda
│   │   │   ├── map/                # Mapa interactivo
│   │   │   │   ├── MapPage.tsx      # Página completa del mapa
│   │   │   │   ├── HospitalMap.tsx  # SVG renderizado
│   │   │   │   ├── ModuleMarker.tsx # Marcadores interactivos
│   │   │   │   ├── PathHighlight.tsx # Rutas animadas
│   │   │   │   └── FloorSwitcher.tsx # Tabs de piso
│   │   │   ├── modules/            # Módulos del hospital
│   │   │   │   ├── ModuleGrid.tsx  # Grid de módulos
│   │   │   │   ├── ModuleCard.tsx  # Card individual
│   │   │   │   └── ModuleDetail.tsx # Detalle con especialidades
│   │   │   ├── tips/               # Tips contextuales
│   │   │   │   ├── TipBanner.tsx   # Banner de tips por módulo
│   │   │   │   └── useTips.ts      # Hook de tips
│   │   │   └── emergency/         # Plan de emergencia
│   │   │       ├── EmergencyPage.tsx # Página roja de emergencia
│   │   │       └── EmergencyMap.tsx  # Mapa con salidas en rojo
│   │   ├── shared/                 # Componentes y hooks compartidos
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx      # Header sticky con LanguageSwitcher
│   │   │   │   ├── LanguageSwitcher.tsx # Dropdown de 4 idiomas
│   │   │   │   ├── LoadingSpinner.tsx  # Spinner para Suspense
│   │   │   │   └── OfflineIndicator.tsx # Banner offline
│   │   │   └── hooks/
│   │   │       ├── useAppStore.ts  # Zustand store (estado global)
│   │   │       └── useData.ts      # Fetch de JSONs con fallback
│   │   ├── i18n/                   # Internacionalización
│   │   │   ├── index.ts            # Configuración i18next
│   │   │   └── locales/
│   │   │       ├── es.json         # Español (default)
│   │   │       ├── ht.json         # Kreyòl Ayisyen
│   │   │       ├── en.json         # English
│   │   │       └── arn.json        # Mapudungún (placeholder)
│   │   ├── components/ui/          # shadcn/ui components
│   │   ├── App.tsx                 # Root component
│   │   ├── main.tsx                # Entry point + SW registration
│   │   └── index.css               # Tailwind + animations
│   └── public/
│       ├── data/                    # Datos externalizados
│       │   ├── specialties.json     # 51 especialidades con i18n
│       │   ├── modules.json         # 10 módulos con colores/coordenadas
│       │   └── tips.json            # Tips contextuales por módulo
│       ├── favicon.svg              # Favicon SVG (hospital cross)
│       ├── manifest.json            # PWA manifest
│       └── sw.js                     # Service Worker
├── server/
│   └── index.ts                    # Express server (static serve)
├── shared/
│   └── types.ts                    # TypeScript interfaces compartidos
├── maps/                           # Mapas originales del hospital
│   ├── Mapa HCSBA.pdf
│   └── Mapa HCSBA_page-0001.jpg
└── package.json
```

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 20
- **pnpm** >= 8

### Paso a paso

```bash
# Clonar el repositorio
git clone https://github.com/raymondinaki/hospital-orientador.git
cd hospital-orientador

# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

La app se sirve en `http://localhost:5000` (desarrollo) o el puerto configurado en producción.

---

## 📜 Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con HMR |
| `pnpm build` | Build de producción (Vite + esbuild) |
| `pnpm start` | Iniciar servidor de producción |
| `pnpm preview` | Preview del build de producción |
| `pnpm check` | Type check con `tsc --noEmit` |
| `pnpm format` | Formatear código con Prettier |

---

## 🌐 i18n — Multi-idioma

La app soporta **4 idiomas** con cambio instantáneo:

| Idioma | Código | Estado |
|--------|--------|--------|
| 🇪🇸 Español | `es` | ✅ Completo (default) |
| 🇭🇹 Kreyòl Ayisyen | `ht` | ✅ Completo |
| 🇬🇧 English | `en` | ✅ Completo |
| 🌐 Mapudungún | `arn` | ⚠️ Placeholder — requiere traductor profesional |

### Cómo agregar un idioma

1. Crear `client/src/i18n/locales/{codigo}.json` copiando `es.json`
2. Traducir todos los valores
3. Agregar el idioma en `LanguageSwitcher.tsx`
4. Agregar el idioma en `supportedLngs` en `client/src/i18n/index.ts`

> ⚠️ **Mapudungún**: Las traducciones actuales son placeholder en español. Se requiere un traductor profesional certificado antes de usar en producción.

---

## 📦 Datos Externalizados

Los datos del hospital están en archivos JSON que se pueden actualizar **sin rebuild**:

| Archivo | Contenido |
|---------|-----------|
| `public/data/specialties.json` | 51 especialidades con nombres en 4 idiomas |
| `public/data/modules.json` | 10 módulos con colores, coordenadas, pisos |
| `public/data/tips.json` | Tips contextuales (pago, horarios, instrucciones) |

### Estructura de una especialidad

```json
{
  "id": "ped",
  "name": {
    "es": "Pediatría",
    "en": "Pediatrics",
    "ht": "Pedyatrik",
    "arn": "Pediatría (pendiente traducción)"
  },
  "module": "A",
  "floor": 1,
  "description": {
    "es": "Atención médica para niños",
    "en": "Medical care for children",
    "ht": "Swen medikal pou timoun",
    "arn": "Atención médica para niños (pendiente traducción)"
  }
}
```

---

## 📱 PWA — Funcionamiento Offline

La app funciona como **PWA** con:

- **Service Worker** (`sw.js`) — cachea assets estáticos y JSONs de datos
- **Manifest** (`manifest.json`) — nombre, iconos, tema
- **Offline Indicator** — banner sutil cuando no hay conexión
- **Estrategia**: cache-first para assets, stale-while-revalidate para datos

> ⚠️ `vite-plugin-pwa` no es compatible con Vite 7. Se usa un Service Worker manual.

---

## ♿ Accesibilidad

La app cumple **WCAG 2.1 AA**:

- Skip-to-content link
- ARIA roles y labels en todos los componentes interactivos
- Navegación por teclado (tab, enter, escape)
- Touch targets mínimos de 44px
- Rings de focus visibles en todos los elementos
- Contraste de colores verificado

---

## 🏗 Arquitectura

### Decisiones de diseño clave

| Decisión | Elección | Razón |
|----------|----------|-------|
| Mapa | SVG inline (no Three.js) | Más simple, accesible, mantenible |
| Estado | Zustand | Ligero, con persistencia en localStorage |
| i18n | react-i18next + JSON directos | 4 JSONs chicos (~15KB total), no hace falta lazy loading |
| Animaciones | tw-animate-css + tailwind-animations | shadcn transitions + scroll/decorative animations |
| Datos | JSON en public/data/ | Actualizable sin rebuild |
| Routing | Wouter | Ligero, sin dependencias extras |

### Rutas

| Path | Componente | Descripción |
|------|------------|-------------|
| `/` | SearchPage | Home con búsqueda y módulos |
| `/map` | MapPage | Mapa interactivo con rutas |
| `/module/:id` | ModuleDetail | Detalle de módulo con tips |
| `/emergency` | EmergencyPage | Plan de emergencia |

---

## 📄 Licencia

MIT — Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Créditos

Desarrollado para el **Hospital Clínico San Borja Arriarán**, Santiago, Chile.

Mapas originales proporcionados por la administración del hospital.