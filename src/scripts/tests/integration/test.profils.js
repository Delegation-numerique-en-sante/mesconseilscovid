const assert = require('assert')
const helpers = require('./helpers.js')

describe('Profils', function () {
    it('remplir le questionnaire pour un proche', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('.js-profil-new >> text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour un proche'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#nom' }),
            ])
        }

        // Saisie nom
        {
            await page.fill('#page #nom', 'Mamie')
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
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
            // On retrouve le titre explicite
            let titre = await page.waitForSelector('#page #conseils-block-titre')
            assert.equal(await titre.innerText(), 'Conseils pour « Mamie »') // &nbsp; autour du nom

            // On retrouve le département de résidence
            let residence = await page.waitForSelector('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

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
            // La page comporte maintenant un lien direct vers ses conseils
            let bouton = await page.waitForSelector('#page >> text="Voir ses conseils"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
        }
    })
})
