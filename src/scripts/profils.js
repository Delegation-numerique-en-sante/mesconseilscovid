var affichage = require('./affichage.js')
var Algorithme = require('./algorithme.js').Algorithme
var conseils = require('./conseils.js')

function profils(element, profil) {
    // Hide all conseils that might have been made visible on previous runs.
    affichage.hideSelector(element, '.visible')

    var algorithme = new Algorithme(profil)

    // Display appropriate reponses.
    conseils.showRelevantBlocks(element, profil, algorithme)

    // Dynamic data injections.
    conseils.showRelevantAnswersRecap(element, profil, algorithme)
}

module.exports = profils
