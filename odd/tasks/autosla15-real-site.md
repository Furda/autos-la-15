# Autos La 15 Real Astro + Sanity Site

## Objective

Build the production website behind the provisional static site using Astro, Sanity, and Vercel, while preserving the approved Autos La 15 visual direction, Spanish copy, image assets, and WhatsApp conversion flow.

## Current state

- Provisional static site is live at `https://provisional-khaki.vercel.app`.
- Sanity project is authenticated and available through `SANITY_PROJECT_ID=7mz74qpp`.
- Sanity write token is present as `SANITY_TOKEN` and has Developer read/write access.
- Dataset is `production`.
- Vercel CLI is authenticated.
- GitHub default branch is **`main`**; day-to-day work uses feature branches and PRs into `main`.
- The provisional site is the approved visual/content reference for the real build.

## Authorized scope

- Root Astro application files and configuration.
- Sanity schema/studio files and seed scripts.
- Shared public assets copied from the provisional site.
- Root project documentation and task progress.
- Do not modify or delete `provisional/`; it remains the client-facing fallback.
- Do not commit `.env`, tokens, or credentials.

## Autonomous task sequence

### Foundation

- [x] Scaffold Astro with strict TypeScript in the repository root without disturbing `provisional/`.
- [x] Add Tailwind v4 or the smallest compatible styling setup and preserve the approved palette, Sora/Inter typography, and responsive tokens.
- [x] Configure Vercel build output and root `.gitignore` coverage.
- [x] Add the shared image assets needed by the real site.

### Sanity content system

- [x] Add embedded Sanity Studio at `/studio` using the existing project and `production` dataset.
- [x] Create the `car` schema with title, year, price, description, image, status, featured, badge, WhatsApp message, optional 3D model file, and alt text.
- [x] Use status values: `available`, `reserved`, `sold`, and `archived`.
- [x] Create a singleton `siteSettings` schema for contact details, hours, addresses, social links, and homepage copy.
- [x] Create a one-time seed script for the 12 provisional vehicles and approved site content.
- [x] Validate read and write access against the configured Sanity project without exposing secrets.

### Production page

- [x] Build the single-page Astro site from Sanity data.
- [x] Port the approved hero, stats, history, six-card catalog pagination, testimonials, FAQ, contact, footer, and floating WhatsApp patterns.
- [x] Keep general CTAs blue and WhatsApp actions green, except car `Consultar` actions which remain blue by approved design direction while opening WhatsApp.
- [x] Add JSON-LD `AutoDealer` data, sitemap, Open Graph metadata, canonical URL handling, and accessible alt text.
- [x] Preserve the current Spanish copy until CMS-managed content is seeded and verified.

### Delivery and verification

- [x] Add a Sanity webhook or Vercel deploy hook so published CMS edits trigger a rebuild (`sanity-cms-rebuild` on `main` + Sanity document webhook `OubgDrE3adtgRQya`; see Work unit 5).
- [x] Link the real site to a separate Vercel project from the provisional deployment.
- [x] Run typecheck/build, structural checks, browser checks at desktop and mobile widths, and link/asset validation.
- [x] Create a first work-unit commit containing the foundation and record its identity here.
- [x] Deploy a preview, verify it, then deploy production only after the autonomous checks pass.

## No-user-action assumptions

- Use the existing Sanity project, `production` dataset, authenticated Developer token, and Vercel account.
- Use the provisional content and assets as the initial source of truth.
- Keep the real app separate from the deployed `provisional` Vercel project.
- Prefer automatic progression through independent tasks; pause only for an actual credential, product, or destructive-action blocker.

## Verification requirements

- Required runner: Astro build and typecheck commands discovered during scaffold.
- Required checks: build, asset/link validation, Sanity query validation, desktop/mobile browser verification, and WhatsApp URL verification.
- Record failed, unavailable, or skipped checks honestly.

## Progress

- Route: delegated direct implementation, with one writer per coherent work unit.
- Delivery strategy: automatic task progression unless a real external decision is required.
- Provisional fallback remains live and must not be broken by real-site work.

## Work unit 1 evidence

