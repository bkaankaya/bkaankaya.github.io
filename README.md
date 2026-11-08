# Bertan Kaan Kaya — Software Engineer Portfolio

Personal portfolio at `https://bkaankaya.github.io/`, built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and TypeScript. GitHub Pages serves the static `out/` export; there is no application server, authentication service, database or contact-form submission endpoint.

## Architecture and routes

The routes under `app/(portfolio)/` share `components/portfolio/portfolio-shell.tsx`.

| Route | Source | Purpose |
| --- | --- | --- |
| `/` | `app/(portfolio)/page.tsx`, `components/portfolio/home-page.tsx` | Portrait, introduction, contact actions, three featured projects and technology stack |
| `/projects/` | `app/(portfolio)/projects/page.tsx`, `components/portfolio/project-archive.tsx` | Searchable collection of 12 projects with category filters and native project dialogs |
| `/experience/` | `app/(portfolio)/experience/page.tsx` | Career timeline and engineering experience |
| `/education/` | `app/(portfolio)/education/page.tsx` | Academic background and learning |
| `/about/` | `app/(portfolio)/about/page.tsx` | Engineering approach and contact information |
| `/contact/` | `app/(portfolio)/contact/page.tsx` | Email, copy-email fallback and verified public profile links |

`lib/portfolio-data.ts` is the source of truth for the collection. Its filters are All, AI, Full-stack, Frontend, Embedded, Research, Blockchain and Games. The owner's portfolio website is intentionally excluded from the project cards; do not restore that entry or the removed GPA.

`lib/portfolio-metadata.ts` defines each route's existing title/description, absolute canonical and complete Open Graph metadata. Static `app/sitemap.ts` and `app/robots.ts` describe those six URLs. Next's built-in 404 remains; root metadata does not give it the homepage canonical or Open Graph URL.

## Components and interaction

- `portfolio-shell.tsx` restores the dark/light preference from `bk-portfolio-theme`, contains the skip link and keeps the header/footer persistent.
- `site-header.tsx` provides route-aware navigation, a theme toggle and a mobile disclosure with Escape/outside-click handling. Crossing the desktop breakpoint closes the disclosure and transfers focus from a hidden mobile control to a visible navigation link. It does not currently render a separate ambient-motion toggle.
- `route-transition.tsx` leaves navigation, history, prefetching and scroll restoration to Next.js. Its short entrance animation respects reduced motion and Save-Data.
- `project-archive.tsx` combines category and text filtering. The search input has an explicit label; clearing or resetting results returns focus to the surviving input. Category transitions are progressively enhanced.
- `project-card.tsx` uses a native dialog with close handling and focus restoration. Verified project logos stay in the small identity badge, not in the product-preview area.
- `project-media.tsx` keeps manual navigation on loaded images. Keyboard focus pauses automatic previews until an explicit resume; Resume enables the existing eligible hover behavior. Automatic changes do not announce slide positions as a live stream. Pause is first within the gallery control group, while Explore still precedes that group. Hover previews remain a design choice; this is not a claim of complete carousel/WCAG conformance.
- `contact-panel.tsx` uses email/profile links, not a simulated submission form. Clipboard failure offers a selectable email fallback. Repeated attempts update status content; stale or unmounted requests cannot overwrite the latest feedback or move focus.

Contact details come from `lib/portfolio-contact.ts` and are checked by `scripts/verify-portfolio-contacts.mjs`. Keep published identity and availability consistent across routes.

## Media and provenance

The current collection has 26 gallery frames across 12 projects. `galleryAlts`, `visualType` and `mediaNote` distinguish screenshots, concepts and source-derived visualizations. Private source is not presented as a public repository link. Preserve synthetic/demo labels and never substitute a logo for a product screenshot.

Local originals live in `public/projects/`. The existing `predev`/`prebuild` script generates selected WebP derivatives using Next's locked Sharp dependency. Do not remove an original because its generated derivative is not tracked. Asset inventories and integrity checks are in `scripts/portfolio-inventory.test.mjs`; brand provenance is in [docs/BRAND_ASSETS.md](docs/BRAND_ASSETS.md).

