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

    setNegativeFeedback() {
        this.kindValue = 'negatif'
    }

    send(event) {
        event.preventDefault()
        const endpoint = this.endpointValue
        let message = this.textareaTarget.value
        if (window.app.source == 'TousAntiCovid') {
            message += ' #TAC'
        }
        const page = estPageThematique()
            ? document.location.pathname.slice(1)
            : getCurrentPageName()
        const payload = {
            kind: this.kindValue,
            message: message,
            page: page,
        }
        const request = new XMLHttpRequest()
        request.open('POST', endpoint, true)
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify(payload))
        this.dispatch('sent')
    }
}
