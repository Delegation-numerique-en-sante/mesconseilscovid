import { assert } from 'chai'

async function cEstParti(page, prefixe) {
    const bouton = await page.waitForSelector(
        `#${prefixe}-demarrage-form >> text="C’est parti !"`
    )
    await bouton.click()
}

async function remplirSymptomes(page, reponse, prefixe) {
    const checkbox_label = await page.waitForSelector(
        `#${prefixe}-symptomes-form label[for="${prefixe}_symptomes_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        `#${prefixe}-symptomes-form >> text="Continuer"`
    )
    await bouton.click()
}

async function remplirDepuisQuand(page, reponse, prefixe) {
    const checkbox_label = await page.waitForSelector(
        `#${prefixe}-depuis-quand-form label[for="${prefixe}_depuis_quand_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        `#${prefixe}-depuis-quand-form >> text="Terminer"`
    )
    await bouton.click()
}

async function remplirCasContact(page, reponse, prefixe) {
    const checkbox_label = await page.waitForSelector(
        `#${prefixe}-cas-contact-form label[for="${prefixe}_cas_contact_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        `#${prefixe}-cas-contact-form >> text="Continuer"`
    )
    await bouton.click()
}

async function remplirAutoTest(page, reponse, prefixe) {
    const checkbox_label = await page.waitForSelector(
        `#${prefixe}-auto-test-form label[for="${prefixe}_auto_test_radio_${reponse}"]`
    )
    await checkbox_label.click()

    const bouton = await page.waitForSelector(
        `#${prefixe}-auto-test-form >> text="Terminer"`
    )
    await bouton.click()
}

async function recuperationStatut(page, statut, prefixe) {
    const reponse = await page.waitForSelector(`#${prefixe}-${statut}-reponse`)
    return (await reponse.innerText()).trim()
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
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        const prefixe = 'tests-de-depistage'

        await cEstParti(page, prefixe)

        // Avec des symptômes.
        await remplirSymptomes(page, 'oui', prefixe)
        // De moins de 4 jours.
        await remplirDepuisQuand(page, 'moins_4_jours', prefixe)
        // On propose un test PCR ou antigénique.
        assert.include(
            await recuperationStatut(page, 'symptomes-moins-4-jours', prefixe),
            'faire un test antigénique ou PCR nasopharyngé.'
        )
    })

    it('quel test : symptômes de plus de 4 jours', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        const prefixe = 'tests-de-depistage'

        await cEstParti(page, prefixe)

        // Avec des symptômes.
        await remplirSymptomes(page, 'oui', prefixe)
        // De plus de 4 jours.
        await remplirDepuisQuand(page, 'plus_4_jours', prefixe)
        // On propose un test PCR.
        assert.include(
            await recuperationStatut(page, 'symptomes-plus-4-jours', prefixe),
            'faire un test PCR nasopharyngé.'
        )
    })

    it('quel test : pas de symptômes et cas contact', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        const prefixe = 'tests-de-depistage'

        await cEstParti(page, prefixe)

        // Sans symptômes.
        await remplirSymptomes(page, 'non', prefixe)
        // Avec cas contact.
        await remplirCasContact(page, 'oui', prefixe)
        // On propose un test antigénique immédiat.
        assert.include(
            await recuperationStatut(page, 'pas-symptomes-cas-contact-oui', prefixe),
            'faire un test antigénique si vous venez de l’apprendre.'
        )
    })

    it('quel test : pas de symptômes, pas cas contact et autotest', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        const prefixe = 'tests-de-depistage'

        await cEstParti(page, prefixe)

        // Sans symptômes.
        await remplirSymptomes(page, 'non', prefixe)
        // Sans cas contact.
        await remplirCasContact(page, 'non', prefixe)
        // Avec autotest.
        await remplirAutoTest(page, 'oui', prefixe)
        // On propose un test PCR + isolement.
        assert.include(
            await recuperationStatut(
                page,
                'pas-symptomes-pas-cas-contact-auto-test-oui',
                prefixe
            ),
            'un test PCR nasopharyngé et rester en isolement'
        )
    })

    it('quel test : pas de symptômes, pas cas contact et pas autotest', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        const prefixe = 'tests-de-depistage'

        await cEstParti(page, prefixe)

        // Sans symptômes.
        await remplirSymptomes(page, 'non', prefixe)
        // Sans cas contact.
        await remplirCasContact(page, 'non', prefixe)
        // Sans autotest.
        await remplirAutoTest(page, 'non', prefixe)
        const statut = await recuperationStatut(
            page,
            'pas-symptomes-pas-cas-contact-auto-test-non',
            prefixe
        )
        // On propose différents tests pour le pass sanitaire.
        assert.include(
            statut,
            'un test négatif PCR nasopharyngé, antigénique ou un autotest supervisé'
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

        const prefixe = 'tests-de-depistage'

        await cEstParti(page, prefixe)

        // Formulaire initial (symptômes).
        let formLegend = await page.waitForSelector(
            `#${prefixe}-symptomes-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Avez-vous des symptômes qui peuvent évoquer la Covid ?'
        )

        // On avance vers le formulaire suivant (depuis quand).
        await remplirSymptomes(page, 'oui', prefixe)

        formLegend = await page.waitForSelector(
            `#${prefixe}-depuis-quand-form legend h3`
        )
        assert.equal(
            await formLegend.innerText(),
            'Depuis quand avez-vous des symptômes ?'
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
            'Avez-vous des symptômes qui peuvent évoquer la Covid ?'
        )
    })

    it('quel test : bouton recommencer', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/tests-de-depistage.html')

        const prefixe = 'tests-de-depistage'

        await cEstParti(page, prefixe)

        // On remplit un formulaire jusqu’à l’affichage du statut.
        await remplirSymptomes(page, 'oui', prefixe)
        await remplirDepuisQuand(page, 'moins_4_jours', prefixe)

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
            'Avez-vous des symptômes qui peuvent évoquer la Covid ?'
        )
    })
})
