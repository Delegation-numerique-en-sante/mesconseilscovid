import { Controller } from '@hotwired/stimulus'

import { hideElement, showElement } from '../../../affichage'

export default class extends Controller {
    static values = {
        delay: Number,
    }

    #getScreen(screenName) {
        return this.element.querySelector(`[data-switch-screen="${screenName}"]`)
    }

    #fadeIn() {
        this.element.style.opacity = '0'
    }

    #fadeOut(source, destination) {
        this.element.style.opacity = '1'
        hideElement(this.#getScreen(source))
        showElement(this.#getScreen(destination))
    }

    switch(event) {
        event.preventDefault()
        this.element.style.transition = `opacity ${this.delayValue}ms`
        this.#fadeIn()
        const { source, destination} = event.params
        this.element.addEventListener(
            'transitionend',
            () => {
                this.#fadeOut(source, destination)
                this.dispatch('switched')
            },
            { once: true } // IE12+
        )
    }
}
