var assert = require('chai').assert

var AlgorithmeSuivi = require('../algorithmesuivi.js').AlgorithmeSuivi

var Profil = require('../profil.js').Profil
var profil = new Profil('mes_infos')

describe('AlgorithmeSuivi gravité', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Un suivi a une gravité par défaut de 0', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'mieux',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 0)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-0')
    })

    it('Un suivi a une gravité 1 si fièvre', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'mieux',
                    fievre: 'oui',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 1)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-1')
    })

    it('Un suivi a une gravité 1 si diarrhée ou vomissements', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'mieux',
                    diarrheeVomissements: 'oui',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 1)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-1')
    })

    it('Un suivi a une gravité 2 si au moins un pire', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'pire',
                    etatGeneral: 'mieux',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 2)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-2')
    })

    it('Un suivi a une gravité 2 si au moins un autre pire', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'pire',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 2)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-2')
    })

    it('Un suivi a une gravité 2 si pas d’alimentation ou d’hydratation', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'mieux',
                    alimentationHydratation: 'oui',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 2)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-2')
    })

    it('Un suivi a une gravité 3 si au moins un critique', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'critique',
                    etatGeneral: 'mieux',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 3)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-3')
    })

    it('Un suivi a une gravité 3 si au moins un autre critique', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'critique',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.gravite, 3)
        assert.strictEqual(algorithme.graviteBlockNameToDisplay(), 'suivi-gravite-3')
    })
})

describe('AlgorithmeSuivi psy', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Un suivi a un psy par défaut de 0', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'mieux',
                    etatPsychologique: 'mieux',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.psy, 0)
        assert.strictEqual(algorithme.psyBlockNameToDisplay(), 'suivi-psy-0')
    })

    it('Un suivi a un psy 1 si gravité à 0', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'stable',
                    etatGeneral: 'mieux',
                    etatPsychologique: 'critique',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.psy, 1)
        assert.strictEqual(algorithme.psyBlockNameToDisplay(), 'suivi-psy-1')
    })

    it('Un suivi a un psy 2 si gravité > 0', function () {
        var data = {
            suivi: [
                {
                    essoufflement: 'mieux',
                    etatGeneral: 'pire',
                    etatPsychologique: 'critique',
                },
            ],
        }
        profil.fillData(data)
        var algorithme = new AlgorithmeSuivi(profil)
        assert.strictEqual(algorithme.psy, 2)
        assert.strictEqual(algorithme.psyBlockNameToDisplay(), 'suivi-psy-2')
    })
})
