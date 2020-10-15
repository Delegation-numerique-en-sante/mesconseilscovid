import { assert } from 'chai'
import {
    remplirQuestionnaire,
    remplirSuivi,
    waitForPlausibleTrackingEvent,
} from './helpers.js'

describe('Suivi', function () {
    it('remplir le questionnaire de suivi pour moi', async function () {
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
                waitForPlausibleTrackingEvent(page, 'pageview:symptomesactuels'),
            ])
        }

        // Remplir le questionnaire avec symptômes actuels
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

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let statut = await page.waitForSelector(
                '#page #statut-symptomatique-sans-test'
            )
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur de la Covid. Restez isolé le temps de faire un test.'
            )
            // un bouton vers le suivi des symptômes
            let bouton = await page.waitForSelector(
                '#page #conseils-personnels-symptomes-actuels-sans-depistage >> text="questionnaire de suivi"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivisymptomes')
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page #conseils-sante summary')
            await bloc.click()
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:introduction'),
            ])
        }

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer mon suivi"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suiviintroduction'),
            ])
        }

        // Page d’introduction du suivi
        {
            let bouton = await page.waitForSelector('text="Démarrer mon suivi"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivisymptomes'),
            ])
        }

        // La page du suivi des symptômes
        {
            await remplirSuivi(page, {
                essoufflement: 'mieux',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:conseils'),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Continuez à suivre l’évolution de vos symptômes pendant votre isolement.'
            )
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page #conseils-sante summary')
            await bloc.click()
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page #conseils-sante >> text="l’historique de vos symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:introduction'),
            ])
        }

        // La page d’Introduction contient maintenant un lien vers mon suivi
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Continuer mon suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suiviintroduction'),
            ])
        }

        // La page d’introduction du suivi comporte un lien direct
        // vers mes symptômes car on a déjà renseignée la date de début
        {
            await page.waitForSelector('#page h2 >> text="Suivi de la maladie"')

            let bouton = await page.waitForSelector(
                '#page >> text="Continuer mon suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivisymptomes'),
            ])
        }

        // La page du suivi des symptômes
        {
            await remplirSuivi(page, {
                essoufflement: 'critique',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:conseils'),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 3
            let gravite = await page.waitForSelector('#page #suivi-gravite-3')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Contactez le 15 ou demandez à un votre proche de le faire pour vous immédiatement.'
            )
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page #conseils-sante summary')
            await bloc.click()
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page #conseils-sante >> text="l’historique de vos symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivihistorique'),
            ])
        }

        // La page de suivi d'historique
        {
            let bilanTitle = await page.waitForSelector('#page #historique h3')
            assert.equal(await bilanTitle.innerText(), 'Bilan de votre situation')
        }
    })

    it('remplir le questionnaire de suivi pour un proche', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/#'),
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
                waitForPlausibleTrackingEvent(page, 'pageview:nom'),
            ])
        }

        // Saisie nom
        {
            await page.fill('#page #name', 'Mamie')
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:symptomesactuels'),
            ])
        }

        // Remplir le questionnaire avec symptômes actuels
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

        // La page de Conseils doit contenir :
        {
            // le statut
            let statut = await page.waitForSelector(
                '#page #statut-symptomatique-sans-test'
            )
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur de la Covid. Restez isolé le temps de faire un test.'
            )
            // un bouton vers le suivi des symptômes
            let bouton = await page.waitForSelector(
                '#page #conseils-personnels-symptomes-actuels-sans-depistage >> text="questionnaire de suivi"'
            )
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page #conseils-sante summary')
            await bloc.click()
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:introduction'),
            ])
        }

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer son suivi"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suiviintroduction'),
            ])
        }

        // Page d’introduction du suivi
        {
            let bouton = await page.waitForSelector('text="Démarrer son suivi"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivisymptomes'),
            ])
        }

        // La page du suivi des symptômes
        {
            await remplirSuivi(page, {
                essoufflement: 'critique',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
                confusion: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:conseils'),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 3
            let gravite = await page.waitForSelector('#page #suivi-gravite-3')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Contactez le 15 ou demandez à un votre proche de le faire pour vous immédiatement.'
            )
            // le bloc « Ma santé »
            let bloc = await page.waitForSelector('#page #conseils-sante summary')
            await bloc.click()
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page #conseils-sante >> text="l’historique des symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:suivihistorique'),
            ])
        }

        // La page de suivi d'historique
        {
            let bilanTitle = await page.waitForSelector('#page #historique h3')
            assert.equal(await bilanTitle.innerText(), 'Bilan de votre situation')
        }
    })
})
