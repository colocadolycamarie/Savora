# Savora — Fine Dining Web Experience

A full-stack restaurant site: reservations, gift cards, and a contact form,
all backed by a real API and database — plus an editorial home/menu/about
experience. Built as a portfolio piece with production practices (typed API
contract, real validation, automated tests, CI) rather than a UI mockup.

**Stack:** React 19 + TypeScript + Vite + Tailwind v4 + wouter (frontend) ·
Express 5 + Drizzle ORM + Postgres (backend) · Zod-validated, OpenAPI-driven
API contract, code-generated into both the server's validation schemas and
the frontend's React Query hooks · Vitest + Supertest + React Testing Library
(tests) · GitHub Actions (CI).

## Project Status

### ✅ Implemented
- **Frontend** (`apps/savora`) — every page is real and interactive: Home,
  Menu (search/filter/favorites), Reservations, Gift Cards, About, Contact,
  Privacy, Terms, 404. Client-side validation, accessible labeling, loading/
  empty/error states throughout.
- **Backend** (`apps/api-server`) — Express API with real endpoints:
  `GET /api/availability`, `POST /api/reservations`, `POST /api/gift-cards`,
  `POST /api/contact`, `GET /api/healthz`. Server-side validation (Zod,
  generated from the OpenAPI spec), consistent error responses, real seat-
  availability logic computed from actual bookings in the database.
- **Database** (`packages/db`) — Drizzle ORM schema for reservations, gift
  cards, and contact messages, backed by Postgres. Reservations and gift
  cards persist for real and survive a refresh.
- **API contract** (`packages/api-spec`) — a single OpenAPI spec is the
  source of truth. `orval` generates the server's Zod validation schemas
  (`packages/api-zod`) and the frontend's React Query hooks
  (`packages/api-client-react`) from it, so the client and server can't
  silently drift out of sync.
- **Tests** — 21 API integration tests (Vitest + Supertest, run against a
  real Postgres test database) and 30 frontend unit/component tests (Vitest
  + React Testing Library). `npm run test` from the repo root runs both.
- **CI** (`.github/workflows/ci.yml`) — on every push/PR: typecheck, spin up
  a real Postgres service container, run both test suites, build every
  package.

### 🚧 Deliberately out of scope
- **No payments** — gift card checkout is explicit about being simulated
  ("no real payment is processed"). Wiring a real payment gateway (Stripe,
  PayMongo, etc.) is a separate, security-sensitive piece of work.
- **No auth / accounts** — there's no login, so "favorites" persist to
  `localStorage` per-browser rather than to a user record.
- **No email delivery** — reservation/gift-card confirmations show on
  screen; no transactional email service (Resend, SendGrid) is wired up.
- **No admin dashboard** — reservations, gift cards, and contact messages
  are stored but there's no UI to view/manage them; a restaurant would need
  one before this could run for real.

## Run it locally

You'll need Node.js 20+ and a Postgres database (a free one from
[Neon](https://neon.tech) or [Supabase](https://supabase.com) works fine, or
run Postgres locally).

```bash
npm install                    # from the repo root
cp .env.example .env           # then fill in DATABASE_URL, TEST_DATABASE_URL
npm run push -w @workspace/db  # create the tables
npm run dev                    # runs api-server + savora together
```

Frontend: `http://localhost:5173`. API: `http://localhost:5000`.

## Run the tests

```bash
npm run push:test -w @workspace/db   # prepare the test database's schema
npm run test                         # API tests + frontend tests
```

The API test suite truncates its tables between tests, so point
`TEST_DATABASE_URL` at a throwaway database — never at the same database as
`DATABASE_URL`.

## Changing the API

The OpenAPI spec (`packages/api-spec/openapi.yaml`) is the source of truth.
To add or change an endpoint:

1. Edit `openapi.yaml`.
2. Regenerate the generated packages: `cd packages/api-spec && npx orval`.
3. Implement the route in `apps/api-server/src/routes/`, using the generated
   Zod schema from `@workspace/api-zod` to validate the request.
4. Call it from the frontend using the generated hook from
   `@workspace/api-client-react` (e.g. `useCreateReservation()`).

## Build

```bash
npm run build   # typechecks + builds every package
```
