import type App from '../../app'
import type Profil from '../../profil'
import type { ProfilDataSymptomesActuels } from '../../profil'
import { hideElement, showElement } from '../../affichage'
import { addDatePickerPolyfill } from '../../datepicker'
import {
    Form,
    createEvent,
    getRadioValue,
    preloadCheckboxForm,
    someChecked,
} from '../../formutils'
import { joursAvant } from '../../utils'
import AlgorithmeOrientation from '../../algorithme/orientation'

export default function symptomes(page: HTMLElement, app: App) {
    const form = page.querySelector('form')!

    app.premierDemarrageFormulaire()

    // Selon le choix radio ça affiche le choix des symptômes et/ou
    // la saisie de la date.
    const statuts = <RadioNodeList>form.elements.namedItem('symptomes_actuels_statuts')!
    const choixSymptomes = <HTMLInputElement>form.querySelector('#symptomes-choix')!
    const debutSymptomes = <HTMLInputElement>form.querySelector('#debut-symptomes')!
    const debutSymptomesAujourdhui = <HTMLInputElement>(
        form.querySelector('#debut_symptomes_aujourdhui')!
    )
    const debutSymptomesAujourdhuiLabel = <HTMLInputElement>(
        form.querySelector('label[for="debut_symptomes_aujourdhui"]')!
    )
    Array.from(statuts).forEach((statut) =>
        statut.addEventListener('change', () => {
            switch (statut.id) {
                case 'symptomes_actuels':
                    showElement(choixSymptomes)
                    showElement(debutSymptomes)
                    showElement(debutSymptomesAujourdhui)
                    showElement(debutSymptomesAujourdhuiLabel)
                    break
                case 'symptomes_passes':
                    hideElement(choixSymptomes)
                    showElement(debutSymptomes)
                    // Si symptômes passés, on n’affiche pas aujourd’hui et
                    // et on décoche la case si elle était cochée pour ne pas
                    // pouvoir soumettre le formulaire.
                    debutSymptomesAujourdhui.checked = false
                    hideElement(debutSymptomesAujourdhui)
                    hideElement(debutSymptomesAujourdhuiLabel)
                    break
                case 'symptomes_non':
                    hideElement(choixSymptomes)
                    hideElement(debutSymptomes)
                    break
            }
        })
    )

    // Remplir le formulaire avec les données du profil.
    prefillForm(form, app.profil)

    // Activer ou pas le bouton de validation.
    toggleFormButtonOnSymptomesFieldsRequired(form, dateFromForm)

    // Les choix concernant la température sont mutuellement exclusifs.
    let tempAnormale = <HTMLInputElement>(
        form.querySelector('#symptomes_actuels_temperature')!
    )
    let tempInconnue = <HTMLInputElement>(
        form.querySelector('#symptomes_actuels_temperature_inconnue')!
    )
    tempAnormale.addEventListener('change', () => {
        if (tempAnormale.checked) tempInconnue.checked = false
    })
    tempInconnue.addEventListener('change', () => {
        if (tempInconnue.checked) tempAnormale.checked = false
    })

    Array.from(form.querySelectorAll('[name="suivi_symptomes_date"]')).forEach(
        (radio) => {
            radio.addEventListener('change', (event) => {
                radioButtonChanged(form, event.target)
            })
        }
    )

    setupDatePicker(form)

    // Soumission du formulaire.
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const target = <HTMLFormElement>event.target
        const symptomes_actuels = (<HTMLInputElement>(
            target.elements.namedItem('symptomes_actuels')
        ))!.checked
        const symptomes_passes = (<HTMLInputElement>(
            target.elements.namedItem('symptomes_passes')
        ))!.checked

        if (symptomes_actuels) {
            const symptomesActuelsItems = <(keyof ProfilDataSymptomesActuels)[]>[
                'symptomes_actuels',
                'symptomes_actuels_temperature',
                'symptomes_actuels_temperature_inconnue',
                'symptomes_actuels_toux',
                'symptomes_actuels_odorat',
                'symptomes_actuels_douleurs',
                'symptomes_actuels_diarrhee',
                'symptomes_actuels_fatigue',
                'symptomes_actuels_alimentation',
                'symptomes_actuels_souffle',
            ]
            for (const item of symptomesActuelsItems) {
                app.profil[item] = (<HTMLInputElement>(
                    target.elements.namedItem(item)
                ))!.checked
            }

            app.profil.symptomes_passes = false

            // On complète manuellement le formulaire pour le rendre complet.
            app.profil.fillContactARisque(false)

            // On renseigne les dates.
            fillProfilDates(app, form)
        } else if (symptomes_passes) {
            resetSymptomesActuels(app)
            app.profil.symptomes_passes = true

            // On complète manuellement le formulaire pour le rendre complet.
            app.profil.fillContactARisque(false)

            // On renseigne les dates.
            fillProfilDates(app, form)
        } else {
            resetSymptomesActuels(app)
            app.profil.symptomes_passes = false
            app.profil.symptomes_start_date = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('symptomes')
        })
    })
}

