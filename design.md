# Portfolio Design & Motion Engineering Specification (`design.md`)

## 1. Visual Direction & Tokens

The portfolio uses a dark-navy / violet-blue design system defined on `.portfolio-app` in `app/globals.css`, paired with a high-contrast light theme (`[data-theme="light"]`):

- **Dark Surface Palette**: `--site-bg: #080a16`, `--site-bg-soft: #0c1021`, `--site-text: #f5f6fc`, `--site-muted: #c0c4d4`, `--site-accent: #a77aff`
- **Light Surface Palette**: `--site-bg: #f6f7fb`, `--site-bg-soft: #eef0f8`, `--site-text: #17192b`, `--site-muted: #51576d`, `--site-accent: #7148d8`
- **Controlled Card Accents**: `violet` (`#a67aff`), `teal` (`#38d3cf`), `orange` (`#ff9b56`), `blue` (`#73a9ff`), and `pink` (`#ed83d0`) applied via `data-accent`.

---

## 2. Motion Grammar

All animations and transitions are restricted to compositor-friendly properties (`transform` and `opacity`) and governed by shared tokens:

- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`
- `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`
- `--duration-fast: 160ms`
- `--duration-base: 240ms`
- `--duration-slow: 460ms`

### Choreographed Interactions
1. **Hero Entrance (`.hero-stagger-item`)**: Eyebrow, heading, description, CTAs, social links, and the portrait/availability visual enter with a `75ms` step stagger (`460ms var(--ease-out)`), gated behind `@media (prefers-reduced-motion: no-preference)`.
2. **Scroll Reveal (`components/portfolio/reveal.tsx`)**: Elements already inside the initial viewport stay visible immediately without flashing. Below-the-fold sections animate once (`opacity: 0; translate3d(0, 14px, 0)` → `opacity: 1; translate3d(0, 0, 0)`) and unobserved.
3. **Header Active Indicator (`.nav-active-indicator`)**: Measures the active nav link and slides horizontally via `transform: translate3d(x, 0, 0)`.
4. **Project Archive Filtering (`components/portfolio/project-archive.tsx`)**: Uses `document.startViewTransition` (when supported and motion is allowed) with per-card `viewTransitionName: project-card-${slug}`, `:root { view-transition-name: none; }`, and `::view-transition { pointer-events: none; }`.
5. **Top-Layer Project Dialog (`components/portfolio/project-card.tsx`)**: Uses native `<dialog>` (`showModal()`) with `@starting-style`, `transition-behavior: allow-discrete`, and `[data-closing]` fallback for smooth entry and exit animations, body scroll lock, and trigger focus restoration.
6. **Reduced Motion (`@media (prefers-reduced-motion: reduce)`)**: Disables transform movement, wave drift, stagger animations, and view transitions on a case-by-case basis while keeping content immediately readable (`opacity: 1`).


---

## Ambient Aurora implementation — 5 November 2026

- Preserve the existing navy/violet portfolio identity while using a static three-focus radial background on all five routes; use progressively enhanced route-aware `:has()` selectors instead of an additional animated full-viewport layer.
- Koyu and light themes use separate low-opacity violet, blue and cyan tokens; screens under 600px get reduced glow intensity.
- The hero ellipse completes exactly one 3500ms `transform` and `opacity` animation, then stops. Reduced-motion disables it, while browsers with the optional Network Information API expose `Save-Data` through an HTML data attribute so the same decorative animation stops.
- The contrast of `#626980` subtle text against the light-theme base `#f6f7fb` is approximately 5.09:1; test actual blended backgrounds in-browser before claiming universal WCAG conformity.
- Preserve all content, verified contact links, the project interactions and GitHub Pages static output; do not add Motion/GSAP/WebGL merely for ambience.
- QA should verify the final motion at 4+ seconds, 320/390/768/1440/1920px, both color themes, route-specific gradients, reduced motion, and 200% text zoom.
- References: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide | https://web.dev/articles/animations-guide | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
