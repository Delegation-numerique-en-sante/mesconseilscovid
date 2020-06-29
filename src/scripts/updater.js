var pagination = require('./pagination.js')
var affichage = require('./affichage.js')

module.exports = function (router) {
    this.checkForUpdatesEvery = function (intervalInMinutes) {
        this.checkForUpdate()
        setInterval(this.checkForUpdate.bind(this), intervalInMinutes * 60 * 1000)
    }

    this.checkForUpdate = function () {
        const pageName = pagination.getCurrentPageName()
        if (pageName === 'nouvelleversiondisponible') {
            return
        }
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'version.json?' + new Date().getTime(), true)
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.onload = () => {
            const jsonResponse = JSON.parse(xhr.responseText)
            this.updateVersion(jsonResponse.version)
        }
        xhr.onerror = () => {
            console.debug('Impossible de récupérer les informations de mise à jour')
        }
        xhr.send()
    }

    this.currentVersion = null

    this.showBanner = function (document) {
        const block = document.querySelector('#update-banner')
        affichage.showElement(block)

        const customDisplayEvent = document.createEvent('CustomEvent')
        customDisplayEvent.initCustomEvent('show-banner', true, true, block)
        document.dispatchEvent(customDisplayEvent)
    }

    this.updateVersion = function (fetchedVersion) {
        if (this.currentVersion === null || this.currentVersion === fetchedVersion) {
            this.currentVersion = fetchedVersion
            return
        } else {
            const pageName = pagination.getCurrentPageName()
            if (this.isFillingQuestionnaire()) {
                document.addEventListener('show-banner', (event) => {
                    // Even with an event, we need to wait for the next few
                    // ticks to be able to scroll to the newly visible element.
                    setTimeout(() => {
                        event.detail.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                    const refreshButton = event.detail.querySelector(
                        '#refresh-button-banner'
                    )
                    refreshButton.setAttribute('href', '#' + pageName)
                    refreshButton.addEventListener(
                        'click',
                        this.forceReloadCurrentPageWithHash
                    )
                })
                this.showBanner(document)
            } else {
                document.addEventListener(
                    'pageChanged:nouvelleversiondisponible',
                    () => {
                        const refreshButton = document.querySelector(
                            '#nouvelle-version-disponible-block #refresh-button'
                        )
                        refreshButton.setAttribute('href', '#' + pageName)
                        refreshButton.addEventListener(
                            'click',
                            this.forceReloadCurrentPageWithHash
                        )
                    }
                )
                router.navigate('nouvelleversiondisponible')
            }
        }
    }

    this.forceReloadCurrentPageWithHash = function (event) {
        event.preventDefault()
        // We need to go to the page _before_ we reload.
        // Hence the double reload feeling…
        window.location = event.target.href
        window.location.reload(true) // `true` means: reload from server.
    }

    this.isFillingQuestionnaire = function () {
        const pageName = pagination.getCurrentPageName()
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
