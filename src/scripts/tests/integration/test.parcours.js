import { assert } from 'chai'
import { remplirQuestionnaire, waitForPlausibleTrackingEvent } from './helpers.js'

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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'Questionnaire commencé:depistage')

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
                'Vous exercez une activité professionnelle et/ou bénévole (modifier)'
            )

            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')

            // On retourne à l'intro
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

    it('remplir le questionnaire classique puis santé au travail', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Conseils
        {
            // On rend l’activité pro visible
            await page.click('#page #conseils-activite h3')

            // On peut aller vers la médecine du travail
            let link = await page.waitForSelector('#page a >> text="santé au travail"')
            await Promise.all([
                link.click(),
                page.waitForNavigation({ url: '**/#medecinedutravail' }),
            ])
        }

        // Médecine du travail
        {
            // La page comporte un lien direct de retour vers mes conseils
            let link = await page.waitForSelector(
                '#page >> text="Retourner à mes conseils"'
            )
            await Promise.all([
                link.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '00',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: ['temperature'],
        })

        // Avec des symptômes actuels on est redirigé vers la date de suivi (parcours suivi)
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: ['souffle'],
        })

        // Avec des symptômes actuels on est redirigé vers la date de suivi (parcours suivi)
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: true,
            contactARisque: [],
        })

        // Avec des symptômes passés on est redirigé vers la date de suivi (parcours suivi)
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }
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
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: ['meme_lieu_de_vie'],
        })

        // Avec un contact à risque on est redirigé vers la date de suivi (parcours suivi)
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }
    })

    it('remplir le questionnaire avec pédiatrie', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            enfants: true,
            age: '12',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Pédiatrie
        {
            // On retrouve le titre explicite
            let titre = await page.waitForSelector('#page h2')
            assert.equal(await titre.innerText(), 'Conseils pour les moins de 15 ans')

            // On retrouve le bouton pour repartir vers le questionnaire
            let button = await page.waitForSelector('#page #js-profil-empty a')
            assert.equal((await button.innerText()).trim(), 'Démarrer le questionnaire')
            assert.equal(await button.getAttribute('href'), '#depistage')
        }
    })

    it('on peut accéder aux CGU depuis l’accueil', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // On va vers la page de CGU
        {
            let bouton = await page.waitForSelector('text="Conditions d’utilisation"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conditionsutilisation' }),
            ])
        }

        // Conditions d’utilisation
        {
            // On retrouve le bouton pour repartir vers le questionnaire
            let button = await page.waitForSelector('#page #js-profil-empty a')
            assert.equal((await button.innerText()).trim(), 'Démarrer le questionnaire')
            assert.equal(await button.getAttribute('href'), '#depistage')
            // On retrouve le titre explicite
            let titre = await page.waitForSelector('#page h2')
            assert.equal(await titre.innerText(), 'Conditions d’utilisation')
        }
    })
})
