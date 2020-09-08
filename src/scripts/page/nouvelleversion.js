function page(element, app, origine) {
    const refreshButton = document.querySelector(
        '#nouvelle-version-disponible-block #refresh-button'
    )
    app.updater.setupRefreshButton(refreshButton, origine)
}

export default {
    page,
}
