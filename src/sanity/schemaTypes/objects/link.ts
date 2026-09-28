import { defineField, defineType } from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Enlace',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Texto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL o ancla',
      type: 'string',
      description: 'Ejemplo: #catalogo o https://…',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Abrir en nueva pestaña',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});
