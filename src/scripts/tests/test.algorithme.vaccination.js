import { assert } from 'chai'

import AlgorithmeOrientation from '../algorithme/orientation'
import AlgorithmeVaccination from '../algorithme/vaccination'

import Profil from '../profil'

describe('Vaccination', function () {
    it('Vaccination pour les plus de 18 ans', function () {
        const profil = new Profil('mes_infos', {
            age: 18,
            activite_pro_sante: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isSup18())
        assert.isTrue(algoVaccination.isVaccinable())
    })

    it('Vaccination pour les 12 à 18 ans', function () {
        const profil = new Profil('mes_infos', {
            age: 16,
            activite_pro_sante: false,
            antecedent_dialyse: false,
            antecedent_greffe: false,
            antecedent_cancer: false,
            antecedent_trisomie: true,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isSup12())
        assert.isTrue(algoVaccination.isVaccinable())
    })
})
