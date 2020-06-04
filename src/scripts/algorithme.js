var carteDepartements = require('./carte.js')

var Algorithme = (function () {
    function Algorithme(profil) {
        this.profil = profil
        this.imc = computeIMC(profil.poids, profil.taille)
        this.couleur = carteDepartements.couleur(profil.departement)
        this.personne_fragile = this.isFragile()
        this.contactARisqueAutresOnly = this.hasContactARisqueAutresOnly()
        this.symptomes = this.hasSymptomes()
        this.antecedents = this.hasAntecedents()
        this.facteursDeGraviteMajeurs = this.hasFacteursDeGraviteMajeurs()
        this.facteursDeGraviteMineurs = this.hasFacteursDeGraviteMineurs()
    }

    // Facteurs pronostiques de forme grave liés au terrain (fragilité)
    Algorithme.prototype.isFragile = function () {
        return (
            this.profil.sup65 ||
            this.profil.grossesse_3e_trimestre ||
            this.imc > 30 ||
            this.hasAntecedents()
        )
    }

    Algorithme.prototype.hasAntecedents = function () {
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

    Algorithme.prototype.hasFacteursDeGraviteMineurs = function () {
        return (
            this.profil.symptomes_actuels_temperature ||
            this.profil.symptomes_actuels_temperature_inconnue ||
            this.profil.symptomes_actuels_fatigue
        )
    }

    Algorithme.prototype.hasFacteursDeGraviteMajeurs = function () {
        return (
            this.profil.symptomes_actuels_souffle ||
            this.profil.symptomes_actuels_alimentation
        )
    }

    Algorithme.prototype.hasContactARisqueAutresOnly = function () {
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

    Algorithme.prototype.hasSymptomes = function () {
        return (
            this.profil.symptomes_actuels ||
            this.profil.symptomes_passes ||
            (this.profil.contact_a_risque && !this.contactARisqueAutresOnly) // ???
        )
    }

    Algorithme.prototype.statut = function () {
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

    Algorithme.prototype.conseilsPersonnelsBlockNamesToDisplay = function () {
        var blockNames = []
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

    Algorithme.prototype.departementBlockNamesToDisplay = function () {
        var blockNames = []
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

    Algorithme.prototype.activiteProBlockNamesToDisplay = function () {
        var blockNames = []
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

    Algorithme.prototype.foyerBlockNamesToDisplay = function () {
        var blockNames = []
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

    Algorithme.prototype.caracteristiquesAntecedentsBlockNamesToDisplay = function () {
        var blockNames = []
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

    return Algorithme
})()

function computeIMC(poids, taille) {
    var taille_en_metres = taille / 100
    return poids / (taille_en_metres * taille_en_metres)
}

module.exports = {
    Algorithme,
}
