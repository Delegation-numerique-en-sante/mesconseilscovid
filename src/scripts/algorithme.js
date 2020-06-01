var carteDepartements = require('./carte.js')

function getData(questionnaire) {
    var data = questionnaire.getData()
    // On a besoin de l’IMC avant pour pouvoir calculer les risques.
    data.imc = computeIMC(data.poids, data.taille)
    data.couleur = carteDepartements.couleur(data.departement)
    data.antecedents = hasAntecedents(data)
    data.symptomes = hasSymptomes(data)
    data.risques = hasRisques(data)
    return data
}

function computeIMC(poids, taille) {
    var taille_en_metres = taille / 100
    return poids / (taille_en_metres * taille_en_metres)
}

function hasRisques(data) {
    return (
        data.sup65 ||
        data.grossesse_3e_trimestre ||
        data.imc > 30 ||
        hasAntecedents(data)
    )
}

function hasAntecedents(data) {
    return (
        data.antecedent_cardio ||
        data.antecedent_diabete ||
        data.antecedent_respi ||
        data.antecedent_dialyse ||
        data.antecedent_cancer ||
        data.antecedent_immunodep ||
        data.antecedent_cirrhose ||
        data.antecedent_drepano
    )
}

function hasSymptomes(data) {
    return data.symptomes_actuels || data.symptomes_passes || data.contact_a_risque
}

function statutBlockNamesToDisplay(data) {
    var blockNames = []
    // L’ordre est important car risques > foyer_fragile.
    if (data.risques) {
        blockNames.push('statut-personne-fragile')
    } else if (data.foyer_fragile) {
        blockNames.push('statut-foyer-fragile')
    } else {
        blockNames.push('statut-peu-de-risques')
    }
    return blockNames
}

function departementBlockNamesToDisplay(data) {
    var blockNames = []
    blockNames.push('conseils-departement')
    if (data.couleur === 'orange') {
        blockNames.push('conseils-departement-orange')
    }
    if (data.couleur === 'vert') {
        blockNames.push('conseils-departement-vert')
    }
    return blockNames
}

function activiteProBlockNamesToDisplay(data) {
    var blockNames = []
    if (data.activite_pro || data.activite_pro_public || data.activite_pro_sante) {
        blockNames.push('conseils-activite')
        // Les blocs de réponses sont exclusifs.
        if (data.activite_pro_public && data.activite_pro_sante) {
            blockNames.push('reponse-activite-pro-public-sante')
        } else if (data.activite_pro_public) {
            blockNames.push('reponse-activite-pro-public')
        } else if (data.activite_pro_sante) {
            blockNames.push('reponse-activite-pro-sante')
        } else {
            blockNames.push('reponse-activite-pro')
        }
        // Les blocs de conseils sont quasi-exclusifs aussi.
        if (data.activite_pro_public && data.activite_pro_sante) {
            blockNames.push('conseils-activite-pro-public')
            blockNames.push('conseils-activite-pro-sante')
        } else if (data.activite_pro_public) {
            blockNames.push('conseils-activite-pro-public')
            blockNames.push('conseils-activite-pro-infos')
        } else if (data.activite_pro_sante) {
            blockNames.push('conseils-activite-pro-sante')
        } else {
            blockNames.push('conseils-activite-pro')
            blockNames.push('conseils-activite-pro-infos')
        }
    }
    return blockNames
}

function foyerBlockNamesToDisplay(data) {
    var blockNames = []
    if (data.foyer_enfants || data.foyer_fragile) {
        blockNames.push('conseils-foyer')
        if (data.foyer_enfants && data.foyer_fragile) {
            blockNames.push('conseils-foyer-enfants-fragile')
        } else if (data.foyer_enfants) {
            blockNames.push('conseils-foyer-enfants')
        } /* if (data.foyer_fragile) inutile mais logique */ else {
            blockNames.push('conseils-foyer-fragile')
        }
    }
    return blockNames
}

function caracteristiquesAntecedentsBlockNamesToDisplay(data) {
    var blockNames = []
    if (data.risques || data.antecedent_chronique_autre) {
        blockNames.push('conseils-caracteristiques')
        // Réponses
        if (data.antecedents || data.antecedent_chronique_autre) {
            blockNames.push('reponse-antecedents')
        }
        if (data.sup65 || data.grossesse_3e_trimestre || data.imc > 30) {
            blockNames.push('reponse-caracteristiques')
        }
        // Conseils
        if (data.activite_pro) {
            blockNames.push('conseils-caracteristiques-antecedents-activite-pro')
        } else {
            blockNames.push('conseils-caracteristiques-antecedents')
        }
        if (data.antecedents || data.antecedent_chronique_autre) {
            blockNames.push('conseils-caracteristiques-antecedents-info-risque')
        } else {
            blockNames.push('conseils-caracteristiques-antecedents-info')
        }
        if (data.antecedent_chronique_autre) {
            blockNames.push('conseils-antecedents-chroniques-autres')
        }
    }
    return blockNames
}

function symptomesPassesBlockNamesToDisplay(data) {
    var blockNames = []
    if (data.risques || data.foyer_fragile) {
        blockNames.push('conseils-symptomes-passes-avec-risques')
    } else {
        blockNames.push('conseils-symptomes-passes-sans-risques')
    }
    return blockNames
}

function contactARisqueBlockNamesToDisplay(data) {
    var blockNames = []
    if (data.contact_a_risque_autre) {
        blockNames.push('conseils-contact-a-risque-autre')
    }
    return blockNames
}

module.exports = {
    getData,
    statutBlockNamesToDisplay,
    departementBlockNamesToDisplay,
    activiteProBlockNamesToDisplay,
    foyerBlockNamesToDisplay,
    caracteristiquesAntecedentsBlockNamesToDisplay,
    symptomesPassesBlockNamesToDisplay,
    contactARisqueBlockNamesToDisplay,
}
