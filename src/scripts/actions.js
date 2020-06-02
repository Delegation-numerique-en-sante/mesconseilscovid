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
    bindSuppression: function (element, profil, stockageLocal, router) {
        // eslint-disable-next-line no-extra-semi
        ;[].forEach.call(element.querySelectorAll('.js-suppression'), function (
            element
        ) {
            element.addEventListener('click', function (event) {
                event.preventDefault()
                profil.resetData()
                stockageLocal.supprimer()
                router.navigate('introduction')
            })
        })
    },
}