- Work-unit commit: `3e3e7aebe32be18573a90d6c89645eafa0c3e6a4` (`feat(site): scaffold Astro and Sanity foundation`).
- `npm install` completed successfully with exit code 0. The final install audited the dependency tree; npm reported existing upstream audit warnings and no install blocker.
- `npm run check` completed successfully with `0 errors`, `0 warnings`, and `0 hints`.
- `npm run build` completed successfully with static output and 2 pages built: `/index.html` and `/studio/index.html`. Sitemap generation was skipped, as expected, because `PUBLIC_SITE_URL` is intentionally unset.
- Runtime harness: N/A for this foundation unit; the static build route output is the runtime boundary verified here.
- Asset verification compared SHA-256 hashes for 15 source files under `provisional/assets/{img,autos}` and 15 copied files under `public/assets`; result: `source_files=15 copied_files=15 mismatches=0`.
- `provisional/` was not modified by this work unit. No deployment was run.

## Work unit 4 evidence

- Separate Vercel project created: `autosla15-real`.
- Environment configured for Production and Preview: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, and `PUBLIC_SITE_URL=https://autosla15-real.vercel.app`.
- Production deployment completed and aliased to `https://autosla15-real.vercel.app`.
- Live checks passed: homepage HTTP 200, `/studio` HTTP 200, `/sitemap-index.xml` HTTP 200, canonical metadata present, and `AutoDealer` JSON-LD present.
- Vercel deploy-hook creation was attempted and refused because the project is not connected to a Git repository. No blind retry was performed.

## Work unit 2 evidence

- `npm run seed:sanity` completed successfully: `12 cars`, `1 siteSettings document`, `12 images uploaded`, and no credentials were logged.
- A second `npm run seed:sanity` completed successfully and reused all `12` existing image assets (`0 uploaded`, `12 reused`), confirming safe reruns with deterministic car documents.
- Read-only GROQ verification completed with `cars=12 siteSettings=1` using a temporary local query script; the script was removed after verification.
- `npm run check` completed successfully with `0 errors`, `0 warnings`, and `0 hints`.
- `npm run build` completed successfully with `2 page(s) built`: `/index.html` and `/studio/index.html`. Sitemap generation was skipped because `PUBLIC_SITE_URL` is unset; this is the existing expected warning.
- `provisional/` was not modified by this work unit. No deployment was run.

## Work unit 3 evidence

- `npm run seed:sanity` completed successfully after adding the seeded editorial assets: `12 cars`, `1 siteSettings document`, `14 images uploaded or reused` (`2 uploaded`, `12 reused`).
- `npm run check` completed successfully with `0 errors`, `0 warnings`, and `0 hints`.
- `npm run build` completed successfully with `2 page(s) built`: `/index.html` and `/studio/index.html`. Sitemap generation was skipped because `PUBLIC_SITE_URL` remains unset.
- Build-source structural check passed: `12` Sanity-rendered vehicle cards, `2` catalog pages, `17` WhatsApp links, `AutoDealer` JSON-LD, and `0` missing local assets. No sitemap file was generated while the canonical site URL is unset.
- Built-site preview at `http://127.0.0.1:4321/` passed at `1920px` and `390px`: `6` visible cards per page, page 2 pagination state, keyboard-capable controls, `4` FAQ items with single-open behavior, contact map, valid WhatsApp hrefs, and no horizontal overflow. Browser console reported `0` errors.
- `provisional/` was not modified by this work unit. No deployment was run.

## Work unit 5 evidence (Git ↔ Vercel + CMS redeploy)

### Vercel ↔ Git status (read-only, 2026-09-23)

