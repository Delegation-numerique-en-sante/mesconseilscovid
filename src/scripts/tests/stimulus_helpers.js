import { Application } from '@hotwired/stimulus'

async function stimulusReady() {
    return new Promise((resolve) => {
        if (document.readyState == 'loading') {
            document.addEventListener('DOMContentLoaded', () => resolve())
        } else {
            resolve()
        }
    })
}

export function setupGlobalDom(dom) {
    require('jsdom-global')(dom)
    global.MutationObserver = window.MutationObserver
}

export async function setupStimulus(identifier, controller) {
    window.Stimulus = Application.start()
    window.Stimulus.register(identifier, controller)
    // window.Stimulus.debug = true
    await stimulusReady()
}
