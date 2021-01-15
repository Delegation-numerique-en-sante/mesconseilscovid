import { hideElement, showElement } from '../../affichage.js'
import { addDatePickerPolyfill, formatDate } from '../../datepicker'
import {
    Form,
    getRadioValue,
    preloadCheckboxForm,
    someChecked,
} from '../../formutils.js'
import { joursAvant } from '../../utils.js'

export default function symptomes(form, app) {
    // Premier démarrage du formulaire ?
    if (typeof app.profil.questionnaire_start_date === 'undefined') {
        app.profil.questionnaire_start_date = new Date()
        app.enregistrerProfilActuel()
        window.plausible('Questionnaire commencé')
        if (app.profil.estMonProfil()) {
            window.plausible('Questionnaire commencé pour moi')
        } else {
            window.plausible('Questionnaire commencé pour un proche')
        }
    }

    // On empêche la soumission du formulaire à l’affichage.
    const submitButton = form.querySelector('input[type=submit]')
    disableSubmitButton(submitButton)

    // Selon le choix radio ça affiche le choix des symptômes et/ou
    // la saisie de la date.
    const statuts = form.elements['symptomes_actuels_statuts']
    const choixSymptomes = form.querySelector('#symptomes-choix')
    const debutSymptomes = form.querySelector('#debut-symptomes')
    const debutSymptomesAujourdhui = form.querySelector('#debut_symptomes_aujourdhui')
    const debutSymptomesAujourdhuiLabel = form.querySelector(
        'label[for="debut_symptomes_aujourdhui"]'
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
            // Le libellé du bouton change en fonction des choix.
            updateSubmitButton(form, submitButton)
        })
    )
    const checkboxes = choixSymptomes.querySelectorAll('input[type=checkbox]')
    Array.from(checkboxes).forEach((checkbox) =>
        checkbox.addEventListener('change', () =>
            updateSubmitButton(form, submitButton)
        )
    )

    // Remplir le formulaire avec les données du profil.
    prefillForm(form, app.profil, submitButton)

    // Les choix concernant la température sont mutuellement exclusifs.
    let tempAnormale = form.querySelector('#symptomes_actuels_temperature')
    let tempInconnue = form.querySelector('#symptomes_actuels_temperature_inconnue')
    tempAnormale.addEventListener('change', () => {
        if (tempAnormale.checked) tempInconnue.checked = false
    })
    tempInconnue.addEventListener('change', () => {
        if (tempInconnue.checked) tempAnormale.checked = false
    })

    Array.from(form.querySelectorAll('[name="suivi_symptomes_date"]')).forEach(
        (radio) => {
            radio.addEventListener('change', (event) =>
                radioButtonChanged(form, event.target, submitButton)
            )
        }
    )

    setupDatePicker(form, submitButton)

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
            app.profil.symptomes_actuels = false
            app.profil.symptomes_passes = true

            // On complète manuellement le formulaire pour le rendre complet.
            app.profil.fillContactARisque(false)

            // On renseigne les dates.
            fillProfilDates(app, form)
        } else {
            app.profil.symptomes_actuels = false
            app.profil.symptomes_passes = false
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('symptomes')
        })
    })
}

function fillProfilDates(app, form) {
    app.profil.symptomes_start_date = dateFromForm(form)

    // Enregistre le démarrage du suivi.
    if (!app.profil.hasSuiviStartDate()) {
        app.profil.suivi_start_date = new Date()
    }
}

function prefillForm(form, profil, submitButton) {
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
    prefillDateForm(form, profil, submitButton)
}

function prefillDateForm(form, profil, submitButton) {
    if (typeof profil.symptomes_start_date !== 'undefined') {
        if (profil.symptomes_start_date >= joursAvant(1)) {
            form.querySelector('#debut_symptomes_aujourdhui').checked = true
        } else if (profil.symptomes_start_date >= joursAvant(2)) {
            form.querySelector('#debut_symptomes_hier').checked = true
        } else if (profil.symptomes_start_date >= joursAvant(3)) {
            form.querySelector('#debut_symptomes_avant_hier').checked = true
        } else if (profil.symptomes_start_date >= joursAvant(4)) {
            form.querySelector('#debut_symptomes_avant_avant_hier').checked = true
        } else {
            form.querySelector('#debut_symptomes_encore_avant_hier').checked = true
            let datePicker = form.elements['suivi_symptomes_date_exacte']
            datePicker.value = formatDate(profil.symptomes_start_date)
        }
        updateSubmitButton(form, submitButton)
    }
}

function setupDatePicker(form, submitButton) {
    const datePicker = form.querySelector('#debut_symptomes_exacte')

    datePicker.addEventListener('click', () => {
        form.querySelector('#debut_symptomes_encore_avant_hier').checked = true
    })

    datePicker.addEventListener('change', () => {
        datePickerChanged(form, submitButton)
    })

    // Autorise seulement un intervalle de dates (30 derniers jours).
    const now = new Date()
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))
    const trenteJoursAvant = joursAvant(30)
    datePicker.setAttribute('min', trenteJoursAvant.toISOString().substring(0, 10))

    addDatePickerPolyfill(datePicker, trenteJoursAvant, now)
}

function radioButtonChanged(form, input, submitButton) {
    updateDatePicker(form, input)
    updateSubmitButton(form, submitButton)
}

function datePickerChanged(form, submitButton) {
    updateSubmitButton(form, submitButton)
}

function updateDatePicker(form, input) {
    let datePicker = form.querySelector('#debut_symptomes_exacte')
    if (input.value === 'encore_avant_hier') {
        datePicker.setAttribute('max', new Date().toISOString().slice(0, 10))
        datePicker.focus()
    } else {
        datePicker.value = ''
    }
}

function enableSubmitButton(submitButton) {
    submitButton.value = 'Continuer'
    submitButton.disabled = false
}

function disableSubmitButton(submitButton) {
    submitButton.value = 'Veuillez remplir le formulaire au complet'
    submitButton.disabled = true
}

function atLeastOneCheckbox(form) {
    const form_ = new Form(form)
    return someChecked(form_.checkboxes)
}

function updateSubmitButton(form, submitButton) {
    if (form.elements['symptomes_non'].checked) {
        enableSubmitButton(submitButton)
    } else if (form.elements['symptomes_passes'].checked && dateFromForm(form)) {
        enableSubmitButton(submitButton)
    } else if (
        form.elements['symptomes_actuels'].checked &&
        atLeastOneCheckbox(form) &&
        dateFromForm(form)
    ) {
        enableSubmitButton(submitButton)
    } else {
        disableSubmitButton(submitButton)
    }
}

function dateFromForm(form) {
    const radioValue = getRadioValue(form, 'suivi_symptomes_date')
    if (radioValue === 'encore_avant_hier') {
        return dateFromPicker(form)
    } else {
        return dateFromRadioButton(radioValue)
    }
}

function dateFromPicker(form) {
    let datePicker = form.elements['suivi_symptomes_date_exacte']
    if (datePicker.value !== '') {
        return new Date(datePicker.value)
    }
}

function dateFromRadioButton(value) {
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
