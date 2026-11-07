# Portfolio refresh verification — 7 November 2026

## Current requested scope

- The authenticated GitHub listing contains 13 owned repositories. The owner subsequently requested removal of the personal website from Projects, leaving all 12 other repositories in the collection.
- The current archive contains 26 distinct gallery frames, with at least two per project and four for ReZero.
- T2 Software's internship project has its own card, manager view and employee leave-status view.
- Search, category counts, visible image thumbnails, previous/next controls, larger project dialogs and public repository links are available.
- Original screenshots and research figures retain their full aspect ratios. Identity marks are separate small badges.
- DoraVoice and Vague previews are explicitly labeled as concepts. See `PROJECT_INVENTORY_2026-11-07.md` for per-project provenance.

## Design work

Vague's two new compositions were built as editable Figma frames, using original campaign/product imagery created with Adobe. The storefront and product/cart study use the project's own wordmark and typography direction. The reference research examined the official Gymshark, ESN and Protein Works sites for product discovery, commerce hierarchy and campaign presentation:

- https://www.gymshark.com/
- https://www.esn.com/
- https://www.theproteinworks.com/
- https://vercel.com/design/guidelines

The portfolio remains a static Next.js export on its existing GitHub Pages publication path.

## Navigation correction

The header's explicit `prefetch={true}` behavior selected Next 16.4.5's Full prefetch strategy. Browser and preview-server evidence showed requests such as `/experience/?_rsc=…`, which a static host serves as HTML. Removing the explicit Full prefetch setting restored automatic prefetch of the exported `__next.…__PAGE__.txt` files.

Next now owns ordinary link navigation, history and scroll restoration. A committed pathname change receives a 300 ms content entrance, while the persistent header's underline moves to the active link. Reduced motion and Save-Data suppress the enhancement. The mobile menu uses one 700 px breakpoint, closes after navigation, supports Escape and makes closed links inert.

## Automated validation of the initial 13-project release

These results were recorded before the owner's subsequent request to exclude the personal website. They describe the initial 13-project, 28-frame release; they are not claims that those checks have been rerun for the revised collection.

- TypeScript and the production static build passed.
- All 54 Node regression tests passed.
- All 13 exported project cards and every referenced image were found in `out/`.
- Every gallery image decoded successfully, had sufficient dimensions and visible content, and differed in bytes from the other images in its gallery.
- A fresh-checkout simulation without `out/` or optimized WebPs passed all five source-inventory checks. The export-only check was skipped until a build existed; generated media was verified using the real preparation script in an isolated fixture.
- The deployment workflow now runs the inventory check again with `REQUIRE_OUT=1` after building.
- `git diff --check` and the existing contact-link verification passed.

## Browser validation of the initial 13-project release

- Projects → Experience → Education → About → Home → Projects completed with the expected page heading and active navigation link.
- Browser Back/Forward and rapid Experience → Education clicks reached the expected final page.
- All 13 cards and all 28 gallery frames loaded successfully during a complete archive scroll-through.
- Searching for T2 returned its internship project; Games returned ReZero. An unmatched search showed the empty state and the reset action restored all projects.
- T2's second gallery frame, dialog Escape, focus return and document-scroll unlock worked.
- Responsive previews were checked at 320, 390, 660 and 768 CSS pixels. The four-frame ReZero gallery remained inside the 320 px dialog; its thumbnail strip scrolls while arrows remain accessible.
- The 660 px mobile menu opened, navigated to Education and closed after navigation. The 768 px light theme and two-column gallery had no horizontal overflow.
- Both themes were visually reviewed. Mobile search text is 16 px and gallery controls have touch-sized targets.

Application captures used demonstration content only. The project source repositories were inspected or built for media preparation; this refresh changes only the portfolio repository.

## Follow-up: requested collection exclusion

The personal website project was removed from the display data at the owner's request. The complete 13-repository GitHub snapshot remains unchanged; the existing inventory check explicitly excludes only `bkaankaya.github.io` and requires 12 displayed projects with 26 gallery frames. The earlier production-build and browser checks above remain historical.

The five source-inventory checks passed after this change, including the 12-project/26-frame counts, repository visibility, category coverage, media descriptions and image integrity. `git diff --check` passed. The export check detected that the existing `out/` still contained the removed `personal-portfolio` card; a fresh production build and publication check are required before release.

### Follow-up validation after a clean build

- The owner’s full name, Bertan Kaan Kaya, is used in the hero, About text, footer, accessible labels and page metadata. The GPA is omitted from the public education summary.
- A clean production build and TypeScript check passed. All 54 existing regression tests passed, followed by all 13 required exported-artifact checks.
- All six exported content routes contain the full name, with no previous abbreviated name or GPA. The exported Projects page contains exactly 12 project cards and excludes the personal website.
- Current source/media checks cover all 26 gallery frames. Deployment and live verification are recorded in the publishing workflow and task result.
