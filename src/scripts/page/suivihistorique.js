import { bindImpression } from '../actions.js'

export default function suivihistorique(element, app) {
    const container = element.querySelector('#historique')
    container.innerHTML = '<div class="break"></div>'
    container.insertBefore(app.profil.renderHistorique(), container.firstChild)
    bindImpression(element)
}
