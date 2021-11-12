import { assert } from 'chai'

async function remplirSituation(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#prolongation-pass-sanitaire-situation-form label[for="prolongation_pass_sanitaire_situation_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#prolongation-pass-sanitaire-situation-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirDateDerniereDose(page, dateIso) {
    await page.fill('#prolongation_pass_sanitaire_date_derniere_dose', dateIso)

    const bouton = await page.waitForSelector(
        '#prolongation-pass-sanitaire-date-derniere-dose-form >> text="Terminer"'
    )
    await bouton.click()
}

async function recuperationStatut(page, statut) {
    const reponse = await page.waitForSelector(
        `#prolongation-pass-sanitaire-${statut}-reponse`
    )
    return (await reponse.innerText()).trim()
}

describe('Rappel et prolongation du pass sanitaire', function () {
    it('Plus de 65 ans et 17 avril', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        const summary = await page.waitForSelector(
            'details#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire summary'
        )
        await summary.click()

        await remplirSituation(page, 'age')
        await remplirDateDerniereDose(page, '2021-04-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(
            statut,
            'Vous avez 65 ans ou plus et avez été vacciné avec le vaccin Pfizer, Moderna ou AstraZeneca.'
        )
        assert.include(statut, 'Vous avez reçu votre dernière dose le 17 avril 2021.')
        assert.include(
            statut,
            'Vous pourrez recevoir votre dose de rappel à partir du 17 octobre 2021.'
        )
        assert.include(
            statut,
            'Si vous la recevez avant le 15 décembre 2021, alors vous pourrez prolonger votre pass sanitaire sans discontinuité.'
        )
        assert.include(
            statut,
            'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 22 décembre 2021.'
        )
    })

    it('Plus de 65 ans et 17 mai', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        const summary = await page.waitForSelector(
            'details#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire summary'
        )
        await summary.click()

        await remplirSituation(page, 'age')
        await remplirDateDerniereDose(page, '2021-05-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(
            statut,
            'Vous avez 65 ans ou plus et avez été vacciné avec le vaccin Pfizer, Moderna ou AstraZeneca.'
        )
        assert.include(statut, 'Vous avez reçu votre dernière dose le 17 mai 2021.')
        assert.include(
            statut,
            'Vous pourrez recevoir votre dose de rappel à partir du 17 novembre 2021.'
        )
        assert.include(
            statut,
            'Si vous la recevez avant le 15 décembre 2021, alors vous pourrez prolonger votre pass sanitaire sans discontinuité.'
        )
        assert.include(
            statut,
            'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 22 décembre 2021.'
        )
    })

    it('Plus de 65 ans et 17 juin', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        const summary = await page.waitForSelector(
            'details#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire summary'
        )
        await summary.click()

        await remplirSituation(page, 'age')
        await remplirDateDerniereDose(page, '2021-06-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(
            statut,
            'Vous avez 65 ans ou plus et avez été vacciné avec le vaccin Pfizer, Moderna ou AstraZeneca.'
        )
        assert.include(statut, 'Vous avez reçu votre dernière dose le 17 juin 2021.')
        assert.include(
            statut,
            'Vous pourrez recevoir votre dose de rappel à partir du 17 décembre 2021.'
        )
        assert.include(
            statut,
            'Si vous la recevez avant le 14 janvier 2022, alors vous pourrez prolonger votre pass sanitaire sans discontinuité.'
        )
        assert.include(
            statut,
            'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 21 janvier 2022.'
        )
    })

    it('Janssen et 17 juin', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        const summary = await page.waitForSelector(
            'details#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire summary'
        )
        await summary.click()

        await remplirSituation(page, 'janssen')
        await remplirDateDerniereDose(page, '2021-06-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(statut, 'Vous avez été vacciné avec le vaccin Janssen.')
        assert.include(statut, 'Vous avez reçu votre dernière dose le 17 juin 2021.')
        assert.include(
            statut,
            'Vous pourrez recevoir votre dose de rappel à partir du 17 juillet 2021.'
        )
        assert.include(
            statut,
            'Si vous la recevez avant le 15 décembre 2021, alors vous pourrez prolonger votre pass sanitaire sans discontinuité.'
        )
        assert.include(
            statut,
            'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 22 décembre 2021.'
        )
    })

    it('Bouton retour', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        const summary = await page.waitForSelector(
            'details#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire summary'
        )
        await summary.click()

        let formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-situation-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Je suis éligible à la dose de rappel car…'
        )

        await remplirSituation(page, 'age')

        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-date-derniere-dose-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière dose')

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            '#prolongation-pass-sanitaire-date-derniere-dose-form >> text="Retour"'
        )
        await bouton.click()

        // On est revenu au formulaire précédent (situation).
        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-situation-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Je suis éligible à la dose de rappel car…'
        )
    })

    it('Bouton recommencer', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        const summary = await page.waitForSelector(
            'details#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire summary'
        )
        await summary.click()

        let formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-situation-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Je suis éligible à la dose de rappel car…'
        )

        await remplirSituation(page, 'age')

        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-date-derniere-dose-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière dose')

        await remplirDateDerniereDose(page, '2021-06-17')

        // On clique sur le bouton pour recommencer.
        const bouton = await page.waitForSelector(
            '#prolongation-pass-sanitaire-refaire >> text="Recommencer le questionnaire"'
        )
        await bouton.click()

        // On est revenu au formulaire initial (situation).
        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-situation-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Je suis éligible à la dose de rappel car…'
        )
    })
})
