import { Profil } from './profil.js'
import actions from './actions.js'

function page(element, app) {
    actions.bindSuppressionTotale(element.querySelector('.js-suppression'), app)
    app.stockage.getProfils().then((noms) => {
        if (!noms.length) return
        const container = element.querySelector('#profils-content')
        noms.forEach((nom) => {
            const profil = new Profil(nom)
            app.stockage.charger(profil).then((profil) => {
                const profilElement = container.appendChild(profil.renderFull())
                const deleteLink = profilElement.querySelector('[data-delete-profil]')
                if (deleteLink) {
                    actions.bindSuppression(deleteLink, app)
                }
            })
        })
    })
}

module.exports = { page }
