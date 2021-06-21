import { bindFeedback } from '../feedback'

export function estPageThematique() {
    return document.body.classList.contains('page-thematique')
}

export function pageThematique(app) {
    app.trackPageView(document.location.pathname)
    bindFeedback(document.querySelector('.feedback-component'), app)
    boutonBasculeVersMonProfil(app)
    ouvreDetailsSiFragment()
    partagePageEnCours()
}

function ouvreDetailsSiFragment() {
    const currentAnchor = document.location.hash ? document.location.hash.slice(1) : ''
    if (currentAnchor.startsWith('anchor-')) {
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
    partageLinks.forEach((partageLink) => {
        let href = partageLink.href
        href = href.replace(
            'https%3A%2F%2Fmesconseilscovid.sante.gouv.fr%2F',
            encodeURIComponent(document.URL)
        )
        partageLink.href = href
    })
}
