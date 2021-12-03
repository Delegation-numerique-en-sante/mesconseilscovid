import { assert } from 'chai'
import { stimulusSetup } from './stimulus_helpers'

import FeedbackController from '../page/thematiques/controllers/feedback_controller'

describe('Feedback', function () {
    it('Avis positif', async function () {
        await stimulusSetup(
            `
            <a data-controller="feedback"
               data-action="feedback#setPositiveFeedback">
            </a>
            `,
            'feedback',
            FeedbackController
        )

        const link = document.querySelector('a')

        assert.strictEqual(link.dataset.feedbackKindValue, undefined)
        link.click()
        assert.strictEqual(link.dataset.feedbackKindValue, 'positif')
    }),
        it('Avis négatif', async function () {
            await stimulusSetup(
                `
                <a data-controller="feedback"
                   data-action="feedback#setNegativeFeedback">
                </a>
                `,
                'feedback',
                FeedbackController
            )

            const link = document.querySelector('a')

            assert.strictEqual(link.dataset.feedbackKindValue, undefined)
            link.click()
            assert.strictEqual(link.dataset.feedbackKindValue, 'negatif')
        })
})
