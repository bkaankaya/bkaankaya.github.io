# Portfolio local maintenance handoff — 8 November 2026

Repository: `bkaankaya/bkaankaya.github.io`. This record now includes work on the owner's checkout. Source maintenance is complete within the no-install / no-build / no-deployment policy; rendered behavior, fresh export and current advisory status remain unverified. The earlier isolated review is retained separately below as historical evidence.

## W01 — Reconciliation and inventory

| Evidence | Result |
| --- | --- |
| Initial local main | `5f8f4e2c5840b5fe1b5428108a09054fac5e9230` |
| Initial upstream, confirmed by ls-remote and fetch | `7d440ace11949a38393116f581456af168d56af5` |
| Merge base | `5f8f4e2c5840b5fe1b5428108a09054fac5e9230` |
| Local / upstream exclusive commits | 0 / 41 |
| Entry working tree / index / untracked / unpublished commits | Clean / empty / none / none; no user differences to set aside |
| Integration | `git fetch --no-tags origin main`, then `git merge --ff-only 7d440ace11949a38393116f581456af168d56af5` |
| Retained prior tree | `5b150f1e852f4643683767a8f15a2aea1ebfe6c5`, preserved through ancestry |

No reset, clean, stash, rebase, force push, new branch, PR, worktree or second checkout was used. No active merge/rebase/cherry-pick or non-sample Git hook was found. All 41 upstream commits and the prior search/gallery fixes remain.

The six routes share `app/(portfolio)/layout.tsx` → `PortfolioShell` → persistent header/footer and `RouteContent`. Home uses `home-page.tsx`; ProjectArchive/ProjectCard/ProjectMedia own collection, dialog and media. Project data, contact and verified profile remain in their existing `lib/portfolio-{data,contact,profile}.ts` sources. Metadata now has a small shared route map.

| Page source under `app/(portfolio)/` | Canonical = Open Graph URL | Existing title |
| --- | --- | --- |
| `page.tsx` | `https://bkaankaya.github.io/` | Bertan Kaan Kaya · Software Engineer |
| `projects/page.tsx` | `https://bkaankaya.github.io/projects/` | Projects · Bertan Kaan Kaya |
| `experience/page.tsx` | `https://bkaankaya.github.io/experience/` | Experience · Bertan Kaan Kaya |
| `education/page.tsx` | `https://bkaankaya.github.io/education/` | Education · Bertan Kaan Kaya |
| `about/page.tsx` | `https://bkaankaya.github.io/about/` | About · Bertan Kaan Kaya |
| `contact/page.tsx` | `https://bkaankaya.github.io/contact/` | Contact · Bertan Kaan Kaya |

Actual title strings retain the existing `|` separator; this table uses a middle dot for readability. Existing descriptions and the shared 520×520 portrait/alt are preserved. `app/sitemap.ts` and `app/robots.ts` are deterministic `force-static` metadata routes. Next's built-in 404 remains.

There are 59 tracked public files: portrait/icons, local brand SVGs, project originals, concepts and research visualizations. No public file changed. The 12-project / 26-frame AST inventory, omitted GPA, excluded portfolio card, DoraVoice name, small logo badges and private/public/provenance distinctions remain. The eight-image Sharp recipe and originals are unchanged; no derivatives were generated.

Styles remain layered: root imports globals → refinement → collection; globals imports Tailwind, tw-animate-css, ambient, project-visuals and micro-interactions. Shell imports navigation CSS; ProjectMedia imports its local CSS. Only a small gallery control-order rule changed; no palette/template/CSS consolidation occurred.

Package scripts retain `check` (TypeScript + test glob), predev/prebuild (Sharp), build (Next export), postbuild (RSC flatten), dev and start. The single Pages workflow retains frozen install, checks, build, artifact validation/upload and deployment; the separate unsuppressed audit remains outside `deploy.needs` under its documented owner exception.

## W02–W07 — Source outcomes

