import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identidad', default: true },
    { name: 'contact', title: 'Contacto' },
    { name: 'navigation', title: 'Navegación' },
    { name: 'messaging', title: 'Mensajes' },
  ],
  fields: [
    defineField({
      name: 'identity',
      title: 'Identidad',
      type: 'object',
      group: 'identity',
      fields: [
        defineField({ name: 'brandName', title: 'Nombre de marca', type: 'string' }),
        defineField({ name: 'tagline', title: 'Eslogan', type: 'string' }),
        defineField({
          name: 'logo',
          title: 'Logo',
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
        }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contacto',
      type: 'object',
      group: 'contact',
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
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Días', type: 'string' }),
            defineField({ name: 'opening', title: 'Apertura', type: 'string' }),
            defineField({ name: 'closing', title: 'Cierre', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'opening' } },
        },
      ],
    }),
    defineField({
      name: 'locations',
      title: 'Ubicaciones',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'city', title: 'Ciudad', type: 'string' }),
            defineField({ name: 'address', title: 'Dirección', type: 'string' }),
            defineField({ name: 'mapUrl', title: 'Enlace del mapa', type: 'url' }),
          ],
          preview: { select: { title: 'city', subtitle: 'address' } },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Menú principal',
      type: 'object',
      group: 'navigation',
      fields: [
        defineField({
          name: 'mainLinks',
          title: 'Enlaces',
          type: 'array',
          of: [{ type: 'link' }],
        }),
        defineField({ name: 'whatsappButtonLabel', title: 'Texto botón WhatsApp (cabecera)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Pie de página',
      type: 'object',
      group: 'navigation',
      fields: [
        defineField({
          name: 'links',
          title: 'Enlaces',
          type: 'array',
          of: [{ type: 'link' }],
        }),
        defineField({ name: 'whatsappActionLabel', title: 'Enlace WhatsApp', type: 'string' }),
        defineField({ name: 'instagramActionLabel', title: 'Enlace Instagram', type: 'string' }),
        defineField({
          name: 'copyright',
          title: 'Copyright',
          type: 'string',
          description: 'Usa {year} para el año actual y {brand} para el nombre de marca.',
        }),
      ],
    }),
    defineField({
      name: 'messaging',
      title: 'Mensajes',
      type: 'object',
      group: 'messaging',
      fields: [
        defineField({
          name: 'defaultWhatsappMessage',
          title: 'Mensaje general de WhatsApp',
          type: 'string',
        }),
        defineField({
          name: 'whatsappFabLabel',
          title: 'Etiqueta accesible del botón flotante',
          type: 'string',
          description: 'Usa {brand} para insertar el nombre de marca.',
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'messaging',
      fields: [
        defineField({
          name: 'metaDescription',
          title: 'Descripción meta',
          type: 'text',
          rows: 3,
          description: 'Si está vacío, se usa el texto de la portada.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'identity.brandName',
      subtitle: 'identity.tagline',
      media: 'identity.logo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Configuración del sitio',
        subtitle,
        media,
      };
    },
  },
});
