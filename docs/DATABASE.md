# Database Design — Wandermark

> Backend: Supabase (PostgreSQL + RLS + Auth)

## Overview

Six tables cover the full data model: users extend `auth.users` via `profiles`, log places with coordinates and metadata, attach multi-dimensional `ratings` and `photos` to each place, and group places into `trips` via a `trip_places` join table. RLS is enabled on all tables — every row is owner-only in Phase 1.

## Tables

### `profiles`

Extends `auth.users` — stores public-facing user data. Created automatically on sign-up via a database trigger (do not rely on the frontend for this).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key — references `auth.users(id) ON DELETE CASCADE` |
| `username` | `text` | Unique, not null |
| `display_name` | `text` | Nullable |
| `avatar_url` | `text` | Nullable |
| `bio` | `text` | Nullable |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**RLS policies:**
- `SELECT`: public (anyone can read profiles — enables Phase 2 social features without schema change)
- `INSERT`: owner only (`auth.uid() = id`)
- `UPDATE`: owner only (`auth.uid() = id`)

---

### `places`

A visited (or bucket-list) location logged by a user. Coordinates come from MapTiler geocoding.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, `gen_random_uuid()` |
| `user_id` | `uuid` | References `profiles(id) ON DELETE CASCADE` |
| `name` | `text` | Not null |
| `country_code` | `char(2)` | ISO 3166-1 alpha-2 |
| `country_name` | `text` | Not null |
| `city` | `text` | Nullable |
| `latitude` | `numeric(9,6)` | Not null |
| `longitude` | `numeric(9,6)` | Not null |
| `maptiler_place_id` | `text` | From MapTiler geocoding response |
| `visited_at` | `date` | Nullable — month + year only |
| `notes` | `text` | Private personal note, nullable |
| `is_bucket_list` | `boolean` | Default false |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

```sql
create table places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  country_code char(2) not null,
  country_name text not null,
  city text,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  maptiler_place_id text,
  visited_at date,
  notes text,
  is_bucket_list boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**RLS policies:** owner-only for all operations.

---

### `ratings`

One rating row per place per user. All six dimension scores are optional (nullable). Uses `UNIQUE(place_id, user_id)` — upsert on the frontend.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `place_id` | `uuid` | References `places(id) ON DELETE CASCADE` |
| `user_id` | `uuid` | References `profiles(id) ON DELETE CASCADE` |
| `food_drink` | `smallint` | 1–5, nullable |
| `safety` | `smallint` | 1–5, nullable |
| `beauty` | `smallint` | 1–5, nullable |
| `value_for_money` | `smallint` | 1–5, nullable |
| `vibe` | `smallint` | 1–5, nullable |
| `ease_of_travel` | `smallint` | 1–5, nullable |
| `mood_tags` | `text[]` | Default `{}`, max 4 tags selected |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

```sql
create table ratings (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  food_drink smallint check (food_drink between 1 and 5),
  safety smallint check (safety between 1 and 5),
  beauty smallint check (beauty between 1 and 5),
  value_for_money smallint check (value_for_money between 1 and 5),
  vibe smallint check (vibe between 1 and 5),
  ease_of_travel smallint check (ease_of_travel between 1 and 5),
  mood_tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(place_id, user_id)
);
```

**RLS policies:** owner-only for all operations.

---

### `photos`

Photos attached to a place. Stored in Supabase Storage (`photos` bucket, public + RLS). Storage path pattern: `{user_id}/{place_id}/{timestamp}-{filename}`.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `place_id` | `uuid` | References `places(id) ON DELETE CASCADE` |
| `user_id` | `uuid` | References `profiles(id) ON DELETE CASCADE` |
| `storage_path` | `text` | Supabase Storage path, not null |
| `public_url` | `text` | Public URL, not null |
| `caption` | `text` | Nullable, 280 char limit enforced on frontend |
| `private_note` | `text` | Nullable |
| `category` | `text` | Enum: `food`, `landscape`, `architecture`, `people`, `nightlife`, `transport`, `art`, `other` |
| `taken_at` | `date` | Nullable |
| `created_at` | `timestamptz` | Default `now()` |

```sql
create table photos (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  storage_path text not null,
  public_url text not null,
  caption text,
  private_note text,
  category text check (category in ('food','landscape','architecture','people','nightlife','transport','art','other')) default 'other',
  taken_at date,
  created_at timestamptz default now()
);
```

**RLS policies:** owner-only for all operations.

---

### `trips`

A named collection of places. Cover photo is set automatically from the first photo of the first place added.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | References `profiles(id) ON DELETE CASCADE` |
| `title` | `text` | Not null |
| `description` | `text` | Nullable |
| `cover_photo_id` | `uuid` | References `photos(id) ON DELETE SET NULL` |
| `started_at` | `date` | Nullable |
| `ended_at` | `date` | Nullable |
| `is_public` | `boolean` | Default false — Phase 2 sharing feature |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Default `now()` |

```sql
create table trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  cover_photo_id uuid references photos(id) on delete set null,
  started_at date,
  ended_at date,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**RLS policies:** owner-only for all operations.

