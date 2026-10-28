
const CACHE_NAME = "ghostframe-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon.svg"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
            .then(() => self.clients.claim())
    );
});


self.addEventListener("fetch", event => {

    const request = event.request;

    // Only cache GET requests.
    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Keep external requests out of the app cache.
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(

        caches.match(request)
            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request);
            })
    );
});
