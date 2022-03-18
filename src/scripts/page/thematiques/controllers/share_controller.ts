import { Controller } from '@hotwired/stimulus'

import { showElement } from '../../../affichage'

export default class extends Controller {
    static get shouldLoad() {
        return !!navigator.share
    }

    connect() {
        showElement(this.element)
    }

    open(event: Event) {
        event.preventDefault()
        navigator.share({
            title: document.title,
            text: 'Retrouvez cette information sur MesConseilsCovid',
            url: window.location.href,
        })
    }
}
