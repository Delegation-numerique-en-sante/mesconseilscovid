import { assert } from 'chai'
import { remplirQuestionnaire, waitForPlausibleTrackingEvent } from './helpers.js'

describe('Parcours', function () {
    it('remplir le questionnaire sans symptômes ni dépistage', async function () {
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
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
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

        await waitForPlausibleTrackingEvent(
            page,
            'Questionnaire commencé:symptomesactuels'
        )

        // Conseils
        {
            // On rend la localisation visible
            await page.click('#page #conseils-vie-quotidienne h3')

            // On retrouve le département de résidence
            let residence = await page.waitForSelector('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

            // On rend l’activité visible
            await page.click('#page #conseils-activite h3')

            // On retrouve l’activité
            let activite = await page.waitForSelector('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous travaillez et/ou êtes bénévole (modifier)'
            )

            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')

            // On retourne à l'intro
            let bouton = await page.waitForSelector(
                '#page >> text="Revenir à l’accueil"'
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
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            symptomesActuels: ['temperature'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
            departement: '80',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        await waitForPlausibleTrackingEvent(
            page,
            'Questionnaire commencé:symptomesactuels'
        )

        // Conseils
        {
            // On rend la localisation visible
            await page.click('#page #conseils-vie-quotidienne h3')

            // On retrouve le département de résidence
            let residence = await page.waitForSelector('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
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
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            symptomesActuels: ['souffle'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
            departement: '80',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
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
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            symptomesActuels: [],
            symptomesPasses: true,
            debutSymptomes: 'hier',
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

        await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
    })

    it('remplir le questionnaire avec contact à risque', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: ['contact_direct'],
            depistage: false,
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils
        {
            // On retrouve la partie contact à risque
            let contact_a_risque = await page.waitForSelector(
                '#page #conseils-personnels-contact-a-risque'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                'Prévoir un test au 7e jour suivant le dernier contact avec le malade'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec pas de symptômes et covid+ (asymptomatique)', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: true,
            depistageResultat: 'positif',
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils
        {
            // On retrouve la partie contact à risque
            let contact_a_risque = await page.waitForSelector(
                '#page #statut-asymptomatique'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                'Vous êtes porteur de la Covid sans symptômes'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec pas de symptômes et covid? (attente)', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: true,
            depistageResultat: 'en_attente',
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils
        {
            // On retrouve le statut
            let statut = await page.waitForSelector('#page #statut-en-attente')
            assert.include(
                (await statut.innerText()).trim(),
                'Continuez à appliquer les mesures barrières en attendant les résultats de votre test'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
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
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
    })
})
