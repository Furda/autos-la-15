import { defineField, defineType } from 'sanity';

export const sectionIntro = defineType({
  name: 'sectionIntro',
  title: 'Introducción de sección',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', title: 'Antetítulo', type: 'string' }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'lead', title: 'Texto principal', type: 'text', rows: 4 }),
  ],
});
