var affichage = require('./affichage.js')
var Algorithme = require('./algorithme.js').Algorithme
var actions = require('./actions.js')
var injection = require('./injection.js')

function page(element, app) {
    // Hide all conseils that might have been made visible on previous runs.
    affichage.hideSelector(element, '.visible')

    // Use custom illustration if needed
    var extraClass = getCustomIllustrationName(app.profil)
    if (extraClass) {
        element.querySelector('#conseils-block').classList.add(extraClass)
    }

    var algorithme = new Algorithme(app.profil)

    // Display appropriate conseils.
    showRelevantBlocks(element, app.profil, algorithme)

    // Dynamic data injections.
    showRelevantAnswersRecap(element, app.profil, algorithme)

    // Show instructions to install PWA (iOS) or add bookmark (others)
    if (isMobileSafari()) {
        const isPWA = navigator.standalone
        if (!isPWA) {
            affichage.showElement(element.querySelector('.browser-mobile-safari'))
        }
    } else {
        affichage.showElement(element.querySelector('.browser-other'))
    }

    // Make the buttons clickable with appropriated actions.
    actions.bindImpression(element)
}

function getCustomIllustrationName(profil) {
    if (profil.symptomes_actuels) {
        return 'symptomes-actuels'
    }
    if (profil.symptomes_passes) {
        return 'symptomes-passes'
    }
    if (profil.contact_a_risque) {
        return 'contact-a-risque'
    }
}

function showRelevantBlocks(element, profil, algorithme) {
    var blockNames = statutBlockNamesToDisplay(algorithme)
    blockNames = blockNames.concat(algorithme.conseilsPersonnelsBlockNamesToDisplay())
    blockNames = blockNames.concat(algorithme.departementBlockNamesToDisplay())
    blockNames = blockNames.concat(algorithme.activiteProBlockNamesToDisplay())
    blockNames = blockNames.concat(algorithme.foyerBlockNamesToDisplay())
    blockNames = blockNames.concat(
        algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
    )
    affichage.displayBlocks(element, blockNames)
}

function showRelevantAnswersRecap(element, profil, algorithme) {
    injection.titreConseils(element.querySelector('#conseils-block-titre'), profil)
    injection.departement(element.querySelector('#nom-departement'), profil.departement)
    var lienPrefecture = element.querySelector('#lien-prefecture')
    if (lienPrefecture) {
        injection.lienPrefecture(lienPrefecture, profil.departement)
    }

    // We need to target more specifically given there are two similar ids.
    var selector
    if (algorithme.symptomesActuelsReconnus) {
        selector = '#conseils-personnels-symptomes-actuels'
    } else {
        selector = '#conseils-caracteristiques'
    }
    var subElement = element.querySelector(selector)
    if (!subElement) return
    var nomCaracteristiquesARisques = subElement.querySelector(
        '#nom-caracteristiques-a-risques'
    )
    if (nomCaracteristiquesARisques) {
        injection.caracteristiquesARisques(nomCaracteristiquesARisques, algorithme)
    }
    var nomAntecedents = subElement.querySelector('#nom-antecedents')
    if (nomAntecedents) {
        injection.antecedents(nomAntecedents, algorithme)
    }
    var nomSymptomesActuels = subElement.querySelector('#nom-symptomesactuels')
    if (nomSymptomesActuels) {
        injection.symptomesactuels(nomSymptomesActuels, algorithme)
    }
}

function statutBlockNamesToDisplay(algorithme) {
    return ['statut-' + algorithme.statut]
}

function isMobileSafari() {
    const ua = window.navigator.userAgent
    const isIPad = !!ua.match(/iPad/i)
    const isIPhone = !!ua.match(/iPhone/i)
    const isIOS = isIPad || isIPhone
    const isWebkit = !!ua.match(/WebKit/i)
    const isChrome = !!ua.match(/CriOS/i)
    return isIOS && isWebkit && !isChrome
}

module.exports = {
    page,
    showRelevantBlocks,
    showRelevantAnswersRecap,
}
