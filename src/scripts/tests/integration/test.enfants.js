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

        await remplirDepartement(page, '01')

        assert.include(
            await recuperationReponse(page, 'obligatoire'),
            'Le masque est obligatoire dans ce département à l’école, au collège ou au lycée.'
        )
    })

    it('département avec masque', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/conseils-pour-les-enfants.html')

        const summary = await page.waitForSelector(
            'text="Mesures sanitaires à l’école, au collège et au lycée"'
        )
        summary.click()

        await remplirDepartement(page, '02')

        assert.include(
            await recuperationReponse(page, 'non-obligatoire'),
            'Le masque n’est pas obligatoire dans ce département à l’école, au collège ou au lycée.'
        )
    })
})