function fillProfilDates(app: App, form: HTMLFormElement) {
    app.profil.symptomes_start_date = dateFromForm(form)

    // Enregistre le démarrage du suivi.
    var algoOrientation = new AlgorithmeOrientation(app.profil)
    if (algoOrientation.recommandeAutoSuivi() && !app.profil.hasSuiviStartDate()) {
        app.profil.suivi_start_date = new Date()
    }
}

function resetSymptomesActuels(app: App) {
    app.profil.symptomes_actuels = false
    app.profil.symptomes_actuels_temperature = false
    app.profil.symptomes_actuels_temperature_inconnue = false
    app.profil.symptomes_actuels_toux = false
    app.profil.symptomes_actuels_odorat = false
    app.profil.symptomes_actuels_douleurs = false
    app.profil.symptomes_actuels_diarrhee = false
    app.profil.symptomes_actuels_fatigue = false
    app.profil.symptomes_actuels_alimentation = false
    app.profil.symptomes_actuels_souffle = false
}

function prefillForm(form: HTMLFormElement, profil: Profil) {
    preloadCheckboxForm(form, 'symptomes_actuels', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_temperature', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_temperature_inconnue', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_toux', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_odorat', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_douleurs', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_diarrhee', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_fatigue', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_alimentation', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_souffle', profil)
    preloadCheckboxForm(form, 'symptomes_actuels_autre', profil)
    preloadCheckboxForm(form, 'symptomes_passes', profil)
    prefillDateForm(form, profil)
    if (profil.symptomes_actuels === false && profil.symptomes_passes === false) {
        form['symptomes_non'].checked = true
        form['symptomes_non'].dispatchEvent(createEvent('change'))
    }
}

function prefillDateForm(form: HTMLFormElement, profil: Profil) {
    if (typeof profil.symptomes_start_date !== 'undefined') {
        if (profil.symptomes_start_date >= joursAvant(1)) {
            form.querySelector<HTMLInputElement>(
                '#debut_symptomes_aujourdhui'
            )!.checked = true
        } else if (profil.symptomes_start_date >= joursAvant(2)) {
            form.querySelector<HTMLInputElement>('#debut_symptomes_hier')!.checked =
                true
        } else if (profil.symptomes_start_date >= joursAvant(3)) {
            form.querySelector<HTMLInputElement>(
                '#debut_symptomes_avant_hier'
            )!.checked = true
        } else if (profil.symptomes_start_date >= joursAvant(4)) {
            form.querySelector<HTMLInputElement>(
                '#debut_symptomes_avant_avant_hier'
            )!.checked = true
        } else {
            form.querySelector<HTMLInputElement>(
                '#debut_symptomes_encore_avant_hier'
            )!.checked = true
            let datePicker = <HTMLInputElement>(
                form.elements.namedItem('suivi_symptomes_date_exacte')!
            )
            datePicker.value = profil.symptomes_start_date
                .toISOString()
                .substring(0, 10)
        }
    }
}

function toggleFormButtonOnSymptomesFieldsRequired(
    formElement: HTMLFormElement,
    dateFromForm: Function
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const continueLabel = 'Continuer'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    const statuts = Array.from(
        <RadioNodeList>formElement.elements.namedItem('symptomes_actuels_statuts')
    )
    const datePicker = formElement.querySelector<HTMLInputElement>(
        '#debut_symptomes_exacte'
    )!

    function updateSubmitButtonLabelRequired() {
        const allFilled =
            (<HTMLInputElement>formElement.elements.namedItem('symptomes_non'))!
                .checked ||
            ((<HTMLInputElement>formElement.elements.namedItem('symptomes_passes'))!
                .checked &&
                dateFromForm(formElement)) ||
            ((<HTMLInputElement>formElement.elements.namedItem('symptomes_actuels'))!
                .checked &&
                someChecked(form.checkboxes) &&
                dateFromForm(formElement))
        button.disabled = !allFilled
        button.value = allFilled ? continueLabel : requiredLabel
    }

    updateSubmitButtonLabelRequired()

    statuts.forEach((statut) =>
        statut.addEventListener('change', updateSubmitButtonLabelRequired)
    )
    form.checkboxes.forEach((checkbox) =>
        checkbox.addEventListener('change', updateSubmitButtonLabelRequired)
    )
    Array.from(formElement.querySelectorAll('[name="suivi_symptomes_date"]')).forEach(
        (radio) => {
            radio.addEventListener('change', updateSubmitButtonLabelRequired)
        }
    )
    datePicker.addEventListener('change', updateSubmitButtonLabelRequired)
}

function setupDatePicker(form: HTMLFormElement) {
    const datePicker: HTMLInputElement | null = form.querySelector(
        '#debut_symptomes_exacte'
    )
    if (!datePicker) return

    datePicker.addEventListener('click', () => {
        form.querySelector<HTMLInputElement>(
            '#debut_symptomes_encore_avant_hier'
        )!.checked = true
    })

    // Autorise seulement une date dans le passé.
    const now = new Date()
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))

    addDatePickerPolyfill(datePicker, now, undefined)
}

