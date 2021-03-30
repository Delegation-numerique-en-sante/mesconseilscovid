import Profil from '../profil'

export function createProfil({
    symptomes_actuels = false,
    symptomes_actuels_temperature = false,
    symptomes_actuels_temperature_inconnue = false,
    symptomes_actuels_toux = false,
    symptomes_actuels_odorat = false,
    symptomes_actuels_douleurs = false,
    symptomes_actuels_diarrhee = false,
    symptomes_actuels_fatigue = false,
    symptomes_actuels_alimentation = false,
    symptomes_actuels_souffle = false,
    symptomes_actuels_autre = false,
    symptomes_passes = false,
    contact_a_risque = false,
    contact_a_risque_meme_lieu_de_vie = false,
    contact_a_risque_contact_direct = false,
    contact_a_risque_actes = false,
    contact_a_risque_espace_confine = false,
    contact_a_risque_meme_classe = false,
    contact_a_risque_stop_covid = false,
    contact_a_risque_assurance_maladie = false,
    contact_a_risque_autre = false,
    contact_a_risque_variante = undefined,
    depistage = false,
    depistage_type = '',
    depistage_resultat = '',
    depistage_variante = undefined,
    _depistage_start_date = undefined,
    vaccins = false,
    _vaccins_1re_dose_date = undefined,
    _vaccins_2e_dose_date = undefined,
    covid_passee = false,
    _covid_passee_date = undefined,
    departement = '34',
    activite_pro = false,
    activite_pro_sante = false,
    foyer_autres_personnes = false,
    foyer_enfants = false,
    age = 42,
    grossesse_3e_trimestre = false,
    poids = '70',
    taille = '178',
    antecedent_cardio = false,
    antecedent_diabete = false,
    antecedent_respi = false,
    antecedent_dialyse = false,
    antecedent_greffe = false,
    antecedent_cancer = false,
    antecedent_immunodep = false,
    antecedent_cirrhose = false,
    antecedent_drepano = false,
    antecedent_trisomie = false,
    antecedent_chronique_autre = false,
    _symptomes_start_date = '2020-07-09T14:03:41.000Z',
} = {}) {
    return new Profil('mes_infos', {
        symptomes_actuels: symptomes_actuels,
        symptomes_actuels_temperature: symptomes_actuels_temperature,
        symptomes_actuels_temperature_inconnue: symptomes_actuels_temperature_inconnue,
        symptomes_actuels_toux: symptomes_actuels_toux,
        symptomes_actuels_odorat: symptomes_actuels_odorat,
        symptomes_actuels_douleurs: symptomes_actuels_douleurs,
        symptomes_actuels_diarrhee: symptomes_actuels_diarrhee,
        symptomes_actuels_fatigue: symptomes_actuels_fatigue,
        symptomes_actuels_alimentation: symptomes_actuels_alimentation,
        symptomes_actuels_souffle: symptomes_actuels_souffle,
        symptomes_actuels_autre: symptomes_actuels_autre,
        symptomes_passes: symptomes_passes,
        contact_a_risque: contact_a_risque,
        contact_a_risque_meme_lieu_de_vie: contact_a_risque_meme_lieu_de_vie,
        contact_a_risque_contact_direct: contact_a_risque_contact_direct,
        contact_a_risque_actes: contact_a_risque_actes,
        contact_a_risque_espace_confine: contact_a_risque_espace_confine,
        contact_a_risque_meme_classe: contact_a_risque_meme_classe,
        contact_a_risque_stop_covid: contact_a_risque_stop_covid,
        contact_a_risque_assurance_maladie: contact_a_risque_assurance_maladie,
        contact_a_risque_autre: contact_a_risque_autre,
        contact_a_risque_variante: contact_a_risque_variante,
        depistage: depistage,
        depistage_type: depistage_type,
        depistage_resultat: depistage_resultat,
        depistage_variante: depistage_variante,
        _depistage_start_date: _depistage_start_date,
        vaccins: vaccins,
        _vaccins_1re_dose_date: _vaccins_1re_dose_date,
        _vaccins_2e_dose_date: _vaccins_2e_dose_date,
        covid_passee: covid_passee,
        _covid_passee_date: _covid_passee_date,
        departement: departement,
        activite_pro: activite_pro,
        activite_pro_sante: activite_pro_sante,
        foyer_autres_personnes: foyer_autres_personnes,
        foyer_enfants: foyer_enfants,
        age: age,
        grossesse_3e_trimestre: grossesse_3e_trimestre,
        poids: poids,
        taille: taille,
        antecedent_cardio: antecedent_cardio,
        antecedent_diabete: antecedent_diabete,
        antecedent_respi: antecedent_respi,
        antecedent_dialyse: antecedent_dialyse,
        antecedent_greffe: antecedent_greffe,
        antecedent_cancer: antecedent_cancer,
        antecedent_immunodep: antecedent_immunodep,
        antecedent_cirrhose: antecedent_cirrhose,
        antecedent_drepano: antecedent_drepano,
        antecedent_trisomie: antecedent_trisomie,
        antecedent_chronique_autre: antecedent_chronique_autre,
        _symptomes_start_date: _symptomes_start_date,
    })
}
