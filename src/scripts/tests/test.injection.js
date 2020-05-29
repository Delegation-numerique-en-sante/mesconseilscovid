var chai = require('chai')

var jsdom = require('jsdom')
var { JSDOM } = jsdom

var algorithme = require('../algorithme.js')
var injection = require('../injection.js')
var Questionnaire = require('../questionnaire.js')
var questionnaire = new Questionnaire()

describe('Injection', function () {
    beforeEach(function () {
        questionnaire.resetData()
    })

    afterEach(function () {
        questionnaire.resetData()
    })

    it('Départements', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-departement"></strong>
            <a href="#conseils-departement" id="lien-prefecture">Site</a>
        `
        var data = {
            departement: '01',
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.departement(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-departement">Ain</strong>
            <a href="http://www.ain.gouv.fr/strategie-locale-de-deconfinement-a6156.html" id="lien-prefecture">Site</a>
        `)
    })

    it('Caractéristiques (âge)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-caracteristiques"></strong>
        `
        var data = {
            sup65: true,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.caracteristiques(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-caracteristiques">vous êtes âgé·e de plus de 65&nbsp;ans.</strong>
        `)
    })

    it('Caractéristiques (grossesse)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-caracteristiques"></strong>
        `
        var data = {
            grossesse_3e_trimestre: true,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.caracteristiques(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-caracteristiques">vous êtes au 3e trimestre de votre grossesse.</strong>
        `)
    })

    it('Caractéristiques (âge + grossesse = âge)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-caracteristiques"></strong>
        `
        var data = {
            sup65: true,
            grossesse_3e_trimestre: true,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.caracteristiques(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-caracteristiques">vous êtes âgé·e de plus de 65&nbsp;ans.</strong>
        `)
    })

    it('Caractéristiques (IMC)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-caracteristiques"></strong>
        `
        var data = {
            taille: 150,
            poids: 150,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.caracteristiques(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-caracteristiques">vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</strong>
        `)
    })

    it('Caractéristiques (âge + IMC)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-caracteristiques"></strong>
        `
        var data = {
            sup65: true,
            taille: 150,
            poids: 150,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.caracteristiques(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-caracteristiques">vous êtes âgé·e de plus de 65&nbsp;ans et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</strong>
        `)
    })

    it('Caractéristiques (grossesse + IMC)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-caracteristiques"></strong>
        `
        var data = {
            grossesse_3e_trimestre: true,
            taille: 150,
            poids: 150,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.caracteristiques(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-caracteristiques">vous êtes au 3e trimestre de votre grossesse et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</strong>
        `)
    })

    it('Antécédents (cardio)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-antecedents"></strong>
        `
        var data = {
            antecedent_cardio: true,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.antecedents(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-antecedents">vous avez des antécédents à risque.</strong>
        `)
    })

    it('Antécédents (autres)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-antecedents"></strong>
        `
        var data = {
            antecedent_chronique_autre: true,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.antecedents(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-antecedents">vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</strong>
        `)
    })

    it('Antécédents (cardio + autres)', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = `
            <strong id="nom-antecedents"></strong>
        `
        var data = {
            antecedent_cardio: true,
            antecedent_chronique_autre: true,
        }
        questionnaire.fillData(data)

        var computedData = algorithme.getData(questionnaire)
        injection.antecedents(element, computedData)

        chai.expect(element.innerHTML).to.equal(`
            <strong id="nom-antecedents">vous avez des antécédents à risque et vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</strong>
        `)
    })
})
