import { bindImpression } from '../actions'
import { bindFeedback } from '../feedback'
import { getLocationPathName } from '../plausible'

export function estPageThematique() {
    return document.body.classList.contains('page-thematique')
}

export function pageThematique(app) {
    app.trackPageView(document.location.pathname)
    bindFeedback(document.querySelector('.feedback-component'), app)
    bindImpression(document, app)
    boutonBasculeVersMonProfil(app)
    ouvreDetailsSiFragment()
    partagePageEnCours()
    navigueVersUneThematique(
        app,
        'Navigue vers une thématique depuis une autre thématique'
    )
}

export function navigueVersUneThematique(app, goal) {
    const thematiquesLinks = document.querySelectorAll('.thematiques a')
    Array.from(thematiquesLinks).forEach((thematiquesLink) => {
        const href = thematiquesLink.getAttribute('href')
        thematiquesLink.addEventListener('click', (event) => {
            event.preventDefault()
            app.plausible(goal, {
                chemin: `${getLocationPathName()} → ${href}`,
            })
            window.location = href
        })
    })
}

function ouvreDetailsSiFragment() {
    const currentAnchor = document.location.hash ? document.location.hash.slice(1) : ''
    if (currentAnchor.substring(0, 7) === 'anchor-') {
        const target = document.querySelector(`#${currentAnchor}`)
        if (!target) return
        if (target.parentElement.tagName === 'DETAILS')
            target.parentElement.setAttribute('open', '')
    }
}

function boutonBasculeVersMonProfil(app) {
    const button = document.querySelector('.cta a.button')
    if (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault()
            app.plausible('Je veux des conseils personnalisés')
            app.basculerVersProfil('mes_infos').then(() => {
                window.location = event.target.getAttribute('href')
            })
        })
    }
}

function partagePageEnCours() {
    const partageLinks = document.querySelectorAll('.feedback-partager a')
    Array.from(partageLinks).forEach((partageLink) => {
        let href = partageLink.href
        let url = new URL(document.URL)
        url.searchParams.set('source', 'partage-thematique')
        href = href.replace(
            'https%3A%2F%2Fmesconseilscovid.sante.gouv.fr%2F',
            encodeURIComponent(url)
        )
        partageLink.href = href
    })
}
