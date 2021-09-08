import { hideElement } from '../../affichage'
import { getRadioValue, toggleFormButtonOnRadioRequired } from '../../formutils'
import { Formulaire } from './formulaire'

export function dynamiseLeChoixDuPass() {
    const formulaire = new FormulairePassSanitaire()
    formulaire.demarre()
}

class FormulairePassSanitaire extends Formulaire {
    constructor() {
        super('pass-sanitaire')
    }

    GESTIONNAIRES = {
        'demarrage': (form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                hideElement(form)
                this.transitionneVersEtape('vaccination')
            })
        },
        'vaccination': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, 'pass_sanitaire_vaccination_radio')
                hideElement(form)
                if (value === '1') {
                    this.transitionneVersEtape('type-vaccin')
                } else if (value === '2') {
                    this.transitionneVersEtape('date-2e-dose')
                } else if (value === '0') {
                    this.transitionneVersEtape('depistage-positif')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'date-1re-dose': () => {}, // TODO
        'date-2e-dose': () => {}, // TODO
        'type-vaccin': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, 'pass_sanitaire_type_vaccin_radio')
                hideElement(form)
                if (
                    value === 'pfizer' ||
                    value === 'moderna' ||
                    value === 'astrazeneca'
                ) {
                    this.transitionneVersEtape('guerison-avant-1re-dose')
                } else if (value === 'janssen') {
                    this.transitionneVersEtape('date-1re-dose')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'guerison-avant-1re-dose': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'pass_sanitaire_guerison_avant_1re_dose_radio'
                )
                hideElement(form)
                if (value === 'oui') {
                    // TODO
                } else if (value === 'non') {
                    this.afficheReponse('vaccination-incomplete')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'depistage-positif': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'pass_sanitaire_depistage_positif_radio'
                )
                hideElement(form)
                if (value === 'oui') {
                    this.transitionneVersEtape('date-derniere-covid')
                } else if (value === 'non') {
                    this.afficheReponse('non-vaccine')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'date-derniere-covid': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'pass_sanitaire_date_derniere_covid_radio'
                )
                hideElement(form)
                if (value === 'moins_de_6_mois') {
                    this.afficheReponse('test-positif-moins-de-6-mois')
                } else if (value === 'plus_de_6_mois') {
                    this.afficheReponse('test-positif-plus-de-6-mois')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
    }
}
