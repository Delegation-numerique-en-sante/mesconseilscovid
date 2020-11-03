import { format } from 'timeago.js'

import { joursAvant, joursApres } from './utils.js'
import { createElementFromHTML, safeHtml } from './affichage.js'
import AlgorithmeSuivi from './algorithme/suivi.js'

export default class Profil {
    constructor(nom, data) {
        this.nom = nom
        this.fillData(data || {})
    }

    get suivi_start_date() {
        if (typeof this._suivi_start_date === 'undefined') return undefined
        return new Date(this._suivi_start_date)
    }

    set suivi_start_date(date) {
        this._suivi_start_date = typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get symptomes_start_date() {
        if (typeof this._symptomes_start_date === 'undefined') return undefined
        return new Date(this._symptomes_start_date)
    }

    set symptomes_start_date(date) {
        // Turn the date into a readable string.
        this._symptomes_start_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get depistage_start_date() {
        if (typeof this._depistage_start_date === 'undefined') return undefined
        return new Date(this._depistage_start_date)
    }

    set depistage_start_date(date) {
        // Turn the date into a readable string.
        this._depistage_start_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get deconfinement_date() {
        if (typeof this._suivi_start_date === 'undefined') return undefined
        return new Date(this._deconfinement_date)
    }

    set deconfinement_date(date) {
        this._deconfinement_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    resetSuivi() {
        this._suivi_start_date = undefined
        this._symptomes_start_date = undefined
        this._deconfinement_date = undefined
        this.suivi = []
    }

    resetData(nom) {
        this.nom = nom

        this.departement = undefined

        this.activite_pro = undefined
        this.activite_pro_public = undefined
        this.activite_pro_sante = undefined
        this.activite_pro_liberal = undefined

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
        this.contact_a_risque_meme_lieu_de_vie_actuel = undefined
        this.contact_a_risque_meme_lieu_de_vie = undefined
        this.contact_a_risque_contact_direct = undefined
        this.contact_a_risque_actes = undefined
        this.contact_a_risque_espace_confine = undefined
        this.contact_a_risque_meme_classe = undefined
        this.contact_a_risque_stop_covid = undefined
        this.contact_a_risque_autre = undefined

        this.depistage = undefined
        this.depistage_resultat = undefined
        this._depistage_start_date = undefined

        this.suivi_active = false
        this.resetSuivi()

        this.questionnaire_started = false
        this.questionnaire_completed = false
    }

    fillData(data) {
        this.departement = data['departement']

        this.activite_pro = data['activite_pro']
        this.activite_pro_public = data['activite_pro_public']
        this.activite_pro_sante = data['activite_pro_sante']
        this.activite_pro_liberal = data['activite_pro_liberal']

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
        this.contact_a_risque_meme_lieu_de_vie_actuel =
            data['contact_a_risque_meme_lieu_de_vie_actuel']
        this.contact_a_risque_meme_lieu_de_vie =
            data['contact_a_risque_meme_lieu_de_vie']
        this.contact_a_risque_contact_direct = data['contact_a_risque_contact_direct']
        this.contact_a_risque_actes = data['contact_a_risque_actes']
        this.contact_a_risque_espace_confine = data['contact_a_risque_espace_confine']
        this.contact_a_risque_meme_classe = data['contact_a_risque_meme_classe']
        this.contact_a_risque_stop_covid = data['contact_a_risque_stop_covid']
        this.contact_a_risque_autre = data['contact_a_risque_autre']

        this.depistage = data['depistage']
        this.depistage_resultat = data['depistage_resultat']
        this._depistage_start_date = data['_depistage_start_date']

        this._suivi_start_date = data['_suivi_start_date']
        this._symptomes_start_date = data['_symptomes_start_date']
        this._deconfinement_date = data['_deconfinement_date']
        this.suivi_active = data['suivi_active'] || false
        this.suivi = data['suivi'] || []

        this.fillQuestionnaireStarted(data['questionnaire_started'])
        this.fillQuestionnaireCompleted(data['questionnaire_completed'])
    }

    fillTestData(depistage, symptomes, personneFragile, foyerFragile) {
        let data = {
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
            contact_a_risque: false,
            contact_a_risque_meme_lieu_de_vie_actuel: false,
            contact_a_risque_meme_lieu_de_vie: false,
            contact_a_risque_contact_direct: false,
            contact_a_risque_actes: false,
            contact_a_risque_espace_confine: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_autre: false,
            depistage: false,
            depistage_resultat: '',
            departement: '34',
            activite_pro: false,
            activite_pro_public: false,
            activite_pro_sante: false,
            activite_pro_liberal: false,
            foyer_enfants: false,
            foyer_fragile: false,
            age: '42',
            grossesse_3e_trimestre: false,
            poids: '70',
            taille: '178',
            antecedent_cardio: false,
            antecedent_diabete: false,
            antecedent_respi: false,
            antecedent_dialyse: false,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_chronique_autre: false,
        }

        if (depistage == 'Positif') {
            data.depistage = true
            data.depistage_resultat = 'positif'
            data._depistage_start_date = new Date().toJSON()
        } else if (depistage == 'Négatif') {
            data.depistage = true
            data.depistage_resultat = 'negatif'
            data._depistage_start_date = new Date().toJSON()
        } else if (depistage == 'En attente') {
            data.depistage = true
            data.depistage_resultat = 'en_attente'
            data._depistage_start_date = new Date().toJSON()
        } else if (depistage == 'Pas testé') {
            // valeurs par défaut
        } else {
            console.error('Situation de dépistage inconnue')
        }

        if (symptomes === 'Symptômes actuels graves') {
            data.symptomes_actuels = true
            data.symptomes_actuels_souffle = true
            data._symptomes_start_date = joursAvant(3).toJSON()
        } else if (symptomes === 'Symptômes actuels') {
            data.symptomes_actuels = true
            data.symptomes_actuels_diarrhee = true
            data._symptomes_start_date = joursAvant(3).toJSON()
        } else if (symptomes === 'Symptômes actuels non évocateurs') {
            data.symptomes_actuels = true
            data.symptomes_actuels_autre = true
        } else if (symptomes === 'Symptômes passés') {
            data.symptomes_passes = true
            data._symptomes_start_date = joursAvant(3).toJSON()
        } else if (symptomes === 'Contact à risque') {
            data.contact_a_risque = true
            data.contact_a_risque_meme_lieu_de_vie = true
        } else if (symptomes === 'Contact pas vraiment à risque') {
            data.contact_a_risque = true
            data.contact_a_risque_autre = true
        } else if (symptomes === 'Rien de tout ça') {
            // valeurs par défaut
        } else {
            console.error('Situation symptomatique inconnue')
        }

        if (personneFragile) {
            data.age = 70
        }

        if (foyerFragile) {
            data.foyer_fragile = true
        }

        return this.fillData(data)
    }

    fillQuestionnaireStarted(value) {
        if (typeof value !== 'undefined') {
            this.questionnaire_started = value
        } else {
            // Migration d’un ancien profil : calculer la donnée manquante
            this.questionnaire_started = !this.isEmpty()
        }
    }

    fillQuestionnaireCompleted(value) {
        if (typeof value !== 'undefined') {
            this.questionnaire_completed = value
        } else {
            // Migration d’un ancien profil : calculer la donnée manquante
            this.questionnaire_completed = this.isComplete()
        }
    }

    getData() {
        return {
            departement: this.departement,
            activite_pro: this.activite_pro,
            activite_pro_public: this.activite_pro_public,
            activite_pro_sante: this.activite_pro_sante,
            activite_pro_liberal: this.activite_pro_liberal,
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
            contact_a_risque_meme_lieu_de_vie_actuel: this
                .contact_a_risque_meme_lieu_de_vie_actuel,
            contact_a_risque_meme_lieu_de_vie: this.contact_a_risque_meme_lieu_de_vie,
            contact_a_risque_contact_direct: this.contact_a_risque_contact_direct,
            contact_a_risque_actes: this.contact_a_risque_actes,
            contact_a_risque_espace_confine: this.contact_a_risque_espace_confine,
            contact_a_risque_meme_classe: this.contact_a_risque_meme_classe,
            contact_a_risque_stop_covid: this.contact_a_risque_stop_covid,
            contact_a_risque_autre: this.contact_a_risque_autre,
            depistage: this.depistage,
            depistage_resultat: this.depistage_resultat,
            _depistage_start_date: this._depistage_start_date,
            suivi_active: this.suivi_active,
            _suivi_start_date: this._suivi_start_date,
            _symptomes_start_date: this._symptomes_start_date,
            _deconfinement_date: this._deconfinement_date,
            suivi: this.suivi,
            questionnaire_started: this.questionnaire_started,
            questionnaire_completed: this.questionnaire_completed,
        }
    }

    isEmpty() {
        return (
            typeof this.departement === 'undefined' &&
            typeof this.activite_pro === 'undefined' &&
            typeof this.activite_pro_public === 'undefined' &&
            typeof this.activite_pro_sante === 'undefined' &&
            typeof this.activite_pro_liberal === 'undefined' &&
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
            typeof this.contact_a_risque === 'undefined' &&
            typeof this.depistage == 'undefined'
        )
    }

    isResidenceComplete() {
        return typeof this.departement !== 'undefined'
    }

    isFoyerComplete() {
        return (
            typeof this.foyer_enfants !== 'undefined' &&
            typeof this.foyer_fragile !== 'undefined'
        )
    }

    isAntecedentsComplete() {
        return (
            typeof this.antecedent_cardio !== 'undefined' &&
            typeof this.antecedent_diabete !== 'undefined' &&
            typeof this.antecedent_respi !== 'undefined' &&
            typeof this.antecedent_dialyse !== 'undefined' &&
            typeof this.antecedent_cancer !== 'undefined' &&
            typeof this.antecedent_immunodep !== 'undefined' &&
            typeof this.antecedent_cirrhose !== 'undefined' &&
            typeof this.antecedent_drepano !== 'undefined' &&
            typeof this.antecedent_chronique_autre !== 'undefined'
        )
    }

    isCaracteristiquesComplete() {
        return (
            typeof this.age !== 'undefined' &&
            typeof this.grossesse_3e_trimestre !== 'undefined' &&
            typeof this.poids !== 'undefined' &&
            typeof this.taille !== 'undefined'
        )
    }

    isActiviteProComplete() {
        return typeof this.activite_pro !== 'undefined'
    }

    isSymptomesActuelsComplete() {
        return typeof this.symptomes_actuels !== 'undefined'
    }

    isSymptomesPassesComplete() {
        return typeof this.symptomes_passes !== 'undefined'
    }

    isContactARisqueComplete() {
        return typeof this.contact_a_risque !== 'undefined'
    }

    isDepistageComplete() {
        return typeof this.depistage !== 'undefined'
    }

    isComplete() {
        return (
            this.isResidenceComplete() &&
            this.isFoyerComplete() &&
            this.isAntecedentsComplete() &&
            this.isCaracteristiquesComplete() &&
            this.isActiviteProComplete() &&
            this.isSymptomesActuelsComplete() &&
            this.isSymptomesPassesComplete() &&
            this.isContactARisqueComplete() &&
            this.isDepistageComplete()
        )
    }

    hasSymptomesActuelsReconnus() {
        return this.symptomes_actuels && !this.symptomes_actuels_autre
    }

    hasContactARisqueReconnus() {
        return this.contact_a_risque && !this.contact_a_risque_autre
    }

    hasSuiviStartDate() {
        return typeof this._suivi_start_date !== 'undefined'
    }

    hasSymptomesStartDate() {
        return typeof this._symptomes_start_date !== 'undefined'
    }

    hasDeconfinementDate() {
        return typeof this._deconfinement_date !== 'undefined'
    }

    hasHistorique() {
        return this.suivi.length
    }

    ajouterEtat(etat) {
        this.suivi.push(etat)
    }

    dernierEtat() {
        return this.hasHistorique() ? this.suivi.slice(-1)[0] : {}
    }

    suiviDerniersJours(delta) {
        return this.suivi.filter((etat) => new Date(etat.date) > joursAvant(delta))
    }

    suiviEntre(strictementApres, avant) {
        return this.suivi.filter((etat) => {
            const date = new Date(etat.date)
            return date > strictementApres && date <= avant
        })
    }

    requiertSuivi() {
        return (
            this.isDepistageComplete() &&
            (this.estPositif() ||
                this.estEnAttente() ||
                (this.sansDepistage() && this.hasSymptomesActuelsReconnus()) ||
                (this.sansDepistage() && this.symptomes_passes))
        )
    }

    depistageObsolete() {
        // TODISCUSS: reset depistage data if true?
        const delta = 7
        const now = new Date()
        const finDeValidite = joursApres(delta, this.depistage_start_date)
        return now > finDeValidite
    }

    estPositif() {
        return (
            this.depistage === true &&
            this.depistage_resultat === 'positif' &&
            !this.depistageObsolete()
        )
    }

    estNegatif() {
        return (
            this.depistage === true &&
            this.depistage_resultat === 'negatif' &&
            !this.depistageObsolete()
        )
    }

    estEnAttente() {
        return (
            this.depistage === true &&
            this.depistage_resultat === 'en_attente' &&
            !this.depistageObsolete()
        )
    }

    sansDepistage() {
        return this.depistage === false
    }

    estNegatifSymptomatique() {
        return this.hasSymptomesActuelsReconnus() && this.estNegatif()
    }

    estPositifAsymptomatique() {
        return this.symptomes_actuels === false && this.estPositif()
    }

    estMonProfil() {
        return this.nom == 'mes_infos'
    }

    affichageNom() {
        return this.estMonProfil() ? 'Moi' : this.nom
    }

    renderNom() {
        return safeHtml`<h3><span class="profil">${this.affichageNom()}</span></h3>`
    }

    renderButtons(questionnaire) {
        const possessifMasculinSingulier = this.estMonProfil() ? 'mon' : 'son'
        const possessifPluriel = this.estMonProfil() ? 'mes' : 'ses'
        var mainButton = ''
        if (this.isComplete() || this.suivi_active) {
            if (this.suivi_active) {
                const verbe =
                    this.hasSuiviStartDate() && this.hasHistorique()
                        ? 'Continuer'
                        : 'Démarrer'
                mainButton += safeHtml`
                    <a class="button suivi-link"
                        data-set-profil="${this.nom}" href="#suiviintroduction"
                        >${verbe} ${possessifMasculinSingulier} suivi</a>
                `
            }
            const outlined =
                this.estMonProfil() && !this.suivi_active ? '' : 'button-outline'
            mainButton += safeHtml`
                <a class="button ${outlined} conseils-link"
                    data-set-profil="${this.nom}" href="#conseils"
                    >Voir ${possessifPluriel} conseils</a>
            `
        } else {
            var label = this.isEmpty() ? 'Démarrer' : 'Continuer'
            mainButton = safeHtml`
                <a class="button button-full-width conseils-link"
                    data-set-profil="${this.nom}" href="#${questionnaire.firstPage}"
                    >${label}</a>
            `
        }
        return (
            mainButton +
            safeHtml`
            <a data-set-profil="${this.nom}" href="#${questionnaire.firstPage}"
                >Modifier ${possessifPluriel} réponses</a>
            <a data-delete-profil="${this.nom}" href=""
                >Supprimer ${possessifMasculinSingulier} profil</a>
            `
        )
    }

    renderCard(questionnaire) {
        return createElementFromHTML(`
        <li class="card">
            ${this.renderNom()}
            <div>${this.renderButtons(questionnaire)}</div>
        </li>
        `)
    }

    renderButtonSuivi() {
        const possessifMasculinSingulier = this.estMonProfil() ? 'mon' : 'son'
        const possessifPluriel = this.estMonProfil() ? 'mes' : 'ses'
        const label =
            this.hasSuiviStartDate() && this.hasHistorique() ? 'Continuer' : 'Démarrer'
        const nextPage = this.hasSymptomesStartDate()
            ? 'suivisymptomes'
            : 'debutsymptomes'
        const suiviButton = safeHtml`
            <a class="button button-full-width conseils-link"
                data-set-profil="${this.nom}" href="#${nextPage}"
                >${label} ${possessifMasculinSingulier} suivi</a>
        `
        const conseilsButton = safeHtml`
            <a class="button button-outline button-full-width conseils-link"
                data-set-profil="${this.nom}" href="#conseils"
                >Voir ${possessifPluriel} conseils</a>
        `
        let deleteLink = ''
        if (this.hasSuiviStartDate()) {
            deleteLink = safeHtml`
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
        return createElementFromHTML(`
        <li class="card">
            ${this.renderNom()}
            ${this.renderDernierSuivi()}
            <div>${this.renderButtonSuivi()}</div>
        </li>
        `)
    }

    renderDebutSymptomes() {
        return `<p>Début des symptômes :
            ${this.symptomes_start_date.toLocaleString()}
            (<a href="#debutsymptomes">modifier</a>)
        </p>`
    }

    renderDebutSuivi() {
        return `<p>Début du suivi : ${this.suivi_start_date.toLocaleString()}</p>`
    }

    suiviParSymptome(symptome) {
        return this.suivi.map((etat) => {
            return { date: etat.date, statut: etat[symptome] }
        })
    }

    switchSymptomeTitre(value) {
        let titre = ''
        switch (value) {
            case 'essoufflement':
                titre = 'Manque de souffle'
                break
            case 'etatGeneral':
                titre = 'État général'
                break
            case 'etatPsychologique':
                titre = 'État psychologique'
                break
            case 'alimentationHydratation':
                titre = 'Absence d’alimentation ou d’hydratation'
                break
            case 'diarrheeVomissements':
                titre = 'Diarrhée ou vomissements'
                break
            case 'fievre':
                titre = 'Fièvre supérieure à 39°C'
                break
            case 'confusion':
                titre = 'Somnolence ou confusion'
                break
            case 'mauxDeTete':
                titre = 'Maux de tête'
                break
            case 'toux':
                titre = 'Toux'
                break
        }
        return titre
    }

    switchStatut(value) {
        let statut = ''
        switch (value) {
            case 'critique':
                statut = 'Beaucoup moins bien'
                break
            case 'pire':
                statut = 'Un peu moins bien'
                break
            case 'stable':
                statut = 'Stable'
                break
            case 'aucun':
                statut = 'Pas ce symptôme'
                break
            case 'mieux':
                statut = 'Mieux'
                break
            case '':
                statut = 'Pas de symptômes'
                break
        }
        return statut
    }

    switchBooleen(value) {
        let booleen = ''
        switch (value) {
            case 'oui':
                booleen = 'Oui'
                break
            case 'non':
                booleen = 'Non'
                break
            case '':
                booleen = 'Pas de symptômes'
                break
        }
        return booleen
    }

    switchBooleenOptionnel(value) {
        let booleen = ''
        switch (value) {
            case 'oui':
                booleen = 'Oui'
                break
            case 'non':
                booleen = 'Non'
                break
            case '':
                booleen = 'Pas d’information'
                break
        }
        return booleen
    }

    switchGravite(value) {
        let gravite = ''
        switch (value) {
            case 'gravite_3':
                gravite = 'État grave, il est recommandé d’appeler le SAMU (15)'
                break
            case 'gravite_2':
                gravite =
                    'État préoccupant, consulter un médecin ou à défaut le SAMU (15)'
                break
            case 'gravite_1':
                gravite = 'État à vérifier, consulter votre médecin traitant'
                break
            case 'gravite_0':
                gravite = 'État correct'
                break
        }
        return gravite
    }

    switchIcone(value) {
        let icone = ''
        switch (value) {
            case 'critique':
                icone = 'gravite_superieure'
                break
            case 'oui':
                icone = 'gravite_superieure'
                break
            case 'gravite_3':
                icone = 'gravite_superieure'
                break
            case 'pire':
                icone = 'gravite'
                break
            case 'gravite_2':
                icone = 'gravite'
                break
            case 'stable':
                icone = 'stable'
                break
            case 'aucun':
                icone = 'stable'
                break
            case 'gravite_1':
                icone = 'stable'
                break
            case 'mieux':
                icone = 'ok'
                break
            case 'non':
                icone = 'ok'
                break
            case 'gravite_0':
                icone = 'ok'
                break
            case '':
                icone = 'interrogation'
                break
        }
        return icone
    }

    renderIcone(statut) {
        const imgSrc = `../suivi_${this.switchIcone(statut)}.svg`
        return `<img src="${imgSrc}" width="40px" height="40px" />`
    }

    renderSymptomeStatutTableCell(etat) {
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchStatut(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeStatutTable(data) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data.map((etat) => this.renderSymptomeStatutTableCell(etat)).join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeStatut(symptome, data) {
        const title = `<h3>${this.switchSymptomeTitre(symptome)}</h3>`
        return `${title}
            ${this.renderSymptomeStatutTable(data)}
        `
    }

    renderSymptomeBooleenTableCell(etat) {
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchBooleen(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeBooleenTable(data) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data.map((etat) => this.renderSymptomeBooleenTableCell(etat)).join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeBooleen(symptome, data) {
        const title = `<h3>${this.switchSymptomeTitre(symptome)}</h3>`
        return `${title}
            ${this.renderSymptomeBooleenTable(data)}
        `
    }

    renderSymptomeBooleenOptionnelTableCell(etat) {
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchBooleenOptionnel(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeBooleenOptionnelTable(data) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data
                .map((etat) => this.renderSymptomeBooleenOptionnelTableCell(etat))
                .join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeBooleenOptionnel(symptome, data) {
        const title = `<h3>${this.switchSymptomeTitre(symptome)}</h3>`
        return `${title}
            ${this.renderSymptomeBooleenOptionnelTable(data)}
        `
    }

    renderGraviteTableCell(etat, algoSuivi) {
        const gravite = `gravite_${algoSuivi.calculGravite(etat)}`
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(gravite)}</td>
            <td>${this.switchGravite(gravite)}</td>
        </tr>`
    }

    renderGraviteTable(data, algoSuivi) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data
                .map((etat) => this.renderGraviteTableCell(etat, algoSuivi))
                .join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderGravite() {
        const algoSuivi = new AlgorithmeSuivi(this)
        return `<h3>Bilan de votre situation</h3>
            ${this.renderGraviteTable(this.suivi, algoSuivi)}
        `
    }

    renderHistorique() {
        const symptomesStatuts = ['essoufflement', 'etatGeneral', 'etatPsychologique']
        const symptomesBooleens = [
            'alimentationHydratation',
            'diarrheeVomissements',
            'fievre',
        ]
        if (!this.estMonProfil()) {
            symptomesBooleens.push('confusion')
        }
        const symptomesBooleensOptionnels = ['mauxDeTete', 'toux']
        return createElementFromHTML(`
            <div>
                ${this.renderDebutSymptomes()}
                ${this.renderDebutSuivi()}
                ${this.renderGravite()}
                ${symptomesStatuts
                    .map((symptome) =>
                        this.renderSymptomeStatut(
                            symptome,
                            this.suiviParSymptome(symptome)
                        )
                    )
                    .join('\n')}
                ${symptomesBooleens
                    .map((symptome) =>
                        this.renderSymptomeBooleen(
                            symptome,
                            this.suiviParSymptome(symptome)
                        )
                    )
                    .join('\n')}
                ${symptomesBooleensOptionnels
                    .map((symptome) =>
                        this.renderSymptomeBooleenOptionnel(
                            symptome,
                            this.suiviParSymptome(symptome)
                        )
                    )
                    .join('\n')}
            </div>
        `)
    }
}
