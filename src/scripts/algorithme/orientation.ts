import type Profil from '../profil'
import AlgorithmeVaccination from './vaccination'

// Les statuts possibles en sortie de l’algorithme.
const STATUTS = [
    'antigenique-negatif-fragile',
    'asymptomatique',
    'asymptomatique-positif-autotest',
    'contact-a-risque-meme-lieu-de-vie',
    'contact-a-risque-meme-lieu-de-vie-sans-depistage-vaccine',
    'contact-a-risque-meme-lieu-de-vie-vaccine',
    'contact-a-risque-non-vaccine',
    'contact-a-risque-vaccine',
    'en-attente',
    'personne-fragile',
    'peu-de-risques',
    'positif-symptomatique-urgent',
    'symptomatique-autotest-positif',
    'symptomatique-en-attente',
    'symptomatique-negatif',
    'symptomatique-positif',
    'symptomatique-sans-test',
    'symptomatique-urgent',
]

// Les blocs de conseils personnels possibles en sortie de l’algorithme.
const CONSEILS_PERSONNELS = [
    'antigenique-negatif-fragile',
    'contact-a-risque-autre',
    'contact-a-risque-meme-lieu-de-vie',
    'contact-a-risque-meme-lieu-de-vie-sans-depistage-vaccine',
    'contact-a-risque-meme-lieu-de-vie-vaccine',
    'contact-a-risque-non-vaccine',
    'contact-a-risque-vaccine',
    'depistage-positif-autotest-asymptomatique',
    'depistage-positif-autotest-symptomatique',
    'depistage-positif-asymptomatique',
    'depistage-positif-symptomatique',
    'peu-de-risques',
    'symptomes-actuels-en-attente',
    'symptomes-actuels-positif-critique',
    'symptomes-actuels-sans-depistage',
    'symptomes-actuels-sans-depistage-critique',
    'symptomes-passes-en-attente',
    'symptomes-passes-positif',
    'symptomes-passes-positif-autotest',
    'symptomes-passes-sans-depistage',
]

export default class AlgorithmeOrientation {
    profil: Profil

    constructor(profil: Profil) {
        this.profil = profil
    }

    get situation() {
        if (!this.profil.isComplete()) return ''
        return this._situationDepistage() + '_' + this._situationSymptomes()
    }

    _situationDepistage() {
        if (
            !this.profil.depistage ||
            this.profil.depistageNegatifObsolete() ||
            this.profil.depistagePositifObsolete()
        ) {
            return 'pas_teste'
        }
        if (
            this.profil.depistage_type === 'antigenique' &&
            this.profil.depistage_resultat === 'negatif' &&
            this.personneFragile
        ) {
            return 'antigenique_negatif_fragile'
        } else if (
            this.profil.depistage_type === 'antigenique_autotest' &&
            this.profil.depistage_resultat === 'positif'
        ) {
            return 'autotest_positif'
        } else {
            return this.profil.depistage_resultat
        }
    }

    _situationSymptomes() {
        let symptomes
        if (this.profil.hasSymptomesActuelsReconnus()) {
            symptomes = 'symptomes_actuels'
            if (this.facteursDeGraviteMajeurs) {
                symptomes += '_graves'
            }
        } else if (this.profil.symptomes_passes) {
            symptomes = 'symptomes_passes'
        } else if (this.profil.hasContactARisqueReconnus()) {
            const completementVaccine = this.profil.isCompletementVaccine()
            const moinsDe12Ans = this.profil.age! < 12
            if (this.profil.contact_a_risque_meme_lieu_de_vie) {
                if (completementVaccine || moinsDe12Ans) {
                    symptomes = 'contact_a_risque_meme_lieu_de_vie_vaccine'
                } else {
                    symptomes = 'contact_a_risque_meme_lieu_de_vie'
                }
            } else {
                if (completementVaccine || moinsDe12Ans) {
                    symptomes = 'contact_a_risque_vaccine'
                } else if (this.guerisonRecente()) {
                    symptomes = 'contact_pas_vraiment_a_risque'
                } else {
                    symptomes = 'contact_a_risque'
                }
            }
        } else if (this.profil.contact_a_risque_autre) {
            symptomes = 'contact_pas_vraiment_a_risque'
        } else {
            symptomes = 'asymptomatique'
        }
        return symptomes
    }

    guerisonRecente() {
        return this.profil.covid_passee && this.profil.joursDepuisCovidPassee() < 60
    }

    get sup65() {
        return this.profil.age! >= 65
    }

    get sup50() {
        return this.profil.age! >= 50
    }

