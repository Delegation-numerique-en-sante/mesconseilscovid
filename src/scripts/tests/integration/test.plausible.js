import { assert } from 'chai'
import { getPlausibleTrackingEvents, remplirQuestionnaire } from './helpers.js'

describe('Plausible', function () {
    it('accès à une page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/#introduction')
        assert.equal(
            await page.title(),
            'Mes conseils Covid — Des conseils personnalisés pour agir contre le virus'
        )
        const plausibleTrackingEvents = await getPlausibleTrackingEvents(page)
        assert.deepEqual(plausibleTrackingEvents, ['pageview:introduction'])
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
        const plausibleTrackingEvents = await getPlausibleTrackingEvents(page)
        assert.deepEqual(plausibleTrackingEvents, [
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
        bouton = await page.waitForSelector('.feedback-component >> text="Oui"')
        await bouton.click()
        const form = await page.waitForSelector('.feedback-component .feedback-form')
        assert.include(await form.innerHTML(), 'Merci pour votre retour.')
        const plausibleTrackingEvents = await getPlausibleTrackingEvents(page)
        assert.deepEqual(plausibleTrackingEvents, [
            'pageview:introduction',
            'pageview:residence',
            'Questionnaire commencé:residence',
            'pageview:foyer',
            'pageview:antecedents',
            'pageview:caracteristiques',
            'pageview:activitepro',
            'pageview:symptomesactuels',
            'pageview:symptomespasses',
            'pageview:contactarisque',
            'pageview:conseils',
            'Questionnaire terminé:conseils',
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
        bouton = await page.waitForSelector('.feedback-component >> text="Non"')
        await bouton.click()
        const form = await page.waitForSelector('.feedback-component .feedback-form')
        assert.include(await form.innerHTML(), 'Merci pour votre retour.')
        const plausibleTrackingEvents = await getPlausibleTrackingEvents(page)
        assert.deepEqual(plausibleTrackingEvents, [
            'pageview:introduction',
            'pageview:residence',
            'Questionnaire commencé:residence',
            'pageview:foyer',
            'pageview:antecedents',
            'pageview:caracteristiques',
            'pageview:activitepro',
            'pageview:symptomesactuels',
            'pageview:symptomespasses',
            'pageview:contactarisque',
            'pageview:conseils',
            'Questionnaire terminé:conseils',
            'Avis negatif:conseils',
        ])
    })
})
