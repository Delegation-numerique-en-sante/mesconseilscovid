import type App from '../../app'
import type Profil from '../../profil'
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
    const form = page.querySelector('form')
    if (!form) return

    app.premierDemarrageFormulaire()

    // Selon le choix radio ça affiche le choix des symptômes et/ou
    // la saisie de la date.
    const statuts: HTMLInputElement[] = form.elements['symptomes_actuels_statuts']
    const choixSymptomes: HTMLInputElement | null =
        form.querySelector('#symptomes-choix')
    if (!choixSymptomes) return
    const debutSymptomes: HTMLInputElement | null =
        form.querySelector('#debut-symptomes')
    if (!debutSymptomes) return
    const debutSymptomesAujourdhui: HTMLInputElement | null = form.querySelector(
        '#debut_symptomes_aujourdhui'
    )
    if (!debutSymptomesAujourdhui) return
    const debutSymptomesAujourdhuiLabel: HTMLInputElement | null = form.querySelector(
        'label[for="debut_symptomes_aujourdhui"]'
    )
    if (!debutSymptomesAujourdhuiLabel) return
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
    let tempAnormale: HTMLInputElement | null = form.querySelector(
        '#symptomes_actuels_temperature'
    )
    if (!tempAnormale) return
    let tempInconnue: HTMLInputElement | null = form.querySelector(
        '#symptomes_actuels_temperature_inconnue'
    )
    if (!tempInconnue) return
    tempAnormale.addEventListener('change', () => {
        if (tempAnormale.checked) tempInconnue.checked = false
    })
    tempInconnue.addEventListener('change', () => {
        if (tempInconnue.checked) tempAnormale.checked = false
    })

    Array.from(form.querySelectorAll('[name="suivi_symptomes_date"]')).forEach(
        (radio) => {
            radio.addEventListener('change', (event) =>
                radioButtonChanged(form, event.target)
            )
        }
    )

    setupDatePicker(form)

    // Soumission du formulaire.
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const symptomes_actuels = event.target.elements['symptomes_actuels'].checked
        const symptomes_passes = event.target.elements['symptomes_passes'].checked

        if (symptomes_actuels) {
            app.profil.symptomes_actuels = symptomes_actuels
            app.profil.symptomes_actuels_temperature =
                event.target.elements['symptomes_actuels_temperature'].checked
            app.profil.symptomes_actuels_temperature_inconnue =
                event.target.elements['symptomes_actuels_temperature_inconnue'].checked
            app.profil.symptomes_actuels_toux =
                event.target.elements['symptomes_actuels_toux'].checked
            app.profil.symptomes_actuels_odorat =
                event.target.elements['symptomes_actuels_odorat'].checked
            app.profil.symptomes_actuels_douleurs =
                event.target.elements['symptomes_actuels_douleurs'].checked
            app.profil.symptomes_actuels_diarrhee =
                event.target.elements['symptomes_actuels_diarrhee'].checked
            app.profil.symptomes_actuels_fatigue =
                event.target.elements['symptomes_actuels_fatigue'].checked
            app.profil.symptomes_actuels_alimentation =
                event.target.elements['symptomes_actuels_alimentation'].checked
            app.profil.symptomes_actuels_souffle =
                event.target.elements['symptomes_actuels_souffle'].checked
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
            ;(
                form.querySelector('#debut_symptomes_aujourdhui') as HTMLInputElement
            ).checked = true
        } else if (profil.symptomes_start_date >= joursAvant(2)) {
            ;(form.querySelector('#debut_symptomes_hier') as HTMLInputElement).checked =
                true
        } else if (profil.symptomes_start_date >= joursAvant(3)) {
            ;(
                form.querySelector('#debut_symptomes_avant_hier') as HTMLInputElement
            ).checked = true
        } else if (profil.symptomes_start_date >= joursAvant(4)) {
            ;(
                form.querySelector(
                    '#debut_symptomes_avant_avant_hier'
                ) as HTMLInputElement
            ).checked = true
        } else {
            ;(
                form.querySelector(
                    '#debut_symptomes_encore_avant_hier'
                ) as HTMLInputElement
            ).checked = true
            let datePicker = form.elements['suivi_symptomes_date_exacte']
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
    const statuts: HTMLInputElement[] | null = Array.from(
        formElement.elements['symptomes_actuels_statuts']
    )
    const datePicker: HTMLInputElement | null = formElement.querySelector(
        '#debut_symptomes_exacte'
    )
    if (!datePicker) return

    function updateSubmitButtonLabelRequired() {
        const allFilled =
            formElement.elements['symptomes_non'].checked ||
            (formElement.elements['symptomes_passes'].checked &&
                dateFromForm(formElement)) ||
            (formElement.elements['symptomes_actuels'].checked &&
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
        ;(
            form.querySelector('#debut_symptomes_encore_avant_hier') as HTMLInputElement
        ).checked = true
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
    let datePicker = form.elements['suivi_symptomes_date_exacte']
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
