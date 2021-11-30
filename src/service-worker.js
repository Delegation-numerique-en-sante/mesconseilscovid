/* eslint-env serviceworker */

/* Implementation of the network-or-cache pattern:
https://serviceworke.rs/strategy-network-or-cache.html */
const CACHE_NAME = 'network-or-cache-2021-11-29@16h'
const CACHE_FILES = self.__precacheManifest
    .map((e) => e.url)
    .filter((url) => !url.endsWith('.pdf'))
const TIMEOUT = 2000 // ms.

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed')

    evt.waitUntil(precache())
})

self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        console.log('Activating service worker now (skip waiting)')
        self.skipWaiting()
    }
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        deleteOldCaches().then(() => {
            console.log('The service worker is ready to handle fetches')
        })
    )
})

function deleteOldCaches() {
    return caches.keys().then((keys) =>
        Promise.all(
            keys.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('Deleting old cache', key)
                    return caches.delete(key)
                }
            })
        )
    )
}

self.addEventListener('fetch', function (evt) {
    evt.respondWith(
        fromNetwork(evt.request, TIMEOUT).catch(function () {
            console.debug(`Service worker serving ${evt.request.url} from cache`)
            return fromCache(evt.request)
        })
    )
})

function precache() {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(CACHE_FILES)
    })
}

function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout)

        fetch(request).then(function (response) {
            clearTimeout(timeoutId)
            fulfill(response)
        }, reject)
    })
}

function fromCache(request) {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match')
        })
    })
}
