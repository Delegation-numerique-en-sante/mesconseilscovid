import { hideElement } from '../../affichage'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    toggleFormButtonOnTextFieldsRequired,
} from '../../formutils'
import { Formulaire } from './formulaire'
import { differenceEnJours } from '../../utils'

export function dynamiseLeChoixDuPass() {
    const formulaire = new FormulairePassSanitaire()
    formulaire.demarre()
}

class FormulairePassSanitaire extends Formulaire {
    constructor() {
        super('pass-sanitaire', 'vaccination')
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
                const value = getRadioValue(form, `${this.prefixe}_vaccination_radio`)
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
        'date-1re-dose-janssen': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const datePicker =
                    form.elements[`${this.prefixe}_date_1re_dose_janssen`]
                if (datePicker.value !== '') {
                    hideElement(form)
                    const aujourdhui = new Date()
                    const date2eDose = new Date(datePicker.value)
                    const delai = differenceEnJours(date2eDose, aujourdhui)
                    if (delai >= 28) {
                        this.afficheReponse('vaccination-complete')
                    } else {
                        this.afficheReponse('vaccination-delai-28-jours')
                    }
                }
            })
        },
        'date-1re-dose-autres': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                hideElement(form)
                const value = getRadioValue(
                    form,
                    `${this.prefixe}_date_1re_dose_autres_radio`
                )
                if (value === '7_jours_ou_plus') {
                    this.afficheReponse('vaccination-complete')
                } else if (value === 'moins_de_7_jours') {
                    this.afficheReponse('vaccination-delai-7-jours')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'date-2e-dose': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                hideElement(form)
                const value = getRadioValue(form, `${this.prefixe}_date_2e_dose_radio`)
                if (value === '7_jours_ou_plus') {
                    this.afficheReponse('vaccination-complete')
                } else if (value === 'moins_de_7_jours') {
                    this.afficheReponse('vaccination-delai-7-jours')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'type-vaccin': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, `${this.prefixe}_type_vaccin_radio`)
                hideElement(form)
                if (
                    value === 'pfizer' ||
                    value === 'moderna' ||
                    value === 'astrazeneca'
                ) {
                    this.transitionneVersEtape('guerison-avant-1re-dose')
                } else if (value === 'janssen') {
                    this.transitionneVersEtape('date-1re-dose-janssen')
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
                    `${this.prefixe}_guerison_avant_1re_dose_radio`
                )
                hideElement(form)
                if (value === 'oui') {
                    this.transitionneVersEtape('date-1re-dose-autres')
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
                    `${this.prefixe}_depistage_positif_radio`
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
                    `${this.prefixe}_date_derniere_covid_radio`
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
