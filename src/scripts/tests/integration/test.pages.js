import { assert } from 'chai'
import { recordConsoleMessages, waitForPlausibleTrackingEvent } from './helpers'

describe('Pages', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        assert.equal(
            await page.title(),
            'Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
        )
    })

    it('on va vers une page thématique', async function () {
        const page = this.test.page

        let messages = recordConsoleMessages(page)
        await page.goto('http://localhost:8080/')
        await waitForPlausibleTrackingEvent(page, 'pageview:introduction')

        await page.click(
            '.thematiques a >> text="Passe vaccinal et passe sanitaire, que faut-il savoir\u00a0?"'
        )
        await waitForPlausibleTrackingEvent(
            page,
            'pageview:pass-sanitaire-qr-code-voyages.html'
        )

        assert.lengthOf(messages, 4)
        assert.include(messages[0], {
            n: 'pageview',
            u: 'http://localhost/',
        })
        assert.include(messages[1], {
            n: 'pageview',
            u: 'http://localhost/introduction',
        })
        assert.include(messages[2], {
            n: 'Navigue vers une thématique depuis l’accueil',
            p: '{"chemin":"/introduction → /pass-sanitaire-qr-code-voyages.html"}',
            u: 'http://localhost/introduction',
        })
        assert.include(messages[3], {
            n: 'pageview',
            u: 'http://localhost/pass-sanitaire-qr-code-voyages.html',
        })
    })

    it('redirige l’ancienne page de pédiatrie vers sa page thématique', async function () {
        const page = this.test.page

        await Promise.all([
            page.goto('http://localhost:8080/#pediatrie'),
            page.waitForNavigation({
                url: 'http://localhost:8080/conseils-pour-les-enfants.html',
            }),
        ])

        assert.equal(
            await page.title(),
            'Conseils pour mon\u00a0enfant — Mes Conseils Covid'
        )
    })

    it('on peut accéder aux CGU depuis l’accueil', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])
        await page.waitForSelector('#page.ready')

        // On va vers la page de CGU.
        {
            let bouton = await page.waitForSelector('text="Conditions d’utilisation"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conditionsutilisation' }),
            ])
        }

        // Conditions d’utilisation.
        {
            // On retrouve le bouton pour repartir vers le questionnaire.
            let button = await page.waitForSelector('#page.ready .js-profil-empty a')
            assert.equal((await button.innerText()).trim(), 'Démarrer le questionnaire')
            assert.equal(await button.getAttribute('href'), '#symptomes')
            // On retrouve le titre explicite.
            let titre = await page.waitForSelector('#page.ready h1')
            assert.equal(await titre.innerText(), 'Conditions d’utilisation')
        }
    })
})
