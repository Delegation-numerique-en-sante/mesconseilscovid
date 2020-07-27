const assert = require('assert')
const helpers = require('./helpers.js')

describe('Auto-suivi', function () {
    it('remplir le questionnaire de suivi pour moi sans consentement médecin', async function () {
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

        // Avec des symptômes actuels on est redirigé vers le consentement médecin
        {
            const consentement = 'non' // non => redirection `conseils`

            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label = await page.waitForSelector(
                `#page label[for="suivi_medecin_${consentement}"]`
            )
            await label.click()

            const text = '"Aller vers mes conseils"'
            const nextPage = 'conseils'

            let bouton = await page.waitForSelector(`#page >> text=${text}`)
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: `**/#${nextPage}` }),
            ])
        }

        // La page de Conseils doit contenir le bouton pour effectuer son suivi
        {
            let bouton = await page.waitForSelector(
                '*css=#page a >> text="Accéder au suivi de ma maladie"'
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
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }

        // La page du suivi des symptômes
        {
            await helpers.remplirSuivi(page, {
                essoufflement: 'mieux',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Poursuivez votre auto-suivi à la maison comme entendu avec votre médecin.'
            )
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page >> text="l’historique de vos symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
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
            await page.waitForSelector('#page h2 >> text="Suivi de la maladie"')

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

    it('remplir le questionnaire de suivi pour moi avec consentement médecin', async function () {
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

        // Avec des symptômes actuels on est redirigé vers le consentement médecin
        {
            const consentement = 'oui' // oui => poursuite suivi

            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label = await page.waitForSelector(
                `#page label[for="suivi_medecin_${consentement}"]`
            )
            await label.click()

            const text = '"Continuer vers mon suivi"'
            const nextPage = 'suividate'

            let bouton = await page.waitForSelector(`#page >> text=${text}`)
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: `**/#${nextPage}` }),
            ])
        }

        // La page de date du suivi apparait la première fois
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }

        // La page du suivi des symptômes
        {
            await helpers.remplirSuivi(page, {
                essoufflement: 'critique',
                etat_general: 'mieux',
                alimentation_hydratation: 'oui',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                toux: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 3
            let gravite = await page.waitForSelector('#page #suivi-gravite-3')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Contactez le 15 ou demandez à un votre proche de le faire pour vous immédiatement.'
            )
        }
    })

    it('remplir le questionnaire de suivi pour un proche sans consentement médecin', async function () {
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
            await page.fill('#page #name', 'Mamie')
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

        // Avec des symptômes actuels on est redirigé vers le consentement médecin
        {
            const consentement = 'non' // non => redirection `conseils`

            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label = await page.waitForSelector(
                `#page label[for="suivi_medecin_${consentement}"]`
            )
            await label.click()

            const text = '"Aller vers ses conseils"'
            const nextPage = 'conseils'

            let bouton = await page.waitForSelector(`#page >> text=${text}`)
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: `**/#${nextPage}` }),
            ])
        }

        // La page de Conseils doit contenir le bouton pour effectuer son suivi
        {
            let bouton = await page.waitForSelector(
                '*css=#page a >> text="Accéder au suivi de sa maladie"'
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
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }

        // La page du suivi des symptômes
        {
            await helpers.remplirSuivi(page, {
                essoufflement: 'mieux',
                etat_general: 'mieux',
                alimentation_hydratation: 'non',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                confusion: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Poursuivez votre auto-suivi à la maison comme entendu avec votre médecin.'
            )
            // un bouton vers l’historique du suivi
            let bouton = await page.waitForSelector(
                '#page >> text="l’historique des symptômes"'
            )
            assert.equal(await bouton.getAttribute('href'), '#suivihistorique')
            // un bouton pour refaire le questionnaire
            bouton = await page.waitForSelector(
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
            await page.waitForSelector('#page h2 >> text="Suivi de la maladie"')

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

    it('remplir le questionnaire de suivi pour un proche avec consentement médecin', async function () {
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
            await page.fill('#page #name', 'Mamie')
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

        // Avec des symptômes actuels on est redirigé vers le consentement médecin
        {
            const consentement = 'oui' // oui => redirection `suividate`

            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label = await page.waitForSelector(
                `#page label[for="suivi_medecin_${consentement}"]`
            )
            await label.click()

            const text = '"Continuer vers son suivi"'
            const nextPage = 'suividate'

            let bouton = await page.waitForSelector(`#page >> text=${text}`)
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: `**/#${nextPage}` }),
            ])
        }

        // La page de date du suivi apparait la première fois
        {
            let label = await page.waitForSelector(
                '#page label[for="suivi_date_aujourdhui"]'
            )
            await label.click()

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#suivisymptomes' }),
            ])
        }

        // La page du suivi des symptômes
        {
            await helpers.remplirSuivi(page, {
                essoufflement: 'critique',
                etat_general: 'mieux',
                alimentation_hydratation: 'oui',
                etat_psychologique: 'mieux',
                fievre: 'non',
                diarrhee_vomissements: 'non',
                confusion: 'non',
            })

            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 3
            let gravite = await page.waitForSelector('#page #suivi-gravite-3')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Contactez le 15 ou demandez à un votre proche de le faire pour vous immédiatement.'
            )
        }
    })
})
