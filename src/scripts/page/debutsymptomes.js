import { addDatePickerPolyfill } from '../datepicker'
import { hideElement } from '../affichage.js'
import { getRadioValue } from '../formutils.js'
import { joursAvant } from '../utils.js'

export default function debutsymptomes(form, app) {
    const submitButton = form.querySelector('input[type=submit]')

    // Si symptômes passés, on n’affiche pas aujourd’hui.
    if (app.profil.symptomes_passes) {
        hideElement(form.querySelector('#debut_symptomes_aujourdhui'))
        hideElement(form.querySelector('label[for="debut_symptomes_aujourdhui"]'))
    }

    // Pré-remplir le formulaire avec les données du profil.
    prefillForm(form, app.profil)
    updateSubmitButton(form, submitButton)

    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(
        form.querySelectorAll('[name="suivi_symptomes_date"]'),
        (radio) => {
            radio.addEventListener('change', (event) =>
                radioButtonChanged(form, event.target, submitButton)
            )
        }
    )

    setupDatePicker(form, submitButton)

    form.addEventListener('submit', function (event) {
        event.preventDefault()

        app.profil.symptomes_start_date = dateFromForm(form)

        // Enregistre le démarrage du suivi.
        if (!app.profil.hasSuiviStartDate()) {
            app.profil.suivi_start_date = new Date()
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('debutsymptomes')
        })
    })
}

function prefillForm(form, profil) {
    if (typeof profil.symptomes_start_date !== 'undefined') {
        if (profil.symptomes_start_date >= joursAvant(1)) {
            form.elements['suivi_symptomes_date'].value = 'aujourdhui'
        } else if (profil.symptomes_start_date >= joursAvant(2)) {
            form.elements['suivi_symptomes_date'].value = 'hier'
        } else if (profil.symptomes_start_date >= joursAvant(3)) {
            form.elements['suivi_symptomes_date'].value = 'avant_hier'
        } else if (profil.symptomes_start_date >= joursAvant(4)) {
            form.elements['suivi_symptomes_date'].value = 'avant_avant_hier'
        } else {
            form.elements['suivi_symptomes_date'].value = 'encore_avant_hier'
            let datePicker = form.elements['suivi_symptomes_date_exacte']
            datePicker.value = profil.symptomes_start_date.toISOString().substr(0, 10)
            datePicker.removeAttribute('disabled')
        }
    }
}

function setupDatePicker(form, submitButton) {
    const datePicker = form.querySelector('#debut_symptomes_exacte')

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
        datePicker.removeAttribute('disabled')
        datePicker.setAttribute('max', new Date().toISOString().slice(0, 10))
        datePicker.focus()
    } else {
        datePicker.setAttribute('disabled', '')
    }
}

function updateSubmitButton(form, submitButton) {
    if (dateFromForm(form)) {
        submitButton.value = 'Continuer'
        submitButton.removeAttribute('disabled')
    } else {
        submitButton.value = 'Veuillez remplir le formulaire au complet'
        submitButton.setAttribute('disabled', '')
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
    }
    return joursAvant(delta)
}
