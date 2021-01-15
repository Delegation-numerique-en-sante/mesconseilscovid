import { assert } from 'chai'

import AlgorithmeOrientation from '../algorithme/orientation.js'
import AlgorithmeVaccination from '../algorithme/vaccination.js'

import Profil from '../profil.js'

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
        assert.isFalse(algoVaccination.isProfessionnelDeSanteAgeOuComorbidite())
        assert.isFalse(algoVaccination.isSup75())
        assert.isFalse(algoVaccination.isTresHautRisque())
        assert.isFalse(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les pro santé âgé·e·s', function () {
        const profil = new Profil('mes_infos', {
            age: 52,
            activite_pro_sante: true,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isProfessionnelDeSanteAgeOuComorbidite())
        assert.isTrue(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les pro santé fragiles', function () {
        const profil = new Profil('mes_infos', {
            age: 32,
            activite_pro_sante: true,
            antecedent_cardio: true,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isProfessionnelDeSanteAgeOuComorbidite())
        assert.isTrue(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les plus de 75 ans', function () {
        const profil = new Profil('mes_infos', {
            age: 76,
            activite_pro_sante: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isSup75())
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
