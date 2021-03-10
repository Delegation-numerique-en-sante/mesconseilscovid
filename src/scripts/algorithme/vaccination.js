export default class AlgorithmeVaccination {
    constructor(profil, algoOrientation) {
        this.profil = profil
        this.algoOrientation = algoOrientation
    }

    isSup75() {
        return this.profil.age >= 75
    }

    isSup50() {
        return this.profil.age >= 50
    }

    isProfessionnelDeSante() {
        return this.profil.activite_pro_sante
    }

    isARisque() {
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

    isTresHautRisque() {
        return (
            this.profil.antecedent_dialyse ||
            this.profil.antecedent_greffe ||
            this.profil.antecedent_cancer ||
            this.profil.antecedent_trisomie
        )
    }

    isVaccinable() {
        return (
            this.isSup75() ||
            this.isProfessionnelDeSante() ||
            this.isTresHautRisque() ||
            (this.isSup50() && this.isARisque())
        )
    }
}
