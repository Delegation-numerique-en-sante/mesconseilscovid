var affichage = require('./affichage.js')
var algorithme = require('./algorithme.js')
var impression = require('./impression.js')
var injection = require('./injection.js')

function page(element, questionnaire) {
    // Hide all conseils that might have been made visible on previous runs.
    affichage.hideSelector(element, '.visible')

    // Display appropriate conseils.
    var data = algorithme.getData(questionnaire)

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

    // Make the print button clickable.
    impression.setup(element)

    // Dynamic data injections.
    injection.departement(element, data)
    injection.caracteristiques(element, data)
    injection.antecedents(element, data)
}

function statutBlockNamesToDisplay(data) {
    return ['statut-' + algorithme.statut(data)]
}

module.exports = page
