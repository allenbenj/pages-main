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

  const paint = () => {
    const on = starting || !audio.paused || audio.dataset.ducked === "1";
    button.setAttribute("aria-pressed", String(on));
    button.setAttribute("aria-label", on ? "Pause the soundtrack" : "Play the soundtrack");
    button.textContent = on ? "⏸ Pause Soundtrack" : "▶ Soundtrack";
    button.classList.toggle("is-on", on);
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
    if (!target || button.contains(target)) return;
    const link = target.closest("a[href], [data-href]");
    const destination = link?.getAttribute("href") || link?.getAttribute("data-href") || "";
    if (target.closest("audio, video") || /\.(mp3|mp4|m4a|wav|ogg|webm|mov|mkv)(?:[?#]|$)/i.test(destination)) stop();
  }, true);
  window.addEventListener("storage", (event) => {
    if (event.key === preferenceKey && event.newValue === "off") stop();
  });

  if (want) {
    loadTrack(saved.track, saved.time);
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
