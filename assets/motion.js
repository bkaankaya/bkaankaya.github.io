/*
 * Portfolio motion — deliberately restrained, native Web Animations API.
 * Only opacity and transform; no hidden-by-default content or perpetual loops.
 * Inspired by Vague's staggered cards and DoraVoice's progressive reveals.
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const canMove = () => !reduce.matches && !navigator.connection?.saveData && !document.hidden;
const easing = 'cubic-bezier(.22, 1, .36, 1)';
const active = new Set();
let observer;

function animate(element, { delay = 0, distance = 18, duration = 440 } = {}) {
  if (!canMove() || !element.isConnected || !element.animate) return;
  const effect = element.animate([
    { opacity: .72, transform: `translate3d(0,${distance}px,0)` },
    { opacity: 1, transform: 'translate3d(0,0,0)' }
  ], { duration, delay, easing, fill: 'none' });
  active.add(effect);
  const remove = () => active.delete(effect);
  effect.addEventListener('finish', remove, { once: true });
  effect.addEventListener('cancel', remove, { once: true });
}

function stop() {
  observer?.disconnect();
  active.forEach(effect => effect.cancel());
  active.clear();
}

function init() {
  if (!canMove() || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return;
  const hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(() => {
    ['.hero-status', 'h1', '.hero-copy > p', '.buttons', '.facts', '.portrait-photo'].forEach((selector, index) => {
      const element = hero.querySelector(selector);
      if (element) animate(element, { delay: index * 65, duration: 530, distance: 12 });
    });
  });

  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const order = Number(entry.target.dataset.motionOrder || 0);
      animate(entry.target, { delay: Math.min(order * 55, 165), distance: 18, duration: 455 });
    }
  }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });

  const candidates = document.querySelectorAll(
    '.section-head, .featured-grid .card, .project-grid .card, .timeline-row, ' +
    '.skill-row, .contact-box, .case-hero, .case-article section'
  );
  candidates.forEach((element, index) => {
    // Above-fold elements should never be blocked from painting or delayed on hydration.
    if (element.getBoundingClientRect().top < window.innerHeight * .82) return;
    element.dataset.motionOrder = String(index % 4);
    observer.observe(element);
  });

  window.addEventListener('portfolio:filter-change', () => {
    if (!canMove()) return;
    requestAnimationFrame(() => document.querySelectorAll('.project-grid .card:not(.hide)')
      .forEach((element, index) => {
        if (element.getBoundingClientRect().top < window.innerHeight && element.getBoundingClientRect().bottom > 0)
          animate(element, { delay: Math.min(index * 24, 100), distance: 8, duration: 275 });
      }));
  });
}

reduce.addEventListener?.('change', event => { if (event.matches) stop(); else init(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
init();
