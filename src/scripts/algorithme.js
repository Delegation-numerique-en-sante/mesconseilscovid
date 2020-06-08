const carteDepartements = require('./carte.js')

class Algorithme {
    constructor(profil) {
        this.profil = profil
    }

    get couleur() {
        return carteDepartements.couleur(this.profil.departement)
    }

    get imc() {
        const taille_en_metres = this.profil.taille / 100
        return this.profil.poids / (taille_en_metres * taille_en_metres)
    }

    // Facteurs pronostiques de forme grave liés au terrain (fragilité)
    get personne_fragile() {
        return (
            this.profil.sup65 ||
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

    get facteursDeGraviteMineurs() {
        return (
            this.profil.symptomes_actuels_temperature ||
            this.profil.symptomes_actuels_temperature_inconnue ||
            this.profil.symptomes_actuels_fatigue
        )
    }

    get facteursDeGraviteMajeurs() {
        return (
            this.profil.symptomes_actuels_souffle ||
            this.profil.symptomes_actuels_alimentation
        )
    }

    get contactARisqueAutresOnly() {
        return (
            this.profil.contact_a_risque &&
            this.profil.contact_a_risque_autre &&
            !this.profil.contact_a_risque_meme_lieu_de_vie &&
            !this.profil.contact_a_risque_contact_direct &&
            !this.profil.contact_a_risque_actes &&
            !this.profil.contact_a_risque_espace_confine &&
            !this.profil.contact_a_risque_meme_classe &&
            !this.profil.contact_a_risque_stop_covid
        )
    }

    get symptomes() {
        return (
            this.profil.symptomes_actuels ||
            this.profil.symptomes_passes ||
            (this.profil.contact_a_risque && !this.contactARisqueAutresOnly) // ???
        )
    }

    get statut() {
        // L’ordre est important car risques > foyer_fragile.
        if (this.symptomes) {
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

    conseilsPersonnelsBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.symptomes_actuels) {
            blockNames.push('conseils-personnels-symptomes-actuels')
            if (this.facteursDeGraviteMajeurs) {
                blockNames.push('conseils-personnels-symptomes-actuels-majeurs')
            } else {
                blockNames.push('conseils-personnels-symptomes-actuels-default')
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
            if (this.contactARisqueAutresOnly) {
                blockNames.push('conseils-personnels-contact-a-risque-autre-only')
            } else {
                blockNames.push('conseils-personnels-contact-a-risque-default')
                if (this.profil.contact_a_risque_autre) {
                    blockNames.push('conseils-personnels-contact-a-risque-autre')
                }
            }
        }
        return blockNames
    }

    departementBlockNamesToDisplay() {
        const blockNames = []
        if (this.profil.symptomes_actuels) {
            return []
        }
        blockNames.push('conseils-departement')
        if (this.couleur === 'orange') {
            blockNames.push('conseils-departement-orange')
        }
        if (this.couleur === 'vert') {
            blockNames.push('conseils-departement-vert')
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
            this.profil.activite_pro_sante
        ) {
            blockNames.push('conseils-activite')
            // Les blocs de réponses sont exclusifs.
            if (this.profil.activite_pro_public && this.profil.activite_pro_sante) {
                blockNames.push('reponse-activite-pro-public-sante')
            } else if (this.profil.activite_pro_public) {
                blockNames.push('reponse-activite-pro-public')
            } else if (this.profil.activite_pro_sante) {
                blockNames.push('reponse-activite-pro-sante')
            } else {
                blockNames.push('reponse-activite-pro')
            }
            // Les blocs de conseils sont quasi-exclusifs aussi.
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
            if (
                this.profil.sup65 ||
                this.profil.grossesse_3e_trimestre ||
                this.imc > 30
            ) {
                blockNames.push('reponse-caracteristiques')
            }
            // Conseils
            if (this.profil.activite_pro) {
                blockNames.push('conseils-caracteristiques-antecedents-activite-pro')
            } else {
                blockNames.push('conseils-caracteristiques-antecedents')
            }
            if (this.antecedents || this.profil.antecedent_chronique_autre) {
                blockNames.push('conseils-caracteristiques-antecedents-info-risque')
            } else {
                blockNames.push('conseils-caracteristiques-antecedents-info')
            }
            if (this.profil.antecedent_chronique_autre) {
                blockNames.push('conseils-antecedents-chroniques-autres')
            }
        }
        return blockNames
    }
}

module.exports = {
    Algorithme,
}
