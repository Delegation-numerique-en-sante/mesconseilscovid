import { assert } from 'chai'

import Updater from '../../updater'

describe('Updater', function () {
    it('La page d’introduction n’est pas interactive', function () {
        const updater = new Updater(undefined)
        assert.isFalse(updater.onInteractivePage('introduction'))
    })

    it('La page de dépistage est interactive', function () {
        const updater = new Updater(undefined)
        assert.isTrue(updater.onInteractivePage('depistage'))
    })

    it('La page de suivi des symptômes est interactive', function () {
        const updater = new Updater(undefined)
        assert.isTrue(updater.onInteractivePage('suivisymptomes'))
    })
})
