import type App from './app'
import type { RRule } from './ics'
import type Profil from './profil'

import ICS from './ics'
import { CHEMIN_ACCUEIL } from './router'

export function bindCalendar(element: HTMLElement, profil: Profil) {
    const ics = new ICS(navigator.appVersion)
    const duration = 1 // heures bloquées sur le calendrier.
    const urlSuivi = 'https://mesconseilscovid.sante.gouv.fr/#suiviintroduction'

    // Définition de l'évènement de début des symptômes (pas de récurrence).
    if (profil.hasSymptomesStartDate()) {
        ics.addEvent(
            'Début symptômes Covid-19',
            `Vous pouvez faire votre suivi quotidien sur ${urlSuivi}`,
            profil.symptomes_start_date as Date,
            duration,
            undefined
        )
    }

    // Définition de l'évènement récurrent à partir du premier suivi.
    const occurences = 15 // entrées dans le calendrier.
    const rrule: RRule = {
        // Le rappel est quotidien.
        freq: 'DAILY',
        interval: 1,
        count: occurences,
    }
    ics.addEvent(
        'Suivi Covid-19',
        `Aller faire mon suivi quotidien sur ${urlSuivi}`,
        profil.suivi_start_date as Date,
        duration,
        rrule
    )

    const calendar = ics.generateCalendar()

    Array.from(element.querySelectorAll('.js-calendar')).forEach((calendarButton) => {
        const href =
            'data:text/x-vCalendar;charset=utf-8,' + encodeURIComponent(calendar)
        calendarButton.setAttribute('href', href)
    })
}

export function bindImpression(document: Document, app: App) {
    const printButton = document.querySelector('.js-impression')
    printButton?.addEventListener('click', (event) => {
        event.preventDefault()
        app.plausible('Impression')
        try {
            Array.from(document.querySelectorAll('details')).forEach((detail) => {
                detail.setAttribute('open', '')
            })
            window.setTimeout(() => window.print(), 400) // attend la fin de l’animation
        } catch (e) {
            console.error(e)
            alert('Cette fonctionnalité n’est pas présente sur votre appareil')
        }
    })
}

export function bindSuppressionTotale(element: HTMLElement, app: App) {
    element.addEventListener('click', (event) => {
        event.preventDefault()
        app.plausible('Suppression totale')
        if (confirm('Êtes-vous sûr·e de vouloir supprimer tous les profils ?')) {
            app.supprimerTout().then(() => {
                if (app.router) {
                    if (app.router.lastRouteResolved().url !== CHEMIN_ACCUEIL) {
                        app.router.navigate(CHEMIN_ACCUEIL)
                    } else {
                        // @ts-expect-error
                        window.location.reload(true)
                    }
                }
            })
        }
    })
}
