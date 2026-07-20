(function () {
  const pageOrder = [
    { key: "overview", label: "Overview", href: "overview.html" },
    { key: "players", label: "Key Players", href: "players.html" },
    { key: "connections", label: "Connections Map", href: "connections.html" },
    { key: "timeline", label: "Timeline", href: "timeline.html" },
    { key: "evidence", label: "Evidence Record", href: "evidence.html" },
    { key: "misconduct", label: "Misconduct", href: "misconduct.html" },
    { key: "contradictions", label: "Contradictions", href: "contradictions.html" },
    { key: "scene", label: "Scene Reconstruction", href: "scene.html" },
    { key: "lies", label: "List of Lies", href: "general-videos.html" },
    { key: "mindmaps", label: "Mindmaps", href: "misconductandfailure.html" },
    { key: "documents", label: "Document Archive", href: "documentspage.html" },
    { key: "prosecutor", label: "Prosecutor Review", href: "prosecutor_allowed.html" },
    { key: "judicial-duty", label: "Judicial Duty", href: "judicial-duty.html" },
    { key: "system-paper", label: "Why Don't We Have This System?", href: "why-dont-we-have-this-system.html" },
    { key: "editor", label: "Record Editor", href: "overview.html#page-index" }
  ];

  const body = document.body;
  if (!body || !body.dataset.pageKey) return;

  const title = body.dataset.title || "";
  const dek = body.dataset.dek || "";
  const rawTarget = body.dataset.target || "";
  const target = rawTarget;
  const frameTarget = target
    ? `${target}${target.includes("?") ? "&" : "?"}v=20260403d`
    : target;
  const pageKey = body.dataset.pageKey || "";

  const titleNode = document.getElementById("pageTitle");
  const dekNode = document.getElementById("pageDek");
  const frame = document.getElementById("legacyFrame");
  const nav = document.getElementById("pageNav");
  const openOriginal = document.getElementById("openOriginal");
  const toolbarLabel = document.getElementById("toolbarLabel");

  if (titleNode) titleNode.textContent = title;
  if (dekNode) dekNode.textContent = dek;
  if (frame) frame.src = frameTarget;
  
  if (toolbarLabel) toolbarLabel.textContent = target.replace("legacy/", "");
  document.title = title + " | An Edifice of Lies";

  const eyebrow = document.querySelector(".sidebar-card .eyebrow");
  const secondaryButton = document.querySelector(".button-secondary");
  const sectionLabel = document.querySelector(".section-label");
  const toolbarStrong = document.querySelector(".frame-toolbar strong");
  const chipLinks = document.querySelectorAll(".chip-link");

  if (eyebrow) eyebrow.textContent = "Case file";
  
  if (secondaryButton) secondaryButton.textContent = "Back to section index";
  if (sectionLabel) sectionLabel.textContent = "Project map";
  if (toolbarStrong) toolbarStrong.textContent = "Source page";
  if (chipLinks[0]) {
    chipLinks[0].textContent = "Case landing page";
    chipLinks[0].setAttribute("href", "index.html");
  }
  if (chipLinks[1]) chipLinks[1].textContent = "Confidential tip email";
  if (toolbarLabel) toolbarLabel.textContent = "pages/" + target;

  if (nav) {
    nav.innerHTML = pageOrder.map((page) => {
      const active = page.key === pageKey ? "nav-item active" : "nav-item";
      return `<a class="${active}" href="${page.href}">${page.label}</a>`;
    }).join("");
  }

  if (frame) {
    frame.addEventListener("load", () => {
      try {
        const doc = frame.contentDocument;
        if (!doc) return;

        const style = doc.createElement("style");
        style.textContent = `
          html, body {
            background: transparent !important;
          }
          body {
            color: #f5f7f7 !important;
            margin: 0 !important;
          }
          .nav,
          .nav-tabs,
          .header,
          .carousel-nav-wrapper,
          .page-rail,
          #floating-image,
          #floating-image-mindmaps,
          .w-webflow-badge,
          [data-brand-name="true"] {
            display: none !important;
          }
          .container,
          .page {
            max-width: none !important;
            width: 100% !important;
            padding: 18px !important;
            margin: 0 !important;
          }
          .content-section:first-of-type,
          .section:first-of-type {
            margin-top: 0 !important;
          }
        `;
        doc.head.appendChild(style);
      } catch (error) {
        // Same-origin pages should allow styling; silently skip if not.
      }
    });
  }
})();
