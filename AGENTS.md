# AGENTS.md

Guidance for AI coding agents working in this repository. The reader is assumed to know nothing about the project.

## Project Overview

This repository is **"An Edifice of Lies"**, a static website presenting the criminal case *State v. Benjamin Allen*. It documents contradictions between testimony and physical evidence, investigative failures, and alleged prosecutorial misconduct, using embedded video, audio, documents, and interactive pages. It is published via **GitHub Pages** from the `main` branch of `https://github.com/allenbenj/pages-main`.

The site is primarily **hand-written vanilla HTML/CSS/JavaScript with no build step** for the main pages. One sub-application (`network_analysis/`) is a React/Vite/TypeScript app that is built during deployment. Python scripts in `tools/` handle search-index generation, link auditing, and release staging/validation.

Key facts:

- No frameworks, bundlers, or package managers are needed for the root site pages — they are plain `.html` files opened directly or served statically.
- `index.html` is a Webflow-exported landing page (it loads jQuery/Webflow/GSAP from `assets/js/`), progressively customized by hand.
- Large binary evidence (video ~430 MB, audio ~27 MB, documents ~330 MB) lives in the repo and is deployed as-is (with one release-time video transcode).
- Content is legal-advocacy material; accuracy of names, dates, quotes, and citations in page content matters — do not alter case-related text casually.

## Repository Layout

```
├── *.html                  # Root site pages (the public site entry points; canonical versions)
├── content/                # Legacy page variants — all are now meta-refresh redirects
│                           #   to the canonical root pages (kept so old URLs keep working)
├── shared/                 # Shared front-end assets used by root pages
│   ├── styles.css          #   Global stylesheet (~107 KB, the main CSS)
│   ├── site-search.js/.css #   Site-wide search overlay (loads assets/search-index.json)
│   ├── image-modal.js      #   Click-to-zoom modal for images
│   ├── card-mapper.js, card-colors.js   # Card theming helpers
│   ├── orbital-carousel.js, carousel-nav.css  # 3D carousel nav (legacy)
│   └── (shell.js, shell.css, site-nav.js were removed in the 2026-07 cleanup —
│        they were not referenced by any page)
├── assets/
│   ├── css/, js/, icons/, images/   # Webflow-exported/vendor assets (jQuery, GSAP, webflow js)
│   └── search-index.json   # Generated site-search index (do not hand-edit; see tools/)
├── audio/                  # Evidence audio (mp3)
├── video/                  # Evidence video (mp4), incl. long_view/ and various/ subfolders
├── documents/              # Source documents, exhibits, graphics, mindmaps (OPML), data exports
├── network_analysis/       # React + Vite + TS graph app (see below); built to dist/ at deploy time
├── tools/                  # Python maintenance/release scripts (see below)
├── archive/                # evidence-masters/ (original raster masters), logs/, source-work/,
│                           #   standalone-pages/ (archived operator-only editor.html)
├── reports/                # Generated JSON reports (release review, raster delivery, perf inventory)
└── .github/
    ├── workflows/static.yml  # GitHub Pages deploy pipeline (the only CI)
    ├── agents/, prompts/     # Large personal library of agent/prompt definitions;
                              #   mostly NOT specific to this project — treat as reference material
    └── instructions/         # (empty)
```

Notable root pages: `index.html` (landing), `overview.html` (site map hub — `page-index.html`, `link-diagram.html`, and `editor.html` are meta-refresh redirects into it), `timeline.html`, `players.html`, `connections.html`, `scene.html`, `evidence.html`, `contradictions.html`, `general-videos.html`, `misconduct.html`, `misconductandfailure.html` (mindmaps), `documentspage.html`, `prosecutor_allowed.html`, `judicial-duty.html`, `why-dont-we-have-this-system.html`, `case-study.html`, `data-snapshot.html`. `false-allegation-framework.html` redirects to `index.html`. `document-unavailable.html` is the fallback for unpublished source PDFs.

## Technology Stack

