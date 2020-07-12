importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Workbox berhasil dimuat`);
  workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1" },

    { url: "/nav.html", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/pages/teamdetail.html", revision: "1" },
    { url: "/pages/standing.html", revision: "1" },
    { url: "/pages/teams.html", revision: "1" },
    { url: "/pages/saved.html", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/nav.js", revision: "1" },
    { url: "/js/api.js", revision: "1" },
    { url: "/push.js", revision: "1" },
    { url: "/js/idb.js", revision: "1" },
    { url: "/js/db.js", revision: "1" },
    { url: "/js/detail.js", revision: "1" },
    { url: "/js/index.js", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/img/logo.png", revision: "1" },
    { url: "/img/laliga.webp", revision: "1" },
    { url: "/img/apple.png", revision: "1" },
  ]);

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg|ico|webp)$/,
    workbox.strategies.cacheFirst({
      cacheName: "images-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2"),
    workbox.strategies.staleWhileRevalidate()
  );

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
    })
  );

  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-resources",
    })
  );

  workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "pages",
    })
  );
} else {
  console.log(`Workbox gagal dimuat`);
}

//Response Push Notification
self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    image: "img/logo.png",
    badge: "img/logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
