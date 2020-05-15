describe('Affichage', function () {
    it('On peut masquer des éléments visibles', function () {
        var element = document.createElement('div')
        element.innerHTML = '<div class="visible"></div>'

        affichage.hideSelector(element, '.visible')

        chai.expect(element.firstElementChild.className).to.equal('')
        chai.expect(element.firstElementChild.hasAttribute('hidden')).to.equal(true)
    })

    it('On peut afficher des éléments masqués', function () {
        var element = document.createElement('div')
        element.innerHTML = '<div id="foo" hidden></div>'

        affichage.displayBlocks(element, ['foo'])

        chai.expect(element.firstElementChild.className).to.equal('visible')
        chai.expect(element.firstElementChild.hasAttribute('hidden')).to.equal(false)
    })

    it('On peut injecter du contenu', function () {
        var element = document.createElement('div')
        element.innerHTML = '<div id="foo"></div>'

        affichage.injectContent(element, 'bar', '#foo')

        chai.expect(element.firstElementChild.innerText).to.equal('bar')
    })

    it('On peut injecter des attributs', function () {
        var element = document.createElement('div')
        element.innerHTML = '<a id="foo"></a>'

        affichage.injectAttribute(element, 'href', 'http://example.com', '#foo')

        chai.expect(element.firstElementChild.getAttribute('href')).to.equal(
            'http://example.com'
        )
    })
})
