import { assert } from 'chai'

import Profil from '../profil.js'

const caracteristiques = {
    departement: '34',
    activite_pro: false,
    activite_pro_public: false,
    activite_pro_sante: false,
    activite_pro_liberal: false,
    foyer_enfants: true,
    foyer_fragile: false,
    age: '42',
    grossesse_3e_trimestre: false,
    poids: '70',
    taille: '178',
    antecedent_cardio: false,
    antecedent_diabete: true,
    antecedent_respi: false,
    antecedent_dialyse: true,
    antecedent_cancer: false,
    antecedent_immunodep: false,
    antecedent_cirrhose: false,
    antecedent_drepano: false,
    antecedent_chronique_autre: false,
}

describe('Situation', function () {
    it('Non testé et asymptomatique', function () {
        const profil = new Profil(
            'mes_infos',
            Object.assign(
                {
                    symptomes_actuels: false,
                    symptomes_actuels_temperature: false,
                    symptomes_actuels_temperature_inconnue: false,
                    symptomes_actuels_toux: false,
                    symptomes_actuels_odorat: false,
                    symptomes_actuels_douleurs: false,
                    symptomes_actuels_diarrhee: false,
                    symptomes_actuels_fatigue: false,
                    symptomes_actuels_alimentation: false,
                    symptomes_actuels_souffle: false,
                    symptomes_actuels_autre: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                    contact_a_risque_meme_lieu_de_vie: false,
                    contact_a_risque_contact_direct: false,
                    contact_a_risque_actes: false,
                    contact_a_risque_espace_confine: false,
                    contact_a_risque_meme_classe: false,
                    contact_a_risque_stop_covid: false,
                    contact_a_risque_autre: false,
                    depistage: false,
                },
                caracteristiques
            )
        )
        assert.equal(profil.situation, 'pas_teste_asymptomatique')
    })

    it('En attente et contact pas vraiment à risque', function () {
        const profil = new Profil(
            'mes_infos',
            Object.assign(
                {
                    symptomes_actuels: false,
                    symptomes_actuels_temperature: false,
                    symptomes_actuels_temperature_inconnue: false,
                    symptomes_actuels_toux: false,
                    symptomes_actuels_odorat: false,
                    symptomes_actuels_douleurs: false,
                    symptomes_actuels_diarrhee: false,
                    symptomes_actuels_fatigue: false,
                    symptomes_actuels_alimentation: false,
                    symptomes_actuels_souffle: false,
                    symptomes_actuels_autre: false,
                    symptomes_passes: false,
                    contact_a_risque: true,
                    contact_a_risque_meme_lieu_de_vie: false,
                    contact_a_risque_contact_direct: false,
                    contact_a_risque_actes: false,
                    contact_a_risque_espace_confine: false,
                    contact_a_risque_meme_classe: false,
                    contact_a_risque_stop_covid: false,
                    contact_a_risque_autre: true,
                    depistage: true,
                    depistage_resultat: 'en_attente',
                },
                caracteristiques
            )
        )
        assert.equal(profil.situation, 'en_attente_contact_pas_vraiment_a_risque')
    })

    it('Négatif et contact à risque', function () {
        const profil = new Profil(
            'mes_infos',
            Object.assign(
                {
                    symptomes_actuels: false,
                    symptomes_actuels_temperature: false,
                    symptomes_actuels_temperature_inconnue: false,
                    symptomes_actuels_toux: false,
                    symptomes_actuels_odorat: false,
                    symptomes_actuels_douleurs: false,
                    symptomes_actuels_diarrhee: false,
                    symptomes_actuels_fatigue: false,
                    symptomes_actuels_alimentation: false,
                    symptomes_actuels_souffle: false,
                    symptomes_actuels_autre: false,
                    symptomes_passes: false,
                    contact_a_risque: true,
                    contact_a_risque_meme_lieu_de_vie: true,
                    contact_a_risque_contact_direct: false,
                    contact_a_risque_actes: false,
                    contact_a_risque_espace_confine: false,
                    contact_a_risque_meme_classe: false,
                    contact_a_risque_stop_covid: false,
                    contact_a_risque_autre: false,
                    depistage: true,
                    depistage_resultat: 'negatif',
                },
                caracteristiques
            )
        )
        assert.equal(profil.situation, 'negatif_contact_a_risque')
    })

    it('Positif et symptômes passés', function () {
        const profil = new Profil(
            'mes_infos',
            Object.assign(
                {
                    symptomes_actuels: false,
                    symptomes_actuels_temperature: false,
                    symptomes_actuels_temperature_inconnue: false,
                    symptomes_actuels_toux: false,
                    symptomes_actuels_odorat: false,
                    symptomes_actuels_douleurs: false,
                    symptomes_actuels_diarrhee: false,
                    symptomes_actuels_fatigue: false,
                    symptomes_actuels_alimentation: false,
                    symptomes_actuels_souffle: false,
                    symptomes_actuels_autre: false,
                    symptomes_passes: true,
                    contact_a_risque: false,
                    contact_a_risque_meme_lieu_de_vie: false,
                    contact_a_risque_contact_direct: false,
                    contact_a_risque_actes: false,
                    contact_a_risque_espace_confine: false,
                    contact_a_risque_meme_classe: false,
                    contact_a_risque_stop_covid: false,
                    contact_a_risque_autre: false,
                    depistage: true,
                    depistage_resultat: 'positif',
                },
                caracteristiques
            )
        )
        assert.equal(profil.situation, 'positif_symptomes_passes')
    })

    it('Négatif et symptômes actuels pas graves', function () {
        const profil = new Profil(
            'mes_infos',
            Object.assign(
                {
                    symptomes_actuels: true,
                    symptomes_actuels_temperature: false,
                    symptomes_actuels_temperature_inconnue: false,
                    symptomes_actuels_toux: false,
                    symptomes_actuels_odorat: false,
                    symptomes_actuels_douleurs: false,
                    symptomes_actuels_diarrhee: true,
                    symptomes_actuels_fatigue: false,
                    symptomes_actuels_alimentation: false,
                    symptomes_actuels_souffle: false,
                    symptomes_actuels_autre: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                    contact_a_risque_meme_lieu_de_vie: false,
                    contact_a_risque_contact_direct: false,
                    contact_a_risque_actes: false,
                    contact_a_risque_espace_confine: false,
                    contact_a_risque_meme_classe: false,
                    contact_a_risque_stop_covid: false,
                    contact_a_risque_autre: false,
                    depistage: true,
                    depistage_resultat: 'negatif',
                },
                caracteristiques
            )
        )
        assert.equal(profil.situation, 'negatif_symptomes_actuels')
    })

    it('En attente et symptômes actuels graves', function () {
        const profil = new Profil(
            'mes_infos',
            Object.assign(
                {
                    symptomes_actuels: true,
                    symptomes_actuels_temperature: false,
                    symptomes_actuels_temperature_inconnue: false,
                    symptomes_actuels_toux: false,
                    symptomes_actuels_odorat: false,
                    symptomes_actuels_douleurs: false,
                    symptomes_actuels_diarrhee: false,
                    symptomes_actuels_fatigue: false,
                    symptomes_actuels_alimentation: false,
                    symptomes_actuels_souffle: true,
                    symptomes_actuels_autre: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                    contact_a_risque_meme_lieu_de_vie: false,
                    contact_a_risque_contact_direct: false,
                    contact_a_risque_actes: false,
                    contact_a_risque_espace_confine: false,
                    contact_a_risque_meme_classe: false,
                    contact_a_risque_stop_covid: false,
                    contact_a_risque_autre: false,
                    depistage: true,
                    depistage_resultat: 'en_attente',
                },
                caracteristiques
            )
        )
        assert.equal(profil.situation, 'en_attente_symptomes_actuels_graves')
    })
})
