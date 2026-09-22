(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var toggle = document.getElementById('nav-toggle');
  var navLinks = document.querySelectorAll('.main-nav a');

  function closeMenu() {
    if (!header || !toggle) return;
    header.classList.remove('nav-open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  var fab = document.getElementById('whatsapp-fab');
  if (fab) {
    window.addEventListener('scroll', function () {
      fab.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  document.querySelectorAll('.catalog-grid .reveal, .testimonial-layout .reveal').forEach(function (el, i) {
    el.style.transitionDelay = reducedMotion ? '0ms' : ((i % 3) * 90) + 'ms';
  });

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var statNums = document.querySelectorAll('.stat-num[data-count-to]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1300;
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if (statNums.length) {
    if ('IntersectionObserver' in window) {
      var statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            statNums.forEach(animateCount);
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.3 });
      statsObserver.observe(document.querySelector('.stats'));
    } else {
      statNums.forEach(animateCount);
    }
  }

  // Catalog pagination keeps one six-vehicle page in the accessibility tree at a time.
  var catalogPages = Array.prototype.slice.call(document.querySelectorAll('.catalog-page'));
  var indicators = Array.prototype.slice.call(document.querySelectorAll('[data-catalog-indicator]'));
  var previousButton = document.querySelector('[data-catalog-prev]');
  var nextButton = document.querySelector('[data-catalog-next]');
  var catalogStatus = document.querySelector('[data-catalog-status]');
  var currentPage = 0;

  function showCatalogPage(pageIndex) {
    if (!catalogPages.length) return;
    currentPage = Math.max(0, Math.min(pageIndex, catalogPages.length - 1));

    catalogPages.forEach(function (page, index) {
      var isCurrent = index === currentPage;
      page.hidden = !isCurrent;
      page.setAttribute('aria-hidden', String(!isCurrent));
      if (isCurrent) {
        page.querySelectorAll('.reveal').forEach(function (element) {
          element.classList.add('is-visible');
        });
      }
    });

    indicators.forEach(function (indicator, index) {
      var isCurrent = index === currentPage;
      indicator.classList.toggle('is-active', isCurrent);
      if (isCurrent) indicator.setAttribute('aria-current', 'page');
      else indicator.removeAttribute('aria-current');
    });

    if (previousButton) previousButton.disabled = currentPage === 0;
    if (nextButton) nextButton.disabled = currentPage === catalogPages.length - 1;
    if (catalogStatus) catalogStatus.textContent = 'Página ' + (currentPage + 1) + ' de ' + catalogPages.length + ' · 6 vehículos';
  }

  if (previousButton) previousButton.addEventListener('click', function () { showCatalogPage(currentPage - 1); });
  if (nextButton) nextButton.addEventListener('click', function () { showCatalogPage(currentPage + 1); });
  indicators.forEach(function (indicator) {
    indicator.addEventListener('click', function () {
      showCatalogPage(parseInt(indicator.getAttribute('data-catalog-indicator'), 10));
    });
  });
  showCatalogPage(0);
})();
