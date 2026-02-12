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

const normalizeGuideName = (value) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSession = () => window.mfgaSession?.load?.();
const getAuthToken = () => getSession()?.token;

const buildAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const elements = {
  guideName: document.getElementById("guideName"),
  ratingAverage: document.getElementById("ratingAverage"),
  ratingCount: document.getElementById("ratingCount"),
  ratingControl: document.getElementById("ratingControl"),
  ratingFeedback: document.getElementById("ratingFeedback"),
  commentForm: document.getElementById("commentForm"),
  commentInput: document.getElementById("commentInput"),
  commentError: document.getElementById("commentError"),
  commentsList: document.getElementById("commentsList"),
  commentsCount: document.getElementById("commentsCount"),
  messagePanel: document.getElementById("messagePanel"),
  openMessageBtn: document.getElementById("openMessageBtn"),
  closeMessageBtn: document.getElementById("closeMessageBtn"),
  messageForm: document.getElementById("messageForm"),
  messageInput: document.getElementById("messageInput"),
  messageError: document.getElementById("messageError"),
  toast: document.getElementById("toast"),
};

const state = {
  guideId: null,
  guideName: null,
  selectedRating: 0,
};

const showToast = (message) => {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  elements.toast.classList.add("is-visible");
  setTimeout(() => {
    elements.toast.classList.remove("is-visible");
    setTimeout(() => {
      elements.toast.classList.add("hidden");
    }, 200);
  }, 2500);
};

const setRatingFeedback = (message, variant = "info") => {
  if (!elements.ratingFeedback) return;
  elements.ratingFeedback.textContent = message;
  elements.ratingFeedback.classList.toggle("text-red-500", variant === "error");
  elements.ratingFeedback.classList.toggle("text-green-600", variant === "success");
  elements.ratingFeedback.classList.toggle("text-gray-500", variant === "info");
};

const setCommentError = (message) => {
  if (!elements.commentError) return;
  elements.commentError.textContent = message || "";
  elements.commentError.classList.toggle("hidden", !message);
};

const setMessageError = (message) => {
  if (!elements.messageError) return;
  elements.messageError.textContent = message || "";
  elements.messageError.classList.toggle("hidden", !message);
};

const updateStarDisplay = (value) => {
  if (!elements.ratingControl) return;
  elements.ratingControl.querySelectorAll(".rating-star").forEach((star) => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle("is-active", starValue <= value);
  });
};

