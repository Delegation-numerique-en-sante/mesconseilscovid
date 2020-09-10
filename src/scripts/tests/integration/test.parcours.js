import { assert } from 'chai'
import { remplirQuestionnaire } from './helpers.js'

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

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            test: false,
        })

        // Conseils
        {
            // On rend la localisation visible
            await page.click('#page #conseils-departement h3')

            // On retrouve le département de résidence
            let residence = await page.waitForSelector('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

            // On rend l’activité visible
            await page.click('#page #conseils-activite h3')

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

    it('remplir le questionnaire classique puis médecine du travail', async function () {
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

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            test: false,
        })

        // Conseils
        {
            // On rend l’activité pro visible
            await page.click('#page #conseils-activite h3')

            // On peut aller vers la médecine du travail
            let link = await page.waitForSelector(
                '#page >> text="Conseils pour la médecine du travail"'
            )
            await Promise.all([
                link.click(),
                page.waitForNavigation({ url: '**/#medecinedutravail' }),
            ])
        }

        // Médecine du travail
        {
            // La page comporte un lien direct de retour vers mes conseils
            let link = await page.waitForSelector(
                '#page >> text="Retourner à mes conseils"'
            )
            await Promise.all([
                link.click(),
                page.waitForNavigation({ url: '**/#conseils' }),
            ])
        }
    })

    it('remplir le questionnaire avec département autre', async function () {
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

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            departement: '00',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            test: false,
        })

        // Conseils
        {
            // On rend l’activité visible
            await page.click('#page #conseils-activite h3')

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

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: ['temperature'],
            symptomesPasses: false,
            contactARisque: [],
            test: false,
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

        // Conseils
        {
            // On retrouve le message de porteur éventuel
            let statut = await page.waitForSelector('#page #statut-symptomatique')
            assert.equal(
                (await statut.innerText()).trim(),
                'Vous êtes peut-être porteur du Covid-19.'
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

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: ['souffle'],
            contactARisque: [],
            test: false,
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

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
            symptomesActuels: [],
            symptomesPasses: true,
            contactARisque: [],
            test: false,
        })

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

    it('remplir le questionnaire avec pédiatrie', async function () {
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

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            departement: '80',
            enfants: true,
            age: '12',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Pédiatrie
        {
            // On retrouve le titre explicite
            let titre = await page.waitForSelector('#page h2')
            assert.equal(await titre.innerText(), 'Conseils pour les moins de 15 ans')

            // On retrouve le bouton pour repartir vers le questionnaire
            let button = await page.waitForSelector('#page #js-profil-empty a')
            assert.equal((await button.innerText()).trim(), 'Démarrer le questionnaire')
            assert.equal(await button.getAttribute('href'), '#residence')
        }
    })

    it('on peut accéder aux CGU depuis l’accueil', async function () {
        const page = this.test.page

        // On est redirigé vers l’introduction
        await Promise.all([
            page.goto('http://localhost:8080/'),
            page.waitForNavigation({ url: '**/#introduction' }),
        ])

        // On va vers la page de CGU
        {
            let bouton = await page.waitForSelector('text="Conditions d’utilisation"')
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#conditionsutilisation' }),
            ])
        }

        // Conditions d’utilisation
        {
            // On retrouve le bouton pour repartir vers le questionnaire
            let button = await page.waitForSelector('#page #js-profil-empty a')
            assert.equal((await button.innerText()).trim(), 'Démarrer le questionnaire')
            assert.equal(await button.getAttribute('href'), '#residence')

            // On retrouve le titre explicite
            let titre = await page.waitForSelector('#page h2')
            assert.equal(await titre.innerText(), 'Conditions d’utilisation')
        }
    })
})
