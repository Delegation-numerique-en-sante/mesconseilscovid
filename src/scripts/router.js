import Navigo from 'navigo'

import { hideElement, showElement } from './affichage'
import { nomProfil } from './injection'
import { getCurrentPageName, loadPage } from './pagination'
import { titleCase } from './utils'

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

class Router {
    constructor(app) {
        this.app = app

        const navigo = this.initNavigo()
        this.navigo = navigo

        const initialTitle = document.title

        this.setupGlobalHooks()

        function addQuestionnaireRoute(pageName, view, pageTitle) {
            const beforeFunc = (profil) => {
                if (typeof profil.nom === 'undefined') {
                    profil.resetData('mes_infos')
                }
                return app.questionnaire.before(pageName, profil)
            }
            addAppRoute(pageName, view, beforeFunc, pageTitle)
        }

        function addAppRoute(pageName, view, before, pageTitle) {
            const viewFunc = (element) => {
                view(element, app)
            }
            addRoute(pageName, viewFunc, before, pageTitle)
        }

        function addRoute(pageName, viewFunc, beforeFunc, pageTitle) {
            navigo.on(
                new RegExp('^' + pageName + '$'),
                () => {
                    var element = loadPage(pageName, app)
                    updateTitle(element, pageName, pageTitle, app.profil)
                    fillProgress(element, pageName)
                    fillNavigation(element, pageName)
                    viewFunc(element)
                    app.trackPageView(pageName)
                    const page = element.parentElement
                    page.classList.remove('loading')
                    page.classList.add('ready')
                },
                {
                    before: (done) => {
                        if (typeof beforeFunc === 'undefined') {
                            done()
                            return
                        }

                        const target = beforeFunc(app.profil, app.questionnaire)
                        if (target && target !== pageName) {
                            redirectTo(target)
                            done(false)
                        } else {
                            done()
                        }
                    },
                }
            )
        }

        // A11Y: mise à jour du titre dynamiquement.
        function updateTitle(element, pageName, pageTitle, profil) {
            let titlePrefix = pageTitle
            if (typeof pageTitle === 'undefined') {
                const titleElem = element.querySelector('h1, #conseils-block-titre, h2')
                if (titleElem) {
                    titlePrefix = titleElem.innerText
                } else {
                    titlePrefix = titleCase(pageName)
                }
            }
            const separator = titlePrefix ? ' — ' : ''
            const numeroEtape = app.questionnaire.numeroEtape(pageName, profil)
            const etape = numeroEtape ? ` (étape ${numeroEtape})` : ''
            document.title = titlePrefix + etape + separator + initialTitle
        }

        function fillProgress(element, pageName) {
            const progress = element.querySelector('.progress')
            if (progress) {
                progress.innerText = app.questionnaire.etapesRestantes(pageName)
            }
        }

        function fillNavigation(element, pageName) {
            const boutonRetour = element.querySelector(
                'form .back-button, .form-controls .back-button'
            )
            if (boutonRetour) {
                const previousPage = app.questionnaire.previousPage(
                    pageName,
                    app.profil
                )
                if (previousPage) {
                    boutonRetour.setAttribute('href', `#${previousPage}`)
                }
            }

            Array.from(element.querySelectorAll('.premiere-question')).forEach(
                (lien) => {
                    lien.setAttribute('href', `#${app.questionnaire.firstPage}`)
                }
            )
        }

        function redirectTo(target) {
            if (
                typeof window !== 'undefined' &&
                window.history &&
                window.history.replaceState
            ) {
                // Replace current page with target page in the browser history
                // so that we don’t break the back button.
                window.history.replaceState({}, '', `#${target}`)
                navigo.resolve()
            } else {
                navigo.navigate(target)
            }
        }

        addAppRoute('introduction', introduction, undefined, '') // accueil : pas de titre

        addAppRoute('nom', nom)

        addQuestionnaireRoute('vaccins', vaccins)
        addQuestionnaireRoute('historique', historique)
        addQuestionnaireRoute('symptomes', symptomes)
        addQuestionnaireRoute('contactarisque', contactarisque)
        addQuestionnaireRoute('depistage', depistage)
        addQuestionnaireRoute('situation', situation)
        addQuestionnaireRoute('sante', sante)

        addAppRoute('conseils', conseils, beforeConseils)
        addAppRoute('suiviintroduction', suiviintroduction, beforeSuiviIntroduction)
        addAppRoute('suivisymptomes', suivisymptomes, beforeSuiviSymptomes)
        addAppRoute('suivihistorique', suivihistorique, beforeSuiviHistorique)

        addRoute('pediatrie', (element) => {
            if (app.profil.isComplete()) {
                showElement(element.querySelector('.js-profil-full'))
                hideElement(element.querySelector('.js-profil-empty'))
            }
        })

        addRoute('conditionsutilisation', (element) => {
            if (app.profil.isComplete()) {
                showElement(element.querySelector('.js-profil-full'))
                hideElement(element.querySelector('.js-profil-empty'))
            }
        })

        addRoute('nouvelleversiondisponible', (element) => {
            const route = this.navigo.lastRouteResolved()
            const urlParams = new URLSearchParams(route.query)
            const origine = urlParams.get('origine')

            nouvelleversion(element, app, origine)
        })

        // Legacy redirects.
        this.navigo.on(
            new RegExp('^(symptomesactuels|symptomespasses|debutsymptomes)$'),
            () => {},
            {
                before: (done) => {
                    redirectTo('symptomes')
                    done(false)
                },
            }
        )
        this.navigo.on(new RegExp('^(residence|foyer|activitepro)$'), () => {}, {
            before: (done) => {
                redirectTo('situation')
                done(false)
            },
        })
        this.navigo.on(new RegExp('^(caracteristiques|antecedents)$'), () => {}, {
            before: (done) => {
                redirectTo('sante')
                done(false)
            },
        })

        this.navigo.notFound(() => {
            redirectTo('introduction')
        })
    }

    initNavigo() {
        const root = null
        const useHash = true
        const navigo = new Navigo(root, useHash)

        // Workaround unwanted behaviour in Navigo.
        if (navigo.root.slice(-1) !== '/') {
            navigo.root = navigo.root + '/'
        }

        return navigo
    }

    setupGlobalHooks() {
        this.navigo.hooks({
            before: this.beforeGlobalHook.bind(this),
            after: this.afterGlobalHook.bind(this),
        })
    }

    beforeGlobalHook(done) {
        var header = document.querySelector('header section')
        if (typeof this.app.profil.nom === 'undefined') {
            showElement(header.querySelector('.js-profil-empty'))
            hideElement(header.querySelector('.js-profil-full'))
        } else {
            showElement(header.querySelector('.js-profil-full'))
            hideElement(header.querySelector('.js-profil-empty'))
            nomProfil(header.querySelector('#nom-profil-header'), this.app)
        }
        done()
    }

    afterGlobalHook() {
        this.sendPageChangeEvent()
    }

    sendPageChangeEvent() {
        const pageName = getCurrentPageName()
        document.dispatchEvent(new CustomEvent('pageChanged', { detail: pageName }))
    }

    focusMainHeaderElement() {
        // A11Y: keyboard navigation
        document.querySelector('[role="banner"]').focus()
    }
}

export function initRouter(app) {
    return new Router(app).navigo
}
