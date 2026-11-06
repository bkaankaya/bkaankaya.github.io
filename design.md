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

---

## Revised premium ambient motion system — 2026-11-05

The static radial foundation remains in `app/globals.css`. A dedicated `app/ambient.css` now adds **two** finite-area, semi-transparent gradient orbs and an unobtrusive fixed-pattern grid. Only `transform` and `opacity` animate at slow, asynchronous durations (22 / 28 seconds). The once-only 3500ms hero arc remains separate. Color composition is distinct in light and dark themes. Route-specific backgrounds are CSS-only.

Visitors can pause/resume the ambient animation using the header's labeled button; preference is stored locally. The control uses `aria-pressed`, keyboard focus and visible state. The scene is `aria-hidden` and pointer-inert. Under 640px, Save-Data or Reduced Motion, decorative orb animations do not run. These controls reflect WCAG 2.2 SC 2.2.2 without claiming a complete accessibility audit.

No new UI animation dependency, canvas, WebGL, external font or telemetry was introduced. Review with high zoom, slow CPU emulation and real-device testing before making performance claims. Sources: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide and https://web.dev/articles/animations-guide .

On viewports ≤640px and under reduced-motion or Save-Data, the decorative layers are stationary, so the pause button is hidden rather than exposing a nonfunctional control.

## Project illustration + pointer-reactive stipple (6 November 2026)

Each project card now has its own **editorial SVG**, stored locally in `public/projects/`, with the project name and content outside the illustration for accessibility. Artwork is an illustrative visualization, not a real screenshot or a claim of a production UI. Private source, personal data and licensed anime game assets are never exposed.

A page-spanning `ambient-dot-field` adds a fine static stipple pattern and a pointer-reactive spotlight by changing a CSS radial mask at most once per animation frame; no React state updates per move and no WebGL/canvas/frame-loop dependency. The field never captures mouse or keyboard events (`pointer-events:none`, `aria-hidden`). It is static and lightweight on touch/mobile, reduced-motion and Save-Data devices and disables the spotlight when the visitor pauses ambience. It complements, rather than duplicates, the existing two slowly animated ambient orbs. Content cards retain a readable opaque surface in both themes.

Visual QA contract: normal/reduced motion, pointer fine/coarse, dark/light, 320px–1920px, no lateral overflow, 7 distinct images present in static `out/projects/`, modal accessible via keyboard, focus return after Escape, data fact checks, no dangerous SVG content.

References: https://vercel.com/design/guidelines , https://web.dev/articles/animations-guide , https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame .

Final visual QA refinement: card artwork remains fully illustrated while project text sits on a near-opaque theme-matched paper surface to prevent the global stipple effect from lowering legibility. `DoraVoice` is the canonical product name on project and experience headings.
