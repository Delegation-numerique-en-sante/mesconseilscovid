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

export function dynamiseLaProlongationDuPass(prefixe) {
    const formulaire = new FormulaireProlongationPassSanitaire(prefixe)
    formulaire.demarre()
}

class FormulaireProlongationPassSanitaire extends Formulaire {
    constructor(prefixe) {
        super(prefixe, 'age')
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
                if (value === 'plus65' || value === 'moins65' || value === 'moins18') {
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
                    } else if (this.age === 'moins65') {
                        this.prolongationPass = true
                        this.transitionneVersEtape(
                            'date-derniere-dose',
                            'vaccination-initiale'
                        )
                    } else {
                        this.transitionneVersEtape('situation-moins18')
                    }
                } else {
                    console.error(`valeur inattendue: ${value}`)
                }
            })
        },
        'situation-moins18': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    `${this.prefixe}_situation_moins18_radio`
                )
                hideElement(form)
                if (value === 'immunodeprimee' || value === 'comorbidite') {
                    this.prolongationPass = false
                    this.transitionneVersEtape(
                        'date-derniere-dose',
                        'situation-moins18'
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
                    const dateDerniereDose = dayjs(datePicker.value)

                    const debutCampagneRappel =
                        this.age === 'plus65' || this.janssen || this.age === 'moins18'
                            ? dayjs('2021/09/01')
                            : dayjs('2021/11/27')

                    // À partir de quelle date faire le rappel ?
                    const delaiEnMois = this.janssen ? 1 : 5
                    const dateEligibiliteRappel = dayjs.max(
                        debutCampagneRappel,
                        dateDerniereDose.add(delaiEnMois, 'month')
                    )

                    // A quel date mon pass cessera-t-il d’être valable ?
                    const dateEntreeEnVigueur =
                        this.age === 'plus65' || this.janssen
                            ? dayjs('2021/12/15')
                            : dayjs('2022/01/15')
                    const dateLimitePass = dayjs.max(
                        dateEntreeEnVigueur,
                        dateDerniereDose.add(delaiEnMois + 2, 'month')
                    )

                    // Avant quelle date faire le rappel pour ne pas perdre son pass ?
                    const dateLimiteRappel = dateLimitePass.subtract(1, 'week')

                    let params = {
                        'age':
                            this.age === 'plus65'
                                ? '65 ans ou plus'
                                : this.age === 'moins65'
                                ? 'entre 18 et 64 ans'
                                : 'moins de 18 ans',
                        'vaccin': this.janssen
                            ? 'Janssen'
                            : 'Pfizer, Moderna ou AstraZeneca',
                        'date-derniere-dose': dateDerniereDose.format('LL'),
                        'date-eligibilite-rappel': dateEligibiliteRappel.format('LL'),
                        'date-entree-en-vigueur': dateEntreeEnVigueur.format('LL'),
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
