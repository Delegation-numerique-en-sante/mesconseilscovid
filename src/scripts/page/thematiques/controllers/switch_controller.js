import { Controller } from '@hotwired/stimulus'

import { hideElement, showElement } from '../../../affichage'

export default class extends Controller {
    static values = {
        delay: Number,
    }

    #getScreen(screenName) {
        return this.element.querySelector(`[data-switch-screen="${screenName}"]`)
    }

    #fadeOut() {
        this.element.style.opacity = '0'
    }

    #fadeIn(sources, destinations) {
        this.element.style.opacity = '1'
        for (let source of sources.split(/\s+/)) {
            hideElement(this.#getScreen(source))
        }
        for (let destination of destinations.split(/\s+/)) {
            showElement(this.#getScreen(destination))
        }
    }

    switch(event) {
        event.preventDefault()
        this.element.style.transition = `opacity ${this.delayValue}ms`
        this.#fadeOut()
        const { sources, destinations } = event.params
        this.element.addEventListener(
            'transitionend',
            () => {
                this.#fadeIn(sources, destinations)
                this.dispatch('switched')
            },
            { once: true } // IE12+
        )
    }
}
