import { assert } from 'chai'
import { stimulusSetup } from './stimulus_helpers'

import ShareController from '../page/thematiques/controllers/share_controller'

describe('Share', function () {
    it('Cache le lien si non supporté', async function () {
        await stimulusSetup(
            `
            <div data-controller="share">
            </div>
            `,
            'share',
            ShareController
        )

        const component = document.querySelector('div')

        assert.strictEqual(component.hasAttribute('hidden'), true)
    })
})
