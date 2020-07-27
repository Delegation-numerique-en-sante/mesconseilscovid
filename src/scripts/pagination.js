var affichage = require('./affichage.js')

var getCurrentPageName = function () {
    var hash = document.location.hash
    return hash ? hash.slice(1) : ''
}

var redirectToUnansweredQuestions = function (page, profil) {
    if (page === 'introduction') return
    if (page === 'pediatrie') return
    if (page === 'medecinedutravail') return
    if (page === 'conditionsutilisation') return
    if (page === 'nouvelleversiondisponible') return
    if (page === 'nom') return

    // Suivi
    if (page === 'suiviintroduction' && profil.isComplete()) return

    if (page === 'suividate' && profil.isComplete()) return

    if (page === 'suivisymptomes' && profil.isComplete())
        return profil.hasSymptomesStartDate() ? undefined : 'suividate'

    if (
        page === 'suivihistorique' &&
        profil.isComplete() &&
        profil.hasSymptomesStartDate()
    ) {
        return profil.hasHistorique() ? undefined : 'suiviintroduction'
    }

    // Questions obligatoires

    if (typeof profil.departement === 'undefined' && page !== 'residence')
        return 'residence'

    if (page === 'residence') return

    if (typeof profil.activite_pro === 'undefined' && page !== 'activitepro')
        return 'activitepro'

    // Si la personne a coché une activité pro, on propose à nouveau cet écran
    // pour prendre en compte la nouvelle case : profession libérale.
    if (
        profil.activite_pro &&
        typeof profil.activite_pro_liberal === 'undefined' &&
        page !== 'activitepro'
    )
        return 'activitepro'

    if (page === 'activitepro') return

    if (typeof profil.foyer_enfants === 'undefined' && page !== 'foyer') return 'foyer'

    if (page === 'foyer') return

    if (
        (typeof profil.age === 'undefined' || profil.age < 15) &&
        page !== 'caracteristiques'
    )
        return 'caracteristiques'

    if (page === 'caracteristiques') return

    if (typeof profil.antecedent_cardio === 'undefined' && page !== 'antecedents')
        return 'antecedents'

    if (page === 'antecedents') return

    if (typeof profil.symptomes_actuels === 'undefined' && page !== 'symptomesactuels')
        return 'symptomesactuels'

    if (page === 'symptomesactuels') return

    if (profil.symptomes_actuels === true && !profil.symptomes_actuels_autre)
        return page === 'conseils' ? undefined : 'conseils'

    if (typeof profil.symptomes_passes === 'undefined' && page !== 'symptomespasses')
        return 'symptomespasses'

    if (page === 'symptomespasses') return

    if (profil.symptomes_passes === true)
        return page === 'conseils' ? undefined : 'conseils'

    if (typeof profil.contact_a_risque === 'undefined' && page !== 'contactarisque')
        return 'contactarisque'

    if (page === 'contactarisque') return

    return page === 'conseils' ? undefined : 'conseils'
}

var loadPage = function (pageName, app) {
    var page = document.querySelector('section#page')
    var section = document.querySelector('#' + pageName)
    var clone = section.cloneNode(true)
    page.innerHTML = '' // Flush the current content.
    var element = page.insertAdjacentElement('afterbegin', clone.firstElementChild)

    if (app) {
        affichage.showMeOrThem(element, app.profil)
    }

    if (pageName !== 'introduction') {
        element.scrollIntoView({ behavior: 'smooth' })
    }
    return element
}

module.exports = {
    getCurrentPageName,
    redirectToUnansweredQuestions,
    loadPage,
}
