import Profil from '../profil'
import {
    createElementFromHTML,
    hideElement,
    showElement,
    hideSelector,
} from '../affichage'
import { navigueVersUneThematique } from './thematiques/main'

export default function introduction(page, app) {
    const element = page

    const header = document.querySelector('header section')
    showElement(header.querySelector('.js-profil-empty'))
    hideElement(header.querySelector('.js-profil-full'))

    metEnAvantCarteSymptomes(element, app)
    navigueVersUneThematique(app, 'Navigue vers une thématique depuis l’accueil')
}

function metEnAvantCarteSymptomes(element, app) {
    const card = element.querySelector('.thematiques .cards .j-ai-des-symptomes-covid')
    app.stockage.getProfils().then((noms) => {
        if (noms.length > 0) {
            updateCardActions(card, noms, app).then(() => {
                // On remonte la carte au dessus des autres
                card.classList.add('hero')

                // On met en avant le premier bouton du premier profil
                // (ce sera toujours "Moi" si ce profil existe)
                const boutonPrincipal = card.querySelector('.actions-profil a')
                boutonPrincipal.classList.remove('button-outline')

                // On cache le nom si ce n’est que mon profil.
                if (noms.length === 1 && noms[0] === 'mes_infos') {
                    hideSelector(card, '.nom')
                }
            })
        }
    })
}

function updateCardActions(card, noms, app) {
    const container = card.querySelector('.card-actions')
    return Promise.all(
        noms.map((nom) => {
            const profil = new Profil(nom)
            return app.stockage.charger(profil).then((profil) => {
                return renderProfilActions(profil, app)
            })
        })
    ).then((actions) => {
        Array.from(actions).forEach((element) => {
            container.appendChild(element)
            bindProfilActions(element, app)
        })
    })
}

function renderProfilActions(profil, app) {
    return createElementFromHTML(
        `<div class="actions-profil">
            <p class="nom">${profil.affichageNom()}</p>
            ${profil.renderButtons(app.questionnaire)}
        </div>`
    )
}

function bindProfilActions(element, app) {
    const conseilsLink = element.querySelector('.conseils-link')
    if (conseilsLink) {
        conseilsLink.setAttribute('href', '#conseils')
    }

    Array.from(element.querySelectorAll('[data-set-profil]')).forEach((profilLink) => {
        bindSetProfil(profilLink, app)
    })

    bindSuppression(element.querySelector('[data-delete-profil]'), app)
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
        const description =
            nom === 'mes_infos' ? 'vos réponses' : `les réponses de ${nom}`
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
