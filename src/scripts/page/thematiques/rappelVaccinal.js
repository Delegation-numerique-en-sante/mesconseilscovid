import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import minMax from 'dayjs/plugin/minMax'

dayjs.locale('fr')
dayjs.extend(localizedFormat)
dayjs.extend(minMax)

import { addDatePickerPolyfill } from '../../datepicker'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    toggleFormButtonOnTextFieldsRequired,
    uncheckAllRadio,
} from '../../formutils'
import { Formulaire } from './formulaire'

// Il faut suivre une arithmétique un peu particulière pour les dates pour être
// cohérent avec l’application TousAntiCovid ainsi qu’avec l’outil de la CNAM
// (https://monrappelvaccincovid.ameli.fr/), sous réserve de leur mise à jour.
// La règle de calcul commune pour l’éligibilité au rappel, comme pour
// l’expiration du passe vaccinal est (finalement) de compter 30,5 jours
// par mois, puis d’arrondir à l’entier supérieur.
const JOURS_DANS_1_MOIS = 31
const JOURS_DANS_2_MOIS = 61
const JOURS_DANS_3_MOIS = 92
const JOURS_DANS_4_MOIS = 122
const JOURS_DANS_7_MOIS = 214

export function dynamiseLeRappelVaccinal(prefixe) {
    const formulaire = new FormulaireRappelVaccinal(prefixe)
    formulaire.demarre()
}

function minIfNotNull(date1, date2) {
    if (!date1) return date2
    if (!date2) return date1
    return dayjs.min(date1, date2)
}

class FormulaireRappelVaccinal extends Formulaire {
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
                this.transitionneVersEtape(form, 'age')
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
                if (value === 'plus65' || value === 'moins65') {
                    this.transitionneVersEtape(form, 'vaccination-initiale')
                } else if (value === 'moins18') {
                    this.transitionneVersEtape(form, 'date-derniere-dose')
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
                if (value === 'janssen') {
                    this.janssen = true
                    this.prolongationPass = true
                    this.transitionneVersEtape(
                        form,
                        'date-derniere-dose',
                        'vaccination-initiale'
                    )
                } else if (value === 'autre') {
                    if (this.age === 'plus65') {
                        this.prolongationPass = true
                        this.transitionneVersEtape(
                            form,
                            'date-derniere-dose',
                            'vaccination-initiale'
                        )
                    } else if (this.age === 'moins65') {
                        this.prolongationPass = true
                        this.transitionneVersEtape(
                            form,
                            'date-derniere-dose',
                            'vaccination-initiale'
                        )
                    }
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
                    const dateDerniereDose = dayjs(datePicker.value)

                    const dateEligibiliteRappel =
                        this.dateEligibiliteRappel(dateDerniereDose)

                    const dateLimitePass = this.dateLimitePass(dateDerniereDose)

                    let params = {
                        'age': this.libelleAge(),
                        'vaccin': this.libelleVaccin(),
                        'date-derniere-dose': dateDerniereDose.format('LL'),
                        'type-dose': this.libelleTypeDose(),
                        'date-eligibilite-rappel': dateEligibiliteRappel.format('LL'),
                    }

                    if (this.prolongationPass) {
                        params['desactivation-passe-vaccinal'] =
                            dateLimitePass.format('LL')
                        this.transitionneVersReponse(form, 'rappel-et-pass', params)
                    } else {
                        this.transitionneVersReponse(form, 'rappel', params)
                    }
                }
            })
        },
    }

    // À partir de quelle date faire le rappel ?
    dateEligibiliteRappel(dateDerniereDose) {
        const debutCampagneRappel = this.debutCampagneRappel()

        const delaiEligibiliteEnJours = this.janssen
            ? JOURS_DANS_1_MOIS
            : JOURS_DANS_3_MOIS

        return dayjs.max(
            debutCampagneRappel,
            dateDerniereDose.add(delaiEligibiliteEnJours, 'day')
        )
    }

    // Extension progressive de la campagne de rappel
    // - début septembre 2021 : ouverture aux 65 ans et plus (& Janssen)
    // - 27 novembre 2021 : ouverture aux 18-64 ans
    // - 24 janvier 2022 : ouverture aux 12-17 ans
    debutCampagneRappel() {
        if (this.age === 'plus65' || this.janssen) {
            return dayjs('2021/09/01')
        } else if (this.age === 'moins18') {
            return dayjs('2022/1/24')
        } else {
            return dayjs('2021/11/27')
        }
    }

    dateLimitePass(dateDerniereDose) {
        // À partir du 15 décembre : 7 mois après la dernière dose
        // pour les personnes de plus de 65 ans
        let dateLimitePass = null
        if (this.age === 'plus65') {
            dateLimitePass = dayjs.max(
                dayjs('2021/12/15'),
                dateDerniereDose.add(JOURS_DANS_7_MOIS, 'day')
            )
        }

        // À partir du 15 décembre :  2 mois après la dose unique
        // pour les personnes vaccinées avec Janssen
        if (this.janssen) {
            dateLimitePass = dayjs.max(
                dayjs('2021/12/15'),
                dateDerniereDose.add(JOURS_DANS_2_MOIS, 'day')
            )
        }

        // À partir du 15 janvier : 7 mois après la dernière dose
        // pour les personnes de plus de 18 ans
        dateLimitePass = minIfNotNull(
            dateLimitePass,
            dayjs.max(
                dayjs('2022/01/15'),
                dateDerniereDose.add(JOURS_DANS_7_MOIS, 'day')
            )
        )

        // À partir du 15 février : 4 mois après la dernière dose
        // pour les personnes de plus de 18 ans
        dateLimitePass = minIfNotNull(
            dateLimitePass,
            dayjs.max(
                dayjs('2022/02/15'),
                dateDerniereDose.add(JOURS_DANS_4_MOIS, 'day')
            )
        )

        return dateLimitePass
    }

    libelleAge() {
        if (this.age === 'plus65') {
            return '65\u00a0ans ou plus'
        } else if (this.age === 'moins65') {
            return 'entre 18 et 64\u00a0ans'
        } else {
            return 'entre 12 et 17\u00a0ans'
        }
    }

    libelleVaccin() {
        if (this.janssen) {
            return 'Janssen'
        } else if (this.age === 'moins18') {
            return 'Pfizer ou Moderna'
        } else {
            return 'Pfizer, Moderna ou AstraZeneca'
        }
    }

    libelleTypeDose() {
        if (this.janssen) {
            return 'injection supplémentaire'
        } else {
            return 'dose de rappel'
        }
    }
}
