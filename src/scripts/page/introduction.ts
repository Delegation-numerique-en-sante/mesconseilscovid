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

    const header = document.querySelector('header section')!
    showElement(header.querySelector('.js-profil-empty'))
    hideElement(header.querySelector('.js-profil-full'))

    metEnAvantCarteSymptomes(element, app)
    navigueVersUneThematique(app, 'Navigue vers une thématique depuis l’accueil')
}

function metEnAvantCarteSymptomes(element: HTMLElement, app: App) {
    const card = element.querySelector<HTMLElement>(
        '.thematiques .cards .j-ai-des-symptomes-covid'
    )!
    app.stockage.getProfils().then((noms: string[]) => {
        if (noms.length > 0) {
            updateCardActions(card, noms, app).then(() => {
                // On remonte la carte au dessus des autres
                card.classList.add('hero')

                // On met en avant le premier bouton du premier profil
                // (ce sera toujours "Moi" si ce profil existe)
                const boutonPrincipal = card.querySelector<HTMLAnchorElement>('.actions-profil a')!
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
    const container = card.querySelector<HTMLElement>('.card-actions')!
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

    const profilLinks = Array.from(
        element.querySelectorAll<HTMLElement>('[data-set-profil]')
    )
        profilLinks.forEach((profilLink) => {
            bindSetProfil(profilLink, app)
        })

    const deleteProfil =
        element.querySelector<HTMLAnchorElement>('[data-delete-profil]')
    if (deleteProfil) {
        bindSuppression(deleteProfil, app)
    }
}

function bindSetProfil(element: HTMLElement, app: App) {
    element.addEventListener('click', (event) => {
        event.preventDefault()
        const target = <HTMLAnchorElement>event.target
        const nextPage = target.getAttribute('href')!
        const setProfil = element.dataset.setProfil!
        app.basculerVersProfil(setProfil).then(() => {
            app.router.navigate(nextPage)
        })
    })
}

function bindSuppression(element: HTMLAnchorElement, app: App) {
    element.addEventListener('click', (event) => {
        event.preventDefault()
        app.plausible('Suppression')
        const nom = element.dataset.deleteProfil!
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
