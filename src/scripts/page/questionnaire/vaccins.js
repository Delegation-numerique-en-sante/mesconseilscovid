import { addDatePickerPolyfill } from '../../datepicker'
import {
    enableOrDisableSecondaryFields,
    getRadioValue,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils'

export default function vaccins(form, app) {
    premierDemarrageFormulaire(app)

    // Autorise seulement une date passée.
    const now = new Date()
    const datePicker = form.querySelector('#vaccins_start_date')
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePicker, now)
    const datePicker2 = form.querySelector('#vaccins_start_date2')
    datePicker2.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePicker2, now)

    // Remplir le formulaire avec les données du profil.
    preloadCheckboxForm(form, 'vaccins', app.profil)
    if (app.profil.vaccins) {
        if (typeof app.profil.vaccins_start_date !== 'undefined') {
            datePicker.value = app.profil.vaccins_start_date
                .toISOString()
                .substring(0, 10)
        }
        if (typeof app.profil.vaccins_start_date2 !== 'undefined') {
            datePicker2.value = app.profil.vaccins_start_date2
                .toISOString()
                .substring(0, 10)
        }

        if (app.profil.vaccins_type === 'comirnaty') {
            form.querySelector('#vaccins_type_comirnaty').checked = true
        } else if (app.profil.vaccins_type === 'moderna') {
            form.querySelector('#vaccins_type_moderna').checked = true
        } else if (app.profil.vaccins_type === 'astrazeneca') {
            form.querySelector('#vaccins_type_astrazeneca').checked = true
        }
    }

    // La première case active ou désactive les autres.
    var primary = form.elements['vaccins']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', () => {
        enableOrDisableSecondaryFields(form, primary)
    })

    // Le libellé du bouton change en fonction des choix.
    var button = form.querySelector('input[type=submit]')
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas été vacciné·e'
        : 'Cette personne n’a pas été vacciné·e'
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
        app.profil.vaccins = form.elements['vaccins'].checked
        if (app.profil.vaccins) {
            app.profil.vaccins_start_date = new Date(
                form.elements['vaccins_start_date'].value
            )
            app.profil.vaccins_start_date2 = new Date(
                form.elements['vaccins_start_date2'].value
            )
            app.profil.vaccins_type = getRadioValue(form, 'vaccins_type')
        } else {
            app.profil.vaccins_start_date = undefined
            app.profil.vaccins_start_date2 = undefined
            app.profil.vaccins_type = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('vaccins')
        })
    })
}

function premierDemarrageFormulaire(app) {
    if (typeof app.profil.questionnaire_start_date === 'undefined') {
        app.profil.questionnaire_start_date = new Date()
        app.enregistrerProfilActuel()
        app.plausible('Questionnaire commencé')
        if (app.profil.estMonProfil()) {
            app.plausible('Questionnaire commencé pour moi')
        } else {
            app.plausible('Questionnaire commencé pour un proche')
        }
    }
}
