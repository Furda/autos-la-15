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

const showcaseLinks = [...document.querySelectorAll('[data-showcase-link]')];
const showcasePanels = [...document.querySelectorAll('[data-showcase-panel]')];
const setActiveVehicle = (index) => {
  showcaseLinks.forEach((link, linkIndex) => {
    const current = linkIndex === index;
    link.classList.toggle('is-active', current);
    if (current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
    if (!current) return;
    const behavior = reducedMotion ? 'auto' : 'smooth';
    const list = link.closest('ol');
    if (list && list.scrollWidth > list.clientWidth + 4) {
      list.scrollTo({ left: Math.max(0, link.offsetLeft - 16), behavior });
    }
    const rail = link.closest('.showcase-rail');
    if (rail && rail.scrollHeight > rail.clientHeight + 4) {
      const top = link.offsetTop - rail.offsetTop;
      const visibleStart = rail.scrollTop;
      const visibleEnd = visibleStart + rail.clientHeight;
      if (top < visibleStart || top + link.offsetHeight > visibleEnd) {
        rail.scrollTo({ top: Math.max(0, top - 12), behavior });
      }
    }
  });
};
if (showcasePanels.length && 'IntersectionObserver' in window) {
  const showcaseObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;
      setActiveVehicle(Number(visible.target.getAttribute('data-showcase-panel')));
    },
    { threshold: [0.45, 0.65] },
  );
  showcasePanels.forEach((panel) => showcaseObserver.observe(panel));
}

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
