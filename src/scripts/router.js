import Navigo from 'navigo'

import { cloneElementInto, hideElement, showElement, showMeOrThem } from './affichage'
import { bindFeedback, injectFeedbackDifficultes } from './feedback'
import { nomProfil } from './injection'
import { titleCase } from './utils'

export function getCurrentPageName(document) {
    return document.location.pathname.slice(1)
}

export const CHEMIN_ACCUEIL = ''

export class Router {
    constructor(app, window) {
        this.app = app
        this.window = window
        this.document = window.document

        this.initialTitle = this.document.title

        this.navigo = this.initNavigo()

        this.setupGlobalHooks()
        this.setupNotFound()
    }

    initNavigo() {
        return new Navigo('/')
    }

    resolve(path, options) {
        return this.navigo.resolve(path, options)
    }

    getCurrentLocation() {
        return this.navigo.getCurrentLocation()
    }

    navigate(target, options) {
        return this.navigo.navigate(target, options)
    }

    setupGlobalHooks() {
        this.navigo.hooks({
            before: this.beforeGlobalHook.bind(this),
            after: this.afterGlobalHook.bind(this),
        })
    }

    beforeGlobalHook(done) {
        // Rétro-compatibilité : si on est à la racine et que le fragment
        // correspond à une page, alors on y va
        const hash = this.document.location.hash
        const fragment = hash ? hash.slice(1) : ''
        if (
            this.window.location.pathname === '/' &&
            fragment &&
            this.exists(fragment)
        ) {
            this.redirectTo(fragment)
            return done(false)
        }

        var header = this.document.querySelector('header section')
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
        const pageName = getCurrentPageName(this.document)
        this.document.dispatchEvent(
            new this.window.CustomEvent('pageChanged', { detail: pageName })
        )
    }

    focusMainHeaderElement() {
        // A11Y: keyboard navigation
        this.document.querySelector('[role="banner"]').focus()
    }

    addQuestionnaireRoute(pageName, view, options) {
        const beforeFunc = (profil) => {
            if (typeof profil.nom === 'undefined') {
                profil.resetData('mes_infos')
            }
            return this.app.questionnaire.before(pageName, profil)
        }
        const viewFunc = (page, app) => {
            view(page, app)
            injectFeedbackDifficultes(page.querySelector('.feedback-difficultes'))
            bindFeedback(page.querySelector('.feedback-component'), app)
        }
        this.addAppRoute(pageName, viewFunc, { ...options, beforeFunc })
    }

    addAppRoute(pageName, view, options) {
        const viewFunc = (element) => {
            view(element, this.app)
        }
        this.addRoute(pageName, viewFunc, options)
    }

    addRoute(pageName, viewFunc, options) {
        let route
        if (options && typeof options.route !== 'undefined') {
            route = options.route
        } else {
            route = '/' + pageName
        }
        const beforeFunc = options && options.beforeFunc
        const pageTitle = options && options.pageTitle
        this.navigo.on(
            route,
            ({ params }) => {
                const page = this.loadPage(pageName, this.app)
                this.updateTitle(page, pageName, pageTitle, this.app.profil)
                this.fillProgress(page, pageName)
                this.fillNavigation(page, pageName)
                viewFunc(page, params)
                this.navigo.updatePageLinks()
                this.app.trackPageView(pageName)
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
        const page = this.document.querySelector('section#page')
        page.classList.remove('ready')
        page.classList.add('loading')
        cloneElementInto(this.document.querySelector('#' + pageName), page)
        showMeOrThem(page, this.app.profil)
        this.scrollToTopOfPage()
        return page
    }

    scrollToTopOfPage() {
        if (typeof this.document.documentElement.scrollTo === 'function') {
            this.document.documentElement.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } else {
            this.document.documentElement.scrollTop = 0
        }
    }

    // A11Y: mise à jour du titre dynamiquement.
    updateTitle(page, pageName, pageTitle, profil) {
        let titlePrefix = pageTitle
        if (typeof pageTitle === 'undefined') {
            const titleElem = page.querySelector('h1, #conseils-block-titre, h2')
            if (titleElem) {
                titlePrefix = titleElem.innerText
            } else {
                titlePrefix = titleCase(pageName)
            }
        }
        const separator = titlePrefix ? ' — ' : ''
        const numeroEtape = this.app.questionnaire.numeroEtape(pageName, profil)
        const etape = numeroEtape ? ` (étape ${numeroEtape})` : ''
        this.document.title = titlePrefix + etape + separator + this.initialTitle
    }

    fillProgress(page, pageName) {
        const progress = page.querySelector('.progress')
        if (progress) {
            progress.innerText = this.app.questionnaire.etapesRestantes(pageName)
        }
    }

    fillNavigation(page, pageName) {
        const boutonRetour = page.querySelector(
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

        Array.from(page.querySelectorAll('.premiere-question')).forEach((lien) => {
            lien.setAttribute('href', this.app.questionnaire.firstPage)
        })
    }

    setupNotFound() {
        // Par défaut on retourne à la page d’accueil.
        this.navigo.notFound(() => {
            this.redirectTo(CHEMIN_ACCUEIL)
        })
    }

    exists(pageName) {
        const target = pageName !== 'introduction' ? pageName : ''
        return this.navigo.match(target)
    }

    redirectTo(target) {
        if (
            typeof this.window !== 'undefined' &&
            this.window.history &&
            this.window.history.replaceState
        ) {
            // Replace current page with target page in the browser history
            // so that we don’t break the back button.
            const destination = '/' + target + this.window.location.search
            this.window.history.replaceState({}, '', destination)
            this.navigo.resolve()
        } else {
            this.navigo.navigate(target)
        }
    }
}
