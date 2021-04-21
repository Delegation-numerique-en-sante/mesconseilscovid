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
        assert.equal(
            await page.title(),
            'Mes Conseils Covid — Isolement, tests, vaccins… tout savoir pour prendre soin de votre santé'
        )

        await waitForPlausibleTrackingEvents(page, ['pageview:introduction'])
    })

    it('drapeau sur une page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/#introduction')
        await page.waitForSelector('#page.ready')
        assert.equal(
            await page.title(),
            'Mes Conseils Covid — Isolement, tests, vaccins… tout savoir pour prendre soin de votre santé'
        )
        const bouton = await page.waitForSelector('.feedback-component >> text="Oui"')
        await bouton.click()
        const form = await page.waitForSelector('.feedback-component .feedback-form')
        assert.include(
            await form.innerHTML(),
            'Merci de nous avoir signalé vos difficultés avec cette page.'
        )

        await waitForPlausibleTrackingEvents(page, [
            'pageview:introduction',
            'Avis flag:introduction',
        ])
    })

    it('avis positif conseils', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/#introduction')
        let bouton = await page.waitForSelector(
            '#page.ready >> text="Des conseils pour moi"'
        )

        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#vaccins' }),
        ])

        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            departement: '80',
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
            'pageview:introduction',
            'Questionnaire commencé:vaccins',
            'Questionnaire commencé pour moi:vaccins',
            'pageview:vaccins',
            'pageview:historique',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
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

        await page.goto('http://localhost:8080/#introduction')
        let bouton = await page.waitForSelector(
            '#page.ready .js-profil-new >> text="Des conseils pour un·e proche"'
        )

        await Promise.all([bouton.click(), page.waitForNavigation({ url: '**/#nom' })])

        await remplirQuestionnaire(page, {
            nom: 'Mamie',
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            departement: '80',
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
            'pageview:introduction',
            'pageview:nom',
            'Questionnaire commencé:vaccins',
            'Questionnaire commencé pour un proche:vaccins',
            'pageview:vaccins',
            'pageview:historique',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
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

        await page.goto('http://localhost:8080/#introduction')
        let bouton = await page.waitForSelector(
            '#page.ready >> text="Des conseils pour moi"'
        )
        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#vaccins' }),
        ])
        await remplirQuestionnaire(page, {
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            departement: '80',
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
            'pageview:introduction',
            'Questionnaire commencé:vaccins',
            'Questionnaire commencé pour moi:vaccins',
            'pageview:vaccins',
            'pageview:historique',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
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

        await page.goto('http://localhost:8080/#introduction')
        let bouton = await page.waitForSelector(
            '#page.ready .js-profil-new >> text="Des conseils pour un·e proche"'
        )
        await Promise.all([bouton.click(), page.waitForNavigation({ url: '**/#nom' })])
        await remplirQuestionnaire(page, {
            nom: 'Papy',
            vaccins: 'pas_encore',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            depistage: false,
            departement: '80',
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
            'pageview:introduction',
            'pageview:nom',
            'Questionnaire commencé:vaccins',
            'Questionnaire commencé pour un proche:vaccins',
            'pageview:vaccins',
            'pageview:historique',
            'pageview:symptomes',
            'pageview:contactarisque',
            'pageview:depistage',
            'pageview:situation',
            'pageview:sante',
            'Questionnaire terminé:conseils',
            'Questionnaire terminé pour un proche:conseils',
            'pageview:conseils',
            'Avis negatif:conseils',
        ])
    })
})
