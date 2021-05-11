import { assert } from 'chai'

import AlgorithmeOrientation from '../algorithme/orientation'
import AlgorithmeVaccination from '../algorithme/vaccination'

import Profil from '../profil'

describe('Vaccination', function () {
    it('Pas de vaccination par défaut', function () {
        const profil = new Profil('mes_infos', {
            age: 35,
            activite_pro_sante: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isFalse(algoVaccination.isProfessionnelDeSante())
        assert.isFalse(algoVaccination.isSup55())
        assert.isFalse(algoVaccination.isTresHautRisque())
        assert.isFalse(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les pro santé', function () {
        const profil = new Profil('mes_infos', {
            age: 35,
            activite_pro_sante: true,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isProfessionnelDeSante())
        assert.isTrue(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les plus de 55 ans', function () {
        const profil = new Profil('mes_infos', {
            age: 56,
            activite_pro_sante: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isSup55())
        assert.isTrue(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les plus de 18 ans à risque', function () {
        const profil = new Profil('mes_infos', {
            age: 18,
            activite_pro_sante: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
            antecedent_diabete: true,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isSup18())
        assert.isTrue(algoVaccination.isARisque())
        assert.isTrue(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les très haut risque', function () {
        const profil = new Profil('mes_infos', {
            age: 26,
            activite_pro_sante: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: true,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isTresHautRisque())
        assert.isTrue(algoVaccination.isVaccinable())
    })
})
