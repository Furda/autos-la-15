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
const heroSection = document.querySelector('.hero');
const updateHeaderOnScroll = () => {
  const scrolled = window.scrollY > 8;
  header?.classList.toggle('scrolled', scrolled);
  const overHero = Boolean(heroSection && window.scrollY < heroSection.offsetHeight - 72);
  header?.classList.toggle('over-hero', overHero);
  document.getElementById('whatsapp-fab')?.classList.toggle('visible', window.scrollY > 400);
};
updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
window.addEventListener('resize', updateHeaderOnScroll, { passive: true });

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

const slideshowRoot = document.querySelector('[data-slideshow]');
const slideshowTrack = document.querySelector('[data-slideshow-track]');
const allSlideshowSlides = [...document.querySelectorAll('[data-slideshow-slide]')];
const allSlideshowDots = [...document.querySelectorAll('[data-slideshow-dot]')];
const slideshowPrev = document.querySelector('[data-slideshow-prev]');
const slideshowNext = document.querySelector('[data-slideshow-next]');
const slideshowStatus = document.querySelector('[data-slideshow-status]');
const catalogFilterEmpty = document.querySelector('[data-catalog-filter-empty]');
const catalogFilterEmptyText = document.querySelector('[data-catalog-filter-empty-text]');
const catalogFilterReset = document.querySelector('[data-catalog-filter-reset]');
const catalogFilterButtons = [...document.querySelectorAll('button[data-catalog-filter]')];
const catalogSortRoot = document.querySelector('[data-catalog-sort]');
const catalogSortTrigger = document.querySelector('[data-catalog-sort-trigger]');
const catalogSortPopover = document.querySelector('[data-catalog-sort-popover]');
const catalogSortCurrent = document.querySelector('[data-catalog-sort-current]');
const catalogSortOptions = [...document.querySelectorAll('[data-catalog-sort-value]')];
const slideshowDotsContainer = document.querySelector('.slideshow-dots');
const catalogSortLabels = {
  default: 'Ordenar',
  newest: 'Más nuevos',
  oldest: 'Más antiguos',
};
const catalogFilterLabels = {
  all: 'todos',
  'zero-km': '0 KM',
  used: 'usados',
  reserved: 'reservados',
};
const slideshowBehavior = reducedMotion ? 'auto' : 'smooth';
let slideshowIndex = 0;
let activeCatalogFilter = 'all';
let activeCatalogSort = catalogSortRoot?.getAttribute('data-value') ?? 'default';

const setCatalogSortUi = (sort) => {
  activeCatalogSort = sort;
  catalogSortRoot?.setAttribute('data-value', sort);
  if (catalogSortCurrent) catalogSortCurrent.textContent = catalogSortLabels[sort] ?? sort;
  catalogSortTrigger?.classList.toggle('is-active', sort !== 'default');
  catalogSortOptions.forEach((option) => {
    const current = option.getAttribute('data-catalog-sort-value') === sort;
    option.classList.toggle('is-selected', current);
    option.setAttribute('aria-selected', String(current));
  });
};

const closeCatalogSort = () => {
  catalogSortPopover?.setAttribute('hidden', '');
  catalogSortTrigger?.setAttribute('aria-expanded', 'false');
  catalogSortRoot?.classList.remove('is-open');
};

const openCatalogSort = () => {
  catalogSortPopover?.removeAttribute('hidden');
  catalogSortTrigger?.setAttribute('aria-expanded', 'true');
  catalogSortRoot?.classList.add('is-open');
};

const catalogSortKey = (element) => ({
  index: Number(element.getAttribute('data-sort-index')) || 0,
  year: Number(element.getAttribute('data-sort-year')) || 0,
  created: element.getAttribute('data-sort-created') || '',
});

const compareCatalogItems = (left, right, sort) => {
  const a = catalogSortKey(left);
  const b = catalogSortKey(right);
  if (sort === 'default') return a.index - b.index;
  if (sort === 'newest') {
    if (b.year !== a.year) return b.year - a.year;
    const created = b.created.localeCompare(a.created);
    if (created !== 0) return created;
    return a.index - b.index;
  }
  if (a.year !== b.year) return a.year - b.year;
  const created = a.created.localeCompare(b.created);
  if (created !== 0) return created;
  return a.index - b.index;
};

