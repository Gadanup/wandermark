# Implementation Plan — Wandermark

> Reference steps precisely when asking Claude to implement something.
> Example: "Let's do step 2.3" or "Only implement step 4.2.1"

## Git workflow

| When               | Action                                      |
| ------------------ | ------------------------------------------- |
| End of Phase 1     | Commit everything to `main` (step 1.4)      |
| Start of Phase 2–8 | `git checkout -b phase/<N>-<name>`          |
| End of Phase 2–8   | Commit on the phase branch, merge to `main` |

Branch naming: `phase/2-core-architecture`, `phase/3-authentication`, etc.

---

## Phase 1 — Project Setup

- [x] **1.1** Initialize Vite project
  - [x] 1.1.1 `npm create vite@latest wandermark -- --template react-ts`
  - [x] 1.1.2 Delete boilerplate files (`src/App.css`, `src/index.css`, `src/assets/`)
  - [x] 1.1.3 Set `"strict": true` in `tsconfig.json`
  - [x] 1.1.4 Add path alias `@/` → `src/` in `tsconfig.json` and `vite.config.ts`

- [x] **1.2** Install dependencies
  - [x] 1.2.1 `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`
  - [x] 1.2.2 `npm install @tanstack/react-query`
  - [x] 1.2.3 `npm install react-router-dom`
  - [x] 1.2.4 `npm install react-hook-form yup @hookform/resolvers`
  - [x] 1.2.5 `npm install @supabase/supabase-js`
  - [x] 1.2.6 `npm install maplibre-gl react-map-gl`
  - [x] 1.2.7 `npm install @fontsource/playfair-display @fontsource/dm-sans`
  - [x] 1.2.8 `npm install -D vitest @testing-library/react @testing-library/user-event jsdom @testing-library/jest-dom`
  - [x] 1.2.9 `npm install -D @vitejs/plugin-react` _(installed in 1.1)_

- [x] **1.3** Configure environment
  - [x] 1.3.1 Copy `.env.example` → `.env`
  - [x] 1.3.2 Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - [x] 1.3.3 Fill in `VITE_MAPTILER_KEY` (create free account at maptiler.com — no card required)
  - [x] 1.3.4 Restrict the MapTiler key to `localhost` in the MapTiler dashboard
  - [x] 1.3.5 Confirm `.env` is in `.gitignore`

- [x] **1.4** Initial commit (on `main`)
  - [x] 1.4.1 `git add .`
  - [x] 1.4.2 `git commit -m "phase 1: project setup"`

---

## Phase 2 — Core Architecture

> **Git:** `git checkout -b phase/2-core-architecture`

- [x] **2.1** Supabase client
  - [x] 2.1.1 Create `src/lib/supabaseClient.ts` with typed client using `database.types.ts`
  - [x] 2.1.2 Run `npx supabase gen types typescript --project-id <id> > src/types/database.types.ts` _(placeholder handwritten — regenerate after Phase 4 schema is applied)_

- [x] **2.2** App shell
  - [x] 2.2.1 Create `src/app/AppProviders.tsx` — `QueryClientProvider` + `ThemeProvider` + `BrowserRouter`
  - [x] 2.2.2 Create `src/app/App.tsx` — renders `<AppProviders><AppRoutes /></AppProviders>`
  - [x] 2.2.3 Update `src/main.tsx` to render `<App />` _(already done in 1.1)_

- [x] **2.3** Theme
  - [x] 2.3.1 Import fonts in `src/main.tsx`: `@fontsource/playfair-display/400.css`, `/700.css` and `@fontsource/dm-sans/400.css`, `/500.css`
  - [x] 2.3.2 Create `src/theme.ts` — Explorer palette (light + dark), Playfair Display headings, DM Sans body, MUI v6 component overrides
    - Light: background `#FAF7F2`, surface `#FFFFFF`, text `#1A1208`, accent `#C4692A`
    - Dark: background `#120F0A`, surface `#1E1810`, text `#F5ECD7`, accent `#D4834A`
  - [x] 2.3.3 Use MUI v6 `colorSchemes` + CSS variables for light/dark toggle (no page flicker)
  - [x] 2.3.4 All font families and sizes defined in theme only — never at module level

