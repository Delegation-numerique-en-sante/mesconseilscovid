/* eslint-env serviceworker */

/* Implementation of the network-or-cache pattern:
https://serviceworke.rs/strategy-network-or-cache.html */

/* https://parceljs.org/languages/javascript/#service-workers */

import { manifest, version } from '@parcel/service-worker'

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
                if (key !== version) {
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
    return caches.open(version).then(function (cache) {
        return cache.addAll(cachedFiles(manifest))
    })
}

function cachedFiles(manifest) {
    let files = []
    for (let path of manifest) {
        if (files.indexOf(path) !== -1) continue // duplicate
        if (path.startsWith('/illustrations/')) continue
        if (path.startsWith('/solidarites-sante-gouv-fr-')) continue
        if (path.endsWith('.pdf')) continue
        if (path.endsWith('.woff')) continue
        if (path.endsWith('.xml')) continue
        files.push(path)
    }
    return files
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
    return caches.open(version).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match')
        })
    })
}
