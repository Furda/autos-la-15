# Autos La 15 real site

Production site: static **Astro** app with embedded **Sanity Studio** at `/studio`. The `provisional/` directory is the legacy fallback and is not part of this build.

- **Live:** https://autos-la-15.pages.dev  
- **Handoff (client + ops):** [odd/handoff/autosla15-real-site.md](odd/handoff/autosla15-real-site.md)  
- **Build progress / evidence:** [odd/tasks/autosla15-real-site.md](odd/tasks/autosla15-real-site.md)

## Branch workflow

| Branch | Role |
|--------|------|
| **`main`** | Production. Cloudflare Pages deploys from `main`. |
| **`feat/*`** (or other) | Development. Open a **PR into `main`**; merge after review and checks. |

Do not commit `.env` or tokens.

## Local setup

1. Copy `.env.example` to `.env` and fill in Sanity values (including `SANITY_TOKEN` for seed/scripts only).
2. `npm install`
3. `npm run dev` — site at http://localhost:4320 (or the port Astro prints); Studio at `/studio`.
4. Before release checks: `npm run check` and `npm run build`.

For a production-like local build, set `PUBLIC_SITE_URL` (see `.env.example`).

Node **22+** for build (see `.node-version`; Cloudflare Pages uses `NODE_VERSION=22`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Astro dev server |
| `npm run check` | `astro check` (types) |
| `npm run build` | Static output to `dist/` |
| `npm run seed:sanity` | One-time / safe re-run seed (`SANITY_TOKEN` required) |

## Sanity Studio on production (one-time per URL)

Embedded Studio at `/studio` must be **registered** with the Sanity project and allowed in **CORS** (origin with credentials). From the repo (logged-in Sanity CLI):

```bash
npx sanity cors add https://autos-la-15.pages.dev --credentials -p 7mz74qpp -y
npx sanity@latest deploy --external --url https://autos-la-15.pages.dev/studio -y
```

Repeat with the new origin/URL when the public domain changes. See `sanity.cli.ts` (`basePath: '/studio'`).

## CMS redeploy wiring

Published edits to `car`, `siteSettings`, and `homePage` (Página de inicio) trigger a Cloudflare Pages rebuild via Sanity webhook → Pages deploy hook. Ops details are in the handoff doc. To create or update the Sanity webhook locally:

```bash
# PAGES_DEPLOY_HOOK_URL in .env only — never commit
node --env-file=.env scripts/setup-cms-redeploy-webhook.mjs
```

## Cloudflare Pages

Project name: **`autos-la-15`**. Build: `npm run build`, output `dist/`, production branch `main`. Configure env vars in the Pages dashboard (see handoff doc).
