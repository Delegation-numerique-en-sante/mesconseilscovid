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
            `#${this.prefixe}-demarrage-form[data-ready=true] >> text="C’est parti !"`
        )
        await bouton.click()

        return this.prefixe
    }

    async remplirSymptomes(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-symptomes-form label[for="${this.prefixe}_symptomes_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-symptomes-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirDepuisQuand(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-depuis-quand-form label[for="${this.prefixe}_depuis_quand_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-depuis-quand-form >> text="Terminer"`
        )
        await bouton.click()
    }

    async remplirCasContact(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-cas-contact-form label[for="${this.prefixe}_cas_contact_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-cas-contact-form >> text="Continuer"`
        )
        await bouton.click()
    }

    async remplirAutoTest(reponse) {
        const checkbox_label = await this.page.waitForSelector(
            `#${this.prefixe}-auto-test-form label[for="${this.prefixe}_auto_test_radio_${reponse}"]`
        )
        await checkbox_label.click()

        const bouton = await this.page.waitForSelector(
            `#${this.prefixe}-auto-test-form >> text="Terminer"`
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

describe('Tests', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        assert.equal(
            await page.title(),
            'Je souhaite faire un test de dépistage — Mes Conseils Covid'
        )
    })

    it('quel test : symptômes de moins de 4 jours', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'tests-de-depistage.html',
            'quel-est-le-test-adapte-a-ma-situation'
        )
        await questionnaire.cEstParti()

        // Avec des symptômes.
        await questionnaire.remplirSymptomes('oui')
        // De moins de 4 jours.
        await questionnaire.remplirDepuisQuand('moins_4_jours')
        // On propose un test PCR ou antigénique.
        assert.include(
            await questionnaire.recuperationStatut('symptomes-moins-4-jours'),
            'faire un test PCR nasopharyngé ou un test antigénique.'
        )
    })

    it('quel test : symptômes de plus de 4 jours', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'tests-de-depistage.html',
            'quel-est-le-test-adapte-a-ma-situation'
        )
        await questionnaire.cEstParti()

        // Avec des symptômes.
        await questionnaire.remplirSymptomes('oui')
        // De plus de 4 jours.
        await questionnaire.remplirDepuisQuand('plus_4_jours')
        // On propose un test PCR.
        assert.include(
            await questionnaire.recuperationStatut('symptomes-plus-4-jours'),
            'faire un test PCR nasopharyngé.'
        )
    })

    it('quel test : pas de symptômes et cas contact', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'tests-de-depistage.html',
            'quel-est-le-test-adapte-a-ma-situation'
        )
        await questionnaire.cEstParti()

        // Sans symptômes.
        await questionnaire.remplirSymptomes('non')
        // Avec cas contact.
        await questionnaire.remplirCasContact('oui')
        // On propose un test antigénique immédiat.
        assert.include(
            await questionnaire.recuperationStatut('pas-symptomes-cas-contact-oui'),
            'faire un test PCR, un test antigénique ou un autotest, deux jours après'
        )
    })

    it('quel test : pas de symptômes, pas cas contact et autotest', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'tests-de-depistage.html',
            'quel-est-le-test-adapte-a-ma-situation'
        )
        await questionnaire.cEstParti()

        // Sans symptômes.
        await questionnaire.remplirSymptomes('non')
        // Sans cas contact.
        await questionnaire.remplirCasContact('non')
        // Avec autotest.
        await questionnaire.remplirAutoTest('oui')
        // On propose un test PCR + isolement.
        assert.include(
            await questionnaire.recuperationStatut(
                'pas-symptomes-pas-cas-contact-auto-test-oui'
            ),
            'un test PCR nasopharyngé et rester en isolement'
        )
    })

    it('quel test : pas de symptômes, pas cas contact et pas autotest', async function () {
        const questionnaire = new Questionnaire(
            this.test.page,
            'tests-de-depistage.html',
            'quel-est-le-test-adapte-a-ma-situation'
        )
        await questionnaire.cEstParti()

        // Sans symptômes.
        await questionnaire.remplirSymptomes('non')
        // Sans cas contact.
        await questionnaire.remplirCasContact('non')
        // Sans autotest.
        await questionnaire.remplirAutoTest('non')
        const statut = await questionnaire.recuperationStatut(
            'pas-symptomes-pas-cas-contact-auto-test-non'
        )
        // On propose un test PCR ou antigénique pour le passe sanitaire.
        assert.include(
            statut,
            'résultat négatif de moins de 24\u202fh d’un test PCR nasopharyngé ou d’un test antigénique'
        )
        // On propose un test PCR ou antigénique pour visiter des personnes vulnérables.
        assert.include(
            statut,
            'personnes vulnérables, un test PCR nasopharyngé ou un test antigénique'
        )
        // On propose les autotests pour les personnes au contact de personnes fragiles.
        assert.include(statut, 'vous tester régulièrement avec les autotests')
    })

    it('quel test : bouton retour', async function () {
        const page = this.test.page
        const questionnaire = new Questionnaire(
            this.test.page,
            'tests-de-depistage.html',
            'quel-est-le-test-adapte-a-ma-situation'
        )
        const prefixe = await questionnaire.cEstParti()

        // Formulaire initial (symptômes).
        let formLegend = await page.waitForSelector(
            `#${prefixe}-symptomes-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous des symptômes qui peuvent évoquer la Covid\u202f?'
        )

        // On avance vers le formulaire suivant (depuis quand).
        await questionnaire.remplirSymptomes('oui')

        formLegend = await page.waitForSelector(
            `#${prefixe}-depuis-quand-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Depuis quand avez-vous des symptômes\u202f?'
        )

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            `#${prefixe}-depuis-quand-form >> text="Retour"`
        )
        await bouton.click()

        // On est revenu au formulaire précédent (symptômes).
        formLegend = await page.waitForSelector(`#${prefixe}-symptomes-form legend h3`)
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous des symptômes qui peuvent évoquer la Covid\u202f?'
        )
    })

    it('quel test : bouton recommencer', async function () {
        const page = this.test.page
        const questionnaire = new Questionnaire(
            this.test.page,
            'tests-de-depistage.html',
            'quel-est-le-test-adapte-a-ma-situation'
        )
        const prefixe = await questionnaire.cEstParti()

        // On remplit un formulaire jusqu’à l’affichage du statut.
        await questionnaire.remplirSymptomes('oui')
        await questionnaire.remplirDepuisQuand('moins_4_jours')

        // On clique sur le bouton pour recommencer.
        const bouton = await page.waitForSelector(
            `#${prefixe}-refaire >> text="Recommencer le questionnaire"`
        )
        await bouton.click()

        // On est revenu au formulaire initial (symptômes).
        const formLegend = await page.waitForSelector(
            `#${prefixe}-symptomes-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous des symptômes qui peuvent évoquer la Covid\u202f?'
        )
    })
})
