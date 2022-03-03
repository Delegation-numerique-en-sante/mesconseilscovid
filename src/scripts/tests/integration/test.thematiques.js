import { assert } from 'chai'
import { recordConsoleMessages, waitForPlausibleTrackingEvent } from './helpers'

describe('Thématiques', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')

        assert.equal(
            await page.title(),
            'Conseils pour mon\u00a0enfant — Mes Conseils Covid'
        )
    })

    it('version dans le footer', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')
        const footer = await page.waitForSelector('footer')
        assert.include(await footer.innerText(), '- Mise à jour le ')
    })

    it('on va vers une autre page thématique', async function () {
        const page = this.test.page

        let messages = recordConsoleMessages(page)
        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')

        await Promise.all([
            page.click(
                '.thematiques a >> text="Passe vaccinal et passe sanitaire, que faut-il savoir\u00a0?"'
            ),
            page.waitForNavigation({
                url: '**/pass-sanitaire-qr-code-voyages.html',
            }),
        ])

        await waitForPlausibleTrackingEvent(
            page,
            'pageview:pass-sanitaire-qr-code-voyages.html'
        ),
            assert.lengthOf(messages, 3)
        assert.include(messages[0], {
            n: 'pageview',
            u: 'http://localhost/conseils-pour-les-enfants.html',
        })
        assert.include(messages[1], {
            n: 'Navigue vers une thématique depuis une autre thématique',
            p: '{"chemin":"/conseils-pour-les-enfants.html → /pass-sanitaire-qr-code-voyages.html"}',
            u: 'http://localhost/conseils-pour-les-enfants.html',
        })
        assert.include(messages[2], {
            n: 'pageview',
            u: 'http://localhost/pass-sanitaire-qr-code-voyages.html',
        })
    })
})
