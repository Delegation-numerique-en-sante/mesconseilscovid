import { bindCalendar, bindFeedback, bindImpression } from '../actions.js'
import {
    displayBlocks,
    displayElementById,
    hideSelector,
    showElement,
    showMeOrThem,
} from '../affichage.js'
import * as injection from '../injection.js'

import incidenceParDepartement from '../data/incidence.js'

import AlgorithmeOrientation from '../algorithme/orientation.js'
import AlgorithmeSuivi from '../algorithme/suivi.js'

export default function conseils(element, app) {
    // Hide all conseils that might have been made visible on previous runs.
    hideSelector(element, '.visible')

    // Make sure we (re-)show profile-specific text.
    showMeOrThem(element, app.profil)

    // Use custom illustration if needed.
    var extraClass = getCustomIllustrationName(app.profil)
    if (extraClass) {
        element.querySelector('#conseils-block').classList.add(extraClass)
    }

    var algoOrientation = new AlgorithmeOrientation(app.profil, incidenceParDepartement)

    // Première complétion du formulaire ?
    if (!app.profil.questionnaire_completed) {
        app.profil.questionnaire_completed = true
        app.enregistrerProfilActuel()
        window.plausible(`Questionnaire terminé`)
    }

    // Activer / désactiver l’auto-suivi pour ce profil ?
    if (algoOrientation.recommandeAutoSuivi() && !app.profil.suivi_active) {
        app.profil.suivi_active = true
        app.enregistrerProfilActuel()
    } else if (app.profil.suivi_active && !app.profil.hasSuiviStartDate()) {
        app.profil.suivi_active = false
        app.enregistrerProfilActuel()
    }

    // Display appropriate conseils.
    showRelevantBlocks(element, app.profil, algoOrientation)

    if (app.profil.hasSuiviStartDate() && app.profil.hasHistorique()) {
        if (app.profil.hasDeconfinementDate()) {
            // Afficher le bloc de déconfinement
            displayElementById(element, 'deconfinement')
        } else {
            // Afficher le bloc de résultats de l’auto-suivi
            const algoSuivi = new AlgorithmeSuivi(app.profil)
            displayElementById(element, 'suivi')
            showRelevantSuiviBlocks(element, algoSuivi)
            showRelevantEvolutionsRecap(element, algoSuivi)
        }

        // Cacher le bloc de statut si on est en auto-suivi.
        hideSelector(element, '#conseils-statut')

        // Cacher le bloc de recommandation de l’auto-suivi
        // si on l’a déjà démarré.
        hideSelector(element, '.conseil-autosuivi')
    }

    // Dynamic data injections.
    showRelevantAnswersRecap(element, app.profil, algoOrientation)

    // Show instructions to install PWA (iOS) or add bookmark (others).
    if (isMobileSafari()) {
        const isPWA = navigator.standalone
        if (!isPWA) {
            showElement(element.querySelector('.browser-mobile-safari'))
        }
    } else {
        showElement(element.querySelector('.browser-other'))
    }

    // Make the buttons clickable with appropriated actions.
    bindFeedback(element.querySelector('.feedback-component'))
    bindImpression(element)
    if (app.profil.hasSuiviStartDate()) {
        bindCalendar(element, app.profil)
    }
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

function showRelevantSuiviBlocks(element, algoSuivi) {
    var blockNames = [algoSuivi.graviteBlockNameToDisplay()]
    if (algoSuivi.psy !== 0) {
        blockNames.push(algoSuivi.psyBlockNameToDisplay())
    }
    if (algoSuivi.profil.hasHistorique()) {
        blockNames.push('conseil-autosuivi-historique')
    }
    displayBlocks(element, blockNames)
}

export function showRelevantBlocks(element, profil, algoOrientation) {
    var blockNames = statutBlockNamesToDisplay(algoOrientation)
    blockNames = blockNames.concat(
        algoOrientation.conseilsPersonnelsBlockNamesToDisplay()
    )
    blockNames = blockNames.concat(algoOrientation.departementBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.activiteProBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.foyerBlockNamesToDisplay())
    blockNames = blockNames.concat(
        algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay()
    )
    displayBlocks(element, blockNames)
}

function showRelevantEvolutionsRecap(element, algoSuivi) {
    var blockNames = algoSuivi.evolutionsBlockNamesToDisplay()
    if (blockNames.length) {
        showElement(element.querySelector('.reponse'))
        displayBlocks(element, blockNames)
    }
}

export function showRelevantAnswersRecap(element, profil, algoOrientation) {
    injection.titreConseils(element.querySelector('#conseils-block-titre'), profil)

    injection.departement(element.querySelector('#nom-departement'), profil.departement)
    var lienPrefecture = element.querySelector('#lien-prefecture')
    if (lienPrefecture) {
        injection.lienPrefecture(lienPrefecture, profil.departement)
    }

    // We need to target more specifically given there are two similar ids.
    var selector
    if (profil.hasSymptomesActuelsReconnus()) {
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
        injection.caracteristiquesARisques(nomCaracteristiquesARisques, algoOrientation)
    }
    var nomAntecedents = subElement.querySelector('#nom-antecedents')
    if (nomAntecedents) {
        injection.antecedents(nomAntecedents, algoOrientation)
    }
    var nomSymptomesActuels = subElement.querySelector('#nom-symptomesactuels')
    if (nomSymptomesActuels) {
        injection.symptomesactuels(nomSymptomesActuels, algoOrientation)
    }
}

function statutBlockNamesToDisplay(algoOrientation) {
    return ['statut-' + algoOrientation.statut]
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
