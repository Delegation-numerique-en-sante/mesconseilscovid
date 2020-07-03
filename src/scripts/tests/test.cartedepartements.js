var assert = require('chai').assert

var carteDepartements = require('../carte.js')

describe('Carte départements', function () {
    it('Il y a le bon nombre de noms', function () {
        assert.strictEqual(Object.keys(carteDepartements._noms).length, 104)
    })
    it('On récupère le nom depuis le département', function () {
        assert.strictEqual(carteDepartements.nom('01'), 'Ain')
    })
    it('Il y a (presque) le bon nombre de couleurs', function () {
        // Manque Saint-Pierre-et-Miquelon, Saint-Barthélemy et Saint-Martin.
        assert.strictEqual(Object.keys(carteDepartements._couleurs).length, 101)
    })
    it('On récupère la couleur verte depuis le département', function () {
        assert.strictEqual(carteDepartements.couleur('01'), 'vert')
    })
    it('On récupère la couleur orange depuis le département', function () {
        assert.strictEqual(carteDepartements.couleur('973'), 'orange')
    })
    it('On récupère la couleur inconnue si on n’a pas la donnée', function () {
        assert.strictEqual(carteDepartements.couleur('977'), 'inconnue')
    })
    it('Il y a le bon nombre de liens vers les préféctures', function () {
        assert.strictEqual(
            Object.keys(carteDepartements._liens_prefectures).length,
            104
        )
    })
    it('On récupère le lien vers la préfecture depuis le département', function () {
        assert.strictEqual(
            carteDepartements.lien_prefecture('01'),
            'http://www.ain.gouv.fr/strategie-locale-de-deconfinement-a6156.html'
        )
    })
})
