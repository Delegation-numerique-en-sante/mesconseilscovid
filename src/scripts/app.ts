import type ProfilData from './profil'
import type { SuiviImages } from './suivi'
import Profil from './profil'
import StockageLocal from './stockage'
import { hideElement, showElement } from './affichage'
import { Questionnaire } from './questionnaire'
import { joursAvant } from './utils'

import { Router } from './router'
import Updater from './updater'

import introduction from './page/introduction'

import nouvelleversion from './page/nouvelleversion'

import nom from './page/questionnaire/nom'

import vaccins from './page/questionnaire/vaccins'
import historique from './page/questionnaire/historique'
import symptomes from './page/questionnaire/symptomes'
import depistage from './page/questionnaire/depistage'
import contactarisque from './page/questionnaire/contactarisque'
import situation from './page/questionnaire/situation'
import sante from './page/questionnaire/sante'
import conseils from './page/conseils'

import suiviintroduction from './page/suiviintroduction'
import suivisymptomes from './page/suivisymptomes'
import suivihistorique from './page/suivihistorique'

import {
    beforeConseils,
    beforeSuiviIntroduction,
    beforeSuiviSymptomes,
    beforeSuiviHistorique,
} from './questionnaire'

import { registerPlausible } from './plausible'
import { registerATInternet } from './atinternet'

export default class App {
    profil: Profil
    stockage: StockageLocal
    questionnaire: Questionnaire
    suiviImages: SuiviImages
    source: any
    _plausibleTrackingEvents: string[]
    _plausible: Function
    atinternet: Function
    router: Router
    updater: Updater

