# Task List — Site Review Recommendations

Source: design & technical review of 2026-07-17. Track status with the checkboxes:
`- [ ]` open · `- [x]` complete (add the date, e.g. `- [x] 2026-07-18`).

**After every task:** run `python tools/site_release.py stage --source . --output <empty-dir>`
and `python tools/site_release.py validate --root <staged-dir>` before pushing.
If a task changes page titles, sections, or media, also run
`python tools/build_search_index.py`.

***

## P0 — Fix soon

* [x] 2026-07-17 · **P0-1 · Neutralize weak alt text on `timeline.html`**
  29 of 32 images currently read `alt="LIAR"` or `alt="Placeholder image"`.
  * Evidence stills → neutral description, e.g. `alt="Still from Exhibit C video, 12:41 AM"`.

  * Decorative FALSE stamps → `alt=""` (the card copy already asserts falseness).

  * **Workflow:** timeline events are data-driven — edit `documents/data/timeline.json`,
    then `python tools/sync_timeline_events.py render` and `... verify`. Do not hand-edit
    the event container in the page.

* [x] 2026-07-17 · **P0-2 · Remove meaningless hover motion**
  * Delete `.header:hover { transform: translateY(-4px) ... }` and `.u-hover-scale`
    from `shared/styles.css`; audit inline page CSS for similar lift/scale hovers.

  * Keep purposeful motion (landing smoke-quote, modal transitions).

  * **Workflow:** bump the `?v=` cache-buster on `shared/styles.css` links across pages.

* [x] 2026-07-17 · **P0-3 · Consolidate navigation**
  * One primary nav (`nav-tabs`) + the "ON THIS PAGE" TOC panel. Remove the duplicate
    breadcrumb pill rows on `players.html` and `documentspage.html` (check other pages
    for the same pattern).

  * If tabs are added/renamed: edit `NAV_TABS` in `tools/sync_nav.py`, run the script,
    and update the `overview.html` hub — never hand-edit nav blocks.

* [x] 2026-07-17 · **P0-4 · Replace Tailwind CDN runtime on `connections.html`**
  `assets/js/tailwindcdn.js` is a 407 KB JIT compiler shipped to production.
  * Replace with a small prebuilt CSS file containing only the utilities the page uses
    (Tailwind CLI one-off build or hand-extracted classes); delete the script tag.

***

## P1 — Design system upgrades

* [x] 2026-07-17 · **P1-1 · Three-role typography system**
  * Sans (Manrope) — UI and body, as now.

  * Display (Cormorant Garamond, adopted from `judicial-duty.html`) — page H1s and
    major section titles; ships together with the gold section-title rule in P1-4.

  * Serif (Georgia) — testimony and long quotes: upright (no italic), left-aligned,
    ≥ 1.05 rem. Fix the centered italic blocks on `contradictions.html`.

  * Monospace, uppercase, wide tracking, `font-variant-numeric: tabular-nums` —
    timestamps (`OCT 18 2019 9:30 PM`), exhibit IDs, tag pills, folio numbers.

  * Implement as utility classes in `shared/styles.css`; bump `?v=`.

  * Progress 2026-07-17: foundation shipped — font tokens (`--font-display` /
    `-body` / `-serif` / `-mono`) and `.t-display` / `.t-serif` / `.t-mono`
    utilities in `shared/styles.css`; Manrope, Cormorant Garamond, and JetBrains
    Mono now actually load on all 16 shared pages (Manrope was referenced but
    never loaded before). `.section-title` uses Cormorant site-wide.
    Rollout complete 2026-07-17: `contradictions.html` narrative and testimony
    now render upright Georgia serif, left-aligned, 1.05 rem / 1.75 (the old
    centered blocks are gone; subtitle hints stay centered sans); timeline
    `.event-time` stamps and the `.pill` / `.card-filter-chip` tags on
    `documentspage.html` render JetBrains Mono, uppercase, tabular numerals —
    all mapped CSS-side, so the JSON sources were untouched. Cache-buster
    `?v=` bumped to `…759` on all 17 shared pages; verified with headless
    screenshots.

* [x] 2026-07-17 · **P1-2 · Un-card the chrome**
  * Reserve bordered/radius/shadow cards for actual evidence records.

  * `nav-tabs` becomes a flat bar; section pages use ruled 1 px dividers + spacing
    instead of nested cards (notably `overview.html`, `players.html`).

  * Progress 2026-07-17: shipped site-wide. `nav-tabs` in `shared/styles.css` is
    now a flat ruled bar — text links, hairline bottom rule, active tab in
    `--gold-text` with a 2 px gold underline (pill container, backdrop blur, and
    hover lift retired; the "More pages" dropdown inherits the flat tab and its
    menu keeps its floating panel). Shared `.content-section` is now a ruled
    band (no box, 1 px top rule, horizontal padding 0) and `.header` is a flat
    epigraph — this removed the card-inside-card pattern on every section page
    in one move. `overview.html`: hero, content sections, route/index/matrix/
    summary cards all flattened to ruled blocks (map-nodes keep boxes — diagram
    vocabulary), and the view switcher matches the flat nav tabs. `players.html`:
    relationships section (fact lists + five stacked image blocks) un-carded
    into ruled blocks; person dossiers keep their category-coded cards as
    records. Cache-buster `?v=` bumped to `…761` on all 17 pages; verified with
    headless screenshots of overview, players (full height), timeline, evidence,
    and case-study. Remaining: the floating `.page-rail` "On this page" panel is
    still carded (pages override it inline with `!important` — flatten together
    with the P1-3 nav/button unification).

