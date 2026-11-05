# Baseline Audit Report (`d3a5cf6da401c0ac521b9fbd30f04bbbafa0a577`)

**Audit Date:** 2026-11-05  
**Repository:** `bkaankaya/bkaankaya.github.io` (`main`)  
**Baseline Commit:** `d3a5cf6da401c0ac521b9fbd30f04bbbafa0a577`

---

## 1. Dependency & Reachability Analysis (Dead Code & Demo Remnants)

Static import-graph traversal starting from `app/layout.tsx` and `app/(portfolio)/**` confirmed that only **18 source files** are reachable from the active portfolio routes (`/`, `/projects/`, `/experience/`, `/education/`, `/about/`), while **93 source files** and **5 placeholder assets** are unreachable remnants from an earlier e-commerce (`Vague`) template export and unused `shadcn/ui` primitives:

### Reachable Portfolio Files (18)
- `app/layout.tsx`, `app/globals.css`
- `app/(portfolio)/layout.tsx`
- `app/(portfolio)/page.tsx`
- `app/(portfolio)/projects/page.tsx`
- `app/(portfolio)/experience/page.tsx`
- `app/(portfolio)/education/page.tsx`
- `app/(portfolio)/about/page.tsx`
- `components/portfolio/{home-page,portfolio-footer,portfolio-shell,project-archive,project-card,reveal,section-heading,site-header}.tsx`
- `lib/portfolio-contact.ts`, `lib/portfolio-data.ts`

### Unreachable Remnants Identified for Removal (93 code files + 5 placeholder assets)
- **Root scratch file (`projeye-entegre-edilecek-yenilikler.tsx`)**: Unreferenced 822-line scratchpad containing nested `/* ... */` comments inside JSX comments `{/* ... */}`, which caused **32 TypeScript syntax errors** during `pnpm exec tsc --noEmit` (`exit code 2`) and forced `typescript.ignoreBuildErrors: true` in `next.config.mjs`.
- **Unrelated mock e-commerce routes (`app/account/**`, `app/account-demo/page.tsx`)**: 14 route files rendering mock supplement orders (`Premium Whey Protein`, `Vague Club`, mock user `kaan3162`, fake phone `5555555555`) that have zero links from the portfolio UI and pollute the static export (`out/account/**`).
- **Unreferenced e-commerce components (`components/account/*`, `components/bestsellers-section.tsx`, `components/flag-icons.tsx`, `components/floating-chat-button.tsx`, `components/footer.tsx`, `components/hero-section.tsx`, `components/navbar.tsx`, `components/payment-icons.tsx`, `components/product-card.tsx`, `components/theme-provider.tsx`)**: 16 files never imported by any portfolio page.
- **Unreferenced UI library files (`components/ui/*`, `hooks/*`, `lib/utils.ts`, `styles/globals.css`)**: 61 files with zero imports from `app/(portfolio)/**` or `components/portfolio/**`.
- **Unused placeholder assets**: `public/placeholder.jpg`, `public/placeholder.svg`, `public/placeholder-logo.png`, `public/placeholder-logo.svg`, `public/placeholder-user.jpg`.

---

## 2. Visual, Asset & UX Issues Identified on Baseline

1. **Leftover `v0.dev` Branding (`public/icon.svg`, `public/icon-*.png`, `public/apple-icon.png`, `app/layout.tsx`)**:
   - Browser tabs displayed the `v0` monogram logo instead of `BK.`.
   - `app/layout.tsx` included `generator: 'v0.app'`.
2. **Remote Uncropped 2.1 MB Full-Page Screenshot Used as Portrait (`hebbkx1anhila5yf.public.blob.vercel-storage.com`)**:
   - Both `components/portfolio/home-page.tsx` and `app/(portfolio)/about/page.tsx` loaded `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EopK6L1jOreIYg5r738E7f63cWJs4z.png` (`1536×1024`, **2,101,931 bytes**), which is a full-screen mockup capture, using `.profile-photo { object-fit: none; object-position: 60% 16%; }` to slice out the circular avatar at `236×236`.
   - Because `object-fit: none` does not scale with container size, the smaller `.about-portrait-frame` (`164×164` on desktop, `120×120` on mobile) and mobile `.portrait-frame` (`155×155`, `132×132`) cropped the image off-center, pushing the head into the top border and cutting off the shoulders.
   - Downloading a 2.1 MB PNG from an external blob host severely degrades LCP on the hero image.
