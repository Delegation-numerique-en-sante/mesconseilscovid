import type App from './app'
import { cloneElementInto, hideElement, showElement } from './affichage'
import { getCurrentPageName } from './router'
import { estPageThematique } from './page/thematiques/navigation'

export function injectFeedbackDifficultes(targetElement: HTMLElement) {
    const feedbackDifficultesElement = document.querySelector<HTMLElement>(
        '#feedback-difficultes'
    )!
    cloneElementInto(feedbackDifficultesElement, targetElement)
}
export function opacityTransition(
    component: HTMLElement,
    delay: number,
    callback: Function
) {
    component.style.transition = `opacity ${delay / 1000}s`
    component.style.opacity = '0'
    window.setTimeout(() => {
        component.style.opacity = '1'
        callback(component)
    }, delay)
}

export function bindFeedback(component: HTMLElement, app: App) {
    function askForMoreFeedback(feedback: string, component: HTMLElement) {
        const transitionDelay = component.dataset.feedbackTransitionDelay
        if (!transitionDelay) return

        const transitionDelayNumber = Number(transitionDelay)

        opacityTransition(
            component,
            transitionDelayNumber,
            (component: HTMLElement) => {
                hideElement(component.querySelector('.feedback-question'))
                showElement(component.querySelector('.feedback-form'))
                component.querySelector<HTMLElement>('.feedback-form textarea')?.focus()
                const form = component.querySelector('.feedback-form form')
                if (!form) return
                form.addEventListener('submit', (event) => {
                    const target = <HTMLFormElement>event.target
                    event.preventDefault()
                    envoieLesRemarques({
                        feedbackHost: document.body.dataset.statsUrl,
                        kind: feedback,
                        message: (
                            target.elements.namedItem('message') as HTMLInputElement
                        ).value,
                        page: estPageThematique()
                            ? document.location.pathname.slice(1)
                            : getCurrentPageName(),
                        source: app.source,
                    })

                    opacityTransition(
                        component,
                        transitionDelayNumber,
                        (component: HTMLElement) => {
                            hideElement(component.querySelector('.feedback-form'))
                            showElement(component.querySelector('.feedback-thankyou'))
                            showElement(component.querySelector('.feedback-partager'))
                        }
                    )
                })
            }
        )
    }
    Array.from(component.querySelectorAll('.button-feedback')).forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault()
            const target = <HTMLAnchorElement>event.target
            const feedback = target.dataset.feedback!
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
            if (!transitionDelay) return

            const transitionDelayNumber = Number(transitionDelay)
            opacityTransition(
                component,
                transitionDelayNumber,
                (component: HTMLElement) => {
                    hideElement(component.querySelector('.feedback-question'))
                    showElement(component.querySelector('.feedback-partager'))
                    if (typeof navigator.share === 'undefined') {
                        const buttonFeedbackPartager = component.querySelector(
                            '.feedback-partager .button-feedback-partager'
                        )!
                        hideElement(buttonFeedbackPartager.parentElement)
                    }
                    const partagerLinks = Array.from(
                        component.querySelectorAll<HTMLElement>('.feedback-partager a')
                    )!
                    partagerLinks.forEach((partagerLink) => {
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
                                    url: String(window.location),
                                })
                            }
                        })
                    })
                }
            )
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
}: {
    feedbackHost: string | undefined
    kind: string
    message: string
    page: string
    source: string
    question?: string
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
