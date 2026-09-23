import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'identity',
      title: 'Identidad',
      type: 'object',
      fields: [
        defineField({ name: 'brandName', title: 'Nombre de marca', type: 'string' }),
        defineField({ name: 'tagline', title: 'Eslogan', type: 'string' }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contacto',
      type: 'object',
      fields: [
        defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
        defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string' }),
        defineField({ name: 'email', title: 'Correo electrónico', type: 'string' }),
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Horarios',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Días', type: 'string' }),
          defineField({ name: 'opening', title: 'Apertura', type: 'string' }),
          defineField({ name: 'closing', title: 'Cierre', type: 'string' }),
        ],
        preview: { select: { title: 'label', subtitle: 'opening' } },
      }],
    }),
    defineField({
      name: 'locations',
      title: 'Ubicaciones',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'city', title: 'Ciudad', type: 'string' }),
          defineField({ name: 'address', title: 'Dirección', type: 'string' }),
          defineField({ name: 'mapUrl', title: 'Enlace del mapa', type: 'url' }),
        ],
        preview: { select: { title: 'city', subtitle: 'address' } },
      }],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
      ],
    }),
    defineField({
      name: 'homepageCopy',
      title: 'Texto de inicio',
      type: 'object',
      fields: [
        defineField({ name: 'eyebrow', title: 'Antetítulo', type: 'string' }),
        defineField({ name: 'title', title: 'Título principal', type: 'string' }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
        defineField({ name: 'catalogHeading', title: 'Título del catálogo', type: 'string' }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string', validation: (Rule) => Rule.required() })],
    }),
    defineField({
      name: 'historyImage',
      title: 'Imagen de nuestra historia',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string', validation: (Rule) => Rule.required() })],
    }),
  ],
  preview: {
    select: {
      title: 'identity.brandName',
      subtitle: 'identity.tagline',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Configuración del sitio',
        subtitle,
      };
    },
  },
});
