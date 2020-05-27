module.exports = function () {
    this.resetData = function () {
        this.departement = undefined
        this.activite_pro = undefined
        this.activite_pro_public = undefined
        this.activite_pro_sante = undefined
        this.foyer_enfants = undefined
        this.foyer_fragile = undefined
        this.sup65 = undefined
        this.grossesse_3e_trimestre = undefined
        this.poids = undefined
        this.taille = undefined
        this.antecedent_cardio = undefined
        this.antecedent_diabete = undefined
        this.antecedent_respi = undefined
        this.antecedent_dialyse = undefined
        this.antecedent_cancer = undefined
        this.antecedent_immunodep = undefined
        this.antecedent_cirrhose = undefined
        this.antecedent_drepano = undefined
        this.antecedent_chronique_autre = undefined
        this.symptomes_actuels = undefined
        this.symptomes_passes = undefined
        this.contact_a_risque = undefined
        this.contact_a_risque_meme_lieu_de_vie = undefined
        this.contact_a_risque_contact_direct = undefined
        this.contact_a_risque_actes = undefined
        this.contact_a_risque_espace_confine = undefined
        this.contact_a_risque_meme_classe = undefined
        this.contact_a_risque_autre = undefined
    }

    this.fillData = function (data) {
        this.departement = data['departement']
        this.activite_pro = data['activite_pro']
        this.activite_pro_public = data['activite_pro_public']
        this.activite_pro_sante = data['activite_pro_sante']
        this.foyer_enfants = data['foyer_enfants']
        this.foyer_fragile = data['foyer_fragile']
        this.sup65 = data['sup65']
        this.grossesse_3e_trimestre = data['grossesse_3e_trimestre']
        this.poids = data['poids']
        this.taille = data['taille']
        this.antecedent_cardio = data['antecedent_cardio']
        this.antecedent_diabete = data['antecedent_diabete']
        this.antecedent_respi = data['antecedent_respi']
        this.antecedent_dialyse = data['antecedent_dialyse']
        this.antecedent_cancer = data['antecedent_cancer']
        this.antecedent_immunodep = data['antecedent_immunodep']
        this.antecedent_cirrhose = data['antecedent_cirrhose']
        this.antecedent_drepano = data['antecedent_drepano']
        this.antecedent_chronique_autre = data['antecedent_chronique_autre']
        this.symptomes_actuels = data['symptomes_actuels']
        this.symptomes_passes = data['symptomes_passes']
        this.contact_a_risque = data['contact_a_risque']
        this.contact_a_risque_meme_lieu_de_vie =
            data['contact_a_risque_meme_lieu_de_vie']
        this.contact_a_risque_contact_direct = data['contact_a_risque_contact_direct']
        this.contact_a_risque_actes = data['contact_a_risque_actes']
        this.contact_a_risque_espace_confine = data['contact_a_risque_espace_confine']
        this.contact_a_risque_meme_classe = data['contact_a_risque_meme_classe']
        this.contact_a_risque_autre = data['contact_a_risque_autre']
    }

    this.getData = function () {
        return {
            departement: this.departement,
            activite_pro: this.activite_pro,
            activite_pro_public: this.activite_pro_public,
            activite_pro_sante: this.activite_pro_sante,
            foyer_enfants: this.foyer_enfants,
            foyer_fragile: this.foyer_fragile,
            sup65: this.sup65,
            grossesse_3e_trimestre: this.grossesse_3e_trimestre,
            poids: this.poids,
            taille: this.taille,
            antecedent_cardio: this.antecedent_cardio,
            antecedent_diabete: this.antecedent_diabete,
            antecedent_respi: this.antecedent_respi,
            antecedent_dialyse: this.antecedent_dialyse,
            antecedent_cancer: this.antecedent_cancer,
            antecedent_immunodep: this.antecedent_immunodep,
            antecedent_cirrhose: this.antecedent_cirrhose,
            antecedent_drepano: this.antecedent_drepano,
            antecedent_chronique_autre: this.antecedent_chronique_autre,
            symptomes_actuels: this.symptomes_actuels,
            symptomes_passes: this.symptomes_passes,
            contact_a_risque: this.contact_a_risque,
            contact_a_risque_meme_lieu_de_vie: this.contact_a_risque_meme_lieu_de_vie,
            contact_a_risque_contact_direct: this.contact_a_risque_contact_direct,
            contact_a_risque_actes: this.contact_a_risque_actes,
            contact_a_risque_espace_confine: this.contact_a_risque_espace_confine,
            contact_a_risque_meme_classe: this.contact_a_risque_meme_classe,
            contact_a_risque_autre: this.contact_a_risque_autre,
        }
    }

    this.isComplete = function () {
        return (
            typeof this.departement !== 'undefined' &&
            typeof this.activite_pro !== 'undefined' &&
            typeof this.activite_pro_public !== 'undefined' &&
            typeof this.activite_pro_sante !== 'undefined' &&
            typeof this.foyer_enfants !== 'undefined' &&
            typeof this.foyer_fragile !== 'undefined' &&
            typeof this.sup65 !== 'undefined' &&
            typeof this.grossesse_3e_trimestre !== 'undefined' &&
            typeof this.poids !== 'undefined' &&
            typeof this.taille !== 'undefined' &&
            typeof this.antecedent_cardio !== 'undefined' &&
            typeof this.antecedent_diabete !== 'undefined' &&
            typeof this.antecedent_respi !== 'undefined' &&
            typeof this.antecedent_dialyse !== 'undefined' &&
            typeof this.antecedent_cancer !== 'undefined' &&
            typeof this.antecedent_immunodep !== 'undefined' &&
            typeof this.antecedent_cirrhose !== 'undefined' &&
            typeof this.antecedent_drepano !== 'undefined' &&
            typeof this.antecedent_chronique_autre !== 'undefined' &&
            typeof this.symptomes_actuels !== 'undefined' &&
            typeof this.symptomes_passes !== 'undefined' &&
            typeof this.contact_a_risque !== 'undefined'
        )
    }
}
