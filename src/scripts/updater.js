var Router = require('./router.js')
var affichage = require('./affichage.js')

module.exports = function (router) {
    this.checkForUpdatesEvery = function (intervalInMinutes) {
        this.checkForUpdate()
        setInterval(this.checkForUpdate.bind(this), intervalInMinutes * 60 * 1000)
    }

    this.checkForUpdate = function () {
        var pageName = Router.getCurrentPageName()
        if (pageName === 'nouvelleversiondisponible') {
            return
        }
        var that = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'version.json?' + new Date().getTime(), true)
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.onload = function () {
            var jsonResponse = JSON.parse(xhr.responseText)
            that.updateVersion(jsonResponse.version)
        }
        xhr.onerror = function () {
            console.debug('Impossible de récupérer les informations de mise à jour')
        }
        xhr.send()
    }

    this.currentVersion = null

    this.updateVersion = function (fetchedVersion) {
        if (this.currentVersion === null || this.currentVersion === fetchedVersion) {
            this.currentVersion = fetchedVersion
            return
        } else {
            var that = this
            var pageName = Router.getCurrentPageName()
            if (this.isFillingQuestionnaire()) {
                document.addEventListener('elementDisplayed:update-banner', function (
                    event
                ) {
                    // Even with an event, we need to wait for the next few
                    // ticks to be able to scroll to the newly visible element.
                    setTimeout(function () {
                        event.detail.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                    var refreshButton = event.detail.querySelector(
                        '#refresh-button-banner'
                    )
                    refreshButton.setAttribute('href', '#' + pageName)
                    refreshButton.addEventListener(
                        'click',
                        that.forceReloadCurrentPageWithHash
                    )
                })
                affichage.displayElementById(document, 'update-banner')
            } else {
                document.addEventListener(
                    'pageChanged:nouvelleversiondisponible',
                    function () {
                        var refreshButton = document.querySelector(
                            '#nouvelle-version-disponible-block #refresh-button'
                        )
                        refreshButton.setAttribute('href', '#' + pageName)
                        refreshButton.addEventListener(
                            'click',
                            that.forceReloadCurrentPageWithHash
                        )
                    }
                )
                router.navigate('nouvelleversiondisponible')
            }
        }
    }

    this.forceReloadCurrentPageWithHash = function () {
        // This one is tricky: we let the browser go to the anchor we just set
        // (no preventDefault) and just after that (timeout=1) we reload the
        // page with `true` parameter == reload from server.
        setTimeout(function () {
            window.location.reload(true)
        }, 1)
    }

    this.isFillingQuestionnaire = function () {
        var pageName = Router.getCurrentPageName()
        return (
            pageName === 'residence' ||
            pageName === 'activitepro' ||
            pageName === 'foyer' ||
            pageName === 'caracteristiques' ||
            pageName === 'antecedents' ||
            pageName === 'symptomesactuels' ||
            pageName === 'symptomespasses' ||
            pageName === 'contactarisque'
        )
    }
}
