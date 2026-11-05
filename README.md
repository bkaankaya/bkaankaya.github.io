# Bertan Kaan Kaya — Engineering Portfolio

The source for **https://bkaankaya.github.io/**, a GitHub Pages portfolio of applied AI, machine learning, backend products, full-stack systems, embedded engineering and research work.

## Architecture

| Path | Responsibility |
| --- | --- |
| `index.html` | Portfolio introduction, featured projects, filterable catalog, experience, education and contact |
| `projects/*/index.html` | Twelve existing project case studies and scope notes |
| `assets/styles.css` | Single tokenized CSS system, accessible responsive layouts, states and dark mode |
| `assets/main.js` | Theme, menu, sticky header, active nav and URL-backed project filters |
| `assets/motion.js` | Lazily loaded IntersectionObserver + native Web Animations API; no mandatory animation dependency |
| `assets/portrait-kaan.webp` | High-quality crop from the original 640×640 author photograph; circle via CSS |
| `design.md`, `AGENTS.md` | Design rationale and change constraints |
| `scripts/content-baseline.json` | Hashes guarding all 13 pages' existing visible copy |
| `scripts/check-site.mjs` | Zero-dependency route, semantics, content and architecture checks |
| `.github/workflows/portfolio-quality.yml` | Automated quality gate on `main` |

No frontend build pipeline, runtime server, JavaScript framework, paid service or external tracking is required.

## Verify locally

```bash
node --check assets/main.js
node --check assets/motion.js
node scripts/check-site.mjs
```

For a local preview, serve the repository root using any static HTTP server. Test on a real browser with keyboard, touch, 200% zoom, reduced motion, dark mode and all project routes. The static gate does not certify Core Web Vitals or WCAG compliance.

## GitHub Pages

The repository uses **main / (root)** on GitHub Pages. Pushing to `main` triggers both deployment and `Portfolio quality` checks. The public URL is https://bkaankaya.github.io/.

## Content, privacy and licensing

The original education/employment copy and every project description remain unchanged. No private source code, credentials, unpublished research or customer data are published. The website's code uses the MIT license; linked repositories retain their own licenses and access rules.
