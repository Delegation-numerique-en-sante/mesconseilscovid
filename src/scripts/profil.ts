import type Questionnaire from './questionnaire'

import { differenceEnJours, joursAvant } from './utils'
import { createElementFromHTML, safeHtml } from './affichage'

const JOURS_DE_VALIDITE_DEPISTAGE_NEGATIF = 7
const JOURS_DE_VALIDITE_DEPISTAGE_POSITIF = 30
const JOURS_DE_VALIDITE_DEPISTAGE_EN_ATTENTE = 7

export type Etat = {
    date: string
    symptomes: boolean
    essoufflement: string
    etatGeneral: string
    etatPsychologique: string
    alimentationHydratation: string
    fievre: string
    diarrheeVomissements: string
    mauxDeTete: string
    toux: string
    confusion?: string
}

export type ProfilDataContactARisque = {
    contact_a_risque?: boolean
    contact_a_risque_meme_lieu_de_vie?: boolean
    contact_a_risque_contact_direct?: boolean
    contact_a_risque_actes?: boolean
    contact_a_risque_espace_confine?: boolean
    contact_a_risque_tousse_eternue?: boolean
    contact_a_risque_meme_classe?: boolean
    contact_a_risque_stop_covid?: boolean
    contact_a_risque_assurance_maladie?: boolean
    contact_a_risque_autre?: boolean
    // contact_a_risque_variante?: 'aucune'
}

export type ProfilDataAntecedent = {
    antecedent_cardio?: boolean
    antecedent_diabete?: boolean
    antecedent_respi?: boolean
    antecedent_dialyse?: boolean
    antecedent_greffe?: boolean
    antecedent_cancer?: boolean
    antecedent_immunodep?: boolean
    antecedent_cirrhose?: boolean
    antecedent_drepano?: boolean
    antecedent_trisomie?: boolean
    antecedent_chronique_autre?: boolean
}

export type ProfilDataSituation = {
    activite_pro?: boolean
    activite_pro_sante?: boolean

    foyer_autres_personnes?: boolean
    foyer_enfants?: boolean
}

export type ProfilDataSymptomesActuels = {
    symptomes_actuels?: boolean
    symptomes_actuels_temperature?: boolean
    symptomes_actuels_temperature_inconnue?: boolean
    symptomes_actuels_toux?: boolean
    symptomes_actuels_odorat?: boolean
    symptomes_actuels_douleurs?: boolean
    symptomes_actuels_diarrhee?: boolean
    symptomes_actuels_fatigue?: boolean
    symptomes_actuels_alimentation?: boolean
    symptomes_actuels_souffle?: boolean
    symptomes_actuels_autre?: boolean
}

export type ProfilData = ProfilDataContactARisque &
    ProfilDataAntecedent &
    ProfilDataSituation &
    ProfilDataSymptomesActuels & {
        // [key: string]: any
        _suivi_start_date?: string
        _symptomes_start_date?: string
        _depistage_start_date?: string
        _covid_passee_date?: string
        _deconfinement_date?: string
        _questionnaire_start_date?: string
        _questionnaire_completion_date?: string
        suivi?: Etat[]

        departement?: string

        age?: number
        grossesse_3e_trimestre?: boolean
        poids?: number
        taille?: number

        symptomes_passes?: boolean

        depistage?: boolean
        depistage_type?: string
        depistage_resultat?: 'positif' | 'negatif' | 'en_attente'
        depistage_variante?: string

        vaccins?: boolean | string

        covid_passee?: boolean

        suivi_active?: boolean

        // Legacy: to be removed once migrated.
        questionnaire_started?: boolean
        questionnaire_completed?: boolean
        // End of Legacy
    }

export default class Profil {
    nom: string
    _suivi_start_date: string | undefined
    _symptomes_start_date: string | undefined
    _depistage_start_date: string | undefined
    _covid_passee_date: string | undefined
    _deconfinement_date: string | undefined
    _questionnaire_start_date: string | undefined
    _questionnaire_completion_date: string | undefined

