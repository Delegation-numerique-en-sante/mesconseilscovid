import { assert } from 'chai'
import { recuperationReponse } from './helpers.thematiques'

async function remplirVaccination(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#cas-contact-a-risque-vaccine-form label[for="cas_contact_a_risque_vaccine_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#cas-contact-a-risque-vaccine-form >> text="Terminer"'
    )
    await bouton.click()
}

describe('ContactARisque', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/cas-contact-a-risque.html')

        assert.equal(
            await page.title(),
            'Je suis cas contact Covid, que faire ? — Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
        )
    })

    it('quelle vaccination : complète', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/cas-contact-a-risque.html')

        await remplirVaccination(page, 'vaccine')
        // On recommande de faire un test.
        assert.include(
            await recuperationReponse(page, 'cas-contact-a-risque', 'vaccine'),
            'Faire un test antigénique en pharmacie immédiatement'
        )
    })

    it('quelle vaccination : incomplète', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/cas-contact-a-risque.html')

        await remplirVaccination(page, 'pas_vaccine')
        // On recommande l’isolement.
        assert.include(
            await recuperationReponse(page, 'cas-contact-a-risque', 'pas-vaccine'),
            'Restez isolé·e au minimum 7 jours après votre dernier contact à risque.'
        )
    })

    it('quelle vaccination : bouton recommencer', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/cas-contact-a-risque.html')

        // On remplit un formulaire jusqu’à l’affichage de la réponse.
        await remplirVaccination(page, 'vaccine')

        // On clic sur le bouton pour recommencer.
        const bouton = await page.waitForSelector(
            '#cas-contact-a-risque-refaire >> text="Recommencer le questionnaire"'
        )
        await bouton.click()

        // On est revenu au formulaire initial (vaccination).
        const formLegend = await page.waitForSelector(
            '#cas-contact-a-risque-vaccine-form legend'
        )
        assert.equal((await formLegend.innerText()).trim(), 'Je suis cas contact et :')
    })
})
