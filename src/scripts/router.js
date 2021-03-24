import Navigo from 'navigo'

import { hideElement, showElement } from './affichage'
import { nomProfil } from './injection'
import { getCurrentPageName, loadPage } from './pagination'

import introduction from './page/introduction'

import nouvelleversion from './page/nouvelleversion'

import nom from './page/questionnaire/nom'

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

export function initRouter(app) {
    var root = null
    var useHash = true
    var router = new Navigo(root, useHash)

    // Workaround unwanted behaviour in Navigo.
    if (router.root.slice(-1) !== '/') {
        router.root = router.root + '/'
    }

    router.hooks({
        before: function (done) {
            var header = document.querySelector('header section')
            if (typeof app.profil.nom === 'undefined') {
                showElement(header.querySelector('#js-profil-empty-header'))
                hideElement(header.querySelector('#js-profil-full-header'))
            } else {
                showElement(header.querySelector('#js-profil-full-header'))
                hideElement(header.querySelector('#js-profil-empty-header'))
                nomProfil(header.querySelector('#nom-profil-header'), app)
            }
            done()
        },
        after: function () {
            // Global hook to send a custom event on each page change.
            var pageName = getCurrentPageName()
            document.dispatchEvent(new CustomEvent('pageChanged', { detail: pageName }))
        },
    })

    function addQuestionnaireRoute(pageName, view) {
        function beforeFunc(profil) {
            return app.questionnaire.before(pageName, profil)
        }
        addAppRoute(pageName, view, beforeFunc)
    }

    function addAppRoute(pageName, view, before) {
        function viewFunc(element) {
            view(element, app)
        }
        addRoute(pageName, viewFunc, before)
    }

    function addRoute(pageName, viewFunc, beforeFunc) {
        router.on(
            new RegExp('^' + pageName + '$'),
            function () {
                var element = loadPage(pageName, app)
                fillNavigation(element, pageName)
                viewFunc(element)
                trackPageView(pageName)
                const page = element.parentElement
                page.classList.remove('loading')
                page.classList.add('ready')
            },
            {
                before: function (done) {
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

    function trackPageView(pageName) {
        app.plausible('pageview')
        app.atinternet(pageName)
    }

    function fillNavigation(element, pageName) {
        const progress = element.querySelector('.progress')
        if (progress) {
            progress.innerText = app.questionnaire.progress(pageName)
        }

        const boutonRetour = element.querySelector(
            'form .back-button, .form-controls .back-button'
        )
        if (boutonRetour) {
            const previousPage = app.questionnaire.previousPage(pageName, app.profil)
            if (previousPage) {
                boutonRetour.setAttribute('href', `#${previousPage}`)
            }
        }

        Array.from(element.querySelectorAll('.premiere-question')).forEach((lien) => {
            lien.setAttribute('href', `#${app.questionnaire.firstPage}`)
        })
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
            router.resolve()
        } else {
            router.navigate(target)
        }
    }

    addAppRoute('introduction', introduction)

    addAppRoute('nom', nom)

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

    addRoute('pediatrie', function (element) {
        if (app.profil.isComplete()) {
            showElement(element.querySelector('#js-profil-full'))
            hideElement(element.querySelector('#js-profil-empty'))
        }
    })

    addRoute('conditionsutilisation', function (element) {
        if (app.profil.isComplete()) {
            showElement(element.querySelector('#js-profil-full'))
            hideElement(element.querySelector('#js-profil-empty'))
        }
    })

    addRoute('nouvelleversiondisponible', function (element) {
        const route = router.lastRouteResolved()
        const urlParams = new URLSearchParams(route.query)
        const origine = urlParams.get('origine')

        nouvelleversion(element, app, origine)
    })

    // Legacy redirects.
    router.on(
        new RegExp('^(symptomesactuels|symptomespasses|debutsymptomes)$'),
        function () {},
        {
            before: function (done) {
                redirectTo('symptomes')
                done(false)
            },
        }
    )
    router.on(new RegExp('^(residence|foyer|activitepro)$'), function () {}, {
        before: function (done) {
            redirectTo('situation')
            done(false)
        },
    })
    router.on(new RegExp('^(caracteristiques|antecedents)$'), function () {}, {
        before: function (done) {
            redirectTo('sante')
            done(false)
        },
    })

    router.notFound(function () {
        redirectTo('introduction')
    })

    return router
}
