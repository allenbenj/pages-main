---
applyTo: "**/*.{html,css,js,mjs,ts,tsx,jsx}"
---

# Front-End Instructions

- Root pages are hand-written HTML/CSS/JavaScript; do not introduce a root-site framework or build step.
- Preserve Webflow compatibility on `index.html`, including its existing classes and badge-suppression block.
- Page-specific inline CSS and JavaScript are allowed where that is the established local pattern. Prefer shared styles and scripts for genuinely reused behavior.
- Preserve legal text and evidence references unless the maintainer supplies the correction.
- Keep controls semantic, keyboard accessible, responsive, and compatible with reduced motion.
- Use repository-relative, case-correct paths that work under the `pages-main` project-site subpath.
- Keep the shared navigation synchronized through `tools/sync_nav.py` and refresh the search index when page titles, sections, or media change.
- Do not create duplicate `final`, `new`, `copy`, or numbered page variants.
