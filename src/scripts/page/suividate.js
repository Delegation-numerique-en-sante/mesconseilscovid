function page(form, app, router) {
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
        const today = new Date()
        return new Date(today.setDate(today.getDate() - delta))
    }

    // Enregistre le démarrage du suivi
    if (!app.profil.hasSuiviStartDate()) {
        app.profil.suivi_start_date = new Date()
        app.enregistrerProfilActuel()
    }

    function radioButtonChanged(event) {
        let datePicker = form.querySelector('#suivi_date_exacte')
        if (event.target.value === 'encore_avant_hier') {
            datePicker.removeAttribute('disabled')
            datePicker.setAttribute('max', new Date().toISOString().slice(0, 10))
            datePicker.focus()
        } else {
            datePicker.setAttribute('disabled', '')
        }
    }
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(
        form.querySelectorAll('[name="suivi_symptomes_date"]'),
        (radio) => {
            radio.addEventListener('change', radioButtonChanged)
        }
    )

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_start_date =
            dateFromPicker(event.target.elements['suivi_symptomes_date_exacte']) ||
            dateFromRadioButton(event.target.elements['suivi_symptomes_date'])
        app.enregistrerProfilActuel()
        router.navigate('suivisymptomes')
    })
}

module.exports = { page }
