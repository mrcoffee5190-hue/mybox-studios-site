// FILE: assets/js/watch.js
// PURPOSE: Load the correct movie/track on watch.html from a studio's JSON file.

(function () {
  const params = new URLSearchParams(window.location.search);
  const studioSlug = params.get("studio");
  const itemId = params.get("id");
  const typeParam = (params.get("type") || "").toLowerCase();

  const videoEl = document.getElementById("watchVideo");
  const sourceEl = document.getElementById("videoSource");
  const titleEl = document.querySelector(".watch-title");
  const creatorNameEl = document.querySelector(".creator-name");
  const descEl = document.querySelector(".description-text");
  const upNextItems = document.querySelectorAll(".up-next-item");

  function showError(message) {
    if (titleEl) titleEl.textContent = "Content not found";
    if (descEl) descEl.textContent = message || "We couldn't load this content.";
    if (videoEl && sourceEl) {
      sourceEl.removeAttribute("src");
      videoEl.removeAttribute("poster");
      videoEl.load();
    }
  }

  // Basic validation
  if (!studioSlug || !itemId) {
    showError("Missing content link. Try going back to the studio page.");
    return;
  }

  const studioJsonUrl =
    "/data/studios/" + encodeURIComponent(studioSlug) + ".json?v=" + Date.now();

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
        return;
      }

      // ----- Set main content -----
      if (titleEl) titleEl.textContent = item.title || "Untitled";

      if (videoEl && sourceEl) {
        if (item.video_url) {
          sourceEl.src = item.video_url;
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

      if (creatorNameEl) {
        const displayName = data.display_name || item.creator || "Studio";
        creatorNameEl.textContent = displayName;
      }

      if (descEl) {
        descEl.textContent =
          item.description || "No description has been added yet.";
      }

      // ----- Up Next sidebar -----
      const remaining = items.filter((i) => String(i.id) !== String(itemId));
      const upNextList = remaining.slice(0, upNextItems.length);

      upNextItems.forEach((slot, index) => {
        const dataItem = upNextList[index];

        if (!dataItem) {
          // Hide extra slots if not enough items
          slot.style.display = "none";
          return;
        }

        slot.style.display = "flex";

        const thumb = slot.querySelector(".up-next-thumb");
        const title = slot.querySelector(".up-next-title");
        const meta = slot.querySelector(".up-next-meta");

        if (thumb) {
          // reset
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

        if (title) {
          title.textContent = dataItem.title || "Untitled";
        }

        if (meta) {
          const bits = [];

          if (dataItem.duration_minutes) {
            bits.push(`${dataItem.duration_minutes} min`);
          }
          if (dataItem.price !== undefined && dataItem.price !== null) {
            const priceNum = Number(dataItem.price);
            if (!isNaN(priceNum) && priceNum > 0) {
              bits.push(`$${priceNum.toFixed(2)}`);
            } else {
              bits.push("Free / Preview");
            }
          }

          meta.textContent = bits.join(" • ");
        }

        // Click → load that item
        slot.onclick = () => {
          const nextType = (dataItem.type || typeParam || "movie").toLowerCase();
          const url =
            "watch.html?" +
            "type=" + encodeURIComponent(nextType) +
            "&id=" + encodeURIComponent(dataItem.id) +
            "&studio=" + encodeURIComponent(studioSlug);
          window.location.href = url;
        };
      });
    })
    .catch((err) => {
      console.error("Watch page load error:", err);
      showError("Unable to load this studio right now.");
    });
})();
