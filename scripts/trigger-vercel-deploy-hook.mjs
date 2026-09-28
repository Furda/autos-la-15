const url = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
if (!url) {
  console.error('Missing VERCEL_DEPLOY_HOOK_URL');
  process.exit(1);
}

const response = await fetch(url, { method: 'POST' });
const text = await response.text();
if (!response.ok) {
  console.error(`Deploy hook failed (${response.status}): ${text}`);
  process.exit(1);
}

console.log(`Deploy hook accepted (${response.status})`);
