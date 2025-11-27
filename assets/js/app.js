// FILE: assets/js/app.js
// GLOBAL CONTROLLER FOR MYBOX STUDIOS
// - Handles spinner
// - Highlights navigation
// - Loads studio list on browse page
// - Keeps everything safe if elements are missing

(function () {
  const body = document.body;
  const page = body ? (body.dataset.mbsPage || "").toLowerCase() : "";

  /* -----------------------------
     SPINNER CONTROL
  ----------------------------- */
  function hideSpinner() {
    const spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.style.opacity = "0";
      spinner.style.pointerEvents = "none";
      // Remove after fade
      setTimeout(() => {
        if (spinner && spinner.parentNode) {
          spinner.parentNode.removeChild(spinner);
        }
      }, 300);
    }
  }

  function initSpinner() {
    // Hide after DOM is ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(hideSpinner, 80);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(hideSpinner, 80);
      });
    }

    // Extra safety: hide again on full load
    window.addEventListener("load", () => {
      setTimeout(hideSpinner, 80);
    });
  }

  /* -----------------------------
     NAVIGATION HIGHLIGHT
  ----------------------------- */
  function highlightNav() {
    try {
      const path = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
      const links = document.querySelectorAll(
        "header nav a, .top-nav .nav-center a, .bottom-nav .bottom-item"
      );

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        let isActive = false;

        // Treat / and /index.html as same
        if (href === "index.html") {
          if (path === "/" || path.endsWith("/index.html")) {
            isActive = true;
          }
        } else if (path.endsWith("/" + href)) {
          isActive = true;
        }

        if (isActive) {
          link.classList.add("active");
        }
      });
    } catch (err) {
      console.error("Nav highlight error:", err);
    }
  }

  /* -----------------------------
     BROWSE PAGE: LOAD STUDIOS
     (browse.html)
  ----------------------------- */
  async function initBrowsePage() {
    if (page !== "browse") return;

    const container = document.getElementById("studioList");
    if (!container) return;

    // If browse.html still has inline script that already filled this, skip
    if (container.children.length > 0) return;

    try {
      const res = await fetch("/data/studios.json?v=" + Date.now());
      if (!res.ok) throw new Error("studios.json not found");
      const json = await res.json();

      container.innerHTML = "";

      if (!json.studios || !json.studios.length) {
        container.innerHTML = "<p>No studios have been created yet.</p>";
        return;
      }

      json.studios.forEach((studio) => {
        const link = document.createElement("a");
        link.className = "studio-card";
        link.href = `studio.html?slug=${encodeURIComponent(studio.slug)}`;

        const type = (studio.type || "mixed").toUpperCase();
        const owner = studio.owner_email || "creator@myboxstudioapp.com";

        link.innerHTML = `
          <div class="studio-name">${studio.display_name || studio.slug}</div>
          <div class="studio-meta">
            Type: ${type}<br/>
            Owner: ${owner}
          </div>
        `;

        container.appendChild(link);
      });
    } catch (err) {
      console.error("Failed to load studios:", err);
      container.innerHTML = "<p>Unable to load studios right now.</p>";
    }
  }

  /* -----------------------------
     PAGE DISPATCHER
  ----------------------------- */
  function initPage() {
    highlightNav();

    if (page === "browse") {
      initBrowsePage();
    }

    // If you later want custom logic:
    // if (page === "home") { ... }
    // if (page === "music") { ... }
    // if (page === "movies") { ... }
    // if (page === "join") { ... }
  }

  /* -----------------------------
     BOOTSTRAP
  ----------------------------- */
  initSpinner();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
})();