const applyCatalogSort = (sort) => {
  setCatalogSortUi(sort);
  if (!slideshowTrack || !slideshowDotsContainer) return;
  const sortedSlides = [...allSlideshowSlides].sort((left, right) => compareCatalogItems(left, right, sort));
  const slideOrder = new Map(sortedSlides.map((slide, index) => [slide.getAttribute('data-car-id'), index]));
  const sortedDots = [...allSlideshowDots].sort((left, right) => {
    const leftOrder = slideOrder.get(left.getAttribute('data-car-id')) ?? 0;
    const rightOrder = slideOrder.get(right.getAttribute('data-car-id')) ?? 0;
    return leftOrder - rightOrder;
  });
  sortedSlides.forEach((slide) => slideshowTrack.appendChild(slide));
  sortedDots.forEach((dot) => slideshowDotsContainer.appendChild(dot));
  allSlideshowSlides.splice(0, allSlideshowSlides.length, ...sortedSlides);
  allSlideshowDots.splice(0, allSlideshowDots.length, ...sortedDots);
  goToSlide(0);
};

const slideMatchesFilter = (element, filter) => {
  if (filter === 'all') return true;
  const groups = (element.getAttribute('data-catalog-filter') || '').split(/\s+/).filter(Boolean);
  return groups.includes(filter);
};

const getVisibleSlides = () => allSlideshowSlides.filter((slide) => !slide.classList.contains('is-filtered-out'));
const getVisibleDots = () => allSlideshowDots.filter((dot) => !dot.classList.contains('is-filtered-out'));

const setSlideshowIndex = (index) => {
  const visibleSlides = getVisibleSlides();
  if (!visibleSlides.length) {
    slideshowIndex = 0;
    allSlideshowSlides.forEach((slide) => slide.classList.remove('is-active'));
    allSlideshowDots.forEach((dot) => {
      dot.classList.remove('is-active');
      dot.setAttribute('aria-selected', 'false');
    });
    if (slideshowPrev) slideshowPrev.disabled = true;
    if (slideshowNext) slideshowNext.disabled = true;
    if (slideshowStatus) slideshowStatus.textContent = '';
    slideshowRoot?.classList.add('is-empty-filter');
    catalogFilterEmpty?.removeAttribute('hidden');
    if (catalogFilterEmptyText && activeCatalogFilter !== 'all') {
      const label = catalogFilterLabels[activeCatalogFilter] ?? activeCatalogFilter;
      catalogFilterEmptyText.textContent = `No hay vehículos en «${label}» por ahora. Prueba otra categoría o contáctanos si buscas algo en particular.`;
    } else if (catalogFilterEmptyText) {
      catalogFilterEmptyText.textContent = 'No hay vehículos que coincidan con este filtro.';
    }
    return;
  }
  slideshowRoot?.classList.remove('is-empty-filter');
  catalogFilterEmpty?.setAttribute('hidden', '');
  slideshowIndex = Math.max(0, Math.min(index, visibleSlides.length - 1));
  const activeSlide = visibleSlides[slideshowIndex];
  const activeCarId = activeSlide?.getAttribute('data-car-id');
  allSlideshowSlides.forEach((slide) => slide.classList.toggle('is-active', slide === activeSlide));
  allSlideshowDots.forEach((dot) => {
    const current = dot.getAttribute('data-car-id') === activeCarId;
    dot.classList.toggle('is-active', current);
    dot.setAttribute('aria-selected', String(current));
  });
  if (slideshowPrev) slideshowPrev.disabled = slideshowIndex === 0;
  if (slideshowNext) slideshowNext.disabled = slideshowIndex === visibleSlides.length - 1;
  if (slideshowStatus) slideshowStatus.textContent = `${slideshowIndex + 1} de ${visibleSlides.length}`;
};

const slideScrollTarget = (slide, index, total) => {
  if (!slide || !slideshowTrack) return 0;
  const maxScroll = slideshowTrack.scrollWidth - slideshowTrack.clientWidth;
  if (index === 0) return slide.offsetLeft;
  const centered = slide.offsetLeft - (slideshowTrack.clientWidth - slide.clientWidth) / 2;
  return Math.min(maxScroll, Math.max(0, centered));
};

