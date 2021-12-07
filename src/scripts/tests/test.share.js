import { assert } from 'chai'
import { setupGlobalDom, setupStimulus } from './stimulus_helpers'

import ShareController from '../page/thematiques/controllers/share_controller'

describe('Share', function () {
    it('Montre le lien si supporté', async function () {
        setupGlobalDom(`
            <div hidden data-controller="share"></div>
            `)
        navigator.share = () => {}
        await setupStimulus('share', ShareController)

        const component = document.querySelector('div')

        assert.isFalse(component.hasAttribute('hidden'))
    })
    it('Ne montre pas le lien si non supporté', async function () {
        setupGlobalDom(`
            <div hidden data-controller="share">
            </div>`)
        await setupStimulus('share', ShareController)

        const component = document.querySelector('div')

        assert.isTrue(component.hasAttribute('hidden'))
    })
})
