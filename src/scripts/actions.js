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
    bindSuppression: function (element, app, router) {
        // eslint-disable-next-line no-extra-semi
        ;[].forEach.call(element.querySelectorAll('.js-suppression'), function (
            element
        ) {
            element.addEventListener('click', function (event) {
                event.preventDefault()
                app.supprimerTout().then(() => {
                    router.navigate('introduction')
                })
            })
        })
    },
}
