export function estPageThematique() {
    return document.body.classList.contains('page-thematique')
}

export function pageThematique(app) {
    app.trackPageView(document.location.pathname)
    boutonBasculeVersMonProfil(app)
}

function boutonBasculeVersMonProfil(app) {
    const button = document.querySelector('.cta a.button')
    if (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault()
            app.plausible('Je veux des conseils personnalisés')
            app.creerProfil('mes_infos').then(() => {
                window.location = event.target.getAttribute('href')
            })
        })
    }
}
