# Copilot Instructions for An Edifice of Lies

Read and follow [`AGENTS.md`](../AGENTS.md) as the canonical repository guide. These instructions summarize the rules that must remain visible in every Copilot task.

- This is a static GitHub Pages legal-case presentation. Canonical HTML sources live in `assets/pages/` and stage to established root public URLs; `index.html` remains at source root. `network_analysis/` is the only built sub-application.
- Treat names, dates, quotations, citations, allegations, and evidence references as legally sensitive. Do not invent, embellish, or casually rewrite them.
- Preserve unrelated work. Do not commit, push, rebase, merge, delete evidence, or perform broad cleanup unless explicitly authorized.
- Keep canonical pages compatible with their staged artifact-root location and existing public URLs. Use repository-relative, case-correct asset paths.
- Use the canonical generators and synchronization tools documented in `AGENTS.md`; do not hand-edit generated indexes or rendered data regions.
- Before release, build `network_analysis`, then stage and validate with `tools/site_release.py`. A green workflow is not proof that the expected commit and assets are live.
- Keep the staged artifact below 900 MB and out of forbidden/private directories.
