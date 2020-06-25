require('./polyfills/custom_event.js')

var Updater = require('./updater.js')
var actions = require('./actions.js')
var StockageLocal = require('./stockage.js').StockageLocal
var Profil = require('./profil.js').Profil
var Router = require('./router.js')

class App {
    constructor() {
        this.profil = new Profil()
        this.stockage = new StockageLocal()
    }
    init() {
        return this.chargerProfilActuel()
    }
    chargerProfilActuel() {
        return this.stockage.getProfilActuel().then((nom) => {
            return this.chargerProfil(nom)
        })
    }
    enregistrerProfilActuel() {
        return this.stockage.getProfilActuel().then((nom) => {
            return this.stockage.enregistrer(this.profil, nom)
        })
    }
    basculerVersProfil(nom) {
        return this.stockage.setProfilActuel(nom).then(() => {
            return this.chargerProfil(nom)
        })
    }
    chargerProfil(nom) {
        return this.stockage.charger(this.profil, nom)
    }
    supprimerTout() {
        return this.stockage.supprimer().then(() => {
            this.profil.resetData()
        })
    }
}

var app = new App()
window.app = app
;(function () {
    app.init()
        .then(() => {
            var router = Router.initRouter(app)
            router.resolve()
            return router
        })
        .then((router) => {
            var updater = new Updater(router)
            updater.checkForUpdatesEvery(10) // Minutes.
            var footer = document.querySelector('footer')
            actions.bindSuppression(footer, app, router)
        })
})()
