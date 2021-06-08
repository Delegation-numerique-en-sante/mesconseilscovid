import { assert } from 'chai'

import 'jsdom-global/register' // à importer avant le code applicatif

import { initRouter } from '../router'
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
        <div id="introduction-block" class="block introduction-block">
            <div id="profils-cards-full" hidden>
                <ul class="cards"></ul>
            </div>
        </div>
    </section>
</body>
`

describe('Routeur', function () {
    beforeEach(function () {
        this.router = initRouter(new FakeApp())
    })

    afterEach(function () {
        if (this.router) {
            this.router.destroy()
        }
        this.router = null
    })

    it('Redirige vers la page introduction', function () {
        require('jsdom-global')(fakeHTML, {
            url: 'https://test/',
        })
        assert.strictEqual(window.location.toString(), 'https://test/')
        this.router.resolve()
        assert.strictEqual(window.location.toString(), 'https://test/#introduction')
    })

    it('Conserve la source', function () {
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

    after(function () {
        const cleanup = require('jsdom-global')()
        cleanup()
    })
})
