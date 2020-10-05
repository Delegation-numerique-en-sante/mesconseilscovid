import { assert } from 'chai'

import { Questionnaire } from '../questionnaire.js'

import {
    beforeSuiviIntroduction,
    beforeSuiviDate,
    beforeSuiviSymptomes,
    beforeSuiviHistorique,
} from '../router.js'

import Profil from '../profil.js'

const questionnaire = new Questionnaire()

describe('Pagination', function () {
    describe('Ma résidence', function () {
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
            })
            assert.strictEqual(
                questionnaire.before('residence', profil),
                'contactarisque'
            )
        })
        it('ok d’aller à la question résidence si réponse à contact à risque', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('residence', profil))
        })
        it('ok d’aller à la question résidence même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
            })
            assert.isUndefined(questionnaire.before('residence', profil))
        })
    })

    describe('Mon foyer', function () {
        it('redirige vers question résidence si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.strictEqual(questionnaire.before('foyer', profil), 'residence')
        })
        it('ok d’aller à la question foyer si réponse à résidence', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
            })
            assert.isUndefined(questionnaire.before('foyer', profil))
        })
        it('ok d’aller à la question foyer même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
            })
            assert.isUndefined(questionnaire.before('foyer', profil))
        })
    })

    describe('Mes antécédents', function () {
        it('redirige vers question foyer si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
            })
            assert.strictEqual(questionnaire.before('antecedents', profil), 'foyer')
        })
        it('ok d’aller à la question antécédents si réponse à foyer', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
            })
            assert.isUndefined(questionnaire.before('antecedents', profil))
        })
        it('ok d’aller à la question antécédents même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
            })
            assert.isUndefined(questionnaire.before('antecedents', profil))
        })
    })

    describe('Mes caractéristiques', function () {
        it('redirige vers question antécédents si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
            })
            assert.strictEqual(
                questionnaire.before('caracteristiques', profil),
                'antecedents'
            )
        })

        it('ok d’aller à la question caractéristiques si réponse à antécédents', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
            })
            assert.isUndefined(questionnaire.before('caracteristiques', profil))
        })
        it('ok d’aller à la question caractéristiques même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
            })
            assert.isUndefined(questionnaire.before('caracteristiques', profil))
        })
    })

    describe('Mon activité', function () {
        it('redirige vers question caractéristiques si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                // Manque la taille.
            })
            assert.strictEqual(
                questionnaire.before('activitepro', profil),
                'caracteristiques'
            )
        })
        it('redirige vers pédiatrie si âge inférieur à 15', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 12,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
            })
            assert.strictEqual(questionnaire.before('activitepro', profil), 'pediatrie')
        })
        it('ok d’aller à la question activité pro si réponse à caractéristiques', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
            })
            assert.isUndefined(questionnaire.before('activitepro', profil))
        })
        it('ok d’aller à la question activité pro même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
                activite_pro: false,
            })
            assert.isUndefined(questionnaire.before('activitepro', profil))
        })
    })

    describe('Mes symptômes actuels', function () {
        it('redirige vers question dépistage si réponse manquante', function () {
            const profil = new Profil('mes_infos', {})
            assert.strictEqual(
                questionnaire.before('symptomesactuels', profil),
                'depistage'
            )
        })
        it('redirige vers conseils si réponse dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'positif',
            })
            assert.strictEqual(
                questionnaire.before('symptomesactuels', profil),
                'conseils'
            )
        })
        it('redirige vers conseils si réponse dépistage en attente', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'en_attente',
            })
            assert.strictEqual(
                questionnaire.before('symptomesactuels', profil),
                'conseils'
            )
        })
        it('ok d’aller aux symptômes actuels avec si réponse dépistage negatif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'negatif',
            })
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
        it('ok d’aller aux symptômes actuels avec si pas de dépistage', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
            })
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
        it('ok d’aller aux symptômes actuels même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'negatif',
                symptomes_actuels: false,
            })
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
    })

    describe('Mes symptômes passés', function () {
        it('redirige vers question symptômes actuels si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
            })
            assert.strictEqual(
                questionnaire.before('symptomespasses', profil),
                'symptomesactuels'
            )
        })
        it('ok d’aller à la question symptômes passés si réponse négative à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('ok d’aller à la question symptômes passés si réponse positive à symptômes actuels mais que autre', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('ok d’aller à la question symptômes passés même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('redirige vers conseils si réponse positive à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: false,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(
                questionnaire.before('symptomespasses', profil),
                'conseils'
            )
        })
        it('redirige vers conseils si réponse dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'positif',
            })
            assert.strictEqual(
                questionnaire.before('symptomesactuels', profil),
                'conseils'
            )
        })
    })

    describe('Mes contacts à risque', function () {
        it('redirige vers question symptômes passés si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'symptomespasses'
            )
        })
        it('ok d’aller à la question contact à risque si réponse négative à symptômes actuels et symptômes passés', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question contact à risque si réponse négative à symptômes passés et positive mais autre à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question contact à risque même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('redirige vers conseils si réponse positive à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: false,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'conseils'
            )
        })
        it('redirige vers conseils si réponse positive à symptômes passés', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'conseils'
            )
        })
    })

    describe('Mon dépistage', function () {
        it('ok d’aller à la question dépistage en tout temps', function () {
            const profil = new Profil('mes_infos', {})
            assert.isUndefined(questionnaire.before('depistage', profil))
        })
        it('ok d’aller à la question dépistage même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
            })
            assert.isUndefined(questionnaire.before('depistage', profil))
        })
    })

    describe('Mes conseils', function () {
        it('ok d’aller aux conseils si toutes les réponses', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
                activite_pro: false,
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('ok d’aller aux conseils si symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: true,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('ok d’aller aux conseils si symptômes passés', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'contactarisque'
            )
        })
        it('redirige vers question symptômes passés si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomespasses'
            )
        })
        it('redirige vers question symptômes passés si symptômes actuels autres', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomespasses'
            )
        })
        it('redirige vers question symptômes actuels si réponse manquante', function () {
            const profil = new Profil('mes_infos', {})
            assert.strictEqual(questionnaire.before('conseils', profil), 'depistage')
        })
        it('redirige vers question dépistage si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'depistage')
        })
        it('redirige vers question activité pro si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'activitepro')
        })
        it('redirige vers pediatrie si age < 15', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_chronique_autre: false,
                age: 12,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
                activite_pro: false,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'pediatrie')
        })
    })

    describe('Suivi', function () {
        it('ok d’aller à l’introduction si profil complet', function () {
            const profil = new Profil('mes_infos', {
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
                suivi_active: true,
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller à l’introduction si profil sans sous-options activité pro', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
                activite_pro: false,
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
                suivi_active: true,
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller à la date des symptômes si profil complet', function () {
            const profil = new Profil('mes_infos', {
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
                suivi_active: true,
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller à la question suivi médecin si profil complet', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: true,
                symptomes_actuels_temperature: true,
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
                suivi_active: true,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller au questionnaire si profil complet et date symptômes', function () {
            const profil = new Profil('mes_infos', {
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
                suivi_active: true,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller à l’historique du suivi si profil complet et date symptômes et entrée(s) dans le suivi', function () {
            const profil = new Profil('mes_infos', {
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
                suivi_active: true,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
                suivi: [{ foo: 'bar' }, { baz: 'quux' }],
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('redirige date symptômes si profil complet mais pas de date', function () {
            const profil = new Profil('mes_infos', {
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
                suivi_active: true,
            })
            assert.strictEqual(beforeSuiviSymptomes(profil, questionnaire), 'suividate')
        })
        it('redirige suivi introduction vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
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
            })
            assert.strictEqual(
                beforeSuiviIntroduction(profil, questionnaire),
                'depistage'
            )
        })
        it('redirige suivi date vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
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
            })
            assert.strictEqual(beforeSuiviDate(profil, questionnaire), 'depistage')
        })
        it('redirige suivi symptômes vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
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
            })
            assert.strictEqual(beforeSuiviSymptomes(profil, questionnaire), 'depistage')
        })
        it('redirige suivi historique vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
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
            })
            assert.strictEqual(
                beforeSuiviHistorique(profil, questionnaire),
                'depistage'
            )
        })
    })
})