- [x] **2.4** Routing
  - [x] 2.4.1 Create `src/routes/AppRoutes.tsx` with all routes: `/login`, `/onboarding`, `/map`, `/places/:id`, `/album`, `/trips`, `/trips/:id`, `/profile`
  - [x] 2.4.2 Create `ProtectedRoute` wrapper — redirects to `/login` if no session
  - [x] 2.4.3 Root `/` redirects to `/map` (auth) or `/login` (no auth)
  - [x] 2.4.4 Create placeholder page components for each route

- [x] **2.5** Constants
  - [x] 2.5.1 Create `src/constants/const.ts` — initial UI strings (app name, nav labels, empty states)
  - [x] 2.5.2 Create `src/constants/enum.ts` — `PhotoCategory`, `RatingDimension`, `MoodTag`

- [ ] **2.6** Commit phase 2
  - [ ] 2.6.1 `git add .`
  - [ ] 2.6.2 `git commit -m "phase 2: core architecture"`
  - [ ] 2.6.3 `git checkout main && git merge phase/2-core-architecture`

---

## Phase 3 — Authentication

> **Git:** `git checkout -b phase/3-authentication`

- [ ] **3.1** Supabase setup
  - [ ] 3.1.1 Enable email/password auth and magic link in Supabase dashboard
  - [ ] 3.1.2 Add redirect URLs: `http://localhost:5173` and production domain
  - [ ] 3.1.3 Apply DB trigger `handle_new_user` from `docs/DATABASE.md` — auto-creates `profiles` row on sign-up

- [ ] **3.2** Auth query layer
  - [ ] 3.2.1 Create `src/api/auth.ts` — sign-in (password + magic link), sign-up, sign-out, get-session
  - [ ] 3.2.2 Create `src/api/queryKeys.ts` — key factory starting with `auth` and `profile` keys

- [ ] **3.3** Auth hooks
  - [ ] 3.3.1 Create `src/hooks/useGetCurrentUser.ts`
  - [ ] 3.3.2 Create `src/hooks/useSignIn.ts` (useMutation — handles both password and magic link)
  - [ ] 3.3.3 Create `src/hooks/useSignOut.ts` (useMutation)
  - [ ] 3.3.4 Create `src/hooks/useSignUp.ts` (useMutation)

- [ ] **3.4** Auth context
  - [ ] 3.4.1 Create `src/context/AuthContext.tsx` — subscribe to `supabase.auth.onAuthStateChange`, expose `user` and `session`
  - [ ] 3.4.2 Add `AuthProvider` to `AppProviders.tsx`

- [ ] **3.5** Login page
  - [ ] 3.5.1 Create `src/pages/LoginPage.tsx` — email/password form + magic link option
  - [ ] 3.5.2 Use RHF + Yup with `Controller` for MUI inputs
  - [ ] 3.5.3 Redirect to `/map` on successful sign-in, to `/onboarding` on first sign-up

- [ ] **3.6** Onboarding page
  - [ ] 3.6.1 Create `src/pages/OnboardingPage.tsx` — username input + avatar upload
  - [ ] 3.6.2 Check if `profiles.username` still has the auto-generated value — skip onboarding if user has already set it
  - [ ] 3.6.3 On complete, redirect to `/map`

- [ ] **3.7** Tests
  - [ ] 3.7.1 Write tests for `useGetCurrentUser` in `src/hooks/test/`
  - [ ] 3.7.2 Write tests for `useSignIn` and `useSignOut`

- [ ] **3.8** Commit phase 3
  - [ ] 3.8.1 `git add .`
  - [ ] 3.8.2 `git commit -m "phase 3: authentication"`
  - [ ] 3.8.3 `git checkout main && git merge phase/3-authentication`

---

## Phase 4 — Database & Storage Setup

