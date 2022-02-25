import applyDetailsSummaryPolyfill from '../../polyfills/details_polyfill'

import type App from '../../app'
import { bindImpression } from '../../actions'
import { bindFeedback, opacityTransition, envoieLesRemarques } from '../../feedback'
import { navigueVersUneThematique } from './navigation'
import { dynamiseLeChoixDuTest } from './choixTestDepistage'
import { dynamiseLeRappelVaccinal } from './rappelVaccinal'

export function pageThematique(app: App) {
    app.trackPageView(document.location.pathname)
    const feedbackComponent =
        document.querySelector<HTMLElement>('.feedback-component')!
    bindFeedback(feedbackComponent, app)
    bindImpression(document as unknown as HTMLElement, app)
    const liensVersProfil = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('.cta [data-set-profil]')
    )
    liensVersProfil.forEach((lienVersProfil) => {
        boutonBasculeVersMonProfil(lienVersProfil, app)
    })
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
            const target = <HTMLAnchorElement>event.target
            const details = trouveDetailsParent(target)
            if (details) {
                details.setAttribute('open', '')
            }
        })
    })
}

function ouvreDetailsSiFragment() {
    const currentAnchor = document.location.hash ? document.location.hash.slice(1) : ''
    if (currentAnchor) {
        const elem = document.querySelector<HTMLElement>(`#${currentAnchor}`)!
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

function trouveDetailsParent(elem: HTMLElement) {
    while (elem) {
        if (elem.tagName.toLowerCase() === 'details') {
            return elem
        }
        elem = elem.parentElement as HTMLElement
    }
    return
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
            const detailsElement = summary.parentElement as HTMLDetailsElement
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
    const formulaires = Array.from(
        document.querySelectorAll<HTMLFormElement>('.formulaire')
    )
    formulaires.forEach((form) => {
        const nom = form.dataset.nom as 'tests-de-depistage' | 'rappel'
        const init = initFunc(nom)
        init(form.dataset.prefixe!)
    })
}

function initFunc(nom: 'tests-de-depistage' | 'rappel') {
    if (nom == 'tests-de-depistage') {
        return dynamiseLeChoixDuTest
    } else {
        return dynamiseLeRappelVaccinal
    }
}

function creeUnLienPermanentDansLHistorique(detailsElement: HTMLDetailsElement) {
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

function boutonBasculeVersMonProfil(lienVersProfil: HTMLAnchorElement, app: App) {
    lienVersProfil.addEventListener('click', (event) => {
        event.preventDefault()
        const link = <HTMLAnchorElement>event.target
        app.plausible('Je veux des conseils personnalisés')
        const nomProfil = lienVersProfil.dataset.setProfil
        if (!nomProfil) return
        app.basculerVersProfil(nomProfil).then(() => {
            window.location.href = link.getAttribute('href')!
        })
    })
}

function partagePageEnCours() {
    const partageLinks = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('.feedback-partager a')
    )
    partageLinks.forEach((partageLink) => {
        let href = partageLink.href
        let url = new URL(document.URL)
        url.searchParams.set('source', 'partage-thematique')
        href = href.replace(
            'https%3A%2F%2Fmesconseilscovid.sante.gouv.fr%2F',
            encodeURIComponent(String(url))
        )
        partageLink.href = href
    })
}

function feedbackPageEnCours(app: App) {
    const feedbackQuestionsForms = Array.from(
        document.querySelectorAll<HTMLFormElement>('form.question-feedback')
    )
    feedbackQuestionsForms.forEach((feedbackQuestionForm) => {
        const parentNode = feedbackQuestionForm.parentNode as HTMLElement
        if (!parentNode) return
        const title = parentNode.querySelector<HTMLElement>('[itemprop="name"]')!
        const questionInnerText = title.innerText
        const question = title.innerText.substring(
            0,
            title.innerText.length - ' #'.length
        )
        const submitButtons =
            feedbackQuestionForm.querySelectorAll<HTMLInputElement>(
                'input[type="submit"]'
            )
        // Manual event.submitter (unsupported by Safari & IE).
        Array.from(submitButtons).forEach((submitButton) => {
            submitButton.addEventListener('click', (event) => {
                feedbackQuestionForm.submitter = event.target
            })
        })
        feedbackQuestionForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const target = <HTMLFormElement>event.target
            const choix = target.submitter.dataset.value
            app.plausible('Avis par question', {
                reponse: `${question} : ${choix}`,
            })
            const reponse = target.submitter.value
            opacityTransition(
                feedbackQuestionForm,
                500,
                (feedbackQuestionForm: HTMLFormElement) => {
                    let label =
                        choix === 'oui'
                            ? 'Avez-vous des remarques ou des suggestions pour améliorer ces conseils ?'
                            : 'Pouvez-vous nous en dire plus, afin que nous puissions améliorer ces conseils ?'
                    demandeRemarques(
                        feedbackQuestionForm,
                        choix,
                        question,
                        reponse,
                        label
                    )
                }
            )
        })
    })
}

function demandeRemarques(
    feedbackQuestionForm: HTMLFormElement,
    choix: string,
    question: string,
    reponse: string,
    label: string
) {
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
    const parentNode = feedbackQuestionForm.parentNode
    if (!parentNode) return
    parentNode.replaceChild(formulaire, feedbackQuestionForm)
    formulaire.addEventListener('submit', (event) => {
        event.preventDefault()
        const target = <HTMLFormElement>event.target
        envoieLesRemarques({
            feedbackHost: document.body.dataset.statsUrl,
            kind: choix,
            message: (<HTMLInputElement>target.elements.namedItem('message')!).value,
            page: document.location.pathname.slice(1),
            question: question,
            source: window.app.source,
        })
        afficheRemerciements(formulaire, choix, reponse)
    })
}

function afficheRemerciements(
    feedbackQuestionForm: HTMLFormElement,
    choix: string,
    reponse: string
) {
    const remerciements = document.createElement('div')
    remerciements.style.color = '#656565'
    remerciements.style.textAlign = 'center'
    remerciements.style.border = '2px solid #d5dbef'
    remerciements.innerHTML = `
        <p>Votre réponse : ${reponse}</p>
        <p>Merci pour votre avis !</p>
        `
    const parentNode = feedbackQuestionForm.parentNode
    if (!parentNode) return
    parentNode.replaceChild(remerciements, feedbackQuestionForm)
}
