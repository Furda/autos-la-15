import { defineField, defineType } from 'sanity';

export const contactCard = defineType({
  name: 'contactCard',
  title: 'Tarjeta de contacto',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Número',
      type: 'string',
      description: 'Etiqueta visual opcional (por ejemplo 01, 02, 03).',
    }),
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Texto', type: 'text', rows: 3 }),
    defineField({ name: 'linkLabel', title: 'Texto del enlace', type: 'string' }),
    defineField({ name: 'linkHref', title: 'Enlace', type: 'string' }),
    defineField({
      name: 'showHours',
      title: 'Mostrar horarios',
      type: 'boolean',
      description: 'Muestra los horarios de Configuración del sitio → Contacto.',
      initialValue: false,
    }),
    defineField({
      name: 'showContactChannels',
      title: 'Mostrar teléfono, correo e Instagram',
      type: 'boolean',
      description:
        'Muestra el teléfono, el correo, el enlace de Instagram y el usuario visible de esta página.',
      initialValue: false,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((card) => {
      if (!card?.showHours || !card?.showContactChannels) return true;
      return 'Activa solo una opción por tarjeta: horarios o datos de contacto, no ambas.';
    }),
  preview: {
    select: {
      title: 'title',
      number: 'number',
      showHours: 'showHours',
      showContactChannels: 'showContactChannels',
    },
    prepare({ title, number, showHours, showContactChannels }) {
      const extras = [
        showHours && 'Horarios',
        showContactChannels && 'Teléfono/correo/Instagram',
      ].filter(Boolean);
      return {
        title,
        subtitle: [number, ...extras].filter(Boolean).join(' · ') || undefined,
      };
    },
  },
});
