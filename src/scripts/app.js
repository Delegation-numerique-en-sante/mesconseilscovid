import Profil from './profil'
import { StockageLocal } from './stockage.js'
import { joursAvant } from './utils.js'

var Router = require('./router.js')
var Updater = require('./updater.js').Updater

class App {
    constructor() {
        this.profil = new Profil()
        this.stockage = new StockageLocal()
    }
    init() {
        this.router = Router.initRouter(this)
        this.updater = new Updater(this.router)
        return this.chargerProfilActuel()
    }
    chargerProfilActuel() {
        return this.stockage.getProfilActuel().then((nom) => {
            return this.chargerProfil(nom)
        })
    }
    enregistrerProfilActuel() {
        return this.stockage.enregistrer(this.profil)
    }
    creerProfil(nom) {
        this.profil.resetData(nom)
        return this.stockage.setProfilActuel(nom).then(() => {
            return this.enregistrerProfilActuel()
        })
    }
    basculerVersProfil(nom) {
        return this.stockage.setProfilActuel(nom).then(() => {
            return this.chargerProfil(nom)
        })
    }
    chargerProfil(nom) {
        this.profil.nom = nom
        return this.stockage.charger(this.profil, nom)
    }
    supprimerProfil(nom) {
        return this.stockage.supprimer(nom).then(() => {
            if (this.profil.nom === nom) {
                this.profil.nom = undefined
                this.stockage.setProfilActuel(undefined)
            }
        })
    }
    supprimerSuivi(nom) {
        return this.basculerVersProfil(nom).then((profil) => {
            profil.resetSuivi()
            return this.stockage.enregistrer(profil)
        })
    }
    supprimerTout() {
        return this.stockage.supprimerTout().then(() => {
            this.profil.resetData()
        })
    }

    loadFakeSuiviData() {
        // Useful to be able to test the deconfinement page.
        this.profil.symptomes_start_date = joursAvant(11)
        this.profil.suivi_start_date = joursAvant(11)
        this.profil.suivi = [
            {
                date: joursAvant(1).toJSON(),
                symptomes: true,
                essoufflement: 'mieux',
                etatGeneral: 'mieux',
                etatPsychologique: 'mieux',
                alimentationHydratation: 'non',
                fievre: 'non',
                diarrheeVomissements: 'non',
                mauxDeTete: 'non',
                toux: 'non',
            },
        ]
        this.enregistrerProfilActuel()
    }
}

module.exports = {
    App,
}
