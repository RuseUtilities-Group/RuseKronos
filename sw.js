const cacheName = "rusekronos";
const staticAssets = [
    './',
    './index.html',
    './styles/main.css',
    './scripts/index.js',
    './scripts/timer.js',
    './manifest.webmanifest',
    './scripts/timetable.js',
    './styles/images/kronosicon.png',
    './styles/images/kronosicon_192x192.png',
    './styles/images/kronosicon_512x512.png',
    './scripts/bellTimes.json',
    './script/ical.js',
    './script/clock.js',
    './script/settingsTheme.js'
];

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', e => {
    self.clients.claim();
});

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if(url.origin === location.origin){
        e.respondWith(cacheFirst(req));
    } else{
        e.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req){
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try{
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch(e){
        const cached = await cache.match(req);
        return cached;
    }
}
