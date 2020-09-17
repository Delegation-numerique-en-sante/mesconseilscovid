import { assert } from 'chai'
import {
    remplirQuestionnaire,
    waitForPlausibleTrackingEvent,
    waitForPlausibleTrackingEvents,
} from './helpers.js'

describe('Plausible', function () {
    it('accès à une page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/#introduction')
        assert.equal(
            await page.title(),
            'Mes conseils Covid — Des conseils personnalisés pour agir contre le virus'
        )

        await waitForPlausibleTrackingEvents(page, ['pageview:introduction'])
    })

    it('drapeau sur une page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/#introduction')
        assert.equal(
            await page.title(),
            'Mes conseils Covid — Des conseils personnalisés pour agir contre le virus'
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
        let bouton = await page.waitForSelector('text="Démarrer"')

        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#residence' }),
        ])

        await remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: false,
        })

        await waitForPlausibleTrackingEvent(page, 'pageview:conseils')

        bouton = await page.waitForSelector('#page .button-feedback-positif')

        await Promise.all([
            bouton.click(),
            page.waitForSelector('#page .feedback-component .feedback-form'),
        ])

        const form = await page.waitForSelector(
            '#page .feedback-component .feedback-form'
        )

        assert.include(await form.innerHTML(), 'Merci pour votre retour.')

        await waitForPlausibleTrackingEvents(page, [
            'pageview:introduction',
            'Questionnaire commencé:residence',
            'pageview:residence',
            'pageview:foyer',
            'pageview:antecedents',
            'pageview:caracteristiques',
            'pageview:activitepro',
            'pageview:symptomesactuels',
            'pageview:symptomespasses',
            'pageview:contactarisque',
            'Questionnaire terminé:conseils',
            'pageview:conseils',
            'Avis positif:conseils',
        ])
    })

    it('avis négatif conseils', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/#introduction')
        let bouton = await page.waitForSelector('text="Démarrer"')
        await Promise.all([
            bouton.click(),
            page.waitForNavigation({ url: '**/#residence' }),
        ])
        await remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: false,
        })

        await waitForPlausibleTrackingEvent(page, 'pageview:conseils')

        bouton = await page.waitForSelector('#page .button-feedback-negatif')

        await Promise.all([
            bouton.click(),
            page.waitForSelector('#page .feedback-component .feedback-form'),
        ])

        const form = await page.waitForSelector(
            '#page .feedback-component .feedback-form'
        )

        assert.include(await form.innerHTML(), 'Merci pour votre retour.')

        await waitForPlausibleTrackingEvents(page, [
            'pageview:introduction',
            'Questionnaire commencé:residence',
            'pageview:residence',
            'pageview:foyer',
            'pageview:antecedents',
            'pageview:caracteristiques',
            'pageview:activitepro',
            'pageview:symptomesactuels',
            'pageview:symptomespasses',
            'pageview:contactarisque',
            'Questionnaire terminé:conseils',
            'pageview:conseils',
            'Avis negatif:conseils',
        ])
    })
})
