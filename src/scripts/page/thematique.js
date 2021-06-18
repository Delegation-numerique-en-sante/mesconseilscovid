export function estPageThematique() {
    return document.body.classList.contains('page-thematique')
}

export function pageThematique(app) {
    app.trackPageView(document.location.pathname)
    boutonBasculeVersMonProfil(app)
    ouvreDetailsSiFragment()
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
