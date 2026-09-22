import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const projectId = env.SANITY_PROJECT_ID;
const dataset = env.SANITY_DATASET;
const apiVersion = env.SANITY_API_VERSION;

if (!projectId || !dataset || !apiVersion) {
  throw new Error('SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_VERSION are required.');
}

export default defineConfig({
  output: 'static',
  site: env.PUBLIC_SITE_URL || undefined,
  integrations: [
    react(),
    sitemap(),
    sanity({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      studioBasePath: '/studio',
      studioRouterHistory: 'hash',
    }),
  ],
});
