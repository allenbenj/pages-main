# Contributing

This repository publishes the static legal-case presentation “An Edifice of Lies.” Read `AGENTS.md` before changing the site; it is the canonical repository guide.

## Protect the record

- Do not invent or casually rewrite names, dates, quotations, citations, allegations, or legal conclusions.
- Keep source evidence, editorial annotations, and conclusions distinguishable.
- Do not rename, delete, or recompress evidence media merely to simplify a change.
- Preserve unrelated local work and review the complete diff before staging.

## Work on a focused branch

From `D:\Web_Page\pages-main`:

```powershell
git status
git branch -vv
git remote -v
git fetch --all --prune
git switch -c feature/descriptive-name
```

Git mutations such as commit, push, rebase, and merge remain maintainer-controlled. Automated agents must not perform them unless explicitly asked.

## Update canonical generated data

Run the applicable generator after changing its source material:

```powershell
python tools/build_search_index.py
python tools/build_evidence_data.py
python tools/sync_contradiction_cards.py verify
python tools/sync_timeline_events.py verify
```

`documents/data/contradictions.json` and `documents/data/timeline.json` are canonical for their rendered page regions. Follow the extract/render/verify workflows documented in `AGENTS.md`.

## Verify changes

For the React network-analysis application:

```powershell
Set-Location network_analysis
npm ci
npm audit --audit-level=high
npm run build
Set-Location ..
```

Stage and validate the exact Pages artifact using a path that does not already exist:

```powershell
$stagePath = ".local/release-review-$(Get-Date -Format yyyyMMdd-HHmmss)"
python tools/site_release.py stage --source . --output $stagePath
python tools/site_release.py validate --root $stagePath
```

The staged artifact must contain no broken references or forbidden paths and must remain below 900 MB. For a deeper link review, run `python tools/audit_links.py` with the database and summary paths shown in `AGENTS.md`.

Manually inspect affected pages at desktop and mobile widths. Check keyboard behavior, the browser console, media loading, and case-sensitive URLs.

## Pull requests

Keep each pull request focused. State what changed, why it changed, which generated files were refreshed, the exact validation performed, deployment implications, known limitations, and screenshots for visible changes.
