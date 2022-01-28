import { getRadioValue, toggleFormButtonOnRadioRequired } from '../../formutils'

export default function vaccins(page, app) {
    const form = page.querySelector('form')

    // Remplir le formulaire avec les données du profil.
    if (typeof app.profil.vaccins !== 'undefined') {
        form.querySelector('#vaccins_radio_' + app.profil.vaccins).checked = true
        // L’indice n’est pas significatif, on veut que l’évènement soit
        // envoyé pour n’importe laquelle des options.
        form['vaccins_radio'][0].dispatchEvent(new CustomEvent('change'))
    }

    // Le libellé du bouton change en fonction des choix.
    const button = form.querySelector('input[type=submit]')
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
