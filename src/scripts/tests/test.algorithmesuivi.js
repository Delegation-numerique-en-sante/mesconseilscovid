var assert = require('chai').assert

var AlgorithmeSuivi = require('../algorithmesuivi.js').AlgorithmeSuivi

var Profil = require('../profil.js').Profil
var profil = new Profil('mes_infos')

describe('AlgorithmeSuivi statut', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Un suivi a une gravité par défaut de 0', function () {
        var data = {
            suivi: [{
                essoufflement: "mieux",
                etatGeneral: "mieux",
            }]
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 0)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), "suivi-gravite-0")
    })

    it('Un suivi a une gravité 2 si au moins un pire', function () {
        var data = {
            suivi: [{
                essoufflement: "pire",
                etatGeneral: "mieux",
            }]
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 2)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), "suivi-gravite-2")
    })

    it('Un suivi a une gravité 2 si au moins un autre pire', function () {
        var data = {
            suivi: [{
                essoufflement: "mieux",
                etatGeneral: "pire",
            }]
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 2)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), "suivi-gravite-2")
    })

    it('Un suivi a une gravité 3 si au moins un critique', function () {
        var data = {
            suivi: [{
                essoufflement: "critique",
                etatGeneral: "mieux",
            }]
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 3)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), "suivi-gravite-3")
    })

    it('Un suivi a une gravité 3 si au moins un autre critique', function () {
        var data = {
            suivi: [{
                essoufflement: "mieux",
                etatGeneral: "critique",
            }]
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 3)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), "suivi-gravite-3")
    })
})