const syncSlideshowIndex = () => {
  const visibleSlides = getVisibleSlides();
  if (!slideshowTrack || !visibleSlides.length) return;
  const maxScroll = slideshowTrack.scrollWidth - slideshowTrack.clientWidth;
  const scrollLeft = slideshowTrack.scrollLeft;
  if (scrollLeft <= 6) {
    if (slideshowIndex !== 0) setSlideshowIndex(0);
    return;
  }
  if (visibleSlides.length > 1 && scrollLeft >= maxScroll - 6) {
    const last = visibleSlides.length - 1;
    if (slideshowIndex !== last) setSlideshowIndex(last);
    return;
  }
  const trackRect = slideshowTrack.getBoundingClientRect();
  const trackCenter = trackRect.left + trackRect.width / 2;
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  visibleSlides.forEach((slide, index) => {
    const slideRect = slide.getBoundingClientRect();
    const slideCenter = slideRect.left + slideRect.width / 2;
    const distance = Math.abs(slideCenter - trackCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  if (best !== slideshowIndex) setSlideshowIndex(best);
};

const goToSlide = (index) => {
  const visibleSlides = getVisibleSlides();
  if (!visibleSlides.length) {
    setSlideshowIndex(0);
    return;
  }
  const slide = visibleSlides[index];
  if (!slide || !slideshowTrack) return;
  const left = slideScrollTarget(slide, index, visibleSlides.length);
  slideshowTrack.scrollTo({ left, behavior: slideshowBehavior });
  setSlideshowIndex(index);
};

const applyCatalogFilter = (filter) => {
  activeCatalogFilter = filter;
  catalogFilterButtons.forEach((button) => {
    const current = button.getAttribute('data-catalog-filter') === filter;
    button.classList.toggle('is-active', current);
    button.setAttribute('aria-pressed', String(current));
  });
  allSlideshowSlides.forEach((slide) => {
    slide.classList.toggle('is-filtered-out', !slideMatchesFilter(slide, filter));
  });
  allSlideshowDots.forEach((dot) => {
    dot.classList.toggle('is-filtered-out', !slideMatchesFilter(dot, filter));
  });
  goToSlide(0);
};

catalogFilterButtons.forEach((button) => {
  button.addEventListener('click', () => applyCatalogFilter(button.getAttribute('data-catalog-filter') || 'all'));
});
catalogFilterReset?.addEventListener('click', () => applyCatalogFilter('all'));
catalogSortTrigger?.addEventListener('click', (event) => {
  event.stopPropagation();
  if (catalogSortRoot?.classList.contains('is-open')) closeCatalogSort();
  else openCatalogSort();
});
catalogSortOptions.forEach((option) => {
  option.addEventListener('click', (event) => {
    event.stopPropagation();
    applyCatalogSort(option.getAttribute('data-catalog-sort-value') || 'default');
    closeCatalogSort();
  });
});
document.addEventListener('click', (event) => {
  if (!catalogSortRoot?.contains(event.target)) closeCatalogSort();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCatalogSort();
});

slideshowPrev?.addEventListener('click', () => goToSlide(slideshowIndex - 1));
slideshowNext?.addEventListener('click', () => goToSlide(slideshowIndex + 1));
allSlideshowDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    const carId = dot.getAttribute('data-car-id');
    const visibleIndex = getVisibleSlides().findIndex((slide) => slide.getAttribute('data-car-id') === carId);
    if (visibleIndex >= 0) goToSlide(visibleIndex);
  });
});
slideshowTrack?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    goToSlide(slideshowIndex + 1);
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    goToSlide(slideshowIndex - 1);
  }
});
let slideshowScrollFrame = 0;
slideshowTrack?.addEventListener(
  'scroll',
  () => {
    if (slideshowScrollFrame) cancelAnimationFrame(slideshowScrollFrame);
    slideshowScrollFrame = requestAnimationFrame(syncSlideshowIndex);
  },
  { passive: true },
);
window.addEventListener('resize', () => goToSlide(slideshowIndex), { passive: true });

if (slideshowTrack && allSlideshowSlides.length) {
  let dragPointerId = null;
  let dragStartX = 0;
  let dragScrollLeft = 0;
  let dragMoved = false;
  const DRAG_THRESHOLD_PX = 6;

  const endTrackDrag = () => {
    if (dragPointerId === null) return;
    slideshowTrack.classList.remove('is-dragging');
    dragPointerId = null;
    requestAnimationFrame(syncSlideshowIndex);
  };

  slideshowTrack.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button !== 0) return;
      if (event.target.closest('button, a, input, textarea, select, label')) return;
      dragPointerId = event.pointerId;
      dragStartX = event.clientX;
      dragScrollLeft = slideshowTrack.scrollLeft;
      dragMoved = false;
      slideshowTrack.classList.add('is-dragging');
      slideshowTrack.setPointerCapture(event.pointerId);
    },
    { passive: true },
  );

  slideshowTrack.addEventListener(
    'pointermove',
    (event) => {
      if (dragPointerId !== event.pointerId) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) dragMoved = true;
      if (!dragMoved) return;
      slideshowTrack.scrollLeft = dragScrollLeft - delta;
    },
    { passive: true },
  );

  slideshowTrack.addEventListener('pointerup', endTrackDrag);
  slideshowTrack.addEventListener('pointercancel', endTrackDrag);

  slideshowTrack.addEventListener(
    'click',
    (event) => {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    },
    true,
  );
}

