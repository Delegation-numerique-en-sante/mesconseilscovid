import { assert } from 'chai'

async function cEstParti(page) {
    const bouton = await page.waitForSelector(
        '#tests-de-depistage-demarrage-form >> text="C’est parti !"'
    )
    await bouton.click()
}

async function remplirSymptomes(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#tests-de-depistage-symptomes-form label[for="tests_de_depistage_symptomes_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#tests-de-depistage-symptomes-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirDepuisQuand(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#tests-de-depistage-depuis-quand-form label[for="tests_de_depistage_depuis_quand_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#tests-de-depistage-depuis-quand-form >> text="Terminer"'
    )
    await bouton.click()
}

async function remplirCasContact(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#tests-de-depistage-cas-contact-form label[for="tests_de_depistage_cas_contact_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#tests-de-depistage-cas-contact-form >> text="Continuer"'
    )
    await bouton.click()
}

async function remplirAutoTest(page, reponse) {
    const checkbox_label = await page.waitForSelector(
        `#tests-de-depistage-auto-test-form label[for="tests_de_depistage_auto_test_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        '#tests-de-depistage-auto-test-form >> text="Terminer"'
    )
    await bouton.click()
}

async function recuperationStatut(page, statut) {
    const reponse = await page.waitForSelector(`#tests-de-depistage-${statut}-reponse`)
    return (await reponse.innerText()).trim()
}

describe('Tests', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        assert.equal(
            await page.title(),
            'Les tests de dépistage ? — Mes Conseils Covid — Isolement, tests, vaccins, attestations, contact à risque…'
        )
    })

    it('quel test : symptômes de moins de 4 jours', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        await cEstParti(page)

        // Avec des symptômes.
        await remplirSymptomes(page, 'oui')
        // De moins de 4 jours.
        await remplirDepuisQuand(page, 'moins_4_jours')
        // On propose un test PCR ou antigénique.
        assert.include(
            await recuperationStatut(page, 'symptomes-moins-4-jours'),
            'faire un test antigénique ou PCR nasopharyngé.'
        )
    })

    it('quel test : symptômes de plus de 4 jours', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        await cEstParti(page)

        // Avec des symptômes.
        await remplirSymptomes(page, 'oui')
        // De plus de 4 jours.
        await remplirDepuisQuand(page, 'plus_4_jours')
        // On propose un test PCR.
        assert.include(
            await recuperationStatut(page, 'symptomes-plus-4-jours'),
            'faire un test PCR nasopharyngé.'
        )
    })

    it('quel test : pas de symptômes et cas contact', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        await cEstParti(page)

        // Sans symptômes.
        await remplirSymptomes(page, 'non')
        // Avec cas contact.
        await remplirCasContact(page, 'oui')
        // On propose un test antigénique immédiat.
        assert.include(
            await recuperationStatut(page, 'pas-symptomes-cas-contact-oui'),
            'faire un test antigénique si vous venez de l’apprendre.'
        )
    })

    it('quel test : pas de symptômes, pas cas contact et autotest', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        await cEstParti(page)

        // Sans symptômes.
        await remplirSymptomes(page, 'non')
        // Sans cas contact.
        await remplirCasContact(page, 'non')
        // Avec autotest.
        await remplirAutoTest(page, 'oui')
        // On propose un test PCR + isolement.
        assert.include(
            await recuperationStatut(
                page,
                'pas-symptomes-pas-cas-contact-auto-test-oui'
            ),
            'un test PCR nasopharyngé et rester en isolement'
        )
    })

    it('quel test : pas de symptômes, pas cas contact et pas autotest', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        await cEstParti(page)

        // Sans symptômes.
        await remplirSymptomes(page, 'non')
        // Sans cas contact.
        await remplirCasContact(page, 'non')
        // Sans autotest.
        await remplirAutoTest(page, 'non')
        const statut = await recuperationStatut(
            page,
            'pas-symptomes-pas-cas-contact-auto-test-non'
        )
        // On propose différents tests pour le pass sanitaire.
        assert.include(
            statut,
            'un test négatif PCR nasopharyngé, antigénique ou autotest supervisé'
        )
        // On propose un test PCR ou antigénique pour visiter des personnes vulnérables.
        assert.include(
            statut,
            'personnes vulnérables, un test antigénique ou PCR nasopharyngé'
        )
        // On propose les autotests pour les personnes au contact de personnes fragiles.
        assert.include(statut, 'vous tester régulièrement avec les autotests')
    })

    it('quel test : bouton retour', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        await cEstParti(page)

        // Formulaire initial (symptômes).
        let formLegend = await page.waitForSelector(
            '#tests-de-depistage-symptomes-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous des symptômes qui peuvent évoquer la Covid ?'
        )

        // On avance vers le formulaire suivant (depuis quand).
        await remplirSymptomes(page, 'oui')

        formLegend = await page.waitForSelector(
            '#tests-de-depistage-depuis-quand-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Depuis quand avez-vous des symptômes ?'
        )

        // On clique sur le bouton retour.
        const bouton = await page.waitForSelector(
            '#tests-de-depistage-depuis-quand-form >> text="Retour"'
        )
        await bouton.click()

        // On est revenu au formulaire précédent (symptômes).
        formLegend = await page.waitForSelector(
            '#tests-de-depistage-symptomes-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous des symptômes qui peuvent évoquer la Covid ?'
        )
    })

    it('quel test : bouton recommencer', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        await cEstParti(page)

        // On remplit un formulaire jusqu’à l’affichage du statut.
        await remplirSymptomes(page, 'oui')
        await remplirDepuisQuand(page, 'moins_4_jours')

        // On clique sur le bouton pour recommencer.
        const bouton = await page.waitForSelector(
            '#tests-de-depistage-refaire >> text="Recommencer le questionnaire"'
        )
        await bouton.click()

        // On est revenu au formulaire initial (symptômes).
        const formLegend = await page.waitForSelector(
            '#tests-de-depistage-symptomes-form legend h3'
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous des symptômes qui peuvent évoquer la Covid ?'
        )
    })
})
