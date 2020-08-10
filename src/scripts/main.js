// Polyfills pour ES2015
import 'core-js/features/promise'

// Polyfills pour les API du navigateur
import 'whatwg-fetch'
import './polyfills/custom_event.js'

import { register } from 'timeago.js'

var Updater = require('./updater.js').Updater
var actions = require('./actions.js')
var Router = require('./router.js')
var App = require('./app.js').App

var app = new App()
window.app = app
;(function () {
    app.init()
        .then(() => {
            var router = Router.initRouter(app)
            app.router = router
            router.resolve()
            return router
        })
        .then((router) => {
            var updater = new Updater(router)
            updater.checkForUpdatesEvery(10) // Minutes.

            actions.bindSuppressionTotale(
                document.querySelector('footer .js-suppression'),
                app
            )
        })
})()

register('fr', function (number, index) {
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
