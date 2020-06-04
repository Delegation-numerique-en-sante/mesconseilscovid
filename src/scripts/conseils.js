var affichage = require('./affichage.js')
var algorithme = require('./algorithme.js')
var actions = require('./actions.js')
var injection = require('./injection.js')

function page(element, profil, stockageLocal, router) {
    // Hide all conseils that might have been made visible on previous runs.
    affichage.hideSelector(element, '.visible')

    // Display appropriate conseils.
    var data = algorithme.getData(profil)

    // Use custom illustration if needed
    var conseilsBlock = element.querySelector('#conseils-block')
    if (data.symptomes_actuels) {
        conseilsBlock.classList.add('symptomes-actuels')
    } else if (data.symptomes_passes) {
        conseilsBlock.classList.add('symptomes-passes')
    } else if (data.contact_a_risque) {
        conseilsBlock.classList.add('contact-a-risque')
    }

    var blockNames = statutBlockNamesToDisplay(data)
    blockNames = blockNames.concat(
        algorithme.conseilsPersonnelsBlockNamesToDisplay(data)
    )
    blockNames = blockNames.concat(algorithme.departementBlockNamesToDisplay(data))
    blockNames = blockNames.concat(algorithme.activiteProBlockNamesToDisplay(data))
    blockNames = blockNames.concat(algorithme.foyerBlockNamesToDisplay(data))
    blockNames = blockNames.concat(
        algorithme.caracteristiquesAntecedentsBlockNamesToDisplay(data)
    )
    affichage.displayBlocks(element, blockNames)

    // Make the buttons clickable with appropriated actions.
    actions.bindImpression(element)
    actions.bindSuppression(element, profil, stockageLocal, router)

    // Dynamic data injections.
    injection.departement(element, data)
    injection.caracteristiques(element, data)
    injection.antecedents(element, data)
}

function statutBlockNamesToDisplay(data) {
    return ['statut-' + algorithme.statut(data)]
}

module.exports = page
