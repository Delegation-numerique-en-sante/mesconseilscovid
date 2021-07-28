import { hideElement, hideSelector, showElement } from '../affichage'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    uncheckAllRadio,
} from '../formutils'

export function dynamiseThematique(thematiqueName) {
    const correspondance = {
        'tests-de-depistage': dynamiseLeChoixDuTest,
        'cas-contact-a-risque': dynamiseLeCasContactVaccineOuPas,
    }
    const dynamise = correspondance[thematiqueName]
    if (dynamise) dynamise(thematiqueName)
}

function dynamiseLeChoixDuTest(thematique) {
    const form = document.querySelector(`#${thematique}-symptomes-form`)
    gereSymptomes(thematique, form)
}

function dynamiseLeCasContactVaccineOuPas(thematique) {
    const form = document.querySelector(`#${thematique}-vaccine-form`)
    gereContactARisque(thematique, form)
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
    correspondance[nom](thematique, form)
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

function gereSymptomes(thematique, form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_symptomes_radio')
        hideElement(form)
        if (value === 'oui') {
            transitionneVersFormulaire(thematique, 'depuis-quand')
        } else if (value === 'non') {
            transitionneVersFormulaire(thematique, 'cas-contact')
        }
    })
}

function gereDepuisQuand(thematique, form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_depuis_quand_radio')
        hideElement(form)
        afficheReponse(thematique, `symptomes-${value}`)
    })
}

function gereCasContact(thematique, form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_cas_contact_radio')
        hideElement(form)
        if (value === 'oui') {
            afficheReponse(thematique, `pas-symptomes-cas-contact-${value}`)
        } else if (value === 'non') {
            transitionneVersFormulaire(thematique, 'auto-test')
        }
    })
}

function gereAutoTest(thematique, form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'tests_de_depistage_auto_test_radio')
        hideElement(form)
        afficheReponse(thematique, `pas-symptomes-pas-cas-contact-auto-test-${value}`)
    })
}

function gereContactARisque(thematique, form) {
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const value = getRadioValue(form, 'cas_contact_a_risque_vaccine_radio')
        hideElement(form)
        afficheReponse(thematique, value)
    })
}
