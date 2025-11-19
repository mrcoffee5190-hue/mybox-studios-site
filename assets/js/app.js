// =============================================================
// MyBox Studio - Global App Script (app.js)
// One shared "brain" for ALL pages
// Safe for Google Play Deployment
// =============================================================

// RUN WHEN DOM IS READY
document.addEventListener("DOMContentLoaded", () => {
  initSpinnerOnLoad();
  initNavLinks();
  initTapAnimations();
  initPageSpecificFeatures();
});

// RUN WHEN ALL ASSETS ARE LOADED (IMAGES/FONTS)
window.addEventListener("load", () => hideSpinner());

// -------------------------------------------------------------
// SPINNER CONTROLS
// -------------------------------------------------------------

function getSpinner() {
  return document.getElementById("spinner");
}

function showSpinner() {
  const spinner = getSpinner();
  if (spinner) spinner.style.display = "flex";
}

function hideSpinner() {
  const spinner = getSpinner();
  if (spinner) spinner.style.display = "none";
}

function initSpinnerOnLoad() {
  // Safety hide in case "load" fires late
  setTimeout(() => hideSpinner(), 800);
}

// -------------------------------------------------------------
// NAVIGATION HANDLER (TOP + BOTTOM + CTA)
// -------------------------------------------------------------

function initNavLinks() {
  const selectors = [".nav-link", ".nav-cta", ".bottom-nav-link"];
  const links = document.querySelectorAll(selectors.join(", "));

  links.forEach(link => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      const target = link.getAttribute("target") || "";

      if (!href || href.startsWith("#") || target === "_blank") return;

      event.preventDefault();
      showSpinner();

      setTimeout(() => {
        window.location.href = href;
      }, 150);
    });
  });
}

// JS navigation from HTML
function navigateTo(page) {
  if (!page) return;
  showSpinner();
  setTimeout(() => { window.location.href = page; }, 150);
}

// -------------------------------------------------------------
// BUTTON / CARD TAP ANIMATION
// -------------------------------------------------------------

function initTapAnimations() {
  const elements = document.querySelectorAll(
    "button, .btn, .nav-link, .nav-cta, .card, .browse-link"
  );

  elements.forEach(el => {
    el.addEventListener("pointerdown", () => {
      el.style.transform = "scale(0.95)";
      el.style.transition = "transform 0.12s ease-out";
    });

    el.addEventListener("pointerup", () => el.style.transform = "scale(1)");
    el.addEventListener("pointerleave", () => el.style.transform = "scale(1)");
  });
}

// -------------------------------------------------------------
// PAGE DETECTION USING <body data-mbs-page="">
// -------------------------------------------------------------

function initPageSpecificFeatures() {
  const body = document.body;
  if (!body) return;

  const page = body.dataset.mbsPage || "";

  switch (page) {
    case "home":
      initHomePage();
      break;
    case "music":
      initMusicPage();
      break;
    case "movies":
      initMoviesPage();
      break;
    case "watch":
      initWatchPage();
      break;
    case "join":
      initJoinPage();
      break;
    case "success":
      initSuccessPage();
      break;
    default:
      // Global-only pages—nothing special
      break;
  }
}

// -------------------------------------------------------------
// HOME PAGE
// -------------------------------------------------------------

function initHomePage() {
  setTimeout(hideSpinner, 300);
}

// -------------------------------------------------------------
// MUSIC PAGE - Load music.json
// -------------------------------------------------------------

async function initMusicPage() {
  const container =
    document.getElementById("music-list") ||
    document.querySelector("[data-mbs-music-list]");

  if (!container) {
    hideSpinner();
    return;
  }

  try {
    showSpinner();
    const response = await fetch("data/music.json", { cache: "no-store" });
    if (!response.ok) throw new Error("music.json missing");

    const items = await response.json();
    container.innerHTML = "";

    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "media-card music-card";

      card.innerHTML = `
        <div class="media-thumb">
          <img src="${item.thumbnail || "assets/img/music-placeholder.jpg"}" />
        </div>
        <div class="media-info">
          <h3>${item.title || "Untitled Track"}</h3>
          <p class="media-meta">${item.artist || "Unknown Artist"}</p>
          <p class="media-meta small">${item.genre || "Music"}</p>
          ${
            item.previewUrl
              ? `<a href="watch.html?type=music&id=${encodeURIComponent(
                  item.id)}" class="btn btn-gold">Preview</a>`
              : ""
          }
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = `<p class="error-text">Unable to load music.</p>`;
  } finally {
    hideSpinner();
  }
}

