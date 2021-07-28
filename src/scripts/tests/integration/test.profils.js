import { assert } from 'chai'
import { remplirQuestionnaire, waitForPlausibleTrackingEvent } from './helpers'

describe('Profils', function () {
    it('remplir le questionnaire pour un proche', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour un ou une proche.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Des conseils pour un ou une proche"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#nom' }),
            ])
        }

        // Saisie nom.
        {
            await page.fill('#page.ready #name', 'Mamie')
            let bouton = await page.waitForSelector('#page.ready >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#vaccins' }),
            ])
        }

        // Légende adaptée.
        {
            let legend = await page.waitForSelector(
                '#page.ready #vaccins-form legend h1'
            )
            assert.equal(
                await legend.innerText(),
                'Son statut actuel de vaccination contre la Covid'
            )
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            departement: '80',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils.
        {
            // On retrouve le titre explicite.
            let titre = await page.waitForSelector('#page.ready #conseils-block-titre')
            assert.equal(await titre.innerText(), 'Conseils pour « Mamie »') // &nbsp; autour du nom

            // On rend l’activité visible.
            await page.click('#page.ready #conseils-activite h3')

            // On retrouve l’activité.
            let activite = await page.waitForSelector(
                '#page.ready #reponse-activite-pro'
            )
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous travaillez et/ou êtes bénévole (modifier)'
            )

            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')

            let bouton = await page.waitForSelector(
                '#page.ready >> text="Revenir à l’accueil"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
        }

        // Introduction.
        {
            // La page comporte maintenant un lien direct vers ses conseils.
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Voir ses conseils"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
        }
    })
})
