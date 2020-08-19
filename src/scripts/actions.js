import { ICS } from './ics.js'

module.exports = {
    bindCalendar: function (element, profil) {
        const ics = new ICS(navigator.appVersion)
        const duration = 1 // heures bloquées sur le calendrier.
        const urlSuivi = 'https://mesconseilscovid.sante.gouv.fr/#suiviintroduction'

        // Définition de l'évènement de début des symptômes (pas de récurrence).
        ics.addEvent(
            'Début symptômes Covid-19',
            `Vous pouvez faire votre suivi quotidien sur ${urlSuivi}`,
            profil.symptomes_start_date,
            duration,
            undefined
        )

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

        // eslint-disable-next-line no-extra-semi
        ;[].forEach.call(element.querySelectorAll('.js-calendar'), (calendarButton) => {
            const href =
                'data:text/x-vCalendar;charset=utf-8,' + encodeURIComponent(calendar)
            calendarButton.setAttribute('href', href)
        })
    },
    bindImpression: function (element) {
        const printButton = element.querySelector('.js-impression')
        printButton.addEventListener('click', (event) => {
            event.preventDefault()
            try {
                window.print()
            } catch (e) {
                alert('Cette fonctionnalité n’est pas présente sur votre appareil')
            }
        })
    },
    bindSuppressionTotale: function (element, app) {
        element.addEventListener('click', (event) => {
            event.preventDefault()
            if (confirm('Êtes-vous sûr·e de vouloir supprimer tous les profils ?')) {
                app.supprimerTout().then(() => {
                    if (app.router.lastRouteResolved().url === 'introduction') {
                        window.location.reload(true)
                    } else {
                        app.router.navigate('introduction')
                    }
                })
            }
        })
    },
}