- **Root site:** HTML5 + CSS3 + vanilla JS. Dark theme. No build step, no lint config, no test framework.
- **Vendor JS on the landing page:** jQuery, Webflow runtime, GSAP + ScrollTrigger (in `assets/js/`, loaded with `defer`).
- **Search:** client-side overlay (`shared/site-search.js`) reading the pre-generated `assets/search-index.json`.
- **network_analysis app:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 (`@tailwindcss/vite`), reactflow 11 (graph canvas), zustand, lucide-react, uuid. Built with `vite-plugin-singlefile` into a single-file `dist/` with `base: './'`. Path alias `@` → `src/`. Dev server proxies `/api` to `127.0.0.1:3000`.
- **Python tools:** Python 3.11+ (code uses `datetime.UTC` and `str | None` syntax). Third-party deps: `beautifulsoup4` and `pypdf` (used by `tools/build_search_index.py`). There is **no requirements file** — install deps manually (`pip install beautifulsoup4 pypdf`), preferably in a virtual environment (`.venv/` is gitignored). `ffmpeg` is required by the media optimization and release-transcode steps.
- **Git conventions:** `.gitattributes` forces LF for all text files (`.bat` is CRLF) and marks media/fonts as binary. A `websource` git submodule is declared in `.gitmodules` but is not present in the working tree.

## Build, Run, and Release Commands

### Local development (root site)

No build. Open pages directly or serve statically, e.g.:

```bash
python -m http.server 8000     # then open http://localhost:8000/index.html
```

### network_analysis app

```bash
cd network_analysis
npm ci            # install (lockfile present)
npm run dev       # vite dev server on port 4173
npm run build     # outputs single-file build to network_analysis/dist/
npm run preview   # preview the build
```

`npm run build` must succeed before staging a release, because the deploy pipeline copies `network_analysis/dist/` to `network_analysis/` in the artifact.

### Python tools

```bash
# Regenerate the site-search index (run after adding/renaming pages or media)
python tools/build_search_index.py        # writes assets/search-index.json
# Override paths via SITE_SEARCH_ROOT / SITE_SEARCH_OUTPUT env vars.
# content/, archive/, tmp/, tools/, reports/, node_modules/ are excluded, and
# meta-refresh redirect stubs are skipped automatically.

# Synchronize the shared nav-tabs block across root pages
python tools/sync_nav.py                  # edit NAV_TABS in the script to add/rename tabs

# Rebuild the canonical evidence inventory (run after adding/renaming evidence files)
python tools/build_evidence_data.py       # writes documents/data/evidence-export.json
# Scans documents/, video/, audio/; every record is verified on disk and carries
# sizeBytes + sha256. documentspage.html renders its Evidence File Inventory
# section from this file. Preserves curated website card entries across rebuilds.

# Manage the contradiction card data for documentspage.html
python tools/sync_contradiction_cards.py extract   # page  -> documents/data/contradictions.json
python tools/sync_contradiction_cards.py render    # JSON  -> page (splices only the grid regions)
python tools/sync_contradiction_cards.py verify    # fails if page and JSON are out of sync
# The JSON is the source of truth for the 40 contradiction cards (exact inner
# HTML per grid + per-card label/title/pills metadata). Edit JSON, render, verify.

# Manage the timeline event data for timeline.html (same pattern)
python tools/sync_timeline_events.py extract   # page  -> documents/data/timeline.json
python tools/sync_timeline_events.py render    # JSON  -> page (splices only the event container)
python tools/sync_timeline_events.py verify    # fails if page and JSON are out of sync
# Source of truth for the 20 timeline events (exact container HTML + per-event
# time/side/description/video metadata).

# Audit links across the site into a SQLite DB + JSON summary
python tools/audit_links.py --root . --db .local/link_audit/link_audit.sqlite \
    --summary .local/link_audit/link_audit_summary.json

# Non-destructive release-readiness review (missing targets, size budget, hashes)
python tools/build_release_review.py      # see --help; writes reports/*.json

# Archive oversized raster masters and restore optimized delivery copies (needs ffmpeg)
python tools/optimize_raster_delivery.py  # see --help; pairs with reports/raster-delivery-*.json

# Stage and validate the deployable artifact (exactly what CI does)
python tools/site_release.py stage --source . --output <empty-dir>
python tools/site_release.py validate --root <staged-dir>
```

### Deployment (CI)

`.github/workflows/static.yml` runs on every push to `main` (or manual dispatch):

1. `npm ci && npm audit --audit-level=high && npm run build` inside `network_analysis/` (Node 22).
2. Installs `ffmpeg`.
3. `python tools/site_release.py stage --source . --output $RUNNER_TEMP/site`.
4. `python tools/site_release.py validate --root $RUNNER_TEMP/site`.
5. Uploads the staged directory as the Pages artifact and deploys.

## Release Rules (enforced by tools/site_release.py)

When changing the site, respect the release contract — CI fails otherwise:

