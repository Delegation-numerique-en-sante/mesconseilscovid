import { assert } from 'chai'

async function cEstParti(page) {
    const summary = await page.waitForSelector(
        'details#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire summary'
    )
    await summary.click()

    const bouton = await page.waitForSelector(
        '#prolongation-pass-sanitaire-demarrage-form >> text="C’est parti !"'
    )
    await bouton.click()
}

async function remplirAge(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#prolongation-pass-sanitaire-age-form label[for="prolongation_pass_sanitaire_age_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#prolongation-pass-sanitaire-age-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirVaccinationInitiale(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#prolongation-pass-sanitaire-vaccination-initiale-form label[for="prolongation_pass_sanitaire_vaccination_initiale_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#prolongation-pass-sanitaire-vaccination-initiale-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirSituationMoins65(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#prolongation-pass-sanitaire-situation-moins65-form label[for="prolongation_pass_sanitaire_situation_moins65_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#prolongation-pass-sanitaire-situation-moins65-form >> text="Continuer"'
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

        await cEstParti(page)

        await remplirAge(page, 'plus65')
        await remplirVaccinationInitiale(page, 'autre')
        await remplirDateDerniereDose(page, '2021-04-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(
            statut,
            'Vous avez 65 ans ou plus et avez été vacciné(e) avec le vaccin Pfizer, Moderna ou AstraZeneca.'
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

        await cEstParti(page)

        await remplirAge(page, 'plus65')
        await remplirVaccinationInitiale(page, 'autre')
        await remplirDateDerniereDose(page, '2021-05-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(
            statut,
            'Vous avez 65 ans ou plus et avez été vacciné(e) avec le vaccin Pfizer, Moderna ou AstraZeneca.'
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

        await cEstParti(page)

        await remplirAge(page, 'plus65')
        await remplirVaccinationInitiale(page, 'autre')
        await remplirDateDerniereDose(page, '2021-06-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(
            statut,
            'Vous avez 65 ans ou plus et avez été vacciné(e) avec le vaccin Pfizer, Moderna ou AstraZeneca.'
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

    it('Janssen, plus de 65 et 17 juin', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        await remplirAge(page, 'plus65')
        await remplirVaccinationInitiale(page, 'janssen')
        await remplirDateDerniereDose(page, '2021-06-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(statut, 'Vous avez été vacciné(e) avec le vaccin Janssen.')
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

    it('Janssen, moins de 65 et 17 juin', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        await remplirAge(page, 'moins65')
        await remplirSituationMoins65(page, 'janssen')
        await remplirDateDerniereDose(page, '2021-06-17')

        const statut = await recuperationStatut(page, 'dates')
        assert.include(statut, 'Vous avez été vacciné(e) avec le vaccin Janssen.')
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

    it('Bouton retour (situation)', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        let formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-age-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await remplirAge(page, 'plus65')

        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-vaccination-initiale-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'Ma vaccination initiale')

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            '#prolongation-pass-sanitaire-vaccination-initiale-form >> text="Retour"'
        )
        await bouton.click()

        // On est revenu au formulaire précédent (age).
        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-age-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'Mon âge')
    })

    it('Bouton retour (date dernière dose)', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        let formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-age-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await remplirAge(page, 'plus65')
        await remplirVaccinationInitiale(page, 'autre')

        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-date-derniere-dose-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière dose')

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            '#prolongation-pass-sanitaire-date-derniere-dose-form >> text="Retour"'
        )
        await bouton.click()

        // Cas spécial: on retour au formulaire initial pour ne pas
        // gérer la complexité de l’origine de ce formulaire
        // (questionnaire en diamant).
        formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-age-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'Mon âge')
    })

    it('Bouton recommencer', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        let formLegend = await page.waitForSelector(
            '#prolongation-pass-sanitaire-age-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await remplirAge(page, 'plus65')
        await remplirVaccinationInitiale(page, 'autre')

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
            '#prolongation-pass-sanitaire-age-form legend h3'
        )
        assert.equal(await formLegend.innerText(), 'Mon âge')
    })
})
