import { bindImpression } from '../actions'
import { hideElement, hideSelector, showElement } from '../affichage'
import { bindFeedback, opacityTransition } from '../feedback'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    uncheckAllRadio,
} from '../formutils'
import { getLocationPathName } from '../plausible'

export function estPageThematique() {
    return document.body.classList.contains('page-thematique')
}

export function pageThematique(app) {
    app.trackPageView(document.location.pathname)
    bindFeedback(document.querySelector('.feedback-component'), app)
    bindImpression(document, app)
    Array.from(document.querySelectorAll('.cta [data-set-profil]')).forEach(
        (lienVersProfil) => {
            boutonBasculeVersMonProfil(lienVersProfil, app)
        }
    )
    ouvreDetailsSiFragment()
    partagePageEnCours()
    feedbackPageEnCours(app)
    // À discuter : est-ce que l’on veut du générique ?
    if (document.body.dataset.thematiqueName === 'tests-de-depistage') {
        dynamiseLeChoixDuTest()
    }
    navigueVersUneThematique(
        app,
        'Navigue vers une thématique depuis une autre thématique'
    )
}

export function navigueVersUneThematique(app, goal) {
    const thematiquesLinks = document.querySelectorAll('.thematiques a')
    Array.from(thematiquesLinks).forEach((thematiquesLink) => {
        const href = thematiquesLink.getAttribute('href')
        thematiquesLink.addEventListener('click', (event) => {
            event.preventDefault()
            app.plausible(goal, {
                chemin: `${getLocationPathName()} → ${href}`,
            })
            window.location = href
        })
    })
}

function ouvreDetailsSiFragment() {
    const currentAnchor = document.location.hash ? document.location.hash.slice(1) : ''
    if (currentAnchor.substring(0, 7) === 'anchor-') {
        const target = document.querySelector(`#${currentAnchor}`)
        if (!target) return
        if (target.parentElement.tagName === 'DETAILS')
            target.parentElement.setAttribute('open', '')
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
        feedbackQuestionForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const choix = event.submitter.dataset.value
            app.plausible('Avis par question', {
                reponse: `${question} : ${choix}`,
            })
            const reponse = event.submitter.value
            opacityTransition(feedbackQuestionForm, 500, (feedbackQuestionForm) => {
                feedbackQuestionForm.style.color = '#656565'
                const legend = feedbackQuestionForm.querySelector('legend')
                legend.innerHTML = `
                    <p>${legend.innerText}</p>
                    <p>${reponse}</p>
                    Merci pour votre avis !
                    `
                const oldChild = feedbackQuestionForm.querySelector('div')
                feedbackQuestionForm.removeChild(oldChild)
            })
        })
    })
}

function dynamiseLeChoixDuTest() {
    const form = document.querySelector('#tests-de-depistage-symptomes-form')
    gereSymptomes(form)
}

function transitionneVersFormulaire(nom) {
    const form = document.querySelector(`#tests-de-depistage-${nom}-form`)
    showElement(form)
    gereBoutonRetour(form)
    const correspondance = {
        'symptomes': gereSymptomes,
        'depuis-quand': gereDepuisQuand,
        'cas-contact': gereCasContact,
        'auto-test': gereAutoTest,
    }
    correspondance[nom](form)
}

function gereBoutonRetour(form) {
    const boutonRetour = form.querySelector('.back-button')
    if (!boutonRetour) return
    boutonRetour.addEventListener('click', (event) => {
        event.preventDefault()
        const precedent = boutonRetour.dataset.precedent
        hideElement(form)
        transitionneVersFormulaire(precedent)
    })
}

function afficheReponse(nom) {
    const reponse = document.querySelector(`#tests-de-depistage-${nom}-reponse`)
    showElement(reponse)
    gereBoutonRefaire()
}

function gereBoutonRefaire() {
    const boutonRefaire = document.querySelector('#tests-de-depistage-refaire')
    showElement(boutonRefaire)
    boutonRefaire.addEventListener('click', (event) => {
        event.preventDefault()
        hideElement(boutonRefaire)
        hideSelector(document, '.statut')
        uncheckAllRadio(document)
        Array.from(
            document.querySelectorAll('[data-initial-value]'),
            (inputWithInitial) => {
                inputWithInitial.value = inputWithInitial.dataset.initialValue
                inputWithInitial.removeAttribute('data-initial-value')
            }
        )
        transitionneVersFormulaire('symptomes')
    })
}

function gereSymptomes(form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_symptomes_radio')
        hideElement(form)
        if (value === 'oui') {
            transitionneVersFormulaire('depuis-quand')
        } else if (value === 'non') {
            transitionneVersFormulaire('cas-contact')
        }
    })
}

function gereDepuisQuand(form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_depuis_quand_radio')
        hideElement(form)
        afficheReponse(`symptomes-${value}`)
    })
}

function gereCasContact(form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_cas_contact_radio')
        hideElement(form)
        if (value === 'oui') {
            afficheReponse(`pas-symptomes-cas-contact-${value}`)
        } else if (value === 'non') {
            transitionneVersFormulaire('auto-test')
        }
    })
}

function gereAutoTest(form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_auto_test_radio')
        hideElement(form)
        afficheReponse(`pas-symptomes-pas-cas-contact-auto-test-${value}`)
    })
}
