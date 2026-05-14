# BRAINSTORM — Wandermark

## Project Summary

Wandermark is a private travel journal where you log visited places with multi-dimensional ratings and photos, then see your entire life of travel rendered as a beautiful, personalised world map.

## Why It Exists

Most travel apps are either social-first (Polarsteps, Beenzer) or utility-first (Google Maps saved places, TripAdvisor). Neither gives you a rich, private journal that doubles as a visual autobiography of your travels. The pain: you have hundreds of travel memories scattered across phone photos, notes, and Instagram posts with no structured way to reflect on them — what you thought of a place, what your travel style says about you, and how far you've actually come.

## Who It's For

A 25–38 year old frequent traveller (2–6 trips/year) who is intentional about their experiences, values their own opinion over crowdsourced reviews, and wants to build a personal record that grows richer over time. Not a backpacker chasing hostels — someone who cares about their food experiences in Lisbon as much as the hike in the Azores.

## Why Choose This Over Alternatives

- **Polarsteps** — beautiful realtime tracking, but weak on retrospective logging, zero rating depth, social-first
- **Visited** — only tracks countries, no journal/photo/rating layer
- **Google Maps Saved** — powerful but zero journaling, no trip narrative, not private
- **Wandermark** wins by being the only private-first journal with multi-dimensional ratings + map visualisation in one clean product

---

## Refined Concept

**Improvement 1 — Travel Insights page (strong V2 pitch)**
The multi-dimensional rating system is the real product differentiator, but in Phase 1 it has no payoff beyond the place detail. A `/insights` page (V2) showing radar charts of average ratings per country/region, most-consistent mood tags, and a "travel fingerprint" transforms Wandermark from a journal into a self-discovery tool — a much stronger hook for retention and sharing.

**Improvement 2 — The hero flow should feel like ceremony**
The post-add flow (add → rate → photo) is the core loop. Make it feel intentional and rewarding, not like filling a form. Full-screen modal with soft animations between steps, a completion moment, and a map zoom-to-pin after save. These are what make people open the app again.

**Weakest assumption to challenge:**
> "Users will rate 6 dimensions every time they add a place."

They won't — especially for places added retroactively. The rating widget must be optional-first and skippable. All dimensions are optional by design, but the UX must make skipping guilt-free, not hidden. The value of ratings compounds over time — the goal is to keep users logging places, even without ratings.

---

## Features

### MVP
- Email/password + magic link auth with profile setup (username, avatar)
- Add visited places via MapTiler geocoding search
- Bucket list flag (want to go vs. been here)
- Multi-dimensional ratings (6 categories + mood tags), all optional
- Photo upload to Supabase Storage with category tagging
- Interactive world map: country fills + city pins (MapLibre GL JS)
- Place detail panel (slide-in on desktop, full page on mobile)
- Trip grouping: create trips, add places, view trip page
- Stats bar: countries · cities · photos count
- Edit and delete places
- View and edit own profile
- Sticker album (`/album`) — photos organised by country as collectible sticker cards with a flip animation showing metadata on the back

### V2
- Travel Insights / stats page (radar charts, travel fingerprint, top-rated destinations)
- Public profiles + trip sharing with privacy controls
- Social: "Been there too" + friend map overlay
- Activity feed (friend-facing)
- Custom mood tags
- Trip highlight reel (best-rated moments from a trip)
- Year in Travel recap (auto-generated)

### Future
- AI narrative generator from notes + ratings
- AI photo tagger (auto-categorise on upload)
- Printed poster / trip book PDF export
- Mobile app (React Native + shared Supabase backend)
- Stripe/LemonSqueezy freemium gating (unlimited trips/photos for premium)
- Offline support + PWA

---

## Target Audience

**Primary:** Independent frequent traveller, 25–38, professional income, travels deliberately, values personal reflection and aesthetics over social validation.

**Secondary:** Digital nomad or travel blogger who wants structured private records separate from public content.

**Top 3 pain points addressed:**
1. Travel memories decay fast and end up scattered across apps and photos
2. Can't remember what you actually thought of a place years later
3. No way to visualise the shape of your travels as a whole

---

## Competitors & Differentiators

| Competitor | What they do | Wandermark edge |
|---|---|---|
| Polarsteps | Realtime trip tracking, social map | Private-first, multi-dimensional ratings, retrospective-friendly |
| Visited | Country counter + world map | City-level precision, journal depth, photo layer, trip narratives |
| Google Maps (Saved) | Save + review places | Private journal tone, trip organisation, visual identity |

