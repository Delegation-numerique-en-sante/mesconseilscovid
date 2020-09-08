import { ICS } from './ics'
import affichage from './affichage'
import pagination from './pagination'

function bindCalendar(element, profil) {
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
}

function bindFeedback(component) {
    function opacityTransition(component, delay, callback) {
        component.style.transition = `opacity ${delay / 1000}s`
        component.style.opacity = '0'
        window.setTimeout(() => {
            component.style.opacity = '1'
            callback(component)
        }, delay)
    }

    function askForMoreFeedback(feedback, component) {
        const transitionDelay = component.dataset.feedbackTransitionDelay

        opacityTransition(component, transitionDelay, (component) => {
            affichage.hideElement(component.querySelector('.feedback-question'))
            affichage.showElement(component.querySelector('.feedback-form'))
            component.parentElement.classList.add('js-feedback-submitted')
            const form = component.querySelector('.feedback-form form')
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const feedbackHost = document.body.dataset.statsUrl
                const payload = {
                    kind: feedback,
                    message: event.target.elements.message.value,
                    page: pagination.getCurrentPageName(),
                }
                const request = new XMLHttpRequest()
                request.open('POST', feedbackHost + '/feedback', true)
                request.setRequestHeader('Content-Type', 'application/json')
                request.send(JSON.stringify(payload))

                opacityTransition(component, transitionDelay, (component) => {
                    affichage.hideElement(component.querySelector('.feedback-form'))
                    affichage.showElement(component.querySelector('.feedback-thankyou'))
                })
            })
        })
    }
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(component.querySelectorAll('.button-feedback'), (button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault()
            const feedback = event.target.dataset.feedback
            window.plausible(`Avis ${feedback}`)
            askForMoreFeedback(feedback, component)
        })
    })
    document.addEventListener('pageChanged', () => {
        // Display again the question if the user change page.
        affichage.hideElement(component.querySelector('.feedback-form'))
        affichage.hideElement(component.querySelector('.feedback-thankyou'))
        affichage.showElement(component.querySelector('.feedback-question'))
    })
}

function bindImpression(element) {
    const printButton = element.querySelector('.js-impression')
    printButton.addEventListener('click', (event) => {
        event.preventDefault()
        try {
            window.print()
        } catch (e) {
            alert('Cette fonctionnalité n’est pas présente sur votre appareil')
        }
    })
}

function bindSuppressionTotale(element, app) {
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
}

export default {
    bindImpression,
    bindFeedback,
    bindCalendar,
    bindSuppressionTotale,
}
