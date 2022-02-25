import type App from '../app'

export default function nouvelleversion(page: HTMLElement, app: App, origine: string | null) {
    const refreshButton = document.querySelector<HTMLAnchorElement>(
        '#nouvelle-version-disponible-block #refresh-button'
    )!
    app.updater.setupRefreshButton(refreshButton, origine)
}
