import { assert } from 'chai'

import incidence from '../data/incidence.js'
import prefectures from '../data/prefectures.js'
import departements from '../data/departements.js'

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
    it('Il y a le bon nombre de liens vers les préfectures', function () {
        assert.strictEqual(Object.keys(prefectures).length, 104)
    })
    it('On récupère le lien vers la préfecture depuis le département', function () {
        assert.strictEqual(
            prefectures['01'],
            'http://www.ain.gouv.fr/coronavirus-covid-19-r1627.html'
        )
    })
})
