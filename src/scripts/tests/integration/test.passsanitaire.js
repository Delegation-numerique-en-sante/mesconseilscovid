import { assert } from 'chai'
import { joursAvant } from '../../utils'

async function cEstParti(page) {
    const bouton = await page.waitForSelector(
        '#pass-sanitaire-demarrage-form >> text="C’est parti !"'
    )
    await bouton.click()
}

async function remplirVaccination(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#pass-sanitaire-vaccination-form label[for="pass_sanitaire_vaccination_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-vaccination-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirDepistagePositif(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#pass-sanitaire-depistage-positif-form label[for="pass_sanitaire_depistage_positif_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-depistage-positif-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirGuerisonAvant1reDose(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#pass-sanitaire-guerison-avant-1re-dose-form label[for="pass_sanitaire_guerison_avant_1re_dose_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-guerison-avant-1re-dose-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirTypeVaccin(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#pass-sanitaire-type-vaccin-form label[for="pass_sanitaire_type_vaccin_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-type-vaccin-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirDateDerniereCovid(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#pass-sanitaire-date-derniere-covid-form label[for="pass_sanitaire_date_derniere_covid_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-date-derniere-covid-form >> text="Terminer"'
    )
    await bouton.click()
}

async function remplirDate1reDoseJanssen(page, reponse) {
    await page.fill(
        '#pass_sanitaire_date_1re_dose_janssen',
        reponse.toISOString().substring(0, 10)
    )

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-date-1re-dose-janssen-form >> text="Terminer"'
    )
    await bouton.click()
}

async function remplirDate1reDoseAutres(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#pass-sanitaire-date-1re-dose-autres-form label[for="pass_sanitaire_date_1re_dose_autres_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-date-1re-dose-autres-form >> text="Terminer"'
    )
    await bouton.click()
}

async function remplirDate2eDose(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#pass-sanitaire-date-2e-dose-form label[for="pass_sanitaire_date_2e_dose_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#pass-sanitaire-date-2e-dose-form >> text="Terminer"'
    )
    await bouton.click()
}