    suivi: Etat[]

    departement: string | undefined

    activite_pro: boolean | undefined
    activite_pro_sante: boolean | undefined

    foyer_autres_personnes: boolean | undefined
    foyer_enfants: boolean | undefined

    age: number | undefined
    grossesse_3e_trimestre: boolean | undefined
    poids: number | undefined
    taille: number | undefined

    antecedent_cardio: boolean | undefined
    antecedent_diabete: boolean | undefined
    antecedent_respi: boolean | undefined
    antecedent_dialyse: boolean | undefined
    antecedent_greffe: boolean | undefined
    antecedent_cancer: boolean | undefined
    antecedent_immunodep: boolean | undefined
    antecedent_cirrhose: boolean | undefined
    antecedent_drepano: boolean | undefined
    antecedent_trisomie: boolean | undefined
    antecedent_chronique_autre: boolean | undefined

    symptomes_actuels: boolean | undefined
    symptomes_actuels_temperature: boolean | undefined
    symptomes_actuels_temperature_inconnue: boolean | undefined
    symptomes_actuels_toux: boolean | undefined
    symptomes_actuels_odorat: boolean | undefined
    symptomes_actuels_douleurs: boolean | undefined
    symptomes_actuels_diarrhee: boolean | undefined
    symptomes_actuels_fatigue: boolean | undefined
    symptomes_actuels_alimentation: boolean | undefined
    symptomes_actuels_souffle: boolean | undefined
    symptomes_actuels_autre: boolean | undefined

    symptomes_passes: boolean | undefined

    contact_a_risque: boolean | undefined
    contact_a_risque_meme_lieu_de_vie: boolean | undefined
    contact_a_risque_contact_direct: boolean | undefined
    contact_a_risque_actes: boolean | undefined
    contact_a_risque_espace_confine: boolean | undefined
    contact_a_risque_tousse_eternue: boolean | undefined
    contact_a_risque_meme_classe: boolean | undefined
    contact_a_risque_stop_covid: boolean | undefined
    contact_a_risque_assurance_maladie: boolean | undefined
    contact_a_risque_autre: boolean | undefined
    contact_a_risque_variante: 'aucune' | undefined

    depistage: boolean | undefined
    depistage_type: string | undefined
    depistage_resultat: 'positif' | 'negatif' | 'en_attente' | undefined
    depistage_variante: string | undefined

    vaccins: boolean | string | undefined

    covid_passee: boolean | undefined

    suivi_active: boolean | undefined

    // Legacy: to be removed once migrated.
    questionnaire_started: boolean | undefined
    questionnaire_completed: boolean | undefined
    // End of Legacy

