import { assert } from 'chai'

import 'jsdom-global/register' // à importer avant le code applicatif

import { Router } from '../router'
import Profil from '../profil'
import { Questionnaire } from '../questionnaire'

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
        <p>Hello</p>
    </section>
</body>
`

describe('Routeur', function () {
    beforeEach(function () {
        this.router = new Router(new FakeApp())
        this.router.addAppRoute('introduction', () => {})
    })

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
        assert.strictEqual(window.location.toString(), 'https://test/')
        this.router.resolve()
        assert.strictEqual(window.location.toString(), 'https://test/#introduction')
    })

    it('Une page inconnue redirige vers la page introduction', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/#inconnue',
        })
        assert.strictEqual(window.location.toString(), 'https://test/#inconnue')
        this.router.resolve()
        assert.strictEqual(window.location.toString(), 'https://test/#introduction')
    })

    it('La redirection conserve la source', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/?source=foo',
        })
        assert.strictEqual(window.location.toString(), 'https://test/?source=foo')
        this.router.resolve()
        assert.strictEqual(
            window.location.toString(),
            'https://test/?source=foo#introduction'
        )
    })

    it('Le contenu de la page cible est chargé', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/#introduction',
        })
        assert.strictEqual(document.querySelector('#page').innerHTML.trim(), '')
        this.router.resolve()
        assert.strictEqual(
            document.querySelector('#page').innerHTML.trim(),
            '<p>Hello</p>'
        )
    })

    after(function () {
        const cleanup = require('jsdom-global')()
        cleanup()
    })
})
