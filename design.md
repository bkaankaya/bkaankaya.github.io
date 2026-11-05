# Design engineering — Bertan Kaan Kaya portfolio

Updated: **5 November 2026**. The design is original and references approaches, not other brands' code or visual identities.

## Product intent

A precise, technically credible personal portfolio for hiring managers, engineering reviewers and collaborators. The first reading order is **identity → selected work → full project library → experience → about → contact**. Do not turn it into a dashboard, invented product demo or decorative animation showcase.

**Content is immutable by default:** TED University, academic credentials, existing location, projects, descriptions, dates, employers, URLs and private-source boundaries are not to be altered. `scripts/content-baseline.json` records SHA-256 hashes of all 13 published pages' visible body copy. An intentional copy change requires authorization and an explicit snapshot update.

## Visual system

- Palette: midnight navy (`#0c1626`) and off-white (`#f7f8f7`) with restrained warm-gold accents (`#dbb982` on the hero). Body copy uses accessible slate-blue neutrals. Dark mode uses the same hue family, not an unrelated color set.
- Type: system sans-serif for legible hierarchy, serif italics only for second-line editorial emphasis, monospace only for a small amount of metadata. No external font request or font-swap layout shift.
- Primary hero: wide navy surface and intentional negative space, headline and action links on the left, **small authentic circular original photograph** and existing research → intelligence → delivery process on the right. The photo is sourced directly from the user's original 640 × 640 photograph: native 325 × 325 crop, gentle tonal color correction and selective sharpening, WebP quality 96. It is not a face-regenerated replacement; the original cannot be given details it never recorded.
- Cards: consistent surface/border radii, soft two-layer shadow, quiet category-specific artwork, hover elevation up to 3 px. Never display fake product outcomes, ratings, or capabilities.
- Layout: intrinsic CSS Grid/Flexbox, one shared stylesheet `assets/styles.css`, single source of truth for tokens and sections. Mobile stepper flows into readable rows.

## Motion grammar (short, deliberate, cancelable)

| Pattern | Driver | Target and duration | Fallback |
| --- | --- | --- | --- |
| Hero entrance | `motion.js` + Web Animations API | Staggered heading, copy, actions and portrait; **530ms**, **65ms** stagger | Fully visible static DOM |
| Scroll reveal | `IntersectionObserver` + Web Animations API | On-first-entry opacity/translateY, **455ms**; ≤165ms stagger | All content visible; no animation gating |
| Card / CTA feedback | CSS `transform`, color, border, shadow | 160–450ms depending on target | No motion for reduced-motion users |
| Active navigation | IntersectionObserver + CSS underline | 190ms underline transform | Native links usable even without JS |
| Filter state | Native View Transition API if available | ~120–190ms subtle crossfade (only project grid) | Immediate filter with `aria-pressed` and polite count |
| Reading indicator | CSS `animation-timeline:scroll()` | 2px header progress | No progress line if unsupported |
| Sticky header | Passive scroll event + requestAnimationFrame | 180ms border/shadow feedback | Sticky header remains functional |

### Performance and accessibility rules

1. Prefer opacity and transforms; avoid continuous mouse listeners, canvas, 3D, scroll-position reads for animation, forced reflow and `transition: all`. Never hide meaningful content before JavaScript hydration.
2. `prefers-reduced-motion: reduce` disables nonessential animations. Motion JS is loaded on demand via dynamic `import('/assets/motion.js')` only when appropriate; `saveData` skips it.
3. All controls use native link/button semantics. Menu state is reflected in `aria-expanded`, has Escape, outside-pointer close and keyboard focus return. Project filters preserve URL and Back/Forward history.
4. Touch controls have a 44px preferred minimum; use visible keyboard focus, semantic landmarks, correct alt text, skip link and live filter count.
5. Media has explicit intrinsic dimensions, aspect ratio, no layout JS, and the portrait is optimized for its actual display diameter.
6. Test mobile **320/375/430px**, tablet **768px**, laptop **1024px**, desktop **1440/1920px**, dark mode, reduced motion, no JS and project detail pages. Verify Chrome/Firefox/Safari before asserting cross-browser certification.
7. Web Vitals targets at the 75th percentile are **LCP ≤2.5s, INP ≤200ms, CLS ≤0.1**. Browser screenshots and static CI do not prove those field thresholds.

## Architecture after refactor

- `index.html` and `projects/*/index.html`: semantic content, unmodified text.
- `assets/styles.css`: **one canonical token and component system**, including the hero and responsive layout. The previous override-based `cinematic.css` is deleted.
- `assets/main.js`: short, named controllers for theme, accessible nav, sticky/active header, filter/history, conditional motion import.
- `assets/motion.js`: isolated progressive motion implementation; no build or dependencies.
- `assets/portrait-kaan.webp`: original-photo crop, high-quality compression, circular via CSS only.
- `scripts/content-baseline.json`: content lock for published text.
- `scripts/check-site.mjs`: dependency-free route, content and design-contract checks.
- `.github/workflows/portfolio-quality.yml`: existing pinned CI workflow, now automatically running extended checks.

No new package, dependency version, branch, CSS framework, tracking service or runtime bundle was introduced. Existing project URLs stay unchanged.

## Technical source cross-checks

- Vercel Web Interface Guidelines: https://vercel.com/design/guidelines — motion principles, transform/opacity, accessibility, focus and layout.
- Vercel Geist design system: https://vercel.com/geist/introduction — cohesive component systems.
- Scale AI careers: https://scale.com/careers — reference **visual** hierarchy and restraint. Its proprietary animation timing/implementation has not been inspected or copied.
- Vague (private repo): `frontend/src/app/page.tsx` uses Framer Motion spring-stagger and `AnimatePresence`; `frontend/src/components/sections/HeroSection.tsx` uses layered photography and simple CSS CTA transitions.
- DoraVoice (private repo): `apps/web/src/components/marketing-site/MarketingMotion.tsx` uses `IntersectionObserver`, graceful reduced-motion, and progressive visibility; `ScrollText.tsx` avoids interrupting LCP headings; `apps/web/src/components/ui/Reveal.tsx` preserves SSR text and animates without hiding content.
- Motion technical guide: https://motion.dev/docs/inview — intersection-based reveal and off-main-thread intersection calculation.
- MDN native scroll timeline: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline/view — native `view()` support with fallbacks.
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion.
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/ — normative accessibility requirements.
- GitHub Primer accessibility engineering checklist: https://primer.style/accessibility/tools-and-resources/checklists/engineering-checklist/.
- Google Core Web Vitals: https://web.dev/articles/vitals.
