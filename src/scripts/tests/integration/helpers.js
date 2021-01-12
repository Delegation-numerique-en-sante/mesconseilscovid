import { assert } from 'chai'

export async function getPlausibleTrackingEvents(page) {
    return await page.evaluate(() => window.app._plausibleTrackingEvents)
}

export async function waitForPlausibleTrackingEvent(page, name) {
    await page.waitForFunction(
        (name) => window.app._plausibleTrackingEvents.includes(name),
        name,
        { timeout: 2000 }
    )
    return await getPlausibleTrackingEvents(page)
}

export async function waitForPlausibleTrackingEvents(page, names) {
    try {
        await page.waitForFunction(
            (events) =>
                window.app._plausibleTrackingEvents.length === events.length &&
                window.app._plausibleTrackingEvents.every(
                    (val, index) => val === events[index]
                ),
            names,
            { timeout: 2000 }
        )
    } catch (e) {
        assert.deepEqual(names, await getPlausibleTrackingEvents(page))
    }
}

export async function remplirQuestionnaire(page, choix) {
    if (typeof choix.nom !== 'undefined') {
        await remplirNom(page, choix.nom)
    }
    await remplirSymptomesActuels(page, choix.symptomesActuels)
    if (choix.symptomesActuels.length) {
        await remplirDebutSymptomes(page, choix.debutSymptomes)
    } else {
        await remplirSymptomesPasses(page, choix.symptomesPasses)
        if (choix.symptomesPasses) {
            await remplirDebutSymptomes(page, choix.debutSymptomes)
        } else {
            await remplirContactsARisque(page, choix.contactARisque)
        }
    }
    await remplirDepistage(
        page,
        choix.depistage,
        choix.depistageDate,
        choix.depistageType,
        choix.depistageResultat
    )
    await remplirDepartement(page, choix.departement, choix.enfants, choix.activitePro)
    await remplirSante(
        page,
        choix.age,
        choix.taille,
        choix.poids,
        choix.antecedents || []
    )
    if (choix.age < 15) return
}

async function remplirNom(page, nom) {
    await page.fill('#page #name', nom)
    let bouton = await page.waitForSelector('#page >> text="Continuer"')
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: '**/#symptomesactuels' }),
    ])
}

async function remplirDepartement(page, departement, enfants, activitePro) {
    await page.selectOption('#page select#departement', departement)
    if (enfants === true) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label
        label = await page.waitForSelector('#page label[for="foyer_enfants"]')
        await label.click()
    }
    let label = await page.waitForSelector('#page label[for="activite_pro"]')
    if (activitePro === true) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        await label.click()
    }
    let bouton = await page.waitForSelector('#page >> text="Continuer"')
    await Promise.all([bouton.click(), page.waitForNavigation({ url: '**/#sante' })])
}

async function remplirSante(page, age, taille, poids, antecedents) {
    let label
    await page.fill('#page #age', age)
    await page.fill('#page #taille', taille)
    await page.fill('#page #poids', poids)
    // TODO: grossesse

    if (antecedents.length) {
        let primary_label = await page.waitForSelector(
            '#page label[for="antecedent_chronique"]'
        )
        await primary_label.click()
        antecedents.forEach(async (antecedent) => {
            label = await page.waitForSelector(
                `#page label[for="antecedent_${antecedent}"]`
            )
            await label.click()
        })
    }

    let bouton = await page.waitForSelector('#page >> text="Terminer"')
    const target = age < 15 ? 'pediatrie' : 'conseils'
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${target}` }),
    ])
}

async function remplirDepistage(page, depistage, date, type, resultat) {
    let text

    if (depistage) {
        let checkbox_label = await page.waitForSelector(
            '#page label[for="depistage_checkbox"]'
        )
        await checkbox_label.click()

        let type_label = await page.waitForSelector(
            `#page label[for="depistage_type_${type}"]`
        )
        await type_label.click()

        let resultat_label = await page.waitForSelector(
            `#page label[for="depistage_resultat_${resultat}"]`
        )
        await resultat_label.click()

        // Keep it at the end otherwise Safari from CI will not be able
        // to escape Pikaday and be stuck on that form.
        await page.fill(
            '#page #depistage_start_date',
            date.toISOString().substring(0, 10)
        )

        text = '"Continuer"'
    } else {
        text = '/.* pas passé de test/'
    }

    let bouton = await page.waitForSelector(`#page >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#residence` }),
    ])
}

async function remplirSymptomesActuels(page, symptomesActuels) {
    let text
    let nextPage

    if (symptomesActuels.length > 0) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label = await page.waitForSelector('#page label[for="symptomes_actuels"]')
        await label.click()

        symptomesActuels.forEach(async (nom) => {
            let label = await page.waitForSelector(
                `#page label[for="symptomes_actuels_${nom}"]`
            )
            await label.click()
        })
        text = '"Continuer"'
        if (
            symptomesActuels &&
            symptomesActuels.length === 1 &&
            symptomesActuels[0] === 'autre'
        ) {
            nextPage = 'symptomespasses'
        } else {
            nextPage = 'debutsymptomes'
        }
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

async function remplirSymptomesPasses(page, symptomesPasses) {
    let text
    let nextPage

    if (symptomesPasses === true) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label = await page.waitForSelector('#page label[for="symptomes_passes"]')
        await label.click()
        text = '"Continuer"'
        nextPage = 'debutsymptomes'
    } else {
        text = '/.* pas eu de symptômes dans les 7 derniers jours/' // &nbsp; après le 7
        nextPage = 'contactarisque'
    }
    let bouton = await page.waitForSelector(`#page >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${nextPage}` }),
    ])
}

async function remplirContactsARisque(page, contactARisque) {
    let text

    if (contactARisque.length > 0) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label = await page.waitForSelector('#page label[for="contact_a_risque"]')
        await label.click()

        contactARisque.forEach(async (nom) => {
            let label = await page.waitForSelector(
                `#page label[for="contact_a_risque_${nom}"]`
            )
            await label.click()
        })
        text = '"Continuer"'
    } else {
        text = '/.* pas eu de contact à risque/'
    }

    let bouton = await page.waitForSelector(`#page >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#depistage` }),
    ])
}

async function remplirDebutSymptomes(page, date) {
    let label = await page.waitForSelector(`#page label[for="debut_symptomes_${date}"]`)
    await label.click()

    let bouton = await page.waitForSelector('#page >> text="Continuer"')
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#depistage` }),
    ])
}

export async function remplirSuivi(page, symptomes) {
    // Réponses obligatoires.
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

    // Question seulement posée quand on remplit pour un·e proche.
    if (symptomes.confusion) {
        label = await page.waitForSelector(
            `#page label[for="suivi_symptomes_confusion_${symptomes.confusion}"]`
        )
        await label.click()
    }

    // Réponses optionnelles.
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
