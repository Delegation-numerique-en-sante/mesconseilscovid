import { hideElement, hideSelector, showElement } from '../../affichage'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    uncheckAllRadio,
} from '../../formutils'

const FORMULAIRE = 'tests-de-depistage'

const GESTIONNAIRES = {
    'demarrage': gereDemarrage,
    'symptomes': gereSymptomes,
    'depuis-quand': gereDepuisQuand,
    'cas-contact': gereCasContact,
    'auto-test': gereAutoTest,
}

export function dynamiseLeChoixDuTest() {
    const form = document.querySelector(`#${FORMULAIRE}-demarrage-form`)
    gereDemarrage(form)
}

function transitionneVersEtape(etape) {
    const form = document.querySelector(`#${FORMULAIRE}-${etape}-form`)
    showElement(form)
    gereBoutonRetour(form)
    const gestionnaire = GESTIONNAIRES[etape]
    gestionnaire(form)
}

function gereBoutonRetour(form) {
    const boutonRetour = form.querySelector('.back-button')
    if (!boutonRetour) return
    boutonRetour.addEventListener('click', (event) => {
        event.preventDefault()
        const etapePrecedente = boutonRetour.dataset.precedent
        hideElement(form)
        transitionneVersEtape(etapePrecedente)
    })
}

function afficheReponse(etape) {
    const reponse = document.querySelector(`#${FORMULAIRE}-${etape}-reponse`)
    showElement(reponse)
    gereBoutonRefaire()
}

function gereBoutonRefaire() {
    const boutonRefaire = document.querySelector(`#${FORMULAIRE}-refaire`)
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
        transitionneVersEtape('symptomes')
    })
}

function gereDemarrage(form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        hideElement(form)
        transitionneVersEtape('symptomes')
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
            transitionneVersEtape('depuis-quand')
        } else if (value === 'non') {
            transitionneVersEtape('cas-contact')
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
            transitionneVersEtape('auto-test')
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
