# Artist OS

Artist OS is a production-minded MVP for independent musicians to manage releases, campaigns, content, analytics, fans, and tasks in one place.

## Stack

- Next.js 16 with App Router and TypeScript
- Tailwind CSS 4
- Prisma ORM with PostgreSQL
- NextAuth credentials authentication with a Prisma adapter
- Zod validation
- React Hook Form for user-facing forms
- Recharts for dashboard visualizations
- Vitest and Testing Library for focused test coverage

## Architecture

The app is organized as a modular monolith:

- `src/app`: routes, layouts, metadata routes, and server actions
- `src/components`: UI primitives, layout pieces, charts, and forms
- `src/db`: Prisma client setup and database query modules
- `src/lib`: auth, route guards, utilities, presentation helpers, and validation schemas
- `src/services`: orchestration layer between routes and data access
- `prisma`: schema, migrations, and seed data

This keeps route components lean, gives future integrations a clean entry point, and avoids tightly coupling the UI to Prisma queries.

## Environment Variables

Copy the template first:

```bash
cp .env.example .env
```

Required in all environments:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: full public URL for the current environment
- `NEXTAUTH_SECRET`: long random secret for session signing

Local-only seed defaults:

- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`

Production guidance:

- Use a managed PostgreSQL URL with SSL enabled.
- Set `NEXTAUTH_URL` to the production domain, for example `https://app.example.com`.
- Generate `NEXTAUTH_SECRET` with a strong random value and store it only in your hosting provider's secret manager.
- Do not keep demo seed credentials enabled for production operators unless you intentionally want that access path.

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Start PostgreSQL.

If you want the quickest local setup, use Docker Compose:

```bash
docker compose up -d db
```

3. Generate Prisma Client and run the local migration.

```bash
npm run db:generate
npm run db:migrate -- --name init
```

4. Seed local demo data.

```bash
npm run db:seed
```

5. Start the app.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Login

- Email: `demo@artistos.app`
- Password: `artistos-demo-password`

You can override those values in `.env` before running the seed script.

## Migration Commands

Development:

```bash
npm run db:migrate -- --name your_change_name
npm run db:generate
```

Production-safe deploy commands:

```bash
npm run db:migrate:status
npm run db:migrate:deploy
```

Important:

- Use `prisma migrate dev` only in local development.
- Use `prisma migrate deploy` in staging and production.
- Do not use `db push` against a production database for this app.

## Seeding

Local seed:

```bash
npm run db:seed
```

The seed creates:

- a demo user and artist profile
- releases and tracks across multiple statuses
- campaigns, content items, fans, tasks, and metric snapshots

Production note:

- Do not run the demo seed against production unless you intentionally want demo data there.

## Testing And Verification

Run the full quality checks:

```bash
npm run lint
npm exec tsc -- --noEmit
npm run test
```

Build verification:

```bash
npm run build
```

## Deployment Recommendation

Recommended MVP stack:

- Frontend: Vercel
- Database: Neon Postgres

Why this pairing:

- Vercel is the simplest credible option for a Next.js App Router app.
- Neon gives you managed PostgreSQL with standard connection strings and pooled connections, which fits Prisma well for an MVP.
- This avoids building custom infrastructure before the product proves itself.

Reasonable alternative:

- Railway for both app hosting and PostgreSQL if you want fewer vendors and are comfortable with a slightly more manual Next.js deployment setup.

## Deployment Notes

### Frontend

- Connect the repo to Vercel.
- Set the production environment variables there.
- Build command: `npm run build`
- Start command: `npm run start`

### Database

- Create a managed PostgreSQL database.
- Copy the production connection string into `DATABASE_URL`.
- Prefer a pooled connection string if your provider offers one.

### Prisma In Production

- Commit the `prisma/migrations` directory to source control.
- Apply schema changes in deployment with:

```bash
npm run db:migrate:deploy
```

- Run migrations in CI/CD or a release step, not from a developer laptop against production.
- Keep `prisma` available during the migration step because `migrate deploy` depends on it.

### Auth Security

- Set `NEXTAUTH_URL` to the exact production domain.
- Set a strong `NEXTAUTH_SECRET`.
- Use HTTPS in production.
- Rotate the secret deliberately, because changing it invalidates existing sessions.
- Keep credentials auth rate-limited at the hosting edge or proxy layer if traffic grows beyond MVP scale.

### App Branding And Fallback UX

The app now includes:

- metadata defaults in `src/app/layout.tsx`
- placeholder generated icons in `src/app/icon.tsx` and `src/app/apple-icon.tsx`
- a web manifest in `src/app/manifest.ts`
- a root error boundary in `src/app/error.tsx`
- a basic not-found page in `src/app/not-found.tsx`

These are intentionally simple placeholders and can be replaced later with final brand assets.

## Available Routes

- `/dashboard`
- `/releases`
- `/campaigns`
- `/content`
- `/fans`
- `/tasks`
- `/analytics`
- `/settings`
- `/sign-in`
- `/sign-up`
- `/onboarding`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:write
npm run test
npm run db:generate
npm run db:migrate
npm run db:migrate:deploy
npm run db:migrate:status
npm run db:seed
npm run db:studio
```

## Simple Deployment Checklist

1. Create a managed PostgreSQL database.
2. Set `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in the hosting provider.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate:deploy`.
6. Run `npm run lint`.
7. Run `npm exec tsc -- --noEmit`.
8. Run `npm run test`.
9. Run `npm run build`.
10. Deploy the app.
11. Sign in and verify `/dashboard`, `/releases`, `/campaigns`, `/content`, `/fans`, `/tasks`, `/analytics`, and `/settings`.
12. Replace placeholder icons and branding when final assets are ready.
