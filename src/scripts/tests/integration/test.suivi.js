const assert = require('assert')
const playwright = require('playwright')
const http = require('http')
const nodeStatic = require('node-static')

describe('Auto-suivi', function () {
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

    it('remplir le questionnaire de suivi', async () => {
        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('text="Démarrer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Questionnaire 1/8
        {
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
            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label
            label = await page.waitForSelector('#page label[for="symptomes_actuels"]')
            await label.click()
            label = await page.waitForSelector(
                '#page label[for="symptomes_actuels_temperature"]'
            )
            await label.click()
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // La page de Conseils doit contenir le bouton pour effectuer son suivi
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Gérer mon auto-suivi de la maladie"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suiviintroduction')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suiviintroduction' }),
            ])
        }

        // La page d'introduction du suivi comporte un lien direct vers mon suivi
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Démarrer mon suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suividate' }),
            ])
        }

        // La page de date du suivi apparait la première fois
        {
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }

        // La page du suivi des symptômes
        {
            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label
            label = await page.waitForSelector(
                '#page label[for="suivi_symptomes_essoufflement_mieux"]'
            )
            await label.click()
            label = await page.waitForSelector(
                '#page label[for="suivi_symptomes_etat_general_mieux"]'
            )
            await label.click()
            label = await page.waitForSelector(
                '#page label[for="suivi_symptomes_alimentation_hydratation_non"]'
            )
            await label.click()
            label = await page.waitForSelector(
                '#page label[for="suivi_symptomes_etat_psychologique_mieux"]'
            )
            await label.click()
            label = await page.waitForSelector(
                '#page label[for="suivi_symptomes_fievre_non"]'
            )
            await label.click()
            label = await page.waitForSelector(
                '#page label[for="suivi_symptomes_diarrhee_vomissements_non"]'
            )
            await label.click()
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // La page de Conseils doit contenir la phrase de gravité 0
        {
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Poursuivez votre autosuivi à la maison comme entendu avec votre médecin.'
            )
            let bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
        }

        // La page d’Introduction contient maintenant un lien vers mon suivi
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Continuer mon suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suiviintroduction' }),
            ])
        }

        // La page d’introduction du suivi comporte un lien direct
        // vers mes symptômes car on a déjà renseignée la date de début
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Continuer mon suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }
    })
})
