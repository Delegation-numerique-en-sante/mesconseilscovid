import Navigo from 'navigo'

import { hideElement, showElement } from './affichage.js'
import { nomProfil } from './injection.js'
import { getCurrentPageName, loadPage } from './pagination.js'

import * as introduction from './page/introduction.js'
import * as nouvelleversion from './page/nouvelleversion.js'

import nom from './page/questionnaire/nom.js'
import residence from './page/questionnaire/residence.js'
import { foyer, beforeFoyer } from './page/questionnaire/foyer.js'
import { antecedents, beforeAntecedents } from './page/questionnaire/antecedents.js'
import {
    caracteristiques,
    beforeCaracteristiques,
} from './page/questionnaire/caracteristiques.js'
import { activitepro, beforeActivitePro } from './page/questionnaire/activitepro.js'
import {
    symptomesactuels,
    beforeSymptomesActuels,
} from './page/questionnaire/symptomesactuels.js'
import {
    symptomespasses,
    beforeSymptomesPasses,
} from './page/questionnaire/symptomespasses.js'
import {
    contactarisque,
    beforeContactARisque,
} from './page/questionnaire/contactarisque.js'

import * as conseils from './page/conseils.js'

import * as suiviintroduction from './page/suiviintroduction.js'
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
        nom(element, app, router)
    })

    addRoute('residence', function (element) {
        residence(element, app, router)
    })

    addRoute(
        'foyer',
        function (element) {
            foyer(element, app, router)
        },
        beforeFoyer
    )

    addRoute(
        'antecedents',
        function (element) {
            antecedents(element, app, router)
        },
        beforeAntecedents
    )

    addRoute(
        'caracteristiques',
        function (element) {
            caracteristiques(element, app, router)
        },
        beforeCaracteristiques
    )

    addRoute(
        'activitepro',
        function (element) {
            activitepro(element, app, router)
        },
        beforeActivitePro
    )

    addRoute(
        'symptomesactuels',
        function (element) {
            symptomesactuels(element, app, router)
        },
        beforeSymptomesActuels
    )

    addRoute(
        'symptomespasses',
        function (element) {
            symptomespasses(element, app, router)
        },
        beforeSymptomesPasses
    )

    addRoute(
        'contactarisque',
        function (element) {
            contactarisque(element, app, router)
        },
        beforeContactARisque
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
