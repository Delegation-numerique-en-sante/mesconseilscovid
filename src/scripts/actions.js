import { ping } from './stats.js'
import { ICS } from './ics.js'

module.exports = {
    bindCalendar: function (element, profil) {
        const subject = 'Suivi COVID19'
        const description =
            'Aller faire mon suivi quotidien sur https://mesconseilscovid.sante.gouv.fr/#suiviintroduction'
        // On démarre à partir de la date de suivi pour les personnes
        // ajoutant le rappel après quelques jours de suivi.
        const startDate = profil.suivi_start_date
        const endDate = profil.suivi_start_date
        const duration = 1 // heures bloquées sur le calendrier.
        endDate.setHours(endDate.getHours() + duration)
        const occurences = 15 // entrées dans le calendrier.
        const rrule = {
            // Le rappel est quotidien.
            freq: 'DAILY',
            interval: 1,
            count: occurences,
        }

        // Génération de l’entrée du calendrier.
        const ics = new ICS(navigator.appVersion)
        ics.addEvent(subject, description, startDate, endDate, rrule)
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
    bindStatistics: function (document) {
        document.addEventListener('pageChanged', (event) => {
            ping(event.detail)
        })
    },
}
