import ICS from './ics.js'
import { hideElement, showElement } from './affichage.js'
import { getCurrentPageName } from './pagination.js'

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

    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(element.querySelectorAll('.js-calendar'), (calendarButton) => {
        const href =
            'data:text/x-vCalendar;charset=utf-8,' + encodeURIComponent(calendar)
        calendarButton.setAttribute('href', href)
    })
}

export function bindFeedback(component, app) {
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
            hideElement(component.querySelector('.feedback-question'))
            showElement(component.querySelector('.feedback-form'))
            component.parentElement.classList.add('js-feedback-submitted')
            const form = component.querySelector('.feedback-form form')
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const feedbackHost = document.body.dataset.statsUrl
                let message = event.target.elements.message.value
                if (app.source == 'TousAntiCovid') {
                    message += ' #TAC'
                }
                const payload = {
                    kind: feedback,
                    message: message,
                    page: getCurrentPageName(),
                }
                const request = new XMLHttpRequest()
                request.open('POST', feedbackHost + '/feedback', true)
                request.setRequestHeader('Content-Type', 'application/json')
                request.send(JSON.stringify(payload))

                opacityTransition(component, transitionDelay, (component) => {
                    hideElement(component.querySelector('.feedback-form'))
                    showElement(component.querySelector('.feedback-thankyou'))
                })
            })
        })
    }
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(component.querySelectorAll('.button-feedback'), (button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault()
            const feedback = event.target.dataset.feedback
            app.plausible(`Avis ${feedback}`)
            askForMoreFeedback(feedback, component)
        })
    })
    document.addEventListener('pageChanged', () => {
        // Display the question again if the user navigates to another page.
        hideElement(component.querySelector('.feedback-form'))
        hideElement(component.querySelector('.feedback-thankyou'))
        showElement(component.querySelector('.feedback-question'))
    })
}

export function bindImpression(element, app) {
    const printButton = element.querySelector('.js-impression')
    printButton.addEventListener('click', (event) => {
        event.preventDefault()
        app.plausible('Impression')
        try {
            element.querySelectorAll('details').forEach((detail) => {
                detail.setAttribute('open', '')
            })
            window.print()
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
                if (app.router.lastRouteResolved().url === 'introduction') {
                    window.location.reload(true)
                } else {
                    app.router.navigate('introduction')
                }
            })
        }
    })
}
