import applyDetailsSummaryPolyfill from '../polyfills/details_polyfill'

import type App from '../app'
import type Profil from '../profil'
import { navigueVersUneThematique } from './thematiques/navigation'
import { bindCalendar, bindImpression, bindSuppressionTotale } from '../actions'
import {
    displayBlocks,
    displayElementById,
    hideSelector,
    showElement,
    showMeOrThem,
    showOnlyIf,
    showSelector,
} from '../affichage'
import { bindFeedback } from '../feedback'
import * as injection from '../injection'
import { joursAvant, joursApres, titleCase } from '../utils'

import AlgorithmeOrientation from '../algorithme/orientation'
import AlgorithmeSuivi from '../algorithme/suivi'
import AlgorithmeVaccination from '../algorithme/vaccination'

export default function conseils(page: HTMLElement, app: App) {
    const element = page

    applyDetailsSummaryPolyfill(element)

    // Make sure we show profile-specific text.
    showMeOrThem(element, app.profil)

    var algoOrientation = new AlgorithmeOrientation(app.profil)

    // Première complétion du formulaire ?
    if (typeof app.profil.questionnaire_completion_date === 'undefined') {
        app.profil.questionnaire_completion_date = new Date()
        app.enregistrerProfilActuel()
        app.plausible('Questionnaire terminé')
        if (app.profil.estMonProfil()) {
            app.plausible('Questionnaire terminé pour moi')
        } else {
            app.plausible('Questionnaire terminé pour un proche')
        }
    }

    // Activer / désactiver l’auto-suivi pour ce profil ?
    if (algoOrientation.recommandeAutoSuivi()) {
        if (!app.profil.suivi_active) {
            app.profil.suivi_active = true
            app.enregistrerProfilActuel()
        }
    } else {
        if (app.profil.suivi_active && !app.profil.hasSuiviStartDate()) {
            app.profil.suivi_active = false
            app.enregistrerProfilActuel()
        }
    }

    // Display appropriate conseils.
    showRelevantBlocks(element, app.profil, algoOrientation)

    if (app.profil.hasSuiviStartDate() && app.profil.hasHistorique()) {
        if (app.profil.hasDeconfinementDate()) {
            // Afficher le bloc de déconfinement.
            displayElementById(element, 'deconfinement')
        } else {
            // Afficher le bloc de résultats de l’auto-suivi.
            const algoSuivi = new AlgorithmeSuivi(app.profil)
            displayElementById(element, 'suivi')
            showRelevantSuiviBlocks(element, algoSuivi)
            showRelevantEvolutionsRecap(element, algoSuivi)
        }

        // Cacher le bloc de statut si on est en auto-suivi.
        hideSelector(element, '#conseils-statut')
    }

    cacherElementsConditionnels(element, app.profil)

    // Dynamic data injections.
    dynamicDataInjection(element, app.profil, algoOrientation)

    // Show instructions to install PWA (iOS) or add bookmark (others).
    if (isMobileSafari()) {
        const isPWA = navigator.standalone
        if (!isPWA) {
            showElement(element.querySelector('.browser-mobile-safari'))
        }
    } else {
        showElement(element.querySelector('.browser-other'))
    }

    // Make the buttons clickable with appropriate actions.
    const feedbackComponent = element.querySelector<HTMLElement>('.feedback-component')
    if (feedbackComponent) {
        bindFeedback(feedbackComponent, app)
    }
    bindImpression(element, app)
    if (app.profil.hasSuiviStartDate()) {
        bindCalendar(element, app.profil)
    }
    const jsSuppression = element.querySelector<HTMLElement>('.js-suppression')
    if (jsSuppression) {
        bindSuppressionTotale(jsSuppression, app)
    }
    navigueVersUneThematique(app, 'Navigue vers une thématique depuis les conseils')
}

