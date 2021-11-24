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
        this.prefixe = await formulaire.getAttribute('data-nom')

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

    async remplirSituationMoins65(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-situation-moins65-form label[for="${this.prefixe}_situation_moins65_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-situation-moins65-form >> text="Continuer"`
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
    describe('Éligible au rappel et concerné par le pass sanitaire', function () {
        it('Plus de 65 ans et 17 avril', async function () {
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-04-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
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
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-05-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
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
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
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
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('plus65')
            await questionnaire.remplirVaccinationInitiale('janssen')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
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
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins65')
            await questionnaire.remplirVaccinationInitiale('janssen')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel-et-pass')
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
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirSituationMoins65('comorbidite')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel')
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
            const questionnaire = new Questionnaire(
                this.test.page,
                'pass-sanitaire-qr-code-voyages.html',
                'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
            )
            await questionnaire.cEstParti()
            await questionnaire.remplirAge('moins65')
            await questionnaire.remplirVaccinationInitiale('autre')
            await questionnaire.remplirSituationMoins65('pro_sante')
            await questionnaire.remplirDateDerniereDose('2021-06-17')

            const statut = await questionnaire.recuperationStatut('rappel')
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
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
        )
        await questionnaire.cEstParti()
        await questionnaire.remplirAge('moins65')
        await questionnaire.remplirVaccinationInitiale('autre')
        await questionnaire.remplirSituationMoins65('autre')

        const statut = await questionnaire.recuperationStatut('pas-concerne')
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
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
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
            'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
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
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
        )

        const prefixe = await questionnaire.cEstParti()

        const page = this.test.page

        let formLegend = await page.waitForSelector(`#${prefixe}-age-form legend h3`)
        assert.equal(await formLegend.innerText(), 'Mon âge')

        await questionnaire.remplirAge('moins65')
        await questionnaire.remplirVaccinationInitiale('autre')
        await questionnaire.remplirSituationMoins65('comorbidite')

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
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'est-ce-que-la-dose-de-rappel-dite-3-e-dose-est-obligatoire-pour-le-pass-sanitaire'
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
        assert.equal(await formLegend.innerText(), 'La date de ma dernière dose')

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
