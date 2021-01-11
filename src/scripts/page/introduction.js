import Profil from '../profil.js'
import { createElementFromHTML, hideElement, showElement } from '../affichage.js'
import { lazilyEmbedVideos } from '../embeds.js'

export default function introduction(element, app) {
    lazilyEmbedVideos()

    const header = document.querySelector('header section')
    showElement(header.querySelector('#js-profil-empty-header'))
    hideElement(header.querySelector('#js-profil-full-header'))

    const container = element.querySelector('#profils-cards')
    app.stockage.getProfils().then((noms) => {
        if (noms.length) {
            hideElement(element.querySelector('.js-intro'))
        }
        if (noms.indexOf('mes_infos') === -1) {
            const card = container.appendChild(
                createElementFromHTML(`
                    <li class="profil-card card">
                        <h3><span class="nouveau-profil">Pour moi</span></h3>
                        <div class="form-controls">
                            <a class="button button-full-width"
                                data-set-profil="mes_infos"
                                href="#${app.questionnaire.firstPage}"
                                >Démarrer</a>
                        </div>
                    </li>
                `)
            )
            bindCreateProfil(card.querySelector('[data-set-profil]'), app)
        }
        container.appendChild(
            createElementFromHTML(`
                <li class="profil-card card">
                    <h3><span class="nouveau-profil">Pour un proche</span></h3>
                    <div class="form-controls">
                        <a class="button button-full-width js-profil-new"
                            href="#nom"
                            >Démarrer</a>
                    </div>
                </li>
            `)
        )
        renderProfilCards(container, noms, app)
    })
}

function renderProfilCards(container, noms, app) {
    const lastCard = container.firstChild
    noms.forEach((nom) => {
        const profil = new Profil(nom)
        app.stockage.charger(profil).then((profil) => {
            const card = container.insertBefore(
                profil.renderCard(app.questionnaire),
                lastCard
            )

            const conseilsLink = card.querySelector('.conseils-link')
            if (conseilsLink) {
                conseilsLink.setAttribute('href', '#conseils')
            }

            const profilLinks = card.querySelectorAll('[data-set-profil]')
            ;[].forEach.call(profilLinks, (profilLink) => {
                bindChangeProfil(profilLink, app)
            })

            bindSuppression(card.querySelector('[data-delete-profil]'), app)
        })
    })
}

function bindCreateProfil(element, app) {
    return _bindFunc(element, app, app.creerProfil.bind(app))
}

function bindChangeProfil(element, app) {
    return _bindFunc(element, app, app.basculerVersProfil.bind(app))
}

function _bindFunc(element, app, func) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        func(element.dataset.setProfil).then(() => {
            app.router.navigate(event.target.getAttribute('href'))
        })
    })
}

function bindSuppression(element, app) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        window.plausible('Suppression')
        const nom = element.dataset.deleteProfil
        const description = nom === 'mes_infos' ? 'votre profil' : `le profil de ${nom}`
        if (confirm(`Êtes-vous sûr·e de vouloir supprimer ${description} ?`)) {
            app.supprimerProfil(nom).then(() => {
                app.chargerProfilActuel().then(() => {
                    // TODO: find a clever way to re-render the current page.
                    window.location.reload(true)
                })
            })
        }
    })
}
