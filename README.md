# B. Kaan Kaya — Software Engineer Portfolio

Production personal portfolio for **B. Kaan Kaya** (`https://bkaankaya.github.io/`), built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, and **TypeScript**, and deployed as a static export (`out/`) to **GitHub Pages**.

---

## Architecture & Route Map

All active routes live under `app/(portfolio)/` and share the persistent shell in `components/portfolio/portfolio-shell.tsx`:

| Route | Source File | Purpose |
|---|---|---|
| `/` | `app/(portfolio)/page.tsx` (`components/portfolio/home-page.tsx`) | Hero, circular portrait (`public/portrait-kaan.webp`), availability card, process strip, featured projects, and technology stack |
| `/projects/` | `app/(portfolio)/projects/page.tsx` (`components/portfolio/project-archive.tsx`) | Filterable seven-project archive (`All`, `AI`, `Full-stack`, `Embedded`, `Research`, `Blockchain`, `Games`) with native dialogs, project-specific SVG art and View Transitions |
| `/experience/` | `app/(portfolio)/experience/page.tsx` | Career timeline, hands-on project highlights, and core engineering skills |
| `/education/` | `app/(portfolio)/education/page.tsx` | Academic background, focus areas, languages, and continuous learning |
| `/about/` | `app/(portfolio)/about/page.tsx` | Engineering philosophy, location & relocation status (`Based in Turkey, Ankara · Open to relocating to Europe`), core values, and contact cards |

---

## Core Components & Data Modules

- `components/portfolio/portfolio-shell.tsx`: Theme state (`dark` default, persisted under `localStorage["bk-portfolio-theme"]` and synced with `document.documentElement`), skip link, header, and footer wrapper.
- `components/portfolio/site-header.tsx`: Sticky header with custom `BK.` monogram, trailing-slash-normalized active route detection, compositor-friendly sliding active nav indicator, theme toggle, and accessible mobile menu (`Escape` + outside-click close with focus restoration).
- `components/portfolio/project-card.tsx`: Project card with accessible trigger (`button` on title + open icon button) and native `<dialog>` modal with `@starting-style` / `[data-closing]` top-layer entry/exit transitions and focus restoration.
- `components/portfolio/project-archive.tsx`: Category filter bar progressively enhanced with the View Transitions API (`document.startViewTransition`).
- `components/portfolio/reveal.tsx`: IntersectionObserver scroll reveal component that keeps initial-viewport content immediately visible (no hydration flash) and respects `prefers-reduced-motion: reduce` and `navigator.connection.saveData`.
- `components/portfolio/brand-icon.tsx`: Renders official local SVG brand marks from `public/brands/` with automatic dark/light theme adaptation.
- `lib/portfolio-contact.ts`: Single source of truth for verified contact details (`kaankaya928@gmail.com`, `https://github.com/bkaankaya`, `https://www.linkedin.com/in/kaan-kaya-9890812b0/`, `Full-time · Contract · Remote`), enforced in CI by `scripts/verify-portfolio-contacts.mjs`.
- `lib/portfolio-data.ts`: Structured data for projects, process steps, technologies, experience, education, and values.

---

## Brand Icons & Visual Assets

- **Custom Monogram Favicon**: `public/icon.svg`, `public/icon-dark-32x32.png`, `public/icon-light-32x32.png`, and `public/apple-icon.png` feature a custom geometric `BK.` monogram on `#080a16` dark navy with a `#a77aff` violet accent dot.
- **Optimized Local Portrait**: `public/portrait-kaan.webp` (`520×520`, 1:1 square, ~40 KB WebP) centered on the face inside circular frames across all breakpoints.
- **Official Brand SVGs**: Stored locally in `public/brands/` (`react.svg`, `nextjs.svg`, `python.svg`, `java.svg`, `docker.svg`, `postgresql.svg`, `aws.svg`, `aws-light.svg`, `github.svg`, `linkedin.svg`). Full provenance and trademark notes are documented in [`docs/BRAND_ASSETS.md`](docs/BRAND_ASSETS.md).

---

## Verification & Build Commands

```bash
pnpm install --frozen-lockfile
node scripts/verify-portfolio-contacts.mjs
pnpm run check
pnpm run build
```

Static output is generated in `out/` (`output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`) and deployed automatically via `.github/workflows/deploy-next-pages.yml`.


## Security

Static GitHub Pages site: no backend, authentication or user data. The deployed artifact is plain static files. The owner's approved targeted upgrades to Next.js 16.4.5 / PostCSS 8.5.32 plus narrow transitive pnpm overrides have been completed. The 2026-11-05 final lockfile scan found no known advisories; ongoing pnpm audit is still enforced and may flag new issues in the future. See [SECURITY_RISK_REGISTER.md](SECURITY_RISK_REGISTER.md), [SECURITY_REVIEW_2026-11-05.md](SECURITY_REVIEW_2026-11-05.md) and [docs/SECURITY_ARCHITECTURE.md](docs/SECURITY_ARCHITECTURE.md) (trust boundary, CSP/header limits).

CI toolchain: Node 22, pnpm 10.11.0. Security checks (POSIX shell):

```bash
pnpm install --frozen-lockfile
node scripts/verify-portfolio-contacts.mjs
pnpm exec tsc --noEmit
node --test scripts/*.test.mjs
pnpm run build
REQUIRE_OUT=1 node --test scripts/security-static.test.mjs
pnpm audit --audit-level high   # enforced; must exit successfully
```

PowerShell variant of the artifact audit:

```powershell
$env:REQUIRE_OUT = "1"; node --test scripts/security-static.test.mjs; Remove-Item Env:REQUIRE_OUT
```

Code quality: use `pnpm run check` for TypeScript diagnostics and zero-dependency regression tests. This is deliberately **not** a replacement for ESLint's style/hook rule coverage; ESLint remains uninstalled to keep the build dependency graph small. Actions are pinned to commit SHAs; review future dependency upgrades explicitly.

## Ambient Aurora and motion controls

- `app/ambient.css` contains the dedicated animated visual layers; `app/globals.css` retains static theme backgrounds and the once-only hero arc.
- Two compositor-oriented gradient shapes float at different slow speeds on desktop. Small screens and browsers using Save-Data or Reduced Motion keep the composition static.
- The header's Pause/Play control persistently stops/resumes nonessential background motion (stored as `bk-ambient-paused`), with keyboard labels and `aria-pressed`.
- Technical grid decoration is pointer-inert. No new animation framework or runtime dependency was added.


## Project visual identity

- Seven original SVG illustrations live in `public/projects/` and are linked by `image` in `lib/portfolio-data.ts`. They are **editorial concepts, not product screenshots** and contain no private repo assets, personal records or user data.
- DoraVoice, Vague and QuickScan descriptions are tied to their actual GitHub repo scopes; ReZero is represented as a private hobby game without publishing protected source/art.
- `app/project-visuals.css` controls image-led project cards and shared interactive dot ambience; `components/portfolio/ambient-dot-field.tsx` uses a single passive pointer listener plus one rAF-coalesced CSS-mask update, not a canvas or animation package.
- At reduced motion, Save-Data and touch screen input, reactive dots are disabled. Static grid, text and navigation remain available.
