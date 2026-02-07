(() => {
  const FEED_PAGE_SIZE = 3;

  const communityPosts = [
    {
      id: 101,
      author: "Maria Fernandez",
      avatar: "http://static.photos/people/200x200/1",
      location: "Bariloche",
      region: "Patagonia",
      category: "adventure",
      message:
        "Just hiked Cerro Campanario at sunrise. The lake view is incredible and there were almost no crowds before 8am.",
      timeLabel: "2h ago",
      likes: 24,
      comments: 8,
      image: "http://static.photos/nature/640x360/901",
    },
    {
      id: 102,
      author: "Lucas Torres",
      avatar: "http://static.photos/people/200x200/2",
      location: "Buenos Aires",
      region: "Buenos Aires",
      category: "question",
      message:
        "Any recommendation for authentic tango shows in Buenos Aires that are not focused on tourists?",
      timeLabel: "1d ago",
      likes: 31,
      comments: 15,
    },
    {
      id: 103,
      author: "Sophie Chen",
      avatar: "http://static.photos/people/200x200/3",
      location: "Salta",
      region: "Northwest",
      category: "food",
      message:
        "Found a tiny place near Plaza 9 de Julio with amazing empanadas saltenas. Worth every block you walk.",
      timeLabel: "3d ago",
      likes: 47,
      comments: 22,
      image: "http://static.photos/food/640x360/902",
    },
    {
      id: 104,
      author: "Camila Ruiz",
      avatar: "http://static.photos/people/200x200/4",
      location: "Mendoza",
      region: "Cuyo",
      category: "tips",
      message:
        "If you rent a bike in Maipu, bring cash for small wineries and reserve lunch in advance on weekends.",
      timeLabel: "4d ago",
      likes: 18,
      comments: 5,
    },
    {
      id: 105,
      author: "Ethan Park",
      avatar: "http://static.photos/people/200x200/5",
      location: "Puerto Iguazu",
      region: "Litoral",
      category: "culture",
      message:
        "Local guide at the falls shared Guarani legends that made the whole visit feel different. Highly recommended.",
      timeLabel: "5d ago",
      likes: 29,
      comments: 11,
      image: "http://static.photos/travel/640x360/903",
    },
    {
      id: 106,
      author: "Valentina Gomez",
      avatar: "http://static.photos/people/200x200/6",
      location: "El Chalten",
      region: "Patagonia",
      category: "adventure",
      message:
        "Laguna Capri trail was windy but stunning. Layered clothing is essential even in mild weather.",
      timeLabel: "6d ago",
      likes: 34,
      comments: 7,
    },
    {
      id: 107,
      author: "Nicolas Herrera",
      avatar: "http://static.photos/people/200x200/7",
      location: "Cordoba",
      region: "Center",
      category: "tips",
      message:
        "For first-time visitors in Cordoba city, a free walking tour around Nueva Cordoba gives great historical context.",
      timeLabel: "1w ago",
      likes: 16,
      comments: 4,
    },
  ];

  const communityGroups = [
    {
      id: 1,
      icon: "compass",
      name: "Backpackers in Argentina",
      description:
        "Budget routes, hostels, bus tips, and low-cost planning across provinces.",
      members: 1200,
    },
    {
      id: 2,
      icon: "coffee",
      name: "Food Lovers",
      description:
        "Regional dishes, local markets, and restaurant recommendations.",
      members: 890,
    },
    {
      id: 3,
      icon: "mountain",
      name: "Nature & Adventure",
      description:
        "Trekking, parks, wildlife, and practical outdoor preparation advice.",
      members: 1500,
    },
    {
      id: 4,
      icon: "home",
      name: "City Explorers",
      description:
        "Architecture, museums, local neighborhoods, and urban routes.",
      members: 980,
    },
  ];

  const upcomingMeetups = [
    {
      id: 201,
      day: "25",
      month: "NOV",
      title: "Buenos Aires City Walk",
      location: "Recoleta, Buenos Aires",
      summary:
        "Walk through historic neighborhoods with local travelers and photographers.",
      attendees: 26,
    },
    {
      id: 202,
      day: "30",
      month: "NOV",
      title: "Mendoza Wine Tasting",
      location: "Lujan de Cuyo, Mendoza",
      summary:
        "Community tasting and winery tour with shared transportation options.",
      attendees: 18,
    },
    {
      id: 203,
      day: "05",
      month: "DEC",
      title: "Patagonia Hiking Group",
      location: "El Chalten, Santa Cruz",
      summary:
        "Moderate route with checklists for weather, gear, and safety in mountain terrain.",
      attendees: 31,
    },
  ];

  const regions = [
    "All Regions",
    "Buenos Aires",
    "Patagonia",
    "Northwest",
    "Cuyo",
    "Litoral",
    "Center",
  ];

  const defaultFeedState = {
    search: "",
    category: "all",
    region: "All Regions",
    visibleCount: FEED_PAGE_SIZE,
  };

  const feedState = { ...defaultFeedState };
  let renderTimer = null;
  let searchTimer = null;

  let likedPostIds = new Set();
  let bookmarkedPostIds = new Set();
  let joinedGroupIds = new Set();
  let interestedMeetupIds = new Set();

  const STORAGE_KEYS = {
    likedPosts: "communityLikedPosts",
    bookmarkedPosts: "communityBookmarkedPosts",
    joinedGroups: "communityJoinedGroups",
    interestedMeetups: "communityInterestedMeetups",
  };

  const categoryLabels = {
    tips: "Travel Tips",
    food: "Food",
    adventure: "Adventure",
    culture: "Culture",
    question: "Question",
  };

  const categoryBadgeClasses = {
    tips: "post-category-tips",
    food: "post-category-food",
    adventure: "post-category-adventure",
    culture: "post-category-culture",
    question: "post-category-question",
  };

  const icon = (name, classes = "w-4 h-4") =>
    `<i data-feather="${name}" class="${classes}"></i>`;

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const getSessionUser = () =>
    window.mfgaSession?.load?.()?.user || window.mfgaCurrentUser || null;

  const getUserNamespace = () => {
    const user = getSessionUser();
    if (!user) return "guest";
    return String(user.UserId ?? user.Email ?? "guest");
  };

  const scopedKey = (baseKey) => `${baseKey}:${getUserNamespace()}`;

  const readStoredSet = (baseKey) => {
    try {
      const raw = localStorage.getItem(scopedKey(baseKey));
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.map((value) => Number(value)).filter(Number.isFinite));
    } catch {
      return new Set();
    }
  };

  const writeStoredSet = (baseKey, valueSet) => {
    try {
      localStorage.setItem(scopedKey(baseKey), JSON.stringify([...valueSet]));
    } catch {
      // Ignore storage errors for private browsing scenarios.
    }
  };

  const loadInteractiveState = () => {
    likedPostIds = readStoredSet(STORAGE_KEYS.likedPosts);
    bookmarkedPostIds = readStoredSet(STORAGE_KEYS.bookmarkedPosts);
    joinedGroupIds = readStoredSet(STORAGE_KEYS.joinedGroups);
    interestedMeetupIds = readStoredSet(STORAGE_KEYS.interestedMeetups);
  };

  const formatMembers = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k members`;
    }
    return `${value} members`;
  };

  const getCategoryLabel = (category) =>
    categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);

  function populateRegionControls() {
    const regionDropdown = document.getElementById("regionDropdown");
    const postRegionSelect = document.getElementById("postRegionSelect");

    if (regionDropdown) {
      regionDropdown.innerHTML = regions
        .map(
          (region) => `
        <button class="region-option w-full text-left px-4 py-2 hover:bg-mfgablue/10 transition" data-region="${escapeHtml(
          region
        )}">
          ${escapeHtml(region)}
        </button>
      `
        )
        .join("");
    }

    if (postRegionSelect) {
      postRegionSelect.innerHTML = regions
        .map(
          (region) =>
            `<option value="${escapeHtml(region)}">${escapeHtml(region)}</option>`
        )
        .join("");
      postRegionSelect.value = "All Regions";
    }
  }

  function getFilteredPosts() {
    const normalizedSearch = feedState.search.trim().toLowerCase();

    return communityPosts.filter((post) => {
      const matchCategory =
        feedState.category === "all" ? true : post.category === feedState.category;
      if (!matchCategory) return false;

      const matchRegion =
        feedState.region === "All Regions" ? true : post.region === feedState.region;
      if (!matchRegion) return false;

      if (!normalizedSearch) return true;

      return (
        post.author.toLowerCase().includes(normalizedSearch) ||
        post.location.toLowerCase().includes(normalizedSearch) ||
        post.region.toLowerCase().includes(normalizedSearch) ||
        post.message.toLowerCase().includes(normalizedSearch)
      );
    });
  }

  function createFeedCard(post) {
    const liked = likedPostIds.has(post.id);
    const bookmarked = bookmarkedPostIds.has(post.id);
    const categoryClass =
      categoryBadgeClasses[post.category] || "post-category-tips";
    const likeCount = post.likes + (liked ? 1 : 0);

    return `
      <article class="feed-post">
        <div class="flex items-start gap-3">
          <img src="${escapeHtml(post.avatar)}" alt="${escapeHtml(
      post.author
    )}" class="w-12 h-12 rounded-full border-2 border-white shadow">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h4 class="font-semibold text-gray-900">${escapeHtml(post.author)}</h4>
              <span class="post-region-badge">${escapeHtml(post.region)}</span>
              <span class="post-category-badge ${categoryClass}">${escapeHtml(
      getCategoryLabel(post.category)
    )}</span>
            </div>
            <p class="text-sm text-gray-500 flex items-center mt-1">
              ${icon("map-pin", "w-3 h-3 mr-1")}
              ${escapeHtml(post.location)}
            </p>
          </div>
          <span class="text-sm text-gray-400 whitespace-nowrap">${escapeHtml(
            post.timeLabel
          )}</span>
        </div>
        <p class="mt-4 text-gray-700">${escapeHtml(post.message)}</p>
        ${
          post.image
            ? `<div class="post-image-wrap mt-4"><img src="${escapeHtml(
                post.image
              )}" alt="Post image for ${escapeHtml(post.location)}"></div>`
            : ""
        }
        <div class="flex justify-between items-center mt-5">
          <div class="flex items-center gap-2 sm:gap-3">
            <button class="feed-action-btn ${
              liked ? "active-like" : ""
            }" data-action="like" data-post-id="${post.id}">
              ${icon("heart", "w-5 h-5")}
              <span>${likeCount}</span>
            </button>
            <button class="feed-action-btn" data-action="comment" data-post-id="${post.id}">
              ${icon("message-circle", "w-5 h-5")}
              <span>${post.comments}</span>
            </button>
          </div>
          <button class="feed-action-btn ${
            bookmarked ? "active-bookmark" : ""
          }" data-action="bookmark" data-post-id="${post.id}" aria-label="Bookmark post">
            ${icon("bookmark", "w-5 h-5")}
          </button>
        </div>
      </article>
    `;
  }

  function paintFeed() {
    const feedList = document.getElementById("communityFeedList");
    const noResults = document.getElementById("noFeedResults");
    const loadMoreBtn = document.getElementById("loadMorePostsBtn");
    const loading = document.getElementById("feedLoadingIndicator");
    if (!feedList || !noResults || !loadMoreBtn || !loading) return;

    const filteredPosts = getFilteredPosts();
    const visiblePosts = filteredPosts.slice(0, feedState.visibleCount);

    loading.classList.add("hidden");

    if (!filteredPosts.length) {
      feedList.innerHTML = "";
      noResults.classList.remove("hidden");
      loadMoreBtn.classList.add("hidden");
      feather.replace();
      return;
    }

    noResults.classList.add("hidden");
    feedList.innerHTML = visiblePosts.map((post) => createFeedCard(post)).join("");
    loadMoreBtn.classList.toggle(
      "hidden",
      feedState.visibleCount >= filteredPosts.length
    );
    feather.replace();
  }

  function renderFeed(showLoading = true) {
    const feedList = document.getElementById("communityFeedList");
    const noResults = document.getElementById("noFeedResults");
    const loading = document.getElementById("feedLoadingIndicator");
    if (!feedList || !noResults || !loading) return;

    if (renderTimer) {
      clearTimeout(renderTimer);
      renderTimer = null;
    }

    if (!showLoading) {
      paintFeed();
      return;
    }

    feedList.innerHTML = "";
    noResults.classList.add("hidden");
    loading.classList.remove("hidden");

    renderTimer = setTimeout(() => {
      paintFeed();
    }, 260);
  }

  function updateFilterUi() {
    const regionFilterBtn = document.getElementById("regionFilterBtn");
    const categoryContainer = document.getElementById("categoryFilterContainer");

    if (categoryContainer) {
      categoryContainer.querySelectorAll("[data-category]").forEach((button) => {
        const isActive = button.getAttribute("data-category") === feedState.category;
        button.classList.toggle("active", isActive);
      });
    }

    if (regionFilterBtn) {
      regionFilterBtn.innerHTML = `
        ${icon("map")}
        ${escapeHtml(feedState.region)}
        ${icon("chevron-down")}
      `;
    }

    feather.replace();
  }

  function closeRegionDropdown() {
    const regionDropdown = document.getElementById("regionDropdown");
    if (regionDropdown) {
      regionDropdown.classList.add("hidden");
    }
  }

  function setupFilters() {
    const searchInput = document.getElementById("feedSearchInput");
    const categoryContainer = document.getElementById("categoryFilterContainer");
    const clearFiltersBtn = document.getElementById("clearFeedFiltersBtn");
    const regionFilterBtn = document.getElementById("regionFilterBtn");
    const regionDropdown = document.getElementById("regionDropdown");

    searchInput?.addEventListener("input", (event) => {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        feedState.search = String(event.target.value || "").trim();
        feedState.visibleCount = FEED_PAGE_SIZE;
        renderFeed(true);
      }, 220);
    });

    categoryContainer?.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-category]");
      if (!chip) return;
      feedState.category = chip.getAttribute("data-category") || "all";
      feedState.visibleCount = FEED_PAGE_SIZE;
      updateFilterUi();
      renderFeed(true);
    });

    clearFiltersBtn?.addEventListener("click", () => {
      feedState.search = defaultFeedState.search;
      feedState.category = defaultFeedState.category;
      feedState.region = defaultFeedState.region;
      feedState.visibleCount = FEED_PAGE_SIZE;
      if (searchInput) searchInput.value = "";
      updateFilterUi();
      renderFeed(true);
    });

    regionFilterBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      regionDropdown?.classList.toggle("hidden");
    });

    regionDropdown?.addEventListener("click", (event) => {
      const option = event.target.closest(".region-option");
      if (!option) return;
      const selectedRegion = option.getAttribute("data-region") || "All Regions";
      feedState.region = selectedRegion;
      feedState.visibleCount = FEED_PAGE_SIZE;
      updateFilterUi();
      renderFeed(true);
      closeRegionDropdown();
    });

    document.addEventListener("click", (event) => {
      if (!regionDropdown || !regionFilterBtn) return;
      if (
        !regionDropdown.contains(event.target) &&
        !regionFilterBtn.contains(event.target)
      ) {
        closeRegionDropdown();
      }
    });
  }

  function setComposerFeedback(message, variant = "error") {
    const feedback = document.getElementById("composerFeedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove("hidden");
    feedback.classList.toggle("text-red-600", variant !== "success");
    feedback.classList.toggle("text-green-600", variant === "success");
  }

  function setupComposer() {
    const form = document.getElementById("postComposerForm");
    const messageInput = document.getElementById("postComposerInput");
    const categorySelect = document.getElementById("postCategorySelect");
    const locationInput = document.getElementById("postLocationInput");
    const regionSelect = document.getElementById("postRegionSelect");

    if (!form || !messageInput || !categorySelect || !regionSelect) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const messageValue = String(messageInput.value || "").trim();
      const categoryValue = String(categorySelect.value || "tips");
      const locationValue = String(locationInput?.value || "").trim();
      const regionValue = String(regionSelect.value || "All Regions");

      if (messageValue.length < 12) {
        setComposerFeedback("Post must contain at least 12 characters.");
        return;
      }

      const user = getSessionUser();
      const newPost = {
        id: Date.now(),
        author: user?.Name || "Explorador MFGA",
        avatar: user?.AvatarUrl || "http://static.photos/people/200x200/42",
        location: locationValue || "Argentina",
        region: regionValue,
        category: categoryValue,
        message: messageValue,
        timeLabel: "Just now",
        likes: 0,
        comments: 0,
      };

      communityPosts.unshift(newPost);
      messageInput.value = "";
      if (locationInput) locationInput.value = "";
      categorySelect.value = "tips";
      regionSelect.value = "All Regions";

      feedState.search = "";
      feedState.category = "all";
      feedState.region = "All Regions";
      feedState.visibleCount = FEED_PAGE_SIZE;

      const searchInput = document.getElementById("feedSearchInput");
      if (searchInput) searchInput.value = "";

      updateFilterUi();
      setComposerFeedback("Post published successfully.", "success");
      renderFeed(false);
    });
  }

  function setupFeedActions() {
    const feedList = document.getElementById("communityFeedList");
    const loadMoreBtn = document.getElementById("loadMorePostsBtn");
    const composerInput = document.getElementById("postComposerInput");
    const composerFeedback = document.getElementById("composerFeedback");

    loadMoreBtn?.addEventListener("click", () => {
      feedState.visibleCount += FEED_PAGE_SIZE;
      renderFeed(false);
    });

    composerInput?.addEventListener("input", () => {
      if (!composerFeedback || composerFeedback.classList.contains("hidden")) return;
      composerFeedback.classList.add("hidden");
      composerFeedback.textContent = "";
    });

    feedList?.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action][data-post-id]");
      if (!actionButton) return;

      const postId = Number(actionButton.getAttribute("data-post-id"));
      if (!Number.isFinite(postId)) return;

      const action = actionButton.getAttribute("data-action");
      if (action === "like") {
        if (likedPostIds.has(postId)) {
          likedPostIds.delete(postId);
        } else {
          likedPostIds.add(postId);
        }
        writeStoredSet(STORAGE_KEYS.likedPosts, likedPostIds);
        renderFeed(false);
        return;
      }

      if (action === "bookmark") {
        if (bookmarkedPostIds.has(postId)) {
          bookmarkedPostIds.delete(postId);
        } else {
          bookmarkedPostIds.add(postId);
        }
        writeStoredSet(STORAGE_KEYS.bookmarkedPosts, bookmarkedPostIds);
        renderFeed(false);
      }
    });
  }

  function createGroupCard(group) {
    const joined = joinedGroupIds.has(group.id);
    const memberCount = group.members + (joined ? 1 : 0);

    return `
      <article class="group-card">
        <div class="group-icon bg-gradient-to-br from-mfgayellow/30 to-mfgablue/30">
          ${icon(group.icon, "w-10 h-10 text-gray-700")}
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-2">${escapeHtml(
          group.name
        )}</h3>
        <p class="text-gray-600 mb-6">${escapeHtml(group.description)}</p>
        <button class="group-join-btn ${joined ? "joined" : ""}" data-group-id="${
      group.id
    }">
          ${joined ? "Joined" : "Join Group"}
        </button>
        <span class="group-members mt-2">${escapeHtml(formatMembers(memberCount))}</span>
      </article>
    `;
  }

  function renderGroups() {
    const groupsGrid = document.getElementById("groupsGrid");
    if (!groupsGrid) return;
    groupsGrid.innerHTML = communityGroups.map((group) => createGroupCard(group)).join("");
    feather.replace();
  }

  function createMeetupCard(meetup) {
    const interested = interestedMeetupIds.has(meetup.id);
    const attendeeCount = meetup.attendees + (interested ? 1 : 0);

    return `
      <article class="meetup-card">
        <div class="meetup-date">
          <span class="text-2xl font-bold">${escapeHtml(meetup.day)}</span>
          <span class="text-sm">${escapeHtml(meetup.month)}</span>
        </div>
        <div class="ml-4 flex-1">
          <h3 class="text-xl font-semibold text-gray-900">${escapeHtml(meetup.title)}</h3>
          <p class="text-gray-600 flex items-center mt-2">
            ${icon("map-pin", "w-4 h-4 mr-2")}
            ${escapeHtml(meetup.location)}
          </p>
          <p class="text-gray-500 text-sm mt-2">${escapeHtml(meetup.summary)}</p>
          <div class="flex items-center justify-between mt-4 gap-3">
            <button class="meetup-btn ${interested ? "interested" : ""}" data-meetup-id="${
      meetup.id
    }">
              ${interested ? "Going" : "I am interested"}
            </button>
            <span class="text-sm text-gray-500">${attendeeCount} attending</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderMeetups() {
    const meetupsGrid = document.getElementById("meetupsGrid");
    if (!meetupsGrid) return;
    meetupsGrid.innerHTML = upcomingMeetups
      .map((meetup) => createMeetupCard(meetup))
      .join("");
    feather.replace();
  }

  function setupGroupAndMeetupActions() {
    const groupsGrid = document.getElementById("groupsGrid");
    const meetupsGrid = document.getElementById("meetupsGrid");

    groupsGrid?.addEventListener("click", (event) => {
      const joinButton = event.target.closest("[data-group-id]");
      if (!joinButton) return;
      const groupId = Number(joinButton.getAttribute("data-group-id"));
      if (!Number.isFinite(groupId)) return;

      if (joinedGroupIds.has(groupId)) {
        joinedGroupIds.delete(groupId);
      } else {
        joinedGroupIds.add(groupId);
      }
      writeStoredSet(STORAGE_KEYS.joinedGroups, joinedGroupIds);
      renderGroups();
    });

    meetupsGrid?.addEventListener("click", (event) => {
      const meetupButton = event.target.closest("[data-meetup-id]");
      if (!meetupButton) return;
      const meetupId = Number(meetupButton.getAttribute("data-meetup-id"));
      if (!Number.isFinite(meetupId)) return;

      if (interestedMeetupIds.has(meetupId)) {
        interestedMeetupIds.delete(meetupId);
      } else {
        interestedMeetupIds.add(meetupId);
      }
      writeStoredSet(STORAGE_KEYS.interestedMeetups, interestedMeetupIds);
      renderMeetups();
    });
  }

  function initCommunityPage() {
    loadInteractiveState();
    populateRegionControls();
    updateFilterUi();

    setupFilters();
    setupComposer();
    setupFeedActions();
    setupGroupAndMeetupActions();

    renderGroups();
    renderMeetups();
    renderFeed(true);

    window.addEventListener("mfga:user-loaded", () => {
      loadInteractiveState();
      renderGroups();
      renderMeetups();
      renderFeed(false);
    });
  }

  document.addEventListener("DOMContentLoaded", initCommunityPage);
})();
