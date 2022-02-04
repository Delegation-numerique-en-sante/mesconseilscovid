import { getLocationPathName } from '../../plausible'

export function estPageThematique() {
    // https://github.com/amilajack/eslint-plugin-compat/discussions/514
    // eslint-disable-next-line compat/compat
    return document.body.classList.contains('page-thematique')
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
