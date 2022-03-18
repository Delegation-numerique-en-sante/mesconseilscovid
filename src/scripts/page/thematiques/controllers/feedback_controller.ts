import { getCurrentPageName } from './../../../router'
import { estPageThematique } from './../navigation'
import { hideElement, showElement } from '../../../affichage'

import Controller from './mcc_stimulus'

type Kind = 'positif' | 'negatif' | ''

export default class extends Controller<HTMLFormElement> {
    static values = {
        endpoint: String,
        kind: String,
        question: String,
    }
    kindValue!: Kind
    endpointValue!: string
    questionValue!: string

    static targets = ['textarea', 'positif', 'negatif', 'reponse']
    readonly textareaTarget!: HTMLTextAreaElement
    readonly reponseTargets!: Element[]
    readonly positifTargets!: Element[]
    readonly negatifTargets!: Element[]

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

    spreadReponse(event: Event & { target: HTMLInputElement }) {
        const reponse = event.target.value
        for (const reponseTarget of this.reponseTargets) {
            reponseTarget.textContent = reponse
        }
    }

    kindValueChanged(kindValue: Kind) {
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

    send(event: Event) {
        event.preventDefault()
        const data = new FormData(this.element)
        const kind = data.get('kind') as Kind
        const message = data.get('message') as string
        envoieLesRemarques({
            kind,
            message,
            endpoint: this.endpointValue,
            question: this.questionValue,
        })
        this.dispatch('sent')
    }
}

function envoieLesRemarques({
    endpoint,
    kind,
    message,
    question,
}: {
    endpoint: string
    kind: Kind
    message: string
    question: string
}) {
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
