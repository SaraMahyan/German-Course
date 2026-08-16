const CACHE_NAME = "german-survival-cache-v17";
const ASSETS = [
  "./",
  "./index.html",
  "./index2.html",
  "./manifest.json",
  "./icon.svg"
];

// Install Service Worker and cache assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch assets from cache if offline
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Return cached asset or make a network request
      return cachedResponse || fetch(e.request).catch(() => {
        // Fallback if network fails and resource is not in cache
        if (e.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
