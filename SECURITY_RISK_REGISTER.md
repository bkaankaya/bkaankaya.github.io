# Security Risk Register

Date: 2026-11-05 · Baseline: `main` @ `3e006bc` · Source: `pnpm audit --audit-level high` run locally (pnpm 9.12.2, Node 24.20.0) against the committed lockfile. No suppressions, no `--fix`, no version changes.

## Trust boundary

Deployed artifact = static `out/` on GitHub Pages (`output: 'export'`, `images.unoptimized: true`). **No Next.js server runs in production.** The following are therefore *not present* on the live site: server runtime, Server Actions, Middleware/Proxy, `use cache` / Cache Components, `/_next/image` optimizer, `next/og` routes, rewrites, ISR, custom servers, WebSocket upgrades, Edge runtime. Repo sources contain none of these features (verified by import-graph review: only `next`, `next/link`, `next/image`, `next/navigation`, `next/font/google`).

The vulnerable `next@16.2.0` package is still **resolved in the build environment** (local/CI), which is why the advisory stays open and CI `security` job stays red until the owner approves an upgrade.

## pnpm audit result (after removing unused direct dependencies)

Severity totals: critical 5, high 23, moderate 16, low 3 (before cleanup: 5 / 26 / 16 / 3). Advisory count by package:

| Package (resolved) | Advisories | Max severity | Class | Reachable on live Pages? | Existing control | Owner decision needed |
|---|---|---|---|---|---|---|
| next 16.2.0 | 34 | critical (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, GHSA-vcvr-r3jv-pc5j, GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr) | prod dep, build-time only in effect | **No** – all critical ones require a running server: image optimizer (disabled by `unoptimized`), `use cache`, `next/og`, Windows-hosted Node server. No such code/route in repo. | static export, `images.unoptimized: true` | Approve upgrade to a patched Next.js (≥16.4.1 covers GHSA-2464/673q/p3m5; ≥16.3.8 / ≥16.2.11 for the other listed ranges). Separate request – not applied (no upgrades allowed). |
| postcss 8.5.14 | 4 (GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849, GHSA-fxqj-rqcc-2cmp, GHSA-qx2v-qp2m-jg93) | high | build-time (Tailwind/Next CSS pipeline) | No – exploitation needs attacker-controlled CSS `sourceMappingURL`/stringified CSS; inputs are first-party CSS. No `.map` files published (tested). | artifact test forbids `.map` | Approve postcss ≥8.5.23 bump (lockfile-level). |
| sharp (optional dep of next) | 3 (GHSA-f88m, GHSA-rgj7, GHSA-wq5f) | high | optional native dep | No – only used by the image optimizer, which is not used. | `images.unoptimized` | Resolved together with Next.js upgrade. |
| nanoid, source-map-js, baseline-browser-mapping | 4 | high | build-time transitive | No – DoS on build tool only. | – | Resolved by upgrades above. |

Zod (GHSA-mrhx-c7xc-m3w5) and browserslist (2 advisories) findings disappeared because the unused direct dependency chains were removed (see SEC-08 in the review).

Not claimed: that the site is "not vulnerable". Claimed: no exploit prerequisite for the above is present in the deployed static artifact, which the CI artifact test (`scripts/security-static.test.mjs`) partially enforces (no remote scripts, no source maps, no secrets).

## Residual risks

| ID | Risk | Status |
|---|---|---|
| R-1 | Outdated Next.js/postcss/sharp in lockfile | Open – awaiting owner approval; CI `security` job red by design |
| R-2 | No CSP / HTTP response headers (GitHub Pages cannot set them) | Open – hosting limit, see `docs/SECURITY_ARCHITECTURE.md` |
| R-3 | Dependabot alerts / CodeQL / secret scanning / push protection / Enforce HTTPS not verifiable from code | Owner UI steps listed in `SECURITY_REVIEW_2026-11-05.md` |
| R-4 | Local runtime differs from CI (Node 24 / pnpm 9.12.2 vs Node 22 / pnpm 10.11.0) | Verify on first CI run |
