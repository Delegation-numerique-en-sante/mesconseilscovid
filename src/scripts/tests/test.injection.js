var assert = require('chai').assert

var jsdom = require('jsdom')
var { JSDOM } = jsdom

var AlgorithmeOrientation = require('../algorithme/orientation.js')
    .AlgorithmeOrientation
var injection = require('../injection.js')

var Profil = require('../profil.js').Profil
var profil = new Profil('mes_infos')

describe('Injection', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    describe('Caractéristiques à risques', function () {
        it('âge', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-caracteristiques-a-risques"></b>'
            var data = {
                age: 65,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('#nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>'
            )
        })

        it('grossesse', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-caracteristiques-a-risques"></b>'
            var data = {
                grossesse_3e_trimestre: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('#nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-caracteristiques-a-risques">vous êtes au 3e trimestre de votre grossesse.</b>'
            )
        })

        it('âge + grossesse = âge', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-caracteristiques-a-risques"></b>'
            var data = {
                age: 65,
                grossesse_3e_trimestre: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('#nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>'
            )
        })

        it('IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-caracteristiques-a-risques"></b>'
            var data = {
                taille: 150,
                poids: 150,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('#nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-caracteristiques-a-risques">vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })

        it('âge + IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-caracteristiques-a-risques"></b>'
            var data = {
                age: 65,
                taille: 150,
                poids: 150,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('#nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })

        it('grossesse + IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-caracteristiques-a-risques"></b>'
            var data = {
                grossesse_3e_trimestre: true,
                taille: 150,
                poids: 150,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('#nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b id="nom-caracteristiques-a-risques">vous êtes au 3e trimestre de votre grossesse et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })
    })

    describe('Antécédents', function () {
        it('cardio', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b id="nom-antecedents"></b>'
            var data = {
                antecedent_cardio: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                antecedent_chronique_autre: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                antecedent_cardio: true,
                antecedent_chronique_autre: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_temperature: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_temperature_inconnue: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_temperature: true,
                symptomes_actuels_toux: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_odorat: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_diarrhee: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_fatigue: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_alimentation: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_souffle: true,
            }
            profil.fillData(data)

            var algoOrientation = new AlgorithmeOrientation(profil)
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
