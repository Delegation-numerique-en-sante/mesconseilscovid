import ICS from './ics'

export function bindCalendar(element, profil) {
    const ics = new ICS(navigator.appVersion)
    const duration = 1 // heures bloquées sur le calendrier.
    const urlSuivi = 'https://mesconseilscovid.sante.gouv.fr/#suiviintroduction'

    // Définition de l'évènement de début des symptômes (pas de récurrence).
    if (profil.hasSymptomesStartDate()) {
        ics.addEvent(
            'Début symptômes Covid-19',
            `Vous pouvez faire votre suivi quotidien sur ${urlSuivi}`,
            profil.symptomes_start_date,
            duration,
            undefined
        )
    }

    // Définition de l'évènement récurrent à partir du premier suivi.
    const occurences = 15 // entrées dans le calendrier.
    const rrule = {
        // Le rappel est quotidien.
        freq: 'DAILY',
        interval: 1,
        count: occurences,
    }
    ics.addEvent(
        'Suivi Covid-19',
        `Aller faire mon suivi quotidien sur ${urlSuivi}`,
        profil.suivi_start_date,
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

export function bindImpression(element, app) {
    const printButton = element.querySelector('.js-impression')
    printButton.addEventListener('click', (event) => {
        event.preventDefault()
        app.plausible('Impression')
        try {
            Array.from(element.querySelectorAll('details')).forEach((detail) => {
                detail.setAttribute('open', '')
            })
            window.setTimeout(() => window.print(), 400) // attend la fin de l’animation
        } catch (e) {
            console.error(e)
            alert('Cette fonctionnalité n’est pas présente sur votre appareil')
        }
    })
}

export function bindSuppressionTotale(element, app) {
    element.addEventListener('click', (event) => {
        event.preventDefault()
        app.plausible('Suppression totale')
        if (confirm('Êtes-vous sûr·e de vouloir supprimer tous les profils ?')) {
            app.supprimerTout().then(() => {
                if (app.router) {
                    if (app.router.lastRouteResolved().url !== 'introduction') {
                        app.router.navigate('introduction')
                    } else {
                        window.location.reload(true)
                    }
                }
            })
        }
    })
}
