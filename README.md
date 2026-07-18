# Kickoff — Sports News & Livescores (Gen Z)

Dark-mode, mobile-first sports app with live scores, breaking stories, standings and fixtures. Built with TanStack Start + Tailwind v4.

## Live data

Live matches are fetched by `src/lib/football-api.functions.ts` (a TanStack server function) from **Football-Data.org**. Without an API key the app transparently serves mock data — the UI never breaks when the free 10 req/min limit is hit.

To enable real data, add the secret in Lovable (Cloud → Secrets) or your `.env`:

```
FOOTBALL_DATA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

Get a free key: https://www.football-data.org/client/register

## cPanel MySQL (custom articles)

The DB layer is intentionally decoupled so you can host writes on **cPanel MySQL**:

1. In cPanel → **MySQL Databases** create a DB + user and grant all privileges.
2. cPanel → **Remote MySQL** — add the IP of wherever you'll run the API from.
3. cPanel → **phpMyAdmin** — run `database/schema.sql`.
4. Copy `.env.example` → `.env` and fill in `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

Tables: `articles`, `categories`, `reactions`, `comments` (see the SQL file).

When you want to wire it up, add a server function like `src/lib/articles.functions.ts` that uses `mysql2/promise` and reads `process.env.DB_*` inside the handler.

## Features

- Scrolling **Live Matches ticker** with pulsing LIVE dot (pauses on touch).
- **Hero slider** with swipe + snap for breaking stories.
- **Article grid** with tag badges, Fire/Hyped reactions, share sheet (native `navigator.share`), inline comments.
- **Standings** widget (PL / La Liga / Serie A / UCL) + upcoming **Fixtures**.
- **Bottom nav** (thumb-friendly) with Feed / Live / Leagues / Me tabs.
- Dark theme with neon purple / green / pink / cyan design tokens.
