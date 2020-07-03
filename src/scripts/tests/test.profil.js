var assert = require('chai').assert

var Profil = require('../profil.js')
var profil = new Profil()

describe('Profil', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Le questionnaire est vide par défaut', function () {
        assert.deepEqual(profil.getData(), {
            departement: undefined,
            activite_pro: undefined,
            activite_pro_public: undefined,
            activite_pro_sante: undefined,
            foyer_enfants: undefined,
            foyer_fragile: undefined,
            age: undefined,
            grossesse_3e_trimestre: undefined,
            poids: undefined,
            taille: undefined,
            antecedent_cardio: undefined,
            antecedent_diabete: undefined,
            antecedent_respi: undefined,
            antecedent_dialyse: undefined,
            antecedent_cancer: undefined,
            antecedent_immunodep: undefined,
            antecedent_cirrhose: undefined,
            antecedent_drepano: undefined,
            antecedent_chronique_autre: undefined,
            symptomes_actuels: undefined,
            symptomes_actuels_temperature: undefined,
            symptomes_actuels_temperature_inconnue: undefined,
            symptomes_actuels_toux: undefined,
            symptomes_actuels_odorat: undefined,
            symptomes_actuels_douleurs: undefined,
            symptomes_actuels_diarrhee: undefined,
            symptomes_actuels_fatigue: undefined,
            symptomes_actuels_alimentation: undefined,
            symptomes_actuels_souffle: undefined,
            symptomes_actuels_autre: undefined,
            symptomes_passes: undefined,
            contact_a_risque: undefined,
            contact_a_risque_meme_lieu_de_vie: undefined,
            contact_a_risque_contact_direct: undefined,
            contact_a_risque_actes: undefined,
            contact_a_risque_espace_confine: undefined,
            contact_a_risque_meme_classe: undefined,
            contact_a_risque_stop_covid: undefined,
            contact_a_risque_autre: undefined,
        })
        assert.isFalse(profil.isComplete())
    })

    it('Le questionnaire peut être partiellement rempli', function () {
        var data = {
            departement: '01',
        }
        profil.fillData(data)
        assert.include(profil.getData(), data)
        assert.isFalse(profil.isComplete())
    })

    it('Le questionnaire peut être partiellement vidé', function () {
        var data = {
            departement: '01',
        }
        profil.fillData(data)
        profil.resetData()
        assert.include(profil.getData(), {
            departement: undefined,
        })
    })

    it('Le questionnaire peut être complètement rempli', function () {
        var data = {
            departement: '34',
            activite_pro: false,
            activite_pro_public: false,
            activite_pro_sante: false,
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
        }
        profil.fillData(data)
        assert.deepEqual(profil.getData(), data)
        assert.isTrue(profil.isComplete())
    })

    it('Le questionnaire peut être complètement rempli mais âge < 15', function () {
        var data = {
            departement: '34',
            activite_pro: false,
            activite_pro_public: false,
            activite_pro_sante: false,
            foyer_enfants: true,
            foyer_fragile: false,
            age: '12',
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
        }
        profil.fillData(data)
        assert.deepEqual(profil.getData(), data)
        assert.isFalse(profil.isComplete())
    })

    it('Le questionnaire peut être complètement vidé', function () {
        var data = {
            departement: '34',
            activite_pro: false,
            activite_pro_public: false,
            activite_pro_sante: false,
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
        }
        profil.fillData(data)
        profil.resetData()
        assert.deepEqual(profil.getData(), {
            departement: undefined,
            activite_pro: undefined,
            activite_pro_public: undefined,
            activite_pro_sante: undefined,
            foyer_enfants: undefined,
            foyer_fragile: undefined,
            age: undefined,
            grossesse_3e_trimestre: undefined,
            poids: undefined,
            taille: undefined,
            antecedent_cardio: undefined,
            antecedent_diabete: undefined,
            antecedent_respi: undefined,
            antecedent_dialyse: undefined,
            antecedent_cancer: undefined,
            antecedent_immunodep: undefined,
            antecedent_cirrhose: undefined,
            antecedent_drepano: undefined,
            antecedent_chronique_autre: undefined,
            symptomes_actuels: undefined,
            symptomes_actuels_temperature: undefined,
            symptomes_actuels_temperature_inconnue: undefined,
            symptomes_actuels_toux: undefined,
            symptomes_actuels_odorat: undefined,
            symptomes_actuels_douleurs: undefined,
            symptomes_actuels_diarrhee: undefined,
            symptomes_actuels_fatigue: undefined,
            symptomes_actuels_alimentation: undefined,
            symptomes_actuels_souffle: undefined,
            symptomes_actuels_autre: undefined,
            symptomes_passes: undefined,
            contact_a_risque: undefined,
            contact_a_risque_meme_lieu_de_vie: undefined,
            contact_a_risque_contact_direct: undefined,
            contact_a_risque_actes: undefined,
            contact_a_risque_espace_confine: undefined,
            contact_a_risque_meme_classe: undefined,
            contact_a_risque_stop_covid: undefined,
            contact_a_risque_autre: undefined,
        })
        assert.isFalse(profil.isComplete())
    })
})
