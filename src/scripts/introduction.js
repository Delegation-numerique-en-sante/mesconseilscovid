import {Profil} from './profil.js'
import actions from './actions.js'
import pagination from './pagination.js'

function page(element, app) {
    app.stockage.getProfils().then((noms) => {
        const container = element.querySelector('#profils-cards')
        if (!noms.length) {
            const profilLink = container.querySelector('[data-profil]')
            actions.bindChangeProfil(profilLink, app)
            return
        }
        container.innerHTML = '' // Empty default state with Démarrer link.
        noms.forEach((nom) => {
            const profil = new Profil(nom)
            app.stockage.charger(profil).then((profil) => {
                const card = container.appendChild(profil.renderCard())
                if (profil.isComplete()) {
                    const conseilsLink = card.querySelector('.conseils-link')
                    const target = pagination.redirectToUnansweredQuestions(
                        'findCorrectExit',
                        profil
                    )
                    conseilsLink.setAttribute('href', '#' + target)
                }
                const profilLinks = card.querySelectorAll('[data-profil]')
                Array.from(profilLinks).forEach((profilLink) => {
                    actions.bindChangeProfil(profilLink, app)
                })
            })
        })
    })
    actions.bindNewProfil(element.querySelector('.js-profil-new'), app)
}

module.exports = { page }
