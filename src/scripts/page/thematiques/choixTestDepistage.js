import { getRadioValue, toggleFormButtonOnRadioRequired } from '../../formutils'
import { Formulaire } from './formulaire'

export function dynamiseLeChoixDuTest(prefixe) {
    const formulaire = new FormulaireTestDepistage(prefixe)
    formulaire.demarre()
}

class FormulaireTestDepistage extends Formulaire {
    constructor(prefixe) {
        super(prefixe, 'symptomes')
    }

    GESTIONNAIRES = {
        'demarrage': (form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                this.transitionneVersEtape(form, 'symptomes')
            })
        },
        'symptomes': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, `${this.prefixe}_symptomes_radio`)
                if (value === 'oui') {
                    this.transitionneVersEtape(form, 'depuis-quand')
                } else if (value === 'non') {
                    this.transitionneVersEtape(form, 'cas-contact')
                }
            })
        },
        'depuis-quand': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, `${this.prefixe}_depuis_quand_radio`)
                this.transitionneVersReponse(form, `symptomes-${value}`)
            })
        },
        'cas-contact': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, `${this.prefixe}_cas_contact_radio`)
                if (value === 'oui') {
                    this.transitionneVersReponse(
                        form,
                        `pas-symptomes-cas-contact-${value}`
                    )
                } else if (value === 'non') {
                    this.transitionneVersEtape(form, 'auto-test')
                }
            })
        },
        'auto-test': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, `${this.prefixe}_auto_test_radio`)
                this.transitionneVersReponse(
                    form,
                    `pas-symptomes-pas-cas-contact-auto-test-${value}`
                )
            })
        },
    }
}
