import { assert } from 'chai'
import { setupGlobalDom, setupStimulus } from './stimulus_helpers'

import FeedbackController from '../page/thematiques/controllers/feedback_controller'

describe('Feedback', function () {
    it('Avis positif', async function () {
        setupGlobalDom(`
            <a data-controller="feedback"
               data-action="feedback#setPositiveFeedback">
            </a>`)
        await setupStimulus('feedback', FeedbackController)

        const link = document.querySelector('a')

        assert.strictEqual(link.dataset.feedbackKindValue, undefined)
        link.click()
        assert.strictEqual(link.dataset.feedbackKindValue, 'positif')
    })
    it('Avis négatif', async function () {
        setupGlobalDom(`
            <a data-controller="feedback"
               data-action="feedback#setNegativeFeedback">
            </a>`)
        await setupStimulus('feedback', FeedbackController)

        const link = document.querySelector('a')

        assert.strictEqual(link.dataset.feedbackKindValue, undefined)
        link.click()
        assert.strictEqual(link.dataset.feedbackKindValue, 'negatif')
    })
})
