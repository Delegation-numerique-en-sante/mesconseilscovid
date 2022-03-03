import { assert } from 'chai'
import {
    remplirQuestionnaire,
    recordConsoleMessages,
    waitForPlausibleTrackingEvent,
} from './helpers'

describe('Parcours', function () {
    it('remplir le questionnaire sans symptômes ni dépistage', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            vaccins: 'pas_encore',
            enfants: true,
            activitePro: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'Questionnaire commencé:symptomes')

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
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
        }

        // La page comporte maintenant un lien direct vers mes conseils.
        {
            let bouton = await page.waitForSelector(
                '#page.ready >> text="Retrouver mes conseils"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // On peut aller vers une thématique depuis les conseils.
        {
            let messages = recordConsoleMessages(page)

            await Promise.all([
                page.click(
                    '#page.ready .thematiques a >> text="Passe vaccinal et passe sanitaire, que faut-il savoir\u00a0?"'
                ),
                page.waitForNavigation({
                    url: '**/pass-sanitaire-qr-code-voyages.html',
                }),
            ])

            await waitForPlausibleTrackingEvent(
                page,
                'pageview:pass-sanitaire-qr-code-voyages.html'
            )

            assert.lengthOf(messages, 3)
            assert.include(messages[0], {
                n: 'pageview',
                u: 'http://localhost/conseils',
            })
            assert.include(messages[1], {
                n: 'Navigue vers une thématique depuis les conseils',
                p: '{"chemin":"/conseils → /pass-sanitaire-qr-code-voyages.html","profil":"moi"}',
                u: 'http://localhost/conseils',
            })
            assert.include(messages[2], {
                n: 'pageview',
                u: 'http://localhost/pass-sanitaire-qr-code-voyages.html',
            })
        }
    })

    it('remplir le questionnaire avec symptômes (non vacciné)', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: ['temperature'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Le statut correspond au cas où je ne suis pas encore complètement vacciné.
        let statut = await page.waitForSelector(
            '#page.ready #statut-symptomatique-sans-test'
        )
        assert.include(
            (await statut.innerText()).trim(),
            'Vous êtes peut-être porteur(se) de la Covid. Restez isolé(e) le temps de faire un test.'
        )

        await waitForPlausibleTrackingEvent(page, 'Questionnaire commencé:symptomes')

        await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
    })

    it('remplir le questionnaire avec symptômes (vacciné)', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'completement',
            symptomesActuels: ['temperature'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            activitePro: true,
        })

        // Le statut correspond au cas où je suis complètement vacciné.
        let statut = await page.waitForSelector(
            '#page.ready #statut-symptomatique-sans-test'
        )
        assert.include(
            (await statut.innerText()).trim(),
            'Restez isolé(e) le temps de faire un test.\n\nBien que vous soyez vacciné(e), le risque de contamination ne peut pas être complètement écarté, en particulier face au variant Omicron.'
        )

        await waitForPlausibleTrackingEvent(page, 'Questionnaire commencé:symptomes')

        await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
    })

    it('remplir le questionnaire avec symptômes (gravité majeure)', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: ['souffle'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
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

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
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

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: ['contact_direct'],
            depistage: false,
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
                '#page.ready #conseils-personnels-contact-a-risque-non-vaccine'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                '7\u00a0jours après la date du dernier contact'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec contact à risque TAC', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
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
                '#page.ready #conseils-personnels-contact-a-risque-non-vaccine'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                '7\u00a0jours après la date du dernier contact'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec contact à risque AM', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
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
                '#page.ready #conseils-personnels-contact-a-risque-non-vaccine'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                '7\u00a0jours après la date du dernier contact'
            )
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')
        }
    })

    it('remplir le questionnaire avec pas de symptômes et covid+ (asymptomatique)', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
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

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
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

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
            ])
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
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

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour des conseils pour moi.
        {
            let bouton = await page.waitForSelector(
                'a.button >> text="Je réponds pour moi"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomes' }),
            ])
            await page.waitForSelector('#page.ready')
            assert.equal(
                await page.title(),
                'Mon état actuel (étape 1) — Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
            )
        }

        // Remplir le questionnaire.
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: ['temperature'],
            debutSymptomes: 'aujourdhui',
            depistage: false,
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

            // On a bien des conseils.
            let statut = await page.waitForSelector('#page.ready #conseils-statut')
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur(se) de la Covid. Restez isolé(e) le temps de faire un test.'
            )

            // Le bloc « Isolement » est bien visible.
            assert.isTrue(await page.isVisible('#page.ready #conseils-isolement'))

            // On a démarré automatiquement de suivi.
            assert.isDefined(
                await page.evaluate(() => window.app.profil.suivi_start_date)
            )

            // Le bouton « Démarrer mon suivi » est visible.
            assert.isTrue(
                await page.isVisible('#page.ready >> text="Démarrer mon suivi"')
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
            // Il y a un lien direct vers mes conseils.
            await page.waitForSelector('#page.ready >> text="Retrouver mes conseils"')

            // Il y a un bouton « Démarrer mon suivi ».
            await page.waitForSelector('#page.ready >> text="Démarrer mon suivi"')
        }
    })
})