    constructor(nom: string = 'mes_infos', data: ProfilData = {}) {
        this.nom = nom
        this.suivi = []
        this.fillData(data)
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
        this._symptomes_start_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get depistage_start_date() {
        if (typeof this._depistage_start_date === 'undefined') return undefined
        return new Date(this._depistage_start_date)
    }

    set depistage_start_date(date) {
        this._depistage_start_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get covid_passee_date() {
        if (typeof this._covid_passee_date === 'undefined') return undefined
        return new Date(this._covid_passee_date)
    }

    set covid_passee_date(date) {
        this._covid_passee_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get deconfinement_date() {
        if (typeof this._deconfinement_date === 'undefined') return undefined
        return new Date(this._deconfinement_date)
    }

    set deconfinement_date(date) {
        this._deconfinement_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get questionnaire_start_date() {
        if (typeof this._questionnaire_start_date === 'undefined') return undefined
        return new Date(this._questionnaire_start_date)
    }

    set questionnaire_start_date(date) {
        this._questionnaire_start_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    get questionnaire_completion_date() {
        if (typeof this._questionnaire_completion_date === 'undefined') return undefined
        return new Date(this._questionnaire_completion_date)
    }

    set questionnaire_completion_date(date) {
        this._questionnaire_completion_date =
            typeof date !== 'undefined' ? date.toJSON() : undefined
    }

    resetSuivi() {
        this._suivi_start_date = undefined
        this._deconfinement_date = undefined
        this.suivi = []
    }

    resetData(nom: string = 'mes_infos') {
        this.nom = nom

        this.departement = undefined

        this.activite_pro = undefined
        this.activite_pro_sante = undefined

        this.foyer_autres_personnes = undefined
        this.foyer_enfants = undefined

        this.age = undefined
        this.grossesse_3e_trimestre = undefined
        this.poids = undefined
        this.taille = undefined

        this.antecedent_cardio = undefined
        this.antecedent_diabete = undefined
        this.antecedent_respi = undefined
        this.antecedent_dialyse = undefined
        this.antecedent_greffe = undefined
        this.antecedent_cancer = undefined
        this.antecedent_immunodep = undefined
        this.antecedent_cirrhose = undefined
        this.antecedent_drepano = undefined
        this.antecedent_trisomie = undefined
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
        this.contact_a_risque_tousse_eternue = undefined
        this.contact_a_risque_meme_classe = undefined
        this.contact_a_risque_stop_covid = undefined
        this.contact_a_risque_assurance_maladie = undefined
        this.contact_a_risque_autre = undefined
        this.contact_a_risque_variante = undefined

        this._symptomes_start_date = undefined

        this.depistage = undefined
        this.depistage_type = undefined
        this.depistage_resultat = undefined
        this.depistage_variante = undefined
        this._depistage_start_date = undefined

        this.vaccins = undefined

        this.covid_passee = undefined
        this._covid_passee_date = undefined

        this.suivi_active = false
        this.resetSuivi()

        // Legacy: to be removed once migrated.
        this.questionnaire_started = false
        this.questionnaire_completed = false
        // End of Legacy

        this._questionnaire_start_date = undefined
        this._questionnaire_completion_date = undefined
    }

    fillData(data: ProfilData) {
        this.departement = data['departement']

        this.activite_pro = data['activite_pro']
        this.activite_pro_sante = data['activite_pro_sante']

        if (typeof data['foyer_autres_personnes'] !== 'undefined') {
            this.foyer_autres_personnes = data['foyer_autres_personnes']
        } else {
            // Migration
            this.foyer_autres_personnes = data['foyer_enfants']
        }
        this.foyer_enfants = data['foyer_enfants']

        this.age = data['age']
        this.grossesse_3e_trimestre = data['grossesse_3e_trimestre']
        this.poids = data['poids']
        this.taille = data['taille']

        this.antecedent_cardio = data['antecedent_cardio']
        this.antecedent_diabete = data['antecedent_diabete']
        this.antecedent_respi = data['antecedent_respi']
        this.antecedent_dialyse = data['antecedent_dialyse']
        this.antecedent_greffe = data['antecedent_greffe']
        this.antecedent_cancer = data['antecedent_cancer']
        this.antecedent_immunodep = data['antecedent_immunodep']
        this.antecedent_cirrhose = data['antecedent_cirrhose']
        this.antecedent_drepano = data['antecedent_drepano']
        this.antecedent_trisomie = data['antecedent_trisomie']
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
        this.contact_a_risque_tousse_eternue = data['contact_a_risque_tousse_eternue']
        this.contact_a_risque_meme_classe = data['contact_a_risque_meme_classe']
        this.contact_a_risque_stop_covid = data['contact_a_risque_stop_covid']
        this.contact_a_risque_assurance_maladie =
            data['contact_a_risque_assurance_maladie']
        this.contact_a_risque_autre = data['contact_a_risque_autre']
        this.contact_a_risque_variante = data['contact_a_risque_variante']

        this.depistage = data['depistage']
        this.depistage_type = data['depistage_type']
        this.depistage_resultat = data['depistage_resultat']
        this.depistage_variante = data['depistage_variante']
        this._depistage_start_date = data['_depistage_start_date']

        if (typeof data['vaccins'] === 'boolean') {
            this.vaccins = data['vaccins'] ? 'completement' : 'pas_encore'
        } else {
            this.vaccins = data['vaccins']
        }

        this.covid_passee = data['covid_passee']
        this._covid_passee_date = data['_covid_passee_date']

        this._suivi_start_date = data['_suivi_start_date']
        this._symptomes_start_date = data['_symptomes_start_date']
        this._deconfinement_date = data['_deconfinement_date']
        this.suivi_active = data['suivi_active'] || false
        this.suivi = data['suivi'] || []

        // Legacy
        this.fillQuestionnaireStarted(data['questionnaire_started'])
        this.fillQuestionnaireCompleted(data['questionnaire_completed'])

        this.fillQuestionnaireStartDate(data['_questionnaire_start_date'])
        this.fillQuestionnaireCompletionDate(data['_questionnaire_completion_date'])
        // End of Legacy

        /* At some point we would want to do instead:
        this._questionnaire_start_date = data['_questionnaire_start_date']
        this._questionnaire_completion_date = data['_questionnaire_completion_date']
        */
    }

    // Legacy: at some point we will want to remove this method.
    fillQuestionnaireStarted(value: boolean | undefined) {
        if (typeof value !== 'undefined') {
            this.questionnaire_started = value
        } else {
            // Migration d’un ancien profil : calculer la donnée manquante.
            this.questionnaire_started = !this.isEmpty()
        }
    }

    // Legacy: at some point we will want to remove this method.
    fillQuestionnaireCompleted(value: boolean | undefined) {
        if (typeof value !== 'undefined') {
            this.questionnaire_completed = value
        } else {
            // Migration d’un ancien profil : calculer la donnée manquante.
            this.questionnaire_completed = this.isComplete()
        }
    }

    // Legacy: at some point we will want to remove this method.
    fillQuestionnaireStartDate(value: string | undefined) {
        if (typeof value !== 'undefined') {
            this._questionnaire_start_date = value
        } else {
            // Migration d’un ancien profil : calculer la donnée manquante.
            this.questionnaire_start_date = this.questionnaire_started
                ? new Date()
                : undefined
        }
    }

    // Legacy: at some point we will want to remove this method.
    fillQuestionnaireCompletionDate(value: string | undefined) {
        if (typeof value !== 'undefined') {
            this._questionnaire_completion_date = value
        } else {
            // Migration d’un ancien profil : calculer la donnée manquante.
            this.questionnaire_completion_date = this.questionnaire_completed
                ? new Date()
                : undefined
        }
    }

    fillContactARisque(value: boolean) {
        this.contact_a_risque = value
        this.contact_a_risque_meme_lieu_de_vie = undefined
        this.contact_a_risque_contact_direct = undefined
        this.contact_a_risque_actes = undefined
        this.contact_a_risque_espace_confine = undefined
        this.contact_a_risque_tousse_eternue = undefined
        this.contact_a_risque_meme_classe = undefined
        this.contact_a_risque_stop_covid = undefined
        this.contact_a_risque_assurance_maladie = undefined
        this.contact_a_risque_autre = undefined
        this.contact_a_risque_variante = undefined
    }

    fillTestData(
        depistage: 'Positif' | 'Négatif' | 'En attente' | 'Pas testé',
        symptomes:
            | 'Symptômes actuels graves'
            | 'Symptômes actuels'
            | 'Symptômes actuels non évocateurs'
            | 'Symptômes passés'
            | 'Contact à risque'
            | 'Contact pas vraiment à risque'
            | 'Rien de tout ça',
        personneFragile: boolean
    ) {
        let data: ProfilData = {
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
            contact_a_risque_meme_lieu_de_vie: false,
            contact_a_risque_contact_direct: false,
            contact_a_risque_actes: false,
            contact_a_risque_espace_confine: false,
            contact_a_risque_tousse_eternue: false,
            contact_a_risque_meme_classe: false,
            contact_a_risque_stop_covid: false,
            contact_a_risque_assurance_maladie: false,
            contact_a_risque_autre: false,
            contact_a_risque_variante: 'aucune',
            depistage: false,
            depistage_type: '',
            depistage_resultat: undefined,
            depistage_variante: 'aucune',
            vaccins: 'pas_encore',
            covid_passee: false,
            departement: '34',
            activite_pro: false,
            activite_pro_sante: false,
            foyer_autres_personnes: false,
            foyer_enfants: false,
            age: 42,
            grossesse_3e_trimestre: false,
            poids: 70,
            taille: 178,
            antecedent_cardio: false,
            antecedent_diabete: false,
            antecedent_respi: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_immunodep: false,
            antecedent_cirrhose: false,
            antecedent_drepano: false,
            antecedent_trisomie: false,
            antecedent_chronique_autre: false,
            _depistage_start_date: '',
            _symptomes_start_date: '',
        }

        if (depistage == 'Positif') {
            data.depistage = true
            data.depistage_type = 'rt-pcr'
            data.depistage_resultat = 'positif'
            data._depistage_start_date = new Date().toJSON()
        } else if (depistage == 'Négatif') {
            data.depistage = true
            data.depistage_type = 'rt-pcr'
            data.depistage_resultat = 'negatif'
            data._depistage_start_date = new Date().toJSON()
        } else if (depistage == 'En attente') {
            data.depistage = true
            data.depistage_type = 'rt-pcr'
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

        return this.fillData(data)
    }

    getData(): ProfilData {
        return {
            activite_pro: this.activite_pro,
            activite_pro_sante: this.activite_pro_sante,
            foyer_autres_personnes: this.foyer_autres_personnes,
            foyer_enfants: this.foyer_enfants,
            age: this.age,
            grossesse_3e_trimestre: this.grossesse_3e_trimestre,
            poids: this.poids,
            taille: this.taille,
            antecedent_cardio: this.antecedent_cardio,
            antecedent_diabete: this.antecedent_diabete,
            antecedent_respi: this.antecedent_respi,
            antecedent_dialyse: this.antecedent_dialyse,
            antecedent_greffe: this.antecedent_greffe,
            antecedent_cancer: this.antecedent_cancer,
            antecedent_immunodep: this.antecedent_immunodep,
            antecedent_cirrhose: this.antecedent_cirrhose,
            antecedent_drepano: this.antecedent_drepano,
            antecedent_trisomie: this.antecedent_trisomie,
            antecedent_chronique_autre: this.antecedent_chronique_autre,
            symptomes_actuels: this.symptomes_actuels,
            symptomes_actuels_temperature: this.symptomes_actuels_temperature,
            symptomes_actuels_temperature_inconnue:
                this.symptomes_actuels_temperature_inconnue,
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
            contact_a_risque_tousse_eternue: this.contact_a_risque_tousse_eternue,
            contact_a_risque_meme_classe: this.contact_a_risque_meme_classe,
            contact_a_risque_stop_covid: this.contact_a_risque_stop_covid,
            contact_a_risque_assurance_maladie: this.contact_a_risque_assurance_maladie,
            contact_a_risque_autre: this.contact_a_risque_autre,
            contact_a_risque_variante: this.contact_a_risque_variante,
            depistage: this.depistage,
            depistage_type: this.depistage_type,
            depistage_resultat: this.depistage_resultat,
            depistage_variante: this.depistage_variante,
            _depistage_start_date: this._depistage_start_date,
            vaccins: this.vaccins,
            covid_passee: this.covid_passee,
            _covid_passee_date: this._covid_passee_date,
            suivi_active: this.suivi_active,
            _suivi_start_date: this._suivi_start_date,
            _symptomes_start_date: this._symptomes_start_date,
            _deconfinement_date: this._deconfinement_date,
            suivi: this.suivi,
            questionnaire_started: this.questionnaire_started,
            questionnaire_completed: this.questionnaire_completed,
            _questionnaire_start_date: this._questionnaire_start_date,
            _questionnaire_completion_date: this._questionnaire_completion_date,
        }
    }

    isEmpty() {
        return (
            typeof this.activite_pro === 'undefined' &&
            typeof this.activite_pro_sante === 'undefined' &&
            typeof this.foyer_autres_personnes === 'undefined' &&
            typeof this.foyer_enfants === 'undefined' &&
            typeof this.age === 'undefined' &&
            typeof this.grossesse_3e_trimestre === 'undefined' &&
            typeof this.poids === 'undefined' &&
            typeof this.taille === 'undefined' &&
            typeof this.antecedent_cardio === 'undefined' &&
            typeof this.antecedent_diabete === 'undefined' &&
            typeof this.antecedent_respi === 'undefined' &&
            typeof this.antecedent_dialyse === 'undefined' &&
            typeof this.antecedent_greffe === 'undefined' &&
            typeof this.antecedent_cancer === 'undefined' &&
            typeof this.antecedent_immunodep === 'undefined' &&
            typeof this.antecedent_cirrhose === 'undefined' &&
            typeof this.antecedent_drepano === 'undefined' &&
            typeof this.antecedent_trisomie === 'undefined' &&
            typeof this.antecedent_chronique_autre === 'undefined' &&
            typeof this.symptomes_actuels === 'undefined' &&
            typeof this.symptomes_passes === 'undefined' &&
            typeof this.contact_a_risque === 'undefined' &&
            typeof this.depistage == 'undefined' &&
            typeof this.vaccins == 'undefined' &&
            typeof this.covid_passee == 'undefined'
        )
    }

    isAntecedentsComplete() {
        return (
            typeof this.antecedent_cardio !== 'undefined' &&
            typeof this.antecedent_diabete !== 'undefined' &&
            typeof this.antecedent_respi !== 'undefined' &&
            typeof this.antecedent_dialyse !== 'undefined' &&
            typeof this.antecedent_greffe !== 'undefined' &&
            typeof this.antecedent_cancer !== 'undefined' &&
            typeof this.antecedent_immunodep !== 'undefined' &&
            typeof this.antecedent_cirrhose !== 'undefined' &&
            typeof this.antecedent_drepano !== 'undefined' &&
            typeof this.antecedent_trisomie !== 'undefined' &&
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

    isSanteComplete() {
        return this.isAntecedentsComplete() && this.isCaracteristiquesComplete()
    }

    isSituationComplete() {
        return (
            typeof this.foyer_autres_personnes !== 'undefined' &&
            typeof this.foyer_enfants !== 'undefined' &&
            typeof this.activite_pro !== 'undefined' &&
            typeof this.activite_pro_sante !== 'undefined'
        )
    }

    isSymptomesComplete() {
        return (
            this._isSymptomesActuelsComplete() &&
            this._isSymptomesPassesComplete() &&
            this._isDebutSymptomesComplete()
        )
    }

    _isSymptomesActuelsComplete() {
        return typeof this.symptomes_actuels !== 'undefined'
    }

    _isSymptomesPassesComplete() {
        return typeof this.symptomes_passes !== 'undefined'
    }

    _isDebutSymptomesComplete() {
        if (this.hasSymptomesActuelsReconnus() || this.symptomes_passes) {
            return this.hasSymptomesStartDate()
        } else {
            return true
        }
    }

    isContactARisqueComplete() {
        return (
            typeof this.contact_a_risque !== 'undefined' ||
            typeof this.contact_a_risque_stop_covid !== 'undefined' ||
            typeof this.contact_a_risque_assurance_maladie !== 'undefined'
        )
    }

    isDepistageComplete() {
        if (typeof this.depistage === 'undefined') {
            return false
        }
        if (this.depistage === true) {
            return typeof this._depistage_start_date !== 'undefined'
        }
        return true
    }

    isVaccinsComplete() {
        return typeof this.vaccins !== 'undefined'
    }

    isHistoriqueComplete() {
        if (typeof this.covid_passee === 'undefined') {
            return false
        }
        if (this.covid_passee === true) {
            return typeof this._covid_passee_date !== 'undefined'
        }
        return true
    }

    isComplete() {
        return (
            this.isSituationComplete() &&
            this.isSanteComplete() &&
            this.isSymptomesComplete() &&
            this.isContactARisqueComplete() &&
            this.isDepistageComplete() &&
            this.isVaccinsComplete() &&
            this.isHistoriqueComplete() &&
            this._isDebutSymptomesComplete()
        )
    }

    joursDepuisCovidPassee(): number {
        return differenceEnJours(this.covid_passee_date!, new Date())
    }

    _hasCovidPlus(months: number) {
        return this.covid_passee && this.joursDepuisCovidPassee() > months * 30 // approximation
    }

    hasCovidPlus2Mois() {
        return this._hasCovidPlus(2)
    }

    hasCovidPlus6Mois() {
        return this._hasCovidPlus(6)
    }

    hasSymptomesActuelsReconnus() {
        return Boolean(this.symptomes_actuels && !this.symptomes_actuels_autre)
    }

    hasContactARisqueReconnus() {
        return (
            (this.contact_a_risque && !this.contact_a_risque_autre) ||
            this.contact_a_risque_stop_covid ||
            this.contact_a_risque_assurance_maladie
        )
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

    ajouterEtat(etat: Etat) {
        this.suivi.push(etat)
    }

    dernierEtat(): Etat | {} {
        return this.hasHistorique() ? this.suivi.slice(-1)[0] : {}
    }

    suiviDerniersJours(delta: number) {
        return this.suivi.filter((etat) => new Date(etat.date) > joursAvant(delta))
    }

    suiviAujourdhui() {
        return this.suiviDerniersJours(1).length >= 1
    }

    suiviEntre(strictementApres: Date, avant: Date) {
        return this.suivi.filter((etat) => {
            const date = new Date(etat.date)
            return date > strictementApres && date <= avant
        })
    }

    isCompletementVaccine() {
        return this.vaccins === 'completement'
    }

    dureeIsolement() {
        if (typeof this.age === 'undefined') return 10
        return this.isCompletementVaccine() || this.age < 12 ? 7 : 10
    }

    requiertSuivi() {
        return (
            this.isDepistageComplete() &&
            (this.depistagePositifRecent() ||
                this.depistageEnAttenteRecent() ||
                (this.sansDepistage() && this.hasSymptomesActuelsReconnus()) ||
                (this.sansDepistage() && this.symptomes_passes))
        )
    }

    joursEcoulesDepuisDepistage() {
        if (typeof this.depistage_start_date === 'undefined') {
            return undefined
        }
        const res = differenceEnJours(this.depistage_start_date, new Date())
        return res
    }

    depistagePositifRecent() {
        return (
            this.depistage === true &&
            this.depistage_resultat === 'positif' &&
            typeof this.depistage_start_date !== 'undefined' &&
            this.joursEcoulesDepuisDepistage()! < JOURS_DE_VALIDITE_DEPISTAGE_POSITIF
        )
    }

    depistagePositifObsolete() {
        return (
            this.depistage === true &&
            this.depistage_resultat === 'positif' &&
            typeof this.depistage_start_date !== 'undefined' &&
            this.joursEcoulesDepuisDepistage()! >= JOURS_DE_VALIDITE_DEPISTAGE_POSITIF
        )
    }

    // On considère un résultat négatif comme valable s’il est assez récent
    // et qu’il ne date pas d’avant le début d’éventuels symptômes.
    depistageNegatifRecent() {
        return (
            this._depistageNegatif() &&
            !(
                this._depistageNegatifTropAncien() ||
                this._depistageNegatifAvantDebutDesSymptomes()
            )
        )
    }

    // On considère un résultat négatif comme obsolète s’il est trop ancien
    // ou s’il date d’avant le début d’éventuels symptômes.
    depistageNegatifObsolete() {
        return (
            this._depistageNegatif() &&
            (this._depistageNegatifTropAncien() ||
                this._depistageNegatifAvantDebutDesSymptomes())
        )
    }

    _depistageNegatif() {
        return (
            this.depistage === true &&
            this.depistage_resultat === 'negatif' &&
            typeof this.depistage_start_date !== 'undefined'
        )
    }

    _depistageNegatifTropAncien() {
        return (
            typeof this.depistage_start_date !== 'undefined' &&
            this.joursEcoulesDepuisDepistage()! >= JOURS_DE_VALIDITE_DEPISTAGE_NEGATIF
        )
    }

    _depistageNegatifAvantDebutDesSymptomes() {
        return (
            this.hasSymptomesActuelsReconnus() &&
            this.depistage_start_date! < this.symptomes_start_date!
        )
    }

    depistageEnAttenteRecent() {
        return (
            this.depistage === true &&
            this.depistage_resultat === 'en_attente' &&
            typeof this.depistage_start_date !== 'undefined' &&
            this.joursEcoulesDepuisDepistage()! < JOURS_DE_VALIDITE_DEPISTAGE_EN_ATTENTE
        )
    }

    sansDepistage() {
        return this.depistage === false
    }

    depistageNegatifRecentSymptomatique() {
        return this.hasSymptomesActuelsReconnus() && this.depistageNegatifRecent()
    }

    depistagePositifRecentSymptomatique() {
        return this.hasSymptomesActuelsReconnus() && this.depistagePositifRecent()
    }

    depistagePositifRecentAsymptomatique() {
        return (
            this.depistagePositifRecent() &&
            !this.hasSymptomesActuelsReconnus() &&
            !this.symptomes_passes
        )
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

    renderButtons(questionnaire: Questionnaire) {
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
                    <a class="button button-outline suivi-link"
                        data-set-profil="${this.nom}" href="#suiviintroduction"
                        >${verbe} ${possessifMasculinSingulier} suivi</a>
                `
            }
            mainButton += safeHtml`
                <a class="button button-outline conseils-link"
                    data-set-profil="${this.nom}" href="#conseils"
                    >Retrouver ${possessifPluriel} conseils</a>
            `
        } else {
            const label = this.isEmpty() ? 'Démarrer' : 'Continuer'
            mainButton = safeHtml`
                <a class="button button-outline button-full-width conseils-link"
                    data-set-profil="${this.nom}" href="#${questionnaire.firstPage}"
                    >${label} ${possessifMasculinSingulier} questionnaire</a>
            `
        }
        const continueButton = this.isEmpty()
            ? ''
            : safeHtml`
        <a data-set-profil="${this.nom}" href="#${questionnaire.firstPage}"
            >Modifier ${possessifPluriel} réponses</a>
        `
        const deleteButton = safeHtml`
            <a data-delete-profil="${this.nom}" href="" role="button"
                >Supprimer ${possessifPluriel} réponses</a>
            `
        return mainButton + continueButton + deleteButton
    }

    renderCard(questionnaire: Questionnaire) {
        return createElementFromHTML(`
        <li class="card">
            ${this.renderNom()}
            <div>${this.renderButtons(questionnaire)}</div>
        </li>
        `)
    }
}
