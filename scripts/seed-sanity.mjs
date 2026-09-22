import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
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

const vehicles = [
  {
    id: 'car-chevrolet-cruze-2014',
    name: 'Chevrolet Cruze 2014',
    image: 'cruze-2014.jpg',
    year: 2014,
    price: 10500,
    description:
      'Sedán negro con motor 1.8 L y 107 mil km. Cuenta con servicio reciente al cuerpo de aceleración y bujías, batería reemplazada, cauchos en muy buen estado, pintura de hace un año y tren delantero nuevo. Título 3–1.',
    featured: false,
  },
  {
    id: 'car-chevrolet-cruze-2015',
    name: 'Chevrolet Cruze 2015',
    image: 'cruze-2015.jpg',
    year: 2015,
    price: 13000,
    description:
      'Sedán negro con motor 1.8 L y 129 mil km. Está muy conservado, con pintura, cauchos, aire acondicionado y tapicería en excelentes condiciones. Incluye caucho de repuesto y herramientas. Título 3–1.',
    featured: false,
  },
  {
    id: 'car-ford-fiesta-titanium-2015',
    name: 'Ford Fiesta Titanium 2015',
    image: 'fiesta-2015.jpg',
    year: 2015,
    price: 12500,
    description:
      'Una alternativa económica y bien cuidada, con motor 1.6 L y 97 mil km. Conserva en muy buen estado la pintura, tapicería, aire acondicionado y cauchos. Título 3–1.',
    featured: false,
  },
  {
    id: 'car-ford-fiesta-titanium-2016',
    name: 'Ford Fiesta Titanium 2016',
    image: 'fiesta-2016.jpg',
    year: 2016,
    price: 14000,
    description:
      'De único dueño, con motor 1.6 L y 119 mil km. Fue recién pintado y se encuentra muy conservado. Incluye certificado de origen, factura de compra, caucho de repuesto y herramientas.',
    featured: false,
  },
  {
    id: 'car-ford-explorer-xlt-2011',
    name: 'Ford Explorer XLT 2011',
    image: 'explorer-xlt-2011.jpg',
    year: 2011,
    price: 13700,
    description:
      'Camioneta 4x2 con 137 mil km, cuatro cauchos nuevos y buena pintura. Mantiene su tapicería original en muy buen estado. Título 2–1.',
    featured: false,
  },
  {
    id: 'car-ford-explorer-limited-2016',
    name: 'Ford Explorer Limited 2016',
    image: 'explorer-limited-2016.jpg',
    year: 2016,
    price: 27000,
    description:
      'SUV amplia y potente con 165 mil km. Su versión Limited ofrece comodidad, espacio para la familia y un equipamiento completo.',
    featured: false,
  },
  {
    id: 'car-jac-t8-2026',
    name: 'JAC T8 2026',
    image: 'jac-t8-2026.jpg',
    year: 2026,
    price: 37000,
    description:
      'Pickup 0 km, fuerte y completa de fábrica. Ofrece garantía full, interior amplio y tecnología actual para trabajo o paseo.',
    badge: '0 KM',
    featured: true,
  },
  {
    id: 'car-hyundai-grand-i10-2026',
    name: 'Hyundai Grand i10 2026',
    image: 'hyundai-i10-2026.jpg',
    year: 2026,
    price: 23800,
    description:
      'Con solo 1.000 km, ofrece una experiencia casi nueva, bajo consumo y facilidad para moverse y estacionar. Título 1–1 y más de un año de garantía.',
    featured: false,
  },
  {
    id: 'car-toyota-agya-2025',
    name: 'Toyota Agya 2025',
    image: 'toyota-agya-2025.jpg',
    year: 2025,
    price: 25300,
    description:
      'Compacto por fuera y cómodo por dentro, con consumo eficiente. Es blanco, está 0 km y cuenta con garantía de fábrica.',
    badge: '0 KM',
    featured: true,
  },
  {
    id: 'car-hyundai-santa-fe-2017',
    name: 'Hyundai Santa Fe 2017',
    image: 'santa-fe-2017.jpg',
    year: 2017,
    price: 33000,
    description:
      'De único dueño, con 44 mil km, color blanco, motor 3.3 L, seis cilindros y tracción 4x4. Está como nueva por dentro y por fuera, con equipamiento completo.',
    featured: true,
  },
  {
    id: 'car-toyota-hiace-2009',
    name: 'Toyota Hiace 2009',
    image: 'toyota-hiace-2009.jpg',
    year: 2009,
    price: 22000,
    description:
      'Van de carga con 433 mil km y motor recién hecho. Es una opción rentable y fácil de mantener, con buena reventa. Título 2–1.',
    featured: false,
  },
  {
    id: 'car-mitsubishi-outlander-gls-2025',
    name: 'Mitsubishi Outlander GLS 2025',
    image: 'outlander-2025.jpg',
    year: 2025,
    price: 60000,
    description:
      'SUV premium blanca, con motor 2.5 L, tres filas para siete pasajeros y 32 mil km. Es de único dueño y combina comodidad, seguridad y tecnología actual.',
    featured: true,
  },
];

