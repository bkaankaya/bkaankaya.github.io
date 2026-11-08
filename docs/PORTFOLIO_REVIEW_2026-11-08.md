# Scoped portfolio source review — 8 November 2026

Repository: `bkaankaya/bkaankaya.github.io`; starting main: `f05e52c4310e342fc47ff53acd77e9dfcc307187`.

This is a source review and a bounded usability improvement, not a whole-site security certification or a rendered visual/accessibility audit. The connected browser lacked the originating context, public-page retrieval did not supply a usable render, and the connected Vercel project query returned no match. No new hosting, design file, paid service or deployment was created.

## Applied source changes

| Area | Observed condition | Change |
| --- | --- | --- |
| Project search | Input and clear button shared a label; clearing/resetting could remove the focused trigger | Explicit input label, sibling clear control, focus returned to input, controls refer to the result container |
| Result status | Visual count repeated within the live status | Decorative count hidden from assistive technology; atomic polite summary |
| Gallery focus | Focusing controls warmed images but did not stop hover rotation | Focus sets a persistent pause; only an explicit resume removes it |
| Pause control | Focus-pause would otherwise invert the first pointer action | Capture pointer intent before focus; discard it for keyboard/cancel; use action label without conflicting pressed state |
| Slide status | Positions announced during automatic changes | Live announcements off for eligible automatic previews, polite for manual choices |
| Documentation | Seven-project/SVG-only and background Pause/Play claims were stale | README describes the actual 12-project/26-frame collection, six routes and current controls |

Manual image-loading safeguards, modal behavior, Next-owned routing, animation timing, visual styling, content and identity assets remain unchanged. The owner-requested full name, omitted GPA and excluded portfolio project are retained. No dependency, lockfile, workflow, hosting or private-project change is included.

## Verification performed

In the assistant's isolated workspace, original copies of the two edited components and two existing test files were matched to their GitHub blob hashes before editing.

- `node --test scripts/gallery-loading.test.mjs scripts/portfolio-usability.test.mjs`: 12 focused source/handler checks passed (three existing checks plus nine new ones).
- TSX syntax/transpile diagnostics for both edited components: zero errors, using the environment's TypeScript 5.8.3 and Node 22.16.0. The repository pins TypeScript 5.7.3; this was not a repository typecheck.
- Syntax check of the adjusted `project-gallery.test.mjs`; that full suite was not run because the reconstructed workspace does not contain the complete assets/dependencies.
- Diff/whitespace and targeted source review.

The handler checks evaluate the actual small callback sources against synthetic bindings. They do not render React, dispatch real DOM events or prove screen-reader announcements. No full install, Next build, full regression suite, browser test, Lighthouse/axe scan, dependency audit or GitHub Actions run was performed. No work executed on the owner's computer.

`[skip ci]` intentionally avoids the existing push workflow. Main/source delivery is separate from the last publicly deployed Pages artifact. This record does not contain its own commit SHA; use Git history and the handoff's verified remote SHA.

## Remaining Codex work, without undoing this patch

1. Compare and safely synchronize the owner's local main with remote history and preserve unpublished changes. Do not use reset/clean/force or publish all local differences indiscriminately.
2. Verify every route's title, canonical URL, Open Graph inheritance, sitemap/robots/404 behavior in actual exported output; do not canonicalize all pages to `/`.
3. Review gallery bandwidth: unoptimized full images also appear as thumbnail sources, and near-viewport warming can request multiple full frames. Measure before claiming savings; preserve originals and build-time derivatives.
4. Review layered CSS, reduced-motion/Save-Data changes, touch targets, keyboard dialog/menu behavior, sticky-header focus visibility and contrast in both themes. Full APG carousel conformance, including hover and rotation-control ordering, is not certified by this patch.
5. Review dependency applicability and the deliberate `deploy.needs: build` security policy. Do not treat server-only framework findings as proven public static-site exploits, or dismiss build/transitive risk.
6. Retain frozen-lock, action-permission and artifact checks; adding fake CSP response headers to static export is not a fix. Public assets/metadata and private project evidence require privacy review.
7. Keep factual project narratives, role/constraints/evidence and contact actions clear; do not invent clients, results or endorsements. Figma/Adobe work needs an actual source/asset objective, not an unverified replacement design.

## Primary reference points

- WAI carousel interaction and announcement guidance: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- MDN explicit label/control association: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label
- Next App Router static exports: https://nextjs.org/docs/app/guides/static-exports
- Next metadata inheritance and canonical URLs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- OWASP web frontend security: https://cheatsheetseries.owasp.org/cheatsheets/Web_Frontend_Security_Cheat_Sheet.html
- Git merge and uncommitted-change cautions: https://git-scm.com/docs/git-merge
- GitHub skip-instruction scope: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs

All recommendations are applied to the static-portfolio trust boundary, not to the separate QuickScan application.