if (allSlideshowSlides.length) goToSlide(0);

const VEHICLE_GALLERY_INTERVAL_MS = 2500;

document.querySelectorAll('[data-vehicle-gallery]').forEach((gallery) => {
  const card = gallery.closest('.vehicle-card');
  const photos = [...gallery.querySelectorAll('[data-vehicle-gallery-image]')];
  const dots = [...gallery.querySelectorAll('[data-vehicle-gallery-dot]')];
  const prev = gallery.querySelector('[data-vehicle-gallery-prev]');
  const next = gallery.querySelector('[data-vehicle-gallery-next]');
  const status = gallery.querySelector('[data-vehicle-gallery-status]');
  const progressFill = card?.querySelector('[data-vehicle-gallery-progress-fill]');
  if (photos.length < 2) return;

  let photoIndex = 0;
  let progressFrame = 0;
  let slideStartedAt = 0;
  let autoplayPaused = false;

  const stopAutoplay = () => {
    if (progressFrame) cancelAnimationFrame(progressFrame);
    progressFrame = 0;
    slideStartedAt = 0;
    if (progressFill) progressFill.style.width = '0%';
  };

  const runAutoplayFrame = (now) => {
    if (!card?.classList.contains('is-active') || autoplayPaused || reducedMotion) {
      stopAutoplay();
      return;
    }
    if (!slideStartedAt) slideStartedAt = now;
    const elapsed = now - slideStartedAt;
    const progress = Math.min(1, elapsed / VEHICLE_GALLERY_INTERVAL_MS);
    if (progressFill) progressFill.style.width = `${progress * 100}%`;
    if (elapsed >= VEHICLE_GALLERY_INTERVAL_MS) {
      setPhotoIndex(photoIndex + 1);
      return;
    }
    progressFrame = requestAnimationFrame(runAutoplayFrame);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!card?.classList.contains('is-active') || autoplayPaused || reducedMotion) return;
    slideStartedAt = performance.now();
    progressFrame = requestAnimationFrame(runAutoplayFrame);
  };

  const setPhotoIndex = (index) => {
    photoIndex = (index + photos.length) % photos.length;
    photos.forEach((photo, i) => photo.classList.toggle('is-active', i === photoIndex));
    dots.forEach((dot, i) => {
      const current = i === photoIndex;
      dot.classList.toggle('is-active', current);
      dot.setAttribute('aria-selected', String(current));
    });
    if (status) status.textContent = `${photoIndex + 1} de ${photos.length}`;
    startAutoplay();
  };

  prev?.addEventListener('click', (event) => {
    event.stopPropagation();
    setPhotoIndex(photoIndex - 1);
  });
  next?.addEventListener('click', (event) => {
    event.stopPropagation();
    setPhotoIndex(photoIndex + 1);
  });
  dots.forEach((dot) => {
    dot.addEventListener('click', (event) => {
      event.stopPropagation();
      setPhotoIndex(Number(dot.getAttribute('data-vehicle-gallery-dot')));
    });
  });

  gallery.addEventListener('mouseenter', () => {
    autoplayPaused = true;
    stopAutoplay();
  });
  gallery.addEventListener('mouseleave', () => {
    autoplayPaused = false;
    startAutoplay();
  });
  gallery.addEventListener('focusin', () => {
    autoplayPaused = true;
    stopAutoplay();
  });
  gallery.addEventListener('focusout', () => {
    autoplayPaused = false;
    startAutoplay();
  });

  if (card) {
    const activeObserver = new MutationObserver(() => {
      if (card.classList.contains('is-active')) startAutoplay();
      else stopAutoplay();
    });
    activeObserver.observe(card, { attributes: true, attributeFilter: ['class'] });
  }

  setPhotoIndex(0);
});

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
