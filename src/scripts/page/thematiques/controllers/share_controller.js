import { Controller } from '@hotwired/stimulus'

import { hideElement } from '../../../affichage'

export default class extends Controller {
    static targets = ['link']

    connect() {
        if (typeof navigator.share === 'undefined') {
            hideElement(this.linkTarget)
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