// -------------------------------------------------------------
// MOVIES PAGE - Load movies.json
// -------------------------------------------------------------

async function initMoviesPage() {
  const container =
    document.getElementById("movies-list") ||
    document.querySelector("[data-mbs-movies-list]");

  if (!container) {
    hideSpinner();
    return;
  }

  try {
    showSpinner();
    const response = await fetch("data/movies.json", { cache: "no-store" });
    if (!response.ok) throw new Error("movies.json missing");

    const items = await response.json();
    container.innerHTML = "";

    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "media-card movie-card";

      card.innerinnerHTML = `
        <div class="media-thumb">
          <img src="${item.thumbnail || "assets/img/movie-placeholder.jpg"}" />
        </div>
        <div class="media-info">
          <h3>${item.title || "Untitled Movie"}</h3>
          <p class="media-meta">${item.director || "Independent Creator"}</p>
          <p class="media-meta small">${item.genre || "Film"}</p>
          ${
            item.previewUrl
              ? `<a href="watch.html?type=movie&id=${encodeURIComponent(
                  item.id)}" class="btn btn-gold">Preview</a>`
              : ""
          }
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = `<p class="error-text">Unable to load movies.</p>`;
  } finally {
    hideSpinner();
  }
}

// -------------------------------------------------------------
// WATCH PAGE - ?type=music|movie&id=123
// -------------------------------------------------------------

async function initWatchPage() {
  showSpinner();

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") || "music";
  const id = params.get("id");

  const titleEl =
    document.getElementById("watch-title") ||
    document.querySelector("[data-mbs-watch-title]");
  const playerEl =
    document.getElementById("watch-player") ||
    document.querySelector("[data-mbs-watch-player]");

  if (!id || !titleEl || !playerEl) {
    hideSpinner();
    return;
  }

  try {
    const source = type === "movie" ? "data/movies.json" : "data/music.json";
    const response = await fetch(source, { cache: "no-store" });
    if (!response.ok) throw new Error("watch source missing");

    const items = await response.json();
    const item = items.find(i => String(i.id) === String(id));

    if (!item) {
      titleEl.textContent = "Not Found";
      playerEl.innerHTML = "<p>Item missing.</p>";
      hideSpinner();
      return;
    }

    titleEl.textContent = item.title || "Now Playing";

    if (item.embedHtml) {
      playerEl.innerHTML = item.embedHtml;
    } else if (item.previewUrl) {
      playerEl.innerHTML = `
        <video controls style="width:100%;border-radius:12px;">
          <source src="${item.previewUrl}" type="video/mp4" />
        </video>`;
    } else {
      playerEl.innerHTML = "<p>No preview available.</p>";
    }

  } catch (err) {
    playerEl.innerHTML = "<p>Error loading preview.</p>";
  } finally {
    hideSpinner();
  }
}

// -------------------------------------------------------------
// JOIN PAGE - Stripe Buttons
// -------------------------------------------------------------

function initJoinPage() {
  const buttons = document.querySelectorAll("[data-mbs-stripe-join]");
  buttons.forEach(btn =>
    btn.addEventListener("click", () => showSpinner())
  );
}

// -------------------------------------------------------------
// SUCCESS PAGE - Stripe confirmation
// -------------------------------------------------------------

function initSuccessPage() {
  showSpinner();

  const url = new URL(window.location.href);
  const sessionId = url.searchParams.get("session_id");
  const successFlag = url.searchParams.get("success") === "true";

  const statusEl =
    document.querySelector("[data-checkout-status]") ||
    document.getElementById("checkout-status");

  if (sessionId || successFlag) {
    try { localStorage.setItem("mbs_joined", "true"); } catch(e){}
    if (statusEl) {
      statusEl.textContent = "Payment confirmed. Welcome to MyBox Studio!";
    }
  } else {
    if (statusEl) {
      statusEl.textContent =
        "If you completed payment, your studio should now be active.";
    }
  }

  setTimeout(hideSpinner, 600);
}
