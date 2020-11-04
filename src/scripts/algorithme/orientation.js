// Les 13 statuts possibles en sortie de l’algorithme
const STATUTS = [
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

// Les 11 blocs de conseils personnels possibles en sortie de l’algorithme
const CONSEILS_PERSONNELS = [
    'contact-a-risque',
    'contact-a-risque-autre',
    'depistage-positif-asymptomatique',
    'depistage-positif-symptomatique',
    'symptomes-actuels-en-attente',
    'symptomes-actuels-positif-critique',
    'symptomes-actuels-sans-depistage',
    'symptomes-actuels-sans-depistage-critique',
    'symptomes-passes-en-attente',
    'symptomes-passes-positif',
    'symptomes-passes-sans-depistage',
]

export default class AlgorithmeOrientation {
    constructor(profil) {
        this.profil = profil
    }

    get situation() {
        // 6 x 4 = 24 situations possibles
        if (!this.profil.isComplete()) return ''
        return `${this.situationDepistage}_${this.situationSymptomes}`
    }

    // TODO: ajouter obsolete ?
    get situationDepistage() {
        // Les valeurs possibles :
        //  - 'positif'
        //  - 'negatif'
        //  - 'en_attente'
        //  - 'pas_teste'
        if (!this.profil.isComplete()) return ''
        return this.profil.depistage ? this.profil.depistage_resultat : 'pas_teste'
    }

    get situationSymptomes() {
        // Les valeurs possibles :
        //  - 'symptomes_actuels_graves'
        //  - 'symptomes_actuels'
        //  - 'symptomes_passes'
        //  - 'contact_a_risque'
        //  - 'contact_pas_vraiment_a_risque'
        //  - 'asymptomatique'
        if (!this.profil.isComplete()) return ''
        if (this.profil.hasSymptomesActuelsReconnus()) {
            if (this.facteursDeGraviteMajeurs) {
                return 'symptomes_actuels_graves'
            } else {
                return 'symptomes_actuels'
            }
        } else if (this.profil.symptomes_passes) {
            return 'symptomes_passes'
        } else if (this.profil.hasContactARisqueReconnus()) {
            return 'contact_a_risque'
        } else if (this.profil.contact_a_risque_autre) {
            return 'contact_pas_vraiment_a_risque'
        } else {
            return 'asymptomatique'
        }
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

    get listConseilsPersonnels() {
        return CONSEILS_PERSONNELS
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
                return {
                    statut: this.statutSelonFragilite(),
                    conseils: 'contact-a-risque-autre',
                }

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
            this.profil.hasSymptomesActuelsReconnus() &&
            !this.profil.estPositifAsymptomatique() &&
            !this.profil.estNegatifSymptomatique()
        )
    }

    situationBlockNamesToDisplay() {
        const blockNames = []

        // Situation relative au dépistage
        if (this.profil.estPositif()) {
            blockNames.push('reponse-depistage-positif')
        } else if (this.profil.estNegatif()) {
            blockNames.push('reponse-depistage-negatif')
        } else if (this.profil.estEnAttente()) {
            blockNames.push('reponse-depistage-en-attente')
        } else if (this.profil.sansDepistage()) {
            blockNames.push('reponse-depistage-sans')
        } else if (this.profil.depistageObsolete()) {
            blockNames.push('reponse-depistage-obsolete')
        }

        // Situation relative aux symptômes
        switch (this.situationSymptomes) {
            case 'symptomes_actuels_graves':
                blockNames.push('reponse-symptomes-actuels-graves')
                break
            case 'symptomes_actuels':
                if (!this.profil.estNegatif()) {
                    blockNames.push('reponse-symptomes-actuels')
                }
                break
            case 'symptomes_passes':
                blockNames.push('reponse-symptomes-passes')
                break
            case 'contact_a_risque':
                blockNames.push('reponse-contact-a-risque')
                break
            case 'contact_pas_vraiment_a_risque':
            case 'asymptomatique':
                blockNames.push('reponse-asymptomatique')
                break
        }

        if (this.personneFragile) {
            if (this.sup65) {
                blockNames.push('reponse-personne-fragile-age')
            }
            if (this.profil.grossesse_3e_trimestre) {
                blockNames.push('reponse-personne-fragile-grossesse')
            }
            if (this.imc > 30) {
                blockNames.push('reponse-personne-fragile-imc')
            }
            if (this.antecedents) {
                blockNames.push('reponse-personne-fragile-antecedents')
            }
        } else if (this.profil.foyer_fragile) {
            blockNames.push('reponse-foyer-fragile')
        }
        return blockNames
    }

    conseilsPersonnelsBlockNamesToDisplay() {
        const blockNames = []
        if (this.statutEtConseils.conseils) {
            blockNames.push('conseils-personnels')
            blockNames.push(`conseils-personnels-${this.statutEtConseils.conseils}`)
        }
        return blockNames
    }

    isolementBlockNamesToDisplay() {
        const blockNames = []
        if (
            this.profil.estPositif() ||
            (this.profil.estNegatif() && this.profil.hasContactARisqueReconnus()) ||
            (this.profil.estEnAttente() && this.risqueDInfection) ||
            (this.profil.sansDepistage() && this.risqueDInfection)
        ) {
            blockNames.push('conseils-isolement')
        }
        return blockNames
    }

    depistageBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.estPositif() || this.profil.estNegatif()) {
            // rien
        } else {
            blockNames.push('conseils-tests')
            if (this.profil.estEnAttente()) {
                blockNames.push('conseils-tests-resultats')
            } else {
                blockNames.push('conseils-tests-general')
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
        blockNames.push('conseils-confinement')
        return blockNames
    }

    activiteProBlockNamesToDisplay() {
        const blockNames = []
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
                if (this.antecedents) {
                    blockNames.push('reponse-activite-pro-antecedents')
                    blockNames.push('conseils-activite-pro-arret')
                } else if (this.personneFragile) {
                    blockNames.push('reponse-activite-pro-personne-fragile')
                    blockNames.push('conseils-activite-pro-personne-fragile')
                } else {
                    blockNames.push('conseils-activite-pro')
                }
                blockNames.push('conseils-activite-pro-infos')
            }

            // Bloc additionnel: activité libérale
            if (this.profil.activite_pro_liberal) {
                blockNames.push('conseils-activite-pro-liberal')
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
            if (this.profil.hasSymptomesActuelsReconnus()) {
                blockNames.push('conseils-sante-personne-fragile-symptomatique')
            } else {
                blockNames.push('conseils-sante-personne-fragile')
            }
        } else {
            blockNames.push('conseils-sante-general')
        }
        if (this.antecedents || this.profil.antecedent_chronique_autre) {
            blockNames.push('conseils-sante-maladie-chronique')
        }
        if (this.personneFragile || this.profil.activite_pro_sante) {
            blockNames.push('conseils-sante-grippe-fragile')
        } else {
            blockNames.push('conseils-sante-grippe')
        }
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
        if (this.profil.foyer_enfants) {
            blockNames.push('conseils-foyer-enfants')
        }
        return blockNames
    }
}
