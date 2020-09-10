export async function remplirQuestionnaire(page, choix) {
    await remplirDepartement(page, choix.departement)
    await remplirFoyer(page, choix.enfants)
    await remplirAntecedents(page)
    await remplirCaracteristiques(page, choix.age, choix.taille, choix.poids)
    if (choix.age < 15) return
    await remplirActivite(page, choix.activitePro)
    await remplirSymptomesActuels(page, choix.symptomesActuels)
    if (choix.symptomesActuels.length === 0) {
        await remplirSymptomesPasses(page, choix.symptomesPasses)
        if (choix.symptomesPasses === false) {
            await remplirContactsARisque(page, choix.contactARisque)
        }
    }
    if (
        choix.symptomesActuels.length !== 0 ||
        choix.symptomesPasses === true ||
        choix.contactARisque.length !== 0
    ) {
        await remplirTest(page, choix.test, choix.symptomesActuels.length)
    }
}

// Questionnaire 1/9
async function remplirDepartement(page, departement) {
    await page.selectOption('#page select#departement', departement)
    let bouton = await page.waitForSelector('#page >> text="Continuer"')
    await Promise.all([bouton.click(), page.waitForNavigation({ url: '**/#foyer' })])
}

// Questionnaire 2/9
async function remplirFoyer(page, enfants) {
    if (enfants === true) {
        // Je n’arrive pas à cocher la case directement, alors je clique sur le label
        let label
        label = await page.waitForSelector('#page label[for="foyer_enfants"]')
        await label.click()
    }

    // TODO: personnes fragiles

    let bouton = await page.waitForSelector('#page >> text="Continuer"')
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: '**/#antecedents' }),
    ])
}

// Questionnaire 3/9
async function remplirAntecedents(page) {
    // TODO: cocher les cases
    let bouton = await page.waitForSelector(
        '#page >> text=/Aucun de ces éléments ne correspond à .* situation/'
    )
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: '**/#caracteristiques' }),
    ])
}

// Questionnaire 4/9
async function remplirCaracteristiques(page, age, taille, poids) {
    await page.fill('#page #age', age)
    await page.fill('#page #taille', taille)
    await page.fill('#page #poids', poids)
    // TODO: grossesse
    let bouton = await page.waitForSelector('#page >> text="Continuer"')
    const target = age < 15 ? 'pediatrie' : 'activitepro'
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${target}` }),
    ])
}

// Questionnaire 5/9
async function remplirActivite(page, activitePro) {
    let label = await page.waitForSelector('#page label[for="activite_pro"]')
    let text

    if (activitePro === true) {
        // Je n’arrive pas à cocher la case directement, alors je clique sur le label
        await label.click()
        text = 'Continuer'
    } else {
        text = 'Je n’ai pas d’activité professionnelle ou bénévole'
    }

    let bouton = await page.waitForSelector(`#page >> text="${text}"`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: '**/#symptomesactuels' }),
    ])
}

// Questionnaire 6/9
async function remplirSymptomesActuels(page, symptomesActuels) {
    let text
    let nextPage

    if (symptomesActuels.length > 0) {
        // Je n’arrive pas à cocher la case directement, alors je clique sur le label
        let label = await page.waitForSelector('#page label[for="symptomes_actuels"]')
        await label.click()

        symptomesActuels.forEach(async (nom) => {
            let label = await page.waitForSelector(
                `#page label[for="symptomes_actuels_${nom}"]`
            )
            await label.click()
        })
        text = '"Continuer"'
        nextPage = 'test'
    } else {
        text = '/.* pas de symptômes actuellement/'
        nextPage = 'symptomespasses'
    }

    let bouton = await page.waitForSelector(`#page >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${nextPage}` }),
    ])
}

// Questionnaire 7/9
async function remplirSymptomesPasses(page, symptomesPasses) {
    let text
    let nextPage

    if (symptomesPasses === true) {
        // Je n’arrive pas à cocher la case directement, alors je clique sur le label
        let label = await page.waitForSelector('#page label[for="symptomes_passes"]')
        await label.click()
        text = '"Continuer"'
        nextPage = 'test'
    } else {
        text = '/.* pas eu de symptômes dans les 14 derniers jours/' // &nbsp; après le 14
        nextPage = 'contactarisque'
    }
    let bouton = await page.waitForSelector(`#page >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${nextPage}` }),
    ])
}

// Questionnaire 8/9
async function remplirContactsARisque(page, contactARisque) {
    let text
    let nextPage

    if (contactARisque.length > 0) {
        // Je n’arrive pas à cocher la case directement, alors je clique sur le label
        let label = await page.waitForSelector('#page label[for="symptomes_actuels"]')
        await label.click()

        contactARisque.forEach(async (nom) => {
            let label = await page.waitForSelector(
                `#page label[for="contact_a_risque_${nom}"]`
            )
            await label.click()
        })
        text = '"Continuer"'
        nextPage = 'test'
    } else {
        text = '/.* pas eu de contact à risque/'
        nextPage = 'conseils'
    }

    let bouton = await page.waitForSelector(`#page >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${nextPage}` }),
    ])
}

// Questionnaire 9/9
async function remplirTest(page, test, symptomesActuelsLength) {
    let text
    let nextPage

    if (test === true) {
        // Je n’arrive pas à cocher la case directement, alors je clique sur le label
        let label
        label = await page.waitForSelector('#page label[for="test"]')
        await label.click()
        text = 'Terminer'
    } else {
        text = '/.* pas réalisé de test/'
    }
    if (symptomesActuelsLength > 0) {
        nextPage = 'suivimedecin'
    } else {
        nextPage = 'conseils'
    }

    let bouton = await page.waitForSelector(`#page >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${nextPage}` }),
    ])
}

export async function remplirSuivi(page, symptomes) {
    // Obligatoires
    let label
    label = await page.waitForSelector(
        `#page label[for="suivi_symptomes_essoufflement_${symptomes.essoufflement}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page label[for="suivi_symptomes_etat_general_${symptomes.etat_general}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page label[for="suivi_symptomes_alimentation_hydratation_${symptomes.alimentation_hydratation}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page label[for="suivi_symptomes_etat_psychologique_${symptomes.etat_psychologique}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page label[for="suivi_symptomes_fievre_${symptomes.fievre}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page label[for="suivi_symptomes_diarrhee_vomissements_${symptomes.diarrhee_vomissements}"]`
    )
    await label.click()

    // Seulement pour les proches
    if (symptomes.confusion) {
        label = await page.waitForSelector(
            `#page label[for="suivi_symptomes_confusion_${symptomes.confusion}"]`
        )
        await label.click()
    }

    // Optionnels
    if (symptomes.maux_de_tete) {
        label = await page.waitForSelector(
            `#page label[for="suivi_symptomes_maux_de_tete_${symptomes.maux_de_tete}"]`
        )
        await label.click()
    }
    if (symptomes.toux) {
        label = await page.waitForSelector(
            `#page label[for="suivi_symptomes_toux_${symptomes.toux}"]`
        )
        await label.click()
    }
}
