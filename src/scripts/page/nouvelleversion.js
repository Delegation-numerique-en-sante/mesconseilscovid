export default function nouvelleversion(page, app, origine) {
    const refreshButton = document.querySelector(
        '#nouvelle-version-disponible-block #refresh-button'
    )
    app.updater.setupRefreshButton(refreshButton, origine)
}
