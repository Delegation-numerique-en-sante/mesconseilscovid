var affichage = require('./affichage.js')
var Algorithme = require('./algorithme.js').Algorithme
var actions = require('./actions.js')
var injection = require('./injection.js')

function page(element, profil, stockageLocal, router) {
    // Hide all conseils that might have been made visible on previous runs.
    affichage.hideSelector(element, '.visible')

    // Use custom illustration if needed
    var extraClass = getCustomIllustrationName(profil)
    if (extraClass) {
        element.querySelector('#conseils-block').classList.add(extraClass)
    }

    // Display appropriate conseils.
    var algorithme = new Algorithme(profil)
    var blockNames = statutBlockNamesToDisplay(algorithme)
    blockNames = blockNames.concat(algorithme.conseilsPersonnelsBlockNamesToDisplay())
    blockNames = blockNames.concat(algorithme.departementBlockNamesToDisplay())
    blockNames = blockNames.concat(algorithme.activiteProBlockNamesToDisplay())
    blockNames = blockNames.concat(algorithme.foyerBlockNamesToDisplay())
    blockNames = blockNames.concat(
        algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
    )
    affichage.displayBlocks(element, blockNames)

    // Make the buttons clickable with appropriated actions.
    actions.bindImpression(element)
    actions.bindSuppression(element, profil, stockageLocal, router)

    // Dynamic data injections.
    injection.departement(element, profil.departement)
    injection.caracteristiques(element, algorithme)
    injection.antecedents(element, algorithme)
}

function getCustomIllustrationName(profil) {
    if (profil.symptomes_actuels) {
        return 'symptomes-actuels'
    }
    if (profil.symptomes_passes) {
        return 'symptomes-passes'
    }
    if (profil.contact_a_risque) {
        return 'contact-a-risque'
    }
}

function statutBlockNamesToDisplay(algorithme) {
    return ['statut-' + algorithme.statut()]
}

module.exports = page
