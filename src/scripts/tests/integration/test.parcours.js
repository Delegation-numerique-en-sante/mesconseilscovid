const assert = require('assert')

describe('Parcours', function () {
    it('titre de la page', async function () {
        const page = this.test.page

        await page.goto('http://localhost:8080/')
        assert.equal(
            await page.title(),
            'Mes conseils Covid — Des conseils personnalisés pour agir contre le virus'
        )
    })

    it('remplir le questionnaire classique', async function () {
        const page = this.test.page

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
            let bouton = await page.waitForSelector('#page >> text="Terminer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // Conseils
        {
            // On retrouve le département de résidence
            let residence = await page.waitForSelector('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

            // On retrouve l’activité
            let activite = await page.waitForSelector('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous exercez une activité professionnelle et/ou bénévole (modifier)'
            )
            let bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
        }

        // Introduction
        {
            // La page comporte maintenant un lien direct vers mes conseils
            let bouton = await page.waitForSelector('#page >> text="Voir mes conseils"')
            assert.equal(
                await bouton.evaluate(
                    (e) => e.parentElement.parentElement.querySelector('h3').innerText
                ),
                'Moi'
            )
        }
    })

    it('remplir le questionnaire avec symptômes actuels', async function () {
        const page = this.test.page

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

        // Conseils
        {
            // On retrouve le message de porteur éventuel
            let statut = await page.waitForSelector('#page #statut-symptomatique')
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur du COVID-19.'
            )
        }
    })

    it('remplir le questionnaire avec symptômes actuels (gravité majeure)', async function () {
        const page = this.test.page

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
                '#page label[for="symptomes_actuels_souffle"]'
            )
            await label.click()
            let bouton = await page.waitForSelector('#page >> text="Continuer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // Conseils
        {
            // On retrouve le message d’appel du SAMU
            let statut = await page.waitForSelector(
                '#page #statut-symptomatique-urgent'
            )
            assert.equal(
                (await statut.innerText()).trim().startsWith('Appelez le SAMU / 15'),
                true
            )
        }
    })

    it('remplir le questionnaire avec symptômes passés', async function () {
        const page = this.test.page

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
            // Je n’arrive pas à cocher la case directement, alors je clique sur le label
            let label
            label = await page.waitForSelector('#page label[for="symptomes_passes"]')
            await label.click()
            let bouton = await page.waitForSelector('#page >> text="Terminer"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }

        // Conseils
        {
            // On retrouve le message d’isolement
            let statut = await page.waitForSelector('#page #statut-risque-eleve')
            assert.equal(
                (await statut.innerText()).trim(),
                'Il vous est conseillé de rester en isolement.'
            )
        }
    })
})
