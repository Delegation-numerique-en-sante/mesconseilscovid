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
    formulaire.demarre()
}

class FormulaireProlongationPassSanitaire extends Formulaire {
    constructor() {
        super('rappel', 'age')
        this.age = undefined
        this.janssen = false
        this.prolongationPass = undefined
    }

    resetFormulaire(document) {
        uncheckAllRadio(document)
        this.age = undefined
        this.janssen = false
        this.prolongationPass = undefined
    }

    GESTIONNAIRES = {
        'demarrage': (form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                hideElement(form)
                this.transitionneVersEtape('age')
            })
        },
        'age': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, `${this.prefixe}_age_radio`)
                this.age = value
                hideElement(form)
                if (value === 'plus65' || value === 'moins65') {
                    this.transitionneVersEtape('vaccination-initiale')
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'vaccination-initiale': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    `${this.prefixe}_vaccination_initiale_radio`
                )
                hideElement(form)
                if (value === 'janssen') {
                    this.janssen = true
                    this.prolongationPass = true
                    this.transitionneVersEtape(
                        'date-derniere-dose',
                        'vaccination-initiale'
                    )
                } else if (value === 'autre') {
                    if (this.age === 'plus65') {
                        this.prolongationPass = true
                        this.transitionneVersEtape(
                            'date-derniere-dose',
                            'vaccination-initiale'
                        )
                    } else {
                        this.transitionneVersEtape('situation-moins65')
                    }
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
                    `${this.prefixe}_situation_moins65_radio`
                )
                hideElement(form)
                if (value === 'comorbidite' || value === 'pro_sante') {
                    this.prolongationPass = false
                    this.transitionneVersEtape(
                        'date-derniere-dose',
                        'situation-moins65'
                    )
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

            const datePicker = form.querySelector(`#${this.prefixe}_date_derniere_dose`)
            addDatePickerPolyfill(datePicker, null, updateButton)

            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const datePicker = form.elements[`${this.prefixe}_date_derniere_dose`]
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

                    let params = {
                        'age':
                            this.age === 'plus65'
                                ? '65 ans ou plus'
                                : 'moins de 65 ans',
                        'vaccin': this.janssen
                            ? 'Janssen'
                            : 'Pfizer, Moderna ou AstraZeneca',
                        'date-derniere-dose': dateDerniereDose.format('LL'),
                        'date-eligibilite-rappel': dateEligibiliteRappel.format('LL'),
                    }

                    if (this.prolongationPass) {
                        params['date-limite-rappel'] = dateLimiteRappel.format('LL')
                        params['desactivation-pass-sanitaire'] =
                            dateLimitePass.format('LL')
                        this.afficheReponse('rappel-et-pass', params)
                    } else {
                        this.afficheReponse('rappel', params)
                    }
                }
            })
        },
    }
}