| Package | Status | Result |
| --- | --- | --- |
| W02 security | IMPLEMENTED_SOURCE / VERIFIED_TARGETED | Read-only artifact validator additionally rejects symlinks, source/key/credential/debug exports; existing secret/script/mixed-content checks retained. Small acceptance/rejection fixtures added. Flatten's path/collision guards unchanged. Source → sink applicability is in `docs/SECURITY_ARCHITECTURE.md`. |
| W03 dependencies / CI | IMPLEMENTED_SOURCE | Package manager/engines record existing pnpm 10.11.0 / Node 22 CI. Dependency versions, overrides and lock unchanged. Contact presence and metadata assertions join mandatory post-build checks. Artifact assertions require explicit `REQUIRE_OUT=1`, avoiding accidental stale-output checks. |
| W03 release policy | ALREADY_CORRECT / owner decision open | SHA pins, minimal permissions, frozen lock and unsuppressed audit retained. Existing `deploy.needs: build` exception documented as R-6; recommended default is build + security success. No new approval or clean audit implied. |
| W04 metadata | IMPLEMENTED_SOURCE / VERIFIED_TARGETED | Own canonical and complete Open Graph per route; shared portrait retained. Root no longer gives homepage OG/canonical to 404. Static sitemap/robots added; future fresh-export checks include metadata and 404/noindex. No JSON-LD or new personal claim. |
| W05 media | IMPLEMENTED_SOURCE / VERIFIED_TARGETED | Nearby preparation honors hidden tabs and Save-Data, with observer/listener cleanup; explicit focus/dialog intent may still warm. Thumbnail images mount after matching stage load, avoiding independent hidden-frame requests. Full URLs, originals, recipe, alts and provenance unchanged; no measured savings claimed. |
| W06 gallery | IMPLEMENTED_SOURCE / VERIFIED_TARGETED | Pause first within the control group's DOM order; CSS retains visual slot. Prior focus/pointer/manual-choice/loading/live fixes preserved. Explore still precedes the group; Resume enables existing eligible hover rotation. Full APG conformance not claimed. |
| W06 contact/menu | IMPLEMENTED_SOURCE / VERIFIED_TARGETED | Clipboard request identity blocks stale/unmounted results; keyed atomic status updates on repeated copy; readonly selection fallback retained. Desktop breakpoint closes mobile disclosure and transfers hidden focus to a visible link, including a focused closed hamburger. |
| W05–W07 lifecycle | IMPLEMENTED_SOURCE / VERIFIED_TARGETED | Shell cancels both theme frames and removes Save-Data listener. Pointer ambience cancels queued work on leave/hidden/unmount and reacts to preference changes. Route entrance cancels on hidden tabs. Next-owned routing and dialog scroll-lock implementation retained. |
| W07 maintenance | IMPLEMENTED_SOURCE / ALREADY_CORRECT | Metadata repetition reduced; artifact policy extracted for behavioral fixtures; stale browser-script project/filter counts and contact label corrected without running it. README/security records updated. No invented biography/project results or long card copy. |

Independent read-only reviews covered metadata and lifecycle changes. One found the initial breakpoint listener protected only an open menu; it was split into an always-mounted effect, and a real effect-setup synthetic test now covers the closed-toggle path. Source reviews are not counted as test runs.

## W08 — Actual local verification

Host Node **24.20.0**; existing TypeScript **5.7.3**. Installed Next is **16.2.0** versus locked **16.4.5**; installed direct PostCSS **8.5.14** versus locked **8.5.32**. Locked Next also has separate PostCSS **8.5.23**. No installation was attempted. A local typecheck pass does not prove an exact frozen-lock install or Node 22 CI result.

Final reviewed test command:

```powershell
node --test --test-skip-pattern='every referenced preview' scripts/ambient-design.test.mjs scripts/dependency-baseline.test.mjs scripts/flatten-rsc-export.test.mjs scripts/frontend-lifecycle.test.mjs scripts/gallery-loading.test.mjs scripts/navigation-contract.test.mjs scripts/portfolio-inventory.test.mjs scripts/portfolio-metadata.test.mjs scripts/portfolio-usability.test.mjs scripts/profile-contact.test.mjs scripts/project-gallery.test.mjs scripts/security-artifact.test.mjs scripts/security-static.test.mjs scripts/technology-stack.test.mjs
```

**100 passed, 0 failed, 3 skipped.** Three artifact tests were skipped because `REQUIRE_OUT` was unset. Separately, the image-integrity test that can generate derivatives was filtered by name and not executed. AST inventory/provenance checks ran; image decoding was not verified. Filesystem fixtures created and removed only small unique temporary directories.

Other successful commands:

```text
node node_modules/typescript/bin/tsc --noEmit --incremental false
node scripts/verify-portfolio-contacts.mjs
node --check scripts/verify-portfolio-browser.cjs
node --check scripts/portfolio-inventory.test.mjs
git diff --check
git diff --cached --check
```

