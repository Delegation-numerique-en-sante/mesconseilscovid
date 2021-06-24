import { bindCalendar } from '../actions'
import SuiviView from '../suivi'

export default function suiviintroduction(page, app) {
    const element = page
    const suivi = new SuiviView(app.profil, app.suiviImages)
    const container = element.querySelector('#profils-cards-suivi')
    const card = container.insertBefore(suivi.renderCardSuivi(), container.firstChild)
    if (app.profil.hasSuiviStartDate()) {
        bindSuppression(card.querySelector('[data-delete-suivi]'), app)
        bindCalendar(element, app.profil)
    }
}

function bindSuppression(element, app) {
    element.addEventListener('click', (event) => {
        event.preventDefault()
        const nom = element.dataset.deleteSuivi
        const description = nom === 'mes_infos' ? 'votre suivi' : `le suivi de ${nom}`
        if (confirm(`Êtes-vous sûr·e de vouloir supprimer ${description} ?`)) {
            app.supprimerSuivi(nom).then(() => {
                app.chargerProfilActuel().then(() => {
                    // TODO: find a clever way to re-render the current page.
                    window.location.reload(true)
                })
            })
        }
    })
}
