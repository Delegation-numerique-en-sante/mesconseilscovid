import { Controller } from '@hotwired/stimulus'

import { hideElement } from '../../../affichage'

export default class extends Controller {
    connect() {
        if (typeof navigator.share === 'undefined') {
            hideElement(this.element)
        }
    }

    open(event) {
        event.preventDefault()
        navigator.share({
            title: document.title,
            text: 'Retrouvez cette information sur MesConseilsCovid',
            url: window.location,
        })
    }
}
