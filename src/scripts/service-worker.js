const cacheName = 'dummyVersion'

self.addEventListener('fetch', function (event) {
    console.log(cacheName)
    event.respondWith(fetch(event.request))
})
