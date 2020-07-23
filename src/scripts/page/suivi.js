function page(element, app) {
    const container = element.querySelector('#profils-cards-suivi')
    const card = container.insertBefore(
        app.profil.renderCardSuivi(),
        container.firstChild
    )
    if (app.profil.hasSuiviStartDate()) {
        bindSuppression(card.querySelector('[data-delete-suivi]'), app)
    }
}

function bindSuppression(element, app) {
    element.addEventListener('click', function (event) {
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

module.exports = { page }