    constructor(suiviImages: SuiviImages) {
        this.profil = new Profil()
        this.stockage = new StockageLocal()
        this.questionnaire = new Questionnaire()
        this.suiviImages = suiviImages
    }
    initStats() {
        return this.initSource().then((source: string) => {
            this.source = source
            this._plausibleTrackingEvents = []
            this._plausible = registerPlausible(window)
            this.atinternet = registerATInternet()
        })
    }
    initSource() {
        const searchParams = new URLSearchParams(window.location.search)
        const sourceFromUrl =
            searchParams.get('source') || searchParams.get('utm_source')
        if (sourceFromUrl) {
            // On mémorise la source présente dans l’URL.
            return this.stockage.setSource(sourceFromUrl)
        } else {
            // On se rappelle de la source précédemment stockée.
            return this.stockage.getSource()
        }
    }
    init() {
        this.router = new Router(this)
        this.updater = new Updater(this.router)
        return this.chargerProfilActuel()
    }
    setupRoutes() {
        this.router.addAppRoute('introduction', introduction, {
            pageTitle: '',
        })

        this.router.addAppRoute('nom', nom)

        this.router.addQuestionnaireRoute('vaccins', vaccins)
        this.router.addQuestionnaireRoute('historique', historique)
        this.router.addQuestionnaireRoute('symptomes', symptomes)
        this.router.addQuestionnaireRoute('contactarisque', contactarisque)
        this.router.addQuestionnaireRoute('depistage', depistage)
        this.router.addQuestionnaireRoute('situation', situation)
        this.router.addQuestionnaireRoute('sante', sante)

        this.router.addAppRoute('conseils', conseils, { beforeFunc: beforeConseils })
        this.router.addAppRoute('suiviintroduction', suiviintroduction, {
            beforeFunc: beforeSuiviIntroduction,
        })
        this.router.addAppRoute('suivisymptomes', suivisymptomes, {
            beforeFunc: beforeSuiviSymptomes,
        })
        this.router.addAppRoute('suivihistorique', suivihistorique, {
            beforeFunc: beforeSuiviHistorique,
        })
        this.router.addRoute('conditionsutilisation', (element: HTMLElement) => {
            if (this.profil.isComplete()) {
                showElement(element.querySelector('.js-profil-full'))
                hideElement(element.querySelector('.js-profil-empty'))
            }
        })

        this.router.addRoute('nouvelleversiondisponible', (element: HTMLElement) => {
            const route = this.router.lastRouteResolved()
            const urlParams = new URLSearchParams(route.query)
            const origine = urlParams.get('origine')

            nouvelleversion(element, this, origine)
        })
    }
    setupRedirects() {
        // Compatibilité avec les anciens noms de pages.
        this.router.navigo.on(
            new RegExp('^(symptomesactuels|symptomespasses|debutsymptomes)$'),
            () => {},
            {
                before: (done: Function) => {
                    this.router.redirectTo('symptomes')
                    done(false)
                },
            }
        )
        this.router.navigo.on(new RegExp('^(residence|foyer|activitepro)$'), () => {}, {
            before: (done: Function) => {
                this.router.redirectTo('situation')
                done(false)
            },
        })
        this.router.navigo.on(
            new RegExp('^(caracteristiques|antecedents)$'),
            () => {},
            {
                before: (done: Function) => {
                    this.router.redirectTo('sante')
                    done(false)
                },
            }
        )
        this.router.navigo.on('pediatrie', () => {}, {
            before: function (done: Function) {
                window.location.replace('conseils-pour-les-enfants.html')
                done(false)
            },
        })
    }
    chargerProfilActuel() {
        return this.stockage.getProfilActuel().then((nom) => {
            if (nom !== null) {
                return this.chargerProfil(nom)
            } else {
                return
            }
        })
    }
    enregistrerProfilActuel() {
        return this.stockage.enregistrer(this.profil)
    }
    creerProfil(nom: string) {
        this.profil.resetData(nom)
        return this.stockage.setProfilActuel(nom).then(() => {
            return this.enregistrerProfilActuel()
        })
    }
    creerProfilsTypes() {
        const listeDepistage: ('Positif' | 'Négatif' | 'En attente' | 'Pas testé')[] = [
            'Positif',
            'Négatif',
            'En attente',
            'Pas testé',
        ]
        const listeSymptomes: (
            | 'Symptômes actuels graves'
            | 'Symptômes actuels'
            | 'Symptômes actuels non évocateurs'
            | 'Symptômes passés'
            | 'Contact à risque'
            | 'Contact pas vraiment à risque'
            | 'Rien de tout ça'
        )[] = [
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
                    promises.push(this.creerProfilType(depistage, symptomes, true))
                    promises.push(this.creerProfilType(depistage, symptomes, false))
                }
                promises.push(this.creerProfilType(depistage, symptomes, false))
            }
        }
        return Promise.all(promises)
    }
    creerProfilType(
        depistage: 'Positif' | 'Négatif' | 'En attente' | 'Pas testé',
        symptomes:
            | 'Symptômes actuels graves'
            | 'Symptômes actuels'
            | 'Symptômes actuels non évocateurs'
            | 'Symptômes passés'
            | 'Contact à risque'
            | 'Contact pas vraiment à risque'
            | 'Rien de tout ça',
        personneFragile: boolean
    ) {
        let nom = `${depistage} + ${symptomes}`
        if (personneFragile) {
            nom = `${nom} + personne fragile`
        }
        return this.stockage.getProfil(nom).then((profil: ProfilData) => {
            if (profil === null) {
                profil = new Profil(nom)
                profil.fillTestData(depistage, symptomes, personneFragile)
                return this.stockage.enregistrer(profil)
            } else {
                console.error(`Le profil "${nom}" existe déjà`)
            }
        })
    }
    basculerVersProfil(nom: string) {
        return this.stockage.setProfilActuel(nom).then(() => {
            return this.stockage.getProfil(nom).then((profil: ProfilData) => {
                if (profil) {
                    return this.chargerProfil(nom)
                } else {
                    return this.creerProfil(nom)
                }
            })
        })
    }
    chargerProfil(nom: string) {
        this.profil.nom = nom
        return this.stockage.charger(this.profil)
    }
    supprimerProfil(nom: string) {
        return this.stockage.supprimer(nom).then(() => {
            if (this.profil.nom === nom) {
                this.profil.nom = ''
                this.stockage.setProfilActuel(undefined)
            }
        })
    }
    supprimerSuivi(nom: string) {
        return this.basculerVersProfil(nom).then((profil: Profil) => {
            profil.resetSuivi()
            return this.stockage.enregistrer(profil)
        })
    }
    supprimerTout() {
        return this.stockage.supprimerTout().then(() => {
            this.profil.resetData()
        })
    }
    goToNextPage(currentPage: string) {
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
    trackPageView(pageName: string) {
        this.plausible('pageview', {
            lang: this._preferedLanguages(),
        })
        this.atinternet(pageName)
    }
    _preferedLanguages(): string[] {
        // cf. https://stackoverflow.com/a/25603630
        // @ts-expect-error
        // eslint-disable-next-line compat/compat
        return navigator.languages || [navigator.language || navigator.userLanguage]
    }
    plausible(
        eventName: string,
        props: {
            source?: string
            profil?: string
            lang?: string[]
            service?: string
            reponse?: string
            chemin?: string
        } = {}
    ) {
        // Ajoute la source de la visite.
        if (this.source) {
            props['source'] = this.source
        }
        // Ajoute l’info sur le profil (pour moi ou pour un proche).
        if (typeof this.profil.nom !== 'undefined') {
            props['profil'] = this.profil.estMonProfil() ? 'moi' : 'proche'
        }
        return this._envoieEvenementPlausible(eventName, props)
    }
    _envoieEvenementPlausible(eventName: string, props: {}) {
        const options: { props?: {} } = {}
        if (Object.keys(props).length > 0) {
            options['props'] = props
        }
        try {
            return this._plausible(eventName, options)
        } catch (error) {
            let message
            if (error instanceof Error) {
                message = error.message
            } else {
                message = String(error)
            }
            new Image().src =
                document.body.dataset.statsUrl +
                '/api/error?message=' +
                encodeURIComponent(message)
        }
    }
    premierDemarrageFormulaire() {
        if (typeof this.profil.questionnaire_start_date === 'undefined') {
            this.profil.questionnaire_start_date = new Date()
            this.enregistrerProfilActuel()
            this.plausible('Questionnaire commencé')
            if (this.profil.estMonProfil()) {
                this.plausible('Questionnaire commencé pour moi')
            } else {
                this.plausible('Questionnaire commencé pour un proche')
            }
        }
    }
}
