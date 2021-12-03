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

export async function stimulusSetup(dom, identifier, controller) {
    require('jsdom-global')(dom)
    global.MutationObserver = window.MutationObserver
    window.Stimulus = Application.start()
    window.Stimulus.register(identifier, controller)
    // window.Stimulus.debug = true
    await stimulusReady()
}
