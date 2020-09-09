import { bindImpression } from '../actions.js'

export function before(profil) {
    if (!profil.isComplete()) return 'conseils'
    if (!profil.hasSymptomesStartDate()) return 'suividate'
    if (!profil.hasHistorique()) return 'suiviintroduction'
}

export function page(element, app) {
    const container = element.querySelector('#historique')
    container.innerHTML = '<div class="break"></div>'
    container.insertBefore(app.profil.renderHistorique(), container.firstChild)
    bindImpression(element)
}
