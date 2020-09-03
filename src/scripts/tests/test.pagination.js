var assert = require('chai').assert

var pagination = require('../pagination.js')
var Profil = require('../profil.js').Profil
var redirectToUnansweredQuestions = pagination.redirectToUnansweredQuestions

describe('Pagination', function () {
    describe('Navigation générale', function () {
        it('ok d’aller à la page d’accueil', function () {
            assert.isUndefined(redirectToUnansweredQuestions('introduction', {}))
        })
        it('ok d’aller à la page de pédiatrie', function () {
            assert.isUndefined(redirectToUnansweredQuestions('pediatrie', {}))
        })
        it('ok d’aller à la page de médecine du travail', function () {
            assert.isUndefined(redirectToUnansweredQuestions('medecinedutravail', {}))
        })
        it('ok d’aller au conditions d’utilisation', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('conditionsutilisation', {})
            )
        })
        it('ok d’aller à la page nouvelle version disponible', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('nouvelleversiondisponible', {})
            )
        })
        it('ok d’aller à la page de saisie du nom', function () {
            assert.isUndefined(redirectToUnansweredQuestions('nom', {}))
        })
    })

    describe('Lieu de résidence', function () {
        it('ok d’aller à la question 1', function () {
            assert.isUndefined(redirectToUnansweredQuestions('residence', {}))
        })
        it('ok d’aller à la question 1 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('residence', {
                    departement: '80',
                })
            )
        })
    })

    describe('Mon foyer', function () {
        it('redirige vers question 1 si réponse manquante', function () {
            assert.strictEqual(redirectToUnansweredQuestions('foyer', {}), 'residence')
        })
        it('ok d’aller à la question 2 si réponse à la 1', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('foyer', {
                    departement: '80',
                })
            )
        })
        it('ok d’aller à la question 2 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('foyer', {
                    departement: '80',
                    foyer_enfants: false,
                })
            )
        })
    })

    describe('Mes antécédents', function () {
        it('redirige vers question 2 si réponse manquante', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('antecedents', {
                    departement: '80',
                }),
                'foyer'
            )
        })
        it('ok d’aller à la question 3 si réponse à la 2', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('antecedents', {
                    departement: '80',
                    foyer_enfants: false,
                })
            )
        })
        it('ok d’aller à la question 3 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('antecedents', {
                    departement: '80',
                    foyer_enfants: false,
                    antecedent_cardio: false,
                })
            )
        })
    })

    describe('Mes caractéristiques', function () {
        it('redirige vers question 3 si réponse manquante', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('caracteristiques', {
                    departement: '80',
                    foyer_enfants: false,
                }),
                'antecedents'
            )
        })

        it('ok d’aller à la question 4 si réponse à la 3', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('caracteristiques', {
                    departement: '80',
                    foyer_enfants: false,
                    antecedent_cardio: false,
                })
            )
        })
        it('ok d’aller à la question 3 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('caracteristiques', {
                    departement: '80',
                    foyer_enfants: false,
                    antecedent_cardio: false,
                    age: 42,
                })
            )
        })
    })

    describe('Mon activité', function () {
        it('redirige vers question 4 si réponse manquante', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('activitepro', {
                    departement: '80',
                    foyer_enfants: false,
                    antecedent_cardio: false,
                }),
                'caracteristiques'
            )
        })
        it('redirige vers question 4 si âge inférieur à 15', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('activitepro', {
                    departement: '80',
                    foyer_enfants: false,
                    age: 12,
                    antecedent_cardio: false,
                }),
                'caracteristiques'
            )
        })
        it('ok d’aller à la question 5 si réponse à la 4', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('activitepro', {
                    departement: '80',
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                })
            )
        })
        it('ok d’aller à la question 5 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('activitepro', {
                    departement: '80',
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    activite_pro: false,
                })
            )
        })
    })

    describe('Mes symptômes actuels', function () {
        // Début rattrapage profession libérale.
        it('redirige vers question 5 si activité pro mais pas profession libérale', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('symptomesactuels', {
                    departement: '80',
                    foyer_enfants: false,
                    activite_pro: true,
                    age: 42,
                    antecedent_cardio: false,
                }),
                'activitepro'
            )
        })
        it('ok d’aller à la question 6 si réponse vraie à la 5 + profession libérale', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('symptomesactuels', {
                    departement: '80',
                    foyer_enfants: false,
                    activite_pro: true,
                    activite_pro_liberal: false,
                    age: 42,
                    antecedent_cardio: false,
                })
            )
        })
        // Fin rattrapage profession libérale.

        it('redirige vers question 5 si réponse manquante', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('symptomesactuels', {
                    departement: '80',
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                }),
                'activitepro'
            )
        })
        it('ok d’aller à la question 6 si réponse à la 5', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('symptomesactuels', {
                    departement: '80',
                    activite_pro: false,
                    age: 42,
                    antecedent_cardio: false,
                    foyer_enfants: false,
                })
            )
        })
        it('ok d’aller à la question 6 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('symptomesactuels', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                })
            )
        })
    })

    describe('Mes symptômes passés', function () {
        it('redirige vers question 6 si réponse manquante', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('symptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                }),
                'symptomesactuels'
            )
        })
        it('ok d’aller à la question 7 si réponse négative à la 6', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('symptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                })
            )
        })
        it('ok d’aller à la question 7 si réponse positive à la 6 mais que autre', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('symptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                    symptomes_actuels_autre: true,
                })
            )
        })
        it('ok d’aller à la question 7 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('symptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: true,
                })
            )
        })
        it('redirige vers conseils si réponse positive à la 6', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('symptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                }),
                'conseils'
            )
        })
    })

    describe('Mes contacts à risque', function () {
        it('redirige vers question 7 si réponse manquante', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('contactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                }),
                'symptomespasses'
            )
        })
        it('ok d’aller à la question 8 si réponse négative aux 6 et 7', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('contactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                })
            )
        })
        it('ok d’aller à la question 8 si réponse négative à la 7 et positive mais autre à la 6', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('contactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                    symptomes_actuels_autre: true,
                    symptomes_passes: false,
                })
            )
        })
        it('ok d’aller à la question 8 même si déjà répondu', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('contactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                })
            )
        })
        it('redirige vers conseils si réponse positive à la 6', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('contactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                }),
                'conseils'
            )
        })
        it('redirige vers conseils si réponse positive à la 7', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('contactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: true,
                }),
                'conseils'
            )
        })
    })

    describe('Sortie 1', function () {
        it('ok d’aller à sortie 1 si symptômes actuels', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomesactuels', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 1 si symptômes actuels et target inconnu', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('inconnu', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 2 -> 1 si symptômes actuels', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 3 -> 1 si symptômes actuels', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilscontactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 4 -> 1 si symptômes actuels', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('conseils', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: true,
                })
            )
        })
    })

    describe('Sortie 2', function () {
        it('ok d’aller à sortie 2 si symptômes passés', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 2 si symptômes passés et target inconnu', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('inconnu', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 1 -> 2 si symptômes passés', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomesactuels', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 3 -> 2 si symptômes passés', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilscontactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 4 -> 2 si symptômes passés', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('conseils', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: true,
                })
            )
        })
    })

    describe('Sortie 3', function () {
        it('ok d’aller à sortie 3 si symptômes passés', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilscontactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 3 si symptômes passés et target inconnu', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('inconnu', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 1 -> 3 si contact à risque', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomesactuels', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 2 -> 3 si contact à risque', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: true,
                }),
                'conseils'
            )
        })
        it('redirige sortie 4 -> 3 si contact à risque', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('conseils', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: true,
                })
            )
        })
    })

    describe('Sortie 4', function () {
        it('ok d’aller à sortie 4 si ni symptôme ni contact', function () {
            assert.isUndefined(
                redirectToUnansweredQuestions('conseils', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                })
            )
        })
        it('redirige sortie 4 si ni symptôme ni contact et target inconnu', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('inconnu', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                }),
                'conseils'
            )
        })
        it('redirige sortie 4 si âge inférieur à 15 ans', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseils', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 12,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                }),
                'caracteristiques'
            )
        })
        it('redirige sortie 1 -> 4 si ni symptôme ni contact', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomesactuels', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                }),
                'conseils'
            )
        })
        it('redirige sortie 2 -> 4 si ni symptôme ni contact', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilssymptomespasses', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                }),
                'conseils'
            )
        })
        it('redirige sortie 3 -> 4 si ni symptôme ni contact', function () {
            assert.strictEqual(
                redirectToUnansweredQuestions('conseilscontactarisque', {
                    departement: '80',
                    activite_pro: false,
                    foyer_enfants: false,
                    age: 42,
                    antecedent_cardio: false,
                    symptomes_actuels: false,
                    symptomes_passes: false,
                    contact_a_risque: false,
                }),
                'conseils'
            )
        })
    })

    describe('Suivi', function () {
        it('ok d’aller à l’introduction si profil complet', function () {
            const profil = new Profil()
            profil.fillData({
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
            })
            assert.isUndefined(
                redirectToUnansweredQuestions('suiviintroduction', profil)
            )
        })
        it('ok d’aller à la date des symptômes si profil complet', function () {
            const profil = new Profil()
            profil.fillData({
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
            })
            assert.isUndefined(redirectToUnansweredQuestions('suividate', profil))
        })
        it('ok d’aller à la question suivi médecin si profil complet', function () {
            const profil = new Profil()
            profil.fillData({
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
            })
            assert.isUndefined(redirectToUnansweredQuestions('suivimedecin', profil))
        })
        it('ok d’aller au questionnaire si profil complet et date symptômes', function () {
            const profil = new Profil()
            profil.fillData({
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
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
            })
            assert.isUndefined(redirectToUnansweredQuestions('suivisymptomes', profil))
        })
        it('ok d’aller à l’historique du suivi si profil complet et date symptômes et entrée(s) dans le suivi', function () {
            const profil = new Profil()
            profil.fillData({
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
                _symptomes_start_date: '2020-07-09T14:03:41.000Z',
                suivi: [{ foo: 'bar' }, { baz: 'quux' }],
            })
            assert.isUndefined(redirectToUnansweredQuestions('suivihistorique', profil))
        })
        it('redirige date symptômes si profil complet mais pas de date', function () {
            const profil = new Profil()
            profil.fillData({
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
            })
            assert.strictEqual(
                redirectToUnansweredQuestions('suivisymptomes', profil),
                'suividate'
            )
        })
        it('redirige suivi introduction vers algo orientation si profil non complet', function () {
            const profil = new Profil()
            profil.fillData({
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
                redirectToUnansweredQuestions('suiviintroduction', profil),
                'symptomesactuels'
            )
        })
        it('redirige suivi médecin vers algo orientation si profil non complet', function () {
            const profil = new Profil()
            profil.fillData({
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
                redirectToUnansweredQuestions('suivimedecin', profil),
                'symptomesactuels'
            )
        })
        it('redirige suivi date vers algo orientation si profil non complet', function () {
            const profil = new Profil()
            profil.fillData({
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
                redirectToUnansweredQuestions('suividate', profil),
                'symptomesactuels'
            )
        })
        it('redirige suivi symptômes vers algo orientation si profil non complet', function () {
            const profil = new Profil()
            profil.fillData({
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
                redirectToUnansweredQuestions('suivisymptomes', profil),
                'symptomesactuels'
            )
        })
        it('redirige suivi historique vers algo orientation si profil non complet', function () {
            const profil = new Profil()
            profil.fillData({
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
                redirectToUnansweredQuestions('suivihistorique', profil),
                'symptomesactuels'
            )
        })
    })
})
