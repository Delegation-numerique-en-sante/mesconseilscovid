algorithme = require('./algorithme.js')

function statutBlockNamesToDisplay(data) {
    return ['statut-' + algorithme.statut(data)]
}

module.exports = {
    statutBlockNamesToDisplay,
}
