# Autos La 15 — entrega del sitio real (cliente y operación)

Documento de handoff para el sitio en producción. El sitio provisional sigue disponible como respaldo hasta que el cliente apruebe el cambio de URL pública.

## URLs

| Qué | URL |
|-----|-----|
| **Sitio en producción (actual)** | https://autos-la-15.vercel.app |
| **Panel de contenido (Studio)** | https://autos-la-15.vercel.app/studio |
| **Sitio provisional (respaldo)** | https://provisional-khaki.vercel.app |
| **Repositorio** | https://github.com/Furda/autos-la-15 |

Cuando exista dominio propio (ej. `www.autosla15.com`), se configurará en Vercel y se actualizará `PUBLIC_SITE_URL` en el proyecto.

---

## Para el cliente — editar el sitio

### Acceso

1. Abrir **https://autos-la-15.vercel.app/studio**
2. Iniciar sesión con la cuenta de Sanity que el equipo haya invitado al proyecto.
3. Si no hay acceso, pedir una invitación al administrador del proyecto Sanity (`7mz74qpp`).

Si aparece la pantalla **“Connect this Studio to your project”** en producción, el administrador debe **Registrar studio** (o ejecutar una vez `npx sanity@latest deploy --external --url https://autos-la-15.vercel.app/studio` desde el repo). También hace falta el origen CORS `https://autos-la-15.vercel.app` con credenciales en [Sanity Manage → API](https://www.sanity.io/manage).

### Qué se puede editar

- **Vehículos (`car`):** título, año, precio, descripción, foto, estado (`available`, `reserved`, `sold`, `archived`), destacado, badge, mensaje de WhatsApp, etc.
- **Ajustes del sitio (`siteSettings`):** textos de inicio, contacto, horarios, direcciones, redes, bloques editoriales.

### Publicar cambios en la web

1. Editar el documento en Studio.
2. Pulsar **Publish** (no basta con guardar borrador).
3. Esperar **1–3 minutos**: el sistema avisa a Vercel y se genera una nueva versión del sitio.
4. Actualizar la página en el navegador (si no se ve el cambio, probar recarga forzada o ventana privada).

### WhatsApp

Los botones verdes y las consultas por vehículo usan los números y mensajes configurados en el CMS. Tras cambiar un mensaje o un vehículo, publicar y comprobar un enlace en el móvil.

### Soporte habitual

| Problema | Qué hacer |
|----------|-----------|
| No veo el cambio en la web | ¿Se pulsó **Publish**? ¿Pasaron unos minutos? ¿Recarga forzada? |
| No puedo entrar a Studio | Pedir invitación al proyecto Sanity. |
| Error al subir imagen | Formato habitual (JPG/PNG/WebP); tamaño razonable; reintentar. |

---

## Para operación técnica

### Arquitectura breve

- **Frontend:** Astro (sitio estático) en Vercel, proyecto **`autos-la-15`**.
- **CMS:** Sanity, proyecto **`7mz74qpp`**, dataset **`production`**.
- **Studio:** embebido en `/studio` (misma app que el sitio).
- **Actualización automática:** webhook en Sanity → deploy hook en Vercel (`sanity-cms-rebuild`, rama **`main`**) → `npm run build` en Vercel.

### Cuentas y permisos

| Sistema | Recurso | Notas |
|---------|---------|--------|
| **GitHub** | `Furda/autos-la-15` | Rama **`main`** = producción. Cambios vía ramas feature + PR a `main`. |
| **Vercel** | `autos-la-15` | Production branch: **`main`**. Env: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `PUBLIC_SITE_URL`. |
| **Sanity** | `7mz74qpp` | Invitar editores en [sanity.io/manage](https://www.sanity.io/manage). Tokens de escritura solo en entornos locales/CI, no en el repo. |

### Variables de entorno (Vercel)

Ya configuradas en **Production** y **Preview**:

- `SANITY_PROJECT_ID=7mz74qpp`
- `SANITY_DATASET=production`
- `SANITY_API_VERSION=2026-09-21`
- `PUBLIC_SITE_URL=https://autos-la-15.vercel.app`

Al cambiar el dominio final, actualizar `PUBLIC_SITE_URL`, añadir CORS + volver a registrar el Studio con la nueva URL (`sanity deploy --external --url https://<dominio>/studio`), y redeploy en Vercel.

### Desarrollo local

Ver `README.md` en la raíz del repo. Resumen:

```bash
cp .env.example .env   # completar SANITY_* y SANITY_TOKEN local
npm install
npm run dev            # sitio en :4321, Studio en /studio
npm run check && npm run build
```

Semilla inicial (solo si hace falta repoblar): `npm run seed:sanity` (requiere `SANITY_TOKEN` en `.env`).

### Webhook / deploy hook (referencia)

- Vercel deploy hook: **`sanity-cms-rebuild`** → rama `main`.
- Sanity webhook: **Vercel production rebuild (CMS publish)** — documentos `car` y `siteSettings`.
- Reconfiguración: `node --env-file=.env scripts/setup-cms-redeploy-webhook.mjs` (requiere `VERCEL_DEPLOY_HOOK_URL` en `.env` local).

### Sitio provisional

- Carpeta `provisional/` en el repo **no** alimenta el sitio real.
- Proyecto Vercel **separado** del real.
- Plan sugerido: mostrar el sitio real al cliente → acordar fecha de corte → actualizar enlaces/marketing → opcionalmente redirigir el dominio provisional.

### Verificación rápida post-cambio

- https://autos-la-15.vercel.app/ — inicio
- https://autos-la-15.vercel.app/studio — Studio
- https://autos-la-15.vercel.app/sitemap-index.xml — sitemap

---

## Después de la demo con el cliente (no implementado aún)

Acordar con el cliente antes de construir:

- Dominio propio y correo/DNS
- Analytics (ej. Google Analytics, Plausible)
- Más tipos de contenido (blog, equipo, landing por sucursal)
- Vista previa de borradores / edición visual en vivo (requiere trabajo adicional de arquitectura)
- Retirada o redirección del sitio provisional

---

## Contacto del proyecto

Registrar aquí quién tiene acceso de administrador a Sanity, Vercel y GitHub (nombres/correos internos; no incluir tokens en este archivo).

| Rol | Nombre | Notas |
|-----|--------|--------|
| Admin Sanity | _pendiente_ | |
| Admin Vercel | _pendiente_ | |
| Admin GitHub | _pendiente_ | |
