# Autos La 15 — entrega del sitio real (cliente y operación)

Documento de handoff para el sitio en producción. El sitio provisional sigue disponible como respaldo hasta que el cliente apruebe el cambio de URL pública.

## URLs

| Qué | URL |
|-----|-----|
| **Sitio en producción (actual)** | https://autos-la-15.pages.dev |
| **Panel de contenido (Studio)** | https://autos-la-15.pages.dev/studio |
| **Sitio anterior (Vercel, legacy)** | https://autos-la-15.vercel.app |
| **Sitio provisional (respaldo)** | https://provisional-khaki.vercel.app |
| **Repositorio** | https://github.com/Furda/autos-la-15 |

Cuando exista dominio propio (ej. `www.autosla15.com`), se configurará en Cloudflare Pages y se actualizará `PUBLIC_SITE_URL` en el proyecto.

---

## Para el cliente — editar el sitio

### Acceso

1. Abrir **https://autos-la-15.pages.dev/studio**
2. Iniciar sesión con la cuenta de Sanity que el equipo haya invitado al proyecto.
3. Si no hay acceso, pedir una invitación al administrador del proyecto Sanity (`7mz74qpp`).

Si aparece la pantalla **“Connect this Studio to your project”** en producción, el administrador debe **Registrar studio** (o ejecutar una vez `npx sanity@latest deploy --external --url https://autos-la-15.pages.dev/studio` desde el repo). También hace falta el origen CORS `https://autos-la-15.pages.dev` con credenciales en [Sanity Manage → API](https://www.sanity.io/manage).

### Qué se puede editar

- **Vehículos (`car`):** título, año, precio, descripción, foto, estado (`available`, `reserved`, `sold`, `archived`), destacado, badge, mensaje de WhatsApp, etc.
- **Configuración del sitio (`siteSettings`):** logo, menú, pie de página, contacto, horarios, direcciones, redes, mensajes de WhatsApp y SEO.
- **Página: Inicio (`homePage`):** portada, datos, historia, textos del catálogo, testimonios, preguntas frecuentes y bloque de contacto (textos e imágenes).

### Publicar cambios en la web

1. Editar el documento en Studio.
2. Pulsar **Publish** (no basta con guardar borrador).
3. Esperar **1–3 minutos**: el sistema avisa a Cloudflare Pages y se genera una nueva versión del sitio.
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

- **Frontend:** Astro (sitio estático) en Cloudflare Pages, proyecto **`autos-la-15`**.
- **CMS:** Sanity, proyecto **`7mz74qpp`**, dataset **`production`**.
- **Studio:** embebido en `/studio` (misma app que el sitio).
- **Actualización automática:** webhook en Sanity → deploy hook en Pages (`sanity-cms-rebuild`, rama **`main`**) → `npm run build` en Cloudflare.

### Cuentas y permisos

| Sistema | Recurso | Notas |
|---------|---------|--------|
| **GitHub** | `Furda/autos-la-15` | Rama **`main`** = producción. Cambios vía ramas feature + PR a `main`. |
| **Cloudflare Pages** | `autos-la-15` | Cuenta cliente **`4d7b9cf1dfdca6bf57d5e857bc381f8d`** (Cristian). Production branch: **`main`**. Build env (Git + deploy hooks): ver abajo. |
| **Vercel (legacy)** | `autos-la-15` | Opcional: redirigir o pausar tras corte con el cliente. |
| **Sanity** | `7mz74qpp` | Invitar editores en [sanity.io/manage](https://www.sanity.io/manage). Tokens de escritura solo en entornos locales/CI, no en el repo. |

### Variables de entorno (Cloudflare Pages)

Configuradas en **Production** y **Preview** (tipo Text):

- `SANITY_PROJECT_ID=7mz74qpp`
- `SANITY_DATASET=production`
- `SANITY_API_VERSION=2026-09-21`
- `PUBLIC_SITE_URL=https://autos-la-15.pages.dev`
- `NODE_VERSION=22`

No añadir aquí `SANITY_TOKEN` ni `PAGES_DEPLOY_HOOK_URL` (solo en `.env` local).

Estas variables viven en la **configuración de build de Pages (Git)**, no en “Runtime variables” del Worker. Si el panel **Builds → Variables and secrets** aparece vacío pero los despliegues por Git o deploy hook funcionan, la fuente de verdad puede ser la API de Pages / despliegues antiguos; duplicar aquí las mismas cinco variables evita confusiones y fallos en rutas **Workers Builds**.

Al cambiar el dominio final, actualizar `PUBLIC_SITE_URL`, añadir CORS + volver a registrar el Studio con la nueva URL (`sanity deploy --external --url https://<dominio>/studio`), y redeploy en Pages.

### Panel Cloudflare — higiene (cuenta cliente)

1. **Despliegues que importan:** **Workers & Pages → autos-la-15 → Deployments**. Éxito con trigger **Git push**, **Deploy hook** o **Retry** = producción OK.
2. **Build (Git):** **Settings → Builds → Production** — `npm run build`, salida **`dist`**, rama **`main`**. No usar `npx wrangler deploy` solo (sitio estático Astro sin Worker); eso provoca “Last build failed” en la vista Workers Builds.
3. **Variables de build (Production y Preview):** en **Builds → Variables and secrets**, añadir las cinco variables de la tabla anterior (Text). Opcional: duplicar en Preview.
4. **Runtime variables:** pueden quedar vacías; el sitio es estático.
5. **Deploy hook CMS:** **Settings → Builds → Deploy hooks** (o **Trigger events**) — `sanity-cms-rebuild`, rama `main`. URL formato `.../pages/webhooks/deploy_hooks/<uuid>`. Tras **recrear el proyecto Pages**, crear un hook nuevo y actualizar `.env` + `node --env-file=.env scripts/setup-cms-redeploy-webhook.mjs`.
6. **Cuenta Furdac14:** el proyecto `autos-la-15` personal fue eliminado; producción solo en la cuenta cliente.

### Sanity — CORS y Studio (verificado)

En [Sanity Manage → API → CORS origins](https://www.sanity.io/manage):

- **Managed origins:** debe figurar **`https://autos-la-15.pages.dev`** (Allowed) tras desplegar Studio en producción.
- Entradas manuales **Superseded** con el mismo host son redundantes; opcional borrarlas.
- **`https://autos-la-15.vercel.app`:** legacy; se puede quitar cuando Vercel deje de usarse.

Comprobación funcional (una vez): abrir **/studio**, iniciar sesión, editar y **Publish** → en Cloudflare, nuevo deployment con trigger **Deploy hook** en ~1–3 min.

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

- Pages deploy hook: **`sanity-cms-rebuild`** → rama `main`.
- Sanity webhook: **Production rebuild (CMS publish)** — documentos `car`, `siteSettings` y `homePage` (Página de inicio).
- Reconfiguración: `node --env-file=.env scripts/setup-cms-redeploy-webhook.mjs` (requiere `PAGES_DEPLOY_HOOK_URL` en `.env` local).
- Solo filtro: `node --env-file=.env scripts/sync-cms-webhook-filter.mjs`

### Sitio provisional

- Carpeta `provisional/` en el repo **no** alimenta el sitio real.
- Proyecto Vercel **separado** del real.
- Plan sugerido: mostrar el sitio real al cliente → acordar fecha de corte → actualizar enlaces/marketing → opcionalmente redirigir el dominio provisional.

### Retirada de Vercel (manual, fuera del repo)

1. Vercel → proyecto **autos-la-15** (si aún existe): eliminar deploy hooks antiguos si siguen activos.
2. Quitar variables de entorno del proyecto (ya no se usan para producción).
3. Pausar o eliminar el proyecto cuando el cliente no necesite https://autos-la-15.vercel.app como respaldo.
4. Opcional: borrar carpeta local `.vercel` si existía tras `vercel link` (sigue ignorada en `.gitignore`).

### Verificación rápida post-cambio

- https://autos-la-15.pages.dev/ — inicio
- https://autos-la-15.pages.dev/studio — Studio
- https://autos-la-15.pages.dev/sitemap-index.xml — sitemap

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

Registrar aquí quién tiene acceso de administrador a Sanity, Cloudflare y GitHub (nombres/correos internos; no incluir tokens en este archivo).

| Rol | Nombre | Notas |
|-----|--------|--------|
| Admin Sanity | _pendiente_ | |
| Admin Cloudflare (Pages, cuenta cliente) | _pendiente_ | |
| Admin GitHub | _pendiente_ | |
