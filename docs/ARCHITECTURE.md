# Architecture — Wandermark

## Overview

Wandermark is a private travel journal built on React + Supabase. The world map (MapLibre GL JS) is the primary navigation surface — all user flows originate from or return to it. The architecture is standard React Query + Supabase with two notable deviations: MapLibre GL JS replaces any mapping default, and a slide-in Drawer / full-page route duality is used for the place detail view depending on viewport size.

## Folder Structure

```
src/
  api/         ← Supabase query functions and React Query key factories
  app/         ← App.tsx (root) + AppProviders.tsx (QueryClient, Router, Theme)
  components/  ← Reusable UI components shared across modules
  constants/   ← const.ts (UI strings) + enum.ts (TypeScript enums)
  context/     ← App-level React contexts (AuthContext)
  hooks/       ← App-level custom hooks
    test/      ← Hook unit tests
  layouts/     ← NavBar, page layout wrappers
  modules/     ← Feature modules, each self-contained
  pages/       ← Thin page components that compose modules
  routes/      ← AppRoutes.tsx — all route definitions
  types/       ← TypeScript types + database.types.ts (Supabase generated)
  lib/         ← Third-party client setup (supabaseClient.ts)
  utils/       ← Pure utility functions
```

Each module is self-contained:
```
modules/<feature>/
  components/  ← Feature-specific UI components
  hooks/       ← Feature-specific hooks
    test/      ← Hook tests
  context/     ← Feature-specific context (only if needed)
```

### Module breakdown

| Module | Responsibility |
|---|---|
| `modules/map` | MapLibre globe, country fills, city pins, stats bar, FAB |
| `modules/places` | Add/edit/delete place flow, geocoding search, PlaceDetail component |
| `modules/ratings` | Multi-step RatingWidget (6 dimensions + mood tags) |
| `modules/photos` | Photo upload, per-file progress, masonry photo grid |
| `modules/album` | Sticker album — country sections, flip card grid, lightbox |
| `modules/trips` | Trip list, trip page, add-places picker |
| `modules/profile` | Profile view + edit, avatar upload |

## Data Flow

```
Component
  └── Custom Hook (src/hooks/ or src/modules/<feature>/hooks/)
        └── React Query (useQuery / useMutation)
              └── Query function (src/api/)
                    └── Supabase client (src/lib/supabaseClient.ts)
```

Components never call Supabase directly. All server state goes through React Query hooks.

## State Management

- **Server state**: React Query — all Supabase data, loading states, caching
- **Map viewport**: `useRef` to the MapLibre map instance — never React state; setting React state on every map move would cause unnecessary re-renders
- **Panel state**: local `useState` in the map page — selected place ID + panel open/closed
- **Rating wizard step**: local `useState` inside `RatingWidget`
- **Photo upload queue**: local `useState` in the upload hook — per-file progress tracked there
- **Auth state**: React Context (`src/context/AuthContext.tsx`) — wraps `supabase.auth.onAuthStateChange`
- **Forms**: React Hook Form with Yup validation — `FormProvider` + `useFormContext` pattern

No Zustand or additional global state needed.

## Place Detail Duality

`PlaceDetail` is a single component used in two contexts:

- **Desktop**: rendered inside a MUI `Drawer` (slide-in panel from right), map stays visible
- **Mobile / direct navigation**: rendered as a full-page route at `/places/:id`

The component accepts a `mode: 'panel' | 'page'` prop. The wrapping (Drawer vs Box) is handled at the page/map level, not inside the component. Build this correctly from the start — retrofitting is expensive.

## Routes

```
/                   → redirect to /map (auth) or /login (no auth)
/login              → LoginPage
/onboarding         → OnboardingPage (shown once after first sign-up)
/map                → MapPage (protected)
/places/:id         → PlaceDetailPage (protected — mobile + direct nav)
/album              → AlbumPage (protected)
/trips              → TripsListPage (protected)
/trips/:id          → TripPage (protected)
/profile            → ProfilePage (protected)
```

All routes except `/login` are protected. Unauthenticated users are redirected to `/login`.

## Key Conventions

- Named exports only — no default exports
- Hooks return explicit TypeScript types
- All UI strings in `src/constants/const.ts` — never inlined in components
- All enums in `src/constants/enum.ts`
- MUI `sx` prop for one-off styles, `styled()` from `@emotion/styled` for reusable styled components
- No CSS files, no inline `style` props
- Font sizes and font families only in `src/theme.ts`

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `VITE_MAPTILER_KEY` | MapTiler API key — restrict to your domain(s) in the MapTiler dashboard |

## Stack Deviations from Project Standard

**MapLibre GL JS + `react-map-gl` + MapTiler**
MapLibre is the open-source fork of Mapbox GL JS — identical API, no credit card required, no vendor lock-in. MapTiler provides free vector tile hosting and geocoding (100k requests/month free). `react-map-gl` v7 (Visgl) wraps MapLibre in a React-idiomatic API. New dependencies: `maplibre-gl`, `react-map-gl`.

**Explorer theme + dual light/dark mode**
Replaces the original dark-only design direction. MUI v6 `createTheme` with `colorSchemes` (light + dark) and CSS variables for seamless theme switching. Palette: warm cream/parchment (`#FAF7F2`) light + dark ink (`#120F0A`) dark, burnt sienna accent (`#C4692A` / `#D4834A`). Fonts: Playfair Display (headings) + DM Sans (body) loaded via `@fontsource` packages — self-hosted, no external CDN.

**Sticker album (`/album`)**
No additional libraries needed. Fixed-size sticker card grid, country-grouped sections. Flip animation uses CSS `transform: rotateY(180deg)` with a `transition`. Front side shows the photo; back side shows metadata (caption, category, date taken, location). Empty slots render placeholder cards for places without photos. This is a pure presentation layer over the existing `photos` + `places` data.

**Supabase Storage: public bucket + RLS**
Photos are served via public URL. Storage RLS policies enforce per-user access using `(storage.foldername(name))[1] = auth.uid()::text`. This avoids signed URL expiry with no meaningful security trade-off for a personal journal. When a photo DB row is deleted, the storage object must also be deleted in the mutation's `onSuccess`.