3. **Generic Lucide Icons Instead of Official Brand Logos (`lib/portfolio-data.ts`)**:
   - `Technologies` used generic Lucide icons (`Code2` for React, `Layers` for Next.js, `Terminal` for Python, `Coffee` for Java, `Cpu` for Docker, `Database` for PostgreSQL, `Cloud` for AWS) instead of authentic brand marks.
   - Social links used generic stroke icons for GitHub and LinkedIn instead of official brand marks (`[in]` bug logo and GitHub Invertocat).
4. **Location Text on `/about` (`app/(portfolio)/about/page.tsx`)**:
   - Listed `Based in Europe` instead of the owner's actual location and relocation preference (`Based in Turkey, Ankara · Open to relocating to Europe`).
5. **Pathname Matching With `trailingSlash: true` (`components/portfolio/site-header.tsx`)**:
   - `next.config.mjs` sets `trailingSlash: true`, so in production static export `usePathname()` on interior routes can resolve with a trailing slash (e.g. `/projects/`), whereas `navigation` compared `pathname === item.href` (`"/projects"`), risking active-nav indicator mismatch after static route load.
6. **Theme Persistence & `color-scheme` Synchronization (`components/portfolio/portfolio-shell.tsx`, `app/layout.tsx`)**:
   - Theme state was held only in transient React `useState("dark")` with no `sessionStorage`/`localStorage` persistence or `<meta name="color-scheme" content="dark light">` / root `color-scheme` sync.
7. **Touch Target & Accessibility Gaps (`app/globals.css`, `components/portfolio/project-card.tsx`, `components/portfolio/site-header.tsx`)**:
   - `.social-links a` was `25×25px`, `.project-open-button` and `.dialog-close-button` were `32×32px`, and `.education-link` was `28×28px` (below the ~44px WCAG 2.2 target size recommendation).
   - Mobile menu did not close on `Escape` or outside click and did not return focus to the toggle button on `Escape`.
   - `<dialog>` closed abruptly without top-layer exit transition or focus restoration verification.
   - `@media (prefers-reduced-motion: reduce)` used a blanket `animation-duration: 0.01ms !important; transition-duration: 0.01ms !important;` wildcard reset instead of clean state handling.

---

## 3. Content Comparison: Current Live Data (`d3a5cf6`) vs. Earlier Static Commit (`d20ac71`)

Per the content integrity rule (*"Eğitim kurumlarını, tarihleri, deneyimleri, proje iddialarını, açıklamalarını, isimleri ve kişinin kimliğini estetik amaçlarla değiştirme... Mevcut canlı içerik ile Git geçmişi arasında fark varsa raporla"*):

- **Verified Contact Identity (`lib/portfolio-contact.ts`)**: Matches `d20ac71` and owner's CV (`kaankaya928@gmail.com`, `https://github.com/bkaankaya`, `https://www.linkedin.com/in/kaan-kaya-9890812b0/`, `Full-time · Contract · Remote`).
- **About Location (`app/(portfolio)/about/page.tsx`)**: Updated per explicit user instruction in this task from `Based in Europe` to `Based in Turkey, Ankara · Open to relocating to Europe`.
- **Reported Historical Difference (`lib/portfolio-data.ts` vs `d20ac71:index.html`)**:
  - In `d20ac71:index.html` (and the owner's CV), Education is **TED University — B.Sc. in Computer Engineering, Minor in Business Administration (2022–2026)**, and Experience lists four internships (**TNC Group**, **Anova R&D Technologies**, **PROVEN Technologies**, **T2 Software**).
  - In the v0.dev-exported `lib/portfolio-data.ts` committed in `55bd7f5`/`d3a5cf6`, `educationItems` currently lists *University of Rome Tor Vergata* and *Politecnico di Torino* (Mechanical Engineering), and `experienceItems` lists four general timeline summaries. Per the strict instruction not to alter education/experience entries without explicit instruction, `lib/portfolio-data.ts` factual text is preserved untouched and this discrepancy is formally reported here for the owner's review.

