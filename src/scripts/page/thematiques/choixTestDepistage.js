import { hideElement } from '../../affichage'
import { getRadioValue, toggleFormButtonOnRadioRequired } from '../../formutils'
import { Formulaire } from './formulaire'

export function dynamiseLeChoixDuTest() {
    const formulaire = new FormulaireTestDepistage()
    formulaire.demarre()
}

class FormulaireTestDepistage extends Formulaire {
    constructor() {
        super('tests-de-depistage')
    }

    GESTIONNAIRES = {
        'demarrage': (form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                hideElement(form)
                this.transitionneVersEtape('symptomes')
            })
        },
        'symptomes': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, 'tests_de_depistage_symptomes_radio')
                hideElement(form)
                if (value === 'oui') {
                    this.transitionneVersEtape('depuis-quand')
                } else if (value === 'non') {
                    this.transitionneVersEtape('cas-contact')
                }
            })
        },
        'depuis-quand': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'tests_de_depistage_depuis_quand_radio'
                )
                hideElement(form)
                this.afficheReponse(`symptomes-${value}`)
            })
        },
        'cas-contact': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'tests_de_depistage_cas_contact_radio'
                )
                hideElement(form)
                if (value === 'oui') {
                    this.afficheReponse(`pas-symptomes-cas-contact-${value}`)
                } else if (value === 'non') {
                    this.transitionneVersEtape('auto-test')
                }
            })
        },
        'auto-test': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, 'tests_de_depistage_auto_test_radio')
                hideElement(form)
                this.afficheReponse(`pas-symptomes-pas-cas-contact-auto-test-${value}`)
            })
        },
    }
}