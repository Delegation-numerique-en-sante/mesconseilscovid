var assert = require('chai').assert

var jsdom = require('jsdom')
var { JSDOM } = jsdom

var Algorithme = require('../algorithme.js').Algorithme
var injection = require('../injection.js')
var Profil = require('../profil.js')
var profil = new Profil()

describe('Injection', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Départements', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `<b id="nom-departement"></b>`
        injection.departement(element.querySelector('#nom-departement'), '01')

        assert.strictEqual(element.innerHTML, `<b id="nom-departement">Ain</b>`)
    })

    it('Lien préfecture', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <a href="#conseils-departement" id="lien-prefecture">Site</a>
        `
        injection.lienPrefecture(element.querySelector('#lien-prefecture'), '01')

        assert.strictEqual(
            element.innerHTML,
            `
            <a href="http://www.ain.gouv.fr/strategie-locale-de-deconfinement-a6156.html" id="lien-prefecture">Site</a>
        `
        )
    })

    it('Caractéristiques (âge)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-caracteristiques"></b>
        `
        var data = {
            age: 65,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.caracteristiques(
            element.querySelector('#nom-caracteristiques'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-caracteristiques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>
        `
        )
    })

    it('Caractéristiques (grossesse)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-caracteristiques"></b>
        `
        var data = {
            grossesse_3e_trimestre: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.caracteristiques(
            element.querySelector('#nom-caracteristiques'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-caracteristiques">vous êtes au 3e trimestre de votre grossesse.</b>
        `
        )
    })

    it('Caractéristiques (âge + grossesse = âge)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-caracteristiques"></b>
        `
        var data = {
            age: 65,
            grossesse_3e_trimestre: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.caracteristiques(
            element.querySelector('#nom-caracteristiques'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-caracteristiques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>
        `
        )
    })

    it('Caractéristiques (IMC)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-caracteristiques"></b>
        `
        var data = {
            taille: 150,
            poids: 150,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.caracteristiques(
            element.querySelector('#nom-caracteristiques'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-caracteristiques">vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>
        `
        )
    })

    it('Caractéristiques (âge + IMC)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-caracteristiques"></b>
        `
        var data = {
            age: 65,
            taille: 150,
            poids: 150,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.caracteristiques(
            element.querySelector('#nom-caracteristiques'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-caracteristiques">vous êtes âgé·e de plus de 65&nbsp;ans et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>
        `
        )
    })

    it('Caractéristiques (grossesse + IMC)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-caracteristiques"></b>
        `
        var data = {
            grossesse_3e_trimestre: true,
            taille: 150,
            poids: 150,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.caracteristiques(
            element.querySelector('#nom-caracteristiques'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-caracteristiques">vous êtes au 3e trimestre de votre grossesse et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>
        `
        )
    })

    it('Antécédents (cardio)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-antecedents"></b>
        `
        var data = {
            antecedent_cardio: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.antecedents(element.querySelector('#nom-antecedents'), algorithme)

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-antecedents">Vous avez des antécédents à risque.</b>
        `
        )
    })

    it('Antécédents (autres)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-antecedents"></b>
        `
        var data = {
            antecedent_chronique_autre: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.antecedents(element.querySelector('#nom-antecedents'), algorithme)

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-antecedents">Vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>
        `
        )
    })

    it('Antécédents (cardio + autres)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-antecedents"></b>
        `
        var data = {
            antecedent_cardio: true,
            antecedent_chronique_autre: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.antecedents(element.querySelector('#nom-antecedents'), algorithme)

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-antecedents">Vous avez des antécédents à risque et vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>
        `
        )
    })

    it('Symptômes actuels (température)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_temperature: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez de la température (ou vous ne savez pas).</b>
        `
        )
    })

    it('Symptômes actuels (température inconnue)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_temperature_inconnue: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez de la température (ou vous ne savez pas).</b>
        `
        )
    })

    it('Symptômes actuels (toux)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_toux: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez de la toux.</b>
        `
        )
    })

    it('Symptômes actuels (température + toux)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_temperature: true,
            symptomes_actuels_toux: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez de la température (ou vous ne savez pas)&nbsp;; vous avez de la toux.</b>
        `
        )
    })

    it('Symptômes actuels (odorat)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_odorat: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez perdu l’odorat.</b>
        `
        )
    })

    it('Symptômes actuels (douleurs)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_douleurs: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez des douleurs.</b>
        `
        )
    })

    it('Symptômes actuels (diarrhée)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_diarrhee: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez de la diarrhée.</b>
        `
        )
    })

    it('Symptômes actuels (fatigue)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_fatigue: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous êtes fatigué·e.</b>
        `
        )
    })

    it('Symptômes actuels (alimentation)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_alimentation: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous avez arrêté de boire ou de manger.</b>
        `
        )
    })

    it('Symptômes actuels (souffle)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <b id="nom-symptomesactuels"></b>
        `
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_souffle: true,
        }
        profil.fillData(data)

        var algorithme = new Algorithme(profil)
        injection.symptomesactuels(
            element.querySelector('#nom-symptomesactuels'),
            algorithme
        )

        assert.strictEqual(
            element.innerHTML,
            `
            <b id="nom-symptomesactuels">vous êtes essouflé·e.</b>
        `
        )
    })
})
