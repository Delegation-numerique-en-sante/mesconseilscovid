import { assert } from 'chai'
import { remplirQuestionnaire, waitForPlausibleTrackingEvent } from './helpers.js'

describe('Profils', function () {
    it('remplir le questionnaire pour un proche', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil.
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

        // Saisie nom.
        {
            await page.fill('#page #name', 'Mamie')
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Légende adaptée.
        {
            let legend = await page.waitForSelector(
                '#page #symptomes-actuels-form legend'
            )
            assert.equal(await legend.innerText(), '1/9 - Son état actuel')
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
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
            let titre = await page.waitForSelector('#page #conseils-block-titre')
            assert.equal(await titre.innerText(), 'Conseils pour « Mamie »') // &nbsp; autour du nom

            // On rend la localisation visible.
            await page.click('#page #conseils-vie-quotidienne h3')

            // On retrouve le département de résidence.
            let residence = await page.waitForSelector('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

            // On rend l’activité visible.
            await page.click('#page #conseils-activite h3')

            // On retrouve l’activité.
            let activite = await page.waitForSelector('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous travaillez et/ou êtes bénévole (modifier)'
            )

            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')

            let bouton = await page.waitForSelector(
                '#page >> text="Revenir à l’accueil"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
        }

        // Introduction.
        {
            // La page comporte maintenant un lien direct vers ses conseils.
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