**Key differentiator:** The only app that treats your opinion of a place as structured multi-dimensional data — making your travel history reflective and queryable over time, not just a photo album.

---

## Monetization

| Model | Potential | Notes |
|---|---|---|
| Freemium (free core, trips/photos behind paywall) | Medium | Natural upgrade after 3 trips or 50 photos |
| One-time purchase (€9–15 lifetime) | Medium-High | Indie audience fit — no subscription anxiety |
| Premium Insights + AI features | High (V2) | Radar charts and travel fingerprint feel premium |
| Print shop (poster exports) | Low-Medium | High margin, V3 territory |

**Recommendation for launch:** Free with a single paid upgrade (lifetime or annual). LemonSqueezy over Stripe — handles EU VAT automatically, simpler for solo devs.

---

## Complexity Estimate

| Area | Score (1–5) | Notes |
|---|---|---|
| Frontend | 4 | Mapbox GL, slide-in panel + page duality, masonry grid, multi-step rating wizard |
| Backend | 3 | Well-defined schema, RLS, Supabase Storage — no complex server logic in Phase 1 |
| Auth | 2 | Standard Supabase auth + DB trigger for profile creation |
| Realtime | 1 | None in Phase 1 |
| Mobile | 3 | Responsive layouts with two UX patterns for the same place detail component |

---

## Core User Flows

**1. Onboarding (first-time user)**
Sign up → email verified → redirect `/onboarding` → set username + upload avatar → redirect `/map` → empty map with "Add your first place" prompt

**2. Log a visited place (core loop)**
Click FAB → type place name → select from geocoding results → set visited date + optional note → Save → Rating widget (step 1: 6 dimensions → step 2: mood tags → step 3: done screen) → "Add photos?" CTA → map pin appears, country fill activates

**3. Explore my map**
Land on `/map` → see filled countries + city pins → hover pin for tooltip → click pin → place detail panel slides in → review ratings, photos, notes → edit or assign to trip

**4. Create and manage a trip**
Go to `/trips` → New Trip → set title + date range → view empty trip page → Add places (picker from existing places) → trip stats update → view trip page with place list + cover photo

**5. View and edit a place**
Click pin or navigate `/places/:id` → full detail → click Edit → pre-filled form → save → detail updates

---

## UI/UX Direction

**Design style:** Explorer aesthetic — warm, editorial, tactile. Feels like a well-worn travel journal, not a tech dashboard. Dual light/dark theme with a shared accent colour. The map and album are both hero surfaces.

**Explorer theme palette:**
```
Light mode
  Background : #FAF7F2  (warm cream/parchment)
  Surface    : #FFFFFF
  Text       : #1A1208  (near-black ink)
  Accent     : #C4692A  (burnt sienna)
  Border     : #E8E0D5

Dark mode
  Background : #120F0A  (dark ink)
  Surface    : #1E1810
  Text       : #F5ECD7  (warm cream)
  Accent     : #D4834A  (warm amber)
```

**Fonts (Google Fonts via @fontsource):**
- `Playfair Display` — headings, page titles, album section headers (editorial, National Geographic feel)
- `DM Sans` — body text, UI labels, form inputs (clean, readable)

**Key interaction patterns:**
- Map as primary navigation surface — everything starts and returns to the map
- Album as the secondary navigation surface — a tactile, scroll-through view of your photos
- Slide-in panels (not full modals) for place details on desktop
- Multi-step flows for add + rate — never a single long-scroll form
- Pins animate in on load; country fills fade in gracefully
- Sticker flip animation (CSS `rotateY`) — front shows photo, back shows metadata

**Mobile-first considerations:**
- Place detail is a full-page route on mobile (`/places/:id`), not a panel
- FAB always visible above the map controls
- Rating widget renders as a bottom sheet on mobile
- Photos in 2-column masonry grid on small screens (3-column on desktop)
- Album uses 3-column sticker grid on mobile, 5–6 columns on desktop

---

## Page Inventory

| Route | Purpose | Key Components | Primary Action |
|---|---|---|---|
| `/login` | Auth entry | Email/password form, magic link option | Sign in / sign up |
| `/onboarding` | First-time profile setup | Username input, avatar upload | Complete profile |
| `/map` | Hero screen — visualise all travel | MapLibre map, country fills, city pins, stats bar, FAB | Add place / click pin |
| `/places/:id` | Full-page place detail (mobile + direct nav) | Place header, rating bars, photo grid, trip assign | Edit / add photos |
| `/trips` | All trips overview | Trip card grid | Create trip / open trip |
| `/trips/:id` | Single trip narrative | Hero cover, place list, stats | Add places / edit |
| `/album` | Sticker album — photos by country | Country section headers, sticker grid, flip cards | Browse / flip sticker |
| `/profile` | Own profile + settings | Avatar, username, bio, travel stats | Update profile |

