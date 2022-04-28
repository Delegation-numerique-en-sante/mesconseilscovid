import { assert } from 'chai'

import AlgorithmeOrientation from '../../algorithme/orientation'
import AlgorithmeVaccination from '../../algorithme/vaccination'
import { joursAvant } from '../../utils'

import Profil from '../../profil'

describe('Vaccination', function () {
    describe('Pas de Covid passée', function () {
        it('Vaccination possible pour les plus de 18 ans', function () {
            const profil = new Profil('mes_infos', {
                age: 18,
                activite_pro_sante: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_trisomie: false,
                covid_passee: false,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
            assert.isTrue(algoVaccination.isSup18())
            assert.isTrue(algoVaccination.isVaccinationPossible())
        })

        it('Vaccination possible pour les 12 à 18 ans', function () {
            const profil = new Profil('mes_infos', {
                age: 16,
                activite_pro_sante: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_trisomie: true,
                covid_passee: false,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
            assert.isTrue(algoVaccination.isSup12())
            assert.isTrue(algoVaccination.isVaccinationPossible())
        })
    })

    describe('Covid passée', function () {
        it('Vaccination possible si Covid il y a plus de 6 mois', function () {
            const profil = new Profil('mes_infos', {
                age: 18,
                activite_pro_sante: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_trisomie: false,
                covid_passee: true,
                _covid_passee_date: joursAvant(7 * 30),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
            assert.isTrue(algoVaccination.isVaccinationPossible())
        })

        it('Vaccination possible mais non recommandée si Covid il y a 2 à 6 mois', function () {
            const profil = new Profil('mes_infos', {
                age: 18,
                activite_pro_sante: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_trisomie: false,
                covid_passee: true,
                _covid_passee_date: joursAvant(3 * 30),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
            assert.isTrue(algoVaccination.isVaccinationPossible())
        })

        it('Vaccination impossible si Covid il y a moins de 2 mois', function () {
            const profil = new Profil('mes_infos', {
                age: 18,
                activite_pro_sante: false,
                antecedent_dialyse: false,
                antecedent_greffe: false,
                antecedent_cancer: false,
                antecedent_trisomie: false,
                covid_passee: true,
                _covid_passee_date: joursAvant(30),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
            assert.isFalse(algoVaccination.isVaccinationPossible())
        })
    })
})

describe('Vaccination obligatoire', function () {
    it('Vaccination obligatoire pour les professionnels de santé', function () {
        const profil = new Profil('mes_infos', {
            age: 42,
            activite_pro: true,
            activite_pro_sante: true,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isVaccinationPossible())
        assert.isTrue(algoVaccination.isVaccinationObligatoire())
    })

    it('Vaccination non obligatoire pour les autres', function () {
        const profil = new Profil('mes_infos', {
            age: 42,
            activite_pro: true,
            activite_pro_sante: false,
        })
        const algoOrientation = new AlgorithmeOrientation(profil)
        const algoVaccination = new AlgorithmeVaccination(profil, algoOrientation)
        assert.isTrue(algoVaccination.isVaccinationPossible())
        assert.isFalse(algoVaccination.isVaccinationObligatoire())
    })
})
