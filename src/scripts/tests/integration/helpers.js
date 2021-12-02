import { assert } from 'chai'

export function recordConsoleMessages(page, messages = []) {
    page.on('console', async (msg) => {
        const text = msg.text()
        if (text.startsWith('[Plausible] {')) {
            const payload = JSON.parse(text.slice('[Plausible] '.length))
            messages.push(payload)
        }
    })
    return messages
}

export async function getPlausibleTrackingEvents(page) {
    return await page.evaluate(() => window.app._plausibleTrackingEvents)
}

export async function waitForPlausibleTrackingEvent(page, name) {
    await page.waitForFunction(
        (name) =>
            window.app._plausibleTrackingEvents &&
            window.app._plausibleTrackingEvents.includes(name),
        name,
        { timeout: 2000 }
    )
    return await getPlausibleTrackingEvents(page)
}

export async function waitForPlausibleTrackingEvents(page, names) {
    try {
        await page.waitForFunction(
            (events) =>
                window.app._plausibleTrackingEvents &&
                window.app._plausibleTrackingEvents.length === events.length &&
                window.app._plausibleTrackingEvents.every(
                    (val, index) => val === events[index]
                ),
            names,
            { timeout: 2000 }
        )
    } catch (e) {
        assert.deepEqual(await getPlausibleTrackingEvents(page), names)
    }
}

export async function remplirQuestionnaire(page, choix) {
    if (typeof choix.nom !== 'undefined') {
        await remplirNom(page, choix.nom)
    }
    await remplirSymptomes(
        page,
        choix.symptomesActuels,
        choix.symptomesPasses,
        choix.debutSymptomes
    )
    if (!choix.symptomesActuels.length && !choix.symptomesPasses) {
        await remplirContactsARisque(
            page,
            choix.contactARisque,
            choix.contactARisqueTAC,
            choix.contactARisqueAM
        )
    }
    await remplirDepistage(
        page,
        choix.depistage,
        choix.depistageDate,
        choix.depistageType,
        choix.depistageResultat
    )
    await remplirHistorique(page, choix.covid_passee, choix.nbMois)
    await remplirVaccins(page, choix.vaccins)
    await remplirSituation(page, choix.enfants, choix.activitePro)
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
    await page.fill('#page.ready #name', nom)
    let bouton = await page.waitForSelector('#page.ready >> text="Continuer"')
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: '**/#symptomes' }),
    ])
}

async function remplirSituation(page, enfants, activitePro) {
    if (enfants === true) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label
        label = await page.waitForSelector(
            '#page.ready label[for="foyer_autres_personnes"]'
        )
        await label.click()
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        label = await page.waitForSelector('#page.ready label[for="foyer_enfants"]')
        await label.click()
    }
    let label = await page.waitForSelector('#page.ready label[for="activite_pro"]')
    if (activitePro === true) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        await label.click()
    }
    let bouton = await page.waitForSelector('#page.ready >> text="Continuer"')
    await Promise.all([bouton.click(), page.waitForNavigation({ url: '**/#sante' })])
}

async function remplirSante(page, age, taille, poids, antecedents) {
    let label
    await page.fill('#page.ready #age', age)
    await page.fill('#page.ready #taille', taille)
    await page.fill('#page.ready #poids', poids)
    // TODO: grossesse

    if (antecedents.length) {
        let primary_label = await page.waitForSelector(
            '#page.ready label[for="antecedent_chronique"]'
        )
        await primary_label.click()
        antecedents.forEach(async (antecedent) => {
            label = await page.waitForSelector(
                `#page.ready label[for="antecedent_${antecedent}"]`
            )
            await label.click()
        })
    }

    let bouton = await page.waitForSelector('#page.ready >> text="Terminer"')
    await Promise.all([bouton.click(), page.waitForNavigation({ url: `**/#conseils` })])
}

async function remplirDepistage(page, depistage, date, type, resultat) {
    let text

    if (depistage) {
        let checkbox_label = await page.waitForSelector(
            '#page.ready label[for="depistage_checkbox"]'
        )
        await checkbox_label.click()

        await page.fill(
            '#page.ready #depistage_start_date',
            date.toISOString().substring(0, 10)
        )

        let type_label = await page.waitForSelector(
            `#page.ready label[for="depistage_type_${type}"]`
        )
        await type_label.click()

        let resultat_label = await page.waitForSelector(
            `#page.ready label[for="depistage_resultat_${resultat}"]`
        )
        await resultat_label.click()

        text = '"Continuer"'
    } else {
        text = '/.* pas passé de test/'
    }

    let bouton = await page.waitForSelector(`#page.ready >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#historique` }),
    ])
}

async function remplirVaccins(page, vaccins) {
    let radio_label = await page.waitForSelector(
        `#page.ready label[for="vaccins_radio_${vaccins}"]`
    )
    await radio_label.click()

    let bouton = await page.waitForSelector(`#page.ready >> text="Continuer"`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#situation` }),
    ])
}

