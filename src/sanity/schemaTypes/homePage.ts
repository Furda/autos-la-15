import { defineField, defineType } from 'sanity';

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
    ],
  });

export const homePage = defineType({
  name: 'homePage',
  title: 'Página: Inicio',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Portada', default: true },
    { name: 'stats', title: 'Datos' },
    { name: 'history', title: 'Historia' },
    { name: 'catalog', title: 'Catálogo' },
    { name: 'testimonials', title: 'Testimonios' },
    { name: 'faq', title: 'Preguntas' },
    { name: 'contact', title: 'Contacto' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Portada',
      type: 'object',
      group: 'hero',
      fields: [
        imageField('image', 'Imagen de portada'),
        defineField({ name: 'intro', title: 'Texto', type: 'sectionIntro' }),
        defineField({ name: 'primaryCta', title: 'Botón principal', type: 'link' }),
        defineField({ name: 'secondaryCta', title: 'Botón secundario', type: 'link' }),
        defineField({ name: 'scrollHint', title: 'Indicador de scroll', type: 'string' }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Datos destacados',
      type: 'object',
      group: 'stats',
      fields: [
        defineField({ name: 'intro', title: 'Introducción', type: 'sectionIntro' }),
        defineField({
          name: 'items',
          title: 'Datos',
          type: 'array',
          of: [{ type: 'statItem' }],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'history',
      title: 'Nuestra historia',
      type: 'object',
      group: 'history',
      fields: [
        imageField('image', 'Imagen'),
        defineField({ name: 'eyebrow', title: 'Antetítulo', type: 'string' }),
        defineField({ name: 'title', title: 'Título', type: 'string' }),
        defineField({
          name: 'paragraphs',
          title: 'Párrafos',
          type: 'array',
          of: [{ type: 'text', rows: 4 }],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'catalog',
      title: 'Catálogo',
      type: 'object',
      group: 'catalog',
      fields: [
        defineField({ name: 'intro', title: 'Introducción', type: 'sectionIntro' }),
        defineField({ name: 'emptyMessage', title: 'Sin vehículos publicados', type: 'text', rows: 2 }),
        defineField({ name: 'note', title: 'Nota al pie', type: 'text', rows: 2 }),
        defineField({ name: 'noteLinkLabel', title: 'Texto del enlace en la nota', type: 'string' }),
        defineField({ name: 'noteLinkHref', title: 'Enlace en la nota', type: 'string' }),
        defineField({ name: 'vehiclePrimaryButton', title: 'Botón consultar vehículo', type: 'string' }),
        defineField({ name: 'vehicleSecondaryButton', title: 'Botón agendar visita', type: 'string' }),
      ],
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonios',
      type: 'object',
      group: 'testimonials',
      fields: [
        defineField({ name: 'intro', title: 'Introducción', type: 'sectionIntro' }),
        defineField({ name: 'featured', title: 'Testimonio destacado', type: 'testimonial' }),
        defineField({
          name: 'supporting',
          title: 'Otros testimonios',
          type: 'array',
          of: [{ type: 'testimonial' }],
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Preguntas frecuentes',
      type: 'object',
      group: 'faq',
      fields: [
        defineField({ name: 'intro', title: 'Introducción', type: 'sectionIntro' }),
        defineField({ name: 'sidebarLink', title: 'Enlace lateral', type: 'link' }),
        defineField({
          name: 'items',
          title: 'Preguntas',
          type: 'array',
          of: [{ type: 'faqItem' }],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contacto',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'title', title: 'Título', type: 'text', rows: 2 }),
        defineField({ name: 'eyebrow', title: 'Antetítulo', type: 'string' }),
        defineField({ name: 'lead', title: 'Texto introductorio', type: 'text', rows: 3 }),
        defineField({
          name: 'cards',
          title: 'Tarjetas',
          type: 'array',
          of: [{ type: 'contactCard' }],
          validation: (Rule) =>
            Rule.custom((cards) => {
              if (!Array.isArray(cards)) return true;
              const hoursCards = cards.filter((card) => card?.showHours);
              const channelCards = cards.filter((card) => card?.showContactChannels);
              if (hoursCards.length > 1) {
                return 'Solo una tarjeta puede mostrar horarios.';
              }
              if (channelCards.length > 1) {
                return 'Solo una tarjeta puede mostrar teléfono, correo e Instagram.';
              }
              return true;
            }),
        }),
        defineField({ name: 'locationHeading', title: 'Título de ubicación', type: 'string' }),
        defineField({ name: 'whatsappCtaLabel', title: 'Texto botón WhatsApp', type: 'string' }),
        defineField({ name: 'instagramHandle', title: 'Usuario de Instagram (visible)', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Página: Inicio' };
    },
  },
});