- **What ships:** root `*.html`, directories `assets/`, `audio/`, `content/`, `documents/`, `shared/`, `video/`, and the built `network_analysis/dist/` (as `network_analysis/`). Everything else (`tools/`, `archive/`, `reports/`, dot-directories, `node_modules/`) does **not** ship.
- **Validation checks:** no forbidden path segments (`.git`, `.github`, `.codex`, `.grok`, `.kilo`, `.copilot`, `.cursor`, `.agents`, `node_modules`) in the artifact; every `href`/`src`/`poster`/`data-modal-image`/`data-href` reference in HTML/CSS must resolve to a file in the artifact (external, `data:`, `mailto:`, `#fragment` links are skipped); total artifact size must stay under **900 MB**. A `release-manifest.json` is written into the staged artifact.
- **Size budget:** as of the 2026-07-17 review the artifact is ~828 MB (529 files) with ~72 MB of headroom. Be cautious adding large media; prefer compression, and reuse the existing transcode/delivery-optimization pipeline (`optimize_raster_delivery.py`, `VIDEO_TRANSCODES` in `site_release.py`) rather than shipping raw masters. Original raster masters belong in `archive/evidence-masters/`, not in the public folders.
- During staging, one listed video is transcoded with ffmpeg (libx264 CRF 28 + faststart) and all HTML pages get `decoding="async"` / `loading="lazy"` image hints injected — these mutations happen only in the disposable artifact, never in the source tree.

## Coding Conventions

- **Pages are self-contained vanilla HTML.** Each root page links `shared/styles.css` (often with a cache-busting `?v=<number>` query — bump it when the CSS changes materially) and includes `<script src="shared/site-search.js" defer></script>` before `</body>`. Page-specific CSS/JS is inline in the file.
- **Navigation:** root pages carry a shared `<div class="nav-tabs">` bar near the top of `<body>` linking the main sections; the current page's tab has class `active`. The canonical tab list lives in `tools/sync_nav.py` (`NAV_TABS`) — to add or rename a top-level page, edit that list and run `python tools/sync_nav.py` (rewrites the nav block on every page, idempotent). Also update the hub page `overview.html`.
- **Webflow artifacts:** pages include `<style class="force-hide-webflow">` to suppress the Webflow badge; keep that block. The landing page still uses Webflow classes (`w-container`, `w-dropdown`, etc.).
- **Media references:** images use `data-modal-image` for the modal viewer; videos live under `video/` and audio under `audio/` with spaces in filenames (URL-encode as needed in `href`/`src`). Large media is treated as evidence — do not recompress, rename, or delete source files in the repo; delivery optimization happens in the release pipeline or via the documented tools with manifests.
- **Line endings:** LF everywhere except `.bat` (enforced by `.gitattributes`).
- **Style:** 2-space indentation in HTML/JS, double quotes for HTML attributes, single quotes common in JS. Python tools use type hints, `pathlib`, dataclasses, and `argparse`; they print JSON progress/results to stdout. Match these existing idioms.
- **`.kilo/`, `.codex/`, `.grok/`:** local AI-tool state; gitignored and excluded from release. `.kilo/package.json` only carries a Kilocode plugin dependency — it is not a project build. The site deploys via GitHub Pages only (a leftover Firebase experiment was cleaned up in 2026-07).

## Testing and Verification

There is **no automated test suite**. Verification is done by:

1. `python tools/site_release.py stage` + `validate` locally before pushing (this is the closest thing to a test gate — it catches broken internal links, forbidden files, and size-budget overruns).
2. `python tools/audit_links.py` for a deeper link audit.
3. `npm run build` in `network_analysis/` for the React app (TypeScript `strict` mode with `noUnusedLocals`/`noUnusedParameters` acts as the static check; there is no separate lint/typecheck script).
4. Manual browsing of affected pages.

Regenerate `assets/search-index.json` with `tools/build_search_index.py` whenever page titles, sections, or media files change, or search results will go stale.

## Security and Sensitivity Considerations

- The site publishes real court-case material (names, testimony, exhibits). Treat page content as legally sensitive: do not invent, embellish, or "correct" factual claims, quotes, dates, or names. Editorial changes should come from the maintainer.
- Never commit secrets. Nothing in the release artifact may come from `.env`-style files or the gitignored tool-state directories; `site_release.py validate` enforces the forbidden-path list.
- `npm audit --audit-level=high` runs in CI for `network_analysis/` — dependency upgrades that introduce high-severity vulnerabilities will fail the deploy.
- Git mutations (commit/push/rebase) are performed by the maintainer; agents should not run them unless explicitly asked.
