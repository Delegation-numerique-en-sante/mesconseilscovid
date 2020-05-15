describe('Questionnaire', function () {
    it('Le questionnaire est vide par défaut', function () {
        chai.expect(questionnaire.getData()).to.deep.equal({
            departement: undefined,
            activite_pro: undefined,
            activite_pro_public: undefined,
            activite_pro_sante: undefined,
            foyer_enfants: undefined,
            foyer_fragile: undefined,
            sup65: undefined,
            grossesse_3e_trimestre: undefined,
            poids: undefined,
            taille: undefined,
            antecedent_cardio: undefined,
            antecedent_diabete: undefined,
            antecedent_respi: undefined,
            antecedent_dialyse: undefined,
            antecedent_cancer: undefined,
            antecedent_immunodep: undefined,
            antecedent_cirrhose: undefined,
            antecedent_drepano: undefined,
            antecedent_chronique_autre: undefined,
            symptomes_actuels: undefined,
            symptomes_passes: undefined,
            contact_a_risque: undefined,
        })
        chai.expect(questionnaire.isComplete()).to.equal(false)
    })
    it('Le questionnaire peut être partiellement rempli', function () {
        var data = {
            departement: '01',
        }
        questionnaire.fillData(data)
        chai.expect(questionnaire.getData()).to.include(data)
        chai.expect(questionnaire.isComplete()).to.equal(false)
    })
    it('Le questionnaire peut être partiellement vidé', function () {
        var data = {
            departement: '01',
        }
        questionnaire.fillData(data)
        questionnaire.resetData()
        chai.expect(questionnaire.getData()).to.include({
            departement: undefined,
        })
    })
    it('Le questionnaire peut être complètement rempli', function () {
        var data = {
            departement: '34',
            activite_pro: false,
            activite_pro_public: false,
            activite_pro_sante: false,
            foyer_enfants: true,
            foyer_fragile: false,
            sup65: false,
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
            symptomes_passes: false,
            contact_a_risque: true,
        }
        questionnaire.fillData(data)
        chai.expect(questionnaire.getData()).to.deep.equal(data)
        chai.expect(questionnaire.isComplete()).to.equal(true)
    })
    it('Le questionnaire peut être complètement vidé', function () {
        var data = {
            departement: '34',
            activite_pro: false,
            activite_pro_public: false,
            activite_pro_sante: false,
            foyer_enfants: true,
            foyer_fragile: false,
            sup65: false,
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
            symptomes_passes: false,
            contact_a_risque: true,
        }
        questionnaire.fillData(data)
        questionnaire.resetData()
        chai.expect(questionnaire.getData()).to.deep.equal({
            departement: undefined,
            activite_pro: undefined,
            activite_pro_public: undefined,
            activite_pro_sante: undefined,
            foyer_enfants: undefined,
            foyer_fragile: undefined,
            sup65: undefined,
            grossesse_3e_trimestre: undefined,
            poids: undefined,
            taille: undefined,
            antecedent_cardio: undefined,
            antecedent_diabete: undefined,
            antecedent_respi: undefined,
            antecedent_dialyse: undefined,
            antecedent_cancer: undefined,
            antecedent_immunodep: undefined,
            antecedent_cirrhose: undefined,
            antecedent_drepano: undefined,
            antecedent_chronique_autre: undefined,
            symptomes_actuels: undefined,
            symptomes_passes: undefined,
            contact_a_risque: undefined,
        })
        chai.expect(questionnaire.isComplete()).to.equal(false)
    })
})
