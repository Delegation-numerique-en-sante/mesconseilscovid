import { cloneElementInto, hideElement, showElement } from './affichage'
import { getCurrentPageName } from './router'
import { estPageThematique } from './page/thematiques/main'

export function injectFeedbackDifficultes(targetElement) {
    cloneElementInto(document.querySelector('#feedback-difficultes'), targetElement)
}
export function opacityTransition(component, delay, callback) {
    component.style.transition = `opacity ${delay / 1000}s`
    component.style.opacity = '0'
    window.setTimeout(() => {
        component.style.opacity = '1'
        callback(component)
    }, delay)
}

export function bindFeedback(component, app) {
    function askForMoreFeedback(feedback, component) {
        const transitionDelay = component.dataset.feedbackTransitionDelay

        opacityTransition(component, transitionDelay, (component) => {
            hideElement(component.querySelector('.feedback-question'))
            showElement(component.querySelector('.feedback-form'))
            component.querySelector('.feedback-form textarea').focus()
            component.parentElement.classList.add('js-feedback-submitted')
            const form = component.querySelector('.feedback-form form')
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const feedbackHost = document.body.dataset.statsUrl
                let message = event.target.elements.message.value
                if (app.source == 'TousAntiCovid') {
                    message += ' #TAC'
                }
                const page = estPageThematique()
                    ? document.location.pathname.slice(1)
                    : getCurrentPageName()
                const payload = {
                    kind: feedback,
                    message: message,
                    page: page,
                }
                const request = new XMLHttpRequest()
                request.open('POST', feedbackHost + '/feedback', true)
                request.setRequestHeader('Content-Type', 'application/json')
                request.send(JSON.stringify(payload))

                opacityTransition(component, transitionDelay, (component) => {
                    hideElement(component.querySelector('.feedback-form'))
                    showElement(component.querySelector('.feedback-thankyou'))
                    showElement(component.querySelector('.feedback-partager'))
                })
            })
        })
    }
    Array.from(component.querySelectorAll('.button-feedback')).forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault()
            const feedback = event.target.dataset.feedback
            app.plausible(`Avis ${feedback}`)
            askForMoreFeedback(feedback, component)
        })
    })
    const partagerButton = component.querySelector('.button-partager')
    if (partagerButton) {
        partagerButton.addEventListener('click', (event) => {
            event.preventDefault()
            app.plausible('Menu Partager')
            const transitionDelay = component.dataset.feedbackTransitionDelay
            opacityTransition(component, transitionDelay, (component) => {
                hideElement(component.querySelector('.feedback-question'))
                showElement(component.querySelector('.feedback-partager'))
                const partagerLinks = component.querySelectorAll('.feedback-partager a')
                Array.from(partagerLinks).forEach((partagerLink) => {
                    partagerLink.addEventListener('click', () => {
                        app.plausible('Partage avec…', {
                            service: partagerLink.dataset.service,
                        })
                    })
                })
            })
        })
    }
    document.addEventListener('pageChanged', () => {
        // Display the question again if the user navigates to another page.
        hideElement(component.querySelector('.feedback-form'))
        hideElement(component.querySelector('.feedback-thankyou'))
        hideElement(component.querySelector('.feedback-partager'))
        showElement(component.querySelector('.feedback-question'))
    })
}
