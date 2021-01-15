import { assert } from 'chai'

import { Questionnaire } from '../questionnaire.js'

import {
    beforeSuiviIntroduction,
    beforeSuiviSymptomes,
    beforeSuiviHistorique,
} from '../questionnaire.js'

import Profil from '../profil.js'

const questionnaire = new Questionnaire()

describe('Pagination', function () {
    describe('Ma situation', function () {
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
            })
            assert.strictEqual(
                questionnaire.before('situation', profil),
                'contactarisque'
            )
        })
        it('ok d’aller à la question situation si réponse à contact à risque', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('situation', profil))
        })
        it('ok d’aller à la question situation même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                activite_pro: false,
            })
            assert.isUndefined(questionnaire.before('situation', profil))
        })
    })

    describe('Ma santé', function () {
        it('redirige vers question situation si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.strictEqual(questionnaire.before('sante', profil), 'situation')
        })
        it('ok d’aller à la question sante si réponse à situation', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                activite_pro: false,
            })
            assert.isUndefined(questionnaire.before('sante', profil))
        })
        it('ok d’aller à la question santé même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                activite_pro: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_trisomie: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
            })
            assert.isUndefined(questionnaire.before('sante', profil))
        })
    })

    describe('Mes symptômes actuels', function () {
        it('ok d’aller aux symptômes actuels en tout temps', function () {
            const profil = new Profil('mes_infos', {})
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
        it('ok d’aller aux symptômes actuels même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
            })
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
    })

    describe('Mes symptômes passés', function () {
        it('redirige vers question symptômes actuels si réponse manquante', function () {
            const profil = new Profil('mes_infos', {})
            assert.strictEqual(
                questionnaire.before('symptomespasses', profil),
                'symptomesactuels'
            )
        })
        it('ok d’aller à la question symptômes passés si réponse négative à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('ok d’aller à la question symptômes passés si réponse positive à symptômes actuels mais que autre', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('ok d’aller à la question symptômes passés même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('redirige vers début symptômes si réponse positive à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_autre: false,
            })
            assert.strictEqual(
                questionnaire.before('symptomespasses', profil),
                'debutsymptomes'
            )
        })
    })

    describe('Mes contacts à risque', function () {
        it('redirige vers question symptômes passés si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'symptomespasses'
            )
        })
        it('ok d’aller à la question contact à risque si réponse négative à symptômes actuels et symptômes passés', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question contact à risque si réponse négative à symptômes passés et positive mais autre à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question contact à risque même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('redirige vers début symptômes si réponse positive à symptômes passés', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'debutsymptomes'
            )
        })
    })

    describe('Mon dépistage', function () {
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.strictEqual(
                questionnaire.before('depistage', profil),
                'contactarisque'
            )
        })
        it('redirige vers début symptômes si réponse positive à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_autre: false,
            })
            assert.strictEqual(
                questionnaire.before('depistage', profil),
                'debutsymptomes'
            )
        })
        it('ok d’aller à la question dépistage si réponse contact à risque négative', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('depistage', profil))
        })
        it('ok d’aller à la question dépistage si réponse contact à risque positive', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: true,
            })
            assert.isUndefined(questionnaire.before('depistage', profil))
        })
        it('ok d’aller à la question dépistage même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
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
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_trisomie: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
                activite_pro: false,
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('redirige vers début symptômes si symptômes actuels et réponses manquantes', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'debutsymptomes'
            )
        })
        it('redirige vers début symptômes si symptômes passés et réponses manquantes', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'debutsymptomes'
            )
        })
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomespasses'
            )
        })
        it('redirige vers question symptômes passés si symptômes actuels autres', function () {
            const profil = new Profil('mes_infos', {
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
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomesactuels'
            )
        })
        it('redirige vers question symptômes passés si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomespasses'
            )
        })
        it('redirige vers question situation si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_trisomie: false,
                antecedent_chronique_autre: false,
                age: 42,
                grossesse_3e_trimestre: false,
                poids: 80,
                taille: 180,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'situation')
        })
        it('redirige vers pediatrie si age < 15', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_enfants: false,
                antecedent_cardio: false,
                antecedent_diabete: false,
                antecedent_respi: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_immunodep: false,
                antecedent_cirrhose: false,
                antecedent_drepano: false,
                antecedent_trisomie: false,
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
                activite_pro_sante: false,
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
                activite_pro_sante: false,
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
                activite_pro_sante: false,
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
                activite_pro_sante: false,
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
                activite_pro_sante: false,
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
                contact_a_risque_meme_classe: false,
                contact_a_risque_stop_covid: false,
                contact_a_risque_autre: true,
                suivi_active: true,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
                suivi: [{ foo: 'bar' }, { baz: 'quux' }],
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('redirige suivi introduction vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
                activite_pro: false,
                activite_pro_sante: false,
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
            })
            assert.strictEqual(
                beforeSuiviIntroduction(profil, questionnaire),
                'symptomesactuels'
            )
        })
        it('redirige suivi symptômes vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
                activite_pro: false,
                activite_pro_sante: false,
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
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(
                beforeSuiviSymptomes(profil, questionnaire),
                'symptomesactuels'
            )
        })
        it('redirige suivi historique vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
                activite_pro: false,
                activite_pro_sante: false,
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
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(
                beforeSuiviHistorique(profil, questionnaire),
                'symptomesactuels'
            )
        })
        it('ok d’aller au suivi symptômes sans date de début symptômes ni symptômes (asymptomatique)', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
                activite_pro: false,
                activite_pro_sante: false,
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
                contact_a_risque: false,
                contact_a_risque_meme_lieu_de_vie: false,
                contact_a_risque_contact_direct: false,
                contact_a_risque_actes: false,
                contact_a_risque_espace_confine: false,
                contact_a_risque_meme_classe: false,
                contact_a_risque_stop_covid: false,
                contact_a_risque_autre: false,
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
            })
            assert.isUndefined(beforeSuiviSymptomes(profil, questionnaire))
        })
        it('ok d’aller au suivi historique sans date de début symptômes ni symptômes (asymptomatique)', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
                activite_pro: false,
                activite_pro_sante: false,
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
                contact_a_risque: false,
                contact_a_risque_meme_lieu_de_vie: false,
                contact_a_risque_contact_direct: false,
                contact_a_risque_actes: false,
                contact_a_risque_espace_confine: false,
                contact_a_risque_meme_classe: false,
                contact_a_risque_stop_covid: false,
                contact_a_risque_autre: false,
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
            })
            assert.isUndefined(beforeSuiviHistorique(profil, questionnaire))
        })
    })
})
