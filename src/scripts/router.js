import Navigo from 'navigo'

import { hideElement, showElement } from './affichage.js'
import { nomProfil } from './injection.js'
import { getCurrentPageName, loadPage } from './pagination.js'

import introduction from './page/introduction.js'

import nouvelleversion from './page/nouvelleversion.js'

import nom from './page/questionnaire/nom.js'

import symptomesactuels from './page/questionnaire/symptomesactuels.js'
import depistage from './page/questionnaire/depistage.js'
import symptomespasses from './page/questionnaire/symptomespasses.js'
import contactarisque from './page/questionnaire/contactarisque.js'
import residence from './page/questionnaire/residence.js'
import foyer from './page/questionnaire/foyer.js'
import antecedents from './page/questionnaire/antecedents.js'
import caracteristiques from './page/questionnaire/caracteristiques.js'
import activitepro from './page/questionnaire/activitepro.js'

import conseils from './page/conseils.js'

import suiviintroduction from './page/suiviintroduction.js'
import debutsymptomes from './page/debutsymptomes.js'
import suivisymptomes from './page/suivisymptomes.js'
import suivihistorique from './page/suivihistorique.js'

import {
    beforeConseils,
    beforeSuiviIntroduction,
    beforeDebutSymptomes,
    beforeSuiviSymptomes,
    beforeSuiviHistorique,
} from './questionnaire.js'

export function initRouter(app) {
    var root = null
    var useHash = true
    var router = new Navigo(root, useHash)

    // Workaround unwanted behaviour in Navigo
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
                window.plausible('pageview')
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

    function fillNavigation(element, pageName) {
        const progress = element.querySelector('legend .progress')
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

        // eslint-disable-next-line no-extra-semi
        ;[].forEach.call(element.querySelectorAll('.premiere-question'), (lien) => {
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
            // so that we don’t break the back button
            window.history.replaceState({}, '', `#${target}`)
            router.resolve()
        } else {
            router.navigate(target)
        }
    }

    addAppRoute('introduction', introduction)

    addAppRoute('nom', nom)

    addQuestionnaireRoute('symptomesactuels', symptomesactuels)
    addQuestionnaireRoute('depistage', depistage)
    addQuestionnaireRoute('symptomespasses', symptomespasses)
    addQuestionnaireRoute('contactarisque', contactarisque)
    addQuestionnaireRoute('residence', residence)
    addQuestionnaireRoute('foyer', foyer)
    addQuestionnaireRoute('antecedents', antecedents)
    addQuestionnaireRoute('caracteristiques', caracteristiques)
    addQuestionnaireRoute('activitepro', activitepro)

    addAppRoute('conseils', conseils, beforeConseils)
    addAppRoute('suiviintroduction', suiviintroduction, beforeSuiviIntroduction)
    addAppRoute('debutsymptomes', debutsymptomes, beforeDebutSymptomes)
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

    router.on(new RegExp('^suividate$'), function () {}, {
        before: function (done) {
            redirectTo('debutsymptomes')
            done(false)
        },
    })

    router.notFound(function () {
        redirectTo('introduction')
    })

    return router
}
