import { defineField, defineType } from 'sanity';

export const statItem = defineType({
  name: 'statItem',
  title: 'Dato destacado',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Número',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'suffix',
      title: 'Sufijo',
      type: 'string',
      description: 'Opcional: +, %, etc.',
    }),
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', value: 'value', suffix: 'suffix' },
    prepare({ title, value, suffix }) {
      return { title, subtitle: suffix ? `${value}${suffix}` : String(value) };
    },
  },
});
