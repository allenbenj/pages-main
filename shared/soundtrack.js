(() => {
  const button = document.querySelector("[data-soundtrack-mount]");
  if (!button) return;

  const currentPath = window.location.pathname;
  const isCanonicalSource = /\/assets\/pages\/[^/]+\.html$/i.test(currentPath);
  const siteRoot = isCanonicalSource
    ? "../../"
    : /\/(?:content|network_analysis)\//.test(currentPath) ? "../" : "./";
  const resolveAudio = (folder, file) =>
    new URL(`${siteRoot}${folder}${encodeURIComponent(file)}`, window.location.href).href;

  // Playback queue: the opening soundtrack, then the three songs from the main
  // page, then the Part 3 podcast. Playback stops when the queue runs out.
  const playlist = [
    {
      label: "Welcome to Under Color of Law",
      src: resolveAudio("audio/Podcast/", "Welcome_to_Under_Color_of_Law_(1).mp3"),
    },
    {
      label: "Lee County Legalized Gangsters",
      src: resolveAudio("audio/Music/", "Lee County Legalized Gangsters.mp3"),
    },
    { label: "I Won't Sign", src: resolveAudio("audio/Music/", "I Won't Sign.mp3") },
    { label: "Who Pays The Price?", src: resolveAudio("audio/Music/", "Who Pays The Price_.mp3") },
    {
      label: "Lies, Licentiousness, Lee County - Part 3",
      src: resolveAudio(
        "audio/Podcast/",
        "Lies,_Licentiousness,_Lee_County-_Part_3_-_Sheriff's_Office_Leads,_Sheriff's_Office_Lies_What.mp3"
      ),
    },
  ];

  const preferenceKey = "edifice-soundtrack";
  const timeKey = "edifice-soundtrack-time";
  const audio = new Audio();
  audio.preload = "none";
  let trackIndex = 0;
  let advancing = false;

  const style = document.createElement("style");
  style.textContent = `
    [data-soundtrack-mount]{min-width:10.5em}
    .nav-tool.is-on{color:#111415 !important;background:#d4b85c !important;border-color:#d4b85c !important;font-weight:700}

    /* Floating music pause/play pill for the entire page */
    .soundtrack-floating-bar {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1050;
      display: flex;
      align-items: center;
      pointer-events: auto;
    }

    .soundtrack-floating-btn {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 10px 18px;
      background: rgba(17, 20, 22, 0.94);
      color: #dae4e5;
      border: 1px solid rgba(166, 206, 210, 0.28);
      border-radius: 999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0,0,0,0.3);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      cursor: pointer;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 0.76rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      user-select: none;
    }

    .soundtrack-floating-btn:hover {
      background: rgba(28, 36, 40, 0.98);
      border-color: rgba(166, 206, 210, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
    }

    .soundtrack-floating-btn.is-playing {
      border-color: rgba(212, 184, 92, 0.45);
      color: #ffffff;
      background: rgba(22, 28, 30, 0.96);
    }

    .soundtrack-floating-btn.is-paused {
      opacity: 0.85;
      border-color: rgba(166, 206, 210, 0.22);
    }

    .soundtrack-pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #64748b;
      transition: background 0.25s ease, box-shadow 0.25s ease;
      flex-shrink: 0;
    }

    .soundtrack-floating-btn.is-playing .soundtrack-pulse-dot {
      background: #d4b85c;
      box-shadow: 0 0 10px rgba(212, 184, 92, 0.85);
      animation: soundtrackPulse 1.8s infinite ease-in-out;
    }

    @keyframes soundtrackPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.35); opacity: 0.55; }
    }

    .soundtrack-btn-icon {
      font-size: 0.85rem;
      line-height: 1;
    }

    @media (max-width: 640px) {
      .soundtrack-floating-bar {
        bottom: 16px;
        right: 16px;
      }
      .soundtrack-floating-btn {
        padding: 8px 14px;
        font-size: 0.72rem;
      }
    }
  `;
  document.head.appendChild(style);

  let want = localStorage.getItem(preferenceKey) !== "off";
  const readSaved = () => {
    const empty = { track: 0, time: 0 };
    const raw = sessionStorage.getItem(timeKey);
    if (!raw) return empty;
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      parsed = null;
    }
    if (parsed && typeof parsed === "object") {
      const track = Number(parsed.track);
      const time = Number(parsed.time);
      if (Number.isInteger(track) && track >= 0 && track < playlist.length && Number.isFinite(time) && time > 0) {
        return { track, time };
      }
      return empty;
    }
    // Legacy sessions stored a bare opening-track position in seconds.
    const time = Number(raw);
    return Number.isFinite(time) && time > 0 ? { track: 0, time } : empty;
  };
  const saved = readSaved();
  let starting = false;
  let floatingBtn = null;

  const paint = () => {
    const on = starting || !audio.paused || audio.dataset.ducked === "1";
    // Top nav button
    button.setAttribute("aria-pressed", String(on));
    button.setAttribute("aria-label", on ? "Pause the soundtrack" : "Play the soundtrack");
    button.textContent = on ? "⏸ Pause Soundtrack" : "▶ Soundtrack";
    button.classList.toggle("is-on", on);

    // Floating button
    if (floatingBtn) {
      floatingBtn.setAttribute("aria-pressed", String(on));
      floatingBtn.setAttribute("aria-label", on ? "Pause soundtrack for page" : "Play soundtrack for page");
      floatingBtn.classList.toggle("is-playing", on);
      floatingBtn.classList.toggle("is-paused", !on);
      const iconSpan = floatingBtn.querySelector(".soundtrack-btn-icon");
      const textSpan = floatingBtn.querySelector(".soundtrack-btn-text");
      if (iconSpan) iconSpan.textContent = on ? "⏸" : "▶";
      if (textSpan) textSpan.textContent = on ? "Pause Music" : "Play Music";
    }
  };

  const rememberTime = () => {
    if (advancing) return;
    if (Number.isFinite(audio.currentTime) && audio.currentTime >= 0.25) {
      sessionStorage.setItem(timeKey, JSON.stringify({ track: trackIndex, time: audio.currentTime }));
    }
  };

  const loadTrack = (index, time) => {
    trackIndex = Math.min(Math.max(index, 0), playlist.length - 1);
    const track = playlist[trackIndex];
    audio.src = track.src;
    button.title = track.label;
    if (floatingBtn) floatingBtn.title = track.label;
    if (!(time > 0)) return;
    const seek = () => {
      if (Number.isFinite(audio.duration) && time < audio.duration) audio.currentTime = time;
    };
    if (audio.readyState >= 1) seek();
    else audio.addEventListener("loadedmetadata", seek, { once: true });
  };

  const playAudio = () => {
    starting = true;
    paint();
    const pending = audio.play();
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

  const start = () => {
    want = true;
    localStorage.setItem(preferenceKey, "on");
    delete audio.dataset.ducked;
    document.querySelectorAll("audio, video").forEach((element) => {
      if (!element.paused) element.pause();
    });
    if (!audio.src) loadTrack(saved.track, saved.time);
    playAudio();
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

  const toggleSoundtrack = (event) => {
    if (event) event.stopPropagation();
    if (!audio.paused || audio.dataset.ducked === "1") stop();
    else start();
  };

  button.addEventListener("click", toggleSoundtrack);

  const initFloatingBar = () => {
    if (document.getElementById("soundtrackFloatingBar")) return;
    const bar = document.createElement("div");
    bar.className = "soundtrack-floating-bar";
    bar.id = "soundtrackFloatingBar";
    bar.innerHTML = `
      <button type="button" class="soundtrack-floating-btn is-paused" id="soundtrackFloatingBtn" aria-label="Pause soundtrack for page">
        <span class="soundtrack-pulse-dot" aria-hidden="true"></span>
        <span class="soundtrack-btn-icon" aria-hidden="true">▶</span>
        <span class="soundtrack-btn-text">Play Music</span>
      </button>
    `;
    document.body.appendChild(bar);
    floatingBtn = bar.querySelector("#soundtrackFloatingBtn");
    if (floatingBtn) {
      floatingBtn.addEventListener("click", toggleSoundtrack);
    }
    paint();
  };

  if (document.body) {
    initFloatingBar();
  } else {
    document.addEventListener("DOMContentLoaded", initFloatingBar);
  }

  audio.addEventListener("play", () => {
    starting = false;
    paint();
  });
  audio.addEventListener("pause", () => {
    if (audio.dataset.ducked !== "1") starting = false;
    paint();
  });
  audio.addEventListener("ended", () => {
    if (!want) return;
    advancing = true;
    sessionStorage.removeItem(timeKey);
    if (trackIndex + 1 < playlist.length) {
      loadTrack(trackIndex + 1, 0);
      advancing = false;
      playAudio();
      return;
    }
    // End of the queue: stay silent until the visitor starts it again.
    stop();
    loadTrack(0, 0);
    advancing = false;
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
  // Muted playback carries no audio, so silent exhibit loops (such as an
  // autoplaying visual motif) leave the soundtrack running.
  document.addEventListener("play", (event) => {
    const element = event.target;
    if (element instanceof HTMLMediaElement && element !== audio && !element.muted) stop();
  }, true);
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || button.contains(target) || (floatingBtn && floatingBtn.contains(target))) return;
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
        if (button.contains(event.target) || (floatingBtn && floatingBtn.contains(event.target)) || !want) return;
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