---

### `trip_places`

Join table — many-to-many between trips and places.

| Column | Type | Notes |
|---|---|---|
| `trip_id` | `uuid` | References `trips(id) ON DELETE CASCADE` |
| `place_id` | `uuid` | References `places(id) ON DELETE CASCADE` |
| `added_at` | `timestamptz` | Default `now()` |

```sql
create table trip_places (
  trip_id uuid references trips(id) on delete cascade,
  place_id uuid references places(id) on delete cascade,
  added_at timestamptz default now(),
  primary key (trip_id, place_id)
);
```

**RLS policy:** access controlled via trip ownership.

```sql
create policy "Users can manage their trip places" on trip_places
  using (exists (select 1 from trips where trips.id = trip_id and trips.user_id = auth.uid()));
```

---

## Full RLS Setup

```sql
-- profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- places
alter table places enable row level security;
create policy "Users can view their own places" on places for select using (auth.uid() = user_id);
create policy "Users can insert their own places" on places for insert with check (auth.uid() = user_id);
create policy "Users can update their own places" on places for update using (auth.uid() = user_id);
create policy "Users can delete their own places" on places for delete using (auth.uid() = user_id);

-- ratings
alter table ratings enable row level security;
create policy "Users can view their own ratings" on ratings for select using (auth.uid() = user_id);
create policy "Users can insert their own ratings" on ratings for insert with check (auth.uid() = user_id);
create policy "Users can update their own ratings" on ratings for update using (auth.uid() = user_id);
create policy "Users can delete their own ratings" on ratings for delete using (auth.uid() = user_id);

-- photos
alter table photos enable row level security;
create policy "Users can view their own photos" on photos for select using (auth.uid() = user_id);
create policy "Users can insert their own photos" on photos for insert with check (auth.uid() = user_id);
create policy "Users can update their own photos" on photos for update using (auth.uid() = user_id);
create policy "Users can delete their own photos" on photos for delete using (auth.uid() = user_id);

-- trips
alter table trips enable row level security;
create policy "Users can view their own trips" on trips for select using (auth.uid() = user_id);
create policy "Users can insert their own trips" on trips for insert with check (auth.uid() = user_id);
create policy "Users can update their own trips" on trips for update using (auth.uid() = user_id);
create policy "Users can delete their own trips" on trips for delete using (auth.uid() = user_id);

-- trip_places
alter table trip_places enable row level security;
create policy "Users can manage their trip places" on trip_places
  using (exists (select 1 from trips where trips.id = trip_id and trips.user_id = auth.uid()));
```

---

## Database Trigger — Auto-create Profile on Sign-up

Creates a `profiles` row automatically when a new user signs up. Do not rely on the frontend for this.

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    split_part(new.email, '@', 1) || '_' || substr(gen_random_uuid()::text, 1, 4),
    split_part(new.email, '@', 1)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## Storage Buckets

### `photos`

Stores user-uploaded place photos. Public bucket — URLs don't expire. Storage RLS enforces per-user access.

| Setting | Value |
|---|---|
| Bucket name | `photos` |
| Public | `true` |
| File size limit | 10 MB |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |
| Path pattern | `{user_id}/{place_id}/{timestamp}-{filename}` |

```sql
create policy "Users can upload their own photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own photos"
  on storage.objects for select
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
```

### `avatars`

Stores user profile pictures.

| Setting | Value |
|---|---|
| Bucket name | `avatars` |
| Public | `true` |
| File size limit | 2 MB |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |
| Path pattern | `{user_id}/avatar.{ext}` |

---

## Type Generation

After the schema is stable, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
```

Re-run this command whenever the schema changes.

## Naming Conventions

- Tables: `snake_case`, plural
- Foreign keys: `<table_singular>_id`
- Timestamps: `created_at`, `updated_at` on every table
- Booleans: default to `false`, prefixed with `is_`
