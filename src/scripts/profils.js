var Profil = require('./profil.js').Profil

function page(element, app) {
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
