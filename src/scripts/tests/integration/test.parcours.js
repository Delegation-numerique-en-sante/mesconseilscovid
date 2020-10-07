import { assert } from 'chai'
import {
    remplirQuestionnaire,
    remplirDepartement,
    remplirFoyer,
    remplirAntecedents,
    remplirCaracteristiques,
    remplirActivite,
    remplirSuivi,
    waitForPlausibleTrackingEvent,
} from './helpers.js'

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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        await waitForPlausibleTrackingEvent(page, 'Questionnaire commencé:depistage')

        // Conseils
        {
            // On rend la localisation visible
            await page.click('#page #conseils-vie-quotidienne h3')

            // On retrouve le département de résidence
            let residence = await page.waitForSelector('#page #nom-departement')
            assert.equal(await residence.innerText(), 'Somme')

            // On rend l’activité visible
            await page.click('#page #conseils-activite h3')

            // On retrouve l’activité
            let activite = await page.waitForSelector('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous travaillez et/ou êtes bénévole (modifier)'
            )

            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')

            // On retourne à l'intro
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

    it('remplir le questionnaire classique puis santé au travail', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Conseils
        {
            // On rend l’activité pro visible
            await page.click('#page #conseils-activite h3')

            // On peut aller vers la médecine du travail
            let link = await page.waitForSelector('#page a >> text="santé au travail"')
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '00',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Conseils
        {
            // On rend l’activité visible
            await page.click('#page #conseils-activite h3')

            // On retrouve l’activité
            let activite = await page.waitForSelector('#page #reponse-activite-pro')
            assert.equal(
                (await activite.innerText()).trim(),
                'Vous travaillez et/ou êtes bénévole (modifier)'
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

    it('remplir le questionnaire avec dépistage positif', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: true,
            depistageResultat: 'positif',
        })

        // On est redirigé vers la date de suivi (parcours suivi)
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
            await remplirSuivi(page, {
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
                waitForPlausibleTrackingEvent(page, 'pageview:residence'),
            ])
        }

        // Remplir la suite du questionnaire
        {
            const choix = {
                departement: '00',
                activitePro: true,
                enfants: true,
                age: '42',
                taille: '165',
                poids: '70',
                grossesse: false,
            }
            await remplirDepartement(page, choix.departement)
            await remplirFoyer(page, choix.enfants)
            await remplirAntecedents(page)
            await remplirCaracteristiques(page, choix.age, choix.taille, choix.poids)
            await remplirActivite(page, choix.activitePro)
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Poursuivez votre auto-suivi à la maison.'
            )
        }
    })

    it('remplir le questionnaire avec dépistage positif mais asymptômatique', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: true,
            depistageResultat: 'positif',
        })

        // On est redirigé vers la date de suivi (parcours suivi)
        // puis directement vers la résidence sans passer par les symptômes
        {
            let label = await page.waitForSelector('#page label[for="suivi_date"]')
            await label.click()

            let bouton = await page.waitForSelector(
                '#page >> text="Je n’ai pas de symptômes"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#residence' }),
            ])
        }

        // Remplir la suite du questionnaire
        {
            const choix = {
                departement: '00',
                activitePro: true,
                enfants: true,
                age: '42',
                taille: '165',
                poids: '70',
                grossesse: false,
            }
            await remplirDepartement(page, choix.departement)
            await remplirFoyer(page, choix.enfants)
            await remplirAntecedents(page)
            await remplirCaracteristiques(page, choix.age, choix.taille, choix.poids)
            await remplirActivite(page, choix.activitePro)
        }

        // La page de Conseils doit contenir :
        {
            // On retrouve le statut attendu
            let statut = await page.waitForSelector('#page #conseils-statut')
            assert.include(
                (await statut.innerText()).trim(),
                'Vous êtes porteur de la Covid sans symptômes, ' +
                    'il est important de vous isoler'
            )
        }
    })

    it('remplir le questionnaire avec dépistage en attente', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: true,
            depistageResultat: 'en_attente',
        })

        // On est redirigé vers la date de suivi (parcours suivi)
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
            await remplirSuivi(page, {
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
                waitForPlausibleTrackingEvent(page, 'pageview:residence'),
            ])
        }

        // Remplir la suite du questionnaire
        {
            const choix = {
                departement: '00',
                activitePro: true,
                enfants: true,
                age: '42',
                taille: '165',
                poids: '70',
                grossesse: false,
            }
            await remplirDepartement(page, choix.departement)
            await remplirFoyer(page, choix.enfants)
            await remplirAntecedents(page)
            await remplirCaracteristiques(page, choix.age, choix.taille, choix.poids)
            await remplirActivite(page, choix.activitePro)
        }

        // La page de Conseils doit contenir :
        {
            // la phrase de gravité 0
            let gravite = await page.waitForSelector('#page #suivi-gravite-0')
            assert.equal(
                (await gravite.innerText()).trim(),
                'Poursuivez votre auto-suivi à la maison.'
            )
        }
    })

    it('remplir le questionnaire avec dépistage négatif et sans symptômes', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: true,
            depistageResultat: 'negatif',
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // On termine le parcours orientation
        {
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')

            // On retrouve le statut attendu
            let statut = await page.waitForSelector('#page #conseils-statut')
            assert.include(
                (await statut.innerText()).trim(),
                'Vous ne présentez pas de risque particulier face à la Covid'
            )
        }
    })

    it('remplir le questionnaire sans dépistage et sans symptômes', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
            departement: '80',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // On termine le parcours orientation
        {
            await waitForPlausibleTrackingEvent(page, 'Questionnaire terminé:conseils')

            // On retrouve le statut attendu
            let statut = await page.waitForSelector('#page #conseils-statut')
            assert.include(
                (await statut.innerText()).trim(),
                'Vous ne présentez pas de risque particulier face à la Covid'
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: ['temperature'],
        })

        // Avec des symptômes actuels on est redirigé vers la date de suivi (parcours suivi)
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: ['souffle'],
        })

        // Avec des symptômes actuels on est redirigé vers la date de suivi (parcours suivi)
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: true,
            contactARisque: [],
        })

        // Avec des symptômes passés on est redirigé vers la date de suivi (parcours suivi)
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
    })

    it('remplir le questionnaire avec contact à risque', async function () {
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: ['meme_lieu_de_vie'],
            departement: '00',
            activitePro: true,
            enfants: true,
            age: '42',
            taille: '165',
            poids: '70',
            grossesse: false,
        })

        // Conseils
        {
            // On retrouve la partie contact à risque
            let contact_a_risque = await page.waitForSelector(
                '#page #conseils-personnels-contact-a-risque'
            )
            assert.include(
                (await contact_a_risque.innerText()).trim(),
                'Contacter votre médecin généraliste.'
            )
            let bouton = await page.waitForSelector(
                '#page >> text="Refaire le questionnaire"'
            )
            await Promise.all([
                bouton.click(),
                page.waitForNavigation({ url: '**/#introduction' }),
            ])
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
                page.waitForNavigation({ url: '**/#depistage' }),
            ])
        }

        // Remplir le questionnaire
        await remplirQuestionnaire(page, {
            depistage: false,
            symptomesActuels: [],
            symptomesPasses: false,
            contactARisque: [],
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
            assert.equal(await button.getAttribute('href'), '#depistage')
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
            assert.equal(await button.getAttribute('href'), '#depistage')
            // On retrouve le titre explicite
            let titre = await page.waitForSelector('#page h2')
            assert.equal(await titre.innerText(), 'Conditions d’utilisation')
        }
    })
})
