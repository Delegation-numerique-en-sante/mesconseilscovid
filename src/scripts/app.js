import Profil from './profil'
import StockageLocal from './stockage'
import { Questionnaire } from './questionnaire'
import { joursAvant } from './utils'

import { initRouter } from './router'
import Updater from './updater'

import { registerPlausible } from './plausible'
import { registerATInternet } from './atinternet'

export default class App {
    constructor() {
        this.profil = new Profil()
        this.stockage = new StockageLocal()
        this.questionnaire = new Questionnaire()

        // Statistiques.
        this._plausibleTrackingEvents = []
        this._plausible = registerPlausible(window)
        this.atinternet = registerATInternet()

        this.source = new URLSearchParams(window.location.search).get('source')
    }
    init() {
        this.router = initRouter(this)
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
    creerProfilsTypes() {
        const listeDepistage = ['Positif', 'Négatif', 'En attente', 'Pas testé']
        const listeSymptomes = [
            'Symptômes actuels graves',
            'Symptômes actuels',
            'Symptômes actuels non évocateurs',
            'Symptômes passés',
            'Contact à risque',
            'Contact pas vraiment à risque',
            'Rien de tout ça',
        ]
        let promises = []
        for (let d = 0; d < listeDepistage.length; d++) {
            for (let s = 0; s < listeSymptomes.length; s++) {
                const depistage = listeDepistage[d]
                const symptomes = listeSymptomes[s]
                if (
                    (depistage === 'Négatif' &&
                        (symptomes === 'Symptômes passés' ||
                            symptomes === 'Contact pas vraiment à risque' ||
                            symptomes === 'Rien de tout ça')) ||
                    (depistage === 'Pas testé' &&
                        (symptomes === 'Contact pas vraiment à risque' ||
                            symptomes === 'Rien de tout ça'))
                ) {
                    promises.push(
                        this.creerProfilType(depistage, symptomes, true, false)
                    )
                    promises.push(
                        this.creerProfilType(depistage, symptomes, false, true)
                    )
                }
                promises.push(this.creerProfilType(depistage, symptomes, false, false))
            }
        }
        return Promise.all(promises)
    }
    creerProfilType(depistage, symptomes, personneFragile) {
        let nom = `${depistage} + ${symptomes}`
        if (personneFragile) {
            nom = `${nom} + personne fragile`
        }
        return this.stockage.getProfil(nom).then((profil) => {
            if (profil === null) {
                profil = new Profil(nom)
                profil.fillTestData(depistage, symptomes, personneFragile)
                return this.stockage.enregistrer(profil)
            } else {
                console.error(`Le profil "${nom}" existe déjà`)
            }
        })
    }
    basculerVersProfil(nom) {
        return this.stockage.setProfilActuel(nom).then(() => {
            return this.chargerProfil(nom)
        })
    }
    chargerProfil(nom) {
        this.profil.nom = nom
        return this.stockage.charger(this.profil)
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
    goToNextPage(currentPage) {
        const nextPage = this.questionnaire.nextPage(currentPage, this.profil)
        this.router.navigate(nextPage)
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
    plausible(eventName) {
        const searchParams = new URLSearchParams(window.location.search)
        const options = {}
        if (searchParams.toString().length) {
            const props = {}
            const source = searchParams.get('source')
            if (source) {
                props['source'] = source
            }
            const intention = searchParams.get('intention')
            if (intention) {
                props['intention'] = intention
            }
            if (props) {
                options['props'] = props
            }
        }
        return this._plausible(eventName, options)
    }
}
