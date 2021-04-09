import { bindImpression } from '../actions'
import SuiviView from '../suivi'

export default function suivihistorique(element, app) {
    const suivi = new SuiviView(app.profil)
    const container = element.querySelector('#suivi-historique-content')
    container.innerHTML = '<div class="break"></div>'
    container.insertBefore(suivi.renderHistorique(), container.firstChild)
    bindImpression(element, app)
}
