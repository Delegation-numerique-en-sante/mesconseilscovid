import type App from '../../app'
import { toggleFormButtonOnTextFieldsRequired } from '../../formutils'

export default function nom(page: HTMLElement, app: App) {
    const form = page.querySelector('form')!
    const button = form.querySelector<HTMLInputElement>('input[type=submit]')!
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const nom = (<HTMLInputElement>form.elements.namedItem('name')).value
        app.creerProfil(nom).then(() => {
            app.goToNextPage('nom')
        })
    })
}
