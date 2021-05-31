import Navigo from 'navigo'

import { hideElement, showElement, showMeOrThem } from './affichage'
import { nomProfil } from './injection'
import { titleCase } from './utils'

export function getCurrentPageName() {
    return document.location.pathname.slice(1)
}

export class Router {
    constructor(app) {
        this.app = app
        this.initialTitle = document.title

        this.navigo = this.initNavigo()

        this.setupGlobalHooks()
        this.setupRedirects()
    }

    initNavigo() {
        const root = '/'
        const useHash = false
        return new Navigo(root, useHash)
    }

    resolve() {
        return this.navigo.resolve()
    }

    lastRouteResolved() {
        return this.navigo.lastRouteResolved()
    }

    navigate(target) {
        return this.navigo.navigate(target)
    }

    setupGlobalHooks() {
        this.navigo.hooks({
            before: this.beforeGlobalHook.bind(this),
            after: this.afterGlobalHook.bind(this),
        })
    }

    beforeGlobalHook(done) {
        var header = document.querySelector('header section')
        if (typeof this.app.profil.nom === 'undefined') {
            showElement(header.querySelector('.js-profil-empty'))
            hideElement(header.querySelector('.js-profil-full'))
        } else {
            showElement(header.querySelector('.js-profil-full'))
            hideElement(header.querySelector('.js-profil-empty'))
            nomProfil(header.querySelector('#nom-profil-header'), this.app)
        }
        done()
    }

    afterGlobalHook() {
        this.sendPageChangeEvent()
        this.focusMainHeaderElement()
    }

    sendPageChangeEvent() {
        const pageName = getCurrentPageName()
        document.dispatchEvent(new CustomEvent('pageChanged', { detail: pageName }))
    }

    focusMainHeaderElement() {
        // A11Y: keyboard navigation
        document.querySelector('[role="banner"]').focus()
    }

    addQuestionnaireRoute(pageName, view, pageTitle) {
        const beforeFunc = (profil) => {
            if (typeof profil.nom === 'undefined') {
                profil.resetData('mes_infos')
            }
            return this.app.questionnaire.before(pageName, profil)
        }
        this.addAppRoute(pageName, view, beforeFunc, pageTitle)
    }

    addAppRoute(pageName, view, before, pageTitle) {
        const viewFunc = (element) => {
            view(element, this.app)
        }
        this.addRoute(pageName, viewFunc, before, pageTitle)
    }

    addRoute(pageName, viewFunc, beforeFunc, pageTitle) {
        this.navigo.on(
            new RegExp('/' + pageName),
            () => {
                var element = this.loadPage(pageName, this.app)
                this.updateTitle(element, pageName, pageTitle, this.app.profil)
                this.fillProgress(element, pageName)
                this.fillNavigation(element, pageName)
                viewFunc(element)
                this.navigo.updatePageLinks()
                this.app.trackPageView(pageName)
                const page = element.parentElement
                page.classList.remove('loading')
                page.classList.add('ready')
            },
            {
                before: (done) => {
                    if (typeof beforeFunc === 'undefined') {
                        done()
                        return
                    }

                    const target = beforeFunc(this.app.profil, this.app.questionnaire)
                    if (target && target !== pageName) {
                        this.redirectTo(target)
                        done(false)
                    } else {
                        done()
                    }
                },
            }
        )
    }

    loadPage(pageName) {
        const page = document.querySelector('section#page')
        const section = document.querySelector('#' + pageName)
        const clone = section.cloneNode(true)
        page.classList.remove('ready')
        page.classList.add('loading')
        page.innerHTML = '' // Flush the current content.
        const element = page.insertAdjacentElement(
            'afterbegin',
            clone.firstElementChild
        )
        showMeOrThem(element, this.app.profil)
        this.scrollToTopOfPage()
        return element
    }

    scrollToTopOfPage() {
        if (typeof document.documentElement.scrollTo === 'function') {
            document.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } else {
            document.documentElement.scrollTop = 0
        }
    }

    // A11Y: mise à jour du titre dynamiquement.
    updateTitle(element, pageName, pageTitle, profil) {
        let titlePrefix = pageTitle
        if (typeof pageTitle === 'undefined') {
            const titleElem = element.querySelector('h1, #conseils-block-titre, h2')
            if (titleElem) {
                titlePrefix = titleElem.innerText
            } else {
                titlePrefix = titleCase(pageName)
            }
        }
        const separator = titlePrefix ? ' — ' : ''
        const numeroEtape = this.app.questionnaire.numeroEtape(pageName, profil)
        const etape = numeroEtape ? ` (étape ${numeroEtape})` : ''
        document.title = titlePrefix + etape + separator + this.initialTitle
    }

    fillProgress(element, pageName) {
        const progress = element.querySelector('.progress')
        if (progress) {
            progress.innerText = this.app.questionnaire.etapesRestantes(pageName)
        }
    }

    fillNavigation(element, pageName) {
        const boutonRetour = element.querySelector(
            'form .back-button, .form-controls .back-button'
        )
        if (boutonRetour) {
            const previousPage = this.app.questionnaire.previousPage(
                pageName,
                this.app.profil
            )
            if (previousPage) {
                boutonRetour.setAttribute('href', previousPage)
            }
        }

        Array.from(element.querySelectorAll('.premiere-question')).forEach((lien) => {
            lien.setAttribute('href', this.app.questionnaire.firstPage)
        })
    }

    setupRedirects() {
        // Compatibilité avec les anciens noms de pages.
        this.navigo.on(
            new RegExp('^(symptomesactuels|symptomespasses|debutsymptomes)$'),
            () => {},
            {
                before: (done) => {
                    this.redirectTo('symptomes')
                    done(false)
                },
            }
        )
        this.navigo.on(new RegExp('^(residence|foyer|activitepro)$'), () => {}, {
            before: (done) => {
                this.redirectTo('situation')
                done(false)
            },
        })
        this.navigo.on(new RegExp('^(caracteristiques|antecedents)$'), () => {}, {
            before: (done) => {
                this.redirectTo('sante')
                done(false)
            },
        })

        // Par défaut on retourne à la page d’accueil.
        this.navigo.notFound(() => {
            const hash = document.location.hash
            const fragment = hash ? hash.slice(1) : ''
            if (window.location.pathname === '/' && fragment && this.exists(fragment)) {
                this.redirectTo(fragment)
            } else {
                this.redirectTo('introduction')
            }
        })
    }

    exists(pageName) {
        const target = '/' + pageName
        return this.navigo.helpers.match(target, this.navigo._routes)
    }

    redirectTo(target) {
        if (
            typeof window !== 'undefined' &&
            window.history &&
            window.history.replaceState
        ) {
            // Replace current page with target page in the browser history
            // so that we don’t break the back button.
            const destination = '/' + target + window.location.search
            window.history.replaceState({}, '', destination)
            this.navigo.resolve()
        } else {
            this.navigo.navigate(target)
        }
    }
}
