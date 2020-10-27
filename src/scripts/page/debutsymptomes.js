import Pikaday from 'pikaday'

import { hideElement } from '../affichage.js'
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

    function isDateSupported() {
        const input = document.createElement('input')
        const value = 'a'
        input.setAttribute('type', 'date')
        input.setAttribute('value', value)
        return input.value !== value
    }

    if (!isDateSupported()) {
        new Pikaday({
            field: datePicker,
            format: 'YYYY-M-D',
            toString(date) {
                const day = date.getDate()
                const month = date.getMonth() + 1
                const year = date.getFullYear()
                return `${year}-${month}-${day}`
            },
            parse(dateString) {
                const parts = dateString.split('-')
                const day = parseInt(parts[0], 10)
                const month = parseInt(parts[1], 10) - 1
                const year = parseInt(parts[2], 10)
                return new Date(year, month, day)
            },
            maxDate: new Date(),
            firstDay: 1, // Semaine débute le lundi.
            i18n: {
                previousMonth: 'Mois précédent',
                nextMonth: 'Mois suivant',
                months: [
                    'Janvier',
                    'Février',
                    'Mars',
                    'Avril',
                    'Mai',
                    'Juin',
                    'Juillet',
                    'Août',
                    'Septembre',
                    'Octobre',
                    'Novembre',
                    'Décembre',
                ],
                weekdays: [
                    'Dimanche',
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi',
                ],
                weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            },
            theme: 'pika-mcc-theme',
        })
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_start_date =
            dateFromPicker(event.target.elements['suivi_symptomes_date_exacte']) ||
            dateFromRadioButton(event.target.elements['suivi_symptomes_date'])

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

function dateFromRadioButton(element) {
    let delta
    switch (element.value) {
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
