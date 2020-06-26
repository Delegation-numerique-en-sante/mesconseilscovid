var affichage = require('./affichage.js')
const carteDepartements = require('./carte.js')

class Profil {
    constructor(nom) {
        this.nom = nom
    }

    resetData() {
        this.departement = undefined
        this.activite_pro = undefined
        this.activite_pro_public = undefined
        this.activite_pro_sante = undefined
        this.foyer_enfants = undefined
        this.foyer_fragile = undefined
        this.age = undefined
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
        this.symptomes_actuels_temperature = undefined
        this.symptomes_actuels_temperature_inconnue = undefined
        this.symptomes_actuels_toux = undefined
        this.symptomes_actuels_odorat = undefined
        this.symptomes_actuels_douleurs = undefined
        this.symptomes_actuels_diarrhee = undefined
        this.symptomes_actuels_fatigue = undefined
        this.symptomes_actuels_alimentation = undefined
        this.symptomes_actuels_souffle = undefined
        this.symptomes_actuels_autre = undefined
        this.symptomes_passes = undefined
        this.contact_a_risque = undefined
        this.contact_a_risque_meme_lieu_de_vie = undefined
        this.contact_a_risque_contact_direct = undefined
        this.contact_a_risque_actes = undefined
        this.contact_a_risque_espace_confine = undefined
        this.contact_a_risque_meme_classe = undefined
        this.contact_a_risque_stop_covid = undefined
        this.contact_a_risque_autre = undefined
    }

    fillData(data) {
        this.departement = data['departement']
        this.activite_pro = data['activite_pro']
        this.activite_pro_public = data['activite_pro_public']
        this.activite_pro_sante = data['activite_pro_sante']
        this.foyer_enfants = data['foyer_enfants']
        this.foyer_fragile = data['foyer_fragile']
        this.age = data['age']
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
        this.symptomes_actuels_temperature = data['symptomes_actuels_temperature']
        this.symptomes_actuels_temperature_inconnue =
            data['symptomes_actuels_temperature_inconnue']
        this.symptomes_actuels_toux = data['symptomes_actuels_toux']
        this.symptomes_actuels_odorat = data['symptomes_actuels_odorat']
        this.symptomes_actuels_douleurs = data['symptomes_actuels_douleurs']
        this.symptomes_actuels_diarrhee = data['symptomes_actuels_diarrhee']
        this.symptomes_actuels_fatigue = data['symptomes_actuels_fatigue']
        this.symptomes_actuels_alimentation = data['symptomes_actuels_alimentation']
        this.symptomes_actuels_souffle = data['symptomes_actuels_souffle']
        this.symptomes_actuels_autre = data['symptomes_actuels_autre']
        this.symptomes_passes = data['symptomes_passes']
        this.contact_a_risque = data['contact_a_risque']
        this.contact_a_risque_meme_lieu_de_vie =
            data['contact_a_risque_meme_lieu_de_vie']
        this.contact_a_risque_contact_direct = data['contact_a_risque_contact_direct']
        this.contact_a_risque_actes = data['contact_a_risque_actes']
        this.contact_a_risque_espace_confine = data['contact_a_risque_espace_confine']
        this.contact_a_risque_meme_classe = data['contact_a_risque_meme_classe']
        this.contact_a_risque_stop_covid = data['contact_a_risque_stop_covid']
        this.contact_a_risque_autre = data['contact_a_risque_autre']
    }

    getData() {
        return {
            departement: this.departement,
            activite_pro: this.activite_pro,
            activite_pro_public: this.activite_pro_public,
            activite_pro_sante: this.activite_pro_sante,
            foyer_enfants: this.foyer_enfants,
            foyer_fragile: this.foyer_fragile,
            age: this.age,
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
            symptomes_actuels_temperature: this.symptomes_actuels_temperature,
            symptomes_actuels_temperature_inconnue: this
                .symptomes_actuels_temperature_inconnue,
            symptomes_actuels_toux: this.symptomes_actuels_toux,
            symptomes_actuels_odorat: this.symptomes_actuels_odorat,
            symptomes_actuels_douleurs: this.symptomes_actuels_douleurs,
            symptomes_actuels_diarrhee: this.symptomes_actuels_diarrhee,
            symptomes_actuels_fatigue: this.symptomes_actuels_fatigue,
            symptomes_actuels_alimentation: this.symptomes_actuels_alimentation,
            symptomes_actuels_souffle: this.symptomes_actuels_souffle,
            symptomes_actuels_autre: this.symptomes_actuels_autre,
            symptomes_passes: this.symptomes_passes,
            contact_a_risque: this.contact_a_risque,
            contact_a_risque_meme_lieu_de_vie: this.contact_a_risque_meme_lieu_de_vie,
            contact_a_risque_contact_direct: this.contact_a_risque_contact_direct,
            contact_a_risque_actes: this.contact_a_risque_actes,
            contact_a_risque_espace_confine: this.contact_a_risque_espace_confine,
            contact_a_risque_meme_classe: this.contact_a_risque_meme_classe,
            contact_a_risque_stop_covid: this.contact_a_risque_stop_covid,
            contact_a_risque_autre: this.contact_a_risque_autre,
        }
    }

