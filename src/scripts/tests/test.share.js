import { assert } from 'chai'
import { stimulusSetup } from './stimulus_helpers'

import ShareController from '../page/thematiques/controllers/share_controller'

describe('Share', function () {
    it('Cache le lien si non supporté', async function () {
        await stimulusSetup(
            `
            <div data-controller="share">
                <a data-share-target="link"
                   data-action="share#open">
                </a>
            </div>
            `,
            'share',
            ShareController
        )

        const link = document.querySelector('a')

        assert.strictEqual(link.hasAttribute('hidden'), true)
    })
})
