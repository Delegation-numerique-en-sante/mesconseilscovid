import applyDetailsSummaryPolyfill from '../../polyfills/details_polyfill'

import { bindImpression } from '../../actions'
import { bindFeedback, opacityTransition, envoieLesRemarques } from '../../feedback'
import { navigueVersUneThematique } from './navigation'
import { dynamiseLeChoixDuTest } from './choixTestDepistage'

export function pageThematique(app) {
    app.trackPageView(document.location.pathname)
    bindFeedback(document.querySelector('.feedback-component'), app)
    bindImpression(document, app)
    Array.from(document.querySelectorAll('.cta [data-set-profil]')).forEach(
        (lienVersProfil) => {
            boutonBasculeVersMonProfil(lienVersProfil, app)
        }
    )
    initDetailsSummary()
    partagePageEnCours()
    feedbackPageEnCours(app)

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
    if (nom == 'tests-de-depistage') {
        return dynamiseLeChoixDuTest
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

function feedbackPageEnCours(app) {
    const feedbackQuestionsForms = document.querySelectorAll('form.question-feedback')
    Array.from(feedbackQuestionsForms).forEach((feedbackQuestionForm) => {
        const title = feedbackQuestionForm.parentNode.querySelector('[itemprop="name"]')
        const question = title.innerText.substring(
            0,
            title.innerText.length - ' #'.length
        )
        const submitButtons =
            feedbackQuestionForm.querySelectorAll('input[type="submit"]')
        // Manual event.submitter (unsupported by Safari & IE).
        Array.from(submitButtons).forEach((submitButton) => {
            submitButton.addEventListener('click', (event) => {
                feedbackQuestionForm.submitter = event.target
            })
        })
        feedbackQuestionForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const choix = event.target.submitter.dataset.value
            app.plausible('Avis par question', {
                reponse: `${question} : ${choix}`,
            })
            const reponse = event.target.submitter.value
            opacityTransition(feedbackQuestionForm, 500, (feedbackQuestionForm) => {
                let label =
                    choix === 'oui'
                        ? 'Avez-vous des remarques ou des suggestions pour améliorer ces conseils\u00a0?'
                        : 'Pouvez-vous nous en dire plus, afin que nous puissions améliorer ces conseils\u00a0?'
                demandeRemarques(feedbackQuestionForm, choix, question, reponse, label)
            })
        })
    })
}

function demandeRemarques(feedbackQuestionForm, choix, question, reponse, label) {
    const formulaire = document.createElement('form')
    formulaire.classList.add('feedback-form')
    formulaire.innerHTML = `
        <fieldset>
            <p role="status">Merci pour votre retour.</p>
            <label for="message_conseils">${label}</label>
            <textarea id="message_conseils" name="message" rows="9" cols="20" required></textarea>
        </fieldset>
        <div class="form-controls">
            <input type="submit" class="button" value="Envoyer mes remarques">
        </div>
    `
    feedbackQuestionForm.parentNode.replaceChild(formulaire, feedbackQuestionForm)
    formulaire.addEventListener('submit', (event) => {
        event.preventDefault()
        envoieLesRemarques({
            feedbackHost: document.body.dataset.statsUrl,
            kind: choix,
            message: event.target.elements.message.value,
            page: document.location.pathname.slice(1),
            question: question,
            source: window.app.source,
        })
        afficheRemerciements(formulaire, choix, reponse)
    })
}

function afficheRemerciements(feedbackQuestionForm, choix, reponse) {
    const remerciements = document.createElement('div')
    remerciements.style.color = '#656565'
    remerciements.style.textAlign = 'center'
    remerciements.style.border = '2px solid #d5dbef'
    remerciements.innerHTML = `
        <p>Votre réponse\u00a0: ${reponse}</p>
        <p>Merci pour votre avis\u00a0!</p>
        `
    feedbackQuestionForm.parentNode.replaceChild(remerciements, feedbackQuestionForm)
}
