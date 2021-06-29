import { toggleFormButtonOnTextFieldsRequired } from '../../formutils'

export default function nom(element, app) {
    const form = element.querySelector('form')
    var button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const nom = event.target.elements['name'].value
        app.creerProfil(nom).then(() => {
            app.goToNextPage('nom')
        })
    })
}
