import { bindImpression } from '../actions.js'

export function page(element, app) {
    const container = element.querySelector('#historique')
    container.innerHTML = '<div class="break"></div>'
    container.insertBefore(app.profil.renderHistorique(), container.firstChild)
    bindImpression(element)
}
