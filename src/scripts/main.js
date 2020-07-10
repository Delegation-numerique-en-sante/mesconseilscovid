// Polyfills pour ES2015
import 'core-js/features/promise'

// Polyfills pour les API du navigateur
import 'whatwg-fetch'
import './polyfills/custom_event.js'

var Updater = require('./updater.js')
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
