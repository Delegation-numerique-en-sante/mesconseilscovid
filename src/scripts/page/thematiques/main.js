import { Application } from '@hotwired/stimulus'

import FeedbackController from './controllers/feedback_controller'
import SwitchController from './controllers/switch_controller'
import PlausibleController from './controllers/plausible_controller'
import ShareController from './controllers/share_controller'

import applyDetailsSummaryPolyfill from '../../polyfills/details_polyfill'

import { bindImpression } from '../../actions'
import { navigueVersUneThematique } from './navigation'
import { dynamiseLeChoixDuTest } from './choixTestDepistage'
import { dynamiseLeChoixDuPass } from './choixPassSanitaire'
import { dynamiseLaProlongationDuPass } from './prolongationPassSanitaire'

window.Stimulus = Application.start()
window.Stimulus.register('feedback', FeedbackController)
window.Stimulus.register('switch', SwitchController)
window.Stimulus.register('plausible', PlausibleController)
window.Stimulus.register('share', ShareController)
window.Stimulus.debug = true

export function pageThematique(app) {
    app.trackPageView(document.location.pathname)
    bindImpression(document, app)
    Array.from(document.querySelectorAll('.cta [data-set-profil]')).forEach(
        (lienVersProfil) => {
            boutonBasculeVersMonProfil(lienVersProfil, app)
        }
    )
    initDetailsSummary()
    partagePageEnCours()

    initialiseLesFormulaires()

    navigueVersUneThematique(
        app,
        'Navigue vers une thématique depuis une autre thématique'
    )
}

function initDetailsSummary() {
    applyDetailsSummaryPolyfill(document)
    ouvreDetailsSiBouton()
    ouvreDetailsSiFragment()
    window.addEventListener('hashchange', ouvreDetailsSiFragment)
    scrolleAuSummary()
}

function ouvreDetailsSiBouton() {
    const boutons = document.querySelectorAll('summary .lire-la-suite .button')
    Array.from(boutons).forEach((bouton) => {
        bouton.addEventListener('click', (event) => {
            event.preventDefault()
            const details = trouveDetailsParent(event.target)
            if (details) {
                details.setAttribute('open', '')
            }
        })
    })
}

function ouvreDetailsSiFragment() {
    const currentAnchor = document.location.hash ? document.location.hash.slice(1) : ''
    if (currentAnchor) {
        const elem = document.querySelector(`#${currentAnchor}`)
        const details = trouveDetailsParent(elem)
        if (details) {
            details.setAttribute('open', '')

            // Even with an event, we need to wait for the next few
            // ticks to be able to scroll to the collapsed element.
            setTimeout(() => {
                elem.scrollIntoView({ behavior: getAnimationBehavior() })
            }, 100)
        }
    }
}

function trouveDetailsParent(elem) {
    while (elem) {
        if (elem.tagName.toLowerCase() === 'details') {
            return elem
        }
        elem = elem.parentElement
    }
}

function getAnimationBehavior() {
    const isReduced =
        window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true
    return isReduced ? 'auto' : 'smooth'
}

function scrolleAuSummary() {
    const summaries = document.querySelectorAll('summary')
    Array.from(summaries).forEach((summary) => {
        summary.addEventListener('click', () => {
            const detailsElement = summary.parentElement
            // Even with an event, we need to wait for the next few
            // ticks to be able to scroll to the collapsed element.
            setTimeout(() => {
                detailsElement.scrollIntoView({ behavior: getAnimationBehavior() })
            }, 100)
            creeUnLienPermanentDansLHistorique(detailsElement)
        })
    })
}

function initialiseLesFormulaires() {
    Array.from(document.querySelectorAll('.formulaire')).forEach((form) => {
        const init = initFunc(form.dataset.nom)
        init(form.dataset.prefixe)
    })
}

function initFunc(nom) {
    if (nom == 'pass-sanitaire') {
        return dynamiseLeChoixDuPass
    } else if (nom == 'tests-de-depistage') {
        return dynamiseLeChoixDuTest
    } else if (nom == 'rappel') {
        return dynamiseLaProlongationDuPass
    }
}

function creeUnLienPermanentDansLHistorique(detailsElement) {
    // On ajoute l’ancre dans l’URL en cours.
    if (
        detailsElement.id &&
        typeof window !== 'undefined' &&
        window.history &&
        window.history.replaceState
    ) {
        window.history.replaceState({}, '', `#${detailsElement.id}`)
    }
}

function boutonBasculeVersMonProfil(lienVersProfil, app) {
    lienVersProfil.addEventListener('click', (event) => {
        event.preventDefault()
        app.plausible('Je veux des conseils personnalisés')
        app.basculerVersProfil(lienVersProfil.dataset.setProfil).then(() => {
            window.location = event.target.getAttribute('href')
        })
    })
}

function partagePageEnCours() {
    const partageLinks = document.querySelectorAll('.feedback-partager a')
    Array.from(partageLinks).forEach((partageLink) => {
        let href = partageLink.href
        let url = new URL(document.URL)
        url.searchParams.set('source', 'partage-thematique')
        href = href.replace(
            'https%3A%2F%2Fmesconseilscovid.sante.gouv.fr%2F',
            encodeURIComponent(url)
        )
        partageLink.href = href
    })
}