function radioButtonChanged(form: HTMLFormElement, input: HTMLInputElement) {
    updateDatePicker(form, input)
}

function updateDatePicker(form: HTMLFormElement, input: HTMLInputElement) {
    let datePicker: HTMLInputElement | null = form.querySelector(
        '#debut_symptomes_exacte'
    )
    if (!datePicker) return
    if (input.value === 'encore_avant_hier') {
        datePicker.setAttribute('max', new Date().toISOString().slice(0, 10))
        datePicker.focus()
    } else {
        datePicker.value = ''
    }
}

function dateFromForm(form: HTMLFormElement) {
    const radioValue = getRadioValue(form, 'suivi_symptomes_date')
    if (!radioValue) return
    if (radioValue === 'encore_avant_hier') {
        return dateFromPicker(form)
    } else {
        return dateFromRadioButton(radioValue)
    }
}

function dateFromPicker(form: HTMLFormElement) {
    let datePicker = <HTMLInputElement>(
        form.elements.namedItem('suivi_symptomes_date_exacte')
    )
    if (datePicker.value !== '') {
        return new Date(datePicker.value)
    }
}

function dateFromRadioButton(value: string) {
    let delta
    switch (value) {
        case 'aujourdhui':
            delta = 0
            break
        case 'hier':
            delta = 1
            break
        case 'avant_hier':
            delta = 2
            break
        case 'avant_avant_hier':
            delta = 3
            break
        default:
            return undefined
    }
    return joursAvant(delta)
}
