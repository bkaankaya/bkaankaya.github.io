# Portfolio brand and technology refinement — 6 November 2026

## Scope

Preserve the existing violet/navy design, responsive cards, native dialogs, themes,
filters and navbar/footer micro-interactions. Logo badges and large preview media
remain separate. Production stays on GitHub Pages; Vercel Sandbox is used only for
isolated build and browser verification. No runtime dependencies were added.

The previously inert More tile is now a real disclosure button. It reveals exactly
four additional project-backed technologies: TypeScript, Spring Boot, C/C++ and
Solidity. Click, Enter and Space toggle it; Escape closes it and restores focus.
The hidden region is removed from the accessibility tree while collapsed.

## Media provenance

- `public/projects/doravoice-mark.webp`: original D-only white emblem obtained from
  `https://doravoice.ai/brand/doravoice-emblem-white-web.webp`, referenced by the live
  marketing site. Copied without changes (80 x 61, 1,506 bytes). SHA-256:
  `69f4b0c2c876acf6dcbda3e649305a0e299e5a284f15f7a7edda144906a8bcdc`.
  The current AI-Receptionist repository's public assets did not contain this mark.
- `doravoice-call-preview.webp`: supplied by the owner as
  `image(20261106-204127).png`; original SHA-256:
  `96eb082f9f6fb6c9acacfb6a82e94e0d2f322343fec8f31ba7503644538de677`.
- `doravoice-product-preview.webp`: supplied by the owner as
  `image(20261106-204346).png`; original SHA-256:
  `2850eedb57d41cc8b1ef574d5282da78a2d5636ba87e6f427a2f512ef8485c4e`.
  Both DoraVoice previews retain the complete original composition, resized to
  1,440 pixels wide and encoded as WebP quality 88. They are explicitly labeled
  **Design preview**, not live product screenshots or proof of shipped features.
  The two frames reuse the 5-second hover gallery; touch users have manual controls
  in the dialog. Frame-specific alternative text distinguishes the two previews.
- `rezero-mark.webp`: supplied by the owner as `image(20261106-205136).png`;
  original SHA-256:
  `c008f0c6d9ce50104b6c671b94b55d539a3d89337d446dbb479446ac5a1bb939`.
  Empty transparent margins were trimmed and the image resized inside 192 x 192.
  Original colors and proportions remain intact. Used only in the small identity
  badge; the four genuine ReZero gameplay/menu frames remain unchanged.

All four web assets are checked in locally. No runtime requests to private repos,
Adobe transfer URLs or the DoraVoice website are required. The temporary,
checksum-verified import workflow was removed after the assets were committed.

## Additional technology icons

Local SVG paths for TypeScript, Spring Boot, C++ and Solidity come from the
Simple Icons project (CC0), pinned to commit
`e451c581fccb01b56f47e1a77292bdd1fd95b1a4`:
`https://github.com/simple-icons/simple-icons/tree/e451c581fccb01b56f47e1a77292bdd1fd95b1a4/icons`.
Only root fill colors were added. Solidity uses the existing theme-aware
monochrome rule for light-background contrast. Marks remain their owners'
trademarks. No icon package or third-party runtime is installed.

## Verification before publishing

- TypeScript `tsc --noEmit`: passed.
- Static production build and RSC export flattening: passed.
- Node regression tests: 38 passed, 0 failed.
- `pnpm@10.11.0 audit --audit-level high`: no known vulnerabilities reported.
- Chromium: click/Enter/Space/Escape disclosure behavior; exactly four extra tiles.
- Chromium: DoraVoice delayed first transition and 0 -> 1 -> 0 rotation at 5 seconds;
  exactly one hovered gallery timer and cleanup on pointer leave.
- Native dialog centering, two manual images, and touch interaction: passed.
- All category filters retain their original project counts.
- All five pages at 320, 390, 768 and 1440 pixels: no horizontal overflow.
- Reduced motion prevents gallery autoplay and speculative second-frame loading.
- Axe WCAG 2 A/AA and 2.1 AA rule scans: no violations in the Technologies section
  in dark/light themes, or the DoraVoice dialog in dark theme. This is an automated
  check, not a claim of comprehensive accessibility certification.
- No JavaScript page errors or failed image/script/style requests in the tested flow.

Deployment results are recorded in the GitHub Actions run attached to the final
commit; live behavior is checked separately after the deploy job succeeds.
