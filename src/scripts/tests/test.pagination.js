import { assert } from 'chai'

import { questions } from '../questionnaire.js'

import Profil from '../profil.js'

describe('Pagination', function () {
    describe('Mon foyer', function () {
        it('redirige vers question 1 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {})
            assert.strictEqual(questions.foyer.before(profil), 'residence')
        })
        it('ok d’aller à la question 2 si réponse à la 1', function () {
            const profil = new Profil('mes_infos', { departement: '80' })
            assert.isUndefined(questions.foyer.before(profil))
        })
        it('ok d’aller à la question 2 même si déjà répondu', function () {
            const profil = new Profil('mes_infos', {
                departement: '80',
                foyer_enfants: false,
            })
            assert.isUndefined(questions.foyer.before(profil))
        })
    })

    describe('Mes antécédents', function () {
        it('redirige vers question 2 si réponse manquante', function () {
            const profil = new Profil('mes_infos', { departement: '80' })
            assert.strictEqual(questions.antecedents.before(profil), 'foyer')
        })
        it('ok d’aller à la question 3 si réponse à la 2', function () {
            const profil = new Profil('mes_infos', {
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
            })
            assert.isUndefined(questions.antecedents.before(profil))
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
            assert.isUndefined(questions.antecedents.before(profil))
        })
    })

    describe('Mes caractéristiques', function () {
        it('redirige vers question 3 si réponse manquante', function () {
            const profil = new Profil('mes_infos', {
                departement: '80',
                foyer_enfants: false,
                foyer_fragile: false,
            })
            assert.strictEqual(questions.caracteristiques.before(profil), 'antecedents')
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
            assert.isUndefined(questions.caracteristiques.before(profil))
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
            assert.isUndefined(questions.caracteristiques.before(profil))
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
            assert.strictEqual(questions.activitepro.before(profil), 'caracteristiques')
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
            assert.strictEqual(questions.activitepro.before(profil), 'pediatrie')
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
            assert.isUndefined(questions.activitepro.before(profil))
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
            assert.isUndefined(questions.activitepro.before(profil))
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
            assert.strictEqual(questions.symptomesactuels.before(profil), 'activitepro')
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
            assert.isUndefined(questions.symptomesactuels.before(profil))
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
            assert.strictEqual(questions.symptomesactuels.before(profil), 'activitepro')
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
            assert.isUndefined(questions.symptomesactuels.before(profil))
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
            assert.isUndefined(questions.symptomesactuels.before(profil))
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
                questions.symptomespasses.before(profil),
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
            assert.isUndefined(questions.symptomespasses.before(profil))
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
            assert.isUndefined(questions.symptomespasses.before(profil))
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
            assert.isUndefined(questions.symptomespasses.before(profil))
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
            assert.strictEqual(questions.symptomespasses.before(profil), 'conseils')
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
                questions.contactarisque.before(profil),
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
            assert.isUndefined(questions.contactarisque.before(profil))
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
            assert.isUndefined(questions.contactarisque.before(profil))
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
            assert.isUndefined(questions.contactarisque.before(profil))
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
            assert.strictEqual(questions.contactarisque.before(profil), 'conseils')
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
            assert.strictEqual(questions.contactarisque.before(profil), 'conseils')
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
            assert.isUndefined(questions.conseils.before(profil))
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
            assert.isUndefined(questions.conseils.before(profil))
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
            assert.isUndefined(questions.conseils.before(profil))
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
            assert.strictEqual(questions.conseils.before(profil), 'contactarisque')
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
            assert.strictEqual(questions.conseils.before(profil), 'symptomespasses')
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
            assert.strictEqual(questions.conseils.before(profil), 'symptomespasses')
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
            assert.strictEqual(questions.conseils.before(profil), 'symptomesactuels')
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
            assert.strictEqual(questions.conseils.before(profil), 'pediatrie')
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
            assert.isUndefined(questions.suiviintroduction.before(profil))
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
            assert.isUndefined(questions.suiviintroduction.before(profil))
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
            assert.isUndefined(questions.suiviintroduction.before(profil))
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
            assert.isUndefined(questions.suiviintroduction.before(profil))
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
            assert.isUndefined(questions.suiviintroduction.before(profil))
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
            assert.isUndefined(questions.suiviintroduction.before(profil))
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
            assert.strictEqual(questions.suivisymptomes.before(profil), 'suividate')
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
            assert.strictEqual(questions.suiviintroduction.before(profil), 'conseils')
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
            assert.strictEqual(questions.suividate.before(profil), 'conseils')
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
            assert.strictEqual(questions.suivisymptomes.before(profil), 'conseils')
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
            assert.strictEqual(questions.suivihistorique.before(profil), 'conseils')
        })
    })
})
