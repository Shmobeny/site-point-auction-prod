const STATIC_CACHE = `app-static-${new Date().getTime()}`;
const DYNAMIC_CACHE = `app-dynamic-${new Date().getTime()}`;

const ASSETS = [
  "/",
  "/bets",
  "/piechart",
  "/timer",
  "/index.html",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0",
  "https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&display=swap"
];

// install service worker
self.addEventListener("install", e => {
  // console.log("Service Worker has been installed", e);
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        cache.addAll(ASSETS).catch(err => console.log("Error while trying to put item in STATIC_CACHE", err));
      })
      .catch(err => console.log("Error during caching", err))
  );
});
//
// service worker activation event 
self.addEventListener("activate", e => {
  // console.log("Service Worker has been activated", e);
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map(key => caches.delete(key))
      )
    })
  );
});

// fetch event
self.addEventListener("fetch", e => {
  // console.log("Fetch event", e);
  e.respondWith(
    caches.match(e.request)
      .then(cacheRes => {
        return cacheRes || fetch(e.request)
          .then(fetchRes => {
            return caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(e.request.url, fetchRes.clone()).catch(err => console.log("Error while trying to put item in DYNAMIC_CACHE", err));
                return fetchRes;
              })
          })
      })
      .catch(err => console.log("Error during fetch event", err))
  )
});