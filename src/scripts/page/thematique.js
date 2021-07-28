import { bindImpression } from '../actions'
import { hideElement, hideSelector, showElement } from '../affichage'
import { bindFeedback } from '../feedback'
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
    boutonBasculeVersMonProfil(app)
    ouvreDetailsSiFragment()
    partagePageEnCours()
    const correspondance = {
        'tests-de-depistage': dynamiseLeChoixDuTest,
        'cas-contact-a-risque': dynamiseLeCasContactVaccineOuPas,
    }
    const dynamise = correspondance[document.body.dataset.thematiqueName]
    if (dynamise) dynamise()
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

function boutonBasculeVersMonProfil(app) {
    const button = document.querySelector('.cta a.button')
    if (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault()
            app.plausible('Je veux des conseils personnalisés')
            app.basculerVersProfil('mes_infos').then(() => {
                window.location = event.target.getAttribute('href')
            })
        })
    }
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

function dynamiseLeChoixDuTest() {
    const form = document.querySelector('#tests-de-depistage-symptomes-form')
    gereSymptomes(form)
}

function transitionneVersFormulaire(thematique, nom) {
    const form = document.querySelector(`#${thematique}-${nom}-form`)
    showElement(form)
    gereBoutonRetour(thematique, form)
    const correspondance = {
        'symptomes': gereSymptomes,
        'depuis-quand': gereDepuisQuand,
        'cas-contact': gereCasContact,
        'auto-test': gereAutoTest,
        'vaccine': gereContactARisque,
    }
    correspondance[nom](form)
}

function gereBoutonRetour(thematique, form) {
    const boutonRetour = form.querySelector('.back-button')
    if (!boutonRetour) return
    boutonRetour.addEventListener('click', (event) => {
        event.preventDefault()
        const precedent = boutonRetour.dataset.precedent
        hideElement(form)
        transitionneVersFormulaire(thematique, precedent)
    })
}

function afficheReponse(thematique, nom) {
    const reponse = document.querySelector(`#${thematique}-${nom}-reponse`)
    showElement(reponse)
    setTimeout(() => {
        reponse.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    gereBoutonRefaire(thematique)
}

function gereBoutonRefaire(thematique) {
    const boutonRefaire = document.querySelector(`#${thematique}-refaire`)
    showElement(boutonRefaire)
    boutonRefaire.addEventListener('click', (event) => {
        event.preventDefault()
        hideElement(boutonRefaire)
        hideSelector(document, 'div[id$="-reponse"]')
        uncheckAllRadio(document)
        Array.from(
            document.querySelectorAll('[data-initial-value]'),
            (inputWithInitial) => {
                inputWithInitial.value = inputWithInitial.dataset.initialValue
                inputWithInitial.removeAttribute('data-initial-value')
            }
        )
        transitionneVersFormulaire(thematique, boutonRefaire.dataset.initialForm)
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
            transitionneVersFormulaire('tests-de-depistage', 'depuis-quand')
        } else if (value === 'non') {
            transitionneVersFormulaire('tests-de-depistage', 'cas-contact')
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
        afficheReponse('tests-de-depistage', `symptomes-${value}`)
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
            afficheReponse('tests-de-depistage', `pas-symptomes-cas-contact-${value}`)
        } else if (value === 'non') {
            transitionneVersFormulaire('tests-de-depistage', 'auto-test')
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
        afficheReponse(
            'tests-de-depistage',
            `pas-symptomes-pas-cas-contact-auto-test-${value}`
        )
    })
}

function dynamiseLeCasContactVaccineOuPas() {
    const form = document.querySelector('#contact-a-risque-vaccine-form')
    gereContactARisque(form)
}

function gereContactARisque(form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'contact_a_risque_vaccine_radio')
        hideElement(form)
        afficheReponse('contact-a-risque', value)
    })
}
