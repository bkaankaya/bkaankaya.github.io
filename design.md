# Portfolio Design Engineering

**Intent:** An evidence-led personal engineering portfolio for recruiters, collaborators and technical reviewers—not a SaaS dashboard or a clone of Vercel's brand.

This repository keeps the reasons behind design decisions near the implementation, following Vercel's 2026 published product-design guidance. The site remains static HTML, CSS and vanilla JS on GitHub Pages with no extra dependencies.

## Visitors, tasks, hierarchy

1. Identity: clarify who the engineer is and what work they do using the **existing approved site copy**.
2. Evidence: featured projects link to substantive case studies; all twelve project routes remain accessible.
3. Context: distinguish AI, product, software, embedded and research work without inventing results.
4. Trust: education, experience and tooling get intentional reading order.
5. Next steps: every card has a native anchor, case studies link back, and contact uses standard links.

## Design language and primitives

- Direction: restrained, technical-editorial design with off-white paper, graphite-green ink, terracotta emphasis and authentic portrait photography.
- Use shared CSS custom properties for surfaces, text, borders, spacing, radii, focus and motion. The spacing scale is 4, 8, 12, 16, 24, 32, 48, 64 and 96 CSS pixels.
- System sans-serif for hierarchy, a serif only for editorial emphasis, restrained monospace for metadata. No external font CDN.
- Cards: subtle borders, nested radii, light two-layer shadows and differentiated category tints; no generic gradient wallpaper or heavy animations.
- Use semantic links for navigation and semantic buttons for actions. No fake interactive divs.
- Preserve the portrait's identity, reserve its aspect ratio and preload only the hero image.

## Interaction contract

- The static HTML navigation stays usable without JavaScript. At 860px or smaller, enhancement adds a toggle with aria-expanded, Escape-to-close, outside click and focus restoration.
- Prefer controls 44px high on mobile; visible focus-visible styling must not be clipped or obscured by sticky UI.
- Project filters use native buttons, aria-pressed, a polite live result count and a shareable filter URL parameter; browser Back/Forward restores selection.
- Theme follows saved user choice, otherwise OS preference, and updates browser theme-color.
- Prefer CSS grid/flex/intrinsic dimensions over JS layout measurement. Limit transitions to intentional properties; honor reduced-motion settings.
- Keyboard Tab, Enter, Space and Escape should work, alongside touch and pointer use.

## Responsive contract

- Desktop shell maximum width: 1160px.
- Wide screens: two-column hero; asymmetric featured grid; three-column project library.
- 601–860px: single-column hero, two-column cards, compact navigation.
- Up to 600px: single-column cards, wrapping filter controls, readable content and no horizontal overflow.
- Manual QA breakpoints: 320, 375, 430, 768, 1024, 1440 and 1920px, with 200% browser zoom and long text.

## Accessibility and performance

- WCAG 2.2 AA is the design target, not a certification claim. Preserve heading semantics, alt text, keyboard access, skip links, visual focus, contrast and reduced motion.
- On mobile use 44px hit targets where practical. WCAG 2.2 AA's normative target-size minimum has its own 24px rules and exceptions.
- Reserve media dimensions, use system fonts and avoid layout jumps.
- Measurable field goals at the 75th percentile: LCP at most 2.5 seconds, INP at most 200ms, CLS at most 0.1. These are goals, not measured results.
- Run Lighthouse and manual cross-browser checks before claiming compliance.

## Non-negotiable maintenance rules

- **Preserve all factual content, especially the existing TED University wording. Do not substitute another institution.**
- Do not invent work, metrics, degrees or employers; keep all twelve case-study URLs and titles intact.
- Do not publish private code, credentials, unpublished research or customer data.
- No new branch, dependency upgrade, framework change, force push or action-version change without permission.
- The project should work with GitHub Pages and without a runtime server.

## Cross-checked sources (reviewed November 5, 2026)

Vercel:
- https://vercel.com/design/engineer
- https://vercel.com/design/guidelines
- https://vercel.com/geist/introduction
- https://vercel.com/blog/design-engineering-at-vercel
- https://vercel.com/blog/teaching-agents-product-design-at-vercel (June 2026)
- https://vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md (August 2026)

Independent:
- https://primer.style/accessibility/tools-and-resources/checklists/engineering-checklist/
- https://primer.style/accessibility/design-guidance/text-resize-and-spacing/
- https://shopify.dev/docs/api/polaris/using-polaris-web-components
- https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview
- https://www.w3.org/TR/WCAG22/
- https://web.dev/articles/vitals

Vendor design systems are comparative references, while W3C WCAG is the normative accessibility standard; Core Web Vitals are field-measurable performance metrics.
