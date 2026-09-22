# Autos La 15 real site

The production site is being rebuilt as a static Astro application with an embedded Sanity Studio. The `provisional/` directory is the live fallback and is intentionally kept separate from the root app.

## Local setup

1. Copy `.env.example` to `.env` and add the local Sanity values.
2. Install dependencies with `npm install`.
3. Start Astro with `npm run dev`.
4. Open `/studio` to access the embedded Sanity Studio.

`PUBLIC_SITE_URL` is optional. Keep it empty until the real production domain is approved. Never commit `.env`, tokens, or other credentials.