---

## Architecture Notes

### Supabase Tables (MVP)

| Table | Purpose |
|---|---|
| `profiles` | Extends auth.users — username, avatar, bio |
| `places` | A logged location with coordinates, visited date, notes, bucket list flag |
| `ratings` | One row per place per user — 6 numeric dimensions + mood_tags array |
| `photos` | Photos attached to a place — path + public_url from Supabase Storage |
| `trips` | A named collection of places with date range and cover photo |
| `trip_places` | Join table — many-to-many between trips and places |

### State Management

React Query for all server state (places, trips, ratings, photos). Local state for:
- Map viewport (`useRef` to the MapLibre map instance — not React state)
- Slide-in panel open/close + selected place ID
- Multi-step rating wizard current step index
- Photo upload queue and per-file progress

No Zustand or additional Context beyond the standard Auth context pattern.

### Third-Party Integrations

| Integration | Purpose | Phase |
|---|---|---|
| MapLibre GL JS + react-map-gl | Interactive map (globe), country fills, city pins | Phase 1 |
| MapTiler | Free map tiles + geocoding API (100k req/month, no card required) | Phase 1 |
| Supabase Storage (public bucket + RLS) | Photo uploads with per-user path isolation | Phase 1 |
| @fontsource/playfair-display | Self-hosted Playfair Display font (headings) | Phase 1 |
| @fontsource/dm-sans | Self-hosted DM Sans font (body) | Phase 1 |
| LemonSqueezy | Payments + EU VAT handling for premium tier | Phase 2 |
| Posthog or Plausible | Privacy-friendly analytics | Phase 1 launch |

### Stack Deviations from Standard

**MapLibre GL JS + `react-map-gl` + MapTiler** — MapLibre is the open-source fork of Mapbox GL JS; same API, no vendor lock-in, no credit card required. MapTiler provides free map tiles and geocoding (100k requests/month free). `react-map-gl` v7 (Visgl) supports MapLibre as a drop-in backend. Env var is `VITE_MAPTILER_KEY`. Required new dependencies: `maplibre-gl`, `react-map-gl`.

**Supabase Storage: public bucket + RLS** — Photos served directly via public URL. Storage RLS policies enforce per-user access (`(storage.foldername(name))[1] = auth.uid()::text`). Avoids signed URL expiry complexity with no meaningful security trade-off for a personal journal.

**Form validation: Yup** — Matches project-wide convention (React Hook Form + Yup resolvers). The Zod schemas in the project brief are translated to Yup equivalents during implementation.

**No Tailwind** — Brief referenced it but the design token section was incomplete, and it conflicts with the MUI-only styling convention. All design tokens live in `src/theme.ts`.

**Explorer theme + dual light/dark mode** — Replaces the original dark-only `#E8FF47` direction. MUI v6 `createTheme` with `colorSchemes` (light + dark) and CSS variables. Palette: warm cream/parchment light + dark ink dark, burnt sienna accent. Fonts: Playfair Display (headings) + DM Sans (body) via `@fontsource` packages.

**Sticker album (`/album`)** — No extra libraries needed. Fixed-size card grid per country, CSS `rotateY(180deg)` flip transition for front/back. Front: photo. Back: metadata (caption, date, category, location, mood tags). Empty slots use a placeholder card style for places without photos.

### Risks & Gotchas

**MapTiler key exposure:** `VITE_MAPTILER_KEY` is a public env var. Restrict it to your domain(s) in the MapTiler dashboard before deploying — URL restrictions are the only scraping protection. **Prerequisite: create a free MapTiler account and generate an API key before starting implementation.**

**Country fill layer matching:** Country boundary data comes from a GeoJSON/topojson source (e.g. `natural-earth-vector` or MapTiler's own tileset). The feature property for ISO codes varies by source — confirm the exact property name (`iso_a2`, `ISO_A2`, `ADM0_A3`) during map setup and test edge cases (Kosovo, Taiwan, territories).

**Slide-in panel + route duality:** `PlaceDetail` must work as a `Drawer` on desktop and a full-page route on mobile. Use a `mode: 'panel' | 'page'` prop and conditionally wrap — implement this correctly from the start, not as a retrofit.

**Photo public URL permanence:** Public URLs from Supabase Storage don't expire. If a user deletes a photo, the DB row is removed but the storage object must be explicitly deleted too — handle this in the delete mutation's `onSuccess`.
