import { assert } from 'chai'

import { Router } from '../../router'
import Profil from '../../profil'
import { Questionnaire } from '../../questionnaire'

class FakeApp {
    // Juste ce qu’il faut pour ces tests
    constructor() {
        this.profil = new Profil('mes_infos')
        this.stockage = new FakeStockage()
        this.questionnaire = new Questionnaire()
    }
    trackPageView() {}
}

class FakeStockage {
    async getProfils() {
        return []
    }
}

const fakeHTML = `<!DOCTYPE html>
<body>
    <header role="banner" tabindex="-1">
      <section>
        <div id="js-profil-full-header" class="js-profil-full" hidden>
          <b class="profil" id="nom-profil-header"></b>
        </div>
        <div id="js-profil-empty-header" class="js-profil-empty"></div>
      </section>
    </header>
    <main>
      <section id="page">
      </section>
    </main>
    <section id="introduction" hidden>
        <div></div>
    </section>
    <section id="hello" hidden>
        <p>Hello, <span class="name"></span></p>
        <p>Deuxième élément</p>
    </section>
</body>
`

describe('Routeur', function () {
    afterEach(function () {
        if (this.router) {
            this.router.navigo.destroy() // sinon les tests restent en suspens
        }
        this.router = null
    })

    it('La racine redirige vers la page introduction', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/',
        })
        this.router = new Router(new FakeApp())
        this.router.addAppRoute('introduction', () => {})
        assert.strictEqual(window.location.href, 'https://test/')

        this.router.resolve()

        assert.strictEqual(window.location.href, 'https://test/#introduction')
    })

    it('Une page inconnue redirige vers la page introduction', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/#inconnue',
        })
        this.router = new Router(new FakeApp())
        this.router.addAppRoute('introduction', () => {})
        assert.strictEqual(window.location.href, 'https://test/#inconnue')

        this.router.resolve()

        assert.strictEqual(window.location.href, 'https://test/#introduction')
    })

    it('La redirection conserve la source', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/?source=foo',
        })
        this.router = new Router(new FakeApp())
        this.router.addAppRoute('introduction', () => {})
        assert.strictEqual(window.location.href, 'https://test/?source=foo')

        this.router.resolve()

        assert.strictEqual(
            window.location.href,
            'https://test/?source=foo#introduction'
        )
    })

    it('Le contenu de la page cible est chargé', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/#hello',
        })
        this.router = new Router(new FakeApp())
        this.router.addAppRoute('hello', (element) => {
            element.querySelector('.name').innerHTML = 'world'
        })
        assert.strictEqual(document.querySelector('#page').innerHTML.trim(), '')

        this.router.resolve()

        assert.strictEqual(
            document.querySelector('#page').innerHTML.trim(),
            '<p>Hello, <span class="name">world</span></p><p>Deuxième élément</p>'
        )
    })

    after(function () {
        const cleanup = require('jsdom-global')()
        cleanup()
    })
})
