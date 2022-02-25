import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import localeData from 'dayjs/plugin/localeData'

import type App from '../../app'
import {
    createEvent,
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils'

dayjs.locale('fr')
dayjs.extend(localeData)

export default function historique(page: HTMLElement, app: App) {
    const form = page.querySelector('form')!

    const now = dayjs()

    // Remplir le formulaire avec les données du profil.
    preloadCheckboxForm(form, 'covid_passee', app.profil)
    if (typeof app.profil.covid_passee_date !== 'undefined') {
        const covidPasseeDate = dayjs(app.profil.covid_passee_date)
        const monthsAgo = now.diff(covidPasseeDate, 'month')
        const toSelect = form.querySelector<HTMLInputElement>(
            `input#covid_passee_date_${Math.min(6, monthsAgo)}_mois`
        )!
        toSelect.checked = true
        toSelect.dispatchEvent(createEvent('change'))
    }

    // La première case active ou désactive les autres.
    const primary = <HTMLInputElement>form.elements.namedItem('covid_passee')
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', () => {
        enableOrDisableSecondaryFields(form, primary)
    })

    // On enrichit les choix dynamiquement avec les mois concernés.
    ;[2, 3, 4, 5, 6].forEach((i) => {
        const il_y_a_x_mois = now.subtract(i, 'month')
        const label_x_mois = form.querySelector(
            `label[for="covid_passee_date_${i}_mois"] span`
        )
        if (!label_x_mois) return
        const suffix = i === 6 ? ' ou avant' : ''
        label_x_mois.innerHTML = `${
            label_x_mois.innerHTML
        } (en <strong>${il_y_a_x_mois.format(
            'MMMM'
        )}</strong> ${il_y_a_x_mois.year()}${suffix})`
    })

    // Le libellé du bouton change en fonction des choix.
    const button = form.querySelector<HTMLInputElement>('input[type=submit]')!
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
        const target = <HTMLFormElement>event.target
        app.profil.covid_passee = (<HTMLInputElement>(
            target.elements.namedItem('covid_passee')
        ))!.checked
        if (app.profil.covid_passee) {
            const covidPasseeDate = (<HTMLInputElement>(
                target.elements.namedItem('covid_passee_date')
            ))!
            const nbMonths = Number(covidPasseeDate.value)
            app.profil.covid_passee_date = now.subtract(nbMonths, 'month').toDate()
        } else {
            app.profil.covid_passee_date = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('historique')
        })
    })
}
