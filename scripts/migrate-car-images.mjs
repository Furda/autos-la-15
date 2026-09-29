import { randomBytes } from 'node:crypto';
import { createClient } from '@sanity/client';

const requiredEnv = ['SANITY_PROJECT_ID', 'SANITY_TOKEN', 'SANITY_DATASET', 'SANITY_API_VERSION'];

for (const name of requiredEnv) {
  if (!process.env[name]?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const key = () => randomBytes(8).toString('hex');

const imageEntryFromLegacy = (image) => {
  if (!image?.asset?._ref) return null;
  return {
    _key: key(),
    _type: 'image',
    asset: image.asset,
    ...(image.alt ? { alt: image.alt } : {}),
    ...(image.crop ? { crop: image.crop } : {}),
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
  };
};

const cars = await client.fetch(
  `*[_type == "car"]{
    _id,
    name,
    image,
    "images": images[]{ _key, asset, alt, crop, hotspot }
  }`,
);

let migrated = 0;
let skipped = 0;

for (const car of cars) {
  const legacy = imageEntryFromLegacy(car.image);
  const existing = Array.isArray(car.images) ? car.images : [];
  const hasImages = existing.some((item) => item?.asset?._ref);

  if (!legacy && hasImages) {
    skipped += 1;
    continue;
  }

  if (!legacy && !hasImages) {
    console.warn(`Skip ${car._id}: no legacy image and no images array`);
    skipped += 1;
    continue;
  }

  const legacyRef = legacy?.asset?._ref;
  const alreadyIncluded = legacyRef && existing.some((item) => item?.asset?._ref === legacyRef);
  const images = hasImages
    ? alreadyIncluded || !legacy
      ? existing
      : [legacy, ...existing.map((item) => ({ ...item, _key: item._key ?? key() }))]
    : [legacy];

  const patch = client.patch(car._id).set({
    images: images.map((item) => ({
      ...item,
      _key: item._key ?? key(),
      _type: 'image',
    })),
  });

  if (car.image) {
    patch.unset(['image']);
  }

  await patch.commit();
  migrated += 1;
  console.log(`Migrated ${car._id} (${car.name ?? 'sin nombre'}) → ${images.length} image(s)`);
}

console.log(JSON.stringify({ total: cars.length, migrated, skipped }, null, 2));
