# Autos La 15 real site

Production site: static **Astro** app with embedded **Sanity Studio** at `/studio`. The `provisional/` directory is the legacy fallback and is not part of this build.

- **Live:** https://autos-la-15.vercel.app  
- **Handoff (client + ops):** [odd/handoff/autosla15-real-site.md](odd/handoff/autosla15-real-site.md)  
- **Build progress / evidence:** [odd/tasks/autosla15-real-site.md](odd/tasks/autosla15-real-site.md)

## Branch workflow

| Branch | Role |
|--------|------|
| **`main`** | Production. Vercel deploys from `main`. |
| **`feat/*`** (or other) | Development. Open a **PR into `main`**; merge after review and checks. |

Do not commit `.env` or tokens.

## Local setup

1. Copy `.env.example` to `.env` and fill in Sanity values (including `SANITY_TOKEN` for seed/scripts only).
2. `npm install`
3. `npm run dev` — site at http://localhost:4320 (or the port Astro prints); Studio at `/studio`.
4. Before release checks: `npm run check` and `npm run build`.

For a production-like local build, set `PUBLIC_SITE_URL` (see `.env.example`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Astro dev server |
| `npm run check` | `astro check` (types) |
| `npm run build` | Static output to `dist/` |
| `npm run seed:sanity` | One-time / safe re-run seed (`SANITY_TOKEN` required) |

## CMS redeploy wiring

Published edits to `car` and `siteSettings` trigger a Vercel rebuild via Sanity webhook → deploy hook. Ops details and IDs are in the handoff doc. To (re)create the Sanity webhook locally:

```bash
# VERCEL_DEPLOY_HOOK_URL in .env only — never commit
node --env-file=.env scripts/setup-cms-redeploy-webhook.mjs
```

## Vercel

Project name: **`autos-la-15`**. Root `vercel.json` sets `npm run build` and `dist/`. Link CLI: `npx vercel link --project autos-la-15`.
