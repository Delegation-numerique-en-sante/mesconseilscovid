require('./polyfills/custom_event.js')

var Updater = require('./updater.js')
var actions = require('./actions.js')

var StockageLocal = require('./stockage.js')
var stockageLocal = new StockageLocal()

var Profil = require('./profil.js')
var profil = new Profil()

var Router = require('./router.js')
var router = Router.initRouter(profil, stockageLocal)
window.router = router
;(function () {
    document.addEventListener('dataLoaded', function () {
        router.resolve()
        var updater = new Updater(router)
        updater.checkForUpdatesEvery(10) // Minutes.
        var footer = document.querySelector('footer')
        actions.bindSuppression(footer, profil, stockageLocal, router)
    })
    stockageLocal.charger(profil)
})()
