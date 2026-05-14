# Wandermark

Wandermark is a private travel journal where you log visited places with multi-dimensional ratings and photos, then see your entire life of travel rendered as a beautiful, personalised world map. It treats your opinion of a place as structured data across six dimensions — making your travel history reflective and queryable over time, not just a photo album.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (strict) |
| UI | MUI v6 |
| Server state | React Query (@tanstack/react-query) |
| Forms | React Hook Form + Yup |
| Routing | React Router v6 |
| Backend | Supabase (database, auth, storage) |
| Map | MapLibre GL JS + react-map-gl |
| Map tiles + geocoding | MapTiler (free tier) |
| Build | Vite |
| Tests | Vitest + React Testing Library |

## Getting Started

1. Clone the repo and navigate to this app: `cd apps/indie-hub/wandermark`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Add your Supabase credentials and MapTiler API key to `.env`
5. Start the dev server: `npm run dev`

## Prerequisites

- [Supabase](https://supabase.com) project with the schema from `docs/DATABASE.md` applied
- [MapTiler](https://www.maptiler.com) free account — generate an API key and restrict it to your domain(s)

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database Design](docs/DATABASE.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Brainstorm](docs/BRAINSTORM.md)
