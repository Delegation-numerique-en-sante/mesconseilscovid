export default class AlgorithmeVaccination {
    constructor(profil, algoOrientation) {
        this.profil = profil
        this.algoOrientation = algoOrientation
    }

    isSup75() {
        return this.profil.age >= 75
    }

    isProfessionnelDeSanteAgeOuComorbidite() {
        return (
            this.profil.activite_pro_sante &&
            (this.algoOrientation.sup50 ||
                this.algoOrientation.antecedents ||
                this.algoOrientation.imc > 30)
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
            this.isProfessionnelDeSanteAgeOuComorbidite() ||
            this.isTresHautRisque()
        )
    }
}
