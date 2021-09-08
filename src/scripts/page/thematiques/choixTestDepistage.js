import { hideElement, hideSelector, showElement } from '../../affichage'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    uncheckAllRadio,
} from '../../formutils'

export function dynamiseLeChoixDuTest() {
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
