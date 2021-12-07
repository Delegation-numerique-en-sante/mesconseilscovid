import { cloneElementInto } from './affichage'

export function injectFeedbackDifficultes(targetElement) {
    cloneElementInto(document.querySelector('#feedback-difficultes'), targetElement)
}
