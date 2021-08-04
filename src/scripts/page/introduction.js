import Profil from '../profil'
import { createElementFromHTML, hideElement, showElement } from '../affichage'
import { navigueVersUneThematique } from './thematique'

export default function introduction(page, app) {
    const element = page

    const header = document.querySelector('header section')
    showElement(header.querySelector('.js-profil-empty'))
    hideElement(header.querySelector('.js-profil-full'))

    app.stockage.getProfils().then((noms) => {
        const card = element.querySelector(
            '.thematiques .cards .j-ai-des-symptomes-covid'
        )
        renderActionsIfNeeded(card, 'mes_infos', app).then((actions) => {
            if (noms.indexOf('mes_infos') !== -1) {
                card.classList.add('highlighted')
                showElement(actions)
            } else {
                card.classList.remove('highlighted')
                hideElement(actions)
            }
        })
    })

    navigueVersUneThematique(app, 'Navigue vers une thématique depuis l’accueil')
}

function renderActionsIfNeeded(card, nom, app) {
    const profil = new Profil(nom)
    return app.stockage.charger(profil).then((profil) => {
        let actions = card.querySelector('.card-actions')
        if (!actions) {
            actions = card.appendChild(
                createElementFromHTML(
                    `<div class="card-actions">${profil.renderButtons(
                        app.questionnaire
                    )}</div>`
                )
            )

            const conseilsLink = actions.querySelector('.conseils-link')
            if (conseilsLink) {
                conseilsLink.setAttribute('href', '#conseils')
            }

            Array.from(actions.querySelectorAll('[data-set-profil]')).forEach(
                (profilLink) => {
                    bindSetProfil(profilLink, app)
                }
            )

            bindSuppression(actions.querySelector('[data-delete-profil]'), app)
        }
        return actions
    })
}

function bindSetProfil(element, app) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        app.basculerVersProfil(element.dataset.setProfil).then(() => {
            app.router.navigate(event.target.getAttribute('href'))
        })
    })
}

function bindSuppression(element, app) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        app.plausible('Suppression')
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
