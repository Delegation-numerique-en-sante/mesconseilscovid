var chai = require('chai')

var jsdom = require('jsdom')
var { JSDOM } = jsdom

var affichage = require('../affichage.js')

describe('affichage', function () {
    it('On peut masquer des éléments visibles', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<div class="visible"></div>'

        affichage.hideSelector(element, '.visible')

        chai.expect(element.firstElementChild.className).to.equal('')
        chai.expect(element.firstElementChild.hasAttribute('hidden')).to.equal(true)
    })

    it('On peut afficher des éléments masqués', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<div id="foo" hidden></div>'

        affichage.displayBlocks(element, ['foo'])

        chai.expect(element.firstElementChild.className).to.equal('visible')
        chai.expect(element.firstElementChild.hasAttribute('hidden')).to.equal(false)
    })

    it('On peut injecter du contenu', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<div id="foo"></div>'

        affichage.injectContent(element.querySelector('#foo'), 'bar')

        chai.expect(element.firstElementChild.textContent).to.equal('bar')
    })

    it('On peut injecter des attributs', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<a id="foo"></a>'

        affichage.injectAttribute(
            element.querySelector('#foo'),
            'href',
            'http://example.com'
        )

        chai.expect(element.firstElementChild.getAttribute('href')).to.equal(
            'http://example.com'
        )
    })
})
