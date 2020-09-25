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
    describe('Mon foyer', function () {
        it('redirige vers question 1 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {})
            assert.strictEqual(questionnaire.before('foyer', profil), 'residence')
        })
        it('ok d’aller à la question 2 si réponse à la 1', function () {
            const profil = new Profil('mes_infos', { departement: '80' })
            assert.isUndefined(questionnaire.before('foyer', profil))
        })
        it('ok d’aller à la question 2 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                departement: '80',
                foyer_enfants: false,
            })
            assert.isUndefined(questionnaire.before('foyer', profil))
        })
    })

    describe('Mes antécédents', function () {
        it('redirige vers question 2 si réponse manquante', function () {
            const profil = new Profil('mes_infos', { departement: '80' })
            assert.strictEqual(questionnaire.before('antecedents', profil), 'foyer')
        })
        it('ok d’aller à la question 3 si réponse à la 2', function () {
            const profil = new Profil('mes_infos', {
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
            })
            assert.isUndefined(questionnaire.before('antecedents', profil))
        })
        it('ok d’aller à la question 3 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
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
        it('redirige vers question 3 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
            })
            assert.strictEqual(
                questionnaire.before('caracteristiques', profil),
                'antecedents'
            )
        })

        it('ok d’aller à la question 4 si réponse à la 3', function () {
            const profil = new Profil('mes_infos', {
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
        it('ok d’aller à la question 3 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
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
        it('redirige vers question 4 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
            })
            assert.strictEqual(
                questionnaire.before('activitepro', profil),
                'caracteristiques'
            )
        })
        it('redirige vers pédiatrie si âge inférieur à 15', function () {
            const profil = new Profil('mes_infos', {
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
        it('ok d’aller à la question 5 si réponse à la 4', function () {
            const profil = new Profil('mes_infos', {
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
        it('ok d’aller à la question 5 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
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
        // Début rattrapage profession libérale.
        it('redirige vers question 5 si activité pro mais pas profession libérale', function () {
            const profil = new Profil('mes_infos', {
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
                activite_pro: true,
            })
            assert.strictEqual(
                questionnaire.before('symptomesactuels', profil),
                'activitepro'
            )
        })
        it('ok d’aller à la question 6 si réponse vraie à la 5 + profession libérale', function () {
            const profil = new Profil('mes_infos', {
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
                activite_pro: true,
                activite_pro_liberal: false,
            })
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
        // Fin rattrapage profession libérale.

        it('redirige vers question 5 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
            assert.strictEqual(
                questionnaire.before('symptomesactuels', profil),
                'activitepro'
            )
        })
        it('ok d’aller à la question 6 si réponse à la 5', function () {
            const profil = new Profil('mes_infos', {
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
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
        it('ok d’aller à la question 6 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
            })
            assert.isUndefined(questionnaire.before('symptomesactuels', profil))
        })
    })

    describe('Mes symptômes passés', function () {
        it('redirige vers question 6 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
            assert.strictEqual(
                questionnaire.before('symptomespasses', profil),
                'symptomesactuels'
            )
        })
        it('ok d’aller à la question 7 si réponse négative à la 6', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('ok d’aller à la question 7 si réponse positive à la 6 mais que autre', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('ok d’aller à la question 7 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('symptomespasses', profil))
        })
        it('redirige vers conseils si réponse positive à la 6', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: true,
                symptomes_actuels_autre: false,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(
                questionnaire.before('symptomespasses', profil),
                'conseils'
            )
        })
    })

    describe('Mes contacts à risque', function () {
        it('redirige vers question 7 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'symptomespasses'
            )
        })
        it('ok d’aller à la question 8 si réponse négative aux 6 et 7', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question 8 si réponse négative à la 7 et positive mais autre à la 6', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
                symptomes_passes: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('ok d’aller à la question 8 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('contactarisque', profil))
        })
        it('redirige vers conseils si réponse positive à la 6', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: true,
                symptomes_actuels_autre: false,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'conseils'
            )
        })
        it('redirige vers conseils si réponse positive à la 7', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.strictEqual(
                questionnaire.before('contactarisque', profil),
                'conseils'
            )
        })
    })

    describe('Mes conseils', function () {
        it('ok d’aller aux conseils si toutes les réponses', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('ok d’aller aux conseils si symptômes actuels', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: true,
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('ok d’aller aux conseils si symptômes passés', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: true,
            })
            assert.isUndefined(questionnaire.before('conseils', profil))
        })
        it('redirige vers question 8 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: false,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'contactarisque'
            )
        })
        it('redirige vers question 7 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomespasses'
            )
        })
        it('redirige vers question 7 si symptômes actuels autres', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomespasses'
            )
        })
        it('redirige vers question 6 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
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
            assert.strictEqual(
                questionnaire.before('conseils', profil),
                'symptomesactuels'
            )
        })
        it('redirige vers pediatrie si age < 15', function () {
            const profil = new Profil('mes_infos', {
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
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
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
                'symptomesactuels'
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
            assert.strictEqual(
                beforeSuiviDate(profil, questionnaire),
                'symptomesactuels'
            )
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
            assert.strictEqual(
                beforeSuiviSymptomes(profil, questionnaire),
                'symptomesactuels'
            )
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
                'symptomesactuels'
            )
        })
    })
})