    isEmpty() {
        return (
            typeof this.departement === 'undefined' &&
            typeof this.activite_pro === 'undefined' &&
            typeof this.activite_pro_public === 'undefined' &&
            typeof this.activite_pro_sante === 'undefined' &&
            typeof this.foyer_enfants === 'undefined' &&
            typeof this.foyer_fragile === 'undefined' &&
            typeof this.age === 'undefined' &&
            typeof this.grossesse_3e_trimestre === 'undefined' &&
            typeof this.poids === 'undefined' &&
            typeof this.taille === 'undefined' &&
            typeof this.antecedent_cardio === 'undefined' &&
            typeof this.antecedent_diabete === 'undefined' &&
            typeof this.antecedent_respi === 'undefined' &&
            typeof this.antecedent_dialyse === 'undefined' &&
            typeof this.antecedent_cancer === 'undefined' &&
            typeof this.antecedent_immunodep === 'undefined' &&
            typeof this.antecedent_cirrhose === 'undefined' &&
            typeof this.antecedent_drepano === 'undefined' &&
            typeof this.antecedent_chronique_autre === 'undefined' &&
            typeof this.symptomes_actuels === 'undefined' &&
            typeof this.symptomes_passes === 'undefined' &&
            typeof this.contact_a_risque === 'undefined'
        )
    }

    isComplete() {
        return (
            typeof this.departement !== 'undefined' &&
            typeof this.activite_pro !== 'undefined' &&
            typeof this.activite_pro_public !== 'undefined' &&
            typeof this.activite_pro_sante !== 'undefined' &&
            typeof this.foyer_enfants !== 'undefined' &&
            typeof this.foyer_fragile !== 'undefined' &&
            typeof this.age !== 'undefined' &&
            this.age >= 15 &&
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

    estMonProfil() {
        return this.nom == 'mes_infos'
    }

    affichageNom() {
        return this.estMonProfil() ? 'Moi' : this.nom
    }

    renderNom() {
        return `<h3>${this.affichageNom()}</h3>`
    }

    renderDepartement() {
        return this.departement
            ? `<li>Lieu de résidence : ${carteDepartements.nom(this.departement)}</li>`
            : ''
    }

    renderAge() {
        return this.age ? `<li>Âge : ${this.age} ans</li>` : ''
    }

    renderFull() {
        return affichage.createElementFromHTML(`
        <div class="profil-full">
            ${this.renderNom()}
            ${this.renderDeleteButton()}
            <ul>
                ${this.renderAge()}
                ${this.renderDepartement()}
            </ul>
        </div>
        `)
    }

    renderDeleteButton() {
        if (this.estMonProfil()) {
            return ''
        }
        return `
            <a class="button button-red" data-profil="${this.nom}" href="">\
                Supprimer ce profil\
            </a>
        `
    }

    buttons() {
        if (this.isComplete()) {
            var possessif = this.estMonProfil() ? 'mes' : 'ses'
            return `
                <a class="button button-full-width button-outline" data-profil="${this.nom}" href="#residence">\
                    Modifier ${possessif} réponses\
                </a>
                <a class="button button-full-width conseils-link" data-profil="${this.nom}" href="">\
                    Voir ${possessif} conseils\
                </a>
            `
        } else {
            var label = this.isEmpty() ? 'Démarrer' : 'Continuer'
            return `
                <a class="button button-full-width" data-profil="${this.nom}" href="#residence">\
                    ${label}\
                </a>
            `
        }
    }

    renderCard() {
        return affichage.createElementFromHTML(`
        <div class="profil-card">
            ${this.renderNom()}
            <div class="form-controls">${this.buttons()}</div>
        </div>
        `)
    }
}

module.exports = {
    Profil,
}
