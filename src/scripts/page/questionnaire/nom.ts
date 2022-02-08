import type App from '../../app'
import { toggleFormButtonOnTextFieldsRequired } from '../../formutils'

export default function nom(page: HTMLElement, app: App) {
    const form = page.querySelector('form')
    if (!form) return
    const button: HTMLInputElement | null = form.querySelector('input[type=submit]')
    if (!button) return
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
