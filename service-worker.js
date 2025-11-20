/* MyBox Studios Service Worker v2 */
/* PWA + Offline Support + Google Play Safe */

const CACHE_VERSION = "mbs-v2";
const CORE_CACHE = [
  "/index.html",
  "/offline.html",
  "/assets/css/styles.css",
  "/assets/js/app.js"
];

// -------------------------------
// INSTALL – Cache Shell
// -------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(CORE_CACHE);
    })
  );
  self.skipWaiting();
});

// -------------------------------
// ACTIVATE – Remove Old Caches
// -------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// -------------------------------
// FETCH HANDLER
// -------------------------------
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ---------------------------
  // HTML – ONLINE FIRST
  // ---------------------------
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          const copy = networkRes.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(req, copy);
          });
          return networkRes;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION);
          return (
            (await cache.match(req)) ||
            (await cache.match("/offline.html"))
          );
        })
    );
    return;
  }

  // ---------------------------
  // STATIC ASSETS – CACHE FIRST
  // ---------------------------
  if (["style", "script", "image", "font"].includes(req.destination)) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          cache.put(req, fresh.clone());
          return fresh;
        } catch {
          return new Response("", { status: 504 });
        }
      })
    );
    return;
  }

  // ---------------------------
  // MEDIA (audio/video) – NETWORK FIRST
  // ---------------------------
  if (["audio", "video"].includes(req.destination)) {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch {
          return new Response(
            "Media unavailable offline.",
            { status: 503, statusText: "Offline Media Unavailable" }
          );
        }
      })()
    );
  }
});

