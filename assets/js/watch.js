// FILE: assets/js/watch.js
// PURPOSE: Load the correct movie/track on watch.html from a studio's JSON file
// FINAL STABLE VERSION — MATCHES YOUR FILE STRUCTURE EXACTLY

(function () {
  const params = new URLSearchParams(window.location.search);
  const studioSlug = params.get("studio");
  const itemId = params.get("id");
  const typeParam = (params.get("type") || "").toLowerCase();

  // Main elements
  const videoEl = document.getElementById("watchVideo");
  const sourceEl = document.getElementById("videoSource");
  const titleEl = document.querySelector(".watch-title");
  const creatorNameEl = document.querySelector(".creator-name");
  const descEl = document.querySelector(".description-text");
  const upNextItems = document.querySelectorAll(".up-next-item");

  // ✔ OPTIONAL SPINNER SUPPORT (if present in your site)
  const spinner = document.getElementById("global-spinner");
  function showSpinner() {
    if (spinner) spinner.style.display = "flex";
  }
  function hideSpinner() {
    if (spinner) spinner.style.display = "none";
  }

  function showError(message) {
    if (titleEl) titleEl.textContent = "Content Not Found";
    if (descEl) descEl.textContent =
      message || "We couldn't load this content. Try again later.";

    if (videoEl && sourceEl) {
      sourceEl.removeAttribute("src");
      videoEl.removeAttribute("poster");
      videoEl.load();
    }
  }

  // Validate link
  if (!studioSlug || !itemId) {
    showError("Missing content link. Try going back to the studio page.");
    return;
  }

  // Build JSON URL
  const studioJsonUrl =
    "/data/studios/" + encodeURIComponent(studioSlug) + ".json?v=" + Date.now();

  showSpinner();

  fetch(studioJsonUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Studio JSON not found");
      return res.json();
    })
    .then((data) => {
      const items = Array.isArray(data.items) ? data.items : [];
      const item = items.find((i) => String(i.id) === String(itemId));

      if (!item) {
        showError("We couldn't find this item in the studio.");
        hideSpinner();
        return;
      }

      // ----------------------------------
      // MAIN CONTENT LOAD
      // ----------------------------------

      // Title
      if (titleEl) titleEl.textContent = item.title || "Untitled";

      // Creator (uses studio name unless overridden)
      if (creatorNameEl) {
        const displayName =
          item.creator || data.display_name || "MyBox Studio Creator";
        creatorNameEl.textContent = displayName;
      }

      // Description
      if (descEl) {
        descEl.textContent =
          item.description || "No description has been added yet.";
      }

      // Video
      if (videoEl && sourceEl) {
        if (item.video_url) {
          sourceEl.src = item.video_url;

          // Poster image if exists
          if (item.poster) {
            videoEl.setAttribute("poster", item.poster);
          } else {
            videoEl.removeAttribute("poster");
          }

          videoEl.load();
        } else {
          showError("This item doesn't have a video URL yet.");
        }
      }

      // ----------------------------------
      // UP NEXT SIDEBAR
      // ----------------------------------

      const remaining = items.filter((i) => String(i.id) !== String(itemId));

      const upNextList = remaining.slice(0, upNextItems.length);

      upNextItems.forEach((slot, idx) => {
        const dataItem = upNextList[idx];

        if (!dataItem) {
          slot.style.display = "none";
          return;
        }

        slot.style.display = "flex";

        const thumb = slot.querySelector(".up-next-thumb");
        const title = slot.querySelector(".up-next-title");
        const meta = slot.querySelector(".up-next-meta");

        // Thumbnail
        if (thumb) {
          thumb.style.backgroundImage = "";
          thumb.textContent = "";

          if (dataItem.poster) {
            thumb.style.backgroundImage = `url('${dataItem.poster}')`;
            thumb.style.backgroundSize = "cover";
            thumb.style.backgroundPosition = "center";
          } else {
            thumb.textContent = dataItem.type === "music" ? "🎧" : "🎬";
          }
        }

        // Title
        if (title) title.textContent = dataItem.title || "Untitled";

        // Meta info
        if (meta) {
          const bits = [];

          if (dataItem.duration_minutes) {
            bits.push(`${dataItem.duration_minutes} min`);
          }

          if (dataItem.price !== undefined && dataItem.price !== null) {
            const p = Number(dataItem.price);
            bits.push(!isNaN(p) && p > 0 ? `$${p.toFixed(2)}` : "Free / Preview");
          }

          meta.textContent = bits.join(" • ");
        }

        // Click = load next item
        slot.onclick = () => {
          const nextType =
            (dataItem.type || typeParam || "movie").toLowerCase();

          const url =
            "watch.html?" +
            "type=" + encodeURIComponent(nextType) +
            "&id=" + encodeURIComponent(dataItem.id) +
            "&studio=" + encodeURIComponent(studioSlug);

          window.location.href = url;
        };
      });

      hideSpinner();
    })
    .catch((err) => {
      console.error("Watch.js load error:", err);
      showError("Unable to load this studio right now.");
      hideSpinner();
    });
})();