- GitHub repo: `Furda/autos-la-15` (default branch `feat/autosla15-real-site`, in sync with local `31c6f7f`).
- Vercel team `furdac14-5429s-projects` has one app project: **`autos-la-15`** → `https://autos-la-15.vercel.app`. The earlier CLI project name **`autosla15-real`** is not present in this team; `https://autosla15-real.vercel.app` returns **404**.
- Local directory linked to `furdac14-5429s-projects/autos-la-15` (`npx vercel link --project autos-la-15`).
- **`vercel deploy-hook list`**: status `ok`, **0 hooks** — deploy hooks can be created now (previous “must connect Git” blocker is cleared for this project).
- **Environment variables on Vercel:** `vercel env ls` / `vercel pull --environment=production` show **no** `SANITY_*` or `PUBLIC_SITE_URL` on `autos-la-15` (unlike the retired `autosla15-real` notes in Work unit 4). Production builds need these re-added for Preview + Production.
- **Production branch:** GitHub default is **`main`** (created 2026-09-24 from `31c6f7f`). Set Vercel → Project → Settings → Git → Production Branch to **`main`**.
- **Git connection:** confirm in Vercel dashboard (Settings → Git) that the repo is `Furda/autos-la-15`. CLI `vercel git connect https://github.com/Furda/autos-la-15.git` is the non-interactive connect if it is missing.

### Vercel env + production deploy (applied 2026-09-24)

- Added on **Preview + Production**: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `PUBLIC_SITE_URL=https://autos-la-15.vercel.app`.
- Production CLI deploy: `dpl_BHwERS8qEwBUg5naCKo9ouFp3VVX` → **https://autos-la-15.vercel.app**.
- Post-deploy smoke: `/` **200**, `/studio` **200**, `/sitemap-index.xml` **200**.
- `vercel git connect` failed: Vercel account needs a **GitHub Login Connection** ([docs](https://vercel.com/docs/accounts/create-an-account#login-methods-and-connections)). Until the repo is linked under Project → Git, **deploy hooks cannot be created** (CLI error: project not connected to Git).

### CMS auto-redeploy (applied 2026-09-24)

- Git: `Furda/autos-la-15` connected; production branch **`main`**.
- Vercel deploy hook: **`sanity-cms-rebuild`** (`ref: main`, id `BRKXFXybIu`).
- Sanity document webhook: **`Vercel production rebuild (CMS publish)`** (id `OubgDrE3adtgRQya`) → deploy hook URL; filter `_type in ["car", "siteSettings"]`.
- Hook test: POST to deploy hook started production deployment `autos-la-15-9c9e5dzkm-…` (Building → Ready).
- Setup script fixed: Webhooks API uses `v2021-06-07` + `type: document` payload (not `SANITY_API_VERSION`).

### CMS auto-redeploy (reference commands)

1. **Vercel deploy hook** (production branch):

   ```bash
   npx vercel link --project autos-la-15 --yes
   npx vercel deploy-hook create sanity-cms-rebuild --ref main
   ```

   Copy the hook URL into `.env` as `VERCEL_DEPLOY_HOOK_URL` (do not commit).

3. **Sanity webhook** (calls the deploy hook on publish):

   ```bash
   node --env-file=.env scripts/setup-cms-redeploy-webhook.mjs
   ```

   Or create the same rule in [Sanity Manage → API → Webhooks](https://www.sanity.io/manage) (dataset `production`, filter `_type in ["car", "siteSettings"]`, POST to the deploy hook URL).

   (Vercel env vars are already set; redeploy via hook or push to `main` after Git is connected.)

### Local verification (this session)

- `npm run check`: `0` errors / warnings / hints.
- `npm run build` with `PUBLIC_SITE_URL=https://autos-la-15.vercel.app` and Sanity env set: success; `sitemap-index.xml` generated under `dist/`.
- Live smoke (current production, **before** env redeploy): `/` **200** (Astro + `AutoDealer` JSON-LD), `/studio` **200**, `/sitemap-index.xml` **404** (expected until `PUBLIC_SITE_URL` is set on Vercel and a new build ships).

### PR

- Remote **`main`** exists and is the GitHub default. Open a PR from `feat/autosla15-real-site` → `main` when ready to merge feature work into production branch.

## Work unit 6 evidence (handoff polish)

- Client/ops handoff: `odd/handoff/autosla15-real-site.md` (URLs, Studio usage, publish → deploy, accounts, provisional plan, post-demo backlog).
- `README.md` and `.env.example` updated for branch workflow, production URL, and webhook script.
- `scripts/setup-cms-redeploy-webhook.mjs` added (idempotent Sanity webhook → Vercel deploy hook).
- Live CMS publish → Vercel rebuild verified by the team (manual).
