import { Profil } from './profil.js'
import pagination from './pagination.js'

function page(element, app) {
    const container = element.querySelector('#profils-cards')
    container.innerHTML = '<div class="break"></div>'
    app.stockage.getProfils().then((noms) => {
        renderProfilCards(container, noms, app)
    })
}

function renderProfilCards(container, noms, app) {
    const lastCard = container.firstChild
    noms.forEach((nom) => {
        const profil = new Profil(nom)
        app.stockage.charger(profil).then((profil) => {
            const card = container.insertBefore(profil.renderCardSuivi(), lastCard)

            const conseilsLink = card.querySelector('.conseils-link')
            if (conseilsLink) {
                const target = pagination.redirectToUnansweredQuestions(
                    'findCorrectExit',
                    profil
                )
                conseilsLink.setAttribute('href', '#' + target)
            }

            const profilLinks = card.querySelectorAll('[data-set-profil]')
            ;[].forEach.call(profilLinks, (profilLink) => {
                bindChangeProfil(profilLink, app)
            })
        })
    })
}

function bindChangeProfil(element, app) {
    return _bindFunc(element, app, app.basculerVersProfil.bind(app))
}

function _bindFunc(element, app, func) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        func(element.dataset.setProfil).then(() => {
            var url = new URL(event.target.href)
            app.router.navigate(url.hash)
        })
    })
}

module.exports = { page }