* [ ] **P1-3 · Unify landing ↔ inner-page design tokens**
  * Map the Webflow landing's colors, type scale, and buttons onto the `:root`
    custom properties in `shared/styles.css`; one nav appearance and one button
    style across `index.html` and the shared pages. Landing values are the more
    disciplined set (`#15191a`/`#2b3233` backgrounds, `#dae4e5` text, `#2c5a61`
    accent with a 10–90% alpha tint ladder) — adopt them into `:root` and demote
    `#5d98a2`/`#78c1c9` to category accents only.

  * Gold unification: standardize on `#c9a84c` (ornament) / `#d4b85c` (small text
    on dark) from `judicial-duty.html`; the landing's `#e2b75a` retires.
    Semantic color map: gold = the law, teal = the record, red = the verdict.

  * Progress 2026-07-17: `:root` in `shared/styles.css` now carries the landing
    values (`#15191a` / `#2b3233` backgrounds, `#dae4e5` text, `#2c5a61` accent
    plus new `--accent-hover` / `--accent-text`, tint-based `--border` /
    `--card-*`); `--gold` / `--gold-text` added and `#e2b75a` retired to
    `#d4b85c`. Remaining: one nav appearance and one button style shared by
    `index.html` and the shared pages.

* [ ] **P1-4 · Dossier identity system** (extends the timeline's FALSE-stamp language)
  * Folio numbers per section (e.g. `§ 04 — Contradictions`).

  * Exhibit IDs on documents/video/audio; black timecode pills (mono, tabular
    numerals) on WATCH VIDEO buttons.

  * Ruled annotation-style card headers instead of border-box cards.

  * Grayscale treatment on photographic evidence so the red stamp is the lone
    chromatic verdict; section accent colors from the existing category palette
    (`--cat-*`) as borders/active states per theme.

  * **Gold section-title rule** (adopted from `judicial-duty.html`, owner-approved):
    the `.section-title::after` pattern — 60px × 2px gradient underline
    `transparent → gold → transparent` — goes site-wide under page H1s and major
    section H2s only, never card titles (rarity is the mechanism). Add a
    left-aligned variant (`left: 0`, no translate) for the left-aligned title
    style in P1-1; the current implementation is centered-only. Draw it under
    Cormorant Garamond titles (see P1-1).

  * Touches `shared/styles.css` plus data-driven pages via their JSON sources
    (`timeline.json`, `contradictions.json`) — render + verify after editing.

  * Progress 2026-07-17: the gold section-title rule now ships site-wide —
    `.section-title` in `shared/styles.css` renders Cormorant titles with the
    60px gradient underline (centered default, `.is-left` variant added; pilot
    applied on `overview.html`). The old pill-badge title treatment is retired.
    Remaining: folio numbers, exhibit IDs / timecode pills, ruled card headers,
    grayscale evidence treatment.

* [ ] **P1-5 · Honor `prefers-reduced-motion`**
  * Gate the smoke-quote animation and any scroll/hover transitions behind
    `@media (prefers-reduced-motion: no-preference)` (index.html inline CSS and
    `shared/styles.css`).

* [ ] **P1-6 · Rename `contradictions\_grouped.html`** (owner note: the name does
  not work for that page)
  * The page has three conflicting identities: filename `contradictions\_grouped.html`,
    its own `<title>` says **"Catch All"**, and links to it say **"List of lies"**.
    Pick one name and make filename, title, and link text agree (candidate:
    `catch-all.html`, matching the page's own title — final name TBD by owner).

  * Only `documentspage.html` and `overview.html` link to it — update both
    (check whether the documentspage link lives in `documents/data/contradictions.json`;
    if so, edit the JSON, then render + verify).

  * Leave a meta-refresh stub at the old URL (same pattern as `editor.html` /
    `page-index.html` / `link-diagram.html` / `false-allegation-framework.html`)
    so old links keep working.

  * Rebuild `assets/search-index.json`, then stage + validate.

***

## P2 — Engineering hygiene

* [ ] **P2-1 · Media budget discipline**
  Artifact is \~828 MB against the 900 MB release budget (\~8% headroom). Route any
  new video through the existing transcode path (`VIDEO_TRANSCODES` in
  `tools/site_release.py`, `tools/optimize_raster_delivery.py`); masters live in
  `archive/evidence-masters/`, never raw adds to `video/`.

* [ ] **P2-2 · Monitor search-index growth**
  `assets/search-index.json` is \~660 KB (loaded on demand — acceptable today).
  Regenerate after content changes; if it passes \~1 MB, consider trimming fields
  or splitting per section.

* [ ] **P2-3 · Evaluate landing vendor-JS reduction**
  `index.html` defers \~720 KB of jQuery + Webflow runtime + GSAP + ScrollTrigger.
  Audit what's actually used; replace with vanilla JS where feasible. Low urgency —
  landing-only and deferred.

***

## Standing verification checklist (run per completed task)

* [ ] `python tools/site_release.py stage` + `validate` passes

* [ ] `python tools/audit_links.py` clean for touched pages

* [ ] `python tools/build_search_index.py` re-run if titles/sections/media changed

* [ ] JSON-driven pages re-rendered + `verify` passes (timeline / contradiction cards)

* [ ] Manual browse of every touched page
