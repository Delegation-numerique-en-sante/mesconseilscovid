var affichage = require('./affichage.js')
var Algorithme = require('./algorithme.js').Algorithme
var conseils = require('./conseils.js')
var injection = require('./injection.js')

function profils(element, app) {
    // Hide all conseils that might have been made visible on previous runs.
    affichage.hideSelector(element, '.visible')

    var algorithme = new Algorithme(app.profil)

    // Display appropriate reponses.
    conseils.showRelevantBlocks(element, app.profil, algorithme)

    // Dynamic data injections.
    conseils.showRelevantAnswersRecap(element, app.profil, algorithme)

    injection.profils(element.querySelector('#noms-profils'), app)
    injection.profil(element.querySelector('#nom-profil'), app)
}

module.exports = profils
