import { assert } from 'chai'
import { JSDOM } from 'jsdom'

import AlgorithmeOrientation from '../algorithme/orientation.js'

import * as injection from '../injection.js'

import Profil from '../profil.js'

describe('Injection', function () {
    it('Départements', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<b id="nom-departement"></b>'
        injection.departement(element.querySelector('#nom-departement'), '01')

        assert.strictEqual(element.innerHTML, '<b id="nom-departement">Ain</b>')
    })

    it('Lien préfecture', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML =
            '<a href="#conseils-departement" id="lien-prefecture">Site</a>'
        injection.lienPrefecture(element.querySelector('#lien-prefecture'), '01')

        assert.strictEqual(
            element.innerHTML,
            '<a href="http://www.ain.gouv.fr/coronavirus-covid-19-r1627.html" id="lien-prefecture">Site</a>'
        )
    })

    describe('Caractéristiques à risques', function () {
        it('âge', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'

            var profil = new Profil('mes_infos', {
                age: 65,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>'
            )
        })

        it('grossesse', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'

            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes au 3e trimestre de votre grossesse.</b>'
            )
        })

        it('âge + grossesse = âge', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'

            var profil = new Profil('mes_infos', {
                age: 65,
                grossesse_3e_trimestre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>'
            )
        })

        it('IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'
            var profil = new Profil('mes_infos', {
                taille: 150,
                poids: 150,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })

        it('âge + IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'
            var profil = new Profil('mes_infos', {
                age: 65,
                taille: 150,
                poids: 150,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })

        it('grossesse + IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                taille: 150,
                poids: 150,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes au 3e trimestre de votre grossesse et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })
    })

    describe('Antécédents', function () {
        it('cardio', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.antecedents(
                element.querySelector('#nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-antecedents">Vous avez des antécédents à risque.</b>'
            )
        })

        it('autres', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_chronique_autre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.antecedents(
                element.querySelector('#nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-antecedents">Vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>'
            )
        })

        it('cardio + autres', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
                antecedent_chronique_autre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.antecedents(
                element.querySelector('#nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-antecedents">Vous avez des antécédents à risque et vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>'
            )
        })
    })

    describe('Symptômes actuels', function () {
        it('température', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_temperature: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez de la température (ou vous ne savez pas).</b>'
            )
        })

        it('température inconnue', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_temperature_inconnue: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez de la température (ou vous ne savez pas).</b>'
            )
        })

        it('toux', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez de la toux.</b>'
            )
        })

        it('température + toux', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_temperature: true,
                symptomes_actuels_toux: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez de la température (ou vous ne savez pas)&nbsp;; vous avez de la toux.</b>'
            )
        })

        it('odorat', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_odorat: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez perdu l’odorat.</b>'
            )
        })

        it('douleurs', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez des douleurs.</b>'
            )
        })

        it('diarrhée', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_diarrhee: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez de la diarrhée.</b>'
            )
        })

        it('fatigue', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_fatigue: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous êtes fatigué·e.</b>'
            )
        })

        it('alimentation', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_alimentation: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous avez arrêté de boire ou de manger.</b>'
            )
        })

        it('souffle', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-symptomesactuels"></b>'
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_souffle: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil, {})
            injection.symptomesactuels(
                element.querySelector('#nom-symptomesactuels'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-symptomesactuels">vous êtes essouflé·e.</b>'
            )
        })
    })
})
