import Navigo from 'navigo'

import { hideElement, showElement } from './affichage.js'
import { nomProfil } from './injection.js'
import { getCurrentPageName, loadPage } from './pagination.js'

import * as introduction from './page/introduction.js'
import * as nouvelleversion from './page/nouvelleversion.js'
import * as questionnaire from './page/questionnaire.js'
import * as conseils from './page/conseils.js'

import * as suiviintroduction from './page/suiviintroduction.js'
import * as suivimedecin from './page/suivimedecin.js'
import * as suividate from './page/suividate.js'
import * as suivisymptomes from './page/suivisymptomes.js'
import * as suivihistorique from './page/suivihistorique.js'

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

    function addRoute(pageName, viewFunc, beforeFunc) {
        router.on(
            new RegExp('^' + pageName + '$'),
            function () {
                var element = loadPage(pageName)
                viewFunc(element)
                window.plausible('pageview')
            },
            {
                before: function (done) {
                    if (typeof beforeFunc === 'undefined') {
                        done()
                        return
                    }

                    const target = beforeFunc(app.profil)
                    if (target && target !== pageName) {
                        router.navigate(target)
                        done(false)
                    } else {
                        done()
                    }
                },
            }
        )
    }

    addRoute('introduction', function (element) {
        introduction.page(element, app)
    })

    addRoute('nom', function (element) {
        questionnaire.nom(element, app, router)
    })

    addRoute('residence', function (element) {
        questionnaire.residence(element, app, router)
    })

    addRoute(
        'foyer',
        function (element) {
            questionnaire.foyer(element, app, router)
        },
        questionnaire.beforeFoyer
    )

    addRoute(
        'antecedents',
        function (element) {
            questionnaire.antecedents(element, app, router)
        },
        questionnaire.beforeAntecedents
    )

    addRoute(
        'caracteristiques',
        function (element) {
            questionnaire.caracteristiques(element, app, router)
        },
        questionnaire.beforeCaracteristiques
    )

    addRoute(
        'activitepro',
        function (element) {
            questionnaire.activitepro(element, app, router)
        },
        questionnaire.beforeActivitePro
    )

    addRoute(
        'symptomesactuels',
        function (element) {
            questionnaire.symptomesactuels(element, app, router)
        },
        questionnaire.beforeSymptomesActuels
    )

    addRoute(
        'symptomespasses',
        function (element) {
            questionnaire.symptomespasses(element, app, router)
        },
        questionnaire.beforeSymptomesPasses
    )

    addRoute(
        'contactarisque',
        function (element) {
            questionnaire.contactarisque(element, app, router)
        },
        questionnaire.beforeContactARisque
    )

    addRoute(
        'conseils',
        function (element) {
            conseils.page(element, app, router)
        },
        conseils.before
    )

    addRoute(
        'suiviintroduction',
        function (element) {
            suiviintroduction.page(element, app, router)
        },
        suiviintroduction.before
    )

    addRoute(
        'suivimedecin',
        function (element) {
            suivimedecin.page(element, app, router)
        },
        suivimedecin.before
    )

    addRoute(
        'suividate',
        function (element) {
            suividate.page(element, app, router)
        },
        suividate.before
    )

    addRoute(
        'suivisymptomes',
        function (element) {
            suivisymptomes.page(element, app, router)
        },
        suivisymptomes.before
    )

    addRoute(
        'suivihistorique',
        function (element) {
            suivihistorique.page(element, app, router)
        },
        suivihistorique.before
    )

    addRoute('pediatrie', function (element) {
        if (app.profil.isComplete()) {
            showElement(element.querySelector('#js-profil-full'))
            hideElement(element.querySelector('#js-profil-empty'))
        }
    })

    addRoute('medecinedutravail', function (element) {
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

        nouvelleversion.page(element, app, origine)
    })

    router.notFound(function () {
        router.navigate('introduction')
    })

    return router
}
