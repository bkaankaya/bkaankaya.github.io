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
- `site-header.tsx` provides route-aware navigation, theme and site-wide motion toggles, and a mobile disclosure with Escape/outside-click handling. Crossing the desktop breakpoint closes the disclosure and transfers focus from a hidden mobile control to a visible navigation link.
- `motion-preference.tsx` persists the non-sensitive `bk-portfolio-motion-paused` choice. Device reduced-motion and Save-Data preferences always win; static initial rendering keeps content visible before preferences settle.
- `route-transition.tsx` leaves navigation, history, prefetching and scroll restoration to Next.js. Its short entrance animation respects the site preference, reduced motion and Save-Data.
- `project-archive.tsx` combines category and text filtering. The search input has an explicit label; clearing or resetting results returns focus to the surviving input. Category transitions are progressively enhanced and stop when motion is paused.
- `project-card.tsx` uses a native dialog with close handling and focus restoration. Verified project logos stay in the small identity badge, not in the product-preview area.
- `project-media.tsx` keeps manual navigation on loaded images. Keyboard focus pauses automatic previews until an explicit resume; Resume enables the existing eligible hover behavior unless site/device motion is paused. Automatic changes do not announce slide positions as a live stream. Pause is first within the gallery control group in both DOM and visual order, while Explore still precedes that group. Hover previews remain a design choice; this is not a claim of complete carousel/WCAG conformance.
- `contact-panel.tsx` uses email/profile links, not a simulated submission form. Clipboard failure offers a selectable email fallback. Repeated attempts update status content; stale or unmounted requests cannot overwrite the latest feedback or move focus.

Contact details come from `lib/portfolio-contact.ts` and are checked by `scripts/verify-portfolio-contacts.mjs`. Keep published identity and availability consistent across routes.

## Media and provenance

The current collection has 26 gallery frames across 12 projects. `galleryAlts`, `visualType` and `mediaNote` distinguish screenshots, concepts and source-derived visualizations. Private source is not presented as a public repository link. Preserve synthetic/demo labels and never substitute a logo for a product screenshot.

Local originals live in `public/projects/`. The existing `predev`/`prebuild` script generates selected WebP derivatives using Next's locked Sharp dependency. Do not remove an original because its generated derivative is not tracked. Asset inventories and integrity checks are in `scripts/portfolio-inventory.test.mjs`; brand provenance is in [docs/BRAND_ASSETS.md](docs/BRAND_ASSETS.md).

Nearby card preparation honors hidden tabs and Save-Data; explicit focus/dialog intent can prepare the gallery. Thumbnail images only mount after their matching stage frame loads. They still reuse full-frame URLs; transfer/cache/decode savings have not been measured and separate small derivatives remain future work.

The portrait and brand marks remain local. Decorative motion respects OS, coarse-pointer and Save-Data settings. The header now includes a persistent site-wide motion control; this was implemented and tested after the earlier source-only review.

Pointer ambience cancels queued frames on leave/hidden/unmount or motion pause. Theme setup releases scheduled frames and listeners. The global control also stops decorative CSS loops, route entrances, filter view transitions, reveal effects and automatic gallery previews without hiding content. `app/accessibility.css` corrects the measured active-filter count contrast in the light theme.

## Verification and export

Toolchain: Node 22, pnpm 10.11.0. The following sequence was executed in an isolated Vercel environment for application commit `96a98fb`; see the [build/browser evidence](docs/PORTFOLIO_BUILD_BROWSER_2026-11-09.md) for scope and versions:

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

Some tests inspect source contracts; others validate files and generated output. Neither alone proves browser behavior or full accessibility. `scripts/verify-portfolio-release.cjs` runs real Chromium checks against an authorized static server; Playwright 1.65.0 and axe-core 4.14.0 are installed in a separate QA directory rather than the application graph. `pnpm run check` is not an ESLint substitute.

Artifact assertions require explicit `REQUIRE_OUT=1`; a leftover `out/` is not current-build evidence. The 8 November local no-build run and its stale installed versions remain historical in [the earlier handoff](docs/PORTFOLIO_REVIEW_2026-11-08.md). The later authorized remote run used the frozen lock, generated media, built a fresh export and ran the artifact checks; it did not use the owner's computer.

## Security and publishing

The published repository/artifact is public. Do not add credentials, private-project source, personal records or debug artifacts. External links, SVG content and exported artifacts have regression checks. SHA-pinned workflow actions, limited permissions and the frozen pnpm lock are retained.

The existing security job reports high/critical advisories, but the deployment job currently depends only on `build`, not `security`. The documented R-6 owner exception remains. A successful audit during this verification does not silently change that policy or guarantee future advisory status. Post-build checks cover all six routes, metadata/sitemap/robots/404 and accidental source/key/credential exports.

GitHub Pages is static hosting: adding `headers()` to Next config does not implement response security headers. Preserve the CSP/hosting limitations documented in [docs/SECURITY_ARCHITECTURE.md](docs/SECURITY_ARCHITECTURE.md), [SECURITY_RISK_REGISTER.md](SECURITY_RISK_REGISTER.md) and [SECURITY_REVIEW_2026-11-05.md](SECURITY_REVIEW_2026-11-05.md).

GitHub Actions was not used for this work; commits include `[skip ci]`. A separate protected Vercel workbench preview was built from the exact reviewed source and checked after deployment. Its noindex policy and temporary share access do not migrate the production hostname or update GitHub Pages. See the [new verification report](docs/PORTFOLIO_BUILD_BROWSER_2026-11-09.md).