Final test output is retained privately in `.git/portfolio-maintenance-checks-2026-11-08.txt`; reconciliation/blob evidence is in `.git/portfolio-maintenance-sync-2026-11-08.txt`. These are checkout-local records, not public files.

An earlier test-name exclusion attempt unexpectedly inspected old `out/`: six source checks passed; the artifact check failed because `contact/index.html` was absent. `out/` and `.next/` predate this maintenance. Neither was rebuilt, removed or accepted as current evidence. Source mode now passes after explicit artifact separation; fresh-output checks still require a future authorized build.

| Check / action | Status and boundary |
| --- | --- |
| Source/handler/pure metadata / small fixtures | VERIFIED_TARGETED; synthetic bindings are not React/DOM/browser or assistive-technology execution. |
| Typecheck | VERIFIED_TARGETED with installed TS; stale dependency/host differences above. No emitted files. |
| Install/upgrade/current dependency audit | NOT_RUN_BY_POLICY; historical 5 November scan remains historical. No package/scanner/SDK/browser installed. |
| Full build/media generation/complete test glob | NOT_RUN_BY_POLICY; no fresh export or image-decoding result. |
| Browser/dev server/screenshots/Lighthouse/axe/device/screen reader | NOT_RUN_BY_POLICY; browser verification script updated as source only. No visual/contrast/CWV/WCAG PASS inferred. |
| Actions run/rerun/dispatch/deployment | NOT_RUN_BY_POLICY; all new commits contain `[skip ci]`. This is not a universal skip guarantee for manual/scheduled/external triggers. Source delivery is not a new Pages artifact. |
| HTTPS/DNS/headers/admin settings | EXTERNAL_HOSTING_DECISION; no settings changed, fake nonce/unsupported server header or untested meta CSP added. |

## Delivery and remaining acceptance

Source commits on existing main: `4e59f75bf2b0ba25b4db7bc449012442c1db9a5c` (metadata/discovery), `c3e0b98c86dae238159464ea60bd2beeb886a6b5` (interaction/lifecycle), `f23d59a03b22079c3e443c553780184647b5dfe6` (security/artifact). The subsequent documentation commit contains this report and README; its final local/remote SHA is reported after normal push verification. This file cannot embed its own commit hash.

Changed paths, grouped:

- Metadata: `app/layout.tsx`, six portfolio page files; new `app/{robots,sitemap}.ts`, `lib/portfolio-metadata.ts`, `scripts/portfolio-metadata.test.mjs`.
- Interaction: `components/portfolio/{ambient-dot-field,contact-panel,portfolio-shell,project-media,route-transition,site-header}.tsx`, `project-media.css`; new `scripts/frontend-lifecycle.test.mjs`; gallery-loading/project-gallery tests; `scripts/verify-portfolio-browser.cjs`.
- Security/pipeline: workflow, `package.json`, security-static/portfolio-inventory tests, new security-artifact validator/test, `SECURITY_RISK_REGISTER.md`, `SECURITY_REVIEW_2026-11-05.md`, `docs/SECURITY_ARCHITECTURE.md`.
- Handoff: README and this report. `pnpm-lock.yaml`, public media, data/contact/profile sources have no changes.

Remaining runtime acceptance is bounded to:

1. Fresh frozen-lock build/export: six route tags, sitemap/robots, 404/noindex, 26 frame assets; direct deep-link refresh, back/forward and modified-click navigation.
2. Both themes at 320 px reflow and 360/390/768/1024/1440 px; text zoom, normal/reduced motion and Save-Data. Actual contrast, target spacing, sticky-header focus and overflow remain unverified; no matrix row is PASS here.
3. Keyboard search/reset, gallery focus/pause/eligible resume and pointer order, failed images; modal initial focus/Escape/inert background/return/scroll unlock and rapid navigation; menu dismissal/breakpoint focus; repeated/denied copy with a screen reader.
4. Desktop CSS ambient loops still lack independent pause/static control. Existing mobile/reduced-motion/Save-Data fallbacks do not prove motion accessibility. Hover preview and rotation-control placement remain limited APG differences.
5. Measure transfer/cache/decode and field/lab performance before thumbnail derivatives or savings claims. Resolve current advisory applicability and R-6 owner policy before calling a later release fully checked.

# Earlier isolated source review — historical evidence only

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
