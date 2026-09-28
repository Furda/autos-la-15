import { defineField, defineType } from 'sanity';

export const contactCard = defineType({
  name: 'contactCard',
  title: 'Tarjeta de contacto',
  type: 'object',
  fields: [
    defineField({ name: 'number', title: 'Número', type: 'string', description: 'Ejemplo: 01' }),
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Texto', type: 'text', rows: 3 }),
    defineField({ name: 'linkLabel', title: 'Texto del enlace', type: 'string' }),
    defineField({ name: 'linkHref', title: 'Enlace', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'number' },
  },
});
