/* eslint-env serviceworker */

/* Implementation of the network-or-cache pattern:
https://serviceworke.rs/strategy-network-or-cache.html */
const CACHE_NAME = 'network-or-cache-2022-03-21'
const CACHE_FILES = [
    '/',
    'robots.txt',
    'style.css',
    'scripts/main.js',
    'cas-contact-a-risque.html',
    'conseils-pour-les-enfants.html',
    'conseils-pour-les-jeunes.html',
    'symptomes-persistants-covid-long.html',
    'j-ai-des-symptomes-covid.html',
    'je-suis-vaccine.html',
    'je-veux-me-faire-vacciner.html',
    'je-vis-avec-personne-covid-positive.html',
    'pass-sanitaire-qr-code-voyages.html',
    'covid-et-travail.html',
    'covid-in-france.html',
    'tests-de-depistage.html',
    'rappel-vaccinal-3e-dose.html',
    'fonts/marianne-regular-webfont.woff2',
    'fonts/marianne-bold-webfont.woff2',
    'site.webmanifest',
    'android-chrome-192x192.png',
    'android-chrome-384x384.png',
    'android-chrome-512x512.png',
    'android-chrome-512x512-maskable.png',
    'apple-touch-icon.png',
    'safari-pinned-tab.svg',
    'mstile-150x150.png',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'marianne.png',
    'arrow-left.svg',
    'arrow-right-white.svg',
    'arrow-right-blue.svg',
    'ei-share-apple.svg',
    'printer.svg',
    'feedback-negatif.svg',
    'feedback-positif.svg',
    'feedback-contact.svg',
    'feedback-partager.svg',
    'feedback-flag.svg',
    'feedback-social-messenger.svg',
    'feedback-social-whatsapp.svg',
    'logo-titre.png',
    'logo-carre.png',
    'select.svg',
    'star.svg',
    'trash.svg',
    'plus-circle.svg',
    'user-circle.svg',
    'user-circle-blue.svg',
    'icone_video.svg',
    'icone_fiche.svg',
    'icone_infographie.svg',
    'timeline-arrow.svg',
    'illustrations/activitepro.svg',
    'illustrations/contact_medecin.svg',
    'illustrations/contactarisque.svg',
    'illustrations/covid.svg',
    'illustrations/depistage.svg',
    'illustrations/deplacements.svg',
    'illustrations/foyer.svg',
    'illustrations/gestesbarrieres.svg',
    'illustrations/grossesse.svg',
    'illustrations/isolement.svg',
    'illustrations/jeunes.svg',
    'illustrations/nom.svg',
    'illustrations/pass_sanitaire.svg',
    'illustrations/pediatrieecole.svg',
    'illustrations/pediatriegeneral.svg',
    'illustrations/pediatriemedical.svg',
    'illustrations/sante.svg',
    'illustrations/situation.svg',
    'illustrations/symptomesactuels.svg',
    'illustrations/symptomespasses.svg',
    'illustrations/travail.svg',
    'illustrations/vaccins.svg',
    'suivi_gravite.svg',
    'suivi_gravite_superieure.svg',
    'suivi_ok.svg',
    'suivi_stable.svg',
    'suivi_interrogation.svg',
]
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
