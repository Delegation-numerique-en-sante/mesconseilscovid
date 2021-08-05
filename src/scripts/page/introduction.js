import Profil from '../profil'
import {
    createElementFromHTML,
    hideElement,
    showElement,
    showSelector,
} from '../affichage'
import { navigueVersUneThematique } from './thematique'

export default function introduction(page, app) {
    const element = page

    const header = document.querySelector('header section')
    showElement(header.querySelector('.js-profil-empty'))
    hideElement(header.querySelector('.js-profil-full'))

    const card = element.querySelector('.thematiques .cards .j-ai-des-symptomes-covid')
    app.stockage.getProfils().then((noms) => {
        if (noms.length > 0) {
            updateCardActions(card, noms, app).then(() => {
                card.classList.add('highlighted')
                app.stockage.getProfilActuel().then((nom) => {
                    const index = noms.indexOf(nom || 'mes_infos') + 1
                    showSelector(card, `.actions-profil:nth-of-type(${index})`)
                })
                if (noms.length > 1 || noms[0] !== 'mes_infos') {
                    Array.from(card.querySelectorAll('nav')).forEach(showElement)
                }
            })
        }
    })

    navigueVersUneThematique(app, 'Navigue vers une thématique depuis l’accueil')
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
        `<div class="actions-profil" hidden>
            <nav hidden>
                <a href="#" class="prev">◀</a><span class="nom">${profil.affichageNom()}</span><a href="#" class="next">▶</a>
            </nav>
            ${profil.renderButtons(app.questionnaire)}
        </div>`
    )
}

function bindProfilActions(element, app) {
    bindProfilPrecedent(element.querySelector('nav .prev'))
    bindProfilSuivant(element.querySelector('nav .next'))

    const conseilsLink = element.querySelector('.conseils-link')
    if (conseilsLink) {
        conseilsLink.setAttribute('href', '#conseils')
    }

    Array.from(element.querySelectorAll('[data-set-profil]')).forEach((profilLink) => {
        bindSetProfil(profilLink, app)
    })

    bindSuppression(element.querySelector('[data-delete-profil]'), app)
}

function bindProfilPrecedent(element) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        const profilActuel = element.parentElement.parentElement
        const profilPrecedent = profilActuel.previousSibling
        if (profilPrecedent) {
            hideElement(profilActuel)
            showElement(profilPrecedent)
        }
    })
}

function bindProfilSuivant(element) {
    element.addEventListener('click', function (event) {
        event.preventDefault()
        const profilActuel = element.parentElement.parentElement
        const profilSuivant = profilActuel.nextSibling
        if (profilSuivant) {
            hideElement(profilActuel)
            showElement(profilSuivant)
        }
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