> **Git:** `git checkout -b phase/4-database`

- [ ] **4.1** Schema (run as Supabase migrations)
  - [ ] 4.1.1 Create `profiles` table + RLS policies (see `docs/DATABASE.md`)
  - [ ] 4.1.2 Apply `handle_new_user` trigger
  - [ ] 4.1.3 Create `places` table + RLS policies
  - [ ] 4.1.4 Create `ratings` table + RLS policies
  - [ ] 4.1.5 Create `photos` table + RLS policies
  - [ ] 4.1.6 Create `trips` table + RLS policies
  - [ ] 4.1.7 Create `trip_places` join table + RLS policy
  - [ ] 4.1.8 Manually test all RLS policies — confirm no table is readable without auth

- [ ] **4.2** Storage
  - [ ] 4.2.1 Create `photos` bucket (public, 10 MB limit, JPEG/PNG/WebP)
  - [ ] 4.2.2 Apply storage RLS policies for `photos` bucket (insert, select, delete)
  - [ ] 4.2.3 Create `avatars` bucket (public, 2 MB limit, JPEG/PNG/WebP)
  - [ ] 4.2.4 Apply storage RLS policies for `avatars` bucket

- [ ] **4.3** Types and query layer
  - [ ] 4.3.1 Regenerate types: `npx supabase gen types typescript > src/types/database.types.ts`
  - [ ] 4.3.2 Create `src/types/place.ts`, `src/types/rating.ts`, `src/types/photo.ts`, `src/types/trip.ts` (domain types with joined fields)
  - [ ] 4.3.3 Extend `src/api/queryKeys.ts` with keys for all entities
  - [ ] 4.3.4 Create `src/api/places.ts` — Supabase query functions
  - [ ] 4.3.5 Create `src/api/ratings.ts`
  - [ ] 4.3.6 Create `src/api/photos.ts`
  - [ ] 4.3.7 Create `src/api/trips.ts`
  - [ ] 4.3.8 Create `src/api/profiles.ts`

- [ ] **4.4** Commit phase 4
  - [ ] 4.4.1 `git add .`
  - [ ] 4.4.2 `git commit -m "phase 4: database & storage setup"`
  - [ ] 4.4.3 `git checkout main && git merge phase/4-database`

---

## Phase 5 — Feature Modules

> **Git:** `git checkout -b phase/5-features`

### 5.1 — World Map

- [ ] **5.1.1** Create `src/modules/map/` structure (components/, hooks/, hooks/test/)
- [ ] **5.1.2** Set up MapLibre GL JS with `react-map-gl` — configure MapTiler dark style (`https://api.maptiler.com/maps/dataviz-dark/style.json?key={key}`)
- [ ] **5.1.3** Set globe projection (`projection: { type: 'globe' }`)
- [ ] **5.1.4** Create `useGetAllPlaces` hook — fetches all user places, `staleTime: 5 * 60 * 1000`, used by map and stats bar
- [ ] **5.1.5** Country fill layer — add GeoJSON source for country boundaries, filter by user's `country_code` array, fill with accent colour at 30% opacity + 1px border at 60%
  - Confirm ISO property name in the chosen GeoJSON source (`iso_a2` in Natural Earth)
- [ ] **5.1.6** City pins — custom HTML markers at each place's lat/lng; accent colour fill, white border; hover tooltip showing place name
- [ ] **5.1.7** Pin click → open place detail panel (set selected place ID in state, open Drawer)
- [ ] **5.1.8** Stats bar — `X countries · Y cities · Z photos` derived from places query
- [ ] **5.1.9** FAB (floating action button) — always visible, opens Add Place modal
- [ ] **5.1.10** Map controls — zoom in/out, globe/flat toggle (switch between `globe` and `mercator` projections), "Fit my places" button
- [ ] **5.1.11** Empty state — when no places exist, show prompt overlay on the map
- [ ] **5.1.12** Create `src/pages/MapPage.tsx` — composes map + panel + FAB

---

### 5.2 — Place Management

