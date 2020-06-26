var Profil = require('./profil.js').Profil
var actions = require('./actions.js')

function page(element, app) {
    actions.bindSuppressionTotale(element.querySelector('.js-suppression'), app)
    app.stockage.getProfils().then((noms) => {
        noms.forEach((nom) => {
            var profil = new Profil(nom)
            app.stockage.charger(profil).then((profil) => {
                var container = element.querySelector('#profils-content')
                var profilElement = container.appendChild(profil.renderFull())
                var deleteLink = profilElement.querySelector('[data-profil]')
                if (deleteLink) {
                    actions.bindSuppression(deleteLink, app)
                }
            })
        })
    })
}

module.exports = { page }
