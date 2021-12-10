import { Controller } from '@hotwired/stimulus'

import { getCurrentPageName } from './../../../router'
import { estPageThematique } from './../navigation'
import { hideElement, showElement } from '../../../affichage'

export default class extends Controller {
    static values = {
        endpoint: String,
        kind: String,
    }
    static targets = ['textarea', 'positif', 'negatif', 'reponse']

    focusIfVisible() {
        const textarea = this.textareaTarget
        if (!textarea.closest('[hidden]')) {
            textarea.focus()
        }
    }

    setPositiveFeedback() {
        this.kindValue = 'positif'
    }

    setNegativeFeedback() {
        this.kindValue = 'negatif'
    }

    spreadReponse(event) {
        const reponse = event.target.value
        for (const reponseTarget of this.reponseTargets) {
            reponseTarget.textContent = reponse
        }
    }

    kindValueChanged(kindValue) {
        for (const targetToHide of this.allKindTargets) {
            hideElement(targetToHide)
        }

        if (!kindValue) return

        const targetsToShow = this[`${kindValue}Targets`]

        for (const targetToShow of targetsToShow) {
            showElement(targetToShow)
        }
    }

    get allKindTargets() {
        return [...this.positifTargets, ...this.negatifTargets]
    }

    send(event) {
        event.preventDefault()
        const data = new FormData(this.element)
        envoieLesRemarques({
            ...Object.fromEntries(data), // TODO: polyfill
            endpoint: this.endpointValue,
            question: undefined, // TODO
        })
        this.dispatch('sent')
    }
}

function envoieLesRemarques({ endpoint, kind, message, question }) {
    const request = new XMLHttpRequest()
    request.open('POST', endpoint, true)
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(
        JSON.stringify({
            kind,
            message,
            question,
            page: estPageThematique()
                ? document.location.pathname.slice(1)
                : getCurrentPageName(),
            source: window.app.source,
        })
    )
}
