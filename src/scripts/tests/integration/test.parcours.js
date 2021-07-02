import { assert } from 'chai'
import { remplirQuestionnaire, waitForPlausibleTrackingEvent } from './helpers'

describe('Parcours', function () {
    it('remplir le questionnaire sans symptômes ni dépistage', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
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

        await waitForPlausibleTrackingEvent(page, 'Questionnaire commencé:vaccins')

        // Conseils.
        {
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

            // On retourne à l'intro.
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Revenir à l’accueil"'
            )
            await Promise.all([bouton.click(), page.waitForSelector('#page.ready')])
        }

        // Introduction.
        {
            // La page comporte maintenant un lien direct vers mes conseils.
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Voir mes conseils"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
        }
    })

    it('remplir le questionnaire avec symptômes', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
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

        await waitForPlausibleTrackingEvent(page, 'Questionnaire commencé:vaccins')

        await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
    })

    it('remplir le questionnaire avec symptômes (gravité majeure)', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
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

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
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

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
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

        // Conseils.
        {
            // On retrouve la partie contact à risque.
            let contact_a_risque = await page.waitForSelector(
                '#page.ready #conseils-personnels-contact-a-risque-sans-test'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                'Si le test est négatif, restez en isolement, et faites un test'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec contact à risque TAC', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            contactARisqueTAC: true,
            depistage: false,
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils.
        {
            // On retrouve la partie contact à risque.
            let contact_a_risque = await page.waitForSelector(
                '#page.ready #conseils-personnels-contact-a-risque-sans-test'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                'Si le test est négatif, restez en isolement, et faites un test'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec contact à risque AM', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            contactARisqueAM: true,
            depistage: false,
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils.
        {
            // On retrouve la partie contact à risque.
            let contact_a_risque = await page.waitForSelector(
                '#page.ready #conseils-personnels-contact-a-risque-sans-test'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                'Si le test est négatif, restez en isolement, et faites un test'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec pas de symptômes et covid+ (asymptomatique)', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: true,
            depistageDate: new Date(),
            depistageType: 'rtpcr',
            depistageResultat: 'positif',
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils.
        {
            // On retrouve la partie contact à risque.
            let contact_a_risque = await page.waitForSelector(
                '#page.ready #statut-asymptomatique'
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

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: true,
            depistageDate: new Date(),
            depistageType: 'rtpcr',
            depistageResultat: 'en_attente',
            departement: '00',
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Conseils.
        {
            // On retrouve le statut.
            let statut = await page.waitForSelector('#page.ready #statut-en-attente')
            assert.include(
                (await statut.innerText()).trim(),
                'Continuez à appliquer les mesures barrières en attendant les résultats de votre test'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec département autre', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // Page d’accueil.
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
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

    it('remplir le questionnaire avec age < 15 ans', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction.
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForSelector('#page.ready'),
        ])

        // On clique sur "Des conseils pour moi".
        {
            let bouton = await page.waitForSelector(
                '#page.ready #profils-cards-empty >> text="Des conseils pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/vaccins' }),
            ])
            assert.equal(
                await page.title(),
                'Mon statut actuel de vaccination contre la Covid (étape 1) — Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
            )
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: ['temperature'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
            departement: '80',
            age: '14',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Page conseils.
        {
            // On retrouve le titre explicite.
            let titre = await page.waitForSelector('#page.ready h1')
            assert.equal(await titre.innerText(), 'Mes conseils')

            // Désolé, pas de conseils.
            let statut = await page.waitForSelector('#page.ready #conseils-statut')
            assert.equal(
                (await statut.innerText()).trim(),
                'Nous ne pouvons pas donner de conseils personnalisés aux moins de 15 ans.'
            )

            // Le bloc « Isolement » est caché.
            assert.isTrue(await page.isHidden('#page.ready #conseils-isolement'))

            // On n’a pas démarré automatiquement de suivi.
            assert.isUndefined(
                await page.evaluate(() => window.app.profil.suivi_start_date)
            )

            // Le bouton « Démarrer mon suivi » est caché.
            assert.isTrue(
                await page.isHidden('#page.ready >> text="Démarrer mon suivi"')
            )

            // On peut revenir à l’accueil.
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Revenir à l’accueil"'
            )
            await Promise.all([
                bouton.click(),
                waitForPlausibleTrackingEvent(page, 'pageview:introduction'),
            ])
        }

        // Page d’accueil.
        {
            // Il y a un bouton « Voir mes conseils ».
            await page.waitForSelector('#page.ready >> text="Voir mes conseils"')

            // Il n’y a PAS de bouton « Démarrer mon suivi ».
            assert.isNull(await page.$('#page.ready >> text="Démarrer mon suivi"'))
        }
    })
})
