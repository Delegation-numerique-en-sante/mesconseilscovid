import { addDatePickerPolyfill } from '../../datepicker'
import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils'

export default function historique(form, app) {
    // Autorise seulement une date passée.
    const now = new Date()
    const datePicker = form.querySelector('#covid_passee_date')
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePicker, now)

    // Remplir le formulaire avec les données du profil.
    preloadCheckboxForm(form, 'covid_passee', app.profil)
    if (app.profil.covid_passee) {
        if (typeof app.profil.covid_passee_date !== 'undefined') {
            datePicker.value = app.profil.covid_passee_date
                .toISOString()
                .substring(0, 10)
        }
    }

    // La première case active ou désactive les autres.
    var primary = form.elements['covid_passee']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', () => {
        enableOrDisableSecondaryFields(form, primary)
    })

    // Le libellé du bouton change en fonction des choix.
    var button = form.querySelector('input[type=submit]')
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai jamais eu la Covid'
        : 'Cette personne n’a jamais eu la Covid'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnTextFieldsAndRadioRequired(
        form,
        button.value,
        uncheckedLabel,
        requiredLabel
    )

    // Soumission du formulaire.
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const form = event.target
        app.profil.covid_passee = form.elements['covid_passee'].checked
        if (app.profil.covid_passee) {
            app.profil.covid_passee_date = new Date(
                form.elements['covid_passee_date'].value
            )
        } else {
            app.profil.covid_passee_date = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('historique')
        })
    })
}
