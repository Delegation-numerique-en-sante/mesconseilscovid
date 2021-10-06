import { assert } from 'chai'

async function remplirDepartement(page, departement) {
    await page.selectOption('select#departement', departement)

    const bouton = await page.waitForSelector(
        '#masque-obligatoire-form >> text="Vérifier"'
    )
    await bouton.click()
}

async function recuperationReponse(page, statut) {
    const reponse = await page.waitForSelector(`#js-masque-${statut}`)
    return (await reponse.innerText()).trim()
}

describe('Enfants', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')

        assert.equal(
            await page.title(),
            'Conseils pour les mineurs : vaccination et scolarité — Mes Conseils Covid'
        )
    })

    it('département avec masque', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')

        const summary = await page.waitForSelector(
            'text="Mesures sanitaires à l’école, au collège et au lycée"'
        )
        summary.click()
        const subSummary = await page.waitForSelector(
            'text="Est-ce que mon enfant doit porter le masque ?"'
        )
        subSummary.click()

        await remplirDepartement(page, '01')

        assert.include(
            await recuperationReponse(page, 'obligatoire'),
            'Dans ce département, le masque est obligatoire à l’école primaire.'
        )
    })

    it('département sans masque au 4 octobre', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')

        const summary = await page.waitForSelector(
            'text="Mesures sanitaires à l’école, au collège et au lycée"'
        )
        summary.click()
        const subSummary = await page.waitForSelector(
            'text="Est-ce que mon enfant doit porter le masque ?"'
        )
        subSummary.click()

        await remplirDepartement(page, '02')

        assert.include(
            await recuperationReponse(page, 'non-obligatoire'),
            'Dans ce département, le masque n’est pas obligatoire à l’école primaire.'
        )
    })

    it('département sans masque au 11 octobre', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')

        const summary = await page.waitForSelector(
            'text="Mesures sanitaires à l’école, au collège et au lycée"'
        )
        summary.click()

        await remplirDepartement(page, '35')

        assert.include(
            await recuperationReponse(page, 'non-obligatoire'),
            'Dans ce département, le masque n’est pas obligatoire à l’école primaire.'
        )
    })
})