const formatPrice = (price) => `$${price.toLocaleString('en-US')}`;

const loadAssets = async () => {
  const loaded = [];

  for (const vehicle of vehicles) {
    const sourcePath = fileURLToPath(new URL(`../provisional/assets/autos/${vehicle.image}`, import.meta.url));
    let buffer;

    try {
      buffer = await readFile(sourcePath);
    } catch (error) {
      if (error?.code === 'ENOENT') {
        throw new Error(`Missing required provisional image: ${sourcePath}`);
      }
      throw error;
    }

    loaded.push({
      ...vehicle,
      sourcePath,
      buffer,
      sha1: createHash('sha1').update(buffer).digest('hex'),
    });
  }

  return loaded;
};

const getOrUploadImage = async ({ image, buffer, sha1 }) => {
  const existingAssetId = await client.fetch(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]._id',
    { sha1 },
  );

  if (existingAssetId) {
    return { assetId: existingAssetId, uploaded: false };
  }

  const asset = await client.assets.upload('image', buffer, {
    filename: image,
    contentType: 'image/jpeg',
  });

  return { assetId: asset._id, uploaded: true };
};

const seedCar = async (vehicle, assetId) => {
  const document = {
    _id: vehicle.id,
    _type: 'car',
    title: vehicle.name,
    name: vehicle.name,
    year: vehicle.year,
    price: vehicle.price,
    description: vehicle.description,
    image: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt: `${vehicle.name}, vehículo disponible en Autos La 15`,
    },
    status: 'available',
    featured: vehicle.featured,
    whatsappMessage: `Hola Autos La 15, me interesa el ${vehicle.name} (${formatPrice(vehicle.price)}). ¿Me comparten más información?`,
  };

  if (vehicle.badge) {
    document.badge = vehicle.badge;
  }

  await client.createOrReplace(document);
};

const seedSiteSettings = async () => {
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    identity: {
      brandName: 'AUTOS LA 15',
      tagline: 'Compra con claridad. Vende con confianza.',
    },
    contact: {
      phone: '+58 412-6916722',
      whatsapp: '+584126916722',
      email: 'autosla15ca@gmail.com',
    },
    hours: [
      { _key: 'weekdays', label: 'Lunes a viernes', opening: '8:30 a. m.', closing: '5:00 p. m.' },
      { _key: 'saturday', label: 'Sábados', opening: '9:00 a. m.', closing: '1:00 p. m.' },
    ],
    locations: [
      {
        _key: 'maracaibo',
        city: 'Maracaibo',
        address: 'Av. 15 Las Delicias con Calle 88A',
        mapUrl: 'https://www.google.com/maps?q=10.6533428,-71.6195227',
      },
      {
        _key: 'ciudad-ojeda',
        city: 'Ciudad Ojeda',
        address: 'Atención en Ciudad Ojeda. Consulta la ubicación al coordinar tu visita.',
      },
    ],
    socialLinks: {
      instagram: 'https://instagram.com/autosla15/',
    },
    homepageCopy: {
      eyebrow: 'Familia zuliana desde 2005',
      title: 'Compra con claridad. Vende con confianza.',
      description:
        'Desde Maracaibo y Ciudad Ojeda, te acompañamos a comprar o vender tu vehículo con información clara y atención cercana.',
      catalogHeading: 'Revisa el inventario con calma',
    },
  });
};

const main = async () => {
  const loadedVehicles = await loadAssets();
  let uploadedCount = 0;

  for (const vehicle of loadedVehicles) {
    const result = await getOrUploadImage(vehicle);
    uploadedCount += result.uploaded ? 1 : 0;
    await seedCar(vehicle, result.assetId);
  }

  await seedSiteSettings();

  console.log(`Seed complete: ${loadedVehicles.length} cars, 1 siteSettings document.`);
  console.log(`Images uploaded or reused: ${loadedVehicles.length} total (${uploadedCount} uploaded, ${loadedVehicles.length - uploadedCount} reused).`);
};

main().catch((error) => {
  console.error(`Sanity seed failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
