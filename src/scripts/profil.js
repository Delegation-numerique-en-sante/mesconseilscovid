var format = require('timeago.js').format

var affichage = require('./affichage.js')

class Profil {
    constructor(nom) {
        this.nom = nom
    }

    get suivi_start_date() {
        if (typeof this._suivi_start_date === 'undefined') return undefined
        return new Date(this._suivi_start_date)
    }

    set suivi_start_date(date) {
        this._suivi_start_date = typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get symptomes_start_date() {
        return new Date(this._symptomes_start_date)
    }

    set symptomes_start_date(date) {
        // Turn the date into a readable string.
        this._symptomes_start_date = date.toJSON()
    }

    resetSuivi() {
        this._suivi_start_date = undefined
        this._symptomes_start_date = undefined
        this.suivi = []
    }

    resetData(nom) {
        this.nom = nom
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
        this.suivi_active = undefined
        this._suivi_start_date = undefined
        this._symptomes_start_date = undefined
        this.suivi = []
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
        this._suivi_start_date = data['_suivi_start_date']
        this._symptomes_start_date = data['_symptomes_start_date']
        this.suivi_active = data['suivi_active'] || false
        this.suivi = data['suivi'] || []
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
            suivi_active: this.suivi_active,
            _suivi_start_date: this._suivi_start_date,
            _symptomes_start_date: this._symptomes_start_date,
            suivi: this.suivi,
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

    hasSuiviStartDate() {
        return typeof this._suivi_start_date !== 'undefined'
    }

    hasSymptomesStartDate() {
        return typeof this._symptomes_start_date !== 'undefined'
    }

    hasHistorique() {
        return this.suivi.length > 1
    }

    ajouterEtat(etat) {
        this.suivi.push(etat)
    }

    dernierEtat() {
        return this.suivi.slice(-1)[0]
    }

    estMonProfil() {
        return this.nom == 'mes_infos'
    }

    affichageNom() {
        return this.estMonProfil() ? 'Moi' : this.nom
    }

    renderNom() {
        return affichage.safeHtml`<h3><span class="profil">${this.affichageNom()}</span></h3>`
    }

    renderButtons() {
        const possessifMasculinSingulier = this.estMonProfil() ? 'mon' : 'son'
        const possessifPluriel = this.estMonProfil() ? 'mes' : 'ses'
        var mainButton = ''
        if (this.isComplete()) {
            if (this.suivi_active) {
                const verbe = this.hasSuiviStartDate() ? 'Continuer' : 'Démarrer'
                mainButton += affichage.safeHtml`
                    <a class="button suivi-link"
                        data-set-profil="${this.nom}" href="#suiviintroduction"
                        >${verbe} ${possessifMasculinSingulier} suivi</a>
                `
            }
            const outlined =
                this.estMonProfil() && !this.suivi_active ? '' : 'button-outline'
            mainButton += affichage.safeHtml`
                <a class="button ${outlined} conseils-link"
                    data-set-profil="${this.nom}" href="#conseils"
                    >Voir ${possessifPluriel} conseils</a>
            `
        } else {
            var label = this.isEmpty() ? 'Démarrer' : 'Continuer'
            mainButton = affichage.safeHtml`
                <a class="button button-full-width conseils-link"
                    data-set-profil="${this.nom}" href="#residence"
                    >${label}</a>
            `
        }
        return (
            mainButton +
            affichage.safeHtml`
            <a data-set-profil="${this.nom}" href="#residence"
                >Modifier ${possessifPluriel} réponses</a>
            <a data-delete-profil="${this.nom}" href=""
                >Supprimer ${possessifMasculinSingulier} profil</a>
            `
        )
    }

    renderCard() {
        return affichage.createElementFromHTML(`
        <div class="card">
            ${this.renderNom()}
            <div>${this.renderButtons()}</div>
        </div>
        `)
    }

    renderButtonSuivi() {
        const possessifMasculinSingulier = this.estMonProfil() ? 'mon' : 'son'
        const possessifPluriel = this.estMonProfil() ? 'mes' : 'ses'
        const label = this.hasSuiviStartDate() ? 'Continuer' : 'Démarrer'
        const nextPage = this.hasSymptomesStartDate() ? 'suivisymptomes' : 'suividate'
        const suiviButton = affichage.safeHtml`
            <a class="button button-full-width conseils-link"
                data-set-profil="${this.nom}" href="#${nextPage}"
                >${label} ${possessifMasculinSingulier} suivi</a>
        `
        const conseilsButton = affichage.safeHtml`
            <a class="button button-outline button-full-width conseils-link"
                data-set-profil="${this.nom}" href="#conseils"
                >Voir ${possessifPluriel} conseils</a>
        `
        let deleteLink = ''
        if (this.hasSuiviStartDate()) {
            deleteLink = affichage.safeHtml`
                <a data-delete-suivi="${this.nom}" href=""
                    >Supprimer ${possessifMasculinSingulier} suivi</a>
            `
        }
        return suiviButton + conseilsButton + deleteLink
    }

    renderDernierSuivi() {
        const dernierEtat = this.dernierEtat()
        if (dernierEtat) {
            const relativeDate = format(new Date(dernierEtat.date), 'fr')
            return `<small>Dernière réponse : ${relativeDate}</small>`
        }
        return ''
    }

    renderCardSuivi() {
        return affichage.createElementFromHTML(`
        <div class="card">
            ${this.renderNom()}
            ${this.renderDernierSuivi()}
            <div>${this.renderButtonSuivi()}</div>
        </div>
        `)
    }

    renderDebutSymptomes() {
        return `<p>Début des symptômes : ${this.symptomes_start_date.toLocaleString()}</p>`
    }

    renderDebutSuivi() {
        return `<p>Début du suivi : ${this.suivi_start_date.toLocaleString()}</p>`
    }

    renderHistorique() {
        return affichage.createElementFromHTML(`
            <div>
                ${this.renderDebutSymptomes()}
                ${this.renderDebutSuivi()}
                ${this.suivi.map((etat) => new Etat(etat).render()).join('\n')}
            </div>
        `)
    }
}

class Etat {
    constructor(data) {
        this.data = data
    }

    renderRaw() {
        return `<pre>${JSON.stringify(this.data, null, '  ')}</pre>`
    }

    renderTitle() {
        return `<h3>Symptômes le ${this.renderDate()}</h3>`
    }

    renderDate() {
        return `${new Date(this.data.date).toLocaleString()}`
    }

    renderSymptomes() {
        if (this.data.symptomes) {
            return '<p>Vous présentiez ces symptômes à ce moment là :</p>'
        } else {
            return '<p>Vous ne présentiez plus aucun symptôme à ce moment là.</p>'
        }
    }

    renderStatut(symptome) {
        let statut = ''
        switch (symptome) {
            case 'critique':
                statut = 'beaucoup moins bien'
                break
            case 'pire':
                statut = 'un peu moins bien'
                break
            case 'stable':
                statut = 'stable'
                break
            case 'mieux':
                statut = 'mieux'
                break
        }
        return statut
    }

    renderEssoufflement() {
        return `<li>Manque de souffle : ${this.renderStatut(
            this.data.essoufflement
        )}</li>`
    }

    renderEtatGeneral() {
        return `<li>État général : ${this.renderStatut(this.data.etatGeneral)}</li>`
    }

    renderConfusion() {
        if (this.data.confusion) {
            return '<li>Apparition de somnolence ou de confusion</li>'
        }
        return ''
    }

    renderAlimentationHydratation() {
        if (this.data.alimentationHydratation == 'oui') {
            return `<li>Impossibilité de vous alimenter ou de boire depuis plus de 24 heures</li>`
        } else {
            return `<li>Capacité à vous alimenter et à boire depuis plus de 24 heures</li>`
        }
    }

    renderEtatPsychologique() {
        return `<li>État psychologique : ${this.renderStatut(
            this.data.etatPsychologique
        )}</li>`
    }

    renderTemperature() {
        if (this.data.fievre == 'oui') {
            return `<li>Température supérieure à 39°C, et qui ne diminue pas malgré la prise de paracétamol</li>`
        } else {
            return `<li>Température inférieure à 39°C</li>`
        }
    }

    renderDiarrheeVomissements() {
        if (this.data.diarrheeVomissements == 'oui') {
            return `<li>Diarrhée ou vomissements importants</li>`
        } else {
            return `<li>Peu ou pas de diarrhée ou vomissements</li>`
        }
    }

    renderMauxDeTete() {
        if (this.data.mauxDeTete == 'oui') {
            return `<li>Maux de tête</li>`
        } else {
            return `<li>Pas de maux de tête</li>`
        }
    }

    renderToux() {
        if (this.data.toux == 'oui') {
            return `<li>Toux</li>`
        } else {
            return `<li>Pas de toux</li>`
        }
    }

    render() {
        if (this.data.symptomes) {
            return `
                ${this.renderTitle()}
                ${this.renderSymptomes()}
                <ul>
                    ${this.renderEssoufflement()}
                    ${this.renderEtatGeneral()}
                    ${this.renderConfusion()}
                    ${this.renderAlimentationHydratation()}
                    ${this.renderEtatPsychologique()}
                    ${this.renderTemperature()}
                    ${this.renderDiarrheeVomissements()}
                    ${this.renderMauxDeTete()}
                    ${this.renderToux()}
                </ul>
            `
        } else {
            return `
                ${this.renderTitle()}
                ${this.renderSymptomes()}
            `
        }
    }
}

module.exports = {
    Profil,
}
