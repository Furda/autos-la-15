import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Cita',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'author', title: 'Autor', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'dateLabel', title: 'Fecha (texto)', type: 'string' }),
    defineField({
      name: 'rating',
      title: 'Calificación',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'quote' },
  },
});
