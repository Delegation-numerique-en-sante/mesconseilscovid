import incidence from '../data/incidence.js'

export default class AlgorithmeOrientation {
    constructor(profil) {
        this.profil = profil
    }

    get incidence() {
        return incidence[this.profil.departement]
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
    get personne_fragile() {
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

    get totalFacteursDeGraviteMineurs() {
        // Return an integer (sum of truthy values from array).
        return [
            this.profil.symptomes_actuels_temperature,
            this.profil.symptomes_actuels_temperature_inconnue,
            this.profil.symptomes_actuels_fatigue,
        ].reduce((a, b) => (a || false) + (b || false), 0)
    }

    get facteursDeGraviteMajeurs() {
        return (
            this.profil.symptomes_actuels_souffle ||
            this.profil.symptomes_actuels_alimentation
        )
    }

    get symptomesActuelsReconnus() {
        return this.profil.symptomes_actuels && !this.profil.symptomes_actuels_autre
    }

    get symptomes() {
        return (
            this.symptomesActuelsReconnus ||
            this.profil.symptomes_passes ||
            (this.profil.contact_a_risque && !this.profil.contact_a_risque_autre)
        )
    }

    get statut() {
        // L’ordre est important car risques > foyer_fragile.
        if (this.profil.symptomes_actuels && this.facteursDeGraviteMajeurs) {
            return 'symptomatique-urgent'
        }
        if (this.symptomesActuelsReconnus) {
            return 'symptomatique'
        }
        if (this.symptomes && !this.profil.symptomes_actuels_autre) {
            return 'risque-eleve'
        }
        if (this.personne_fragile) {
            return 'personne-fragile'
        }
        if (this.profil.foyer_fragile) {
            return 'foyer-fragile'
        }
        return 'peu-de-risques'
    }

    get gravite() {
        let gravite = 1
        if (this.facteursDeGraviteMajeurs) {
            gravite = 4
        } else {
            // #3.3
            if (this.fievre && this.profil.symptomes_actuels_toux) {
                if (this.personne_fragile) {
                    if (this.totalFacteursDeGraviteMineurs > 1) {
                        gravite = 2
                    } else {
                        gravite = 3
                    }
                }
            }
            // #3.4
            if (
                this.fievre ||
                (!this.fievre &&
                    (this.profil.symptomes_actuels_diarrhee ||
                        (this.profil.symptomes_actuels_toux &&
                            this.profil.symptomes_actuels_douleurs) ||
                        (this.profil.symptomes_actuels_toux &&
                            this.profil.symptomes_actuels_odorat)))
            ) {
                if (this.personne_fragile) {
                    if (this.totalFacteursDeGraviteMineurs > 1) {
                        gravite = 2
                    } else {
                        gravite = 3
                    }
                } else {
                    if (this.sup50 || this.totalFacteursDeGraviteMineurs >= 1) {
                        gravite = 3
                    }
                }
            }
            // #3.5
            if (
                !this.fievre &&
                (this.profil.symptomes_actuels_toux ||
                    this.profil.symptomes_actuels_douleurs ||
                    this.profil.symptomes_actuels_odorat) &&
                this.personne_fragile
            ) {
                gravite = 3
            }
        }
        return gravite
    }

    recommandeAutoSuivi() {
        return this.profil.symptomes_actuels
    }

    conseilsPersonnelsBlockNamesToDisplay() {
        const blockNames = []
        if (this.symptomesActuelsReconnus) {
            blockNames.push('conseils-personnels-symptomes-actuels')
            if (this.antecedents || this.profil.antecedent_chronique_autre) {
                blockNames.push('reponse-symptomes-actuels-antecedents')
            }
            if (this.sup50 || this.profil.grossesse_3e_trimestre || this.imc > 30) {
                blockNames.push('reponse-symptomes-actuels-caracteristiques')
            }
            if (this.symptomesActuelsReconnus) {
                blockNames.push('reponse-symptomes-actuels-symptomesactuelsreconnus')
            }
            if (this.profil.hasHistorique()) {
                blockNames.push('conseils-personnels-symptomes-actuels-suivi')
            } else {
                blockNames.push(
                    'conseils-personnels-symptomes-actuels-gravite' + this.gravite
                )
            }
        } else if (this.profil.symptomes_passes) {
            blockNames.push('conseils-personnels-symptomes-passes')
            if (this.personne_fragile || this.profil.foyer_fragile) {
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
        }
        return blockNames
    }

    departementBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.symptomes_actuels || typeof this.incidence === 'undefined') {
            return []
        }
        blockNames.push('conseils-departement')
        if (this.incidence >= 10) {
            blockNames.push('conseils-departement-circulation-elevee')
        } else {
            blockNames.push('conseils-departement-circulation-faible')
        }
        return blockNames
    }

    activiteProBlockNamesToDisplay() {
        const blockNames = []
        if (this.symptomes) {
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
            // Les blocs de conseils sont quasi-exclusifs aussi.
            if (this.profil.activite_pro_liberal) {
                blockNames.push('conseils-activite-pro-liberal')
            }
            if (this.profil.activite_pro_public && this.profil.activite_pro_sante) {
                blockNames.push('conseils-activite-pro-public')
                blockNames.push('conseils-activite-pro-sante')
            } else if (this.profil.activite_pro_public) {
                blockNames.push('conseils-activite-pro-public')
                blockNames.push('conseils-activite-pro-infos')
            } else if (this.profil.activite_pro_sante) {
                blockNames.push('conseils-activite-pro-sante')
            } else {
                blockNames.push('conseils-activite-pro')
                blockNames.push('conseils-activite-pro-infos')
            }
            if (this.personne_fragile) {
                blockNames.push('conseils-activite-pro-arret')
            }
        }
        return blockNames
    }

    foyerBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.symptomes_actuels) {
            return []
        }
        if (this.profil.symptomes_passes || this.profil.contact_a_risque) {
            blockNames.push('conseils-foyer')
            blockNames.push('conseils-foyer-fragile-suivi')
        } else if (this.profil.foyer_enfants || this.profil.foyer_fragile) {
            blockNames.push('conseils-foyer')
            if (this.profil.foyer_enfants && this.profil.foyer_fragile) {
                blockNames.push('conseils-foyer-enfants-fragile')
            } else if (this.profil.foyer_enfants) {
                blockNames.push('conseils-foyer-enfants')
            } else if (this.profil.foyer_fragile) {
                blockNames.push('conseils-foyer-fragile')
            }
        }
        return blockNames
    }

    caracteristiquesAntecedentsBlockNamesToDisplay() {
        const blockNames = []
        if (this.symptomes) {
            return []
        }
        if (this.personne_fragile || this.profil.antecedent_chronique_autre) {
            blockNames.push('conseils-caracteristiques')
            // Réponses
            if (this.antecedents || this.profil.antecedent_chronique_autre) {
                blockNames.push('reponse-antecedents')
            }
            if (this.sup65 || this.profil.grossesse_3e_trimestre || this.imc > 30) {
                blockNames.push('reponse-caracteristiques-a-risques')
            }
            // Conseils
            if (this.profil.activite_pro) {
                blockNames.push('conseils-caracteristiques-antecedents-activite-pro')
            } else {
                blockNames.push('conseils-caracteristiques-antecedents')
            }
            if (this.antecedents || this.profil.antecedent_chronique_autre) {
                blockNames.push('conseils-caracteristiques-antecedents-info-risque')
            }
            if (this.profil.grossesse_3e_trimestre) {
                blockNames.push('conseils-caracteristiques-antecedents-femme-enceinte')
            }
            if (this.profil.antecedent_chronique_autre) {
                blockNames.push('conseils-antecedents-chroniques-autres')
            }
        }
        return blockNames
    }
}
