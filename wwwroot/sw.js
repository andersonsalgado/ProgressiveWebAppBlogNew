
importScripts('lib/localforage/localforage.min.js');
"use strict";
//Installing
//Pre-cache App Shell
self.addEventListener('install', function (event) {
    console.log("SW: Evento de Instalacao");
    self.skipWaiting();
});
//Activating
//Clean up
self.addEventListener('activate', function (event) {
    console.log("SW: Evento de Ativacao");
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    console.log('SW: Evento de fetch ' +
        event.request.url);
});
self.addEventListener('push', function (event) {
    event.waitUntil(self.registration.showNotification('Maki Blog!', {
 body: event.data.text(),
        icon: '/images/notification.png'
 }));
});
var cacheName = 'v1Cache';
var blogCacheFiles = [
    '/',
    '/sw.js',
    '/lib/bootstrap/dist/css/bootstrap.css',
    '/css/site.css',
    '/lib/jquery/dist/jquery.js',
    '/lib/bootstrap/dist/js/bootstrap.bundle.js',
    '/lib/es6-promise/es6-promise.js',
    '/lib/fetch/fetch.js',
    '/lib/systemjs/system.js',
    '/lib/localforage/localforage.min.js',
    '/lib/localforage/localforage-getitems.js',
    '/lib/localforage/localforage-setitems.js',
    '/js/site.js',
    '/js/app.js',
    '/manifest.json',
    '/favicon.ico',
    '/js/blogService.js',
    '/js/swRegister.js',
    '/js/template.js',
    '/lib/showdown/showdown.js',
    '/js/clientStorage.js',
    '/img/icons/icon-72x72.png',
    '/img/icons/icon-96x96.png',
    '/img/icons/icon-128x128.png',
    '/img/icons/icon-152x152.png',
    '/img/icons/icon-192x192.png',
    '/img/icons/icon-384x384.png',
    '/img/icons/icon-512x512.png'
];

event.waitUntil(
    caches.open(cacheName)
        .then(function (cache) {
            return cache.addAll(blogCacheFiles)
        })
);

event.waitUntil(
    caches.keys()
        .then(function (cacheKeys) {
            var deletePromises = [];
            for (var i = 0; i < cacheKeys.length;
                i++) {
                if (cacheKeys[i] != cacheName) {
                    deletePromises.push(caches.delete(cacheKeys[i]));
                }
            }
            return Promise.all(deletePromises);
        })
);
if (event.request.url.toLowerCase().includes("/home")) {
    console.log('[ServiceWorker] online - get online '
        + event.request.url);
    event.respondWith(fetch(event.request));
} else {
    event.respondWith(
        timeout(1000,
            fetch(event.request)).catch(function () {
                console.log('[ServiceWorker] offline - get from cache: ' + event.request.url);
                return caches.match(event.request);
            })
    );
}

setBackgroundFetch: function (link) {
    if (!'BackgroundFetchManager' in self) {
        alert('background fetch não está disponível neste site');
        return;
    }
    navigator.serviceWorker.ready.then(async (swReg) => {
        const bgFetch = await swReg.backgroundFetch.fetch(link,
            ['/Home/Post/?link=' + link], {
                title: link,
                icons: [{
                    sizes: '192x192',
                    src: 'img/icons/icon-192x192.png',
                    type: 'image/png',
                }],
                downloadTotal: 15000,
            });
        bgFetch.addEventListener('progress', () => {
            if (!bgFetch.downloadTotal) return;
            const percent = Math.round(bgFetch.downloaded /
                bgFetch.downloadTotal * 100);
            console.log('Download progress: ' + percent + '%');
            console.log('Download status: ' + bgFetch.result);
            $('.download-start').hide();
            $('#status-download').show();
            $('#status-download > .progress > .progress-bar').css('width',
                percent + '%');
            if (bgFetch.result === 'success') {
                $('#status-download > .text-success').show();
            }
        });
    });
}

self.addEventListener('backgroundfetchsuccess', (event) => {
    const bgFetch = event.registration;
    event.waitUntil(async function () {
        var blogInstance = localforage.createInstance({
            name: 'blog'
        });
        const records = await bgFetch.matchAll();
        const promises = records.map(async (record) => {
            const response = await record.responseReady;
            response.text().then(function (text) {
                console.log("text retrieved");
                blogInstance.setItem('#' + bgFetch.id, text);
            });
        });
        await Promise.all(promises);
        event.updateUI({ title: 'Done!' });
    }());
});
