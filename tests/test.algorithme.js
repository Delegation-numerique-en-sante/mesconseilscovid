describe('Algorithme département', function () {
    beforeEach(function () {
        questionnaire.resetData()
    })

    afterEach(function () {
        questionnaire.resetData()
    })

    it('Un département vert affiche le bloc vert', function () {
        var data = {
            departement: '01',
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.departementBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-departement', 'conseils-departement-vert'])
    })

    it('Un département rouge affiche le bloc rouge', function () {
        var data = {
            departement: '02',
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.departementBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-departement', 'conseils-departement-rouge'])
    })

    it('Un département inconnu n’affiche pas de bloc couleur', function () {
        var data = {
            departement: '977',
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.departementBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-departement'])
    })
})

describe('Algorithme activité pro', function () {
    beforeEach(function () {
        questionnaire.resetData()
    })

    afterEach(function () {
        questionnaire.resetData()
    })

    it('Aucune activité pro n’affiche rien', function () {
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.activiteProBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal([])
    })

    it('Une activité pro affiche des conseils + pro', function () {
        var data = {
            activite_pro: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.activiteProBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro',
            'conseils-activite-pro',
        ])
    })

    it('Une activité pro avec public affiche des conseils + pro + public', function () {
        var data = {
            activite_pro: true,
            activite_pro_public: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.activiteProBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro-public',
            'conseils-activite-pro',
            'conseils-activite-pro-public',
        ])
    })

    it('Une activité pro avec sante affiche des conseils + pro + sante', function () {
        var data = {
            activite_pro: true,
            activite_pro_sante: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.activiteProBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro-sante',
            'conseils-activite-pro',
            'conseils-activite-pro-sante',
        ])
    })

    it('Une activité pro avec public et sante affiche des conseils + pro + public + sante', function () {
        var data = {
            activite_pro: true,
            activite_pro_public: true,
            activite_pro_sante: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.activiteProBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro-public-sante',
            'conseils-activite-pro',
            'conseils-activite-pro-public',
            'conseils-activite-pro-sante',
        ])
    })
})

describe('Algorithme foyer', function () {
    beforeEach(function () {
        questionnaire.resetData()
    })

    afterEach(function () {
        questionnaire.resetData()
    })

    it('Aucun risque foyer n’affiche rien', function () {
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.foyerBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal([])
    })

    it('Risque enfant', function () {
        var data = {
            foyer_enfants: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.foyerBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-foyer', 'conseils-foyer-enfants'])
    })

    it('Risque fragile', function () {
        var data = {
            foyer_fragile: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.foyerBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-foyer', 'conseils-foyer-fragile'])
    })

    it('Risque enfant ET fragile', function () {
        var data = {
            foyer_enfants: true,
            foyer_fragile: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.foyerBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-foyer', 'conseils-foyer-enfants-fragile'])
    })
})

describe('Algorithme caractéristiques et antécédents', function () {
    beforeEach(function () {
        questionnaire.resetData()
    })

    afterEach(function () {
        questionnaire.resetData()
    })

    it('Aucun antécédent n’affiche rien', function () {
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.foyerBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal([])
    })

    it('Risque âge', function () {
        var data = {
            sup65: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay(
                algorithme.getData()
            )
        ).to.deep.equal([
            'conseils-caracteristiques',
            'conseils-caracteristiques-antecedents',
        ])
    })

    it('Risque IMC > 30', function () {
        var data = {
            taille: 150,
            poids: 100,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay(
                algorithme.getData()
            )
        ).to.deep.equal([
            'conseils-caracteristiques',
            'conseils-caracteristiques-antecedents',
        ])
    })

    it('Risque cardio', function () {
        var data = {
            antecedent_cardio: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay(
                algorithme.getData()
            )
        ).to.deep.equal([
            'conseils-caracteristiques',
            'conseils-caracteristiques-antecedents',
        ])
    })

    it('Risque antécédent chronique autre', function () {
        var data = {
            antecedent_chronique_autre: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay(
                algorithme.getData()
            )
        ).to.deep.equal([
            'conseils-caracteristiques',
            'conseils-antecedents-chroniques-autres',
        ])
    })
})

describe('Algorithme symptômes passés', function () {
    beforeEach(function () {
        questionnaire.resetData()
    })

    afterEach(function () {
        questionnaire.resetData()
    })

    it('Si pas de risques', function () {
        var data = {
            sup65: false,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.symptomesPassesBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-symptomes-passes-sans-risques'])
    })

    it('Si risques', function () {
        var data = {
            sup65: true,
        }
        questionnaire.fillData(data)
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        chai.expect(
            algorithme.symptomesPassesBlockNamesToDisplay(algorithme.getData())
        ).to.deep.equal(['conseils-symptomes-passes-avec-risques'])
    })
})