const updateRatingSummary = ({ ratingAverage, ratingCount }) => {
  if (elements.ratingAverage) {
    const display =
      ratingAverage === null || ratingAverage === undefined
        ? "-"
        : Number(ratingAverage).toFixed(1);
    elements.ratingAverage.textContent = display;
  }
  if (elements.ratingCount) {
    const count = Number(ratingCount || 0);
    elements.ratingCount.textContent = `(${count} vote${count === 1 ? "" : "s"})`;
  }
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const renderComments = (comments) => {
  if (!elements.commentsList) return;
  elements.commentsList.innerHTML = "";

  const count = comments?.length || 0;
  if (elements.commentsCount) {
    elements.commentsCount.textContent = `${count} comment${
      count === 1 ? "" : "s"
    }`;
  }

  if (!count) {
    const empty = document.createElement("div");
    empty.className = "text-sm text-gray-500";
    empty.textContent = "No comments yet.";
    elements.commentsList.appendChild(empty);
    return;
  }

  comments.forEach((comment) => {
    const card = document.createElement("div");
    card.className = "comment-card";
    const author = comment?.UserName || "MFGA Explorer";
    const date = formatDate(comment?.CreatedAt);
    card.innerHTML = `
      <div class="comment-meta">
        <span>${author}</span>
        <span>${date}</span>
      </div>
      <p class="text-gray-700 text-sm">${comment?.Comment || ""}</p>
    `;
    elements.commentsList.appendChild(card);
  });
};

const resolveGuideId = async (guideId, guideName) => {
  if (guideId) return guideId;
  if (!guideName) return null;

  const response = await fetch(buildApiUrl("/guides"));
  if (!response.ok) {
    return null;
  }
  const guides = await response.json();
  const match = guides.find(
    (guide) => normalizeGuideName(guide?.Name) === normalizeGuideName(guideName)
  );
  return match?.GuideId || null;
};

const loadGuide = async () => {
  if (!state.guideId) return;
  const response = await fetch(buildApiUrl(`/guides/${state.guideId}`));
  if (!response.ok) {
    throw new Error("Could not load the guide");
  }
  const guide = await response.json();
  if (elements.guideName) {
    elements.guideName.textContent = guide?.Name || state.guideName || "Guide";
  }
  updateRatingSummary({
    ratingAverage: guide?.ratingAverage ?? null,
    ratingCount: guide?.ratingCount ?? 0,
  });
};

const loadComments = async () => {
  if (!state.guideId) return;
  const response = await fetch(
    buildApiUrl(`/guides/${state.guideId}/comments`)
  );
  if (!response.ok) {
    throw new Error("Could not load comments");
  }
  const comments = await response.json();
  renderComments(comments);
};

const submitRating = async (value) => {
  if (!state.guideId) return;
  const token = getAuthToken();
  if (!token) {
    setRatingFeedback("You must sign in to rate.", "error");
    return;
  }

  const response = await fetch(
    buildApiUrl(`/guides/${state.guideId}/ratings`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
      body: JSON.stringify({ rating: value }),
    }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    setRatingFeedback(
      payload?.message || "Could not save the rating.",
      "error"
    );
    return;
  }

  const summary = await response.json().catch(() => ({}));
  updateRatingSummary(summary);
  setRatingFeedback("Rating saved.", "success");
};

const submitComment = async (comment) => {
  if (!state.guideId) return;
  const token = getAuthToken();
  if (!token) {
    setCommentError("You must sign in to comment.");
    return;
  }

  const response = await fetch(
    buildApiUrl(`/guides/${state.guideId}/comments`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
      body: JSON.stringify({ comment }),
    }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    setCommentError(payload?.message || "Could not send the comment.");
    return;
  }

  setCommentError("");
  if (elements.commentInput) {
    elements.commentInput.value = "";
  }
  await loadComments();
  showToast("Comment sent");
};

const submitMessage = async (message) => {
  if (!state.guideId) return;
  const token = getAuthToken();
  if (!token) {
    setMessageError("You must sign in to send messages.");
    return;
  }

  const response = await fetch(
    buildApiUrl(`/guides/${state.guideId}/messages`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    setMessageError(payload?.message || "Could not send the message.");
    return;
  }

  setMessageError("");
  if (elements.messageInput) {
    elements.messageInput.value = "";
  }
  elements.messagePanel?.classList.add("hidden");
  showToast("Message sent");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const setupRatingControl = () => {
  if (!elements.ratingControl) return;
  elements.ratingControl.querySelectorAll(".rating-star").forEach((star) => {
    star.addEventListener("click", async () => {
      const value = Number(star.dataset.value || 0);
      if (!value) return;
      state.selectedRating = value;
      updateStarDisplay(value);
      await submitRating(value);
    });
  });
};

const setupCommentForm = () => {
  if (!elements.commentForm) return;
  elements.commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = elements.commentInput?.value.trim() || "";
    if (!value) {
      setCommentError("Write a comment before sending.");
      return;
    }
    await submitComment(value);
  });
};

const setupMessagePanel = () => {
  elements.openMessageBtn?.addEventListener("click", () => {
    elements.messagePanel?.classList.remove("hidden");
    elements.messageInput?.focus();
    elements.messagePanel?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.closeMessageBtn?.addEventListener("click", () => {
    elements.messagePanel?.classList.add("hidden");
  });

  elements.messageForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = elements.messageInput?.value.trim() || "";
    if (!value) {
      setMessageError("Write a message before sending.");
      return;
    }
    await submitMessage(value);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  state.guideId = params.get("guideId");
  state.guideName = params.get("name");

  try {
    state.guideId = await resolveGuideId(state.guideId, state.guideName);
    if (!state.guideId) {
      setRatingFeedback("The requested guide was not found.", "error");
      return;
    }

    await loadGuide();
    await loadComments();
  } catch (error) {
    console.error(error);
    setRatingFeedback("Could not load the guide profile.", "error");
  }

  setupRatingControl();
  setupCommentForm();
  setupMessagePanel();
  updateStarDisplay(state.selectedRating);
});
