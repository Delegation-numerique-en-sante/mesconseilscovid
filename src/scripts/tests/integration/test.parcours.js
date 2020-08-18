const assert = require('assert')
const helpers = require('./helpers.js')

describe('Parcours', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/')
        assert.equal(
            await page.title(),
            'Mes conseils Covid — Des conseils personnalisés pour agir contre le virus'
        )
    })

    it('remplir le questionnaire classique', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Remplir le questionnaire
        await helpers.remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: false,
        })

        // Conseils
        {
            // On rend l’activité visible
            await page.click('#page #conseils-activite h3')

            // On retrouve l’activité
            let activite = await page.waitForSelector('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous exercez une activité professionnelle et/ou bénévole (modifier)'
            )
            let bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
        }

        // Introduction
        {
            // La page comporte maintenant un lien direct vers mes conseils
            let bouton = await page.waitForSelector('#page >> text="Voir mes conseils"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
        }
    })

    it('remplir le questionnaire avec département autre', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Remplir le questionnaire
        await helpers.remplirQuestionnaire(page, {
            departement: '00',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: false,
        })

        // Conseils
        {
            // On rend l’activité visible
            await page.click('#page #conseils-activite h3')

            // On retrouve l’activité
            let activite = await page.waitForSelector('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous exercez une activité professionnelle et/ou bénévole (modifier)'
            )
            let bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
        }

        // Introduction
        {
            // La page comporte maintenant un lien direct vers mes conseils
            let bouton = await page.waitForSelector('#page >> text="Voir mes conseils"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
        }
    })

    it('remplir le questionnaire avec symptômes actuels', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Remplir le questionnaire
        await helpers.remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: ['temperature'],
        })

        // Avec des symptômes actuels on est redirigé vers le consentement médecin
        {
            const consentement = 'non' // non => redirection `conseils`

            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label = await page.waitForSelector(
                `#page label[for="suivi_medecin_${consentement}"]`
            )
            await label.click()

            const text = '"Aller vers mes conseils"'
            const nextPage = 'conseils'

            let bouton = await page.waitForSelector(`#page >> text=${text}`)
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: `**/#${nextPage}` }),
            ])
        }

        // Conseils
        {
            // On retrouve le message de porteur éventuel
            let statut = await page.waitForSelector('#page #statut-symptomatique')
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur du Covid-19.'
            )
        }
    })

    it('remplir le questionnaire avec symptômes actuels (gravité majeure)', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Remplir le questionnaire
        await helpers.remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: ['souffle'],
        })

        // Avec des symptômes actuels on est redirigé vers le consentement médecin
        {
            const consentement = 'non' // non => redirection `conseils`

            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label = await page.waitForSelector(
                `#page label[for="suivi_medecin_${consentement}"]`
            )
            await label.click()

            const text = '"Aller vers mes conseils"'
            const nextPage = 'conseils'

            let bouton = await page.waitForSelector(`#page >> text=${text}`)
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: `**/#${nextPage}` }),
            ])
        }

        // Conseils
        {
            // On retrouve le message d’appel du SAMU
            let statut = await page.waitForSelector(
                '#page #statut-symptomatique-urgent'
            )
            assert.equal(
                (await statut.innerText()).trim().startsWith('Appelez le SAMU / 15'),
                true
            )
        }
    })

    it('remplir le questionnaire avec symptômes passés', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Remplir le questionnaire
        await helpers.remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: true,
        })

        // Conseils
        {
            // On retrouve le message d’isolement
            let statut = await page.waitForSelector('#page #statut-risque-eleve')
            assert.equal(
                (await statut.innerText()).trim(),
                'Il vous est conseillé de rester en isolement.'
            )
        }
    })
})
