import { assert } from 'chai'

import Profil from '../../profil'
import { joursAvant } from '../../utils'

describe('Profil', function () {
    it('Le nom du profil n’est pas échappé', function () {
        var evil = '<script>alert("something evil")</script>'
        var profil = new Profil(evil)
        assert.strictEqual(profil.nom, '<script>alert("something evil")</script>')
    })

    it('Le questionnaire est vide par défaut', function () {
        var profil = new Profil('mes_infos')
        assert.deepEqual(profil.getData(), {
            activite_pro: undefined,
            activite_pro_sante: undefined,
            foyer_autres_personnes: undefined,
            foyer_enfants: undefined,
            age: undefined,
            grossesse_3e_trimestre: undefined,
            poids: undefined,
            taille: undefined,
            antecedent_cardio: undefined,
            antecedent_diabete: undefined,
            antecedent_respi: undefined,
            antecedent_dialyse: undefined,
            antecedent_greffe: undefined,
            antecedent_cancer: undefined,
            antecedent_immunodep: undefined,
            antecedent_cirrhose: undefined,
            antecedent_drepano: undefined,
            antecedent_trisomie: undefined,
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
            contact_a_risque_tousse_eternue: undefined,
            contact_a_risque_meme_classe: undefined,
            contact_a_risque_stop_covid: undefined,
            contact_a_risque_assurance_maladie: undefined,
            contact_a_risque_autre: undefined,
            contact_a_risque_variante: undefined,
            depistage: undefined,
            depistage_type: undefined,
            depistage_resultat: undefined,
            depistage_variante: undefined,
            _depistage_start_date: undefined,
            vaccins: undefined,
            covid_passee: undefined,
            _covid_passee_date: undefined,
            suivi_active: false,
            _suivi_start_date: undefined,
            _symptomes_start_date: undefined,
            _deconfinement_date: undefined,
            suivi: [],
            _questionnaire_start_date: undefined,
            _questionnaire_completion_date: undefined,
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
            activite_pro: false,
        }
        profil.fillData(data)
        assert.include(profil.getData(), data)
        assert.isFalse(profil.isComplete())
        assert.isFalse(profil.isEmpty())
    })

    it('Le questionnaire peut être partiellement vidé', function () {
        var profil = new Profil('mes_infos', {
            activite_pro: false,
        })
        profil.resetData()
        assert.include(profil.getData(), {
            activite_pro: undefined,
        })
    })

    it('Le questionnaire peut être complètement rempli', function () {
        var profil = new Profil('mes_infos')
        var data = {
            activite_pro: false,
            activite_pro_sante: false,
            foyer_autres_personnes: true,
            foyer_enfants: true,
            age: '42',
            grossesse_3e_trimestre: false,
            poids: '70',
            taille: '178',
            antecedent_cardio: false,
            antecedent_diabete: true,
            antecedent_respi: false,
            antecedent_dialyse: true,
            antecedent_greffe: true,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_trisomie: false,
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
            contact_a_risque_tousse_eternue: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_assurance_maladie: false,
            contact_a_risque_autre: true,
            contact_a_risque_variante: 'aucune',
            depistage: true,
            depistage_type: 'rt-pcr',
            depistage_resultat: 'positif',
            depistage_variante: undefined,
            _depistage_start_date: new Date().toJSON(),
            vaccins: 'completement',
            covid_passee: true,
            _covid_passee_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [],
            _questionnaire_start_date: '2020-07-09T14:03:41.000Z',
            _questionnaire_completion_date: '2020-07-09T14:03:41.000Z',
        }
        profil.fillData(data)
        assert.deepEqual(profil.getData(), data)
        assert.isTrue(profil.isComplete())
        assert.isFalse(profil.isEmpty())
        assert.isTrue(profil.depistagePositifRecentAsymptomatique())
    })

    it('Le questionnaire peut être complètement rempli mais âge < 15', function () {
        var profil = new Profil('mes_infos')
        var data = {
            activite_pro: false,
            activite_pro_sante: false,
            foyer_autres_personnes: true,
            foyer_enfants: true,
            age: '12',
            grossesse_3e_trimestre: false,
            poids: '70',
            taille: '178',
            antecedent_cardio: false,
            antecedent_diabete: true,
            antecedent_respi: false,
            antecedent_dialyse: true,
            antecedent_greffe: true,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_trisomie: false,
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
            contact_a_risque_tousse_eternue: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_assurance_maladie: false,
            contact_a_risque_autre: true,
            contact_a_risque_variante: 'aucune',
            depistage: true,
            depistage_type: 'rt-pcr',
            depistage_resultat: 'positif',
            depistage_variante: undefined,
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            vaccins: 'completement',
            covid_passee: true,
            _covid_passee_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [],
            _questionnaire_start_date: '2020-07-09T14:03:41.000Z',
            _questionnaire_completion_date: '2020-07-09T14:03:41.000Z',
        }
        profil.fillData(data)
        assert.deepEqual(profil.getData(), data)
        assert.isTrue(profil.isComplete())
        assert.isFalse(profil.isEmpty())
    })

    it('Le questionnaire peut être complètement vidé', function () {
        var profil = new Profil('mes_infos', {
            activite_pro: false,
            activite_pro_sante: false,
            foyer_autres_personnes: true,
            foyer_enfants: true,
            age: '42',
            grossesse_3e_trimestre: false,
            poids: '70',
            taille: '178',
            antecedent_cardio: false,
            antecedent_diabete: true,
            antecedent_respi: false,
            antecedent_dialyse: true,
            antecedent_greffe: true,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_trisomie: false,
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
            contact_a_risque_tousse_eternue: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_assurance_maladie: false,
            contact_a_risque_autre: true,
            contact_a_risque_variante: 'aucune',
            depistage: true,
            depistage_type: 'rt-pcr',
            depistage_resultat: 'positif',
            depistage_variante: undefined,
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            vaccins: 'completement',
            covid_passee: true,
            _covid_passee_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [{ foo: 'bar' }],
            _questionnaire_start_date: '2020-07-09T14:03:41.000Z',
            _questionnaire_completion_date: '2020-07-09T14:03:41.000Z',
        })
        profil.resetData()
        assert.deepEqual(profil.getData(), {
            activite_pro: undefined,
            activite_pro_sante: undefined,
            foyer_autres_personnes: undefined,
            foyer_enfants: undefined,
            age: undefined,
            grossesse_3e_trimestre: undefined,
            poids: undefined,
            taille: undefined,
            antecedent_cardio: undefined,
            antecedent_diabete: undefined,
            antecedent_respi: undefined,
            antecedent_dialyse: undefined,
            antecedent_greffe: undefined,
            antecedent_cancer: undefined,
            antecedent_immunodep: undefined,
            antecedent_cirrhose: undefined,
            antecedent_drepano: undefined,
            antecedent_trisomie: undefined,
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
            contact_a_risque_tousse_eternue: undefined,
            contact_a_risque_meme_classe: undefined,
            contact_a_risque_stop_covid: undefined,
            contact_a_risque_assurance_maladie: undefined,
            contact_a_risque_autre: undefined,
            contact_a_risque_variante: undefined,
            depistage: undefined,
            depistage_type: undefined,
            depistage_resultat: undefined,
            depistage_variante: undefined,
            _depistage_start_date: undefined,
            vaccins: undefined,
            covid_passee: undefined,
            _covid_passee_date: undefined,
            suivi_active: false,
            _suivi_start_date: undefined,
            _symptomes_start_date: undefined,
            _deconfinement_date: undefined,
            suivi: [],
            _questionnaire_start_date: undefined,
            _questionnaire_completion_date: undefined,
        })
        assert.isFalse(profil.isComplete())
        assert.isTrue(profil.isEmpty())
    })

    it('Le suivi seul peut être complètement vidé', function () {
        var profil = new Profil('mes_infos', {
            activite_pro: false,
            activite_pro_sante: false,
            foyer_autres_personnes: true,
            foyer_enfants: true,
            age: '42',
            grossesse_3e_trimestre: false,
            poids: '70',
            taille: '178',
            antecedent_cardio: false,
            antecedent_diabete: true,
            antecedent_respi: false,
            antecedent_dialyse: true,
            antecedent_greffe: true,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_trisomie: false,
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
            contact_a_risque_tousse_eternue: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_assurance_maladie: false,
            contact_a_risque_autre: true,
            contact_a_risque_variante: 'aucune',
            depistage: true,
            depistage_type: 'rt-pcr',
            depistage_resultat: 'positif',
            depistage_variante: undefined,
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            vaccins: 'completement',
            covid_passee: true,
            _covid_passee_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: '2020-07-09T14:03:41.000Z',
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: '2020-07-09T14:03:41.000Z',
            suivi: [{ foo: 'bar' }],
            _questionnaire_start_date: '2020-07-09T14:03:41.000Z',
            _questionnaire_completion_date: '2020-07-09T14:03:41.000Z',
        })
        profil.resetSuivi()
        assert.deepEqual(profil.getData(), {
            activite_pro: false,
            activite_pro_sante: false,
            foyer_autres_personnes: true,
            foyer_enfants: true,
            age: '42',
            grossesse_3e_trimestre: false,
            poids: '70',
            taille: '178',
            antecedent_cardio: false,
            antecedent_diabete: true,
            antecedent_respi: false,
            antecedent_dialyse: true,
            antecedent_greffe: true,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_trisomie: false,
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
            contact_a_risque_tousse_eternue: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_assurance_maladie: false,
            contact_a_risque_autre: true,
            contact_a_risque_variante: 'aucune',
            depistage: true,
            depistage_type: 'rt-pcr',
            depistage_resultat: 'positif',
            depistage_variante: undefined,
            _depistage_start_date: '2020-07-09T14:03:41.000Z',
            vaccins: 'completement',
            covid_passee: true,
            _covid_passee_date: '2020-07-09T14:03:41.000Z',
            suivi_active: true,
            _suivi_start_date: undefined,
            _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            _deconfinement_date: undefined,
            suivi: [],
            _questionnaire_start_date: '2020-07-09T14:03:41.000Z',
            _questionnaire_completion_date: '2020-07-09T14:03:41.000Z',
        })
        assert.isTrue(profil.isComplete())
        assert.isFalse(profil.isEmpty())
    })

    it('Le questionnaire n’est pas commencé par défaut', function () {
        var profil = new Profil('mes_infos')
        assert.isUndefined(profil.questionnaire_start_date)
    })

    it('Le questionnaire n’est pas terminé par défaut', function () {
        var profil = new Profil('mes_infos')
        assert.isUndefined(profil.questionnaire_completion_date)
    })

    it('Le questionnaire n’est pas commencé après réinitialisation', function () {
        var profil = new Profil('mes_infos')
        profil.questionnaire_start_date = new Date()
        profil.resetData()
        assert.isUndefined(profil.questionnaire_start_date)
    })

    it('Le questionnaire n’est pas terminé après réinitialisation', function () {
        var profil = new Profil('mes_infos')
        profil.questionnaire_start_date = new Date()
        profil.resetData()
        assert.isUndefined(profil.questionnaire_completion_date)
    })

    it('Le questionnaire est terminé si on a toutes les réponses', function () {
        var profil = new Profil('mes_infos', {
            activite_pro: false,
            activite_pro_sante: false,
            foyer_autres_personnes: true,
            foyer_enfants: true,
            age: '42',
            grossesse_3e_trimestre: false,
            poids: '70',
            taille: '178',
            antecedent_cardio: false,
            antecedent_diabete: true,
            antecedent_respi: false,
            antecedent_dialyse: true,
            antecedent_greffe: true,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_trisomie: false,
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
            contact_a_risque_tousse_eternue: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_assurance_maladie: false,
            contact_a_risque_autre: true,
            contact_a_risque_variante: 'aucune',
            depistage: false,
            vaccins: 'pas_encore',
            covid_passee: false,
            _questionnaire_start_date: new Date().toJSON(),
            _questionnaire_completion_date: new Date().toJSON(),
        })
        assert.instanceOf(profil.questionnaire_completion_date, Date)
        assert.isFalse(profil.depistagePositifRecentAsymptomatique())
    })

    it('On sait identifier les profils qui ont une Covid de plus de 6 mois', function () {
        const profil = new Profil('mes_infos')
        const date = joursAvant(200)
        profil.covid_passee = true
        profil.covid_passee_date = date
        assert.isTrue(profil.hasCovidPlus6Mois())
        assert.isTrue(profil.hasCovidPlus2Mois())
    })
    it('On sait identifier les profils qui ont une Covid de plus de 2 mois', function () {
        const profil = new Profil('mes_infos')
        const date = joursAvant(70)
        profil.covid_passee = true
        profil.covid_passee_date = date
        assert.isFalse(profil.hasCovidPlus6Mois())
        assert.isTrue(profil.hasCovidPlus2Mois())
    })
    it('On sait identifier les profils qui ont une Covid de moins de 2 mois', function () {
        const profil = new Profil('mes_infos')
        const date = joursAvant(50)
        profil.covid_passee = true
        profil.covid_passee_date = date
        assert.isFalse(profil.hasCovidPlus6Mois())
        assert.isFalse(profil.hasCovidPlus2Mois())
    })
    it('On sait identifier les profils qui n’ont pas eu la Covid', function () {
        const profil = new Profil('mes_infos')
        profil.covid_passee = false
        assert.isFalse(profil.hasCovidPlus6Mois())
        assert.isFalse(profil.hasCovidPlus2Mois())
    })
})