export function cacherElementsConditionnels(element: HTMLElement, profil: Profil) {
    // Éléments conditionnés à une activité professionnelle.
    const activitePro = profil.activite_pro || (profil.activite_pro_sante as boolean)
    showOnlyIf(element, '.seulement-si-activite-pro', activitePro)

    // Éléments conditionnés à une activité professionnelle ET autotest
    const autotest = profil.depistage_type === 'antigenique_autotest'
    showOnlyIf(
        element,
        '.seulement-si-activite-pro-et-autotest',
        activitePro && autotest
    )

    // Éléments conditionnés à une activité professionnelle ET PAS autotest
    showOnlyIf(
        element,
        '.seulement-si-activite-pro-et-pas-autotest',
        activitePro && !autotest
    )

    // Éléments conditionnés à un foyer partagé.
    showOnlyIf(element, '.seulement-si-foyer', profil.foyer_autres_personnes as boolean)

    // Éléments conditionnés à la vaccination.
    const algoOrientation = new AlgorithmeOrientation(profil)
    const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
    showOnlyIf(
        element,
        '.seulement-si-vaccine',
        algoVaccination.isCompletementVaccine()
    )
    showOnlyIf(
        element,
        '.seulement-si-non-vaccine',
        !algoVaccination.isCompletementVaccine()
    )
}

function showRelevantSuiviBlocks(element: HTMLElement, algoSuivi: AlgorithmeSuivi) {
    const profil = algoSuivi.profil
    const blockNames = [algoSuivi.graviteBlockNameToDisplay()]
    if (algoSuivi.psy !== 0) {
        blockNames.push(algoSuivi.psyBlockNameToDisplay())
    }
    if (profil.hasHistorique()) {
        blockNames.push('suivi-bloc-liens')
        blockNames.push('conseils-personnels-titre')
        blockNames.push('conseils-sante')
        blockNames.push('conseils-sante-historique-symptomes')

        const suiviRepetition = Array.from(
            element.querySelectorAll<HTMLElement>('.suivi-repetition')
        )
        if (suiviRepetition) {
            suiviRepetition.forEach((elem) => {
                injection.suiviRepetition(elem, profil)
            })
        }

        const suiviDerniereFois = Array.from(
            element.querySelectorAll<HTMLElement>('.suivi-derniere-fois')
        )
        if (suiviDerniereFois) {
            suiviDerniereFois.forEach((elem) => {
                injection.suiviDerniereFois(elem, profil)
            })
        }
    }
    displayBlocks(element, blockNames)
}

export function showRelevantBlocks(
    element: HTMLElement,
    profil: Profil,
    algoOrientation: AlgorithmeOrientation
) {
    let blockNames: string[] = []
    blockNames = blockNames.concat(statutBlockNamesToDisplay(algoOrientation))
    blockNames = blockNames.concat(algoOrientation.timelineBlockNamesToDisplay())
    blockNames = blockNames.concat(
        algoOrientation.conseilsPersonnelsBlockNamesToDisplay()
    )
    blockNames = blockNames.concat(algoOrientation.isolementBlockNamesToDisplay())
    blockNames.push('et-ensuite')
    blockNames = blockNames.concat(algoOrientation.depistageBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.vaccinBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.gestesBarriereBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.activiteProBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.grossesseBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.santeBlockNamesToDisplay())
    blockNames = blockNames.concat(algoOrientation.enfantsBlockNamesToDisplay())
    displayBlocks(element, blockNames)
}

function showRelevantEvolutionsRecap(element: HTMLElement, algoSuivi: AlgorithmeSuivi) {
    var blockNames = algoSuivi.evolutionsBlockNamesToDisplay()
    if (blockNames.length) {
        showElement(element.querySelector('.reponse'))
        displayBlocks(element, blockNames)
    }
}

export function dynamicDataInjection(
    element: HTMLElement,
    profil: Profil,
    algoOrientation: AlgorithmeOrientation
) {
    const conseilsBlockTitre = element.querySelector<HTMLElement>(
        '#conseils-block-titre'
    )
    if (conseilsBlockTitre) {
        injection.titreConseils(conseilsBlockTitre, profil)
    }

    const conseilsBlockDate = element.querySelector<HTMLElement>('#conseils-block-date')
    if (conseilsBlockDate) {
        injection.dateConseils(conseilsBlockDate)
    }

    const nomCaracteristiquesARisques = Array.from(
        element.querySelectorAll<HTMLElement>('.nom-caracteristiques-a-risques')
    )
    if (nomCaracteristiquesARisques) {
        nomCaracteristiquesARisques.forEach((elem) => {
            injection.caracteristiquesARisques(elem, algoOrientation)
        })
    }

    const reponsePersonneFragile = Array.from(
        element.querySelectorAll<HTMLElement>('.reponse-personne-fragile')
    )
    if (reponsePersonneFragile) {
        reponsePersonneFragile.forEach((elem) => {
            injection.caracteristiquesOuAntecedentsARisques(elem, algoOrientation)
        })
    }

    const nomAntecedents = Array.from(
        element.querySelectorAll<HTMLElement>('.nom-antecedents')
    )
    if (nomAntecedents) {
        nomAntecedents.forEach((elem) => {
            injection.antecedents(elem, algoOrientation)
        })
    }

    dynamicTimelineDataInjection(element, profil)
}