- [ ] **5.2.1** Create `src/modules/places/` structure
- [ ] **5.2.2** Create `useGetPlaces` hook (all places for current user)
- [ ] **5.2.3** Create `useGetPlace` hook (single place by ID, with joined rating and photos)
- [ ] **5.2.4** Create `useAddPlace` mutation
- [ ] **5.2.5** Create `useUpdatePlace` mutation
- [ ] **5.2.6** Create `useDeletePlace` mutation — also deletes all associated `photos` storage objects in `onSuccess`

- [ ] **5.2.7** Add Place modal
  - [ ] 5.2.7.1 MapTiler geocoding search field with 300ms debounce — `GET https://api.maptiler.com/geocoding/{query}.json?key={key}`
  - [ ] 5.2.7.2 Results dropdown — place name, country flag emoji, place type
  - [ ] 5.2.7.3 Visited date picker (month + year only)
  - [ ] 5.2.7.4 Bucket list toggle ("I've been here" vs "I want to visit")
  - [ ] 5.2.7.5 Personal note textarea (max 500 chars)
  - [ ] 5.2.7.6 Yup validation schema for place form
  - [ ] 5.2.7.7 On save → run `useAddPlace` → immediately open `RatingWidget` for the new place

- [ ] **5.2.8** `PlaceDetail` component (`mode: 'panel' | 'page'` prop)
  - [ ] 5.2.8.1 Place name, country flag, city, visited date
  - [ ] 5.2.8.2 Rating summary — six category bars + mood tag pills
  - [ ] 5.2.8.3 Photo grid (masonry, 2–3 columns)
  - [ ] 5.2.8.4 Personal note
  - [ ] 5.2.8.5 Edit button (opens Add Place modal pre-filled)
  - [ ] 5.2.8.6 "Add to trip" dropdown (user's trips + "New trip" option)
  - [ ] 5.2.8.7 Delete button with confirmation dialog

- [ ] **5.2.9** Wire `PlaceDetail` into map as a slide-in Drawer (desktop)
- [ ] **5.2.10** Create `src/pages/PlaceDetailPage.tsx` — wraps `PlaceDetail` full-screen (mobile + direct nav)
- [ ] **5.2.11** Write tests for `useAddPlace`, `useUpdatePlace`, `useDeletePlace`

---

### 5.3 — Ratings

- [ ] **5.3.1** Create `src/modules/ratings/` structure
- [ ] **5.3.2** Create `useGetRating` hook (single rating by place ID)
- [ ] **5.3.3** Create `useUpsertRating` mutation — uses Supabase `upsert` on `(place_id, user_id)` unique constraint

- [ ] **5.3.4** `RatingWidget` component (receives `placeId` and `existingRating` props)
  - [ ] 5.3.4.1 Step 1 — six dimension sliders/star selectors (1–5), all optional, skip-friendly
  - [ ] 5.3.4.2 Step 2 — mood tags multi-select pill UI, max 4, from `MOOD_TAGS` constant
  - [ ] 5.3.4.3 Step 3 — done screen: summary card showing ratings + "Add photos?" CTA
  - [ ] 5.3.4.4 Step indicator and back navigation between steps
  - [ ] 5.3.4.5 On submit → run `useUpsertRating` → show step 3

- [ ] **5.3.5** Show `RatingWidget` immediately after adding a place (triggered by `useAddPlace` onSuccess)
- [ ] **5.3.6** `RatingWidget` also accessible from `PlaceDetail` edit flow
- [ ] **5.3.7** Write tests for `useUpsertRating`

---

### 5.4 — Photo Upload

- [ ] **5.4.1** Create `src/modules/photos/` structure
- [ ] **5.4.2** Create `useGetPhotos` hook (photos by place ID)
- [ ] **5.4.3** Create `useUploadPhotos` mutation
  - [ ] 5.4.3.1 Client-side validation: max 10 files, 10 MB per file, JPEG/PNG/WebP only
  - [ ] 5.4.3.2 Upload to Supabase Storage at `{userId}/{placeId}/{Date.now()}-{filename}`
  - [ ] 5.4.3.3 Track per-file upload progress
  - [ ] 5.4.3.4 After upload, create `photos` row with `storage_path` and `public_url`
- [ ] **5.4.4** Create `useDeletePhoto` mutation — deletes DB row and storage object in `onSuccess`

- [ ] **5.4.5** Photo upload UI
  - [ ] 5.4.5.1 Multi-file drop zone / file input
  - [ ] 5.4.5.2 Per-file progress bar during upload
  - [ ] 5.4.5.3 Category dropdown + caption input per photo (after upload)
  - [ ] 5.4.5.4 Accessible from `PlaceDetail` and from the post-rating "Add photos?" CTA

- [ ] **5.4.6** Masonry photo grid in `PlaceDetail`
  - [ ] 5.4.6.1 2 columns on mobile, 3 columns on desktop
  - [ ] 5.4.6.2 Use MUI `ImageList` with `variant="masonry"`
  - [ ] 5.4.6.3 Category badge overlay on each photo
  - [ ] 5.4.6.4 Click photo to open full-screen lightbox

- [ ] **5.4.7** Write tests for `useUploadPhotos`, `useDeletePhoto`

---

### 5.5 — Trips

- [ ] **5.5.1** Create `src/modules/trips/` structure
- [ ] **5.5.2** Create `useGetTrips` hook (all trips for current user, sorted by `started_at` desc)
- [ ] **5.5.3** Create `useGetTrip` hook (single trip with joined places and cover photo)
- [ ] **5.5.4** Create `useCreateTrip` mutation
- [ ] **5.5.5** Create `useUpdateTrip` mutation
- [ ] **5.5.6** Create `useDeleteTrip` mutation
- [ ] **5.5.7** Create `useAddPlacesToTrip` mutation
- [ ] **5.5.8** Create `useRemovePlaceFromTrip` mutation

- [ ] **5.5.9** Trips list page (`/trips`)
  - [ ] 5.5.9.1 Card grid sorted by `started_at` descending
  - [ ] 5.5.9.2 Each card: cover photo (or gradient placeholder), title, date range, country count, place count
  - [ ] 5.5.9.3 "New trip" button — opens create modal
  - [ ] 5.5.9.4 Empty state

- [ ] **5.5.10** Create trip modal
  - [ ] 5.5.10.1 Title (required), description (optional), date range (optional)
  - [ ] 5.5.10.2 Yup validation schema
  - [ ] 5.5.10.3 On success → navigate to `/trips/:id`

- [ ] **5.5.11** Trip page (`/trips/:id`)
  - [ ] 5.5.11.1 Hero: cover photo, title, description, date range, stats (countries, cities, photos)
  - [ ] 5.5.11.2 Place list: chronological cards with thumbnail, name, rating summary
  - [ ] 5.5.11.3 "Add places" button — picker from user's existing places (not the full add flow)
  - [ ] 5.5.11.4 Inline edit for title + description
  - [ ] 5.5.11.5 Remove place from trip

- [ ] **5.5.12** "Add to trip" from `PlaceDetail` — dropdown of user's trips with "New trip" option
- [ ] **5.5.13** Write tests for `useCreateTrip`, `useAddPlacesToTrip`

---

### 5.6 — Sticker Album

- [ ] **5.6.1** Create `src/modules/album/` structure (components/, hooks/, hooks/test/)
- [ ] **5.6.2** Data layer — no new API calls needed; reuse `useGetPlaces` (for country grouping + bucket list slots) and `useGetPhotos` (per place, loaded lazily per country section)
- [ ] **5.6.3** Group places by `country_name` / `country_code` on the client — sort countries alphabetically, then by most recently visited

- [ ] **5.6.4** `StickerCard` component
  - [ ] 5.6.4.1 Fixed aspect ratio (portrait, ~2:3 — like a real sticker)
  - [ ] 5.6.4.2 Front: photo image, country flag emoji overlay, place name at bottom
  - [ ] 5.6.4.3 Back: place name, visited date, category badge, caption, mood tags, rating summary (if rated)
  - [ ] 5.6.4.4 CSS flip animation — `transform: rotateY(180deg)`, `transition: 0.4s`, `backface-visibility: hidden`
  - [ ] 5.6.4.5 Click front → flip to back; click back → flip to front
  - [ ] 5.6.4.6 Empty slot variant — placeholder card style for places with no photos yet ("Missing sticker" feel)

- [ ] **5.6.5** `AlbumCountrySection` component
  - [ ] 5.6.5.1 Country name as section header (Playfair Display, large)
  - [ ] 5.6.5.2 Country flag + stats line (X photos · visited date range)
  - [ ] 5.6.5.3 Sticker grid: 3 columns mobile, 5–6 columns desktop
  - [ ] 5.6.5.4 Divider between country sections

- [ ] **5.6.6** `AlbumPage` — `/album`
  - [ ] 5.6.6.1 Vertical scroll through country sections
  - [ ] 5.6.6.2 Sticky country tab bar at top (jump to a country section)
  - [ ] 5.6.6.3 Stats header: total stickers collected (photos) + completion feel (X of Y countries photographed)
  - [ ] 5.6.6.4 Empty state — when no photos exist, show an inviting "Start your collection" prompt
  - [ ] 5.6.6.5 Bucket list countries shown at the bottom with all-empty slots (locked sticker feel)

- [ ] **5.6.7** Theme integration — album page uses the warm cream/parchment light background most prominently; add subtle paper texture via box-shadow on cards

- [ ] **5.6.8** Write tests for the country-grouping logic (pure utility function)

---

### 5.7 — Profile

- [ ] **5.7.1** Create `src/modules/profile/` structure
- [ ] **5.7.2** Create `useGetProfile` hook (current user's profile)
- [ ] **5.7.3** Create `useUpdateProfile` mutation
- [ ] **5.7.4** Create `useUploadAvatar` mutation — uploads to `avatars/{userId}/avatar.{ext}`, updates `profiles.avatar_url`

- [ ] **5.7.5** Profile page (`/profile`)
  - [ ] 5.7.5.1 Avatar display + upload/change button
  - [ ] 5.7.5.2 Username, display name, bio — editable inline or via form
  - [ ] 5.7.5.3 Travel stats: total countries, cities, photos, trips
  - [ ] 5.7.5.4 Light/dark theme toggle
  - [ ] 5.7.5.5 Yup validation for profile fields
  - [ ] 5.7.5.6 Sign out button

- [ ] **5.7.6** Write tests for `useUpdateProfile`

- [ ] **5.8** Commit phase 5
  - [ ] 5.8.1 `git add .`
  - [ ] 5.8.2 `git commit -m "phase 5: feature modules"`
  - [ ] 5.8.3 `git checkout main && git merge phase/5-features`

---

## Phase 6 — Layouts & UI Polish

> **Git:** `git checkout -b phase/6-polish`

- [ ] **6.1** Layout components
  - [ ] 6.1.1 Create `src/layouts/AppShell.tsx` — top navigation bar with logo, nav links, user avatar
  - [ ] 6.1.2 Map page uses full-viewport layout (no padding, nav overlays the map)
  - [ ] 6.1.3 Other pages use standard padded layout

- [ ] **6.2** Global UI states
  - [ ] 6.2.1 Loading skeleton components for place cards, trip cards
  - [ ] 6.2.2 `ErrorBoundary` component wrapping the router
  - [ ] 6.2.3 Reusable `EmptyState` component (icon + heading + CTA)

- [ ] **6.3** Animations + micro-interactions
  - [ ] 6.3.1 Map pin fade-in on load
  - [ ] 6.3.2 Country fill fade-in transition
  - [ ] 6.3.3 Drawer slide-in transition (MUI Drawer default is sufficient)
  - [ ] 6.3.4 Rating widget step transitions

- [ ] **6.4** Constants audit
  - [ ] 6.4.1 Search for inline strings in components — move all to `src/constants/const.ts`
  - [ ] 6.4.2 Search for inline enums — move all to `src/constants/enum.ts`

- [ ] **6.5** Commit phase 6
  - [ ] 6.5.1 `git add .`
  - [ ] 6.5.2 `git commit -m "phase 6: layouts & UI polish"`
  - [ ] 6.5.3 `git checkout main && git merge phase/6-polish`

---

## Phase 7 — Testing

> **Git:** `git checkout -b phase/7-testing`

- [ ] **7.1** Hook coverage
  - [ ] 7.1.1 All auth hooks
  - [ ] 7.1.2 `useGetPlaces`, `useAddPlace`, `useUpdatePlace`, `useDeletePlace`
  - [ ] 7.1.3 `useUpsertRating`
  - [ ] 7.1.4 `useUploadPhotos`, `useDeletePhoto`
  - [ ] 7.1.5 `useCreateTrip`, `useAddPlacesToTrip`
  - [ ] 7.1.6 `useUpdateProfile`

- [ ] **7.2** Component coverage
  - [ ] 7.2.1 `RatingWidget` — step navigation, submit
  - [ ] 7.2.2 Add Place modal — validation, geocoding results
  - [ ] 7.2.3 `PlaceDetail` — panel and page modes

- [ ] **7.3** Coverage report
  - [ ] 7.3.1 Run `npm run test:coverage`
  - [ ] 7.3.2 Target >70% on hooks and form components

- [ ] **7.4** Commit phase 7
  - [ ] 7.4.1 `git add .`
  - [ ] 7.4.2 `git commit -m "phase 7: testing"`
  - [ ] 7.4.3 `git checkout main && git merge phase/7-testing`

---

## Phase 8 — Deployment

> **Git:** `git checkout -b phase/8-deployment`

- [ ] **8.1** Build verification
  - [ ] 8.1.1 `npm run build` — zero TypeScript errors, zero build warnings
  - [ ] 8.1.2 `npm run preview` — smoke-test the production build locally

- [ ] **8.2** Vercel setup
  - [ ] 8.2.1 Connect GitHub repo to Vercel project
  - [ ] 8.2.2 Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_MAPTILER_KEY` in Vercel environment variables
  - [ ] 8.2.3 Add Vercel production URL to Supabase allowed redirect URLs
  - [ ] 8.2.4 Update MapTiler key domain restriction to include production domain

- [ ] **8.3** Deploy and verify
  - [ ] 8.3.1 Trigger production deploy
  - [ ] 8.3.2 Smoke-test all critical flows: sign up → onboarding → add place → rate → photo upload → create trip → profile
  - [ ] 8.3.3 Verify RLS policies work correctly in production
  - [ ] 8.3.4 Test on mobile (390px) — confirm place detail full-page route, FAB position, 2-column photo grid

- [ ] **8.4** Final commit
  - [ ] 8.4.1 `git add .`
  - [ ] 8.4.2 `git commit -m "phase 8: deployment"`
  - [ ] 8.4.3 `git checkout main && git merge phase/8-deployment`

---

## Definition of Done — Phase 1

A user can:

- [ ] Sign up with email, complete onboarding (username + avatar)
- [ ] Log in and see their world map
- [ ] Search for a place, add it, and see a pin appear on the map
- [ ] Rate that place across all 6 dimensions with mood tags
- [ ] Upload photos to a place and categorise them
- [ ] See visited countries filled on the world map
- [ ] View place detail panel/page with ratings and photos
- [ ] Create a trip, add places to it, view the trip page
- [ ] Edit and delete places
- [ ] View the sticker album — photos organised by country as flip cards
- [ ] Flip a sticker to see metadata on the back
- [ ] View and edit their profile (username, avatar, bio)
- [ ] Toggle between light and dark theme
- [ ] Log out and log back in, seeing all their data persisted

All of the above works correctly on desktop (1280px+) and mobile (390px).
