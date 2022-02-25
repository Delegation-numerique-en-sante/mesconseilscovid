import type App from '../../app'
import { getLocationPathName } from '../../plausible'

export function estPageThematique() {
    return document.body.classList.contains('page-thematique')
}

export function navigueVersUneThematique(app: App, goal: string) {
    const thematiquesLinks =
        document.querySelectorAll<HTMLAnchorElement>('.thematiques a')
    Array.from(thematiquesLinks).forEach((thematiquesLink) => {
        const href = thematiquesLink.getAttribute('href')!
        thematiquesLink.addEventListener('click', (event) => {
            event.preventDefault()
            app.plausible(goal, {
                chemin: `${getLocationPathName()} → ${href}`,
            })
            window.location.href = href
        })
    })
}
