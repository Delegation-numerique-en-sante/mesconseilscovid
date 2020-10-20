import {
    bindCalendar,
    bindFeedback,
    bindImpression,
    bindSuppressionTotale,
} from '../actions.js'
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
    // Make sure we show profile-specific text.
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
    bindSuppressionTotale(element.querySelector('.js-suppression'), app)
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
    const profil = algoSuivi.profil
    const blockNames = [algoSuivi.graviteBlockNameToDisplay()]
    if (algoSuivi.psy !== 0) {
        blockNames.push(algoSuivi.psyBlockNameToDisplay())
    }
    if (profil.hasHistorique()) {
        blockNames.push('suivi-bloc-liens')
        blockNames.push('conseils-personnels-titre')
        blockNames.push('conseils-sante-historique-symptomes')

        // eslint-disable-next-line no-extra-semi
        ;[].forEach.call(element.querySelectorAll('.suivi-repetition'), (elem) => {
            injection.suiviRepetition(elem, profil)
        })

        // eslint-disable-next-line no-extra-semi
        ;[].forEach.call(element.querySelectorAll('.suivi-derniere-fois'), (elem) => {
            injection.suiviDerniereFois(elem, profil)
        })
    }
    displayBlocks(element, blockNames)
}

export function showRelevantBlocks(element, profil, algoOrientation) {
    var blockNames = statutBlockNamesToDisplay(algoOrientation)
    blockNames = blockNames.concat(
        algoOrientation.conseilsPersonnelsBlockNamesToDisplay()
    )
    blockNames = blockNames.concat(algoOrientation.isolementBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.depistageBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.gestesBarriereBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.vieQuotidienneBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.activiteProBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.grossesseBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.santeBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.foyerBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.enfantsBlockNamesToDisplay())
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

    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(
        element.querySelectorAll('.nom-caracteristiques-a-risques'),
        (elem) => {
            injection.caracteristiquesARisques(elem, algoOrientation)
        }
    )

    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(element.querySelectorAll('.nom-antecedents'), (elem) => {
        injection.antecedents(elem, algoOrientation)
    })
}

function statutBlockNamesToDisplay(algoOrientation) {
    const statut = `statut-${algoOrientation.statutEtConseils.statut}`
    return [statut]
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
