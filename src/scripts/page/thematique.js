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
    if (currentAnchor) {
        let elem = document.querySelector(`#${currentAnchor}`)
        while (elem) {
            if (elem.tagName.toLowerCase() === 'details') {
                elem.setAttribute('open', '')
            }
            elem = elem.parentElement
        }
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
                switch (choix) {
                    case 'non':
                    case 'bof':
                        demandeRemarques(feedbackQuestionForm, choix, question, reponse)
                        break
                    case 'oui':
                        afficheRemerciements(feedbackQuestionForm, choix, reponse)
                        break
                }
            })
        })
    })
}

function demandeRemarques(feedbackQuestionForm, choix, question, reponse) {
    const formulaire = document.createElement('form')
    formulaire.classList.add('feedback-form', 'question-feedback')
    formulaire.innerHTML = `
        <fieldset>
            <p role="status">Merci pour votre retour.</p>
            <label for="message_conseils">Pouvez-vous nous en dire plus, afin que nous puissions améliorer ces conseils ?</label>
            <textarea id="message_conseils" name="message" rows="9" cols="20" required></textarea>
        </fieldset>
        <div class="form-controls">
            <input type="submit" class="button" value="Envoyer mes remarques">
        </div>
    `
    feedbackQuestionForm.parentNode.replaceChild(formulaire, feedbackQuestionForm)
    formulaire.addEventListener('submit', (event) => {
        event.preventDefault()
        const feedbackHost = document.body.dataset.statsUrl
        let message = event.target.elements.message.value
        const page = document.location.pathname.slice(1)
        const payload = {
            kind: choix,
            message: message,
            page: page,
            question: question,
        }
        const request = new XMLHttpRequest()
        request.open('POST', feedbackHost + '/feedback', true)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify(payload))

        afficheRemerciements(formulaire, choix, reponse)
    })
}

function afficheRemerciements(feedbackQuestionForm, choix, reponse) {
    const remerciements = document.createElement('div')
    remerciements.style.color = '#656565'
    remerciements.style.textAlign = 'center'
    remerciements.style.border = '2px solid #d5dbef'
    remerciements.innerHTML = `
        <p>Votre réponse : ${reponse}</p>
        <p>Merci pour votre avis !</p>
        `
    feedbackQuestionForm.parentNode.replaceChild(remerciements, feedbackQuestionForm)
}

function dynamiseLeChoixDuTest() {
    const form = document.querySelector('#tests-de-depistage-demarrage-form')
    gereDemarrage(form)
}

function transitionneVersFormulaire(nom) {
    const form = document.querySelector(`#tests-de-depistage-${nom}-form`)
    showElement(form)
    gereBoutonRetour(form)
    const correspondance = {
        'demarrage': gereDemarrage,
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

function gereDemarrage(form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        hideElement(form)
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
