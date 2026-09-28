import { defineField, defineType } from 'sanity';

export const faqItem = defineType({
  name: 'faqItem',
  title: 'Pregunta frecuente',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answerParagraphs',
      title: 'Respuesta',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'defaultOpen',
      title: 'Mostrar abierta por defecto',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'question' },
  },
});
