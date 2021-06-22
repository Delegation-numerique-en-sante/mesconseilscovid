import { assert } from 'chai'

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
            'Mes Conseils Covid — Isolement, tests, vaccins… tout savoir pour prendre soin de votre santé'
        )
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
            'Conseils pour les mineurs — Mes Conseils Covid — Isolement, tests, vaccins… tout savoir pour prendre soin de votre santé'
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
            assert.equal(await button.getAttribute('href'), '#vaccins')
            // On retrouve le titre explicite.
            let titre = await page.waitForSelector('#page.ready h1')
            assert.equal(await titre.innerText(), 'Conditions d’utilisation')
        }
    })
})
