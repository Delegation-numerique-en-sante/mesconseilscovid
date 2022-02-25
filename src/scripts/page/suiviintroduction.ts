import type App from '../app'
import { bindCalendar } from '../actions'
import SuiviView from '../suivi'

export default function suiviintroduction(page: HTMLElement, app: App) {
    const element = page
    const suivi = new SuiviView(app.profil, app.suiviImages)
    const container = element.querySelector<HTMLElement>('#profils-cards-suivi')!
    const card = container.insertBefore(suivi.renderCardSuivi(), container.firstChild)
    const deleteSuivi = card.querySelector<HTMLAnchorElement>('[data-delete-suivi]')!
    if (app.profil.hasSuiviStartDate()) {
        bindSuppression(deleteSuivi, app)
        bindCalendar(element, app.profil)
    }
}

function bindSuppression(element: HTMLAnchorElement, app: App) {
    element.addEventListener('click', (event) => {
        event.preventDefault()
        const nom = element.dataset.deleteSuivi
        const description = nom === 'mes_infos' ? 'votre suivi' : `le suivi de ${nom}`
        if (confirm(`Êtes-vous sûr·e de vouloir supprimer ${description} ?`)) {
            app.supprimerSuivi(nom).then(() => {
                app.chargerProfilActuel().then(() => {
                    // TODO: find a clever way to re-render the current page.
                    // @ts-expect-error
                    window.location.reload(true)
                })
            })
        }
    })
}
