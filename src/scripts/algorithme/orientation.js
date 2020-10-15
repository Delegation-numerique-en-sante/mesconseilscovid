// Les statuts possibles en sortie de l’algorithme
const STATUTS = [
    'symptomatique-urgent',
    'symptomatique-positif',
    'symptomatique-negatif',
    'symptomatique',
    'asymptomatique',
    'risque-eleve',
    'personne-fragile',
    'foyer-fragile',
    'peu-de-risques',
]

// Les 13 statuts possibles en sortie de l’algorithme
// eslint-disable-next-line no-unused-vars
const NOUVEAUX_STATUTS = [
    'asymptomatique',
    'contact-a-risque-avec-test',
    'contact-a-risque-sans-test',
    'en-attente',
    'foyer-fragile',
    'personne-fragile',
    'peu-de-risques',
    'positif-symptomatique-urgent',
    'symptomatique-en-attente',
    'symptomatique-negatif',
    'symptomatique-positif',
    'symptomatique-sans-test',
    'symptomatique-urgent',
]

export default class AlgorithmeOrientation {
    constructor(profil, incidenceParDepartement) {
        this.profil = profil
        this.incidenceParDepartement = incidenceParDepartement
    }

    get situation() {
        if (!this.profil.isComplete()) return ''
        const depistage = this.profil.depistage
            ? this.profil.depistage_resultat
            : 'pas_teste'
        let symptomes
        if (this.profil.hasSymptomesActuelsReconnus()) {
            symptomes = 'symptomes_actuels'
            if (this.facteursDeGraviteMajeurs) {
                symptomes += '_graves'
            }
        } else if (this.profil.symptomes_passes) {
            symptomes = 'symptomes_passes'
        } else if (this.profil.hasContactARisqueReconnus()) {
            symptomes = 'contact_a_risque'
        } else if (this.profil.contact_a_risque_autre) {
            symptomes = 'contact_pas_vraiment_a_risque'
        } else {
            symptomes = 'asymptomatique'
        }
        return `${depistage}_${symptomes}`
    }

    get incidence() {
        return this.incidenceParDepartement[this.profil.departement]
    }

    get sup65() {
        return this.profil.age >= 65
    }

    get sup50() {
        return this.profil.age >= 50
    }

    get imc() {
        const taille_en_metres = this.profil.taille / 100
        return this.profil.poids / (taille_en_metres * taille_en_metres)
    }

    // Facteurs pronostiques de forme grave liés au terrain (fragilité)
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
            this.profil.antecedent_cancer ||
            this.profil.antecedent_immunodep ||
            this.profil.antecedent_cirrhose ||
            this.profil.antecedent_drepano
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

    get statut() {
        // L’ordre est important car risques > foyer_fragile.
        if (this.profil.symptomes_actuels && this.facteursDeGraviteMajeurs) {
            return 'symptomatique-urgent'
        }
        if (this.profil.hasSymptomesActuelsReconnus()) {
            if (this.profil.estPositifSymptomatique()) {
                return 'symptomatique-positif'
            } else if (this.profil.estNegatifSymptomatique()) {
                return 'symptomatique-negatif'
            } else {
                return 'symptomatique'
            }
        }
        if (this.profil.estPositifAsymptomatique()) {
            return 'asymptomatique'
        }
        if (this.risqueDInfection && !this.profil.symptomes_actuels_autre) {
            return 'risque-eleve'
        }
        if (this.personneFragile) {
            return 'personne-fragile'
        }
        if (this.profil.foyer_fragile) {
            return 'foyer-fragile'
        }
        return 'peu-de-risques'
    }

    get statutEtConseils() {
        // Statut et conseils à afficher dans les 24 situations
        switch (this.situation) {
            case 'positif_symptomes_actuels_graves':
                return {
                    statut: 'positif-symptomatique-urgent',
                    conseils: 'symptomes-actuels-positif-critique',
                }

            case 'negatif_symptomes_actuels_graves':
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
            case 'positif_contact_pas_vraiment_a_risque':
            case 'positif_asymptomatique':
                return {
                    statut: 'asymptomatique',
                    conseils: 'depistage-positif-asymptomatique',
                }

            case 'negatif_symptomes_actuels':
                return { statut: 'symptomatique-negatif', conseils: null }

            case 'negatif_symptomes_passes':
                return { statut: this.statutSelonFragilite(), conseils: null }

            case 'negatif_contact_a_risque':
            case 'en_attente_contact_a_risque':
                return {
                    statut: 'contact-a-risque-avec-test',
                    conseils: 'contact-a-risque',
                }

            case 'negatif_contact_pas_vraiment_a_risque':
            case 'negatif_asymptomatique':
                return { statut: this.statutSelonFragilite(), conseils: null }

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

            case 'pas_teste_contact_a_risque':
                return {
                    statut: 'contact-a-risque-sans-test',
                    conseils: 'contact-a-risque',
                }

            case 'pas_teste_contact_pas_vraiment_a_risque':
                return {
                    statut: this.statutSelonFragilite(),
                    conseils: 'contact-a-risque-autre',
                }

            case 'pas_teste_asymptomatique':
                return { statut: this.statutSelonFragilite(), conseils: null }

            default:
                console.error('situation inconnue', this.situation)
                return { statut: null, conseils: null }
        }
    }

