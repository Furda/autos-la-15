/**
 * Migrates contact card toggles on homePage to showHours / showContactChannels.
 *
 * Usage: node --env-file=.env scripts/patch-contact-card-toggles.mjs
 */
import { createClient } from '@sanity/client';

const required = ['SANITY_PROJECT_ID', 'SANITY_TOKEN', 'SANITY_DATASET', 'SANITY_API_VERSION'];
for (const name of required) {
  if (!process.env[name]?.trim()) throw new Error(`Missing ${name}`);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const hoursTitle = 'Visítanos';
const channelsTitle = 'Consulta al equipo';

const cards = await client.fetch(`*[_type == "homePage"][0].contact.cards`);
if (!Array.isArray(cards) || cards.length === 0) {
  console.error('No contact cards on homePage.');
  process.exit(1);
}

const updated = cards.map((card) => {
  const isHours = card._key === 'c2' || card.title === hoursTitle;
  const isChannels = card._key === 'c3' || card.title === channelsTitle;

  const { showPhoneAndHours, showEmailAndInstagram, ...rest } = card;
  return {
    ...rest,
    showHours: Boolean(isHours),
    showContactChannels: Boolean(isChannels),
  };
});

await client.patch('homePage').set({ 'contact.cards': updated }).commit();
console.log('Patched homePage contact cards (hours + contact channels).');
