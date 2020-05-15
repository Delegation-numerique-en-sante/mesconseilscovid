describe('Navigation', function () {
    it('page inconnue renvoie au début', function () {
        chai.expect(navigation.redirectIfMissingData('foo', {})).to.equal(
            'introduction'
        )
    })
    it('ok d’aller à la page d’accueil', function () {
        chai.expect(navigation.redirectIfMissingData('introduction', {})).to.be
            .undefined
    })
    it('ok d’aller au conditions d’utilisation', function () {
        chai.expect(navigation.redirectIfMissingData('conditionsutilisation', {})).to.be
            .undefined
    })

    // Question 1 : mon lieu de résidence
    it('ok d’aller à la question 1', function () {
        chai.expect(navigation.redirectIfMissingData('residence', {})).to.be.undefined
    })
    it('ok d’aller à la question 1 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('residence', {
                departement: '80',
            })
        ).to.be.undefined
    })

    // Question 2 : mon activité
    it('redirige vers l’accueil si réponse 1 manquante', function () {
        chai.expect(navigation.redirectIfMissingData('activitepro', {})).to.equal(
            'introduction'
        )
    })
    it('ok d’aller à la question 2 si réponse à la 1', function () {
        chai.expect(
            navigation.redirectIfMissingData('activitepro', { departement: '80' })
        ).to.be.undefined
    })
    it('ok d’aller à la question 2 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('activitepro', {
                departement: '80',
                activite_pro: false,
            })
        ).to.be.undefined
    })

    // Question 3 : mon foyer
    it('redirige vers question 2 si réponse manquante', function () {
        chai.expect(
            navigation.redirectIfMissingData('foyer', { departement: '80' })
        ).to.equal('activitepro')
    })
    it('ok d’aller à la question 3 si réponse à la 2', function () {
        chai.expect(
            navigation.redirectIfMissingData('foyer', {
                departement: '80',
                activite_pro: false,
            })
        ).to.be.undefined
    })
    it('ok d’aller à la question 3 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('foyer', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
            })
        ).to.be.undefined
    })

    // Question 4 : mes caractéristiques
    it('redirige vers question 3 si réponse manquante', function () {
        chai.expect(
            navigation.redirectIfMissingData('caracteristiques', {
                departement: '80',
                activite_pro: false,
            })
        ).to.equal('foyer')
    })
    it('ok d’aller à la question 4 si réponse à la 3', function () {
        chai.expect(
            navigation.redirectIfMissingData('caracteristiques', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
            })
        ).to.be.undefined
    })
    it('ok d’aller à la question 4 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('caracteristiques', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
            })
        ).to.be.undefined
    })

    // Question 5 : mes antécédents
    it('redirige vers question 4 si réponse manquante', function () {
        chai.expect(
            navigation.redirectIfMissingData('antecedents', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
            })
        ).to.equal('caracteristiques')
    })
    it('ok d’aller à la question 5 si réponse à la 4', function () {
        chai.expect(
            navigation.redirectIfMissingData('antecedents', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
            })
        ).to.be.undefined
    })
    it('ok d’aller à la question 5 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('antecedents', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
            })
        ).to.be.undefined
    })

    // Question 6 : mes symptômes actuels
    it('redirige vers question 5 si réponse manquante', function () {
        chai.expect(
            navigation.redirectIfMissingData('symptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
            })
        ).to.equal('antecedents')
    })
    it('ok d’aller à la question 6 si réponse à la 5', function () {
        chai.expect(
            navigation.redirectIfMissingData('symptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
            })
        ).to.be.undefined
    })
    it('ok d’aller à la question 6 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('symptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
            })
        ).to.be.undefined
    })

    // Question 7 : mes symptômes passés
    it('redirige vers question 6 si réponse manquante', function () {
        chai.expect(
            navigation.redirectIfMissingData('symptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
            })
        ).to.equal('symptomesactuels')
    })
    it('ok d’aller à la question 7 si réponse négative à la 6', function () {
        chai.expect(
            navigation.redirectIfMissingData('symptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
            })
        ).to.be.undefined
    })
    it('ok d’aller à la question 7 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('symptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
        ).to.be.undefined
    })
    it('redirige vers conseils si réponse positive à la 6', function () {
        chai.expect(
            navigation.redirectIfMissingData('symptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: true,
            })
        ).to.equal('conseilssymptomesactuels')
    })

    // Question 8 : mes contacts à risque
    it('redirige vers question 7 si réponse manquante', function () {
        chai.expect(
            navigation.redirectIfMissingData('contactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
            })
        ).to.equal('symptomespasses')
    })
    it('ok d’aller à la question 8 si réponse négative aux 6 et 7', function () {
        chai.expect(
            navigation.redirectIfMissingData('contactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
            })
        ).to.be.undefined
    })
    it('ok d’aller à la question 8 même si déjà répondu', function () {
        chai.expect(
            navigation.redirectIfMissingData('contactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
        ).to.be.undefined
    })
    it('redirige vers conseils si réponse positive à la 6', function () {
        chai.expect(
            navigation.redirectIfMissingData('contactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: true,
            })
        ).to.equal('conseilssymptomesactuels')
    })
    it('redirige vers conseils si réponse positive à la 7', function () {
        chai.expect(
            navigation.redirectIfMissingData('contactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
        ).to.equal('conseilssymptomespasses')
    })

    // Sortie 1
    it('ok d’aller à sortie 1 si symptômes actuels', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: true,
            })
        ).to.be.undefined
    })
    it('redirige sortie 1 si symptômes actuels et target inconnu', function () {
        chai.expect(
            navigation.redirectIfMissingData('inconnu', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: true,
            })
        ).to.equal('conseilssymptomesactuels')
    })
    it('redirige sortie 2 -> 1 si symptômes actuels', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: true,
            })
        ).to.equal('conseilssymptomesactuels')
    })
    it('redirige sortie 3 -> 1 si symptômes actuels', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilscontactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: true,
            })
        ).to.equal('conseilssymptomesactuels')
    })
    it('redirige sortie 4 -> 1 si symptômes actuels', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseils', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: true,
            })
        ).to.equal('conseilssymptomesactuels')
    })

    // Sortie 2
    it('ok d’aller à sortie 2 si symptômes passés', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
        ).to.be.undefined
    })
    it('redirige sortie 2 si symptômes passés et target inconnu', function () {
        chai.expect(
            navigation.redirectIfMissingData('inconnu', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
        ).to.equal('conseilssymptomespasses')
    })
    it('redirige sortie 1 -> 2 si symptômes passés', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
        ).to.equal('conseilssymptomespasses')
    })
    it('redirige sortie 3 -> 2 si symptômes passés', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilscontactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
        ).to.equal('conseilssymptomespasses')
    })
    it('redirige sortie 4 -> 2 si symptômes passés', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseils', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: true,
            })
        ).to.equal('conseilssymptomespasses')
    })

    // Sortie 3
    it('ok d’aller à sortie 3 si symptômes passés', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilscontactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: true,
            })
        ).to.be.undefined
    })
    it('redirige sortie 3 si symptômes passés et target inconnu', function () {
        chai.expect(
            navigation.redirectIfMissingData('inconnu', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: true,
            })
        ).to.equal('conseilscontactarisque')
    })
    it('redirige sortie 1 -> 3 si contact à risque', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: true,
            })
        ).to.equal('conseilscontactarisque')
    })
    it('redirige sortie 2 -> 3 si contact à risque', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: true,
            })
        ).to.equal('conseilscontactarisque')
    })
    it('redirige sortie 4 -> 3 si contact à risque', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseils', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: true,
            })
        ).to.equal('conseilscontactarisque')
    })

    // Sortie 4
    it('ok d’aller à sortie 4 si ni symptôme ni contact', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseils', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
        ).to.be.undefined
    })
    it('redirige sortie 4 si ni symptôme ni contact et target inconnu', function () {
        chai.expect(
            navigation.redirectIfMissingData('inconnu', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
        ).to.equal('conseils')
    })
    it('redirige sortie 1 -> 4 si ni symptôme ni contact', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomesactuels', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
        ).to.equal('conseils')
    })
    it('redirige sortie 2 -> 4 si ni symptôme ni contact', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilssymptomespasses', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
        ).to.equal('conseils')
    })
    it('redirige sortie 3 -> 4 si ni symptôme ni contact', function () {
        chai.expect(
            navigation.redirectIfMissingData('conseilscontactarisque', {
                departement: '80',
                activite_pro: false,
                foyer_enfants: false,
                sup65: false,
                antecedent_cardio: false,
                symptomes_actuels: false,
                symptomes_passes: false,
                contact_a_risque: false,
            })
        ).to.equal('conseils')
    })
})
