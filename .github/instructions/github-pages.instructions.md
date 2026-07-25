---
applyTo: "**/*.{html,css,js,json,yml,yaml,md,py}"
---

# GitHub Pages Instructions

- Deployment is defined by `.github/workflows/static.yml` and runs for `main`.
- Build `network_analysis/` with Node 24 before staging.
- Stage with `python tools/site_release.py stage --source . --output <nonexistent-path>` and validate that artifact with `python tools/site_release.py validate --root <staged-path>`.
- The release tool, not the source tree, supplies the built `network_analysis/dist/` application in the public artifact.
- Do not upload the repository root directly or publish private tool-state, archive, report, or dependency directories.
- Keep asset URLs repository-relative and case-correct. Preserve `.nojekyll`.
- Confirm commit ancestry, Actions provenance, deployed assets, and rendered browser state before declaring release success.
