import { assert } from 'chai'
import {
    remplirQuestionnaire,
    waitForPlausibleTrackingEvent,
    waitForPlausibleTrackingEvents,
} from './helpers'

describe('Plausible', function () {
    it('accès à une page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/#introduction')
        await page.waitForSelector('#page.ready')
        assert.equal(
            await page.title(),
            'Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
        )

        await waitForPlausibleTrackingEvents(page, ['pageview:introduction'])
    })

    it('accès à une page avec source', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/?source=toto#introduction')
        await page.waitForSelector('#page.ready')
        assert.equal(
            await page.title(),
            'Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
        )

        await waitForPlausibleTrackingEvents(page, ['pageview:introduction:toto'])
    })

    it('le changement de page conserve la source', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/?source=toto#introduction')
        await page.waitForSelector('#page.ready')
        assert.equal(
            await page.title(),
            'Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
        )
        await waitForPlausibleTrackingEvents(page, ['pageview:introduction:toto'])

        await page.click('a >> text="Je suis cas contact Covid, que faire\u00a0?"')
        await waitForPlausibleTrackingEvents(page, [
            'pageview:cas-contact-a-risque.html:toto',
        ])
    })

    it('drapeau sur une page', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour avoir des conseils.
        const bouton = await page.waitForSelector(
            'a.button >> text="Je réponds pour moi"'
        )

        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#symptomes' }),
        ])

        await page.waitForSelector('#page.ready')
        const drapeau = await page.waitForSelector(
            '.feedback-component >> text="Des difficultés pour répondre à cette question ?"'
        )
        await drapeau.click()
        const form = await page.waitForSelector('.feedback-component .feedback-form')
        assert.include(
            await form.innerHTML(),
            'Merci de nous avoir signalé vos difficultés pour répondre à cette question.'
        )

        await waitForPlausibleTrackingEvents(page, [
            'Questionnaire commencé:symptomes',
            'Questionnaire commencé pour moi:symptomes',
            'pageview:symptomes',
            'Avis flag:symptomes',
        ])
    })

    it('avis positif conseils', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour avoir des conseils.
        let bouton = await page.waitForSelector(
            'a.button >> text="Je réponds pour moi"'
        )

        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#symptomes' }),
        ])

        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'pageview:conseils')

        bouton = await page.waitForSelector('#page.ready .button-feedback-positif')

        await Promise.all([
            bouton.click(),
            page.waitForSelector('#page.ready .feedback-component .feedback-form'),
        ])

        const form = await page.waitForSelector(
            '#page.ready .feedback-component .feedback-form'
        )

        assert.include(await form.innerHTML(), 'Merci pour votre retour.')

        await waitForPlausibleTrackingEvents(page, [
            'Questionnaire commencé:symptomes',
            'Questionnaire commencé pour moi:symptomes',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
            'pageview:historique',
            'pageview:vaccins',
            'pageview:situation',
            'pageview:sante',
            'Questionnaire terminé:conseils',
            'Questionnaire terminé pour moi:conseils',
            'pageview:conseils',
            'Avis positif:conseils',
        ])
    })

    it('avis positif conseils pour une proche', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour un ou une proche.
        let bouton = await page.waitForSelector(
            'a.button >> text="Je réponds pour un proche"'
        )
        await Promise.all([bouton.click(), page.waitForNavigation({ url: '**/#nom' })])

        await remplirQuestionnaire(page, {
            nom: 'Mamie',
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'pageview:conseils')

        bouton = await page.waitForSelector('#page.ready .button-feedback-positif')

        await Promise.all([
            bouton.click(),
            page.waitForSelector('#page.ready .feedback-component .feedback-form'),
        ])

        const form = await page.waitForSelector(
            '#page.ready .feedback-component .feedback-form'
        )

        assert.include(await form.innerHTML(), 'Merci pour votre retour.')

        await waitForPlausibleTrackingEvents(page, [
            'pageview:nom',
            'Questionnaire commencé:symptomes',
            'Questionnaire commencé pour un proche:symptomes',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
            'pageview:historique',
            'pageview:vaccins',
            'pageview:situation',
            'pageview:sante',
            'Questionnaire terminé:conseils',
            'Questionnaire terminé pour un proche:conseils',
            'pageview:conseils',
            'Avis positif:conseils',
        ])
    })

    it('avis négatif conseils', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour avoir des conseils.
        let bouton = await page.waitForSelector(
            'a.button >> text="Je réponds pour moi"'
        )
        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#symptomes' }),
        ])
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'pageview:conseils')

        bouton = await page.waitForSelector('#page.ready .button-feedback-negatif')

        await Promise.all([
            bouton.click(),
            page.waitForSelector('#page.ready .feedback-component .feedback-form'),
        ])

        const form = await page.waitForSelector(
            '#page.ready .feedback-component .feedback-form'
        )

        assert.include(await form.innerHTML(), 'Merci pour votre retour.')

        await waitForPlausibleTrackingEvents(page, [
            'Questionnaire commencé:symptomes',
            'Questionnaire commencé pour moi:symptomes',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
            'pageview:historique',
            'pageview:vaccins',
            'pageview:situation',
            'pageview:sante',
            'Questionnaire terminé:conseils',
            'Questionnaire terminé pour moi:conseils',
            'pageview:conseils',
            'Avis negatif:conseils',
        ])
    })

    it('avis négatif conseils pour un proche', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour un ou une proche.
        let bouton = await page.waitForSelector(
            'a.button >> text="Je réponds pour un proche"'
        )
        await Promise.all([bouton.click(), page.waitForNavigation({ url: '**/#nom' })])
        await remplirQuestionnaire(page, {
            nom: 'Papy',
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'pageview:conseils')

        bouton = await page.waitForSelector('#page.ready .button-feedback-negatif')

        await Promise.all([
            bouton.click(),
            page.waitForSelector('#page.ready .feedback-component .feedback-form'),
        ])

        const form = await page.waitForSelector(
            '#page.ready .feedback-component .feedback-form'
        )

        assert.include(await form.innerHTML(), 'Merci pour votre retour.')

        await waitForPlausibleTrackingEvents(page, [
            'pageview:nom',
            'Questionnaire commencé:symptomes',
            'Questionnaire commencé pour un proche:symptomes',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
            'pageview:historique',
            'pageview:vaccins',
            'pageview:situation',
            'pageview:sante',
            'Questionnaire terminé:conseils',
            'Questionnaire terminé pour un proche:conseils',
            'pageview:conseils',
            'Avis negatif:conseils',
        ])
    })

    it('avis partager conseils', async function () {
        const page = this.test.page

        // On va vers la page des symptômes.
        await page.goto('http://localhost:8080/j-ai-des-symptomes-covid.html')

        // On clique sur le bouton pour avoir des conseils.
        let bouton = await page.waitForSelector(
            'a.button >> text="Je réponds pour moi"'
        )
        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#symptomes' }),
        ])
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'pageview:conseils')

        bouton = await page.waitForSelector('#page.ready .button-feedback-partager')

        await Promise.all([
            bouton.click(),
            page.waitForSelector('#page.ready .feedback-component .feedback-partager'),
        ])

        const partager = await page.waitForSelector(
            '#page.ready .feedback-component .feedback-partager'
        )

        assert.include(
            await partager.innerHTML(),
            'Faites connaître Mes Conseils Covid en partageant ce lien'
        )

        await waitForPlausibleTrackingEvents(page, [
            'Questionnaire commencé:symptomes',
            'Questionnaire commencé pour moi:symptomes',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
            'pageview:historique',
            'pageview:vaccins',
            'pageview:situation',
            'pageview:sante',
            'Questionnaire terminé:conseils',
            'Questionnaire terminé pour moi:conseils',
            'pageview:conseils',
            'Menu Partager:conseils',
        ])
    })
})
