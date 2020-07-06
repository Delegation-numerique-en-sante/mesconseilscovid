const assert = require('assert')
const playwright = require('playwright')
const http = require('http')
const nodeStatic = require('node-static')

describe('Scénarios navigateur', function () {
    // Lance un serveur HTTP
    let server
    before(() => {
        let file = new nodeStatic.Server('./dist')
        server = http.createServer(function (request, response) {
            request
                .addListener('end', function () {
                    file.serve(request, response)
                })
                .resume()
        })
        server.listen(8080)
    })
    after(() => {
        server.close()
    })

    // Lance un navigateur « headless »
    let browser
    before(async () => {
        browser = await playwright[process.env.npm_config_browser].launch({
            headless: true,
        })
    })
    after(async () => {
        await browser.close()
    })

    // Chaque test tourne dans un nouvel onglet
    let page
    beforeEach(async () => {
        page = await browser.newPage()
    })
    afterEach(async () => {
        await page.close()
    })

    it('titre de la page', async () => {
        await page.goto('http://localhost:8080/')
        assert.equal(
            await page.title(),
            'Mes conseils Covid — Des conseils personnalisés pour agir contre le virus'
        )
    })

    it('remplir le questionnaire', async () => {
        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Questionnaire 1/8
        {
            let titre = await page.$('#page legend')
            assert.equal(
                (await titre.innerText()).trim(),
                '1/8 - Mon lieu de résidence'
            )
            await page.selectOption('#page select#departement', '80')
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#activitepro' }),
            ])
        }

        // Questionnaire 2/8
        {
            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label
            label = await page.waitForSelector('#page label[for="activite_pro"]')
            await label.click()
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#foyer' }),
            ])
        }

        // Questionnaire 3/8
        {
            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label
            label = await page.waitForSelector('#page label[for="foyer_enfants"]')
            await label.click()
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#caracteristiques' }),
            ])
        }

        // Questionnaire 4/8
        {
            await page.fill('#page #age', '42')
            await page.fill('#page #taille', '165')
            await page.fill('#page #poids', '70')
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#antecedents' }),
            ])
        }

        // Questionnaire 5/8
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Aucun de ces éléments ne correspond à ma situation"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomesactuels' }),
            ])
        }

        // Questionnaire 6/8
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Je n’ai pas de symptômes actuellement"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#symptomespasses' }),
            ])
        }

        // Questionnaire 7/8
        {
            let titre = await page.$('#page legend')
            assert.equal(
                (await titre.innerText()).trim(),
                '7/8 - Mon état ces 14 derniers jours'
            )
            let bouton = await page.waitForSelector(
                '#page >> text="Je n’ai pas eu de symptômes dans les 14 derniers jours"' // &nbsp; après le 14
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#contactarisque' }),
            ])
        }

        // Questionnaire 8/8
        {
            let titre = await page.$('#page legend')
            assert.equal((await titre.innerText()).trim(), '8/8 - Mes contacts récents')
            let bouton = await page.waitForSelector('#page >> text="Terminer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // Conseils
        {
            // On retrouve le département de résidence
            let residence = await page.$('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

            // On retrouve l’activité
            let activite = await page.$('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous exercez une activité professionnelle et/ou bénévole (modifier)'
            )
        }
    })
})
