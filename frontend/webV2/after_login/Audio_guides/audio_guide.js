(() => {
  const audioGuides = [
    {
      id: 1,
      title: "History of Buenos Aires",
      category: "history",
      location: "Buenos Aires",
      duration: "12 min",
      image: "http://static.photos/cityscape/640x360/1",
      description: "Explore the rich history of Argentina's capital city",
      guide: "Prof. Carlos Mendez",
      rating: 4.7,
      reviews: 189,
      completed: 45,
      audioFile: "AudioGuides/Adam_Obelisco.mp3",
    },
    {
      id: 2,
      title: "Argentine Asado Masterclass",
      category: "food",
      location: "Countrywide",
      duration: "18 min",
      image: "http://static.photos/food/640x360/2",
      description: "Learn the secrets of authentic Argentine barbecue",
      guide: "Chef Sofia Ramirez",
      rating: 4.9,
      reviews: 234,
      completed: 32,
    },
    {
      id: 3,
      title: "Patagonia Wildlife Guide",
      category: "nature",
      location: "Patagonia",
      duration: "22 min",
      image: "http://static.photos/nature/640x360/3",
      description: "Discover the unique wildlife of southern Argentina",
      guide: "Biologist Ana Torres",
      rating: 4.8,
      reviews: 167,
      completed: 28,
      audioFile: "AudioGuides/Monica_CerroCatedral.mp3",
    },
    {
      id: 4,
      title: "Tango Culture & History",
      category: "culture",
      location: "Buenos Aires",
      duration: "15 min",
      image: "http://static.photos/people/640x360/4",
      description: "The story behind Argentina's iconic dance",
      guide: "Dancer Miguel Fernandez",
      rating: 4.6,
      reviews: 198,
      completed: 51,
      audioFile: "AudioGuides/Mark_TeatroColon.mp3",
    },
    {
      id: 5,
      title: "Mendoza Wine Region",
      category: "food",
      location: "Mendoza",
      duration: "20 min",
      image: "http://static.photos/travel/640x360/5",
      description: "Explore Argentina's famous wine country",
      guide: "Sommelier Lucia Gonzalez",
      rating: 4.9,
      reviews: 156,
      completed: 23,
    },
    {
      id: 6,
      title: "Salta's Colonial Architecture",
      category: "history",
      location: "Salta",
      duration: "14 min",
      image: "http://static.photos/architecture/640x360/6",
      description: "Walking tour through colonial Salta",
      guide: "Architect Jorge Silva",
      rating: 4.5,
      reviews: 123,
      completed: 19,
    },
    {
      id: 7,
      title: "Andean Culture & Traditions",
      category: "culture",
      location: "Northwest Argentina",
      duration: "25 min",
      image: "http://static.photos/travel/640x360/7",
      description: "Indigenous cultures of the Andes mountains",
      guide: "Anthropologist Elena Morales",
      rating: 4.7,
      reviews: 145,
      completed: 31,
    },
    {
      id: 8,
      title: "Buenos Aires Street Art",
      category: "culture",
      location: "Buenos Aires",
      duration: "16 min",
      image: "http://static.photos/art/640x360/8",
      description: "Urban art scene in Palermo and San Telmo",
      guide: "Artist Pablo Rojas",
      rating: 4.8,
      reviews: 178,
      completed: 42,
    },
    {
      id: 9,
      title: "Iguazu Falls Legends",
      category: "nature",
      location: "Misiones",
      duration: "19 min",
      image: "http://static.photos/nature/640x360/9",
      description: "Indigenous legends of the mighty waterfalls",
      guide: "Storyteller Isabel Vargas",
      rating: 4.9,
      reviews: 201,
      completed: 37,
    },
  ];

  const featuredGuide = {
    id: 1001,
    title: "Iguazu Falls: Nature's Symphony",
    category: "nature",
    location: "Misiones Province",
    duration: "24 min",
    image: "http://static.photos/nature/640x360/1",
    guide: "Dr. Maria Lopez",
    audioFile: "AudioGuides/Serafina_CataratasIguazu.mp3",
  };

  const resolveApiBaseUrl = () => {
    const candidate =
      window.__API_BASE_URL__ ||
      document.body?.getAttribute("data-api-base-url") ||
      "http://localhost:4000/api";
    return candidate.replace(/\/+$/, "");
  };

  const API_BASE_URL = resolveApiBaseUrl();
  const buildApiUrl = (path) =>
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const normalizeGuideName = (value) => (value || "").trim().toLowerCase();

  let guideDirectory = new Map();
  let audioGrid;
  let filterContainer;
  let continueListeningSection;
  let audioPlayerModal;
  let searchInput;

  let activeFilter = "all";
  let searchTerm = "";

  let currentPlayingButton = null;
  let currentGuide = null;
  let isPlaying = false;
  let isRealAudio = false;
  let currentTime = 0;
  let totalTime = 0;
  let progressInterval = null;
  let pendingResumeTime = 0;
  let lastSavedSecond = -1;
  const audioElement = new Audio();

  const getSessionUser = () => window.mfgaSession?.load?.()?.user || null;

  const getUserProgressNamespace = () => {
    const user = getSessionUser();
    if (!user) return "guest";
    return String(user.UserId ?? user.Email ?? "guest");
  };

  const getProgressKey = (guideId) =>
    `audioProgress:${getUserProgressNamespace()}:${guideId}`;
  const getLastGuideKey = () => `audioLastGuide:${getUserProgressNamespace()}`;

  const findGuideById = (id) =>
    [...audioGuides, featuredGuide].find((guide) => guide.id === Number(id));

  const formatTime = (seconds) => {
    const safeValue = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const mins = Math.floor(safeValue / 60);
    const secs = Math.floor(safeValue % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseDurationTextToSeconds = (durationText) => {
    if (!durationText) return 0;
    const fromMin = durationText.match(/(\d+)\s*min/i);
    if (fromMin?.[1]) {
      return Number(fromMin[1]) * 60;
    }
    const fromClock = durationText.match(/^(\d+):(\d{2})$/);
    if (fromClock?.[1] && fromClock?.[2]) {
      return Number(fromClock[1]) * 60 + Number(fromClock[2]);
    }
    return 0;
  };

  const getSavedProgress = (guideId) => {
    try {
      const raw = localStorage.getItem(getProgressKey(guideId));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const saveAudioProgress = () => {
    if (!currentGuide || !Number.isFinite(totalTime) || totalTime <= 0) return;

    const roundedSecond = Math.floor(currentTime);
    if (roundedSecond === lastSavedSecond && isPlaying) return;
    lastSavedSecond = roundedSecond;

    const isComplete = currentTime >= totalTime - 1;
    const progressToStore = isComplete ? 0 : Math.max(0, currentTime);

    const payload = {
      guideId: currentGuide.id,
      timestamp: Date.now(),
      progress: progressToStore,
      total: totalTime,
    };

    localStorage.setItem(getProgressKey(currentGuide.id), JSON.stringify(payload));
    localStorage.setItem(getLastGuideKey(), String(currentGuide.id));
    updateContinueListeningSection();
  };

  const getLastGuideForUser = () => {
    const raw = localStorage.getItem(getLastGuideKey());
    if (!raw) return null;
    const id = Number(raw);
    if (!Number.isFinite(id)) return null;
    return findGuideById(id);
  };

  const updateContinueListeningSection = () => {
    if (!continueListeningSection) return;

    const lastGuide = getLastGuideForUser();
    if (!lastGuide) {
      continueListeningSection.style.display = "none";
      return;
    }

    const progress = getSavedProgress(lastGuide.id);
    if (!progress || !progress.progress || progress.progress <= 0) {
      continueListeningSection.style.display = "none";
      return;
    }

    const savedTotal = Number(progress.total) || parseDurationTextToSeconds(lastGuide.duration);
    const remaining = Math.max(0, savedTotal - Number(progress.progress || 0));
    const completion = savedTotal > 0 ? (progress.progress / savedTotal) * 100 : 0;

    const titleNode = document.getElementById("continueTitle");
    if (titleNode) {
      titleNode.textContent = lastGuide.title;
    }

    const remainingNode = document.getElementById("continueRemaining");
    if (remainingNode) {
      remainingNode.textContent = `${formatTime(remaining)} remaining`;
    }

    const barNode = document.getElementById("continueProgressBar");
    if (barNode) {
      barNode.style.width = `${Math.min(100, Math.max(0, completion))}%`;
    }

    continueListeningSection.style.display = "block";
  };

  const getAudioDurationSeconds = (src) =>
    new Promise((resolve, reject) => {
      const probe = new Audio();
      probe.preload = "metadata";
      probe.src = src;
      probe.addEventListener(
        "loadedmetadata",
        () => {
          const duration = Number(probe.duration);
          if (Number.isFinite(duration) && duration > 0) {
            resolve(duration);
          } else {
            reject(new Error("Duracion invalida"));
          }
        },
        { once: true }
      );
      probe.addEventListener(
        "error",
        () => reject(new Error(`No se pudo cargar metadata: ${src}`)),
        { once: true }
      );
    });

  const applyDurationToGuide = (guide, seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    const rounded = Math.round(seconds);
    guide.durationSeconds = rounded;
    guide.duration = formatTime(rounded);
  };

  const loadAudioDurations = async () => {
    const guidesWithAudio = [...audioGuides, featuredGuide].filter(
      (guide) => Boolean(guide.audioFile)
    );

    await Promise.all(
      guidesWithAudio.map(async (guide) => {
        try {
          const seconds = await getAudioDurationSeconds(guide.audioFile);
          applyDurationToGuide(guide, seconds);
        } catch (error) {
          console.warn(`Duracion no disponible para ${guide.title}:`, error);
        }
      })
    );

    refreshCurrentView();
    updateFeaturedCardUI();
    updateContinueListeningSection();
  };

  async function loadGuideDirectory() {
    try {
      const response = await fetch(buildApiUrl("/guides"));
      if (!response.ok) {
        throw new Error("No se pudo cargar el directorio de guias");
      }
      const guides = await response.json();
      guideDirectory = new Map();
      guides.forEach((guide) => {
        guideDirectory.set(normalizeGuideName(guide.Name), guide);
      });

      audioGuides.forEach((guide) => {
        const match = guideDirectory.get(normalizeGuideName(guide.guide));
        if (match) {
          guide.guideId = match.GuideId;
        }
      });

      const featuredMatch = guideDirectory.get(normalizeGuideName(featuredGuide.guide));
      if (featuredMatch) {
        featuredGuide.guideId = featuredMatch.GuideId;
      }
    } catch (error) {
      console.warn("No se pudo cargar el directorio de guias:", error);
    }
  }

  const buildGuideProfileUrl = (guide) => {
    const params = new URLSearchParams();
    if (guide?.guideId) {
      params.set("guideId", guide.guideId);
    } else if (guide?.guide) {
      params.set("name", guide.guide);
    }
    const query = params.toString();
    return `guide_profile.html${query ? `?${query}` : ""}`;
  };

  const buildGuideTooltipMarkup = (guide) => {
    const details = [];
    if (guide?.location) {
      details.push(
        `<span class="block text-xs text-gray-500">${guide.location}</span>`
      );
    }
    if (guide?.category) {
      details.push(
        `<span class="block text-xs text-gray-500">Categoria: ${
          guide.category.charAt(0).toUpperCase() + guide.category.slice(1)
        }</span>`
      );
    }

    return `
      <span class="guide-tooltip-title">Perfil del guia</span>
      ${details.join("")}
      <span class="guide-tooltip-action mt-2">Ver ticket</span>
    `;
  };

  const hydrateGuideLinks = () => {
    document.querySelectorAll("[data-guide-name]").forEach((link) => {
      const name = link.getAttribute("data-guide-name");
      if (!name) return;
      const match = guideDirectory.get(normalizeGuideName(name));
      if (match) {
        link.setAttribute(
          "href",
          buildGuideProfileUrl({ guideId: match.GuideId, guide: name })
        );
      }
    });
  };

  const updateFeaturedCardUI = () => {
    const durationNode = document.getElementById("featuredDuration");
    if (durationNode) {
      durationNode.textContent = featuredGuide.duration;
    }

    const guideLink = document.getElementById("featuredGuideLink");
    if (guideLink) {
      guideLink.setAttribute("href", buildGuideProfileUrl(featuredGuide));
    }
  };

  const getVisibleGuides = () => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    return audioGuides.filter((guide) => {
      const matchesFilter =
        activeFilter === "all" ? true : guide.category === activeFilter;

      if (!normalizedTerm) {
        return matchesFilter;
      }

      const matchesSearch =
        guide.title.toLowerCase().includes(normalizedTerm) ||
        guide.location.toLowerCase().includes(normalizedTerm) ||
        guide.category.toLowerCase().includes(normalizedTerm) ||
        guide.description.toLowerCase().includes(normalizedTerm) ||
        guide.guide.toLowerCase().includes(normalizedTerm);

      return matchesFilter && matchesSearch;
    });
  };

  const refreshCurrentView = () => {
    renderAudioGuides(getVisibleGuides());
  };

  function renderAudioGuides(guides) {
    if (!audioGrid) return;
    audioGrid.innerHTML = "";

    guides.forEach((guide) => {
      const completedPercentage = Math.min(100, (guide.completed / 100) * 100);

      const card = document.createElement("div");
      card.className = "audio-card fade-in";
      card.innerHTML = `
        <div class="audio-card-image">
          <img src="${guide.image}" alt="${guide.title}" loading="lazy">
          <span class="category-tag ${guide.category}">${
        guide.category.charAt(0).toUpperCase() + guide.category.slice(1)
      }</span>
          <button class="bookmark-btn absolute top-4 right-4" data-id="${guide.id}">
            <i data-feather="bookmark" class="h-5 w-5"></i>
          </button>
        </div>
        <div class="p-5 flex-grow flex flex-col">
          <div class="mb-3">
            <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">${
              guide.title
            }</h3>
            <div class="flex items-center text-gray-500 text-sm mb-2">
              <i data-feather="map-pin" class="h-4 w-4 mr-1"></i>
              <span class="mr-4">${guide.location}</span>
              <i data-feather="clock" class="h-4 w-4 mr-1"></i>
              <span>${guide.duration}</span>
            </div>
            <p class="text-gray-600 text-sm line-clamp-2 mb-4">${
              guide.description
            }</p>
          </div>
          <div class="mt-auto">
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="text-yellow-500 font-semibold">${guide.rating} ★</span>
                <span class="text-gray-400 text-sm ml-1">(${guide.reviews})</span>
              </div>
              <span class="text-sm text-gray-500">
                By
                <a class="guide-link" data-guide-name="${guide.guide}" href="${buildGuideProfileUrl(
                  guide
                )}">
                  ${guide.guide}
                  <span class="guide-tooltip" aria-hidden="true">
                    ${buildGuideTooltipMarkup(guide)}
                  </span>
                </a>
              </span>
            </div>
            <div class="progress-container mb-4">
              <div class="progress-bar" style="width: ${completedPercentage}%"></div>
            </div>
            <div class="flex items-center justify-between">
              <button class="audio-play-btn" data-id="${guide.id}">
                <i data-feather="play" class="h-5 w-5 ml-0.5"></i>
              </button>
              <span class="text-sm text-gray-500">${guide.completed}% completed</span>
            </div>
          </div>
        </div>
      `;

      audioGrid.appendChild(card);
    });

    feather.replace();
    hydrateGuideLinks();

    audioGrid.querySelectorAll(".audio-play-btn[data-id]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = Number(btn.getAttribute("data-id"));
        if (Number.isFinite(id)) {
          playAudio(id, btn);
        }
      });
    });

    audioGrid.querySelectorAll(".bookmark-btn[data-id]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = Number(btn.getAttribute("data-id"));
        if (Number.isFinite(id)) {
          toggleBookmark(id, btn);
        }
      });
    });
  }

  function setupFilters() {
    if (!filterContainer) return;
    filterContainer.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (!chip) return;

      filterContainer.querySelectorAll(".filter-chip").forEach((node) => {
        node.classList.remove("active");
      });
      chip.classList.add("active");
      activeFilter = chip.getAttribute("data-filter") || "all";
      refreshCurrentView();
    });
  }

  function setupSearch() {
    if (!searchInput) return;
    searchInput.addEventListener("input", (event) => {
      searchTerm = String(event.target.value || "");
      refreshCurrentView();
    });
  }

  const setPlayingButtonState = (button, playing) => {
    if (!button) return;
    button.classList.toggle("playing", playing);
    button.innerHTML = playing
      ? '<i data-feather="pause" class="h-5 w-5"></i>'
      : '<i data-feather="play" class="h-5 w-5 ml-0.5"></i>';
    feather.replace();
  };

  const startSimulatedPlayback = () => {
    if (progressInterval) clearInterval(progressInterval);

    isPlaying = true;
    document.getElementById("mainPlayBtn").innerHTML =
      '<i data-feather="pause" class="h-6 w-6"></i>';
    feather.replace();

    progressInterval = setInterval(() => {
      if (currentTime < totalTime) {
        currentTime++;
        updateProgressDisplay();
        saveAudioProgress();
      } else {
        stopAudio(true);
      }
    }, 1000);
  };

  const startRealPlayback = async () => {
    try {
      await audioElement.play();
      isPlaying = true;
      document.getElementById("mainPlayBtn").innerHTML =
        '<i data-feather="pause" class="h-6 w-6"></i>';
      feather.replace();
    } catch (error) {
      console.warn("No se pudo iniciar reproduccion:", error);
    }
  };

  function playAudio(id, triggerButton = null) {
    const guide = findGuideById(id);
    if (!guide) return;

    currentGuide = guide;
    pendingResumeTime = Number(getSavedProgress(id)?.progress || 0);
    lastSavedSecond = -1;

    document.getElementById("playerImage").src = guide.image;
    document.getElementById("playerCategory").textContent =
      guide.category.charAt(0).toUpperCase() + guide.category.slice(1);
    document.getElementById("playerCategory").className = `category-tag ${guide.category}`;
    document.getElementById("playerTitle").textContent = guide.title;
    document.getElementById("playerLocation").textContent = `${guide.location} • ${guide.duration}`;

    if (currentPlayingButton && currentPlayingButton !== triggerButton) {
      setPlayingButtonState(currentPlayingButton, false);
    }
    currentPlayingButton = triggerButton;
    setPlayingButtonState(currentPlayingButton, true);

    audioPlayerModal.classList.remove("hidden");

    const hasRealAudio = Boolean(guide.audioFile);
    isRealAudio = hasRealAudio;

    if (hasRealAudio) {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      audioElement.pause();
      audioElement.src = guide.audioFile;
      audioElement.load();

      totalTime = guide.durationSeconds || parseDurationTextToSeconds(guide.duration) || 0;
      currentTime = 0;
      updateProgressDisplay();
      startRealPlayback();
      return;
    }

    // Fallback for cards without physical audio file.
    audioElement.pause();
    totalTime = guide.durationSeconds || parseDurationTextToSeconds(guide.duration);
    currentTime = pendingResumeTime > 0 ? pendingResumeTime : 0;
    pendingResumeTime = 0;
    updateProgressDisplay();
    startSimulatedPlayback();
  }

  function stopAudio(markAsCompleted = false) {
    isPlaying = false;

    if (isRealAudio) {
      audioElement.pause();
    }

    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }

    if (markAsCompleted) {
      currentTime = 0;
      updateProgressDisplay();
      saveAudioProgress();
    } else {
      saveAudioProgress();
    }

    document.getElementById("mainPlayBtn").innerHTML =
      '<i data-feather="play" class="h-6 w-6 ml-0.5"></i>';
    feather.replace();

    setPlayingButtonState(currentPlayingButton, false);
    currentPlayingButton = null;
  }

  async function togglePlayPause() {
    if (!currentGuide) return;

    if (isRealAudio) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        await startRealPlayback();
      }
      return;
    }

    if (isPlaying) {
      stopAudio(false);
    } else {
      startSimulatedPlayback();
    }
  }

  function updateProgressDisplay() {
    const progressPercentage = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;
    document.getElementById("playerProgress").style.width = `${Math.min(
      100,
      Math.max(0, progressPercentage)
    )}%`;

    document.getElementById("currentTime").textContent = formatTime(currentTime);
    document.getElementById("totalTime").textContent = formatTime(totalTime);
  }

  function setupAudioPlayer() {
    const closePlayer = document.getElementById("closePlayer");
    const mainPlayBtn = document.getElementById("mainPlayBtn");

    closePlayer?.addEventListener("click", () => {
      audioPlayerModal.classList.add("hidden");
      stopAudio(false);
    });

    mainPlayBtn?.addEventListener("click", togglePlayPause);

    audioPlayerModal?.addEventListener("click", (event) => {
      if (event.target === audioPlayerModal) {
        audioPlayerModal.classList.add("hidden");
        stopAudio(false);
      }
    });

    audioElement.addEventListener("loadedmetadata", () => {
      if (!isRealAudio) return;

      totalTime = Number.isFinite(audioElement.duration) ? audioElement.duration : totalTime;
      if (
        Number.isFinite(pendingResumeTime) &&
        pendingResumeTime > 0 &&
        totalTime > pendingResumeTime
      ) {
        audioElement.currentTime = pendingResumeTime;
        currentTime = pendingResumeTime;
      } else {
        currentTime = audioElement.currentTime || 0;
      }
      pendingResumeTime = 0;
      updateProgressDisplay();
      saveAudioProgress();
    });

    audioElement.addEventListener("timeupdate", () => {
      if (!isRealAudio) return;
      currentTime = audioElement.currentTime || 0;
      totalTime = Number.isFinite(audioElement.duration) ? audioElement.duration : totalTime;
      updateProgressDisplay();
      saveAudioProgress();
    });

    audioElement.addEventListener("play", () => {
      isPlaying = true;
      document.getElementById("mainPlayBtn").innerHTML =
        '<i data-feather="pause" class="h-6 w-6"></i>';
      feather.replace();
    });

    audioElement.addEventListener("pause", () => {
      if (!isRealAudio) return;
      isPlaying = false;
      document.getElementById("mainPlayBtn").innerHTML =
        '<i data-feather="play" class="h-6 w-6 ml-0.5"></i>';
      feather.replace();
      saveAudioProgress();
    });

    audioElement.addEventListener("ended", () => {
      stopAudio(true);
    });
  }

  function toggleBookmark(id, button) {
    let bookmarks = JSON.parse(localStorage.getItem("audioBookmarks") || "[]");

    if (bookmarks.includes(id)) {
      bookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== id);
      button.classList.remove("active");
      button.innerHTML = '<i data-feather="bookmark" class="h-5 w-5"></i>';
    } else {
      bookmarks.push(id);
      button.classList.add("active");
      button.innerHTML =
        '<i data-feather="bookmark" class="h-5 w-5 text-yellow-500"></i>';
    }

    localStorage.setItem("audioBookmarks", JSON.stringify(bookmarks));
    feather.replace();
  }

  function setupEventListeners() {
    const resumeBtn = document.querySelector(".resume-btn");
    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => {
        const lastGuide = getLastGuideForUser();
        if (lastGuide) {
          const cardBtn = document.querySelector(
            `.audio-play-btn[data-id="${lastGuide.id}"]`
          );
          playAudio(lastGuide.id, cardBtn || null);
        }
      });
    }

    const featuredPlayBtn = document.getElementById("featuredPlayBtn");
    if (featuredPlayBtn) {
      featuredPlayBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        playAudio(featuredGuide.id, featuredPlayBtn);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !audioPlayerModal.classList.contains("hidden")) {
        audioPlayerModal.classList.add("hidden");
        stopAudio(false);
      }

      if (event.key === " " && event.target === document.body) {
        event.preventDefault();
        if (!audioPlayerModal.classList.contains("hidden")) {
          togglePlayPause();
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    audioGrid = document.getElementById("audioGrid");
    filterContainer = document.getElementById("filterContainer");
    continueListeningSection = document.getElementById("continueListeningSection");
    audioPlayerModal = document.getElementById("audioPlayerModal");
    searchInput = document.querySelector('input[type="text"]');

    renderAudioGuides(audioGuides);
    updateFeaturedCardUI();
    updateContinueListeningSection();

    setupFilters();
    setupSearch();
    setupAudioPlayer();
    setupEventListeners();

    loadAudioDurations();

    loadGuideDirectory().then(() => {
      refreshCurrentView();
      hydrateGuideLinks();
      updateFeaturedCardUI();
    });
  });
})();
