import { toggleFormButtonOnTextFieldsRequired } from '../../formutils.js'

export default function nom(form, app, router) {
    // Premier démarrage du formulaire ?
    if (!app.profil.questionnaire_started) {
        app.profil.questionnaire_started = true
        app.enregistrerProfilActuel()
        window.plausible(`Questionnaire commencé`)
    }

    var button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const nom = event.target.elements['name'].value
        app.creerProfil(nom).then(() => {
            router.navigate('residence')
        })
    })
}