    get sup15() {
        return this.profil.age! >= 15
    }

    get imc() {
        const taille_en_metres = this.profil.taille! / 100
        return this.profil.poids! / (taille_en_metres * taille_en_metres)
    }

    // Facteurs pronostiques de forme grave liés au terrain (fragilité).
    get personneFragile() {
        return (
            this.sup65 ||
            this.profil.grossesse_3e_trimestre ||
            this.imc > 30 ||
            this.antecedents
        )
    }

    get antecedents() {
        return (
            this.profil.antecedent_cardio ||
            this.profil.antecedent_diabete ||
            this.profil.antecedent_respi ||
            this.profil.antecedent_dialyse ||
            this.profil.antecedent_greffe ||
            this.profil.antecedent_cancer ||
            this.profil.antecedent_immunodep ||
            this.profil.antecedent_cirrhose ||
            this.profil.antecedent_drepano ||
            this.profil.antecedent_trisomie
        )
    }

    get fievre() {
        return (
            this.profil.symptomes_actuels &&
            (this.profil.symptomes_actuels_temperature ||
                this.profil.symptomes_actuels_temperature_inconnue)
        )
    }

    get facteursDeGraviteMajeurs() {
        return (
            this.profil.symptomes_actuels_souffle ||
            this.profil.symptomes_actuels_alimentation
        )
    }

    get risqueDInfection() {
        return (
            this.profil.hasSymptomesActuelsReconnus() ||
            this.profil.symptomes_passes ||
            this.profil.hasContactARisqueReconnus()
        )
    }

    get listStatuts() {
        return STATUTS
    }

    get listConseilsPersonnels() {
        return CONSEILS_PERSONNELS
    }