function dynamicTimelineDataInjection(element: HTMLElement, profil: Profil) {
    function formatDate(date: Date | undefined) {
        if (typeof date === 'undefined') {
            return ''
        }
        const options: {
            weekday: 'short' | 'long' | 'narrow' | undefined
            month: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit' | undefined
            day: 'numeric' | '2-digit' | undefined
        } = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        }
        return date.toLocaleDateString('fr-FR', options)
    }

    function fillDate(part: string, content: string) {
        Array.from(
            element.querySelectorAll(`.timeline .timeline-${part} .timeline-date`)
        ).forEach((elem) => {
            elem.innerHTML = titleCase(content)
        })
    }

    function fillDates(dates: {
        exposition: Date
        contagiosite: Date
        debutIsolement: string
        demain: Date
        finIsolement: Date | undefined
        finIsolementPositif: Date | undefined
    }) {
        fillDate('exposition', `À partir du ${formatDate(dates.exposition)}`)
        fillDate('contagiosite', formatDate(dates.contagiosite))
        fillDate('isolement', dates.debutIsolement)
        fillDate('aujourdhui', `${formatDate(new Date())} (aujourd’hui)`)
        fillDate('demain', `${formatDate(dates.demain)} (demain)`)
        fillDate('test', `${formatDate(dates.finIsolement)}`)
        fillDate('fin', `À partir du ${formatDate(dates.finIsolement)}`)
        fillDate('fin-positif', `À partir du ${formatDate(dates.finIsolementPositif)}`)
    }

    function fillDuration(dureeIsolement: number) {
        const dureeIsolementElement =
            element.querySelector<HTMLElement>('.duree-isolement')!
        dureeIsolementElement.innerText = String(dureeIsolement)
    }

    const dureeIsolement = profil.dureeIsolement()

    // Frises d’isolement pour les personnes testées positives
    if (profil.depistagePositifRecent()) {
        // Frise n°1 : symptômes actuels ou passés.
        if (profil.hasSymptomesActuelsReconnus() || profil.symptomes_passes) {
            // Injecte les bonnes dates dans la frise.
            fillDates({
                exposition: joursAvant(14, profil.symptomes_start_date),
                contagiosite: joursAvant(2, profil.symptomes_start_date),
                debutIsolement: `${formatDate(
                    profil.symptomes_start_date
                )} (<a href="#symptomes">modifier</a>)`,
                demain: joursApres(1, new Date()),
                finIsolement: joursApres(dureeIsolement, profil.symptomes_start_date),
                finIsolementPositif: joursApres(
                    dureeIsolement + 7,
                    profil.symptomes_start_date
                ),
            })

            // Si les symptômes ont commencé aujourd’hui, on propose le suivi demain.
            if (profil.symptomes_start_date! > joursAvant(1)) {
                hideSelector(element, '.timeline .timeline-aujourdhui')
                showSelector(element, '.timeline .timeline-demain')
            }

            // Si on a fait le suivi aujourd’hui, on confirme et on dit de revenir demain.
            else if (profil.suiviAujourdhui()) {
                hideSelector(
                    element,
                    '.timeline .timeline-aujourdhui .timeline-texte .suivi-a-faire'
                )
                showSelector(
                    element,
                    '.timeline .timeline-aujourdhui .timeline-texte .suivi-fait'
                )
                showSelector(element, '.timeline .timeline-demain')
            }
        }

        // Frise n°2 : asymptomatique.
        else {
            // Injecte les bonnes dates dans la frise.
            fillDates({
                exposition: joursAvant(14, profil.depistage_start_date),
                contagiosite: joursAvant(2, profil.depistage_start_date),
                debutIsolement: `${formatDate(
                    profil.depistage_start_date
                )} (<a href="#depistage">modifier</a>)`,
                demain: joursApres(1, new Date()),
                finIsolement: joursApres(dureeIsolement, profil.depistage_start_date),
                finIsolementPositif: joursApres(
                    dureeIsolement + 7,
                    profil.symptomes_start_date
                ),
            })
            fillDuration(dureeIsolement)
        }
    }
}

function statutBlockNamesToDisplay(algoOrientation: AlgorithmeOrientation) {
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