async function remplirHistorique(page, covid_passee, nbMois) {
    let text

    if (covid_passee) {
        let checkbox_label = await page.waitForSelector(
            '#page.ready label[for="covid_passee_checkbox"]'
        )
        await checkbox_label.click()

        let label = await page.waitForSelector(
            `#page.ready label[for="covid_passee_date_${nbMois}_mois"]`
        )
        await label.click()

        text = '"Continuer"'
    } else {
        text = '/.* jamais eu la Covid/'
    }

    let bouton = await page.waitForSelector(`#page.ready >> text=${text}`)
    await Promise.all([bouton.click(), page.waitForNavigation({ url: `**/#vaccins` })])
}

async function remplirSymptomes(page, symptomesActuels, symptomesPasses, date) {
    let text
    let nextPage = 'contactarisque'
    let label

    if (symptomesActuels.length > 0) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label = await page.waitForSelector(
            '#page.ready label[for="symptomes_actuels"]'
        )
        await label.click()

        symptomesActuels.forEach(async (nom) => {
            let label = await page.waitForSelector(
                `#page.ready label[for="symptomes_actuels_${nom}"]`
            )
            await label.click()
        })
        label = await page.waitForSelector(
            `#page.ready label[for="debut_symptomes_${date}"]`
        )
        await label.click()
        text = '"Continuer"'
        if (
            symptomesActuels &&
            symptomesActuels.length === 1 &&
            symptomesActuels[0] === 'autre'
        ) {
            nextPage = 'contactarisque'
        } else {
            nextPage = 'depistage'
        }
    } else if (symptomesPasses === true) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        label = await page.waitForSelector('#page.ready label[for="symptomes_passes"]')
        await label.click()
        label = await page.waitForSelector(
            `#page.ready label[for="debut_symptomes_${date}"]`
        )
        await label.click()
        text = '"Continuer"'
        nextPage = 'depistage'
    } else {
        label = await page.waitForSelector('#page.ready label[for="symptomes_non"]')
        await label.click()
        text = '"Continuer"'
        nextPage = 'contactarisque'
    }

    let bouton = await page.waitForSelector(`#page.ready >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#${nextPage}` }),
    ])
}

async function remplirContactsARisque(
    page,
    contactARisque,
    contactARisqueTAC,
    contactARisqueAM
) {
    let text

    if (contactARisque.length > 0) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label = await page.waitForSelector(
            '#page.ready label[for="contact_a_risque"]'
        )
        await label.click()

        contactARisque.forEach(async (nom) => {
            let label = await page.waitForSelector(
                `#page.ready label[for="contact_a_risque_${nom}"]`
            )
            await label.click()
        })
        text = '"Continuer"'
    } else if (contactARisqueTAC) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label = await page.waitForSelector(
            '#page.ready label[for="contact_a_risque_stop_covid"]'
        )
        await label.click()

        text = '"Continuer"'
    } else if (contactARisqueAM) {
        // La "vraie" case à cocher est cachée, alors on clique sur le label.
        let label = await page.waitForSelector(
            '#page.ready label[for="contact_a_risque_assurance_maladie"]'
        )
        await label.click()

        text = '"Continuer"'
    } else {
        text = '/.* pas eu de contact à risque/'
    }

    let bouton = await page.waitForSelector(`#page.ready >> text=${text}`)
    await Promise.all([
        bouton.click(),
        page.waitForNavigation({ url: `**/#depistage` }),
    ])
}

export async function remplirSuivi(page, symptomes) {
    // Réponses obligatoires.
    let label
    label = await page.waitForSelector(
        `#page.ready label[for="suivi_symptomes_essoufflement_${symptomes.essoufflement}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page.ready label[for="suivi_symptomes_etat_general_${symptomes.etat_general}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page.ready label[for="suivi_symptomes_alimentation_hydratation_${symptomes.alimentation_hydratation}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page.ready label[for="suivi_symptomes_etat_psychologique_${symptomes.etat_psychologique}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page.ready label[for="suivi_symptomes_fievre_${symptomes.fievre}"]`
    )
    await label.click()
    label = await page.waitForSelector(
        `#page.ready label[for="suivi_symptomes_diarrhee_vomissements_${symptomes.diarrhee_vomissements}"]`
    )
    await label.click()

    // Question seulement posée quand on remplit pour un ou une proche.
    if (symptomes.confusion) {
        label = await page.waitForSelector(
            `#page.ready label[for="suivi_symptomes_confusion_${symptomes.confusion}"]`
        )
        await label.click()
    }

    // Réponses optionnelles.
    if (symptomes.maux_de_tete) {
        label = await page.waitForSelector(
            `#page.ready label[for="suivi_symptomes_maux_de_tete_${symptomes.maux_de_tete}"]`
        )
        await label.click()
    }
    if (symptomes.toux) {
        label = await page.waitForSelector(
            `#page.ready label[for="suivi_symptomes_toux_${symptomes.toux}"]`
        )
        await label.click()
    }
}
