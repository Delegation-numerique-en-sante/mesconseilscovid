import {
    createEvent,
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils'
import { differenceEnJours, joursAvant } from '../../utils'

export default function historique(form, app) {
    const JOUR_PAR_MOIS = 30 // Approximation acceptable.
    // Remplir le formulaire avec les données du profil.
    preloadCheckboxForm(form, 'covid_passee', app.profil)
    if (typeof app.profil.covid_passee_date !== 'undefined') {
        const difference = differenceEnJours(app.profil.covid_passee_date, new Date())
        const toSelect = form.querySelector(
            `input#covid_passee_date_${difference / JOUR_PAR_MOIS}_mois`
        )
        toSelect.checked = true
        toSelect.dispatchEvent(createEvent('change'))
    }

    // La première case active ou désactive les autres.
    const primary = form.elements['covid_passee']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', () => {
        enableOrDisableSecondaryFields(form, primary)
    })

    // On enrichit les choix dynamiquement avec les mois concernés.
    ;[2, 3, 4, 5, 6].forEach((i) => {
        const il_y_a_x_mois = joursAvant(JOUR_PAR_MOIS * i)
        const month = il_y_a_x_mois.toLocaleString('default', { month: 'long' })
        const label_x_mois = form.querySelector(
            `label[for="covid_passee_date_${i}_mois"] span`
        )
        const suffix = i === 6 ? ' ou avant' : ''
        label_x_mois.innerHTML = `${
            label_x_mois.innerHTML
        } (${month} ${il_y_a_x_mois.getFullYear()}${suffix})`
    })

    // Le libellé du bouton change en fonction des choix.
    const button = form.querySelector('input[type=submit]')
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
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const form = event.target
        app.profil.covid_passee = form.elements['covid_passee'].checked
        if (app.profil.covid_passee) {
            const nbMonths = Number(form.elements['covid_passee_date'].value)
            app.profil.covid_passee_date = joursAvant(nbMonths * 30)
        } else {
            app.profil.covid_passee_date = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('historique')
        })
    })
}
