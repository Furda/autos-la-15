import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_PROJECT_ID ?? '7mz74qpp';
const dataset = process.env.SANITY_DATASET ?? 'production';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  project: {
    basePath: '/studio',
  },
  deployment: {
    appId: 'euo2fonf6mjufqdd2voin1dp',
  },
});
