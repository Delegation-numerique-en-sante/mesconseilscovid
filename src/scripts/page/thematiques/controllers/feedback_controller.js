import { Controller } from '@hotwired/stimulus'

import { getCurrentPageName } from './../../../router'
import { estPageThematique } from './../navigation'
import { envoieLesRemarques } from './../../../feedback'

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
        envoieLesRemarques({
            feedbackHost: this.endpointValue,
            kind: this.kindValue,
            message: this.textareaTarget.value,
            page: estPageThematique()
                ? document.location.pathname.slice(1)
                : getCurrentPageName(),
            source: window.app.source,
        })
        this.dispatch('sent')
    }
}
