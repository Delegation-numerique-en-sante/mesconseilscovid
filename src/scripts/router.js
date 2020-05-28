var Navigo = require('navigo')

var affichage = require('./affichage.js')
var algorithme = require('./algorithme.js')
var impression = require('./impression.js')
var geoloc = require('./geoloc.js')

var getCurrentPageName = function () {
    var hash = document.location.hash
    return hash ? hash.slice(1) : ''
}

var redirectToUnansweredQuestions = function (page, questionnaire) {
    if (page === 'introduction') return
    if (page === 'conditionsutilisation') return
    if (page === 'nouvelleversiondisponible') return

    // Questions obligatoires

    if (typeof questionnaire.departement === 'undefined' && page !== 'residence')
        return 'introduction' // aucune réponse = retour à l’accueil

    if (page === 'residence') return

    if (typeof questionnaire.activite_pro === 'undefined' && page !== 'activitepro')
        return 'activitepro'

    if (page === 'activitepro') return

    if (typeof questionnaire.foyer_enfants === 'undefined' && page !== 'foyer')
        return 'foyer'

    if (page === 'foyer') return

    if (typeof questionnaire.sup65 === 'undefined' && page !== 'caracteristiques')
        return 'caracteristiques'

    if (page === 'caracteristiques') return

    if (
        typeof questionnaire.antecedent_cardio === 'undefined' &&
        page !== 'antecedents'
    )
        return 'antecedents'

    if (page === 'antecedents') return

    if (
        typeof questionnaire.symptomes_actuels === 'undefined' &&
        page !== 'symptomesactuels'
    )
        return 'symptomesactuels'

    if (page === 'symptomesactuels') return

    if (questionnaire.symptomes_actuels === true)
        return page === 'conseils' ? undefined : 'conseils'

    if (
        typeof questionnaire.symptomes_passes === 'undefined' &&
        page !== 'symptomespasses'
    )
        return 'symptomespasses'

    if (page === 'symptomespasses') return

    if (questionnaire.symptomes_passes === true)
        return page === 'conseils' ? undefined : 'conseils'

    if (
        typeof questionnaire.contact_a_risque === 'undefined' &&
        page !== 'contactarisque'
    )
        return 'contactarisque'

    if (page === 'contactarisque') return

    return page === 'conseils' ? undefined : 'conseils'
}

var loadPage = function (pageName) {
    var page = document.querySelector('section#page')
    var section = document.querySelector('#' + pageName)
    var clone = section.cloneNode(true)
    page.innerHTML = '' // Flush the current content.
    var element = page.insertAdjacentElement('afterbegin', clone.firstElementChild)
    if (pageName !== 'introduction') {
        element.scrollIntoView({ behavior: 'smooth' })
    }
    return element
}

