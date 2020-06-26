var Profil = require('./profil.js').Profil
var actions = require('./actions.js')
var pagination = require('./pagination.js')

function page(element, app) {
    app.stockage.getProfils().then((noms) => {
        noms.forEach((nom) => {
            var profil = new Profil(nom)
            app.stockage.charger(profil).then((profil) => {
                var container = element.querySelector('#profils-cards')
                var card = container.appendChild(profil.renderCard())
                if (profil.isComplete()) {
                    var conseilsLink = card.querySelector('.conseils-link')
                    var target = pagination.redirectToUnansweredQuestions(
                        'findCorrectExit',
                        profil
                    )
                    conseilsLink.setAttribute('href', '#' + target)
                }
                actions.bindChangeProfil(card.querySelector('[data-profil]'), app)
            })
        })
    })
    actions.bindNewProfil(element.querySelector('.js-profil-new'), app)
}

module.exports = { page }
