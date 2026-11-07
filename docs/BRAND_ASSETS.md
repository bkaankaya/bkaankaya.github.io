# Brand & Media Assets Inventory (`docs/BRAND_ASSETS.md`)

**Last Verified:** 2026-11-05  
All brand icons and media assets used in the portfolio are hosted locally under `public/` with zero external hotlinks, inline scripts, `foreignObject` elements, or event handlers.

---

## 1. Personal Brand & Portrait Assets

| Asset Path | Purpose | Source & Provenance | Format & Dimensions | License / Usage Notes |
| --- | --- | --- | --- | --- |
| `public/icon.svg` | Browser tab SVG favicon (`BK.` monogram) | First-party vector artwork created for Bertan Kaan Kaya (`#080a16` navy badge, `#f5f6fc` geometric `BK`, `#a77aff` accent dot) | SVG (`viewBox="0 0 180 180"`) | First-party / MIT (repository license) |
| `public/icon-dark-32x32.png` | 32×32 PNG favicon (dark scheme) | Rasterized from `public/icon.svg` via `sharp` | PNG (`32×32`) | First-party / MIT |
| `public/icon-light-32x32.png` | 32×32 PNG favicon (light scheme) | Rasterized from `public/icon.svg` via `sharp` | PNG (`32×32`) | First-party / MIT |
| `public/apple-icon.png` | Apple touch icon | Rasterized from `public/icon.svg` via `sharp` | PNG (`180×180`) | First-party / MIT |
| `public/portrait-kaan.webp` | Circular portrait on Home (`/`) and About (`/about/`) | Derived directly from authentic repository commit `d20ac71d1a0dac20c666f553fd76bc70476622a3:assets/portrait-kaan.webp` (1:1 centered face/collar framing, no AI face modification) | WebP (`520×520`, ~40 KB) | Owner's personal photograph; all rights reserved by Bertan Kaan Kaya |

---

## 2. Technology & Social Brand Marks (`public/brands/*.svg`)

All third-party marks represent technologies genuinely used by the portfolio owner or verified personal profile links. Every SVG was sanitized and inspected for 1×/2× DPR clarity across dark and light themes.

| Technology / Brand | Local Asset Path | Official Brand / Vector Reference URL | Verification Date | Trademark & Brand Guideline Compliance |
| --- | --- | --- | --- | --- |
| **React** | `public/brands/react.svg` | https://react.dev/ & https://github.com/simple-icons/simple-icons (`react.svg`) | 2026-11-05 | Official `#61DAFB` atomic orbit geometry (`viewBox="-11.5 -10.232 23 20.463"`). Trademark of Meta Platforms, Inc. |
| **Next.js** | `public/brands/nextjs.svg` | https://nextjs.org/ & https://vercel.com/design/brands | 2026-11-05 | Official circular `N` monogram mark with diagonal slash cutout (`viewBox="0 0 24 24"`), theme-adaptive (`currentColor`). Trademark of Vercel Inc. |
| **Python** | `public/brands/python.svg` | https://www.python.org/community/logos/ | 2026-11-05 | Official two-snake device in Python blue (`#3776AB`) and yellow (`#FFD43B`) (`viewBox="0 0 24 24"`). Trademark of the Python Software Foundation. |
| **Java** | `public/brands/java.svg` | https://www.oracle.com/legal/trademarks.html & Devicon `java-original.svg` | 2026-11-05 | Classic coffee cup (`#5382A1`) and steam flame (`#E76F00`) vector mark (`viewBox="0 0 24 24"`). Trademark of Oracle and/or its affiliates. |
| **Docker** | `public/brands/docker.svg` | https://www.docker.com/company/newsroom/media-resources/ | 2026-11-05 | Official Docker Moby whale with container stack in Docker blue (`#2496ED`) (`viewBox="0 0 24 24"`). Trademark of Docker, Inc. |
| **PostgreSQL** | `public/brands/postgresql.svg` | https://wiki.postgresql.org/wiki/Logo | 2026-11-05 | Official PostgreSQL Slonik elephant mark (`#4169E1`) (`viewBox="0 0 24 24"`). Trademark of the PostgreSQL Community Association of Canada. |
| **AWS** | `public/brands/aws.svg` | https://aws.amazon.com/architecture/icons/ & AWS Brand Guidelines | 2026-11-05 | General AWS brand mark (`aws` wordmark in `currentColor` + signature `#FF9900` smile arrow underneath, not an individual service architecture cube). Trademark of Amazon.com, Inc. or its affiliates. |
| **GitHub** | `public/brands/github.svg` | https://github.com/logos | 2026-11-05 | Official GitHub Invertocat mark (`viewBox="0 0 24 24"`, `currentColor`) used exclusively to link to `https://github.com/bkaankaya`. Trademark of GitHub, Inc. |
| **LinkedIn** | `public/brands/linkedin.svg` | https://brand.linkedin.com/in-logo & https://brand.linkedin.com/linkedin-logo | 2026-11-05 | Official `[in]` bug logo (`viewBox="0 0 24 24"`, `currentColor`) used per LinkedIn member profile linking rules (no unauthorized full corporate wordmark). Links exclusively to `https://www.linkedin.com/in/kaan-kaya-9890812b0/`. Trademark of LinkedIn Corporation. |

