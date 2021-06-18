import { assert } from 'chai'

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
        <div>Accueil</div>
    </section>
    <section id="conseils" hidden>
        <div></div>
    </section>
    <section id="hello" hidden>
        <p>Hello, <span class="name"></span></p>
        <p>Deuxième élément</p>
    </section>
    <section id="suivi" hidden>
        <p>Suivi</p>
    </section>
    <section id="suiviintroduction" hidden>
        <p>Suivi introduction</p>
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

    describe('Matching', function () {
        it('On ne matche pas une route préfixe déclarée plus tôt', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/suiviintroduction',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            this.router.addAppRoute('suivi', () => {})
            this.router.addAppRoute('suiviintroduction', () => {})
            assert.strictEqual(document.querySelector('#page').innerHTML.trim(), '')

            this.router.resolve()

            assert.strictEqual(
                document.querySelector('#page').innerHTML.trim(),
                '<p>Suivi introduction</p>'
            )
        })
    })

    describe('Redirections', function () {
        it('La racine ne redirige pas vers une autre page', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(window.location.toString(), 'https://test/')

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/')
        })

        it('La page d’intro redirige vers la racine', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/introduction',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(window.location.toString(), 'https://test/introduction')

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/')
        })

        it('Une page inconnue redirige vers la racine', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/inconnue',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(window.location.toString(), 'https://test/inconnue')

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/')
        })

        it('La redirection conserve la source', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/inconnue?source=foo',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(
                window.location.toString(),
                'https://test/inconnue?source=foo'
            )

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/?source=foo')
        })
    })

    describe('Redirections des anciennes adresses avec un dièse', function () {
        it('On redirige les anciennes adresses', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/#conseils',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            this.router.addAppRoute('conseils', () => {})
            assert.strictEqual(window.location.toString(), 'https://test/#conseils')

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/conseils')
        })

        it('On redirige l’ancienne page d’accueil', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/#introduction',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(window.location.toString(), 'https://test/#introduction')

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/')
        })

        it('On redirige les anciennes adresses avec la source', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/?source=foo#conseils',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            this.router.addAppRoute('conseils', () => {})
            assert.strictEqual(
                window.location.toString(),
                'https://test/?source=foo#conseils'
            )

            this.router.resolve()

            assert.strictEqual(
                window.location.toString(),
                'https://test/conseils?source=foo'
            )
        })

        it('On redirige l’ancienne page d’accueil avec la source', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/?source=foo#introduction',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(
                window.location.toString(),
                'https://test/?source=foo#introduction'
            )

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/?source=foo')
        })

        it('On conserve le fragment si ce n’est pas une adresse existante', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/#ancre',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(window.location.toString(), 'https://test/#ancre')

            this.router.resolve()

            assert.strictEqual(window.location.toString(), 'https://test/#ancre')
        })

        it('On ne redirige pas si ce n’est pas à la racine', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/suivi#conseils',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            this.router.addAppRoute('suivi', () => {})
            this.router.addAppRoute('conseils', () => {})
            assert.strictEqual(
                window.location.toString(),
                'https://test/suivi#conseils'
            )

            this.router.resolve()

            assert.strictEqual(
                window.location.toString(),
                'https://test/suivi#conseils'
            )
        })
    })

    describe('Chargement', function () {
        it('Le contenu de la page cible est chargé', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'https://test/hello',
            })
            this.router = new Router(new FakeApp(), window)
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
        it('Le contenu de la page d’accueil est chargé', function () {
            require('jsdom-global')(fakeHTML, {
                url: 'http://test/',
            })
            this.router = new Router(new FakeApp(), window)
            this.router.addAppRoute('introduction', () => {}, {
                route: '',
            })
            assert.strictEqual(document.querySelector('#page').innerHTML.trim(), '')

            this.router.resolve()

            assert.strictEqual(
                document.querySelector('#page').innerHTML.trim(),
                '<div>Accueil</div>'
            )
        })
    })

    after(function () {
        const cleanup = require('jsdom-global')()
        cleanup()
    })
})
