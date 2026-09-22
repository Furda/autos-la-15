document.documentElement.classList.add('js-reveal');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const toggle = document.getElementById('nav-toggle');
const closeMenu = () => {
  if (!header || !toggle) return;
  header.classList.remove('nav-open');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
};
toggle?.addEventListener('click', () => {
  const isOpen = header?.classList.toggle('nav-open') ?? false;
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener(
  'scroll',
  () => {
    header?.classList.toggle('scrolled', window.scrollY > 8);
    document.getElementById('whatsapp-fab')?.classList.toggle('visible', window.scrollY > 400);
  },
  { passive: true },
);

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const statNumbers = document.querySelectorAll('[data-count-to]');
const animateCount = (element) => {
  const target = Number(element.getAttribute('data-count-to'));
  const suffix = element.getAttribute('data-suffix') ?? '';
  if (reducedMotion) {
    element.textContent = `${target}${suffix}`;
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / 1300, 1);
    element.textContent = `${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = `${target}${suffix}`;
  };
  requestAnimationFrame(step);
};
const stats = document.querySelector('.stats');
if (stats && statNumbers.length) {
  if ('IntersectionObserver' in window && !reducedMotion) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting || entry.boundingClientRect.bottom < 0)) {
          statNumbers.forEach(animateCount);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    statsObserver.observe(stats);
  } else {
    statNumbers.forEach(animateCount);
  }
}

const catalogPages = [...document.querySelectorAll('.catalog-page')];
const indicators = [...document.querySelectorAll('[data-catalog-indicator]')];
const previousButton = document.querySelector('[data-catalog-prev]');
const nextButton = document.querySelector('[data-catalog-next]');
const catalogStatus = document.querySelector('[data-catalog-status]');
let currentPage = 0;
const showCatalogPage = (pageIndex) => {
  if (!catalogPages.length) return;
  currentPage = Math.max(0, Math.min(pageIndex, catalogPages.length - 1));
  catalogPages.forEach((page, index) => {
    const current = index === currentPage;
    page.hidden = !current;
    page.setAttribute('aria-hidden', String(!current));
    if (current) page.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  });
  indicators.forEach((indicator, index) => {
    const current = index === currentPage;
    indicator.classList.toggle('is-active', current);
    if (current) indicator.setAttribute('aria-current', 'page');
    else indicator.removeAttribute('aria-current');
  });
  if (previousButton) previousButton.disabled = currentPage === 0;
  if (nextButton) nextButton.disabled = currentPage === catalogPages.length - 1;
  if (catalogStatus) catalogStatus.textContent = `Página ${currentPage + 1} de ${catalogPages.length} · 6 vehículos`;
};
previousButton?.addEventListener('click', () => showCatalogPage(currentPage - 1));
nextButton?.addEventListener('click', () => showCatalogPage(currentPage + 1));
indicators.forEach((indicator) =>
  indicator.addEventListener('click', () => showCatalogPage(Number(indicator.getAttribute('data-catalog-indicator')))),
);
showCatalogPage(0);

const faqDetails = [...document.querySelectorAll('.faq-item details')];
const faqDuration = 220;
const faqEasing = 'cubic-bezier(0.22, 1, 0.36, 1)';
const faqIntent = new WeakMap();
const faqMotion = new WeakMap();
let faqMotionId = 0;
const clearFaqMotion = (detail) => {
  detail.style.height = '';
  detail.style.overflow = '';
};
const closedFaqHeight = (detail) => {
  const summary = detail.querySelector('summary');
  if (!summary) return detail.offsetHeight;
  const styles = getComputedStyle(detail);
  return summary.offsetHeight + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
};
const stopFaqMotion = (detail) => {
  const height = detail.getBoundingClientRect().height;
  detail.getAnimations().forEach((animation) => animation.cancel());
  detail.style.height = '';
  return height;
};
const collapseFaq = (detail) => {
  if (faqIntent.get(detail) === 'closed' && !detail.open) return;
  faqIntent.set(detail, 'closed');
  const motionId = ++faqMotionId;
  faqMotion.set(detail, motionId);
  if (reducedMotion || typeof detail.animate !== 'function') {
    detail.open = false;
    clearFaqMotion(detail);
    return;
  }
  const start = stopFaqMotion(detail);
  if (!detail.open) return;
  const end = closedFaqHeight(detail);
  detail.style.overflow = 'hidden';
  const animation = detail.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: faqDuration, easing: faqEasing });
  animation.onfinish = () => {
    if (faqMotion.get(detail) !== motionId) return;
    detail.open = false;
    clearFaqMotion(detail);
  };
};
const expandFaq = (detail) => {
  faqDetails.forEach((other) => {
    if (other !== detail) collapseFaq(other);
  });
  faqIntent.set(detail, 'open');
  const motionId = ++faqMotionId;
  faqMotion.set(detail, motionId);
  if (reducedMotion || typeof detail.animate !== 'function') {
    detail.open = true;
    clearFaqMotion(detail);
    return;
  }
  const start = stopFaqMotion(detail);
  if (!detail.open) {
    detail.style.height = `${start}px`;
    detail.open = true;
  }
  detail.style.overflow = 'hidden';
  const end = detail.scrollHeight;
  const animation = detail.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: faqDuration, easing: faqEasing });
  animation.onfinish = () => {
    if (faqMotion.get(detail) !== motionId) return;
    clearFaqMotion(detail);
  };
};
faqDetails.forEach((detail) => {
  faqIntent.set(detail, detail.open ? 'open' : 'closed');
  detail.querySelector('summary')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (faqIntent.get(detail) === 'open') collapseFaq(detail);
    else expandFaq(detail);
  });
});
