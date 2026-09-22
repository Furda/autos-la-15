# Autos La 15 Provisional Redesign

## Objective

Refresh the provisional static website so it is visually distinct from the reference while preserving the Autos La 15 brand, content, and WhatsApp conversion path. This follow-up rewrites the visible Spanish copy without changing the page behavior.

## Authorized scope

- `provisional/index.html`
- `odd/tasks/provisional-redesign.md`
- No Astro, Sanity, or CMS work in this task.

## Checklist

- [x] Replace the hero with a full-bleed, centered-overlay composition inspired by the supplied reference, without hero slideshow behavior.
- [x] Redesign stats as a distinct editorial strip rather than the current four-cell table.
- [x] Convert Nuestra historia to an image-and-copy two-column section.
- [x] Convert the catalog to paginated six-card slides, three columns by two rows on desktop.
- [x] Preserve responsive behavior, accessibility, reduced motion, and working WhatsApp links.
- [x] Redesign the car cards into a distinct inventory gallery treatment while preserving pagination and vehicle data.
- [x] Redesign testimonials as a featured quote plus supporting quote composition.
- [x] Redesign FAQ as a split intro and numbered accordion layout.
- [x] Redesign contact and footer as a stronger branded closing experience.
- [x] Refine contact to a light three-card information layout with a wide map inspired by the supplied reference.
- [x] Refine inventory cards toward a clean commerce-style product card while keeping blue brand CTAs and green WhatsApp-only actions.
- [x] Audit CTA colors so only WhatsApp actions use green.
- [x] Simplify each car card to one blue WhatsApp “Consultar” action and remove the stock metadata row.
- [x] Tune the portrait hero crop toward the storefront and vehicles while documenting the preferred landscape asset ratio.
- [x] Replace the Nuestra historia image with the client-provided `who-are-we-section.jpg` asset.
- [x] Remove the history image caption and rewrite the full Spanish site copy around trust, local experience, transparent purchase and sale, original paperwork, practical guidance, and direct WhatsApp contact.
- [x] Verify locally. Deployment remains intentionally deferred to the parent.

## Acceptance checks

- Hero remains readable over the image and keeps one primary WhatsApp action.
- Catalog exposes six vehicles per page with keyboard-accessible previous/next controls and page indicators.
- All existing car WhatsApp links remain intact.
- Mobile layout collapses without horizontal overflow.

## Progress

- Route: single-writer follow-up pass across the provisional static site and this task document.
- TDD: not applicable to this static marketing page; browser and structural checks are required.
- Follow-up: replaced `provisional/assets/img/hero.jpg` with the client-provided storefront image from `assets/hero-image.jpg`.
- Follow-up: extended the established editorial language through the inventory, testimonials, FAQ, contact, and footer sections without changing the Astro or Sanity setup.
- Follow-up: changed contact to a light three-card layout with preserved contact details, WhatsApp action, and a wide Maracaibo map block.
- Follow-up: changed inventory cards to light commerce-style cards with blue actions and preserved the WhatsApp enquiry URLs.
- Follow-up: restored blue general CTA selectors and limited `var(--whatsapp)` usage to WhatsApp selectors.
- Follow-up: reduced every car card to one blue `Consultar` WhatsApp link, removed the stock metadata row, and kept the existing 0 KM badges.
- Follow-up: confirmed the active hero asset is `provisional/assets/img/hero.jpg` at 768x1024. Desktop crop uses `center 62%`, mobile crop uses `center 50%`, and the recommended replacement is landscape 16:9, ideally 1920x1080 or 2400x1350.
- Follow-up: replaced the Nuestra historia image with `provisional/assets/img/who-are-we-section.jpg` and added descriptive alternative text.
- Follow-up: rewrote all non-testimonial visible copy in `provisional/index.html`, preserved the four supplied testimonial quotes and author names, removed the history caption, and kept all URLs, vehicle data, image paths, section IDs, and pagination hooks unchanged.

## Verification evidence

- `node --check provisional/assets/js/script.js`: passed.
- Structural and text check: passed, exactly 12 `class="car-card reveal"` matches, exactly 2 catalog pages, exactly 12 car-card action links, 16 WhatsApp links, 19 local asset references covering 16 unique paths, 0 missing local asset paths, 0 remaining `history-caption` tokens, all four supplied testimonial quotes preserved, and 0 em dash characters in the page.
- CTA color selector check: passed, only `.btn-whatsapp`, `.whatsapp-fab`, and `.whatsapp-fab-ring` use `var(--whatsapp)`; general `.btn-primary` and footer actions use `var(--accent)` or `var(--accent-strong)`.
- Hero asset check: passed, `hero.jpg` is 768x1024 and the CSS declares `center 62% / cover` for desktop plus `center 50%` for mobile without distortion.
- `python -m http.server 8099` with `Invoke-WebRequest http://127.0.0.1:8099/`: HTTP 200, 29,106 bytes.
- Browser check at desktop width 1440px: 6 visible cards on the active page, one blue `Consultar` action per card, catalog advanced to page 2 with 6 visible cards and `Página 2 de 2 · 6 vehículos`, hero background loaded with `cover` and `50% 62%` positioning, and no horizontal overflow.
- Browser check at 390px mobile width: 6 visible cards on the active page, one blue `Consultar` action per card, hero background loaded with `cover` and `50% 50%` positioning, contact cards stacked in one column, and no horizontal overflow.
- Motion audit: passed, no `transition: all` or layout-property animation selectors found.
