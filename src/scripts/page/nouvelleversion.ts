import type App from '../app'

export default function nouvelleversion(page: HTMLElement, app: App, origine: string | null) {
    const refreshButton: HTMLAnchorElement | null = document.querySelector(
        '#nouvelle-version-disponible-block #refresh-button'
    )
    if (!refreshButton) return
    app.updater.setupRefreshButton(refreshButton, origine)
}
