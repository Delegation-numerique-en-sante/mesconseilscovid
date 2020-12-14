import { toggleFormButtonOnTextFieldsRequired } from '../../formutils.js'

export default function nom(form, app) {
    var button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        window.plausible('Questionnaire pour un proche')
        const nom = event.target.elements['name'].value
        app.creerProfil(nom).then(() => {
            app.goToNextPage('nom')
        })
    })
}
