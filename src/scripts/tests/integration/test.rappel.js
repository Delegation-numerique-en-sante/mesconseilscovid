import { assert } from 'chai'

class Questionnaire {
    constructor(page, path, slugQuestion) {
        this.page = page
        this.path = path
        this.slugQuestion = slugQuestion
        this.prefixe = null
    }

    async cEstParti() {
        // On va directement à la question
        await this.page.goto(`http://localhost:8080/${this.path}#${this.slugQuestion}`)

        // On récupère le préfixe du formulaire dans la question
        const formulaire = await this.page.waitForSelector(
            `#${this.slugQuestion} .formulaire`
        )
        this.prefixe = await formulaire.getAttribute('data-prefixe')

        // On clique sur le bouton pour démarrer
        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-demarrage-form >> text="C’est parti !"`
        )
        await bouton.click()

        return this.prefixe
    }

    async remplirAge(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-age-form label[for="${this.prefixe}_age_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-age-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirVaccinationInitiale(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-vaccination-initiale-form label[for="${this.prefixe}_vaccination_initiale_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-vaccination-initiale-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirSituationMoins18(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-situation-moins18-form label[for="${this.prefixe}_situation_moins18_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-situation-moins18-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirDateDerniereDose(dateIso) {
        await this.page.fill(`#${this.prefixe}_date_derniere_dose`, dateIso)

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-date-derniere-dose-form >> text="Terminer"`
        )
        await bouton.click()
    }

    async recuperationStatut(statut) {
        const reponse = await this.page.waitForSelector(
            `#${this.prefixe}-${statut}-reponse`
        )
        return (await reponse.innerText()).trim()
    }
}

describe('Mini-questionnaire dose de rappel', function () {
    describe('Éligible au rappel et pass sanitaire au 15 décembre', function () {
        it('Plus de 65 ans et 17 avril', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-04-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 avril 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 septembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 15 décembre 2021.'
            )
        })

        it('Plus de 65 ans et 17 mai', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-05-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 mai 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 octobre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 17 décembre 2021.'
            )
        })

        it('Plus de 65 ans et 17 juin', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 juin 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 novembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 17 janvier 2022.'
            )
        })

        it('Plus de 65 ans et 17 juillet', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-07-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 juillet 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 décembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 16 février 2022.'
            )
        })

        it('Janssen, plus de 65 ans et 17 juin', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('janssen')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez 65 ans ou plus')
            assert.include(statut, 'avez été vacciné(e) avec le vaccin Janssen')
            assert.include(statut, 'Votre dernière injection date du 17 juin 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 1 septembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 15 décembre 2021.'
            )
        })

        it('Janssen, entre 18 et 65 ans et 17 juin', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins65')
            await questionnaire.remplirVaccinationInitiale('janssen')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez entre 18 et 64 ans')
            assert.include(statut, 'avez été vacciné(e) avec le vaccin Janssen')
            assert.include(statut, 'Votre dernière injection date du 17 juin 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 1 septembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 15 décembre 2021.'
            )
        })
    })

    describe('Éligible au rappel et pass sanitaire au 15 janvier', function () {
        it('18 à 65 ans, 17 mai', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-05-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez entre 18 et 64 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 mai 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 27 novembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 15 janvier 2022.'
            )
        })
        it('18 à 65 ans, 17 juin', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez entre 18 et 64 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 juin 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 27 novembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 17 janvier 2022.'
            )
        })
        it('18 à 65 ans, 17 juillet', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-07-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
            assert.include(statut, 'Vous avez entre 18 et 64 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 juillet 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 décembre 2021.'
            )
            assert.include(
                statut,
                'En l’absence de rappel, votre pass sanitaire actuel ne sera plus valide à partir du 16 février 2022.'
            )
        })
    })

    describe('Éligible au rappel mais pas concerné pour le pass sanitaire', function () {
        it('Moins de 18 ans et immunodéprimé(e), 17 mai', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins18')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirSituationMoins18('immunodeprimee')
            await questionnaire.remplirDateDerniereDose('2021-05-17')

            const statut = await questionnaire.recuperationStatut('rappel')
            assert.include(statut, 'Vous avez moins de 18 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 mai 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 octobre 2021.'
            )
            assert.include(
                statut,
                'Vous ne serez pas concerné(e) par la désactivation du pass sanitaire, qui restera valable au delà du 15 décembre 2021.'
            )
        })
        it('Moins de 18 ans et immunodéprimé(e), 17 juin', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins18')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirSituationMoins18('immunodeprimee')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel')
            assert.include(statut, 'Vous avez moins de 18 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 juin 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 novembre 2021.'
            )
            assert.include(
                statut,
                'Vous ne serez pas concerné(e) par la désactivation du pass sanitaire, qui restera valable au delà du 15 décembre 2021.'
            )
        })
        it('Moins de 18 ans et comorbidité, 17 juin', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins18')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirSituationMoins18('comorbidite')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel')
            assert.include(statut, 'Vous avez moins de 18 ans')
            assert.include(statut, 'avec le vaccin Pfizer, Moderna ou AstraZeneca')
            assert.include(statut, 'Votre dernière injection date du 17 juin 2021.')
            assert.include(
                statut,
                'Vous pourrez recevoir votre dose de rappel à partir du 17 novembre 2021.'
            )
            assert.include(
                statut,
                'Vous ne serez pas concerné(e) par la désactivation du pass sanitaire, qui restera valable au delà du 15 décembre 2021.'
            )
        })
    })

    it('Bouton retour (situation)', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
        )

        const prefixe = await questionnaire.cEstParti()

        const page = this.test.page

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await questionnaire.remplirAge('plus65')

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
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
        )

        const prefixe = await questionnaire.cEstParti()

        const page = this.test.page

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await questionnaire.remplirAge('plus65')
        await questionnaire.remplirVaccinationInitiale('autre')

        formLegend = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière injection')

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

    it('Bouton retour (date dernière dose via moins 18)', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
        )

        const prefixe = await questionnaire.cEstParti()

        const page = this.test.page

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await questionnaire.remplirAge('moins18')
        await questionnaire.remplirVaccinationInitiale('autre')
        await questionnaire.remplirSituationMoins18('comorbidite')

        formLegend = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière injection')

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form >> text="Retour"`
        )
        await bouton.click()

        formLegend = await page.waitForSelector(
            `#${prefixe}-situation-moins18-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'Ma situation')

        // On clique sur le bouton retour.
        const bouton2 = await page.waitForSelector(
            `#${prefixe}-situation-moins18-form >> text="Retour"`
        )
        await bouton2.click()

        formLegend = await page.waitForSelector(
            `#${prefixe}-vaccination-initiale-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'Ma vaccination initiale')
    })

    it('Bouton recommencer', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-sanitaire'
        )

        const prefixe = await questionnaire.cEstParti()

        const page = this.test.page

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await questionnaire.remplirAge('plus65')
        await questionnaire.remplirVaccinationInitiale('autre')

        formLegend = await page.waitForSelector(
            `#${prefixe}-date-derniere-dose-form legend h3`
        )
        assert.equal(await formLegend.innerText(), 'La date de ma dernière injection')

        await questionnaire.remplirDateDerniereDose('2021-06-17')

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
