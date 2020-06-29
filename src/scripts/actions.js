module.exports = {
    bindImpression: function (element) {
        var printButton = element.querySelector('.js-impression')
        printButton.addEventListener('click', function (event) {
            event.preventDefault()
            try {
                window.print()
            } catch (e) {
                alert('Cette fonctionnalité n’est pas présente sur votre appareil')
            }
        })
    },
    bindSuppression: function (element, app) {
        element.addEventListener('click', function (event) {
            event.preventDefault()
            if (confirm('Êtes-vous sûr·e de vouloir supprimer ce profil ?')) {
                app.supprimerProfil(app.profil).then(() => {
                    app.chargerProfilActuel().then(() => {
                        // TODO: find a clever way to re-render the current page.
                        window.location.reload(true)
                    })
                })
            }
        })
    },
    bindSuppressionTotale: function (element, app) {
        element.addEventListener('click', function (event) {
            event.preventDefault()
            if (confirm('Êtes-vous sûr·e de vouloir supprimer tous les profils ?')) {
                app.supprimerTout().then(() => {
                    app.router.navigate('introduction')
                })
            }
        })
    },
}
