require('./polyfills/custom_event.js')

var Updater = require('./updater.js')

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
    })
    stockageLocal.charger(profil)
    document.getElementById('delete-data').addEventListener('click', function (event) {
        event.preventDefault()
        profil.resetData()
        stockageLocal.supprimer()
        router.navigate('introduction')
    })
})()
