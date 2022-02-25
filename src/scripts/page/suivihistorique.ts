import type App from '../app'
import { bindImpression } from '../actions'
import SuiviView from '../suivi'

export default function suivihistorique(page: HTMLElement, app: App) {
    const element = page
    const suivi = new SuiviView(app.profil, app.suiviImages)
    const container = element.querySelector<HTMLElement>('#suivi-historique-content')
    if (container) {
        container.innerHTML = '<div class="break"></div>'
        container.insertBefore(suivi.renderHistorique(), container.firstChild)
    }
    bindImpression(element, app)
}
