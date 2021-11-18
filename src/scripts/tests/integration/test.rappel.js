import { assert } from 'chai'

async function cEstParti(page, prefixe) {
    const bouton = await page.waitForSelector(
        `#${prefixe}-demarrage-form >> text="C’est parti !"`
    )
    await bouton.click()
}

async function remplirAge(page, reponse, prefixe) {
    const checkbox_label = await page.waitForSelector(
        `#${prefixe}-age-form label[for="${prefixe}_age_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        `#${prefixe}-age-form >> text="Continuer"`
    )
    await bouton.click()
}

async function remplirVaccinationInitiale(page, reponse, prefixe) {
    const checkbox_label = await page.waitForSelector(
        `#${prefixe}-vaccination-initiale-form label[for="${prefixe}_vaccination_initiale_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        `#${prefixe}-vaccination-initiale-form >> text="Continuer"`
    )
    await bouton.click()
}

async function remplirSituationMoins65(page, reponse, prefixe) {
    const checkbox_label = await page.waitForSelector(
        `#${prefixe}-situation-moins65-form label[for="${prefixe}_situation_moins65_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        `#${prefixe}-situation-moins65-form >> text="Continuer"`
    )
    await bouton.click()
}

async function remplirDateDerniereDose(page, dateIso, prefixe) {
    await page.fill(`#${prefixe}_date_derniere_dose`, dateIso)

    const bouton = await page.waitForSelector(
        `#${prefixe}-date-derniere-dose-form >> text="Terminer"`
    )
    await bouton.click()
}

async function recuperationStatut(page, statut, prefixe) {
    const reponse = await page.waitForSelector(`#${prefixe}-${statut}-reponse`)
    return (await reponse.innerText()).trim()
}

