import { Controller } from '@hotwired/stimulus'

import { getCurrentPageName } from './../../../router'
import { estPageThematique } from './../navigation'

export default class extends Controller {
    static values = {
        endpoint: String,
        kind: String,
    }
    static targets = ['textarea']

    focusIfVisible() {
        const textarea = this.textareaTarget
        if (!textarea.closest('[hidden]')) {
            textarea.focus()
        }
    }

    setPositiveFeedback() {
        this.kindValue = 'positif'
    }

    setAverageFeedback() {
        // TODO: les choix envoyés pour le feedback inline étaient oui/non/bof.
        this.kindValue = 'average'
    }

    setNegativeFeedback() {
        this.kindValue = 'negatif'
    }

    send(event) {
        event.preventDefault()
        envoieLesRemarques({
            endpoint: this.endpointValue,
            kind: this.kindValue,
            message: this.textareaTarget.value,
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
