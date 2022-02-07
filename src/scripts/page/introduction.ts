import type App from '../app'
import Profil from '../profil'
import {
    createElementFromHTML,
    hideElement,
    showElement,
    hideSelector,
} from '../affichage'
import { navigueVersUneThematique } from './thematiques/navigation'

export default function introduction(page: HTMLElement, app: App) {
    const element = page

    const header = document.querySelector('header section')
    if (header) {
        showElement(header.querySelector('.js-profil-empty'))
        hideElement(header.querySelector('.js-profil-full'))
    }
    metEnAvantCarteSymptomes(element, app)
    navigueVersUneThematique(app, 'Navigue vers une thématique depuis l’accueil')
}

function metEnAvantCarteSymptomes(element: HTMLElement, app: App) {
    const card: HTMLElement | null = element.querySelector(
        '.thematiques .cards .j-ai-des-symptomes-covid'
    )
    if (!card) return
    app.stockage.getProfils().then((noms: string[]) => {
        if (noms.length > 0) {
            updateCardActions(card, noms, app).then(() => {
                // On remonte la carte au dessus des autres
                card.classList.add('hero')

                // On met en avant le premier bouton du premier profil
                // (ce sera toujours "Moi" si ce profil existe)
                const boutonPrincipal = card.querySelector('.actions-profil a')
                if (!boutonPrincipal) return
                boutonPrincipal.classList.remove('button-outline')

                // On cache le nom si ce n’est que mon profil.
                if (noms.length === 1 && noms[0] === 'mes_infos') {
                    hideSelector(card, '.nom')
                }
            })
        }
    })
}

function updateCardActions(card: HTMLElement, noms: string[], app: App) {
    const container = card.querySelector('.card-actions')
    if (!container) return
    return Promise.all(
        noms.map((nom) => {
            const profil = new Profil(nom)
            return app.stockage.charger(profil).then((profil: Profil) => {
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

function renderProfilActions(profil: Profil, app: App) {
    return createElementFromHTML(
        `<div class="actions-profil">
            <p class="nom">${profil.affichageNom()}</p>
            ${profil.renderButtons(app.questionnaire)}
        </div>`
    )
}

function bindProfilActions(element: HTMLElement, app: App) {
    const conseilsLink = element.querySelector('.conseils-link')
    if (conseilsLink) {
        conseilsLink.setAttribute('href', '#conseils')
    }

    const profilLinks: HTMLElement[] | null = Array.from(
        element.querySelectorAll('[data-set-profil]')
    )
    if (profilLinks) {
        profilLinks.forEach((profilLink) => {
            bindSetProfil(profilLink, app)
        })
    }

    const deleteProfil: HTMLElement | null =
        element.querySelector('[data-delete-profil]')
    if (deleteProfil) {
        bindSuppression(deleteProfil, app)
    }
}

function bindSetProfil(element: HTMLElement, app: App) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        if (!event.target) return
        const target = event.target as HTMLAnchorElement
        const nextPage = target.getAttribute('href')
        if (!nextPage) return
        const setProfil = element.dataset.setProfil
        if (!setProfil) return
        app.basculerVersProfil(setProfil).then(() => {
            app.router.navigate(nextPage)
        })
    })
}

function bindSuppression(element: HTMLElement, app: App) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        app.plausible('Suppression')
        const nom = element.dataset.deleteProfil
        if (!nom) return
        const description =
            nom === 'mes_infos' ? 'vos réponses' : `les réponses de ${nom}`
        if (confirm(`Êtes-vous sûr·e de vouloir supprimer ${description} ?`)) {
            app.supprimerProfil(nom).then(() => {
                app.chargerProfilActuel().then(() => {
                    // TODO: find a clever way to re-render the current page.
                    // @ts-expect-error
                    window.location.reload(true)
                })
            })
        }
    })
}
