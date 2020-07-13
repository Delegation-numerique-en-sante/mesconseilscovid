const assert = require('assert')
const helpers = require('./helpers.js')

describe('Auto-suivi', function () {
    it('remplir le questionnaire de suivi pour moi', async function () {
        const page = this.test.page

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

        // Remplir le questionnaire
        await helpers.remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: ['temperature'],
        })

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

    it('remplir le questionnaire de suivi pour un proche', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // Page d’accueil
        {
            let bouton = await page.waitForSelector('.js-profil-new >> text="Démarrer"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Pour un proche'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#nom' }),
            ])
        }

        // Saisie nom
        {
            await page.fill('#page #nom', 'Mamie')
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Remplir le questionnaire
        await helpers.remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: ['temperature'],
        })

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
                '#page >> text="Démarrer son suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
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
                '#page label[for="suivi_symptomes_confusion_non"]'
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

        // La page d’Introduction contient maintenant un lien vers son suivi
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Continuer son suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suiviintroduction' }),
            ])
        }

        // La page d’introduction du suivi comporte un lien direct
        // vers ses symptômes car on a déjà renseignée la date de début
        {
            let bouton = await page.waitForSelector(
                '#page >> text="Continuer son suivi"'
            )
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Mamie'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }
    })
})
