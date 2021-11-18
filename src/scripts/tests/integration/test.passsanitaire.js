import { assert } from 'chai'
import { joursAvant } from '../../utils'

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
        console.log(this.prefixe)

        // On clique sur le bouton pour démarrer
        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-demarrage-form >> text="C’est parti !"`
        )
        await bouton.click()

        return this.prefixe
    }

    async remplirVaccination(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-vaccination-form label[for="${this.prefixe}_vaccination_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-vaccination-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirDepistagePositif(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-depistage-positif-form label[for="${this.prefixe}_depistage_positif_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-depistage-positif-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirGuerisonAvant1reDose(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-guerison-avant-1re-dose-form label[for="${this.prefixe}_guerison_avant_1re_dose_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-guerison-avant-1re-dose-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirTypeVaccin(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-type-vaccin-form label[for="${this.prefixe}_type_vaccin_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-type-vaccin-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirDateDerniereCovid(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-date-derniere-covid-form label[for="${this.prefixe}_date_derniere_covid_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-date-derniere-covid-form >> text="Terminer"`
        )
        await bouton.click()
    }

    async remplirDate1reDoseJanssen(reponse) {
        await this.page.fill(
            `#${this.prefixe}_date_1re_dose_janssen`,
            reponse.toISOString().substring(0, 10)
        )

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-date-1re-dose-janssen-form >> text="Terminer"`
        )
        await bouton.click()
    }

    async remplirDate1reDoseAutres(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-date-1re-dose-autres-form label[for="${this.prefixe}_date_1re_dose_autres_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-date-1re-dose-autres-form >> text="Terminer"`
        )
        await bouton.click()
    }

    async remplirDate2eDose(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-date-2e-dose-form label[for="${this.prefixe}_date_2e_dose_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-date-2e-dose-form >> text="Terminer"`
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

describe('Pass sanitaire', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        assert.equal(
            await page.title(),
            'Pass sanitaire, QR code et voyages, que faut-il savoir ? — Mes Conseils Covid'
        )
    })

    it('pass sanitaire : sans vaccination ni test', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Sans vaccination.
        await questionnaire.remplirVaccination('aucune_dose')
        // Ni test.
        await questionnaire.remplirDepistagePositif('non')
        // On donne les possibilités.
        assert.include(
            await questionnaire.recuperationStatut('non-vaccine'),
            'présenter un test de dépistage négatif'
        )
        assert.include(
            await questionnaire.recuperationStatut('non-vaccine'),
            'vous faire vacciner'
        )
    })

    it('pass sanitaire : sans vaccination avec test de moins de 6 mois', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Sans vaccination.
        await questionnaire.remplirVaccination('aucune_dose')
        // Avec test.
        await questionnaire.remplirDepistagePositif('oui')
        // De moins de 6 mois.
        await questionnaire.remplirDateDerniereCovid('moins_de_6_mois')
        // On donne les possibilités.
        assert.include(
            await questionnaire.recuperationStatut('test-positif-moins-de-6-mois'),
            'présenter votre test de dépistage positif'
        )
        assert.include(
            await questionnaire.recuperationStatut('test-positif-moins-de-6-mois'),
            'présenter un test de dépistage négatif de moins de 72 h'
        )
        assert.include(
            await questionnaire.recuperationStatut('test-positif-moins-de-6-mois'),
            'vous faire vacciner'
        )
    })

    it('pass sanitaire : sans vaccination avec test de plus de 6 mois', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Sans vaccination.
        await questionnaire.remplirVaccination('aucune_dose')
        // Avec test.
        await questionnaire.remplirDepistagePositif('oui')
        // De plus de 6 mois.
        await questionnaire.remplirDateDerniereCovid('plus_de_6_mois')
        // On donne les possibilités.
        assert.include(
            await questionnaire.recuperationStatut('test-positif-plus-de-6-mois'),
            'présenter un test de dépistage négatif de moins de 72 h'
        )
        assert.include(
            await questionnaire.recuperationStatut('test-positif-plus-de-6-mois'),
            'vous faire vacciner'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Janssen, il y a moins de 4 semaines', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Avec vaccination.
        await questionnaire.remplirVaccination('une_dose')
        // Janssen.
        await questionnaire.remplirTypeVaccin('janssen')
        // Moins de 4 semaines.
        await questionnaire.remplirDate1reDoseJanssen(joursAvant(10))
        // On donne les consignes.
        assert.include(
            await questionnaire.recuperationStatut('vaccination-delai-28-jours'),
            'Vous devez attendre 28 jours'
        )
        assert.include(
            await questionnaire.recuperationStatut('vaccination-delai-28-jours'),
            'En attendant, un test de dépistage négatif'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Janssen, il y a plus de 4 semaines', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Avec vaccination.
        await questionnaire.remplirVaccination('une_dose')
        // Janssen.
        await questionnaire.remplirTypeVaccin('janssen')
        // Plus de 4 semaines.
        await questionnaire.remplirDate1reDoseJanssen(joursAvant(30))
        // On donne le statut.
        assert.include(
            await questionnaire.recuperationStatut('vaccination-complete'),
            'Félicitations, votre schéma vaccinal est complet !'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Pfizer, sans guérison', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Avec vaccination.
        await questionnaire.remplirVaccination('une_dose')
        // Janssen.
        await questionnaire.remplirTypeVaccin('pfizer')
        // Sans guérison.
        await questionnaire.remplirGuerisonAvant1reDose('non')
        // On donne le statut.
        assert.include(
            await questionnaire.recuperationStatut('vaccination-incomplete'),
            'Votre schéma vaccinal est incomplet'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Pfizer, avec guérison il y a moins d’une semaine', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Avec vaccination.
        await questionnaire.remplirVaccination('une_dose')
        // Janssen.
        await questionnaire.remplirTypeVaccin('pfizer')
        // Avec guérison.
        await questionnaire.remplirGuerisonAvant1reDose('oui')
        // Moins d’une semaine.
        await questionnaire.remplirDate1reDoseAutres('moins_de_7_jours')
        // On donne les instructions.
        assert.include(
            await questionnaire.recuperationStatut('vaccination-delai-7-jours'),
            'Vous devez attendre 7 jours'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Pfizer, avec guérison il y a plus d’une semaine', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Avec vaccination.
        await questionnaire.remplirVaccination('une_dose')
        // Janssen.
        await questionnaire.remplirTypeVaccin('pfizer')
        // Avec guérison.
        await questionnaire.remplirGuerisonAvant1reDose('oui')
        // Plus d’une semaine.
        await questionnaire.remplirDate1reDoseAutres('7_jours_ou_plus')
        // On donne les instructions.
        assert.include(
            await questionnaire.recuperationStatut('vaccination-complete'),
            'Félicitations, votre schéma vaccinal est complet !'
        )
    })

    it('pass sanitaire : vaccination 2 doses, il y a moins d’une semaine', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Avec vaccination.
        await questionnaire.remplirVaccination('deux_doses')
        // Plus d’une semaine.
        await questionnaire.remplirDate2eDose('moins_de_7_jours')
        // On donne les instructions.
        assert.include(
            await questionnaire.recuperationStatut('vaccination-delai-7-jours'),
            'Vous devez attendre 7 jours'
        )
    })

    it('pass sanitaire : vaccination 2 doses, il y a plus d’une semaine', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        await questionnaire.cEstParti()

        // Avec vaccination.
        await questionnaire.remplirVaccination('deux_doses')
        // Plus d’une semaine.
        await questionnaire.remplirDate2eDose('7_jours_ou_plus')
        // On donne les instructions.
        assert.include(
            await questionnaire.recuperationStatut('vaccination-complete'),
            'Félicitations, votre schéma vaccinal est complet !'
        )
    })

    it('pass sanitaire : bouton retour', async function () {
        const page = this.test.page
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        const prefixe = await questionnaire.cEstParti()

        // Formulaire initial (symptômes).
        let formLegend = await page.waitForSelector(
            `#${prefixe}-vaccination-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous reçu des doses de vaccin ?'
        )

        // On avance vers le formulaire suivant (test positif).
        await questionnaire.remplirVaccination('aucune_dose')

        formLegend = await page.waitForSelector(
            `#${prefixe}-depistage-positif-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous déjà été positif à un test PCR ou antigénique ?'
        )

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            `#${prefixe}-depistage-positif-form >> text="Retour"`
        )
        await bouton.click()

        // On est revenu au formulaire précédent (vaccination).
        formLegend = await page.waitForSelector(
            `#${prefixe}-vaccination-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous reçu des doses de vaccin ?'
        )
    })

    it('pass sanitaire : bouton recommencer', async function () {
        const page = this.test.page
        const questionnaire = new Questionnaire(
            this.test.page,
            'pass-sanitaire-qr-code-voyages.html',
            'quel-justificatif-utiliser-comme-pass-sanitaire-en-france'
        )
        const prefixe = await questionnaire.cEstParti()

        // On remplit un formulaire jusqu’à l’affichage du statut.
        // Sans vaccination.
        await questionnaire.remplirVaccination('aucune_dose')
        // Ni tests.
        await questionnaire.remplirDepistagePositif('non')

        // On clique sur le bouton pour recommencer.
        const bouton = await page.waitForSelector(
            `#${prefixe}-refaire >> text="Recommencer le questionnaire"`
        )
        await bouton.click()

        // On est revenu au formulaire initial (vaccination).
        const formLegend = await page.waitForSelector(
            `#${prefixe}-vaccination-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous reçu des doses de vaccin ?'
        )
    })
})
