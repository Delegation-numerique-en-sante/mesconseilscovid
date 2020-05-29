require('./polyfills/custom_event.js')

var Updater = require('./updater.js')

var StockageLocal = require('./stockage.js')
var stockageLocal = new StockageLocal()
window.stockageLocal = stockageLocal

var Profil = require('./profil.js')
var profil = new Profil()
window.profil = profil

window.resetPrivateData = function (event) {
    event.preventDefault()
    profil.resetData()
    stockageLocal.supprimer()
    router.navigate('introduction')
}

window.updater = new Updater()

var Router = require('./router.js')
window.router = Router.initRouter()
;(function () {
    document.addEventListener('dataLoaded', function () {
        router.resolve()
        updater.checkForUpdatesEvery(10) // Minutes.
    })
    stockageLocal.charger(profil)
    document.getElementById('delete-data').addEventListener('click', resetPrivateData)
})()
