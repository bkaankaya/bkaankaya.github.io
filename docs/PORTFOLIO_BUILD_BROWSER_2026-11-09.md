# Portfolio — authorized cloud build, browser checks and UI refinement

Report date: 9 November 2026 (Europe/Istanbul). Commands began on 8 November UTC and continued after midnight in the owner's timezone.

## Source and authorization

Repository: `bkaankaya/bkaankaya.github.io`; existing `main` only. Starting commit: `346c8a7490f4a4a525c5a73c0bd01b73e6c4154b`. Reviewed application commit: `96a98fbcd4843f17e36ccc0284c19d2981654d9e`; exact tree: `ae28590dfe41a146cf83aabd4cb0d4f8ffb9c18f`. The tree submitted to GitHub exactly matched the temporary reviewed index in the Vercel workspace. The following documentation commit does not change application inputs.

The owner expressly authorized clean builds, real-browser verification and direct frontend improvements. All execution used Vercel infrastructure; nothing was installed or run on the owner's computer. No branch, PR, force update, GitHub Actions run or production-domain migration was used. Main updates were fast-forward with an expected-head check.

The prior no-build reports are historical and are not retroactively relabeled as runtime passes.

## UI changes personally implemented

1. A 44px header motion toggle persists `bk-portfolio-motion-paused` and synchronizes across tabs. It never overrides OS reduced-motion or Save-Data settings. Initial rendering remains static until preferences are known.
2. The preference covers decorative CSS loops, pointer highlights, scroll reveals, route entrance animations, filter view transitions, dialog closing and automatic gallery previews. Pausing keeps content and manual navigation available.
3. The light-theme active category counter had a measured contrast of 4.13:1 in the baseline axe run. It now inherits its readable button foreground. The final selected axe checks no longer report that violation.
4. Gallery rotation control visual ordering now matches keyboard/DOM ordering; the previous CSS order override was removed.
5. Source regression fixtures were adjusted to preserve the new controls; a reproducible real-browser release script was added.

Existing palette, hero, portrait, project originals, small logo badges, all 12 projects / 26 gallery frames, names/contact details, omitted GPA and excluded self-portfolio entry were preserved. No application dependency version, lockfile, workflow or private-project source was changed. This is focused design engineering, not a replacement template.

## Exact remote toolchain

| Tool | Actual version |
| --- | --- |
| Node | 22.23.4 |
| pnpm | 10.11.0 |
| Next.js | 16.4.5 |
| React | 19.2.5 |
| TypeScript | 5.7.3 |
| Direct PostCSS | 8.5.32 |
| Playwright, isolated QA directory | 1.65.0 |
| axe-core, isolated QA directory | 4.14.0 |
| Chromium | 158.0.8127.18 |

Install used `pnpm install --frozen-lockfile`. The generated `next-env.d.ts` build change was not included in source commits. QA/browser dependencies were not added to the application package graph.

## Executed results

| Check | Actual outcome and scope |
| --- | --- |
| Verified contact checker | Passed |
| TypeScript plus full repository source tests | 101 passed, zero failed; three artifact assertions skipped only in source mode |
| Media preparation and image integrity | Executed under the new authorization; original images unchanged |
| Clean static export and RSC flatten | Passed; six public routes, robots, sitemap and 404 generated |
| Explicit fresh artifact checks | 18 passed, zero failed, zero skipped; includes the three previously skipped artifact assertions and repeated source checks |
| Browser layout/route/theme matrix | 60 cases: six routes x five widths (320/390/768/1024/1440) x dark/light; zero recorded failures |
| Automated accessibility checks | 24 axe runs at 390 and 1440 widths across six routes and two themes; zero reported violations for selected WCAG A/AA tags |
| Browser interaction scenarios | Ten passed, zero failed |
| Current locked dependency audit | No known vulnerabilities reported; audit JSON records 103 dependencies and zero findings at every severity |
| Git whitespace / source equivalence | Passed; reviewed tree matches submitted application tree |

The 101 and 18 counts overlap; they are not 119 unique tests. The remaining 36 layout matrix rows did not run axe and their empty violation lists must not be interpreted as accessibility scans. The matrix checks HTTP status, one main H1, horizontal overflow, page errors and selected metadata; it is not an exhaustive visual or behavioral assertion.

