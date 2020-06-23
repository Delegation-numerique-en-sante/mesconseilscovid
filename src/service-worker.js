/* Implementation of the network-or-cache pattern:
https://serviceworke.rs/strategy-network-or-cache.html */
const CACHE_NAME = 'network-or-cache-2020-06-15'
const CACHE_FILES = [
    './index.html',
    // TODO: add more.
]
const TIMEOUT = 500 // ms.

self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed')

    evt.waitUntil(precache())
})

self.addEventListener('fetch', function (evt) {
    console.log('The service worker is serving the asset.')

    evt.respondWith(
        fromNetwork(evt.request, TIMEOUT).catch(function () {
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
