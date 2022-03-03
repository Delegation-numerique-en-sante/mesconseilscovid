import { assert } from 'chai'
import { JSDOM } from 'jsdom'

import * as affichage from '../../affichage'

describe('Affichage', function () {
    it('On peut masquer des éléments visibles', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<div class="visible"></div>'

        affichage.hideSelector(element, '.visible')

        assert.strictEqual(element.firstElementChild.className, '')
        assert.isTrue(element.firstElementChild.hasAttribute('hidden'))
    })

    it('On peut afficher des éléments masqués', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<div id="foo" hidden></div>'

        affichage.displayBlocks(element, ['foo'])

        assert.strictEqual(element.firstElementChild.className, 'visible')
        assert.isFalse(element.firstElementChild.hasAttribute('hidden'))
    })
})
