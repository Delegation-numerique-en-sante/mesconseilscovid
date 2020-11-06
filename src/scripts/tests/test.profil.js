import { assert } from 'chai'

import Profil from '../profil.js'

describe('Profil', function () {
    it('Le nom du profil n’est pas échappé', function () {
        var evil = '<script>alert("something evil")</script>'
        var profil = new Profil(evil)
        assert.strictEqual(profil.nom, '<script>alert("something evil")</script>')
    })

    it('Le questionnaire est vide par défaut', function () {
        var profil = new Profil('mes_infos')
        assert.deepEqual(profil.getData(), {
            departement: undefined,
            activite_pro: undefined,
            activite_pro_public: undefined,
            activite_pro_sante: undefined,
            activite_pro_liberal: undefined,
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
            depistage: undefined,
            depistage_resultat: undefined,
            _depistage_start_date: undefined,
            suivi_active: false,
            _suivi_start_date: undefined,
            _symptomes_start_date: undefined,
            _deconfinement_date: undefined,
            suivi: [],
            questionnaire_started: false,
            questionnaire_completed: false,
        })
        assert.isFalse(profil.isComplete())
        assert.isTrue(profil.isEmpty())
    })

    it('La valeur de suivi_start_date est stockée sous forme de chaîne', function () {
        var profil = new Profil('mes_infos')
        var date = new Date('2020-07-09T14:03:41.000Z')
        profil.suivi_start_date = date
        assert.strictEqual(profil._suivi_start_date, '2020-07-09T14:03:41.000Z')
        assert.typeOf(profil._suivi_start_date, 'string')
        assert.deepEqual(profil.suivi_start_date, date)
        assert.typeOf(profil.suivi_start_date, 'date')
    })

    it('La valeur de suivi_start_date peut être indéfinie', function () {
        var profil = new Profil('mes_infos')
        assert.isUndefined(profil._suivi_start_date, undefined)
        assert.isUndefined(profil.suivi_start_date, undefined)
        profil.suivi_start_date = undefined
        assert.isUndefined(profil._suivi_start_date, undefined)
        assert.isUndefined(profil.suivi_start_date, undefined)
    })

    it('On peut ajouter et récupérer un état au suivi', function () {
        var profil = new Profil('mes_infos')
        assert.deepEqual(profil.suivi, [])
        var etat = {
            date: new Date('2020-07-09T14:03:41.000Z').toJSON(),
        }
        profil.ajouterEtat(etat)
        assert.deepEqual(profil.suivi, [
            {
                date: '2020-07-09T14:03:41.000Z',
            },
        ])
        var etat2 = {
            date: new Date('2020-07-10T14:03:41.000Z').toJSON(),
        }
        profil.ajouterEtat(etat2)
        assert.deepEqual(profil.dernierEtat(), etat2)
    })

    it('Le questionnaire peut être partiellement rempli', function () {
        var profil = new Profil('mes_infos')
        var data = {
            departement: '01',
        }
        profil.fillData(data)
        assert.include(profil.getData(), data)
        assert.isFalse(profil.isComplete())
        assert.isFalse(profil.isEmpty())
    })

    it('Le questionnaire peut être partiellement vidé', function () {
        var profil = new Profil('mes_infos', {
            departement: '01',
        })
        profil.resetData()
        assert.include(profil.getData(), {
            departement: undefined,
        })
    })

    it('Le questionnaire peut être complètement rempli', function () {
        var profil = new Profil('mes_infos')
        var data = {
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
            depistage_resultat: 'positif',
            _depistage_start_date: new Date().toJSON(),
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [],
            questionnaire_started: true,
            questionnaire_completed: true,
        }
        profil.fillData(data)
        assert.deepEqual(profil.getData(), data)
        assert.isTrue(profil.isComplete())
        assert.isFalse(profil.isEmpty())
        assert.isTrue(profil.estPositifAsymptomatique())
    })

    it('Le questionnaire peut être complètement rempli mais âge < 15', function () {
        var profil = new Profil('mes_infos')
        var data = {
            departement: '34',
            activite_pro: false,
            activite_pro_public: false,
            activite_pro_sante: false,
            activite_pro_liberal: false,
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
            depistage: true,
            depistage_resultat: 'positif',
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [],
            questionnaire_started: true,
            questionnaire_completed: true,
        }
        profil.fillData(data)
        assert.deepEqual(profil.getData(), data)
        assert.isTrue(profil.isComplete())
        assert.isFalse(profil.isEmpty())
    })

    it('Le questionnaire peut être complètement vidé', function () {
        var profil = new Profil('mes_infos', {
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
            depistage_resultat: 'positif',
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [{ foo: 'bar' }],
            questionnaire_started: true,
            questionnaire_completed: true,
        })
        profil.resetData()
        assert.deepEqual(profil.getData(), {
            departement: undefined,
            activite_pro: undefined,
            activite_pro_public: undefined,
            activite_pro_sante: undefined,
            activite_pro_liberal: undefined,
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
            depistage: undefined,
            depistage_resultat: undefined,
            _depistage_start_date: undefined,
            suivi_active: false,
            _suivi_start_date: undefined,
            _symptomes_start_date: undefined,
            _deconfinement_date: undefined,
            suivi: [],
            questionnaire_started: false,
            questionnaire_completed: false,
        })
        assert.isFalse(profil.isComplete())
        assert.isTrue(profil.isEmpty())
    })

    it('Le suivi seul peut être complètement vidé', function () {
        var profil = new Profil('mes_infos', {
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
            depistage_resultat: 'positif',
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [{ foo: 'bar' }],
            questionnaire_started: true,
            questionnaire_completed: true,
        })
        profil.resetSuivi()
        assert.deepEqual(profil.getData(), {
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
            depistage_resultat: 'positif',
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: undefined,
            _symptomes_start_date: undefined,
            _deconfinement_date: undefined,
            suivi: [],
            questionnaire_started: true,
            questionnaire_completed: true,
        })
        assert.isTrue(profil.isComplete())
        assert.isFalse(profil.isEmpty())
    })

    it('Le questionnaire n’est pas commencé par défaut', function () {
        var profil = new Profil('mes_infos')
        assert.isFalse(profil.questionnaire_started)
    })

    it('Le questionnaire n’est pas terminé par défaut', function () {
        var profil = new Profil('mes_infos')
        assert.isFalse(profil.questionnaire_completed)
    })
    it('Le questionnaire n’est pas commencé après réinitialisation', function () {
        var profil = new Profil('mes_infos')
        profil.questionnaire_started = true
        profil.resetData()
        assert.isFalse(profil.questionnaire_started)
    })

    it('Le questionnaire n’est pas terminé après réinitialisation', function () {
        var profil = new Profil('mes_infos')
        profil.questionnaire_completed = true
        profil.resetData()
        assert.isFalse(profil.questionnaire_completed)
    })

    it('Le questionnaire est commencé si on a au moins une réponse', function () {
        var profil = new Profil('mes_infos', {
            departement: '80',
        })
        assert.isTrue(profil.questionnaire_started)
    })

    it('Le questionnaire est terminé si on a toutes les réponses', function () {
        var profil = new Profil('mes_infos', {
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
            depistage: false,
        })
        assert.isTrue(profil.questionnaire_completed)
        assert.isFalse(profil.estPositifAsymptomatique())
    })
})
