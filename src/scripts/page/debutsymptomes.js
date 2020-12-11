import { addDatePickerPolyfill } from '../datepicker'
import { hideElement } from '../affichage.js'
import { getRadioValue } from '../formutils.js'
import { joursAvant } from '../utils.js'

export default function debutsymptomes(form, app) {
    // Si symptômes passés, on n’affiche pas aujourd’hui.
    if (app.profil.symptomes_passes) {
        hideElement(form.querySelector('#debut_symptomes_aujourdhui'))
        hideElement(form.querySelector('label[for="debut_symptomes_aujourdhui"]'))
    }

    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(
        form.querySelectorAll('[name="suivi_symptomes_date"]'),
        (radio) => {
            radio.addEventListener('change', (event) =>
                radioButtonChanged(form, event.target)
            )
        }
    )

    const datePicker = form.querySelector('#debut_symptomes_exacte')
    datePicker.addEventListener('change', (event) => {
        datePickerChanged(form, event.target)
    })
    // Autorise seulement un intervalle de dates (30 derniers jours)
    const now = new Date()
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))
    const trenteJoursAvant = joursAvant(30)
    datePicker.setAttribute('min', trenteJoursAvant.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePicker, trenteJoursAvant, now)

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_start_date =
            dateFromPicker(event.target.elements['suivi_symptomes_date_exacte']) ||
            dateFromRadioButton(getRadioValue(event.target, 'suivi_symptomes_date'))

        // Enregistre le démarrage du suivi
        if (!app.profil.hasSuiviStartDate()) {
            app.profil.suivi_start_date = new Date()
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('debutsymptomes')
        })
    })
}

function radioButtonChanged(form, input) {
    let datePicker = form.querySelector('#debut_symptomes_exacte')
    let submitButton = form.querySelector('input[type="submit"]')
    if (input.value === 'encore_avant_hier') {
        datePicker.removeAttribute('disabled')
        datePicker.setAttribute('max', new Date().toISOString().slice(0, 10))
        datePicker.focus()
        if (datePicker.value === '') {
            submitButton.setAttribute('disabled', '')
        } else {
            submitButton.removeAttribute('disabled')
        }
    } else {
        datePicker.setAttribute('disabled', '')
        submitButton.removeAttribute('disabled')
    }
}

function datePickerChanged(form, input) {
    let submitButton = form.querySelector('input[type="submit"]')
    if (input.value === '') {
        submitButton.setAttribute('disabled', '')
    } else {
        submitButton.removeAttribute('disabled')
    }
}

function dateFromPicker(element) {
    if (element.value !== '') {
        return new Date(element.value)
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
