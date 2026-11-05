/* Portfolio interactions: progressively enhanced, framework-free. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-button');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'bkk-theme';

  function storedTheme() {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }
  let preference = storedTheme();
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)');
  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#151c19' : '#f6f5f0';
    if (themeButton) {
      themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
      themeButton.textContent = theme === 'dark' ? '☀' : '◐';
    }
  }
  setTheme(preference === 'dark' || preference === 'light'
    ? preference : systemDark?.matches ? 'dark' : 'light');

  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    preference = next;
    setTheme(next);
    try { localStorage.setItem(storageKey, next); } catch { /* private browsing */ }
  });
  systemDark?.addEventListener?.('change', event => {
    if (preference !== 'dark' && preference !== 'light') {
      setTheme(event.matches ? 'dark' : 'light');
    }
  });

  // The source HTML remains usable without JavaScript. A compact toggle
  // replaces the wrapping navigation only once enhancement is available.
  const nav = document.querySelector('.topnav');
  const tools = document.querySelector('.nav-tools');
  if (nav && tools) {
    nav.id = 'site-navigation';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.textContent = 'Menu';
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    tools.prepend(toggle);
    const closeMenu = (returnFocus = false) => {
      root.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const opening = !root.classList.contains('nav-open');
      root.classList.toggle('nav-open', opening);
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      if (opening) nav.querySelector('a')?.focus();
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && root.classList.contains('nav-open')) closeMenu(true);
    });
    document.addEventListener('pointerdown', event => {
      if (root.classList.contains('nav-open') && !event.target.closest('.site-header')) closeMenu();
    });
    const desktop = window.matchMedia?.('(min-width: 861px)');
    desktop?.addEventListener?.('change', event => { if (event.matches) closeMenu(); });
    root.classList.add('js-enhanced');
  }

  // Filter state belongs in the URL: links can be shared, and Back/Forward works.
  const filters = [...document.querySelectorAll('button[data-filter]')];
  const cards = [...document.querySelectorAll('.project-grid [data-category-card]')];
  const result = document.getElementById('filter-count');
  if (filters.length && cards.length) {
    const categories = new Set(filters.map(button => button.dataset.filter));
    const currentFilter = () => {
      const value = new URL(window.location.href).searchParams.get('filter');
      return value && categories.has(value) ? value : 'All';
    };
    const render = filter => {
      let count = 0;
      for (const button of filters) {
        button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
      }
      for (const card of cards) {
        const visible = filter === 'All' || card.dataset.categoryCard === filter;
        card.classList.toggle('hide', !visible);
        if (visible) count++;
      }
      if (result) result.textContent = 'Showing ' + count + ' ' + (count === 1 ? 'project' : 'projects');
    };
    for (const button of filters) {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        if (!categories.has(filter) || filter === currentFilter()) return;
        const url = new URL(window.location.href);
        if (filter === 'All') url.searchParams.delete('filter');
        else url.searchParams.set('filter', filter);
        history.pushState({ portfolioFilter: filter }, '', url.pathname + url.search + url.hash);
        render(filter);
      });
    }
    window.addEventListener('popstate', () => render(currentFilter()));
    render(currentFilter());
  }
})();


/* Motion enhancements modeled on Vague/DoraVoice; readable content by default. */
(() => {
  'use strict';
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const canAnimate = () => !reduced?.matches && !navigator.connection?.saveData && !document.hidden;
  if (!('animate' in Element.prototype) || !('IntersectionObserver' in window) || !canAnimate()) return;
  const easing = 'cubic-bezier(.16,1,.3,1)';
  const active = new Set();
  const run = (element, delay = 0, distance = 20, duration = 650) => {
    if (!canAnimate() || !element.isConnected) return;
    const animation = element.animate([
      { opacity: .65, transform: 'translate3d(0, ' + distance + 'px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' }
    ], { duration, delay, easing, fill: 'none' });
    active.add(animation);
    animation.addEventListener('finish', () => active.delete(animation), { once: true });
    animation.addEventListener('cancel', () => active.delete(animation), { once: true });
  };
  const stop = () => {
    for (const animation of active) animation.cancel();
    active.clear();
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const order = Number(entry.target.dataset.motionOrder || '0');
      run(entry.target, Math.min(order * 65, 195), 21, 660);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: .09 });
  reduced?.addEventListener?.('change', event => {
    if (event.matches) { observer.disconnect(); stop(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  const hero = document.querySelector('.cinematic-hero');
  if (hero) requestAnimationFrame(() => {
    hero.querySelectorAll('.hero-status, h1, .hero-copy > p, .buttons, .facts')
      .forEach((element, index) => run(element, Math.min(index * 85, 340), 13, 720));
  });

  document.querySelectorAll(
    '.section-head, .featured-grid .card, .project-grid .card, .timeline-row, ' +
    '.skill-row, .contact-box, .case-hero, .case-article section'
  ).forEach((element, index) => {
    element.dataset.motionOrder = String(index % 4);
    observer.observe(element);
  });

  // Filtered cards communicate the updated results without animating layout.
  const filterBar = document.querySelector('.filters');
  filterBar?.addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.closest('button[data-filter]')) return;
    requestAnimationFrame(() => {
      document.querySelectorAll('.project-grid .card:not(.hide)')
        .forEach((element, index) => run(element, Math.min(index * 28, 140), 12, 380));
    });
  });
})();
