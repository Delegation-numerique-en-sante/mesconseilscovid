export default class AlgorithmeVaccination {
    constructor(profil, algoOrientation) {
        this.profil = profil
        this.algoOrientation = algoOrientation
    }

    isSup75() {
        return this.profil.age >= 75
    }

    isProfessionnelDeSante() {
        return this.profil.activite_pro_sante
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
            this.isSup75() || this.isProfessionnelDeSante() || this.isTresHautRisque()
        )
    }
}
