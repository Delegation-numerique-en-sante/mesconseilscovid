/* Implementation of the network-or-cache pattern:
https://serviceworke.rs/strategy-network-or-cache.html */
const CACHE_NAME = 'network-or-cache-2020-06-23'
const CACHE_FILES = [
    '/',
    'style.css',
    'fonts/marianne-regular-webfont.woff2',
    'fonts/marianne-bold-webfont.woff2',
    'scripts/main.js',
    'marianne.png',
    'arrow-left.svg',
    'map-marker2.svg',
    'printer.svg',
    'select.svg',
    'star.svg',
    'trash.svg',
    'illustrations/accueil.svg',
    'illustrations/activitepro.svg',
    'illustrations/antecedents.svg',
    'illustrations/caracteristiques.svg',
    'illustrations/contactarisque.svg',
    'illustrations/foyer.svg',
    'illustrations/pediatrieecole.svg',
    'illustrations/pediatriegeneral.svg',
    'illustrations/pediatriemedical.svg',
    'illustrations/residence.svg',
    'illustrations/symptomesactuels.svg',
    'illustrations/symptomespasses.svg',
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
