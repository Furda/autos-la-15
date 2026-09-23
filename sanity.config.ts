import { defineConfig } from 'sanity';
import { structureTool, type StructureBuilder } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';

const viteEnv = import.meta.env as Record<string, string | undefined>;
const nodeEnv = typeof process === 'undefined' ? undefined : process.env;
const projectId = viteEnv.SANITY_PROJECT_ID ?? nodeEnv?.SANITY_PROJECT_ID;
const dataset = viteEnv.SANITY_DATASET ?? nodeEnv?.SANITY_DATASET ?? 'production';

if (!projectId) {
  throw new Error('SANITY_PROJECT_ID is required to load Sanity Studio.');
}

const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Configuración del sitio')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteSettings'),
    ]);

export default defineConfig({
  name: 'autosla15',
  title: 'Autos La 15',
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
