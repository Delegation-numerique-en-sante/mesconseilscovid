import type Profil from '../profil'
import type AlgorithmeOrientation from './orientation'

export default class AlgorithmeVaccination {
    profil: Profil
    algoOrientation: AlgorithmeOrientation

    constructor(profil: Profil, algoOrientation: AlgorithmeOrientation) {
        this.profil = profil
        this.algoOrientation = algoOrientation
    }

    isSup12() {
        return this.profil.age! >= 12
    }

    isSup18() {
        return this.profil.age! >= 18
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
            this.profil.antecedent_trisomie ||
            this.algoOrientation.imc >= 30
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

    isCompletementVaccine() {
        return this.profil.isCompletementVaccine()
    }

    isVaccinationPossible() {
        return (
            this.isSup12() &&
            (!this.profil.covid_passee || this.profil.hasCovidPlus2Mois())
        )
    }

    isVaccinationObligatoire() {
        return this.profil.activite_pro && this.profil.activite_pro_sante
    }
}
