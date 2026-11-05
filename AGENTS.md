# Contributor instructions — Engineering portfolio

Review design.md before changing UI.

1. Keep the site's educational claims, project titles and descriptions, employment history and personal details verbatim unless explicitly instructed to modify them. The TED University wording is deliberate and must not be replaced.
2. Preserve all twelve /projects/*/ routes and respect visibility of private repositories.
3. Work on the current main HEAD only: no new or backup branches and no force pushes. Do not change dependencies, tool versions, frameworks or GitHub Actions versions without permission.
4. Preserve lightweight GitHub Pages hosting with static HTML/CSS and progressive JS enhancement. No unnecessary CDN, font dependency, UI framework or analytics.
5. Use native HTML anchors and buttons, visible keyboard focus, accessible labels, a skip link, touch-sized controls, and reasonable contrast in both themes.
6. Support reduced motion and OS themes. Keep project filters shareable in URL and usable with Back/Forward.
7. Manually review 320/375/430/768/1024/1440/1920px widths, 200% zoom, long labels, open mobile menu, keyboard Escape, and no-JS behavior.
8. Run the zero-dependency site verification script and JS syntax check after changes, and verify GitHub Pages deployment. A green deployment alone does not establish Lighthouse or WCAG compliance.
9. Keep changes small and record their test evidence and design rationale.
