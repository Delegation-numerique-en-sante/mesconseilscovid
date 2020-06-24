require('./polyfills/custom_event.js')

var Updater = require('./updater.js')
var actions = require('./actions.js')
var StockageLocal = require('./stockage.js').StockageLocal
var Profil = require('./profil.js').Profil

class App {
    constructor() {
        this.profil = new Profil()
        this.stockage = new StockageLocal()
    }
    init() {
        this.chargerProfilActuel()
    }
    chargerProfilActuel() {
        this.stockage.getProfilActuel().then((nom) => {
            this.chargerProfil(nom)
        })
    }
    enregistrerProfilActuel() {
        this.stockage.getProfilActuel().then((nom) => {
            this.stockage.enregistrer(this.profil, nom)
        })
    }
    basculerVersProfil(nom) {
        this.stockage.setProfilActuel(nom).then(() => {
            this.chargerProfil(nom)
        })
    }
    chargerProfil(nom) {
        this.stockage.charger(this.profil, nom)
    }
    supprimerTout() {
        this.profil.resetData()
        this.stockage.supprimer()
    }
}

var app = new App()
window.app = app

var Router = require('./router.js')
var router = Router.initRouter(app)
window.router = router
;(function () {
    document.addEventListener('dataLoaded', function () {
        router.resolve()
        var updater = new Updater(router)
        updater.checkForUpdatesEvery(10) // Minutes.
        var footer = document.querySelector('footer')
        actions.bindSuppression(footer, app, router)
    })
    app.init()
})()
