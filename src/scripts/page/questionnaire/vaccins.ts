import type App from '../../app'
import {
    createEvent,
    getRadioValue,
    toggleFormButtonOnRadioRequired,
} from '../../formutils'

export default function vaccins(page: HTMLElement, app: App) {
    const form = page.querySelector('form')
    if (!form) return

    // Remplir le formulaire avec les données du profil.
    if (typeof app.profil.vaccins !== 'undefined') {
        ;(
            form.querySelector(
                '#vaccins_radio_' + app.profil.vaccins
            ) as HTMLInputElement
        ).checked = true
        // L’indice n’est pas significatif, on veut que l’évènement soit
        // envoyé pour n’importe laquelle des options.
        form['vaccins_radio'][0].dispatchEvent(createEvent('change'))
    }

    // Le libellé du bouton change en fonction des choix.
    const button: HTMLInputElement | null = form.querySelector('input[type=submit]')
    if (!button) return
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)

    // Soumission du formulaire.
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const form = event.target
        app.profil.vaccins = getRadioValue(form, 'vaccins_radio')

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('vaccins')
        })
    })
}
