import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import minMax from 'dayjs/plugin/minMax'

dayjs.locale('fr')
dayjs.extend(localizedFormat)
dayjs.extend(minMax)

import { hideElement } from '../../affichage'
import { addDatePickerPolyfill } from '../../datepicker'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    toggleFormButtonOnTextFieldsRequired,
    uncheckAllRadio,
} from '../../formutils'
import { Formulaire } from './formulaire'

export function dynamiseLaProlongationDuPass() {
    const formulaire = new FormulaireProlongationPassSanitaire()
    formulaire.demarre('age')
}

class FormulaireProlongationPassSanitaire extends Formulaire {
    constructor() {
        super('prolongation-pass-sanitaire', 'age')
        this.janssen = false
    }

    resetFormulaire(document) {
        uncheckAllRadio(document)
        this.janssen = false
    }

    GESTIONNAIRES = {
        'age': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'prolongation_pass_sanitaire_age_radio'
                )
                hideElement(form)
                if (value === 'plus65') {
                    this.transitionneVersEtape('situation-plus65')
                } else if (value === 'moins65') {
                    this.transitionneVersEtape('situation-moins65')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'situation-plus65': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'prolongation_pass_sanitaire_situation_plus65_radio'
                )
                hideElement(form)
                if (value === 'age' || value === 'janssen') {
                    if (value === 'janssen') {
                        this.janssen = true
                    }
                    this.transitionneVersEtape('date-derniere-dose')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'situation-moins65': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'prolongation_pass_sanitaire_situation_moins65_radio'
                )
                hideElement(form)
                if (value === 'janssen') {
                    this.janssen = true
                    this.transitionneVersEtape('date-derniere-dose')
                } else if (value === 'autre') {
                    this.afficheReponse('pas-concerne')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'date-derniere-dose': (form) => {
            const button = form.querySelector('input[type=submit]')
            const continueLabel = button.value
            const requiredLabel = 'Cette information est requise'

            const updateButton = () => {
                toggleFormButtonOnTextFieldsRequired(form, continueLabel, requiredLabel)
            }

            updateButton()

            const datePicker = form.querySelector(
                '#prolongation_pass_sanitaire_date_derniere_dose'
            )
            addDatePickerPolyfill(datePicker, null, updateButton)

            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const datePicker =
                    form.elements['prolongation_pass_sanitaire_date_derniere_dose']
                if (datePicker.value !== '') {
                    hideElement(form)
                    // const dateDerniereDose = new Date(datePicker.value)
                    const dateDerniereDose = dayjs(datePicker.value)
                    const delaiEnMois = this.janssen ? 1 : 6
                    const dateEligibiliteRappel = dateDerniereDose.add(
                        delaiEnMois,
                        'month'
                    )

                    const dateLimiteRappelMin = dayjs('2021/12/15')
                    const dateLimiteRappel = dayjs.max(
                        dateLimiteRappelMin,
                        dateDerniereDose.add(delaiEnMois, 'month').add(4, 'week')
                    )

                    const dateLimitePassMin = dateLimiteRappelMin.add(1, 'week')
                    const dateLimitePass = dayjs.max(
                        dateLimitePassMin,
                        dateDerniereDose.add(delaiEnMois, 'month').add(5, 'week')
                    )

                    this.afficheReponse('dates', {
                        'situation': this.janssen
                            ? 'Vous avez été vacciné(e) avec le vaccin <strong>Janssen</strong>.'
                            : 'Vous avez <strong>65 ans ou plus</strong> et avez été vacciné(e) avec le vaccin Pfizer, Moderna ou AstraZeneca.',
                        'date-derniere-dose': dateDerniereDose.format('LL'),
                        'date-eligibilite-rappel': dateEligibiliteRappel.format('LL'),
                        'date-limite-rappel': dateLimiteRappel.format('LL'),
                        'desactivation-pass-sanitaire': dateLimitePass.format('LL'),
                    })
                }
            })
        },
    }
}
