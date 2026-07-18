(() => {
  const currentPath = window.location.pathname;
  const siteRoot = /\/(?:content|network_analysis)\//.test(currentPath) ? "../" : "./";
  const indexUrl = new URL(`${siteRoot}assets/search-index.json`, window.location.href).href;
  const cssUrl = new URL(`${siteRoot}shared/site-search.css`, window.location.href).href;

  function addSupplementalNavigation() {
    const nav = document.querySelector(".nav-tabs[aria-label='Project navigation']");
    if (!nav || nav.querySelector(".nav-dropdown")) return;
    const pages = [
      ["connections.html", "Connections"],
      ["catch-all.html", "Catch All"],
      ["data-snapshot.html", "Data Snapshot"],
      ["judicial-duty.html", "Judicial Duty"],
      ["prosecutor_allowed.html", "Prosecutor Conduct"],
      ["scene.html", "Scene Analysis"],
      ["why-dont-we-have-this-system.html", "System Essay"]
    ];
    const dropdown = document.createElement("div");
    dropdown.className = "nav-dropdown";
    dropdown.innerHTML = `<button class="nav-tab nav-dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">More pages</button><div class="nav-dropdown-menu" role="menu">${pages.map(([href, label]) => `<a role="menuitem" href="${href}">${label}</a>`).join("")}</div>`;
    const button = dropdown.querySelector("button");
    button.addEventListener("click", () => {
      const open = dropdown.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });
    nav.appendChild(dropdown);
  }

  addSupplementalNavigation();

  if (!document.querySelector(`link[data-site-search-css]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;
    link.dataset.siteSearchCss = "true";
    document.head.appendChild(link);
  }

  let indexPayload = null;
  let loadPromise = null;
  let activeFilter = "all";

  const overlay = document.createElement("div");
  overlay.className = "site-search-overlay";
  overlay.innerHTML = `
    <div class="site-search-panel" role="dialog" aria-modal="true" aria-label="Search the project">
      <div class="site-search-header">
        <label class="site-search-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0a7 7 0 0114 0z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <input type="search" placeholder="Search every page, document, PDF, and linked file..." autocomplete="off" spellcheck="false" />
        </label>
        <button type="button" class="site-search-close" aria-label="Close search">Close</button>
      </div>
      <div class="site-search-toolbar">
        <div class="site-search-filters">
          <button class="site-search-filter is-active" data-filter="all" type="button">All</button>
          <button class="site-search-filter" data-filter="page" type="button">Pages</button>
          <button class="site-search-filter" data-filter="pdf" type="button">PDFs</button>
          <button class="site-search-filter" data-filter="document" type="button">Docs</button>
          <button class="site-search-filter" data-filter="media" type="button">Media</button>
          <button class="site-search-filter" data-filter="image" type="button">Images</button>
        </div>
        <div class="site-search-meta">Press Ctrl/Cmd+K to search</div>
      </div>
      <div class="site-search-results">
        <div class="site-search-empty">Start typing to search the full project.</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "site-search-launcher";
  launcher.innerHTML = `<strong>Search Project</strong><span>Ctrl/Cmd+K</span>`;
  document.body.appendChild(launcher);

  const input = overlay.querySelector("input");
  const closeButton = overlay.querySelector(".site-search-close");
  const resultsNode = overlay.querySelector(".site-search-results");
  const metaNode = overlay.querySelector(".site-search-meta");
  const filterButtons = [...overlay.querySelectorAll(".site-search-filter")];

  function openSearch() {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    ensureIndexLoaded().then(() => {
      input.focus();
      runSearch(input.value);
    });
  }

  function closeSearch() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  launcher.addEventListener("click", openSearch);
  closeButton.addEventListener("click", closeSearch);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeSearch();
  });

  document.addEventListener("keydown", (event) => {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (isShortcut) {
      event.preventDefault();
      if (overlay.classList.contains("is-open")) closeSearch();
      else openSearch();
      return;
    }
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeSearch();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      runSearch(input.value);
    });
  });

  input.addEventListener("input", () => runSearch(input.value));

  async function ensureIndexLoaded() {
    if (indexPayload) return indexPayload;
    if (!loadPromise) {
      metaNode.textContent = "Loading search index...";
      loadPromise = fetch(indexUrl, { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => {
          indexPayload = data;
          metaNode.textContent = `${data.recordCount.toLocaleString()} indexed sections from ${data.indexedFileCount.toLocaleString()} files`;
          return data;
        })
        .catch((error) => {
          metaNode.textContent = "Search index failed to load";
          resultsNode.innerHTML = `<div class="site-search-empty">Search index failed to load: ${escapeHtml(error.message || String(error))}</div>`;
          throw error;
        });
    }
    return loadPromise;
  }

  function normalize(value) {
    return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function tokenize(value) {
    return normalize(value).split(/\s+/).filter(Boolean);
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  }

  function fuzzyTokenScore(queryToken, candidateText) {
    const words = candidateText.split(/\s+/).slice(0, 120);
    let best = 0;
    for (const word of words) {
      if (!word) continue;
      if (word === queryToken) return 1;
      if (word.startsWith(queryToken) || queryToken.startsWith(word)) {
        best = Math.max(best, 0.82);
        continue;
      }
      const distance = levenshtein(queryToken, word);
      const maxLen = Math.max(queryToken.length, word.length);
      if (maxLen > 2 && distance <= 2) {
        best = Math.max(best, 1 - distance / maxLen);
      }
    }
    return best;
  }

  function scoreRecord(record, query, queryTokens) {
    const text = normalize(`${record.title} ${record.section} ${record.keywords.join(" ")} ${record.text}`);
    if (!text) return 0;

    let score = 0;
    if (query && text.includes(query)) score += 80;

    for (const token of queryTokens) {
      if (record.title && normalize(record.title).includes(token)) score += 24;
      if (record.section && normalize(record.section).includes(token)) score += 16;
      if (normalize(record.keywords.join(" ")).includes(token)) score += 12;
      if (text.includes(` ${token} `) || text.startsWith(token) || text.endsWith(token)) {
        score += 10;
        continue;
      }
      if (text.includes(token)) {
        score += 6;
        continue;
      }
      score += Math.round(fuzzyTokenScore(token, text) * 5);
    }

    if (record.kind === "page") score += 3;
    return score;
  }

  function snippetFor(record, queryTokens) {
    const source = record.text || `${record.title} ${record.section}`;
    if (!source) return "";
    const lower = source.toLowerCase();
    let start = 0;
    for (const token of queryTokens) {
      const index = lower.indexOf(token.toLowerCase());
      if (index >= 0) {
        start = Math.max(0, index - 90);
        break;
      }
    }
    const raw = source.slice(start, start + 240).trim();
    return raw.length < source.length ? `${raw}...` : raw;
  }

  function highlightSnippet(snippet, queryTokens) {
    let html = escapeHtml(snippet);
    queryTokens
      .slice()
      .sort((a, b) => b.length - a.length)
      .forEach((token) => {
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        html = html.replace(new RegExp(`(${escaped})`, "ig"), "<mark>$1</mark>");
      });
    return html;
  }

  function buildResultHref(record, rawQuery) {
    const destination = new URL(`${siteRoot}${record.path}`, window.location.href);
    destination.searchParams.set("searchText", rawQuery);
    if (record.anchor) destination.hash = record.anchor;
    return destination.href;
  }

  function renderResults(results, rawQuery, queryTokens) {
    if (!rawQuery.trim()) {
      resultsNode.innerHTML = `<div class="site-search-empty">Start typing to search the full project.</div>`;
      return;
    }
    if (!results.length) {
      resultsNode.innerHTML = `<div class="site-search-empty">No results for <strong>${escapeHtml(rawQuery)}</strong>.</div>`;
      return;
    }
    resultsNode.innerHTML = results
      .map((result) => {
        const snippet = snippetFor(result.record, queryTokens);
        return `
          <a class="site-search-result" href="${escapeHtml(buildResultHref(result.record, rawQuery))}">
            <div class="site-search-result-top">
              <span class="site-search-badge">${escapeHtml(result.record.kind)}</span>
              <span class="site-search-title">${escapeHtml(result.record.title)}</span>
              <span class="site-search-path">${escapeHtml(result.record.path)}</span>
            </div>
            <div class="site-search-section">${escapeHtml(result.record.section || "")}</div>
            <div class="site-search-snippet">${highlightSnippet(snippet, queryTokens)}</div>
          </a>
        `;
      })
      .join("");
  }

  async function runSearch(rawQuery) {
    const payload = await ensureIndexLoaded();
    const query = normalize(rawQuery);
    const queryTokens = tokenize(rawQuery);
    if (!queryTokens.length) {
      renderResults([], rawQuery, queryTokens);
      return;
    }
    const results = payload.records
      .filter((record) => activeFilter === "all" || record.kind === activeFilter)
      .map((record) => ({ record, score: scoreRecord(record, query, queryTokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 60);
    metaNode.textContent = `${results.length} result${results.length === 1 ? "" : "s"} for "${rawQuery}"`;
    renderResults(results, rawQuery, queryTokens);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function highlightSearchHit() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("searchText");
    if (!query) return;
    const queryTokens = tokenize(query);
    if (!queryTokens.length) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue;
      const lower = text.toLowerCase();
      const token = queryTokens.find((item) => lower.includes(item));
      if (!token) continue;
      const index = lower.indexOf(token);
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + token.length);
      const mark = document.createElement("mark");
      mark.className = "site-search-hit";
      range.surroundContents(mark);
      setTimeout(() => {
        mark.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      break;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", highlightSearchHit, { once: true });
  } else {
    highlightSearchHit();
  }
})();
