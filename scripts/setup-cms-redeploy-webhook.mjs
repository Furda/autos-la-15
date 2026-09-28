/**
 * Creates a Sanity project webhook that POSTs to a Vercel deploy hook URL.
 *
 * Required env (use --env-file=.env locally; never commit secrets):
 *   SANITY_PROJECT_ID, SANITY_TOKEN, VERCEL_DEPLOY_HOOK_URL
 *
 * Usage:
 *   node --env-file=.env scripts/setup-cms-redeploy-webhook.mjs
 */
const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_TOKEN;
const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
const hookName = 'Vercel production rebuild (CMS publish)';

const required = ['SANITY_PROJECT_ID', 'SANITY_TOKEN', 'VERCEL_DEPLOY_HOOK_URL'];
for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`Missing ${key}. Set it in .env (see scripts/setup-cms-redeploy-webhook.mjs).`);
    process.exit(1);
  }
}

const hooksApiVersion = process.env.SANITY_HOOKS_API_VERSION ?? 'v2021-06-07';
const hooksBase = `https://${projectId}.api.sanity.io/${hooksApiVersion}/hooks/projects/${projectId}`;

const listResponse = await fetch(hooksBase, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!listResponse.ok) {
  console.error(`Sanity webhook list failed (${listResponse.status}): ${await listResponse.text()}`);
  process.exit(1);
}

const existing = await listResponse.json();
const already = existing.find((hook) => hook.name === hookName);
if (already) {
  console.log(`Webhook already exists id=${already.id} name="${already.name}"`);
  process.exit(0);
}

const body = {
  name: hookName,
  url: deployHookUrl,
  dataset: process.env.SANITY_DATASET ?? 'production',
  description: 'Triggers Vercel rebuild when documents are published in Sanity.',
  type: 'document',
  apiVersion: hooksApiVersion,
  rule: {
    on: ['create', 'update', 'delete'],
    filter: '_type in ["car", "siteSettings"]',
    projection: '{_id}',
  },
  httpMethod: 'POST',
};

const response = await fetch(hooksBase, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

if (!response.ok) {
  const text = await response.text();
  if (response.status === 409 && text.includes('already exists')) {
    console.log(`Webhook "${hookName}" already exists on this project.`);
    process.exit(0);
  }
  console.error(`Sanity webhook create failed (${response.status}): ${text}`);
  process.exit(1);
}

const hook = await response.json();
console.log(`Created Sanity webhook id=${hook.id} name="${hook.name}"`);