The ten browser scenarios cover search/clear focus, empty/filter reset, native dialog Escape/focus/scroll unlock, site motion pause and persistence, OS reduced-motion override, manual gallery selection/control ordering, denied clipboard fallback, mobile-menu Escape/breakpoint focus, deep links/history/404, and visible identity/inventory without JavaScript.

Reproduction script: `scripts/verify-portfolio-release.cjs`; use `PORTFOLIO_QA_MODULES`, `PORTFOLIO_BASE_URL` and `PORTFOLIO_QA_OUTPUT` with an explicitly authorized static server. Do not run it against arbitrary production services.

## Separate Vercel preview

Deployment: `dpl_8kSJPCKM6bwjza8Sa75EWLgxE22R` in the existing `portfolio-design-workbench` project. Status verified READY.

URL: https://portfolio-design-workbench-jpvgmn2qq-kaankaya928-1334s-projects.vercel.app/

A minimal API deployment fetched the public repository at the exact application SHA, checked that SHA, used explicitly pinned pnpm 10.11.0, then ran frozen install, contact checks, source checks, build, artifact checks and audit before copying only `out/` into the deployment output. Git integration was not required; production Pages settings were not changed. No credential was embedded in the bootstrap.

The first workbench attempt failed early because its default pnpm did not match the expected version; it published no working site. The corrected bootstrap pinned pnpm explicitly and completed. The successful deployment is a preview (target unset), with existing Vercel authentication protection retained. A short-lived share link was used for authorized browser access; its secret is intentionally absent from this repository.

Post-deployment Chromium checks confirmed all six route URLs returned 200 with expected titles/canonicals and the motion control. Project search and global pause were exercised on the deployed URL and passed. The preview returns `X-Robots-Tag: noindex, nofollow`; canonical URLs continue to identify GitHub Pages.

This is not a new GitHub Pages artifact. The production `bkaankaya.github.io` site has not been migrated, its DNS has not been changed, and its Actions pipeline remains subject to the existing quota and R-6 policy.

## Evidence digests

These SHA-256 values identify captured remote records; hashes alone are not a substitute for a test run. A consolidated JSON result and screenshot were also delivered with the conversation.

| Captured record | SHA-256 |
| --- | --- |
| install.log | `37b3801207da09c9c254397bb7d237e3487094bb69c50c98b54c22e30325f865` |
| final-check.log | `9b5d8efa0aec80c6097647bb5c633d9b0dc9836dc5b5a0723439a35397bfee2c` |
| final-build.log | `282705fcf47ea18702f400d3edc3cbd793628d47181c81887f78626929d3cd64` |
| final-artifact.log | `3902b6385e0662cf0a49e177dd731cff5331e8c7bff99bfa85023aa814401cfa` |
| final-browser.log | `6d8cdabc8700cb88584061c3ce0860d02a462775a61acbf76b4023c0dc3558c6` |
| final-browser.json | `372f6ed8580c9d6a49d0c0f3c8848943feae0c700edbaa5f9150b3f225ef09cc` |
| audit.json | `885293f03b7208a0ed00b90f33f8d872e30d220d3a63adb2bccb044025baae35` |
| Consolidated conversation evidence JSON | `1c9c7988cac81b6f2ee55b320f9bd53c4183332349ab9d70b9ef9db1db3fa585` |

## Remaining boundaries

No Safari/WebKit/Firefox or physical-device suite, human screen-reader audit, zoom/forced-colors matrix, performance field study, Lighthouse score, penetration test or permanent all-WCAG conformance is claimed. Clipboard denial was deliberately simulated in a real browser. Metadata/artifact checks do not certify every possible deployment configuration. Browser header/CSP limits and the existing GitHub deployment-gate exception remain documented separately.

Non-sensitive browser storage now contains two preferences: theme and motion pause; neither is an authentication credential. The new remote checks supersede only the earlier unverified items actually exercised here, not every item in the historical risk register.

Guidance used: W3C Pause/Stop/Hide https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html and WAI carousel guidance https://www.w3.org/WAI/ARIA/apg/patterns/carousel/ . Test results above are direct execution evidence, not conclusions inferred from those documents.
