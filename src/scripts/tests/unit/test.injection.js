import { assert } from 'chai'
import { JSDOM } from 'jsdom'

import AlgorithmeOrientation from '../../algorithme/orientation'

import * as injection from '../../injection'

import Profil from '../../profil'

describe('Injection', function () {
    describe('Caractéristiques à risques', function () {
        it('âge', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'

            var profil = new Profil('mes_infos', {
                age: 65,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
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

            var algoOrientation = new AlgorithmeOrientation(profil)
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

            var algoOrientation = new AlgorithmeOrientation(profil)
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

            var algoOrientation = new AlgorithmeOrientation(profil)
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

            var algoOrientation = new AlgorithmeOrientation(profil)
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

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            element.innerHTML = '<b class="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.antecedents(
                element.querySelector('.nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-antecedents">Vous avez des antécédents à risque.</b>'
            )
        })

        it('autres', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_chronique_autre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.antecedents(
                element.querySelector('.nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-antecedents">Vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>'
            )
        })

        it('cardio + autres', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
                antecedent_chronique_autre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.antecedents(
                element.querySelector('.nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-antecedents">Vous avez des antécédents à risque et vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>'
            )
        })
    })

    it('Suivi répétition', function () {
        const dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        const element = dom.window.document.querySelector('div')
        element.innerHTML = '<span class="suivi-repetition"></span>'
        const profil = new Profil('mes_infos')
        profil.suivi = [{ date: 1 }, { date: 2 }, { date: 3 }]
        injection.suiviRepetition(element.querySelector('.suivi-repetition'), profil)

        assert.strictEqual(element.innerHTML, '<span class="suivi-repetition">3</span>')
    })

    it('Suivi dernière fois', function () {
        const dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        const element = dom.window.document.querySelector('div')
        element.innerHTML = '<span class="suivi-derniere-fois"></span>'
        const profil = new Profil('mes_infos')
        profil.suivi = [{}, {}, { date: new Date() }]
        injection.suiviDerniereFois(
            element.querySelector('.suivi-derniere-fois'),
            profil
        )

        assert.strictEqual(
            element.innerHTML,
            '<span class="suivi-derniere-fois">just now</span>'
        )
    })
})
