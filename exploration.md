# Exploration: Hospital Orientador MVP Rebuild

## Current State

The codebase is a functional prototype/demo with:
- **Stack**: React 19, TypeScript, Vite 7, Tailwind 4, Three.js, shadcn/ui
- **Data**: ~70 specialties across 10 modules in hardcoded TypeScript files
- **Features**: Search, module grid, 2D canvas map, 3D navigation, emergency plan modal
- **Gaps**: No i18n, no tips system, no mobile optimization, hardcoded data

## Key Files Explored

| File | Purpose |
|------|---------|
| `shared/data.ts` | Static specialty/module data (70 specialties, 10 modules) |
| `shared/hospitalGraph.ts` | Spatial nodes/edges for pathfinding |
| `client/src/App.tsx` | Simple wouter routing |
| `client/src/pages/Home.tsx` | Main page with 3 tabs (search, modules, info) |
| `client/src/pages/Navigation.tsx` | Interactive navigation with 2D/3D |
| `client/src/components/SpecialtySearch.tsx` | Search + module filter |
| `client/src/components/InteractiveMapNavigator.tsx` | Canvas-based 2D map with zoom/pan |
| `client/src/components/EmergencyPlanModal.tsx` | Emergency plan image viewer |
| `package.json` | Dependencies (no i18n library) |

## Architecture Assessment

### Current Strengths
1. **Functional prototype** — All core features work
2. **Pathfinding system** — hospitalGraph.ts has nodes/edges
3. **3D navigation** — Two Three.js components exist
4. **Canvas-based map** — Custom zoom/pan implementation
5. **Emergency plan** — Image modal with zoom

### Current Weaknesses
1. **Hardcoded data** — No easy way to update specialties
2. **No i18n** — Multi-language was a key requirement
3. **Shadcn/ui overhead** — Many unused components
4. **3D complexity** — Adds bundle size, maintenance burden
5. **No offline support** — Hospital connectivity may be poor
6. **Mobile unfriendly** — Not responsive-first
7. **No tips system** — Contextual guidance not implemented

## Approaches Comparison

### Option A: Keep Stack, Add i18n + PWA
- **Pros**: Reuse existing code, three.js already integrated, low risk
- **Cons**: Bundle size large, shadcn/ui bloat
- **Effort**: Medium (2-3 weeks)

### Option B: Simplify to Static Site (Astro)
- **Pros**: Smaller bundle, better performance, simpler
- **Cons**: Lose React, 3D needs different approach (R3F or fallback)
- **Effort**: High (rewrite, 4-5 weeks)

### Option C: PWA-First + Offline
- **Pros**: Works without internet in hospital, reliable
- **Cons**: More complex initial setup
- **Effort**: Medium-High

### Option D: MVP with 2D Only (No 3D)
- **Pros**: Much simpler, smaller bundle, faster load
- **Cons**: Lose "wow factor" of 3D
- **Effort**: Low (1-2 weeks)

## MVP Feature Prioritization

### v1 (Must Have)
1. ✅ Search specialties by name
2. ✅ Module-based filtering
3. ✅ 2D interactive map (canvas or SVG)
4. ✅ Emergency plan viewer
5. ✅ i18n: Spanish, English, Haitian Creole (Mapudungún if possible)
6. ✅ Mobile responsive
7. ✅ Externalized data (JSON) for easy updates
8. ✅ PWA with offline caching

### v2 (Should Have)
1. Tips system (contextual guidance)
2. Recent searches (persisted)
3. Accessibility (ARIA, keyboard nav)

### v3 (Nice to Have)
1. 3D navigation
2. QR code generation for locations
3. Admin panel for data updates

## Key Technical Challenges

1. **Mapudungún translation** — Need professional translator, not just Google Translate
2. **3D vs 2D decision** — 3D adds significant complexity; recommend MVP with 2D only
3. **Data externalization** — Move from TypeScript to JSON with validation
4. **Image hosting** — Currently hardcoded CloudFront URLs; need configurable
5. **Offline mode** — Service worker + IndexedDB for data

## Recommended Architecture

```
hospital-orientador/
├── public/
│   ├── locales/          # i18n JSON files
│   │   ├── es.json
│   │   ├── en.json
│   │   ├── ht.json
│   │   └── arn.json
│   ├── data/
│   │   ├── specialties.json
│   │   ├── modules.json
│   │   └── tips.json
│   └── maps/
│       ├── floor-1.svg    # SVG maps (scalable, searchable)
│       ├── floor-2.svg
│       └── emergency.svg
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   └── i18n.ts           # i18next config
├── index.html
└── package.json
```

### Stack Recommendations
- **Framework**: Keep React 19 + Vite 7
- **i18n**: react-i18next (mature, well-supported)
- **State**: Zustand (simpler than Redux, enough for this app)
- **Map**: SVG overlay (better than canvas for accessibility/SEO)
- **Styling**: Keep Tailwind, remove shadcn/ui bloat
- **PWA**: vite-plugin-pwa

## Risks

1. **Mapudungún** — May need professional translator for quality
2. **3D navigation** — Recommend removing for MVP; can add later
3. **Image URLs** — CloudFront URLs are hardcoded; need env vars
4. **No tests** — Vitest installed but not configured

## Ready for Proposal

**Yes** — This exploration provides a clear direction. The user should create a change proposal to formalize the rebuild scope before entering specification phase.