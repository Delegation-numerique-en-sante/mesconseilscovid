import { hideElement } from '../affichage.js'
import { joursAvant } from '../utils.js'
import {
    enableOrDisableSecondaryFields,
    toggleFormButtonOnRadioRequired,
} from '../formutils.js'

export default function debutsymptomes(form, app) {
    // On pré-suppose que la personne qui fait son auto-suivi a des symptômes
    form['debut_symptomes'].checked = true

    // On évite de redemander à la personne si elle a des symptômes aujourd’hui
    // lorsque c’était la question précédente
    const previous = app.questionnaire.previousPage('debutsymptomes', app.profil)
    if (previous === 'symptomesactuels') {
        hideElement(form['debut_symptomes'])
    }

    const primary = form.elements['debut_symptomes']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })

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

    const button = form.querySelector('input[type=submit]')
    const pourUnProche = !app.profil.estMonProfil()
    const uncheckedLabel = pourUnProche
        ? 'Cette personne n’a pas de symptômes'
        : 'Je n’ai pas de symptômes'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnRadioRequired(form, button.value, uncheckedLabel, requiredLabel)

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_start_date =
            dateFromPicker(event.target.elements['suivi_symptomes_date_exacte']) ||
            dateFromRadioButton(event.target.elements['suivi_symptomes_date'])

        const debut_symptomes_checked = event.target.elements['debut_symptomes'].checked

        // Enregistre le démarrage du suivi
        if (!app.profil.hasSuiviStartDate() && debut_symptomes_checked) {
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
