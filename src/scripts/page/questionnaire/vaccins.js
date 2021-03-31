import {
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils'

export default function vaccins(form, app) {
    premierDemarrageFormulaire(app)

    // Remplir le formulaire avec les données du profil.
    preloadCheckboxForm(form, 'vaccins', app.profil)

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
