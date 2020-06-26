var Profil = require('./profil.js').Profil
var actions = require('./actions.js')

function page(element, app) {
    actions.bindSuppressionTotale(element, app)
    app.stockage.getProfils().then((noms) => {
        noms.forEach((nom) => {
            var profil = new Profil(nom)
            app.stockage.charger(profil).then((profil) => {
                var container = element.querySelector('#profils-content')
                container.appendChild(profil.renderFull())
            })
        })
    })
}

module.exports = { page }
