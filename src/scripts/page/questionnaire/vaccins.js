import { createEvent, toggleFormButtonOnRadioRequired } from '../../formutils'

export default function vaccins(form, app) {
    premierDemarrageFormulaire(app)

    // Remplir le formulaire avec les données du profil.
    if (app.profil.vaccins) {
        form['vaccins_radio'].value = 'completement'
        // L’indice n’est pas significatif, on veut que l’évènement soit
        // envoyé pour n’importe laquelle des options.
        form['vaccins_radio'][0].dispatchEvent(createEvent('change'))
    }

    // Le libellé du bouton change en fonction des choix.
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)

    // Soumission du formulaire.
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const form = event.target
        app.profil.vaccins = form.elements['vaccins_radio'].value === 'completement'

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
