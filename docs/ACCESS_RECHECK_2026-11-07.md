# Access recheck and gallery reliability — 7 November 2026

## Baseline and scope

GitHub repository access and the existing Vercel QA project were both successfully
verified. Work starts from `84ebd540aeb4dfdbdcc583c493b4c571c60dd56d` on main.
The previous conversational claim that these connections were unavailable was
incorrect. No new branch, production host migration or runtime dependency is used.

The requested More disclosure, four additional technologies (TypeScript, Spring
Boot, C/C++ and Solidity), original DoraVoice D emblem, two supplied DoraVoice
previews and the supplied ReZero badge were already present in this baseline.
They were revalidated rather than replaced. Logo badges remain separate from
large project previews. Existing layout, profile copy and media provenance are
unchanged. Sources are recorded in BRAND_MEDIA_UPDATE_2026-11-06.md.

## Reproduced and fixed

On a delayed connection, the manual Next button previously selected an unloaded
second image: `data-frame=1`, while the active image had no decoded pixels. The
manual gallery now advances only to loaded frames, disables navigation while no
other frame is ready, and reports pending or unavailable images. A failed second
image keeps the first visible instead of displaying an empty panel.

Hover galleries still rotate every 5 seconds. An IntersectionObserver now stops
the interval when its media leaves the viewport; cleanup disconnects the observer
and clears the timer. Reduced motion, Save-Data, page visibility and fine-pointer
checks remain intact.

## Verification before publishing

- TypeScript and Next.js static export: passed.
- Node regression suite: 45 passed, no failures or skips.
- Locked dependency audit (`pnpm@10.11.0 audit --audit-level high`): no known
  vulnerabilities reported at verification time.
- Chromium: More click/Enter/Space/Escape, four extra tiles, all category filters,
  both local logo badges and DoraVoice 0 -> 1 -> 0 with the 5-second first delay.
- Chromium: exactly one hovered-gallery timer; cleanup after leaving the card;
  reduced motion prevents autoplay.
- Delayed and aborted second-image requests: first frame remains visible;
  navigation becomes available only after another frame loads.
- Six routes in both themes at 320, 390, 768 and 1440 pixels: successful responses
  and no horizontal overflow.
- Touch gallery controls, centered dialog, Escape and project-to-Contact scroll
  restoration: passed.
- No JavaScript page errors or HTTP-failing image/script/style requests in the
  tested normal flows. Deliberately aborted requests were tested separately.
- Axe WCAG 2 A/AA and 2.1 AA checks of expanded Home and the DoraVoice dialog in
  both themes: no violations after transitions settled. One earlier light-home
  scan during animation reported contrast; the settled rerun did not reproduce it.
  This is automated checking, not comprehensive accessibility certification.

The reusable browser suite is `scripts/verify-portfolio-browser.cjs`. Install
Playwright and Chromium in a separate QA directory; serve the built `out/` folder,
then set PLAYWRIGHT_MODULE, BASE_URL and optionally QA_OUTPUT when running it.
Screenshots and review.json are written only to QA_OUTPUT, not the public site.
Production deployment is recorded by the GitHub Actions run for this commit;
live-site verification follows successful deployment.
