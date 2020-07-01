var assert = require('chai').assert

var pagination = require('../pagination.js')
var redirectToUnansweredQuestions = pagination.redirectToUnansweredQuestions

describe('Navigation générale', function () {
    it('page inconnue renvoie au début', function () {
        assert.strictEqual(redirectToUnansweredQuestions('foo', {}), 'introduction')
    })
    it('ok d’aller à la page d’accueil', function () {
        assert.isUndefined(redirectToUnansweredQuestions('introduction', {}))
    })
    it('ok d’aller à la page de pédiatrie', function () {
        assert.isUndefined(redirectToUnansweredQuestions('pediatrie', {}))
    })
    it('ok d’aller au conditions d’utilisation', function () {
        assert.isUndefined(redirectToUnansweredQuestions('conditionsutilisation', {}))
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

describe('Navigation lieu de résidence', function () {
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

describe('Navigation mon activité', function () {
    it('redirige vers l’accueil si réponse 1 manquante', function () {
        assert.strictEqual(
            redirectToUnansweredQuestions('activitepro', {}),
            'introduction'
        )
    })
    it('ok d’aller à la question 2 si réponse à la 1', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('activitepro', { departement: '80' })
        )
    })
    it('ok d’aller à la question 2 même si déjà répondu', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('activitepro', {
                departement: '80',
                activite_pro: false,
            })
        )
    })
})

describe('Navigation mon foyer', function () {
    it('redirige vers question 2 si réponse manquante', function () {
        assert.strictEqual(
            redirectToUnansweredQuestions('foyer', { departement: '80' }),
            'activitepro'
        )
    })
    it('ok d’aller à la question 3 si réponse à la 2', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('foyer', {
                departement: '80',
                activite_pro: false,
            })
        )
    })
    it('ok d’aller à la question 3 même si déjà répondu', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('foyer', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
            })
        )
    })
})

describe('Navigation mes caractéristiques', function () {
    it('redirige vers question 3 si réponse manquante', function () {
        assert.strictEqual(
            redirectToUnansweredQuestions('caracteristiques', {
                departement: '80',
                activite_pro: false,
            }),
            'foyer'
        )
    })
    it('ok d’aller à la question 4 si réponse à la 3', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('caracteristiques', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
            })
        )
    })
    it('ok d’aller à la question 4 même si déjà répondu', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('caracteristiques', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                age: 42,
            })
        )
    })
})

describe('Navigation mes antécédents', function () {
    it('redirige vers question 4 si réponse manquante', function () {
        assert.strictEqual(
            redirectToUnansweredQuestions('antecedents', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
            }),
            'caracteristiques'
        )
    })
    it('redirige vers question 4 si âge inférieur à 15', function () {
        assert.strictEqual(
            redirectToUnansweredQuestions('antecedents', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                age: 12,
            }),
            'caracteristiques'
        )
    })
    it('ok d’aller à la question 5 si réponse à la 4', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('antecedents', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                age: 42,
            })
        )
    })
    it('ok d’aller à la question 5 même si déjà répondu', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('antecedents', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                age: 42,
                antecedent_cardio: false,
            })
        )
    })
})

describe('Navigation mes symptômes actuels', function () {
    it('redirige vers question 5 si réponse manquante', function () {
        assert.strictEqual(
            redirectToUnansweredQuestions('symptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                age: 42,
            }),
            'antecedents'
        )
    })
    it('ok d’aller à la question 6 si réponse à la 5', function () {
        assert.isUndefined(
            redirectToUnansweredQuestions('symptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                age: 42,
                antecedent_cardio: false,
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

describe('Navigation mes symptômes passés', function () {
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

describe('Navigation mes contacts à risque', function () {
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

describe('Navigation Sortie 1', function () {
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

describe('Navigation Sortie 2', function () {
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

describe('Navigation Sortie 3', function () {
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

describe('Navigation Sortie 4', function () {
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
