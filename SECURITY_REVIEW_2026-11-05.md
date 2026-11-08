# Security Review — 2026-11-05

Baseline: `main` @ `3e006bc272fb27297d5f2e0cfe4f09dd153dd628` (clean tree, in sync with origin/main, origin = bkaankaya/bkaankaya.github.io).
Status: **hardening completed with residual risk** (see SECURITY_RISK_REGISTER.md).

## Status per finding
| ID | Result | Evidence / files |
|---|---|---|
| SEC-01 | Done | 6 actions pinned to the full SHAs from the brief, `# vX` comments kept. All five non-annotated tags re-checked with `git ls-remote`; `pnpm/action-setup@v4` peeled tag = `b906aff…` ✔. Node 22 / pnpm 10.11.0 / permissions / persist-credentials unchanged. `.github/workflows/deploy-next-pages.yml` |
| SEC-02 | Done | `.gitignore`: `.env*` (+`!.env.example`), `*.pem *.key *.p12 *.pfx *.p8 *.keystore`, ssh keys, credentials/secrets json, scanner output. History audit: no candidates detected by the performed tests (file-name check and masked pattern scan of all revisions for AWS, GitHub, Slack and Google keys and private-key blocks). Absence of matches does not prove that no secret was ever present; respond to any verified exposure by rotating/revoking. No raw candidates are recorded. |
| SEC-03 | Risk left open (documented) | `pnpm audit --audit-level high` → exit 1, 47 vulnerabilities at high/critical+ lower. Reachability analysis in `SECURITY_RISK_REGISTER.md`. No upgrade performed; owner approval requested (Next ≥16.4.1 etc.). |
| SEC-04 | Not applicable as meta CSP / documented | Inventory + decision in `docs/SECURITY_ARCHITECTURE.md`. No CSP added; header-level controls unverifiable on Pages. No browser available for regression testing. |
| SEC-05 | Done | `scripts/flatten-rsc-export.mjs` rewritten fail-closed + 10 tests (`flatten-rsc-export.test.mjs`): missing out, CLI exit code, idempotent, byte-different collision, source/source collision, symlink, unexpected type, unsafe name, path separators. Real build: 10 files flattened, same naming as before. |
| SEC-06 | Done in code; owner UI needed | New `security` CI job (pinned actions, `contents: read`, runs `pnpm audit --audit-level high`, not suppressed; red until upgrade; does not gate deploy). Test steps added to build job. CodeQL/Dependabot/secret scanning: owner steps below. |
| SEC-07 | Done | `rel="noopener noreferrer"` on all 7 `_blank` links (URLs/mailto unchanged). `scripts/security-static.test.mjs`: https-only, host allowlist derived from concrete URLs, SVG checks, sink checks. |
| SEC-08 | Done | 45 unused direct deps removed (all 29 `@radix-ui/*`, `@vercel/analytics`, recharts, zod, react-hook-form, etc.). Import graph: only `next`, `react`, `react-dom`, `lucide-react` are imported; CSS needs `tailwindcss`, `tw-animate-css`, `@tailwindcss/postcss`, `postcss` (kept). Lockfile: 238 → 100 packages; 0 added, 0 changed versions, 138 removed. `autoprefixer` isn't referenced by `postcss.config.mjs`. |
| SEC-09 | Done | Artifact test over `out/` (107 files): no `.env`/keys/`.map`/logs/debug json, no secret patterns, no `NEXT_PUBLIC_*`, no remote scripts/iframes/http: refs; 5 routes present. History scan as SEC-02. |

## Tests run (local: Node 24.20.0, pnpm 9.12.2, Windows)
- `pnpm install --frozen-lockfile` ✔ (before and after dependency cleanup)
- `node scripts/verify-portfolio-contacts.mjs` ✔
- `pnpm exec tsc --noEmit` ✔
- `pnpm run build` ✔ (6 static routes, postbuild OK)
- `node --test scripts/*.test.mjs` (REQUIRE_OUT=1): 17/17 ✔, 0 skipped
- `git diff --check` ✔
- `pnpm audit --audit-level high` ✘ (expected, documented)
- `pnpm run lint`: **not run** – `eslint` is not a dependency; not installed per instructions (owner approval).
- Not run: browser/viewport/Firefox/Lighthouse matrix, live header check (no browser available); HTTP 200 check done as file-existence of all local references in `out/index.html`.
- CI on pnpm 10.11 / Node 22 is the first verification of that toolchain.

## Owner UI steps
- Settings → Code security: enable Dependabot alerts + security updates, Secret scanning, Push protection; set up CodeQL (JavaScript/TypeScript, default setup).
- Settings → Pages: confirm **Enforce HTTPS**.
- Approve: Next.js upgrade (and postcss) per the register; adding eslint; header-level CSP via CDN.

---

## Final owner-approved remediation (later on 5 November 2026)

The earlier findings above are **historical** and should not be interpreted as the current dependency state. The owner authorized Next 16.4.5 and PostCSS 8.5.32 updates and a minimal transitive resolution to source-map-js 1.2.2 and baseline-browser-mapping 2.11.0. See [updated risk register](SECURITY_RISK_REGISTER.md) for the current status. The [targeted upgrade validation run](https://github.com/bkaankaya/bkaankaya.github.io/actions/runs/42065828859) completed with “No known vulnerabilities found”. The security job fails on a new high/critical advisory; the existing `deploy.needs: build` exception means this is **not a fail-closed deployment gate** (see R-6 in the register). The 8 November source maintenance does not repeat this historical audit.
