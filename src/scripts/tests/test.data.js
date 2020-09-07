const assert = require('chai').assert

const incidence = require('../data/incidence.js').incidence
const prefectures = require('../data/prefectures.js').prefectures
const departements = require('../data/departements.js').departements

describe('Carte départements', function () {
    it('Il y a le bon nombre de noms', function () {
        assert.strictEqual(Object.keys(departements).length, 104)
    })
    it('On récupère le nom depuis le département', function () {
        assert.strictEqual(departements['01'], 'Ain')
    })
    it('Il y a le bon nombre d’incidences', function () {
        assert.strictEqual(Object.keys(incidence).length, 104)
    })
    it('On récupère l’incidence depuis le département', function () {
        assert.isNumber(incidence['01'])
        assert.isAtLeast(incidence['01'], 0)
    })
    it('Il y a le bon nombre de liens vers les préféctures', function () {
        assert.strictEqual(Object.keys(prefectures).length, 104)
    })
    it('On récupère le lien vers la préfecture depuis le département', function () {
        assert.strictEqual(
            prefectures['01'],
            'http://www.ain.gouv.fr/coronavirus-covid-19-r1627.html'
        )
    })
})
