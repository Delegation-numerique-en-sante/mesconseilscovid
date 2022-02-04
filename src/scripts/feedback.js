import { cloneElementInto, hideElement, showElement } from './affichage'
import { getCurrentPageName } from './router'
import { estPageThematique } from './page/thematiques/navigation'

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
            const form = component.querySelector('.feedback-form form')
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                envoieLesRemarques({
                    // https://github.com/amilajack/eslint-plugin-compat/discussions/514
                    // eslint-disable-next-line compat/compat
                    feedbackHost: document.body.dataset.statsUrl,
                    kind: feedback,
                    message: event.target.elements.message.value,
                    page: estPageThematique()
                        ? document.location.pathname.slice(1)
                        : getCurrentPageName(),
                    source: app.source,
                })

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
                if (typeof navigator.share === 'undefined') {
                    hideElement(
                        component.querySelector(
                            '.feedback-partager .button-feedback-partager'
                        ).parentElement
                    )
                }
                const partagerLinks = component.querySelectorAll('.feedback-partager a')
                Array.from(partagerLinks).forEach((partagerLink) => {
                    partagerLink.addEventListener('click', () => {
                        const service = partagerLink.dataset.service
                        app.plausible('Partage avec…', {
                            service: service,
                        })
                        if (service === 'autres') {
                            event.preventDefault()
                            navigator.share({
                                title: document.title,
                                text: 'Retrouvez cette information sur MesConseilsCovid',
                                url: window.location,
                            })
                        }
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

export function envoieLesRemarques({
    feedbackHost,
    kind,
    message,
    page,
    question,
    source,
}) {
    const request = new XMLHttpRequest()
    request.open('POST', feedbackHost + '/feedback', true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(
        JSON.stringify({
            kind,
            message,
            page,
            question,
            source,
        })
    )
}
