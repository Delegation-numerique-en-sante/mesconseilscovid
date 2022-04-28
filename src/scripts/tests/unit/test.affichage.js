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

    it('On peut échapper du HTML depuis un tag pour template literal', function () {
        var bar = 'baz'
        assert.strictEqual(affichage.safeHtml`foo ${bar}`, 'foo baz')
        var evil = '<script>alert("something evil")</script>'
        assert.strictEqual(
            affichage.safeHtml`foo ${evil}`,
            'foo &lt;script&gt;alert(&quot;something evil&quot;)&lt;/script&gt;'
        )
    })
})
