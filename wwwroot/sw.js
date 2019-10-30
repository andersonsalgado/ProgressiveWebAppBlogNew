"use strict";
//Installing
//Pre-cache App Shell
importScripts('lib/localforage/localforage.min.js');

var cacheName = 'v8Cache';
var blogCacheFiles = [
    '/',
    '/lib/bootstrap/dist/css/bootstrap.css',
    '/css/site.css',
    '/css/Blog/blog.min.css',
    '/lib/jquery/dist/jquery.js',
    '/lib/bootstrap/dist/js/bootstrap.bundle.js',
    '/lib/localforage/localforage.min.js',
    '/lib/localforage/localforage-getitems.js',
    '/lib/localforage/localforage-setitems.js',
    '/lib/es6-promise/es6-promise.js',
    '/lib/fetch/fetch.js',
    '/lib/systemjs/system.js',
    '/js/site.js',
    '/js/blog.js',
    '/manifest.json',
    '/images/icons/icon-144x144.png',
    '/js/app.js',
    '/js/blogService.js',
    '/js/swRegister.js',
    '/js/template.js',
    '/js/clientStorage.js',
    '/img/Blog/no-image.jpg',
    '/img/Blog/umPost.jpg'
];

function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject();
        }, ms);
        promise.then(resolve, reject);
    });
}

self.addEventListener('install', function (event) {
    console.log("SW: Evento de Instalacao");
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll(blogCacheFiles);
            })
    );
});
//Activating
//Clean up
self.addEventListener('activate', function (event) {
    console.log("SW: Evento de Ativacao");
    self.clients.claim();
    event.waitUntil(
        caches.keys()
            .then(function (cacheKeys) {
                var deletePromises = [];
                for (var i = 0; i < cacheKeys.length;
                    i++) {
                    if (cacheKeys[i] !== cacheName) {

                        deletePromises.push(caches.delete(cacheKeys[i]));
                    }
                }
                return Promise.all(deletePromises);
            })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('SW: Evento de fetch ' + event.request.url);

    if (event.request.url.toLowerCase().includes("/home")) {
        console.log('[ServiceWorker] online - get online ' + event.request.url);
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            timeout(1000, fetch(event.request)).catch(function () {
                console.log('[ServiceWorker] offline - get from cache: ' + event.request.url);
                return caches.match(event.request);
            })
        );
    }

});


self.addEventListener('backgroundfetchsuccess', (event) => {
    
    const bgFetch = event.registration;

    event.waitUntil(async function () {

        var blogInstance = localforage.createInstance({
            name: 'blog'
        });

        const records = await bgFetch.matchAll();

        const promises = records.map(async (record) => {

            const response = await record.responseReady;

            console.log(response);
            console.log(response.text());

            response.text().then(function (text) {

                console.log("text retrieved - storing in indexedDB");
                blogInstance.setItem('#' + bgFetch.id, text);
            });
        });

        await Promise.all(promises);
        event.updateUI({ title: 'Done!' });
    }());
});

    



