import { assert } from 'chai'
import {
    remplirQuestionnaire,
    remplirDepartement,
    remplirFoyer,
    remplirAntecedents,
    remplirCaracteristiques,
    remplirActivite,
    remplirSuivi,
    waitForPlausibleTrackingEvent,
} from './helpers.js'

describe('Auto-suivi', function () {
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
                waitForPlausibleTrackingEvent(page, 'pageview:depistage'),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: ['temperature'],
        })

        // La page de date du suivi apparait la première fois
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
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
                waitForPlausibleTrackingEvent(page, 'pageview:residence'),
            ])
        }

        // Remplir la suite du questionnaire
        {
            const choix = {
                departement: '00',
                activitePro: true,
                enfants: true,
                age: '42',
                taille: '165',
                poids: '70',
                grossesse: false,
            }
            await remplirDepartement(page, choix.departement)
            await remplirFoyer(page, choix.enfants)
            await remplirAntecedents(page)
            await remplirCaracteristiques(page, choix.age, choix.taille, choix.poids)
            await remplirActivite(page, choix.activitePro)
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Poursuivez votre auto-suivi à la maison comme entendu avec votre médecin.'
            )
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page #suivi >> text="l’historique de vos symptômes"'
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
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page #suivi >> text="l’historique de vos symptômes"'
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
                waitForPlausibleTrackingEvent(page, 'pageview:depistage'),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: ['temperature'],
        })

        // La page de date du suivi apparait la première fois
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
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
                confusion: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:residence'),
            ])
        }

        // Remplir la suite du questionnaire
        {
            const choix = {
                departement: '00',
                activitePro: true,
                enfants: true,
                age: '42',
                taille: '165',
                poids: '70',
                grossesse: false,
            }
            await remplirDepartement(page, choix.departement)
            await remplirFoyer(page, choix.enfants)
            await remplirAntecedents(page)
            await remplirCaracteristiques(page, choix.age, choix.taille, choix.poids)
            await remplirActivite(page, choix.activitePro)
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Poursuivez votre auto-suivi à la maison comme entendu avec votre médecin.'
            )
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page >> text="l’historique des symptômes"'
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

        // La page d’Introduction contient maintenant un lien vers son suivi
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Continuer son suivi"'
            )
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

        // La page d’introduction du suivi comporte un lien direct
        // vers ses symptômes car on a déjà renseignée la date de début
        {
            await page.waitForSelector('#page h2 >> text="Suivi de la maladie"')

            let bouton = await page.waitForSelector(
                '#page >> text="Continuer son suivi"'
            )
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
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page #suivi >> text="l’historique des symptômes"'
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