    statutSelonFragilite() {
        if (this.personneFragile) return 'personne-fragile'
        if (this.profil.foyer_fragile) return 'foyer-fragile'
        return 'peu-de-risques'
    }

    recommandeAutoSuivi() {
        return (
            this.profil.symptomes_actuels &&
            !this.profil.estPositifAsymptomatique() &&
            !this.profil.estNegatifSymptomatique()
        )
    }

    conseilsPersonnelsBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.estPositifSymptomatique()) {
            blockNames.push('conseils-personnels-depistage-positif-symptomatique')
        } else if (this.profil.estPositifAsymptomatique()) {
            blockNames.push('conseils-personnels-depistage-positif-asymptomatique')
        } else if (this.profil.hasSymptomesActuelsReconnus()) {
            blockNames.push('conseils-personnels-symptomes-actuels')
            if (this.facteursDeGraviteMajeurs) {
                blockNames.push(
                    'conseils-personnels-symptomes-actuels-sans-depistage-critique'
                )
            } else {
                blockNames.push('conseils-personnels-symptomes-actuels-sans-depistage')
            }
        } else if (this.profil.symptomes_passes) {
            blockNames.push('conseils-personnels-symptomes-passes')
            if (this.personneFragile || this.profil.foyer_fragile) {
                blockNames.push('conseils-personnels-symptomes-passes-avec-risques')
            } else {
                blockNames.push('conseils-personnels-symptomes-passes-sans-risques')
            }
        } else if (this.profil.contact_a_risque) {
            blockNames.push('conseils-personnels-contact-a-risque')
            if (this.profil.contact_a_risque_autre) {
                blockNames.push('conseils-personnels-contact-a-risque-autre')
            } else {
                blockNames.push('conseils-personnels-contact-a-risque-default')
            }
            blockNames.push('conseils-contact-a-risque')
        }
        return blockNames
    }

    isolementBlockNamesToDisplay() {
        const blockNames = []
        if (
            this.profil.hasSymptomesActuelsReconnus() ||
            this.profil.symptomes_passes ||
            this.profil.hasContactARisqueReconnus()
        ) {
            blockNames.push('conseils-isolement')
        }
        return blockNames
    }

    depistageBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.contact_a_risque && this.profil.contact_a_risque_autre) {
            // rien
        } else {
            blockNames.push('conseils-tests')
            if (this.profil.depistage_resultat === 'en_attente') {
                blockNames.push('conseils-tests-resultats')
            }
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

    vieQuotidienneBlockNamesToDisplay() {
        const blockNames = ['conseils-vie-quotidienne']
        if (typeof this.incidence !== 'undefined') {
            if (this.incidence >= 10) {
                blockNames.push('conseils-departement-circulation-elevee')
            } else {
                blockNames.push('conseils-departement-circulation-faible')
            }
        }
        return blockNames
    }

    activiteProBlockNamesToDisplay() {
        const blockNames = []
        if (this.risqueDInfection) {
            return []
        }
        if (
            this.profil.activite_pro ||
            this.profil.activite_pro_public ||
            this.profil.activite_pro_sante ||
            this.profil.activite_pro_liberal
        ) {
            blockNames.push('conseils-activite')
            blockNames.push('reponse-activite-pro')

            // Professionnel de santé ou non ?
            if (this.profil.activite_pro_sante) {
                blockNames.push('conseils-activite-pro-sante')
            } else {
                blockNames.push('conseils-activite-pro')
                blockNames.push('conseils-activite-pro-infos')
            }

            // Bloc additionnel: activité libérale
            if (this.profil.activite_pro_liberal) {
                blockNames.push('conseils-activite-pro-liberal')
            }

            // Bloc additionnel: personne fragile
            if (this.personneFragile) {
                blockNames.push('reponse-activite-pro-personne-fragile')
                blockNames.push('conseils-activite-pro-personne-fragile')
            }

            // Bloc additionnel: personne à très haut risque (arrêt de travail)
            if (this.antecedents) {
                blockNames.push('reponse-activite-pro-antecedents')
                blockNames.push('conseils-activite-pro-arret')
            }

            // Bloc additionnel: personne fragile dans le foyer
            if (this.profil.foyer_fragile) {
                blockNames.push('reponse-activite-pro-foyer-fragile')
                blockNames.push('conseils-activite-pro-foyer-fragile')
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
        const blockNames = ['conseils-sante']
        if (this.sup65 || this.profil.grossesse_3e_trimestre || this.imc > 30) {
            blockNames.push('reponse-sante-caracteristiques-a-risques')
        }
        if (this.antecedents || this.profil.antecedent_chronique_autre) {
            blockNames.push('reponse-sante-antecedents')
        }
        if (this.personneFragile) {
            blockNames.push('conseils-sante-personne-fragile')
        } else {
            blockNames.push('conseils-sante-general')
        }
        if (this.antecedents || this.profil.antecedent_chronique_autre) {
            blockNames.push('conseils-sante-maladie-chronique')
        }
        blockNames.push('conseils-sante-automedication')
        return blockNames
    }

    foyerBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.foyer_fragile) {
            blockNames.push('conseils-foyer')
            blockNames.push('conseils-foyer-fragile')
        }
        return blockNames
    }

    enfantsBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.symptomes_actuels) {
            return []
        }
        if (this.profil.foyer_enfants) {
            blockNames.push('conseils-foyer-enfants')
        }
        return blockNames
    }
}
