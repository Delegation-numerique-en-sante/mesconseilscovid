var Navigo = require('navigo')

import affichage from './affichage'
import pagination from './pagination'
import introduction from './page/introduction'
import nouvelleversion from './page/nouvelleversion'
import questionnaire from './page/questionnaire'
import conseils from './page/conseils'

import suiviintroduction from './page/suiviintroduction'
import suivimedecin from './page/suivimedecin'
import suividate from './page/suividate'
import suivisymptomes from './page/suivisymptomes'
import suivihistorique from './page/suivihistorique'

import injection from './injection'

function initRouter(app) {
    console.debug('initRouter()')
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
                affichage.showElement(header.querySelector('#js-profil-empty-header'))
                affichage.hideElement(header.querySelector('#js-profil-full-header'))
            } else {
                affichage.showElement(header.querySelector('#js-profil-full-header'))
                affichage.hideElement(header.querySelector('#js-profil-empty-header'))
                injection.nomProfil(header.querySelector('#nom-profil-header'), app)
            }
            done()
        },
        after: function () {
            // Global hook to send a custom event on each page change.
            var pageName = pagination.getCurrentPageName()
            document.dispatchEvent(new CustomEvent('pageChanged', { detail: pageName }))
        },
    })

    router
        .on(new RegExp('^introduction$'), function () {
            var pageName = 'introduction'
            var element = pagination.loadPage(pageName)
            introduction.page(element, app)
        })
        .on(new RegExp('^nom$'), function () {
            var pageName = 'nom'
            var form = pagination.loadPage(pageName, app)
            questionnaire.nom(form, app, router)
        })
        .on(new RegExp('^residence$'), function () {
            var pageName = 'residence'
            var form = pagination.loadPage(pageName, app)
            questionnaire.residence(form, app, router)
        })
        .on(
            new RegExp('^foyer$'),
            function () {
                var pageName = 'foyer'
                var form = pagination.loadPage(pageName, app)
                questionnaire.foyer(form, app, router)
            },
            {
                before: function (done) {
                    const target = questionnaire.beforeFoyer(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^antecedents$'),
            function () {
                var pageName = 'antecedents'
                var form = pagination.loadPage(pageName, app)
                questionnaire.antecedents(form, app, router)
            },
            {
                before: function (done) {
                    const target = questionnaire.beforeAntecedents(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^caracteristiques$'),
            function () {
                var pageName = 'caracteristiques'
                var form = pagination.loadPage(pageName, app)
                questionnaire.caracteristiques(form, app, router)
            },
            {
                before: function (done) {
                    const target = questionnaire.beforeCaracteristiques(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^activitepro$'),
            function () {
                var pageName = 'activitepro'
                var form = pagination.loadPage(pageName, app)
                questionnaire.activitepro(form, app, router)
            },
            {
                before: function (done) {
                    const target = questionnaire.beforeActivitePro(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^symptomesactuels$'),
            function () {
                var pageName = 'symptomesactuels'
                var form = pagination.loadPage(pageName, app)
                questionnaire.symptomesactuels(form, app, router)
            },
            {
                before: function (done) {
                    const target = questionnaire.beforeSymptomesActuels(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^symptomespasses$'),
            function () {
                var pageName = 'symptomespasses'
                var form = pagination.loadPage(pageName, app)
                questionnaire.symptomespasses(form, app, router)
            },
            {
                before: function (done) {
                    const target = questionnaire.beforeSymptomesPasses(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^contactarisque$'),
            function () {
                var pageName = 'contactarisque'
                var form = pagination.loadPage(pageName, app)
                questionnaire.contactarisque(form, app, router)
            },
            {
                before: function (done) {
                    const target = questionnaire.beforeContactARisque(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^conseils$'),
            function () {
                var pageName = 'conseils'
                var element = pagination.loadPage(pageName, app)
                conseils.page(element, app)
            },
            {
                before: function (done) {
                    const target = conseils.before(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^suiviintroduction$'),
            function () {
                var pageName = 'suiviintroduction'
                var element = pagination.loadPage(pageName, app)
                suiviintroduction.page(element, app)
            },
            {
                before: function (done) {
                    const target = suiviintroduction.before(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^suivimedecin$'),
            function () {
                var pageName = 'suivimedecin'
                var element = pagination.loadPage(pageName, app)
                suivimedecin.page(element, app, router)
            },
            {
                before: function (done) {
                    const target = suivimedecin.before(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^suividate$'),
            function () {
                var pageName = 'suividate'
                var form = pagination.loadPage(pageName, app)
                suividate.page(form, app, router)
            },
            {
                before: function (done) {
                    const target = suividate.before(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^suivisymptomes$'),
            function () {
                var pageName = 'suivisymptomes'
                var form = pagination.loadPage(pageName, app)
                suivisymptomes.page(form, app, router)
            },
            {
                before: function (done) {
                    const target = suivisymptomes.before(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(
            new RegExp('^suivihistorique$'),
            function () {
                var pageName = 'suivihistorique'
                var element = pagination.loadPage(pageName, app)
                suivihistorique.page(element, app)
            },
            {
                before: function (done) {
                    const target = suivihistorique.before(app.profil)
                    if (target) router.navigate(target)
                    done()
                },
            }
        )
        .on(new RegExp('^pediatrie$'), function () {
            var pageName = 'pediatrie'
            var element = pagination.loadPage(pageName)
            if (app.profil.isComplete()) {
                affichage.showElement(element.querySelector('#js-profil-full'))
                affichage.hideElement(element.querySelector('#js-profil-empty'))
                var mesConseilsLink = element.querySelector('#mes-conseils-link')
                mesConseilsLink.setAttribute('href', '#conseils')
            }
        })
        .on(new RegExp('^medecinedutravail$'), function () {
            var pageName = 'medecinedutravail'
            var element = pagination.loadPage(pageName)
            if (app.profil.isComplete()) {
                affichage.showElement(element.querySelector('#js-profil-full'))
                affichage.hideElement(element.querySelector('#js-profil-empty'))
                var mesConseilsLink = element.querySelector('#mes-conseils-link')
                mesConseilsLink.setAttribute('href', '#conseils')
            }
        })
        .on(new RegExp('^conditionsutilisation$'), function () {
            var pageName = 'conditionsutilisation'
            pagination.loadPage(pageName)
        })
        .on(new RegExp('^nouvelleversiondisponible$'), function () {
            const route = router.lastRouteResolved()
            const urlParams = new URLSearchParams(route.query)
            const origine = urlParams.get('origine')

            var pageName = 'nouvelleversiondisponible'
            var element = pagination.loadPage(pageName)
            nouvelleversion.page(element, app, origine)
        })
        .notFound(function () {
            router.navigate('introduction')
        })

    return router
}

module.exports = {
    initRouter,
}