function initRouter() {
    var root = null
    var useHash = true
    var router = new Navigo(root, useHash)

    // Workaround unwanted behaviour in Navigo
    if (router.root.slice(-1) !== '/') {
        router.root = router.root + '/'
    }

    router.hooks({
        before: function (done, params) {
            // Global hook to redirect on the correct page given registered data.
            var requestedPage = getCurrentPageName() || 'introduction'
            var redirectedPage = redirectToUnansweredQuestions(
                requestedPage,
                questionnaire
            )
            if (redirectedPage) {
                router.navigate(redirectedPage)
            }
            done()
        },
        after: function (params) {
            // Global hook to send a custom event on each page change.
            var pageName = getCurrentPageName()
            var customPageEvent = document.createEvent('CustomEvent')
            customPageEvent.initCustomEvent(
                'pageChanged:' + pageName,
                true,
                true,
                pageName
            )
            document.dispatchEvent(customPageEvent)
        },
    })

    router
        .on(new RegExp('^introduction$'), function () {
            var pageName = 'introduction'
            var element = loadPage(pageName)
            if (questionnaire.isComplete()) {
                affichage.displayElement(element, 'js-questionnaire-full')
                affichage.hideElement(element.querySelector('#js-questionnaire-empty'))
                var mesConseilsLink = element.querySelector('#mes-conseils-link')
                var target = redirectToUnansweredQuestions(
                    'findCorrectExit',
                    questionnaire
                )
                mesConseilsLink.setAttribute('href', '#' + target)
            }
        })
        .on(new RegExp('^residence$'), function () {
            var pageName = 'residence'
            var form = loadPage(pageName)
            var button = form.querySelector('input[type=submit]')
            formUtils.preloadForm(form, 'departement')
            formUtils.toggleFormButtonOnSelectFieldsRequired(
                form,
                button.value,
                'Votre département de résidence est requis'
            )
            affichage.hideSelector(form, '#error-geolocalisation')
            form.querySelector('select').addEventListener('change', function () {
                affichage.hideSelector(form, '#error-geolocalisation')
            })
            form.addEventListener('submit', onSubmitFormScripts[pageName])
            document
                .getElementById('geolocalisation')
                .addEventListener('click', geoloc.geolocalisation)
        })
        .on(new RegExp('^activitepro$'), function () {
            var pageName = 'activitepro'
            var form = loadPage(pageName)
            var button = form.querySelector('input[type=submit]')
            formUtils.preloadCheckboxForm(form, 'activite_pro')
            formUtils.preloadCheckboxForm(form, 'activite_pro_public')
            formUtils.preloadCheckboxForm(form, 'activite_pro_sante')
            var primary = form.elements['activite_pro']
            formUtils.enableOrDisableSecondaryFields(form, primary)
            primary.addEventListener('click', function () {
                formUtils.enableOrDisableSecondaryFields(form, primary)
            })
            formUtils.toggleFormButtonOnCheck(form, button.value, 'Continuer')
            form.addEventListener('submit', onSubmitFormScripts[pageName])
        })
        .on(new RegExp('^foyer$'), function () {
            var pageName = 'foyer'
            var form = loadPage(pageName)
            formUtils.preloadCheckboxForm(form, 'foyer_enfants')
            formUtils.preloadCheckboxForm(form, 'foyer_fragile')
            form.addEventListener('submit', onSubmitFormScripts[pageName])
        })
        .on(new RegExp('^caracteristiques$'), function () {
            var pageName = 'caracteristiques'
            var form = loadPage(pageName)
            var button = form.querySelector('input[type=submit]')
            formUtils.preloadCheckboxForm(form, 'sup65')
            formUtils.preloadCheckboxForm(form, 'grossesse_3e_trimestre')
            formUtils.preloadForm(form, 'taille')
            formUtils.preloadForm(form, 'poids')
            formUtils.toggleFormButtonOnTextFieldsRequired(
                form,
                button.value,
                'Les informations de poids et de taille sont requises'
            )
            form.addEventListener('submit', onSubmitFormScripts[pageName])
        })
        .on(new RegExp('^antecedents$'), function () {
            var pageName = 'antecedents'
            var form = loadPage(pageName)
            var button = form.querySelector('input[type=submit]')
            formUtils.preloadCheckboxForm(form, 'antecedent_cardio')
            formUtils.preloadCheckboxForm(form, 'antecedent_diabete')
            formUtils.preloadCheckboxForm(form, 'antecedent_respi')
            formUtils.preloadCheckboxForm(form, 'antecedent_dialyse')
            formUtils.preloadCheckboxForm(form, 'antecedent_cancer')
            formUtils.preloadCheckboxForm(form, 'antecedent_immunodep')
            formUtils.preloadCheckboxForm(form, 'antecedent_cirrhose')
            formUtils.preloadCheckboxForm(form, 'antecedent_drepano')
            formUtils.preloadCheckboxForm(form, 'antecedent_chronique_autre')
            formUtils.toggleFormButtonOnCheck(form, button.value, 'Continuer')
            form.addEventListener('submit', onSubmitFormScripts[pageName])
        })
        .on(new RegExp('^symptomesactuels$'), function () {
            var pageName = 'symptomesactuels'
            var form = loadPage(pageName)
            var button = form.querySelector('input[type=submit]')
            formUtils.preloadCheckboxForm(form, 'symptomes_actuels')
            formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
            form.addEventListener('submit', onSubmitFormScripts[pageName])
        })
        .on(new RegExp('^symptomespasses$'), function () {
            var pageName = 'symptomespasses'
            var form = loadPage(pageName)
            var button = form.querySelector('input[type=submit]')
            formUtils.preloadCheckboxForm(form, 'symptomes_passes')
            formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
            form.addEventListener('submit', onSubmitFormScripts[pageName])
        })
        .on(new RegExp('^contactarisque$'), function () {
            var pageName = 'contactarisque'
            var form = loadPage(pageName)
            var button = form.querySelector('input[type=submit]')
            formUtils.preloadCheckboxForm(form, 'contact_a_risque')
            formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie')
            formUtils.preloadCheckboxForm(form, 'contact_a_risque_contact_direct')
            formUtils.preloadCheckboxForm(form, 'contact_a_risque_actes')
            formUtils.preloadCheckboxForm(form, 'contact_a_risque_espace_confine')
            formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_classe')
            formUtils.preloadCheckboxForm(form, 'contact_a_risque_autre')
            var primary = form.elements['contact_a_risque']
            formUtils.enableOrDisableSecondaryFields(form, primary)
            primary.addEventListener('click', function () {
                formUtils.enableOrDisableSecondaryFields(form, primary)
            })
            formUtils.toggleFormButtonOnCheckRequired(
                form,
                button.value,
                'Terminer',
                'Vous devez saisir l’un des sous-choix proposés'
            )
            form.addEventListener('submit', onSubmitFormScripts[pageName])
        })
        .on(new RegExp('^conseils$'), function () {
            var pageName = 'conseils'
            var element = loadPage(pageName)
            // Hide all conseils that might have been made visible on previous runs.
            affichage.hideSelector(element, '.visible')

            // Display appropriate conseils.
            var data = algorithme.getData(questionnaire)

            var blockNames = algorithme.statutBlockNamesToDisplay(data)
            blockNames = blockNames.concat(
                algorithme.conseilsPersonnelsBlockNamesToDisplay(data)
            )
            blockNames = blockNames.concat(
                algorithme.departementBlockNamesToDisplay(data)
            )
            blockNames = blockNames.concat(
                algorithme.activiteProBlockNamesToDisplay(data)
            )
            blockNames = blockNames.concat(algorithme.foyerBlockNamesToDisplay(data))
            blockNames = blockNames.concat(
                algorithme.caracteristiquesAntecedentsBlockNamesToDisplay(data)
            )
            affichage.displayBlocks(element, blockNames)

            // Make the print button clickable.
            impression.setup(element)

            // Dynamic data injections.
            injectionScripts.departement(element, data)
            injectionScripts.caracteristiques(element, data)
            injectionScripts.antecedents(element, data)
        })
        .on(new RegExp('^conditionsutilisation$'), function () {
            var pageName = 'conditionsutilisation'
            var element = loadPage(pageName)
        })
        .on(new RegExp('^nouvelleversiondisponible$'), function () {
            var pageName = 'nouvelleversiondisponible'
            var element = loadPage(pageName)
        })
        .notFound(function () {
            router.navigate('introduction')
        })

    return router
}

module.exports = {
    getCurrentPageName,
    redirectToUnansweredQuestions,
    initRouter,
}
