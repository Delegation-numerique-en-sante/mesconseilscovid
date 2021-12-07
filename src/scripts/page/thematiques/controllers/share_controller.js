import { Controller } from '@hotwired/stimulus'

import { showElement } from '../../../affichage'

export default class extends Controller {
    connect() {
        if (typeof navigator.share !== 'undefined') {
            showElement(this.element)
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
