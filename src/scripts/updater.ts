import { Router } from './router'
import { CHEMIN_ACCUEIL, getCurrentPageName } from './router'
import { showElement } from './affichage'
import { ORDRE } from './questionnaire'

export default class Updater {
    router: Router
    currentVersion: string | null
    updateInProgress: boolean

    constructor(router: Router) {
        this.router = router
        this.currentVersion = null
        this.updateInProgress = false
    }

    checkForUpdatesEvery(intervalInMinutes: number) {
        this.checkForUpdate()
        setInterval(this.checkForUpdate.bind(this), intervalInMinutes * 60 * 1000)
    }

    checkForUpdate() {
        if (this.updateInProgress === true) {
            return
        }

        const pageName = getCurrentPageName()
        if (pageName === 'nouvelleversiondisponible') {
            return
        }

        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'version.json?' + new Date().getTime(), true)
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.onload = () => {
            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText)
                this.updateVersion(jsonResponse.version)
            } else {
                console.debug('Impossible de récupérer les informations de mise à jour')
            }
        }
        xhr.onerror = () => {
            console.debug('Impossible de récupérer les informations de mise à jour')
        }
        xhr.send()
    }

    showBanner(document: Document) {
        const block = document.querySelector<HTMLElement>('#update-banner')!
        showElement(block)
        document.dispatchEvent(
            new CustomEvent<HTMLElement>('show-banner', { detail: block })
        )
    }

    updateFooter(fetchedVersion: string) {
        if (this.currentVersion !== fetchedVersion) {
            const element = document.querySelector<HTMLElement>('.js-latest-update')!
            // We might have a version with more characters than a date
            // if multiple releases are required within the same day.
            const datePart = fetchedVersion.substring(0, 10)
            const readableVersion = datePart.split('-').reverse().join('-')
            element.innerText = ` - Mis à jour le : ${readableVersion}`
        }
    }

    updateVersion(fetchedVersion: string) {
        this.updateFooter(fetchedVersion)

        if (this.currentVersion === null || this.currentVersion === fetchedVersion) {
            this.currentVersion = fetchedVersion
            return
        }

        this.updateInProgress = true

        // Update service worker first.
        if ('serviceWorker' in navigator) {
            console.debug('Service worker supported')
            navigator.serviceWorker.getRegistration().then((registration) => {
                console.debug('Telling service worker to look for an update')
                if (!registration) return
                registration.update().catch((err) => {
                    console.error('Mise à jour du service worker impossible :', err)
                })
                registration.addEventListener('updatefound', () => {
                    console.debug('Service worker update found')
                    const newWorker = registration.installing
                    if (!newWorker) return
                    newWorker.addEventListener('statechange', () => {
                        console.debug('New service worker state:', newWorker.state)
                        if (newWorker.state == 'installed') {
                            this.notifyUser()
                        }
                    })
                })
            })
        } else {
            console.debug('Service worker NOT supported')
            this.notifyUser()
        }
    }

    notifyUser() {
        const pageName = getCurrentPageName()
        if (this.onInteractivePage(pageName)) {
            this.notifyUserWithoutInterrupting(pageName)
        } else {
            this.redirectUserToUpdatePage(pageName)
        }
    }

    onInteractivePage(pageName: string) {
        const interactivePages = ORDRE.concat(['suivisymptomes'])
        return interactivePages.indexOf(pageName) > -1
    }

    notifyUserWithoutInterrupting(pageName: string) {
        document.addEventListener('show-banner', ((event: CustomEvent<HTMLElement>) => {
            // Even with an event, we need to wait for the next few
            // ticks to be able to scroll to the newly visible element.
            setTimeout(() => {
                event.detail.scrollIntoView({ behavior: 'smooth' })
            }, 100)
            const refreshButton = event.detail.querySelector<HTMLAnchorElement>(
                '#refresh-button-banner'
            )!
            this.setupRefreshButton(refreshButton, pageName)
        }) as EventListener)
        this.showBanner(document)
    }

    redirectUserToUpdatePage(pageName: string) {
        this.router.navigate(`nouvelleversiondisponible?origine=${pageName}`)
    }

    setupRefreshButton(button: HTMLAnchorElement, pageName: string | null) {
        button.innerText = 'Mettre à jour'
        button.setAttribute('href', '#' + (pageName || CHEMIN_ACCUEIL))
        button.addEventListener('click', this.onClickRefreshButton.bind(this))
    }

    onClickRefreshButton(event: MouseEvent) {
        console.debug('Updater.onClickRefreshButton()')
        event.preventDefault()

        const button = <HTMLAnchorElement>event.target

        // Change the URL without triggering the router.
        this.router.pause()
        console.log(window.location)
        window.location.href = button.href
        console.log(window.location)

        // User feedback as it may take more than a few milliseconds.
        button.innerText = 'Mise à jour en cours...'
        button.setAttribute('href', '')

        if ('serviceWorker' in navigator) {
            // Tell new service worker to activate now.
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (!registration) return
                if (registration.waiting === null) {
                    console.debug('New service worker is already active')
                    console.debug('Reloading the page')
                    // @ts-expect-error
                    window.location.reload(true) // `true` means: reload from server.
                } else {
                    console.debug('New service worker is waiting')
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        console.debug('New service worker is now controlling the page')
                        console.debug('Reloading the page')
                        // @ts-expect-error
                        window.location.reload(true) // `true` means: reload from server.
                    })

                    console.debug('Sending message to activate new service worker')
                    registration.waiting.postMessage('skipWaiting')
                }
            })
        } else {
            console.debug('Browser does not support service workers')
            console.debug('Reloading the page')
            // @ts-expect-error
            window.location.reload(true) // `true` means: reload from server.
        }
    }
}
