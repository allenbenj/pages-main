(() => {
  const currentPath = window.location.pathname;
  const isDirectFile = window.location.protocol === "file:";
  const isCanonicalSource = /\/assets\/pages\/[^/]+\.html$/i.test(currentPath);
  const siteRoot = isCanonicalSource
    ? "../../"
    : /\/(?:content|network_analysis)\//.test(currentPath) ? "../" : "./";
  const indexUrl = new URL(`${siteRoot}assets/search-index.json`, window.location.href).href;
  const cssUrl = new URL(`${siteRoot}shared/reader-search.css`, window.location.href).href;

  function normalizeDirectFilePageLinks() {
    if (!isDirectFile) return;
    document.querySelectorAll("a[href]").forEach((link) => {
      const rawHref = link.getAttribute("href") || "";
      const match = rawHref.match(/^([^/?#]+\.html)([?#].*)?$/i);
      if (!match || match[1].toLowerCase() === "index.html") return;
      const prefix = isCanonicalSource ? "assets/pages/" : "assets/pages/";
      link.setAttribute("href", `${prefix}${match[1]}${match[2] || ""}`);
    });
  }

  normalizeDirectFilePageLinks();

  function initializeNavigation() {
    const nav = document.querySelector(".nav-tabs[aria-label='Project navigation']");
    if (!nav) return;

    const dropdowns = [...nav.querySelectorAll(".nav-dropdown")];
    const closeDropdown = (dropdown) => {
      dropdown.classList.remove("is-open");
      dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
    };

    dropdowns.forEach((dropdown) => {
      const button = dropdown.querySelector(".nav-dropdown-toggle");
      if (!button) return;

      button.addEventListener("click", () => {
        const willOpen = !dropdown.classList.contains("is-open");
        dropdowns.forEach(closeDropdown);
        dropdown.classList.toggle("is-open", willOpen);
        button.setAttribute("aria-expanded", String(willOpen));
      });

      button.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeDropdown(dropdown);
          button.focus();
        }
      });

      dropdown.querySelectorAll("a").forEach((link) => {
        link.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            closeDropdown(dropdown);
            button.focus();
          }
        });
      });
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) dropdowns.forEach(closeDropdown);
    });
  }

  initializeNavigation();

  function preparePageRail() {
    const rail = document.querySelector(".page-rail");
    if (!rail || rail.querySelector(".page-rail-details")) return;
    const details = document.createElement("details");
    details.className = "page-rail-details";
    const summary = document.createElement("summary");
    summary.textContent = "On this page";
    const title = rail.querySelector(".page-rail-title");
    if (title) title.hidden = true;
    details.append(summary, ...rail.childNodes);
    rail.append(details);
    const wide = window.matchMedia("(min-width: 1301px)");
    const syncRail = () => { details.open = wide.matches; };
    syncRail();
    wide.addEventListener("change", syncRail);

    const placeHashTarget = () => {
      if (!location.hash || location.hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!target) return;
      const railBottom = rail.getBoundingClientRect().bottom;
      const top = target.getBoundingClientRect().top;
      if (top < railBottom + 16) {
        window.scrollTo(0, Math.max(0, window.scrollY + top - railBottom - 16));
      }
    };
    requestAnimationFrame(placeHashTarget);
    window.addEventListener("hashchange", () => requestAnimationFrame(placeHashTarget));
  }

  preparePageRail();

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
  overlay.inert = true;
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="site-search-panel" role="dialog" aria-modal="true" aria-label="Search the project">
      <div class="site-search-header">
        <label class="site-search-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0a7 7 0 0114 0z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <input type="search" aria-label="Search the project" placeholder="Search pages, documents, and media..." autocomplete="off" spellcheck="false" />
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
        <div class="site-search-meta" role="status" aria-live="polite">Press Ctrl/Cmd+K to search</div>
      </div>
      <div class="site-search-results">
        <div class="site-search-empty">Start typing to search the full project.</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const searchMount = document.querySelector("[data-site-search-mount]");
  const launcher = searchMount || document.createElement("button");
  launcher.type = "button";
  launcher.classList.add("site-search-launcher");
  launcher.innerHTML = searchMount
    ? `<strong>Search</strong><span>Ctrl/Cmd+K</span>`
    : `<strong>Search Project</strong><span>Ctrl/Cmd+K</span>`;
  if (searchMount) launcher.classList.add("is-inline");
  else document.body.appendChild(launcher);

  const input = overlay.querySelector("input");
  const closeButton = overlay.querySelector(".site-search-close");
  const resultsNode = overlay.querySelector(".site-search-results");
  const metaNode = overlay.querySelector(".site-search-meta");
  const filterButtons = [...overlay.querySelectorAll(".site-search-filter")];
  filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.classList.contains("is-active"))));
  let previousFocus = null;
  let previousOverflow = "";
  let backgroundElements = [];
  let searchVersion = 0;
  let searchTimer = null;

  function openSearch() {
    if (overlay.classList.contains("is-open")) return;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    overlay.inert = false;
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-open");
    backgroundElements = [...document.body.children]
      .filter((element) => element !== overlay && element instanceof HTMLElement)
      .map((element) => [element, element.inert]);
    backgroundElements.forEach(([element]) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    input.focus();
    runSearch(input.value);
  }

  function closeSearch() {
    overlay.classList.remove("is-open");
    overlay.inert = true;
    overlay.setAttribute("aria-hidden", "true");
    backgroundElements.forEach(([element, wasInert]) => { element.inert = wasInert; });
    backgroundElements = [];
    document.body.style.overflow = previousOverflow;
    previousFocus?.focus();
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
    if (event.key === "Tab" && overlay.classList.contains("is-open")) {
      const focusable = [...overlay.querySelectorAll('input, button, a[href]')]
        .filter((element) => !element.disabled && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      runSearch(input.value);
    });
  });

  input.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => runSearch(input.value), 160);
  });
  resultsNode.addEventListener("click", (event) => {
    if (event.target.closest('.site-search-retry')) {
      input.focus();
      runSearch(input.value);
    }
  });

  async function ensureIndexLoaded() {
    if (indexPayload) return indexPayload;
    if (!loadPromise) {
      metaNode.textContent = "Loading search index...";
      loadPromise = fetch(indexUrl, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((data) => {
          indexPayload = data;
          metaNode.textContent = `${data.recordCount.toLocaleString()} indexed sections from ${data.indexedFileCount.toLocaleString()} files`;
          return data;
        })
        .catch((error) => {
          loadPromise = null;
          metaNode.textContent = "Search index failed to load";
          resultsNode.innerHTML = `<div class="site-search-empty">Search is temporarily unavailable. <button type="button" class="site-search-close site-search-retry">Try again</button></div>`;
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

    if (score > 0 && record.kind === "page") score += 3;
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
    const isRootPage = /^[^/]+\.html$/i.test(record.path);
    const directFilePath = isDirectFile && isRootPage && record.path.toLowerCase() !== "index.html"
      ? `${siteRoot}assets/pages/${record.path}`
      : `${siteRoot}${record.path}`;
    const destination = new URL(directFilePath, window.location.href);
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
    const version = ++searchVersion;
    let payload;
    try { payload = await ensureIndexLoaded(); }
    catch { return; }
    if (version !== searchVersion) return;
    const query = normalize(rawQuery);
    const queryTokens = tokenize(rawQuery);
    if (!queryTokens.length) {
      metaNode.textContent = `${payload.recordCount.toLocaleString()} indexed sections from ${payload.indexedFileCount.toLocaleString()} files`;
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