Nearby card preparation honors hidden tabs and Save-Data; explicit focus/dialog intent can prepare the gallery. Thumbnail images only mount after their matching stage frame loads. They still reuse full-frame URLs; transfer/cache/decode savings have not been measured and separate small derivatives remain future work.

The portrait and brand marks remain local. Existing CSS and `ambient-dot-field.tsx` provide decorative motion; OS reduced-motion, coarse-pointer and Save-Data behavior must be retained. The former README claim that the header exposes a persistent Pause/Play control was stale; no such control is claimed here.

Pointer ambience now responds to preference changes and cancels queued frames on leave/hidden/unmount. Theme setup releases both scheduled frames and its data-preference listener; route entrance animation cancels when the tab becomes hidden. Desktop decorative CSS loops still lack an independent pause control; rendered motion acceptance remains open.

## Verification and export

Toolchain used by the existing workflow: Node 22, pnpm 10.11.0. Commands below are a future authorized validation sequence, not evidence that this revision has passed them:

```bash
pnpm install --frozen-lockfile
node scripts/verify-portfolio-contacts.mjs
pnpm run check
pnpm run build
REQUIRE_OUT=1 node --test scripts/security-static.test.mjs scripts/portfolio-inventory.test.mjs scripts/portfolio-metadata.test.mjs
pnpm audit --audit-level high
```

PowerShell artifact-check equivalent:

```powershell
$env:REQUIRE_OUT = '1'
node --test scripts/security-static.test.mjs scripts/portfolio-inventory.test.mjs scripts/portfolio-metadata.test.mjs
Remove-Item Env:REQUIRE_OUT
```

`output: 'export'`, `trailingSlash: true` and `images.unoptimized: true` are intentional. `scripts/flatten-rsc-export.mjs` prepares the exported route payloads for Pages. Preserve its fail-closed checks. Use the generated static files for hosting; `next start` is not the deployment method for this export.

Some tests inspect source contracts; others validate files and generated output. None of these alone proves real-browser behavior, visual quality, keyboard accessibility or measured performance. `pnpm run check` is not an ESLint substitute.

Artifact assertions require explicit `REQUIRE_OUT=1`; a leftover `out/` is not current-build evidence. The inventory's image-integrity test can generate missing derivatives even in source mode, so do not run the full test glob under a no-generation policy. The 8 November local maintenance used a reviewed explicit file list and filtered that image test: 100 passed, 3 artifact checks skipped. No-emit TypeScript passed with installed TypeScript 5.7.3, but installed Next 16.2.0 differs from locked 16.4.5 and host Node 24.20.0 differs from CI Node 22. No dependencies were installed. Exact commands and limitations are in the [current handoff](docs/PORTFOLIO_REVIEW_2026-11-08.md).

## Security and publishing

The published repository/artifact is public. Do not add credentials, private-project source, personal records or debug artifacts. External links, SVG content and exported artifacts have existing regression checks. SHA-pinned workflow actions, limited permissions and the frozen pnpm lock are retained.

The existing security job reports high/critical advisories, but the deployment job currently depends only on `build`, not `security`. The existing owner exception is retained and recorded as R-6 in the risk register; the recommended default requires both jobs. A red audit is not a clean security result. Historical scan claims in earlier reports do not establish the current advisory state. Post-build artifact checks require all six routes, metadata/sitemap/robots/404 assertions and reject accidental source/key/credential exports.

GitHub Pages is static hosting: adding `headers()` to Next config does not implement response security headers. Preserve the CSP/hosting limitations documented in [docs/SECURITY_ARCHITECTURE.md](docs/SECURITY_ARCHITECTURE.md), [SECURITY_RISK_REGISTER.md](SECURITY_RISK_REGISTER.md) and [SECURITY_REVIEW_2026-11-05.md](SECURITY_REVIEW_2026-11-05.md).

All commits in the 8 November local maintenance use `[skip ci]` to respect the owner's Actions restriction. Their source push is not a fresh Pages deployment. See [the scoped review and remaining validation](docs/PORTFOLIO_REVIEW_2026-11-08.md).
