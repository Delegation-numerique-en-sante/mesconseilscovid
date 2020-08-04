var utils = require('../utils.js')

function page(form, app, router) {
    // Enregistre le démarrage du suivi
    if (!app.profil.hasSuiviStartDate()) {
        app.profil.suivi_start_date = new Date()
        app.enregistrerProfilActuel()
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

    const datePicker = form.querySelector('#suivi_date_exacte')
    datePicker.addEventListener('change', (event) => {
        datePickerChanged(form, event.target)
    })

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_start_date =
            dateFromPicker(event.target.elements['suivi_symptomes_date_exacte']) ||
            dateFromRadioButton(event.target.elements['suivi_symptomes_date'])
        app.enregistrerProfilActuel()
        router.navigate('suivisymptomes')
    })
}

function radioButtonChanged(form, input) {
    let datePicker = form.querySelector('#suivi_date_exacte')
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
    return utils.joursAvant(delta)
}

module.exports = { page }
