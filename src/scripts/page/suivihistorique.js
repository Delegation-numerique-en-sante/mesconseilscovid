import { bindImpression } from '../actions.js'
import SuiviView from '../suivi.js'

export default function suivihistorique(element, app) {
    const suivi = new SuiviView(app.profil)
    const container = element.querySelector('#historique')
    container.innerHTML = '<div class="break"></div>'
    container.insertBefore(suivi.renderHistorique(), container.firstChild)
    bindImpression(element, app)
}
