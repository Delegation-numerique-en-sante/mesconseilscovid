import { addDatePickerPolyfill } from '../../datepicker'
import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils'

export default function historique(form, app) {
    premierDemarrageFormulaire(app)

    // Autorise seulement des dates passées.
    const now = new Date()
    const datePickerCovid1 = form.querySelector('#covid_1re_date')
    datePickerCovid1.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePickerCovid1, now)
    const datePickerCovid2 = form.querySelector('#covid_2e_date')
    datePickerCovid2.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePickerCovid2, now)
    const datePickerVaccin1 = form.querySelector('#vaccins_1re_dose_date')
    datePickerVaccin1.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePickerVaccin1, now)
    const datePickerVaccin2 = form.querySelector('#vaccins_2e_dose_date')
    datePickerVaccin2.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePickerVaccin2, now)

    // Remplir le formulaire avec les données du profil.
    preloadCheckboxForm(form, 'vaccins', app.profil)
    preloadCheckboxForm(form, 'covids_passes', app.profil)
    if (app.profil.covids_passes) {
        if (typeof app.profil.covid_1re_date !== 'undefined') {
            datePickerCovid1.value = app.profil.covid_1re_date
                .toISOString()
                .substring(0, 10)
        }
        if (typeof app.profil.covid_2e_date !== 'undefined') {
            datePickerCovid2.value = app.profil.covid_2e_date
                .toISOString()
                .substring(0, 10)
        }
    }
    if (app.profil.vaccins) {
        if (typeof app.profil.vaccins_1re_dose_date !== 'undefined') {
            datePickerVaccin1.value = app.profil.vaccins_1re_dose_date
                .toISOString()
                .substring(0, 10)
        }
        if (typeof app.profil.vaccins_2e_dose_date !== 'undefined') {
            datePickerVaccin2.value = app.profil.vaccins_2e_dose_date
                .toISOString()
                .substring(0, 10)
        }
    }

    // La première case active ou désactive les autres.
    const primary_covids_passes = form.elements['covids_passes']
    const secondaries_covids_passes = form.querySelectorAll(
        `#${primary_covids_passes.id} ~ .secondary`
    )
    enableOrDisableSecondaryFields(
        form,
        primary_covids_passes,
        secondaries_covids_passes
    )
    primary_covids_passes.addEventListener('click', () => {
        enableOrDisableSecondaryFields(
            form,
            primary_covids_passes,
            secondaries_covids_passes
        )
    })
    const primary_vaccins = form.elements['vaccins']
    const secondaries_vaccins = form.querySelectorAll(
        `#${primary_vaccins.id} ~ .secondary`
    )
    enableOrDisableSecondaryFields(form, primary_vaccins, secondaries_vaccins)
    primary_vaccins.addEventListener('click', () => {
        enableOrDisableSecondaryFields(form, primary_vaccins, secondaries_vaccins)
    })

    // Le libellé du bouton change en fonction des choix.
    const button = form.querySelector('input[type=submit]')
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas d’historique Covid'
        : 'Cette personne n’a pas d’historique Covid'
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
        app.profil.covids_passes = form.elements['covids_passes'].checked
        if (app.profil.covids_passes) {
            app.profil.covid_1re_date = new Date(form.elements['covid_1re_date'].value)
            app.profil.covid_2e_date = new Date(form.elements['covid_2e_date'].value)
        } else {
            app.profil.covid_1re_date = undefined
            app.profil.covid_2e_date = undefined
        }
        app.profil.vaccins = form.elements['vaccins'].checked
        if (app.profil.vaccins) {
            app.profil.vaccins_1re_dose_date = new Date(
                form.elements['vaccins_1re_dose_date'].value
            )
            app.profil.vaccins_2e_dose_date = new Date(
                form.elements['vaccins_2e_dose_date'].value
            )
        } else {
            app.profil.vaccins_1re_dose_date = undefined
            app.profil.vaccins_2e_dose_date = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('historique')
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
