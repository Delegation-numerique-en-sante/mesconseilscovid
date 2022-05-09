// Polyfills pour ES2015+
import 'core-js/features/array/from'
import 'core-js/features/object/assign'
import 'core-js/features/promise'

// Polyfills pour les API du navigateur
import 'core-js/web/url'
import 'core-js/web/url-search-params'

import SUIVI_IMAGES from '../suivi_*.svg'

import { register as registerTimeAgo } from 'timeago.js'

import { search, onload } from './recherche'
import { bindSuppressionTotale } from './actions'
import { pageThematique } from './page/thematiques/pageThematique'
import { estPageThematique } from './page/thematiques/navigation'
import App from './app'

var app = new App(SUIVI_IMAGES)
window.app = app
;(function () {
    app.initStats().then(() => {
        if (estPageThematique()) {
            pageThematique(app)
        } else {
            pageQuestionnaire(app)
            activeLesMisesAJourAuto(app)
        }
        initLiensPiedDePage(app)
        initLiensRoleButton()
        initRecherche()
    })
})()

function pageQuestionnaire(app) {
    app.init().then(() => {
        // Seulement pour la racine, sinon ça fait doublon.
        if (location.hash.slice(1) === '') {
            app.trackPageView(document.location.pathname)
        }
        app.setupRoutes()
        app.setupRedirects()
        app.router.resolve()
    })
}

function activeLesMisesAJourAuto(app) {
    app.updater.checkForUpdatesEvery(10) // Minutes.
}

function initLiensPiedDePage(app) {
    bindSuppressionTotale(document.querySelector('footer .js-suppression'), app)
}

function initLiensRoleButton() {
    document.addEventListener('keydown', (event) => {
        // A11Y: lorsque le focus est sur un lien avec un role="button"
        // on veut que la touche espace ait le même comportement que sur
        // un <button> classique : que ça soumette l’action, d’où le clic.
        if (event.key === ' ' || event.key === 'Spacebar') {
            if (
                document.activeElement.hasAttribute('role') &&
                document.activeElement.getAttribute('role') === 'button'
            ) {
                event.preventDefault()
                event.stopPropagation()
                event.target.click()
            }
        }
    })
}

function initRecherche() {
    // Retrieving the search index and stopwords from JSON.
    // See https://v8.dev/blog/cost-of-javascript-2019#json
    let searchIndex = JSON.parse(document.getElementById('search-index').textContent)

    // Get the DOM elements
    let form = document.querySelector('#form-search')
    let input = document.querySelector('#input-search')
    let resultList = document.querySelector('#search-results')
    let searchStatus = document.querySelector('#search-status')

    // Make sure required content exists
    if (!form || !input || !resultList || !searchStatus || !searchIndex) return

    // Create a submit handler
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        search(input.value, searchIndex, searchStatus, resultList)
    })

    // Create a typeahead handler
    form.addEventListener('keyup', () => {
        search(input.value, searchIndex, searchStatus, resultList)
    })

    // Create a reset handler
    form.addEventListener('reset', () => {
        search('', searchIndex, searchStatus, resultList)
        searchStatus.innerHTML = ''
    })

    // Check for query strings onload
    onload(input, searchIndex, searchStatus, resultList)
}

registerTimeAgo('fr', function (number, index) {
    return [
        ["à l'instant", 'dans un instant'],
        ['il y a %s secondes', 'dans %s secondes'],
        ['il y a 1 minute', 'dans 1 minute'],
        ['il y a %s minutes', 'dans %s minutes'],
        ['il y a 1 heure', 'dans 1 heure'],
        ['il y a %s heures', 'dans %s heures'],
        ['il y a 1 jour', 'dans 1 jour'],
        ['il y a %s jours', 'dans %s jours'],
        ['il y a 1 semaine', 'dans 1 semaine'],
        ['il y a %s semaines', 'dans %s semaines'],
        ['il y a 1 mois', 'dans 1 mois'],
        ['il y a %s mois', 'dans %s mois'],
        ['il y a 1 an', 'dans 1 an'],
        ['il y a %s ans', 'dans %s ans'],
    ][index]
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register(new URL('../service-worker.js', import.meta.url), { type: 'module' })
        .then((registration) => {
            console.log(
                'ServiceWorker registration successful with scope: ',
                registration.scope
            )
        })
        .catch((err) => {
            console.log('ServiceWorker registration failed: ', err)
        })
}
