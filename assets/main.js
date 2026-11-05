/*
 * Portfolio behavior — navigation, theme, filters, and section state.
 * Framework-free progressive enhancement; no layout measurement in render paths.
 * Scroll animation lives in motion.js and is only loaded when appropriate.
 */
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initTheme() {
    const button = document.querySelector('.theme-button');
    const meta = document.querySelector('meta[name="theme-color"]');
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const key = 'bkk-theme';
    let preference = null;
    try { preference = window.localStorage.getItem(key); } catch { /* storage blocked */ }
    if (preference !== 'dark' && preference !== 'light') preference = null;

    const setTheme = theme => {
      root.dataset.theme = theme;
      if (meta) meta.content = theme === 'dark' ? '#0d1523' : '#f7f8f7';
      if (button) {
        button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        button.setAttribute('aria-pressed', String(theme === 'dark'));
        button.textContent = theme === 'dark' ? '☀' : '◐';
      }
    };

    setTheme(preference || (darkMode.matches ? 'dark' : 'light'));
    let themeTransition;
    button?.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      if (!reducedMotion.matches) {
        root.classList.add('theme-switching');
        clearTimeout(themeTransition);
        themeTransition = setTimeout(() => root.classList.remove('theme-switching'), 260);
      }
      setTheme(preference);
      try { window.localStorage.setItem(key, preference); } catch { /* private mode */ }
    });
    darkMode.addEventListener?.('change', event => {
      if (!preference) setTheme(event.matches ? 'dark' : 'light');
    });
  }

  function initNavigation() {
    const nav = document.querySelector('.topnav');
    const tools = document.querySelector('.nav-tools');
    if (!nav || !tools) return;

    nav.id = 'site-navigation';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.textContent = 'Menu';
    toggle.setAttribute('aria-controls', nav.id);
    tools.prepend(toggle);

    const setOpen = (open, restoreFocus = false) => {
      root.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      if (!open && restoreFocus) toggle.focus({ preventScroll: true });
    };
    setOpen(false);
    toggle.addEventListener('click', event => {
      const opening = !root.classList.contains('nav-open');
      setOpen(opening);
      if (opening && event.detail === 0) nav.querySelector('a')?.focus();
    });
    nav.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && root.classList.contains('nav-open')) setOpen(false, true);
    });
    document.addEventListener('pointerdown', event => {
      if (root.classList.contains('nav-open') && event.target instanceof Element && !event.target.closest('.site-header')) setOpen(false);
    });
    window.matchMedia('(min-width: 861px)').addEventListener?.('change', event => {
      if (event.matches) setOpen(false);
    });
    root.classList.add('js-enhanced');
  }

  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let requested = false;
    const update = () => {
      requested = false;
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    update();
    window.addEventListener('scroll', () => {
      if (requested) return;
      requested = true;
      requestAnimationFrame(update);
    }, { passive: true });

    const navLinks = [...document.querySelectorAll('.topnav a[href^="/#"]')];
    if (!navLinks.length || !('IntersectionObserver' in window)) return;
    const sections = navLinks.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) })).filter(entry => entry.section);
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!active) return;
      for (const item of sections) {
        if (item.section === active.target) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      }
    }, { rootMargin: '-16% 0px -56% 0px', threshold: 0 });
    sections.forEach(item => observer.observe(item.section));
  }

  function initFilters() {
    const buttons = [...document.querySelectorAll('button[data-filter]')];
    const cards = [...document.querySelectorAll('.project-grid [data-category-card]')];
    const countLabel = document.getElementById('filter-count');
    if (!buttons.length || !cards.length) return;
    const allowed = new Set(buttons.map(button => button.dataset.filter));
    const current = () => {
      const filter = new URL(window.location.href).searchParams.get('filter');
      return allowed.has(filter) ? filter : 'All';
    };
    const render = filter => {
      let count = 0;
      for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
      for (const card of cards) {
        const visible = filter === 'All' || card.dataset.categoryCard === filter;
        card.classList.toggle('hide', !visible);
        if (visible) count++;
      }
      if (countLabel) countLabel.textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}`;
    };
    const transition = filter => {
      if ('startViewTransition' in document && !reducedMotion.matches) {
        document.startViewTransition(() => render(filter));
      } else render(filter);
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      if (!allowed.has(filter) || filter === current()) return;
      const url = new URL(window.location.href);
      if (filter === 'All') url.searchParams.delete('filter');
      else url.searchParams.set('filter', filter);
      window.history.pushState({ portfolioFilter: filter }, '', url.pathname + url.search + url.hash);
      transition(filter);
      window.dispatchEvent(new CustomEvent('portfolio:filter-change'));
    }));
    window.addEventListener('popstate', () => render(current()));
    render(current());
  }

  function initMotion() {
    if (reducedMotion.matches || navigator.connection?.saveData) return;
    // Browser-native motion. Dynamic loading saves bytes on reduced-motion devices.
    import('/assets/motion.js').catch(() => { /* All content is readable without animation. */ });
  }

  initTheme();
  initNavigation();
  initStickyHeader();
  initFilters();
  initMotion();
})();