describe('Mini-questionnaire dose de rappel', function () {
    describe('Éligible au rappel et concerné par le pass sanitaire', function () {
        it('Plus de 65 ans et 17 avril', async function () {
            const page = this.test.page

            await page.goto(
                'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )

            const formulaire = await page.waitForSelector(
                '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
            )
            const prefixe = await formulaire.getAttribute('data-nom')

            await cEstParti(page, prefixe)

            await remplirAge(page, 'plus65', prefixe)
            await remplirVaccinationInitiale(page, 'autre', prefixe)
            await remplirDateDerniereDose(page, '2021-04-17', prefixe)

            const statut = await recuperationStatut(page, 'rappel-et-pass', prefixe)
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(
                statut,
                'Vous avez reçu votre dernière dose le 17 avril 2021.'
            )
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

            await page.goto(
                'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )

            const formulaire = await page.waitForSelector(
                '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
            )
            const prefixe = await formulaire.getAttribute('data-nom')

            await cEstParti(page, prefixe)

            await remplirAge(page, 'plus65', prefixe)
            await remplirVaccinationInitiale(page, 'autre', prefixe)
            await remplirDateDerniereDose(page, '2021-05-17', prefixe)

            const statut = await recuperationStatut(page, 'rappel-et-pass', prefixe)
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
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

            await page.goto(
                'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )

            const formulaire = await page.waitForSelector(
                '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
            )
            const prefixe = await formulaire.getAttribute('data-nom')

            await cEstParti(page, prefixe)

            await remplirAge(page, 'plus65', prefixe)
            await remplirVaccinationInitiale(page, 'autre', prefixe)
            await remplirDateDerniereDose(page, '2021-06-17', prefixe)

            const statut = await recuperationStatut(page, 'rappel-et-pass', prefixe)
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(
                statut,
                'Vous avez reçu votre dernière dose le 17 juin 2021.'
            )
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

            await page.goto(
                'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )

            const formulaire = await page.waitForSelector(
                '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
            )
            const prefixe = await formulaire.getAttribute('data-nom')

            await cEstParti(page, prefixe)

            await remplirAge(page, 'plus65', prefixe)
            await remplirVaccinationInitiale(page, 'janssen', prefixe)
            await remplirDateDerniereDose(page, '2021-06-17', prefixe)

            const statut = await recuperationStatut(page, 'rappel-et-pass', prefixe)
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avez été vacciné(e) avec le vaccin Janssen')
            assert.include(
                statut,
                'Vous avez reçu votre dernière dose le 17 juin 2021.'
            )
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

            await page.goto(
                'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )

            const formulaire = await page.waitForSelector(
                '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
            )
            const prefixe = await formulaire.getAttribute('data-nom')

            await cEstParti(page, prefixe)

            await remplirAge(page, 'moins65', prefixe)
            await remplirVaccinationInitiale(page, 'janssen', prefixe)
            await remplirDateDerniereDose(page, '2021-06-17', prefixe)

            const statut = await recuperationStatut(page, 'rappel-et-pass', prefixe)
            assert.include(statut, 'Vous avez moins de 65 ans')
            assert.include(statut, 'avez été vacciné(e) avec le vaccin Janssen')
            assert.include(
                statut,
                'Vous avez reçu votre dernière dose le 17 juin 2021.'
            )
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
    })

    describe('Éligible au rappel mais pas concerné par le pass sanitaire', function () {
        it('Moins de 65 ans et comorbidité, 17 juin', async function () {
            const page = this.test.page

            await page.goto(
                'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )

            const formulaire = await page.waitForSelector(
                '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
            )
            const prefixe = await formulaire.getAttribute('data-nom')

            await cEstParti(page, prefixe)

            await remplirAge(page, 'moins65', prefixe)
            await remplirVaccinationInitiale(page, 'autre', prefixe)
            await remplirSituationMoins65(page, 'comorbidite', prefixe)
            await remplirDateDerniereDose(page, '2021-06-17', prefixe)

            const statut = await recuperationStatut(page, 'rappel', prefixe)
            assert.include(statut, 'Vous avez moins de 65 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(
                statut,
                'Vous avez reçu votre dernière dose le 17 juin 2021.'
            )
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 décembre 2021.'
            )
            assert.include(
                statut,
                'Vous n’êtes pas concerné(e) par la désactivation du pass sanitaire, qui restera valable au delà du 15 décembre 2021.'
            )
        })

        it('Moins de 65 ans et professionnel de santé, 17 juin', async function () {
            const page = this.test.page

            await page.goto(
                'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )

            const formulaire = await page.waitForSelector(
                '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
            )
            const prefixe = await formulaire.getAttribute('data-nom')

            await cEstParti(page, prefixe)

            await remplirAge(page, 'moins65', prefixe)
            await remplirVaccinationInitiale(page, 'autre', prefixe)
            await remplirSituationMoins65(page, 'pro_sante', prefixe)
            await remplirDateDerniereDose(page, '2021-06-17', prefixe)

            const statut = await recuperationStatut(page, 'rappel', prefixe)
            assert.include(statut, 'Vous avez moins de 65 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(
                statut,
                'Vous avez reçu votre dernière dose le 17 juin 2021.'
            )
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 décembre 2021.'
            )
            assert.include(
                statut,
                'Vous n’êtes pas concerné(e) par la désactivation du pass sanitaire, qui restera valable au delà du 15 décembre 2021.'
            )
        })
    })

    it('Pas éligible au rappel', async function () {
        const page = this.test.page

        await page.goto(
            'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
        )

        const formulaire = await page.waitForSelector(
            '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
        )
        const prefixe = await formulaire.getAttribute('data-nom')

        await cEstParti(page, prefixe)

        await remplirAge(page, 'moins65', prefixe)
        await remplirVaccinationInitiale(page, 'autre', prefixe)
        await remplirSituationMoins65(page, 'autre', prefixe)

        const statut = await recuperationStatut(page, 'pas-concerne', prefixe)
        assert.include(statut, 'Vous avez moins de 65 ans')
        assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
        assert.include(
            statut,
            'Vous n’êtes actuellement pas concerné par la campagne de rappel.'
        )
        assert.include(
            statut,
            'Votre pass sanitaire restera également valable au delà du 15 décembre 2021.'
        )
    })

    it('Bouton retour (situation)', async function () {
        const page = this.test.page

        await page.goto(
            'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
        )

        const formulaire = await page.waitForSelector(
            '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
        )
        const prefixe = await formulaire.getAttribute('data-nom')

        await cEstParti(page, prefixe)

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await remplirAge(page, 'plus65', prefixe)

        formLegend = await page.waitForSelector(
            `#${prefixe}-vaccination-initiale-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'Ma vaccination initiale')

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            `#${prefixe}-vaccination-initiale-form >> text="Retour"`
        )
        await bouton.click()

        // On est revenu au formulaire précédent (age).
        formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')
    })

    it('Bouton retour (date dernière dose via plus 65)', async function () {
        const page = this.test.page

        await page.goto(
            'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
        )

        const formulaire = await page.waitForSelector(
            '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
        )
        const prefixe = await formulaire.getAttribute('data-nom')

        await cEstParti(page, prefixe)

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await remplirAge(page, 'plus65', prefixe)
        await remplirVaccinationInitiale(page, 'autre', prefixe)

        formLegend = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière dose')

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form >> text="Retour"`
        )
        await bouton.click()

        formLegend = await page.waitForSelector(
            `#${prefixe}-vaccination-initiale-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'Ma vaccination initiale')

        // On clique sur le bouton retour.
        const bouton2 = await page.waitForSelector(
            `#${prefixe}-vaccination-initiale-form >> text="Retour"`
        )
        await bouton2.click()

        formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')
    })

    it('Bouton retour (date dernière dose via moins 65)', async function () {
        const page = this.test.page

        await page.goto(
            'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
        )

        const formulaire = await page.waitForSelector(
            '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
        )
        const prefixe = await formulaire.getAttribute('data-nom')

        await cEstParti(page, prefixe)

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await remplirAge(page, 'moins65', prefixe)
        await remplirVaccinationInitiale(page, 'autre', prefixe)
        await remplirSituationMoins65(page, 'comorbidite', prefixe)

        formLegend = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière dose')

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form >> text="Retour"`
        )
        await bouton.click()

        formLegend = await page.waitForSelector(
            `#${prefixe}-situation-moins65-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'Ma situation')

        // On clique sur le bouton retour.
        const bouton2 = await page.waitForSelector(
            `#${prefixe}-situation-moins65-form >> text="Retour"`
        )
        await bouton2.click()

        formLegend = await page.waitForSelector(
            `#${prefixe}-vaccination-initiale-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'Ma vaccination initiale')
    })

    it('Bouton recommencer', async function () {
        const page = this.test.page

        await page.goto(
            'http://localhost:8080/pass-sanitaire-qr-code-voyages.html#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
        )

        const formulaire = await page.waitForSelector(
            '#est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire .formulaire'
        )
        const prefixe = await formulaire.getAttribute('data-nom')

        await cEstParti(page, prefixe)

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await remplirAge(page, 'plus65', prefixe)
        await remplirVaccinationInitiale(page, 'autre', prefixe)

        formLegend = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière dose')

        await remplirDateDerniereDose(page, '2021-06-17', prefixe)

        // On clique sur le bouton pour recommencer.
        const bouton = await page.waitForSelector(
            `#${prefixe}-refaire >> text="Recommencer le questionnaire"`
        )
        await bouton.click()

        // On est revenu au formulaire initial (situation).
        formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')
    })
})
