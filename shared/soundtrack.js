(() => {
  const button = document.querySelector("[data-soundtrack-mount]");
  if (!button) return;

  const currentPath = window.location.pathname;
  const isCanonicalSource = /\/assets\/pages\/[^/]+\.html$/i.test(currentPath);
  const siteRoot = isCanonicalSource
    ? "../../"
    : /\/(?:content|network_analysis)\//.test(currentPath) ? "../" : "./";
  const src = new URL(
    `${siteRoot}audio/Podcast/${encodeURIComponent("Welcome_to_Under_Color_of_Law_(1).mp3")}`,
    window.location.href
  ).href;

  const preferenceKey = "edifice-soundtrack";
  const timeKey = "edifice-soundtrack-time";
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "none";

  const style = document.createElement("style");
  style.textContent = "[data-soundtrack-mount]{min-width:9.6em}.nav-tool.is-on{color:#111415;background:#d4b85c;border-color:#d4b85c}";
  document.head.appendChild(style);

  let want = localStorage.getItem(preferenceKey) !== "off";
  const savedTime = Number(sessionStorage.getItem(timeKey));
  let starting = false;

  const paint = () => {
    const on = starting || !audio.paused || audio.dataset.ducked === "1";
    button.setAttribute("aria-pressed", String(on));
    button.setAttribute("aria-label", on ? "Pause the soundtrack" : "Play the soundtrack");
    button.textContent = on ? "Soundtrack on" : "Soundtrack";
    button.classList.toggle("is-on", on);
  };

  const rememberTime = () => {
    if (Number.isFinite(audio.currentTime) && audio.currentTime >= 0.25) {
      sessionStorage.setItem(timeKey, String(audio.currentTime));
    }
  };

  const seekToSaved = () => {
    if (!Number.isFinite(savedTime) || savedTime <= 0) return;
    const seek = () => {
      if (Number.isFinite(audio.duration) && savedTime < audio.duration && audio.currentTime < 0.25) {
        audio.currentTime = savedTime;
      }
    };
    if (audio.readyState >= 1) seek();
    else audio.addEventListener("loadedmetadata", seek, { once: true });
  };

  const start = () => {
    want = true;
    starting = true;
    localStorage.setItem(preferenceKey, "on");
    delete audio.dataset.ducked;
    document.querySelectorAll("audio, video").forEach((element) => {
      if (!element.paused) element.pause();
    });
    seekToSaved();
    const pending = audio.play();
    paint();
    if (pending) {
      pending.then(() => {
        starting = false;
        paint();
      }).catch(() => {
        starting = false;
        paint();
      });
    } else {
      starting = false;
      paint();
    }
  };

  const stop = () => {
    want = false;
    starting = false;
    rememberTime();
    localStorage.setItem(preferenceKey, "off");
    delete audio.dataset.ducked;
    audio.pause();
    paint();
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!audio.paused || audio.dataset.ducked === "1") stop();
    else start();
  });

  audio.addEventListener("play", () => {
    starting = false;
    paint();
  });
  audio.addEventListener("pause", () => {
    if (audio.dataset.ducked !== "1") starting = false;
    paint();
  });
  let lastSave = 0;
  audio.addEventListener("timeupdate", () => {
    const now = Date.now();
    if (now - lastSave < 1000) return;
    lastSave = now;
    rememberTime();
  });
  window.addEventListener("pagehide", rememberTime);

  // Media takes priority; the soundtrack stays off until explicitly enabled.
  document.addEventListener("play", (event) => {
    if (event.target instanceof HTMLMediaElement) stop();
  }, true);
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || button.contains(target)) return;
    const link = target.closest("a[href], [data-href]");
    const destination = link?.getAttribute("href") || link?.getAttribute("data-href") || "";
    if (target.closest("audio, video") || /\.(mp3|mp4|m4a|wav|ogg|webm|mov|mkv)(?:[?#]|$)/i.test(destination)) stop();
  }, true);
  window.addEventListener("storage", (event) => {
    if (event.key === preferenceKey && event.newValue === "off") stop();
  });

  if (want) {
    seekToSaved();
    const pending = audio.play();
    const armGesture = () => {
      const resume = (event) => {
        if (button.contains(event.target) || !want) return;
        audio.play().then(paint).catch(() => {});
      };
      document.addEventListener("pointerdown", resume, { capture: true, once: true });
      document.addEventListener("keydown", resume, { capture: true, once: true });
    };
    if (pending) pending.then(paint).catch(armGesture);
    else armGesture();
  }
  paint();
})();