    get statutEtConseils() {
        // Statut et conseils à afficher dans toutes les situations.
        switch (this.situation) {
            case 'positif_symptomes_actuels_graves':
            case 'autotest_positif_symptomes_actuels_graves':
                return {
                    statut: 'positif-symptomatique-urgent',
                    conseils: 'symptomes-actuels-positif-critique',
                }

            case 'negatif_symptomes_actuels_graves':
            case 'antigenique_negatif_fragile_symptomes_actuels_graves':
            case 'en_attente_symptomes_actuels_graves':
            case 'pas_teste_symptomes_actuels_graves':
                return {
                    statut: 'symptomatique-urgent',
                    conseils: 'symptomes-actuels-sans-depistage-critique',
                }

            case 'positif_symptomes_actuels':
                return {
                    statut: 'symptomatique-positif',
                    conseils: 'depistage-positif-symptomatique',
                }

            case 'positif_symptomes_passes':
                return {
                    statut: 'symptomatique-positif',
                    conseils: 'symptomes-passes-positif',
                }

            case 'positif_contact_a_risque':
            case 'positif_contact_a_risque_meme_lieu_de_vie':
            case 'positif_contact_a_risque_meme_lieu_de_vie_vaccine':
            case 'positif_contact_a_risque_vaccine':
            case 'positif_contact_pas_vraiment_a_risque':
            case 'positif_asymptomatique':
                return {
                    statut: 'asymptomatique',
                    conseils: 'depistage-positif-asymptomatique',
                }

            case 'autotest_positif_contact_a_risque':
            case 'autotest_positif_contact_a_risque_meme_lieu_de_vie':
            case 'autotest_positif_contact_a_risque_meme_lieu_de_vie_vaccine':
            case 'autotest_positif_contact_a_risque_vaccine':
            case 'autotest_positif_contact_pas_vraiment_a_risque':
            case 'autotest_positif_asymptomatique':
                return {
                    statut: 'asymptomatique-positif-autotest',
                    conseils: 'depistage-positif-autotest-asymptomatique',
                }

            case 'negatif_symptomes_actuels':
                return { statut: 'symptomatique-negatif', conseils: null }

            case 'negatif_symptomes_passes':
                return {
                    statut: this.statutSelonFragilite(),
                    conseils: 'peu-de-risques',
                }

            case 'autotest_positif_symptomes_actuels':
                return {
                    statut: 'symptomatique-autotest-positif',
                    conseils: 'depistage-positif-autotest-symptomatique',
                }

            case 'autotest_positif_symptomes_passes':
                return {
                    statut: 'symptomatique-autotest-positif',
                    conseils: 'symptomes-passes-positif-autotest',
                }

            case 'antigenique_negatif_fragile_symptomes_actuels':
            case 'antigenique_negatif_fragile_symptomes_passes':
                return {
                    statut: 'antigenique-negatif-fragile',
                    conseils: 'antigenique-negatif-fragile',
                }

            case 'negatif_contact_a_risque_meme_lieu_de_vie_vaccine':
            case 'antigenique_negatif_fragile_contact_a_risque_meme_lieu_de_vie_vaccine':
            case 'en_attente_contact_a_risque_meme_lieu_de_vie_vaccine':
                return {
                    statut: 'contact-a-risque-meme-lieu-de-vie-vaccine',
                    conseils: 'contact-a-risque-meme-lieu-de-vie-vaccine',
                }

            case 'negatif_contact_a_risque_meme_lieu_de_vie':
            case 'antigenique_negatif_fragile_contact_a_risque_meme_lieu_de_vie':
            case 'en_attente_contact_a_risque_meme_lieu_de_vie':
                return {
                    statut: 'contact-a-risque-meme-lieu-de-vie',
                    conseils: 'contact-a-risque-meme-lieu-de-vie',
                }

            case 'negatif_contact_a_risque_vaccine':
            case 'antigenique_negatif_fragile_contact_a_risque_vaccine':
            case 'en_attente_contact_a_risque_vaccine':
            case 'pas_teste_contact_a_risque_vaccine':
                return {
                    statut: 'contact-a-risque-vaccine',
                    conseils: 'contact-a-risque-vaccine',
                }

            case 'negatif_contact_a_risque':
            case 'antigenique_negatif_fragile_contact_a_risque':
            case 'en_attente_contact_a_risque':
            case 'pas_teste_contact_a_risque':
                return {
                    statut: 'contact-a-risque-non-vaccine',
                    conseils: 'contact-a-risque-non-vaccine',
                }

            case 'negatif_contact_pas_vraiment_a_risque':
            case 'antigenique_negatif_fragile_contact_pas_vraiment_a_risque':
                return {
                    statut: this.statutSelonFragilite(),
                    conseils: 'contact-a-risque-autre',
                }

            case 'negatif_asymptomatique':
            case 'antigenique_negatif_fragile_asymptomatique':
                return {
                    statut: this.statutSelonFragilite(),
                    conseils: 'peu-de-risques',
                }

            case 'en_attente_symptomes_actuels':
                return {
                    statut: 'symptomatique-en-attente',
                    conseils: 'symptomes-actuels-en-attente',
                }

            case 'en_attente_symptomes_passes':
                return {
                    statut: 'symptomatique-en-attente',
                    conseils: 'symptomes-passes-en-attente',
                }

            case 'en_attente_contact_pas_vraiment_a_risque':
                return { statut: 'en-attente', conseils: 'contact-a-risque-autre' }

            case 'en_attente_asymptomatique':
                return { statut: 'en-attente', conseils: null }

            case 'pas_teste_symptomes_actuels':
                return {
                    statut: 'symptomatique-sans-test',
                    conseils: 'symptomes-actuels-sans-depistage',
                }

            case 'pas_teste_symptomes_passes':
                return {
                    statut: 'symptomatique-sans-test',
                    conseils: 'symptomes-passes-sans-depistage',
                }

            case 'pas_teste_contact_a_risque_meme_lieu_de_vie_vaccine':
                return {
                    statut: 'contact-a-risque-meme-lieu-de-vie-sans-depistage-vaccine',
                    conseils:
                        'contact-a-risque-meme-lieu-de-vie-sans-depistage-vaccine',
                }

            case 'pas_teste_contact_a_risque_meme_lieu_de_vie':
                return {
                    statut: 'contact-a-risque-meme-lieu-de-vie',
                    conseils: 'contact-a-risque-meme-lieu-de-vie',
                }

            case 'pas_teste_contact_pas_vraiment_a_risque':
                return {
                    statut: this.statutSelonFragilite(),
                    conseils: 'contact-a-risque-autre',
                }

            case 'pas_teste_asymptomatique':
                return {
                    statut: this.statutSelonFragilite(),
                    conseils: 'peu-de-risques',
                }

            default:
                console.error('situation inconnue', this.situation)
                return { statut: null, conseils: null }
        }
    }

    statutSelonFragilite() {
        if (this.personneFragile) return 'personne-fragile'
        return 'peu-de-risques'
    }

    recommandeAutoSuivi() {
        return (
            this.profil.hasSymptomesActuelsReconnus() &&
            !this.profil.depistagePositifRecentAsymptomatique() &&
            !this.profil.depistageNegatifRecentSymptomatique()
        )
    }

    timelineBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.depistagePositifRecent()) {
            if (
                this.profil.hasSymptomesActuelsReconnus() ||
                this.profil.symptomes_passes
            ) {
                blockNames.push('conseils-timeline-isolement-positif-avec-symptomes')
            } else {
                blockNames.push('conseils-timeline-isolement-positif-sans-symptomes')
            }
        } else if (
            this.profil.hasContactARisqueReconnus() &&
            this.profil.contact_a_risque_meme_lieu_de_vie
        ) {
            blockNames.push('conseils-timeline-isolement-foyer-malade')
        }
        return blockNames
    }

    conseilsPersonnelsBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.depistagePositifRecent()) {
            blockNames.push('reponse-depistage-positif')
        } else if (this.profil.depistageNegatifRecent()) {
            blockNames.push('reponse-depistage-negatif')
        } else if (this.profil.depistageEnAttenteRecent()) {
            blockNames.push('reponse-depistage-en-attente')
        } else if (this.profil.sansDepistage()) {
            blockNames.push('reponse-depistage-sans')
        }
        blockNames.push(`conseils-personnels-${this.statutEtConseils.conseils}`)
        return blockNames
    }

    isolementBlockNamesToDisplay() {
        const blockNames = []
        if (
            this.profil.depistagePositifRecent() ||
            (this.profil.depistageNegatifRecent() &&
                this.profil.hasContactARisqueReconnus()) ||
            (this.profil.depistageEnAttenteRecent() && this.risqueDInfection) ||
            (this.profil.sansDepistage() && this.risqueDInfection)
        ) {
            blockNames.push('conseils-isolement')
            if (this.profil.depistagePositifRecent()) {
                if (this.profil.isCompletementVaccine()) {
                    blockNames.push('conseils-isolement-depistage-positif-vaccine')
                } else {
                    blockNames.push('conseils-isolement-depistage-positif')
                }
            } else if (this.profil.hasContactARisqueReconnus()) {
                blockNames.push('conseils-isolement-contact-a-risque')
            } else if (this.risqueDInfection) {
                if (this.profil.isCompletementVaccine()) {
                    blockNames.push('conseils-isolement-symptomes-vaccine')
                } else {
                    blockNames.push('conseils-isolement-symptomes')
                }
            }
            if (this.profil.foyer_autres_personnes) {
                blockNames.push('conseils-isolement-autres-personnes')
            } else {
                blockNames.push('conseils-isolement-personne-seule')
            }
        }
        return blockNames
    }

    depistageBlockNamesToDisplay() {
        const blockNames = []
        if (
            this.profil.depistagePositifRecent() ||
            this.profil.depistageNegatifRecent()
        ) {
            // rien
        } else {
            blockNames.push('conseils-tests')
            if (this.profil.depistageEnAttenteRecent()) {
                blockNames.push('conseils-tests-resultats')
            } else {
                blockNames.push('conseils-tests-general')
            }
        }
        // Cas très particulier antigénique faux négatif.
        if (
            this.profil.depistageNegatifRecent() &&
            typeof this.profil.depistage_type !== 'undefined' &&
            this.profil.depistage_type === 'antigenique' &&
            this.personneFragile &&
            (this.profil.hasSymptomesActuelsReconnus() || this.profil.symptomes_passes)
        ) {
            blockNames.push('conseils-tests')
            blockNames.push('conseils-tests-rt-pcr')
        }
        return blockNames
    }

    vaccinBlockNamesToDisplay() {
        let blockNames = []

        // Rappel de la réponse sur la vaccination.
        if (this.profil.vaccins === 'completement') {
            blockNames.push('reponse-vaccins-completement')
        } else if (this.profil.vaccins === 'en_cours') {
            blockNames.push('reponse-vaccins-en-cours')
        } else {
            blockNames.push('reponse-vaccins-pas-encore')
        }

        // Rappel de la réponse sur la Covid passée.
        if (this.profil.vaccins !== 'completement') {
            if (this.profil.covid_passee) {
                if (this.profil.hasCovidPlus6Mois()) {
                    blockNames.push('reponse-historique-6-mois-plus')
                } else if (this.profil.hasCovidPlus2Mois()) {
                    blockNames.push('reponse-historique-2-6-mois')
                } else {
                    blockNames.push('reponse-historique-2-mois-moins')
                }
            } else {
                blockNames.push('reponse-historique-sans')
            }
        }

        // Conseils personnalisés.
        const algoVaccination = new AlgorithmeVaccination(this.profil, this)

        if (algoVaccination.isCompletementVaccine()) {
            blockNames.push('conseils-vaccins-deja-vaccine')
        } else {
            blockNames.push('conseils-vaccins-pas-encore-vaccine')
            if (this.profil.covid_passee) {
                if (this.profil.hasCovidPlus6Mois()) {
                    blockNames.push('conseils-vaccins-6-mois-plus')
                } else if (this.profil.hasCovidPlus2Mois()) {
                    blockNames.push('conseils-vaccins-2-6-mois')
                } else {
                    blockNames.push('conseils-vaccins-2-mois-moins')
                }
            }
            if (algoVaccination.isVaccinationObligatoire()) {
                blockNames = blockNames.concat('conseils-vaccins-obligation-pro-sante')
            }
            if (algoVaccination.isVaccinationPossible()) {
                blockNames = blockNames.concat(this._conseilsVaccins(algoVaccination))
            }
        }
        return blockNames
    }

    _conseilsVaccins(algoVaccination: AlgorithmeVaccination) {
        let blockNames = []
        if (algoVaccination.isSup18()) {
            blockNames.push('conseils-vaccins-18-ans')
        } else if (algoVaccination.isSup12()) {
            blockNames.push('conseils-vaccins-12-ans')
        }
        if (algoVaccination.isTresHautRisque()) {
            blockNames.push('conseils-vaccins-tres-haut-risque')
        } else if (algoVaccination.isARisque()) {
            blockNames.push('conseils-vaccins-a-risque')
        }
        return blockNames
    }

    gestesBarriereBlockNamesToDisplay() {
        const blockNames = ['conseils-gestes-barrieres-masque']
        if (this.personneFragile) {
            if (this.antecedents || this.profil.antecedent_chronique_autre) {
                blockNames.push('reponse-gestes-barrieres-masque-antecedents')
            }
            if (this.sup65 || this.profil.grossesse_3e_trimestre || this.imc > 30) {
                blockNames.push(
                    'reponse-gestes-barrieres-masque-caracteristiques-a-risques'
                )
            }
            blockNames.push('conseils-gestes-barrieres-masque-fragile')
        } else {
            blockNames.push('conseils-gestes-barrieres-masque-general')
        }
        return blockNames
    }

    activiteProBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.activite_pro || this.profil.activite_pro_sante) {
            blockNames.push('conseils-activite')
            blockNames.push('reponse-activite-pro')

            // Arrêt de travail pour isolement pendant le test?
            const arretPourIsolement =
                this.profil.hasSymptomesActuelsReconnus() &&
                (!this.profil.depistage ||
                    (this.profil.depistage &&
                        this.profil.depistage_resultat == 'en_attente'))
            if (arretPourIsolement) {
                blockNames.push('conseils-activite-pro-arret-de-travail-isolement')
            }

            // Infos téléprocédure pour arrêt de travail via lien dans l’alerte TAC
            if (this.profil.contact_a_risque_stop_covid) {
                blockNames.push('conseils-activite-pro-arret-de-travail-tac')
            }

            // Professionnel de santé ?
            if (this.profil.activite_pro_sante) {
                blockNames.push('conseils-activite-pro-sante')
            }

            // Autres professionnels.
            else {
                if (this.antecedents) {
                    blockNames.push('reponse-activite-pro-antecedents')
                    blockNames.push('conseils-activite-pro-arret')
                } else if (!arretPourIsolement) {
                    blockNames.push('conseils-activite-pro')
                }
                blockNames.push('conseils-activite-pro-infos')
            }
        }
        return blockNames
    }

    grossesseBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.grossesse_3e_trimestre) {
            blockNames.push('conseils-grossesse')
        }
        return blockNames
    }

    santeBlockNamesToDisplay() {
        const blockNames = []
        if (this.personneFragile) {
            if (this.profil.hasSymptomesActuelsReconnus()) {
                blockNames.push('conseils-sante-personne-fragile-symptomatique')
            } else {
                blockNames.push('conseils-sante-personne-fragile')
            }
        }
        if (blockNames.length) {
            if (this.sup65 || this.profil.grossesse_3e_trimestre || this.imc > 30) {
                blockNames.unshift('reponse-sante-caracteristiques-a-risques')
            }
            if (this.antecedents || this.profil.antecedent_chronique_autre) {
                blockNames.unshift('reponse-sante-antecedents')
            }
            blockNames.unshift('conseils-sante')
        }
        return blockNames
    }

    enfantsBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.foyer_enfants || !this.sup15) {
            if (this.profil.foyer_enfants) {
                blockNames.push('reponse-foyer-enfants')
            } else {
                blockNames.push('reponse-enfants-inf-15')
            }
            blockNames.push('conseils-foyer-enfants')
        }
        return blockNames
    }
}