async function recuperationStatut(page, statut) {
    const reponse = await page.waitForSelector(`#pass-sanitaire-${statut}-reponse`)
    return (await reponse.innerText()).trim()
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
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Sans vaccination.
        await remplirVaccination(page, 'aucune_dose')
        // Ni test.
        await remplirDepistagePositif(page, 'non')
        // On donne les possibilités.
        assert.include(
            await recuperationStatut(page, 'non-vaccine'),
            'présenter un test de dépistage négatif'
        )
        assert.include(
            await recuperationStatut(page, 'non-vaccine'),
            'vous faire vacciner'
        )
    })

    it('pass sanitaire : sans vaccination avec test de moins de 6 mois', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Sans vaccination.
        await remplirVaccination(page, 'aucune_dose')
        // Avec test.
        await remplirDepistagePositif(page, 'oui')
        // De moins de 6 mois.
        await remplirDateDerniereCovid(page, 'moins_de_6_mois')
        // On donne les possibilités.
        assert.include(
            await recuperationStatut(page, 'test-positif-moins-de-6-mois'),
            'présenter votre test de dépistage positif'
        )
        assert.include(
            await recuperationStatut(page, 'test-positif-moins-de-6-mois'),
            'présenter un test de dépistage négatif de moins de 72 h'
        )
        assert.include(
            await recuperationStatut(page, 'test-positif-moins-de-6-mois'),
            'vous faire vacciner'
        )
    })

    it('pass sanitaire : sans vaccination avec test de plus de 6 mois', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Sans vaccination.
        await remplirVaccination(page, 'aucune_dose')
        // Avec test.
        await remplirDepistagePositif(page, 'oui')
        // De plus de 6 mois.
        await remplirDateDerniereCovid(page, 'plus_de_6_mois')
        // On donne les possibilités.
        assert.include(
            await recuperationStatut(page, 'test-positif-plus-de-6-mois'),
            'présenter un test de dépistage négatif de moins de 72 h'
        )
        assert.include(
            await recuperationStatut(page, 'test-positif-plus-de-6-mois'),
            'vous faire vacciner'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Janssen, il y a moins de 4 semaines', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Avec vaccination.
        await remplirVaccination(page, 'une_dose')
        // Janssen.
        await remplirTypeVaccin(page, 'janssen')
        // Moins de 4 semaines.
        await remplirDate1reDoseJanssen(page, joursAvant(10))
        // On donne les consignes.
        assert.include(
            await recuperationStatut(page, 'vaccination-delai-28-jours'),
            'Vous devez attendre 28 jours'
        )
        assert.include(
            await recuperationStatut(page, 'vaccination-delai-28-jours'),
            'En attendant, un test de dépistage négatif'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Janssen, il y a plus de 4 semaines', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Avec vaccination.
        await remplirVaccination(page, 'une_dose')
        // Janssen.
        await remplirTypeVaccin(page, 'janssen')
        // Plus de 4 semaines.
        await remplirDate1reDoseJanssen(page, joursAvant(30))
        // On donne le statut.
        assert.include(
            await recuperationStatut(page, 'vaccination-complete'),
            'Félicitations, votre schéma vaccinal est complet !'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Pfizer, sans guérison', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Avec vaccination.
        await remplirVaccination(page, 'une_dose')
        // Janssen.
        await remplirTypeVaccin(page, 'pfizer')
        // Sans guérison.
        await remplirGuerisonAvant1reDose(page, 'non')
        // On donne le statut.
        assert.include(
            await recuperationStatut(page, 'vaccination-incomplete'),
            'Votre schéma vaccinal est incomplet'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Pfizer, avec guérison il y a moins d’une semaine', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Avec vaccination.
        await remplirVaccination(page, 'une_dose')
        // Janssen.
        await remplirTypeVaccin(page, 'pfizer')
        // Avec guérison.
        await remplirGuerisonAvant1reDose(page, 'oui')
        // Moins d’une semaine.
        await remplirDate1reDoseAutres(page, 'moins_de_7_jours')
        // On donne les instructions.
        assert.include(
            await recuperationStatut(page, 'vaccination-delai-7-jours'),
            'Vous devez attendre 7 jours'
        )
    })

    it('pass sanitaire : vaccination 1 dose, Pfizer, avec guérison il y a plus d’une semaine', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Avec vaccination.
        await remplirVaccination(page, 'une_dose')
        // Janssen.
        await remplirTypeVaccin(page, 'pfizer')
        // Avec guérison.
        await remplirGuerisonAvant1reDose(page, 'oui')
        // Plus d’une semaine.
        await remplirDate1reDoseAutres(page, '7_jours_ou_plus')
        // On donne les instructions.
        assert.include(
            await recuperationStatut(page, 'vaccination-complete'),
            'Félicitations, votre schéma vaccinal est complet !'
        )
    })

    it('pass sanitaire : vaccination 2 doses, il y a moins d’une semaine', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Avec vaccination.
        await remplirVaccination(page, 'deux_doses')
        // Plus d’une semaine.
        await remplirDate2eDose(page, 'moins_de_7_jours')
        // On donne les instructions.
        assert.include(
            await recuperationStatut(page, 'vaccination-delai-7-jours'),
            'Vous devez attendre 7 jours'
        )
    })

    it('pass sanitaire : vaccination 2 doses, il y a plus d’une semaine', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Avec vaccination.
        await remplirVaccination(page, 'deux_doses')
        // Plus d’une semaine.
        await remplirDate2eDose(page, '7_jours_ou_plus')
        // On donne les instructions.
        assert.include(
            await recuperationStatut(page, 'vaccination-complete'),
            'Félicitations, votre schéma vaccinal est complet !'
        )
    })

    it('pass sanitaire : bouton retour', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // Formulaire initial (symptômes).
        let formLegend = await page.waitForSelector(
            '#pass-sanitaire-vaccination-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous reçu des doses de vaccin ?'
        )

        // On avance vers le formulaire suivant (test positif).
        await remplirVaccination(page, 'aucune_dose')

        formLegend = await page.waitForSelector(
            '#pass-sanitaire-depistage-positif-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous déjà été positif à un test PCR ou antigénique ?'
        )

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            '#pass-sanitaire-depistage-positif-form >> text="Retour"'
        )
        await bouton.click()

        // On est revenu au formulaire précédent (vaccination).
        formLegend = await page.waitForSelector(
            '#pass-sanitaire-vaccination-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous reçu des doses de vaccin ?'
        )
    })

    it('pass sanitaire : bouton recommencer', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/pass-sanitaire-qr-code-voyages.html')

        await cEstParti(page)

        // On remplit un formulaire jusqu’à l’affichage du statut.
        // Sans vaccination.
        await remplirVaccination(page, 'aucune_dose')
        // Ni tests.
        await remplirDepistagePositif(page, 'non')

        // On clique sur le bouton pour recommencer.
        const bouton = await page.waitForSelector(
            '#pass-sanitaire-refaire >> text="Recommencer le questionnaire"'
        )
        await bouton.click()

        // On est revenu au formulaire initial (vaccination).
        const formLegend = await page.waitForSelector(
            '#pass-sanitaire-vaccination-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous reçu des doses de vaccin ?'
        )
    })
})
