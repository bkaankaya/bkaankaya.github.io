# Contributor guidelines — personal portfolio

Read `design.md` before modifying UI. Favor clear, limited changes over ornamental complexity.

1. **Preserve all factual page copy** unless explicitly authorized, especially **TED University**, B.Sc. details, existing internships, dates and twelve project descriptions. `scripts/content-baseline.json` enforces this.
2. Use `assets/styles.css` as the only canonical stylesheet for visual/layout components; do not introduce an overriding `cinematic.css`, duplicated selector bundles or inline style soup.
3. Keep `assets/main.js` for user interaction state and `assets/motion.js` for optional reveal behavior. Content must remain readable without JS or animations.
4. Respect reduced motion and save-data modes; avoid perpetual animations and browser layout thrash. Animate `opacity` and `transform` when needed.
5. Use native semantic buttons, links, landmarks, accessible labels, `aria-pressed`, `aria-expanded`, visible focus and keyboard/Escape support; maintain 44px target sizing where possible.
6. Work directly on the **latest** `main` with no new/backup branch or force push. Do not upgrade dependency versions, install a framework, disclose private source, or change project endpoints without approval.
7. Use the author's **original** photo; never replace it with a regenerated/different face. Preserve image provenance and only perform conservative edits from the original.
8. Run `node --check assets/main.js`, `node --check assets/motion.js`, and `node scripts/check-site.mjs`; inspect mobile, desktop, dark, reduced-motion, no-JS and keyboard behavior before deploying. A green Pages run is not equivalent to field performance or WCAG certification.
9. Update `design.md` for intentional design decisions, not temporary iterations.
