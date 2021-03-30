import { assert } from 'chai'

import { Questionnaire } from '../questionnaire'

import {
    beforeSuiviIntroduction,
    beforeSuiviSymptomes,
    beforeSuiviHistorique,
} from '../questionnaire'

import Profil from '../profil'

const questionnaire = new Questionnaire()

describe('Pagination', function () {
    describe('Mes vaccins', function () {
        it('ok d’aller aux vaccins en tout temps', function () {
            const profil = new Profil('mes_infos', {})
            assert.isUndefined(questionnaire.before('vaccins', profil))
        })
        it('ok d’aller aux vaccins même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
            })
            assert.isUndefined(questionnaire.before('vaccins', profil))
        })
    })

    describe('Mes symptômes', function () {
        it('redirige vers question vaccins si réponse manquante', function () {
            const profil = new Profil('mes_infos', {})
            assert.strictEqual(questionnaire.before('symptomes', profil), 'vaccins')
        })
        it('ok d’aller aux symptômes si réponse aux vaccins', function () {
            const profil = new Profil('mes_infos', { vaccins: false })
            assert.isUndefined(questionnaire.before('symptomes', profil))
        })
        it('ok d’aller aux symptômes même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: true,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('symptomes', profil))
        })
    })

    describe('Ma situation', function () {
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
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
                vaccins: false,
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('situation', profil))
        })
        it('ok d’aller à la question situation même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_autres_personnes: false,
                foyer_enfants: false,
                activite_pro: false,
                activite_pro_sante: false,
            })
            assert.isUndefined(questionnaire.before('situation', profil))
        })
    })

    describe('Ma santé', function () {
        it('redirige vers question situation si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.strictEqual(questionnaire.before('sante', profil), 'situation')
        })
        it('ok d’aller à la question sante si réponse à situation', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_autres_personnes: false,
                foyer_enfants: false,
                activite_pro: false,
                activite_pro_sante: false,
            })
            assert.isUndefined(questionnaire.before('sante', profil))
        })
        it('ok d’aller à la question santé même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                depistage: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_autres_personnes: false,
                foyer_enfants: false,
                activite_pro: false,
                activite_pro_sante: false,
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

    describe('Mes contacts à risque', function () {
        it('redirige vers question symptômes si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'symptomes'
            )
        })
        it('ok d’aller à la question contact à risque si réponse négative à symptômes actuels et symptômes passés', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question contact à risque si réponse négative à symptômes passés et positive mais autre à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question contact à risque même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('redirige vers symptômes si réponse positive à symptômes passés', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'symptomes'
            )
        })
    })

    describe('Mon dépistage', function () {
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.strictEqual(
                questionnaire.before('depistage', profil),
                'contactarisque'
            )
        })
        it('redirige vers symptômes si réponse positive à symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: false,
            })
            assert.strictEqual(questionnaire.before('depistage', profil), 'symptomes')
        })
        it('ok d’aller à la question dépistage si réponse contact à risque négative', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('depistage', profil))
        })
        it('ok d’aller à la question dépistage si réponse contact à risque positive', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: true,
                contact_a_risque_variante: 'aucune',
            })
            assert.isUndefined(questionnaire.before('depistage', profil))
        })
        it('ok d’aller à la question dépistage même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
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
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_autres_personnes: false,
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
                activite_pro_sante: false,
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('redirige vers symptômes si symptômes actuels et réponses manquantes', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: true,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'symptomes')
        })
        it('redirige vers symptômes si symptômes passés et réponses manquantes', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'symptomes')
        })
        it('redirige vers question contact à risque si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'contactarisque'
            )
        })
        it('redirige vers question symptômes si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'symptomes')
        })
        it('redirige vers question symptômes si symptômes actuels autres', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'symptomes')
        })
        it('redirige vers question vaccins si réponse manquante', function () {
            const profil = new Profil('mes_infos', {})
            assert.strictEqual(questionnaire.before('conseils', profil), 'vaccins')
        })
        it('redirige vers question symptômes si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                vaccins: false,
                symptomes_actuels: false,
            })
            assert.strictEqual(questionnaire.before('conseils', profil), 'symptomes')
        })
        it('redirige vers question situation si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_autres_personnes: false,
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
                vaccins: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
                departement: '80',
                foyer_autres_personnes: false,
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
                activite_pro_sante: false,
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: true,
                contact_a_risque_variante: 'aucune',
                suivi_active: true,
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller à l’introduction si profil sans sous-options activité pro', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
                activite_pro: false,
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: true,
                contact_a_risque_variante: 'aucune',
                suivi_active: true,
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller à la date des symptômes si profil complet', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: true,
                contact_a_risque_variante: 'aucune',
                suivi_active: true,
            })
            assert.isUndefined(beforeSuiviIntroduction(profil, questionnaire))
        })
        it('ok d’aller à la question suivi médecin si profil complet', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: true,
                contact_a_risque_variante: 'aucune',
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: true,
                contact_a_risque_variante: 'aucune',
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: true,
                contact_a_risque_variante: 'aucune',
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
            })
            assert.strictEqual(
                beforeSuiviIntroduction(profil, questionnaire),
                'vaccins'
            )
        })
        it('redirige suivi symptômes vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
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
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(beforeSuiviSymptomes(profil, questionnaire), 'vaccins')
        })
        it('redirige suivi historique vers algo orientation si profil non complet', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
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
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(beforeSuiviHistorique(profil, questionnaire), 'vaccins')
        })
        it('ok d’aller au suivi symptômes sans date de début symptômes ni symptômes (asymptomatique)', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: false,
                contact_a_risque_variante: 'aucune',
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            assert.isUndefined(beforeSuiviSymptomes(profil, questionnaire))
        })
        it('ok d’aller au suivi historique sans date de début symptômes ni symptômes (asymptomatique)', function () {
            const profil = new Profil('mes_infos', {
                departement: '34',
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
                vaccins: false,
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
                contact_a_risque_assurance_maladie: false,
                contact_a_risque_autre: false,
                contact_a_risque_variante: 'aucune',
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            assert.isUndefined(beforeSuiviHistorique(profil, questionnaire))
        })
    })
})
