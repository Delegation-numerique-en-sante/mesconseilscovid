var assert = require('chai').assert

var utils = require('../utils.js')
var AlgorithmeOrientation = require('../algorithme/orientation.js')
    .AlgorithmeOrientation
var AlgorithmeDeconfinement = require('../algorithme/deconfinement.js')
    .AlgorithmeDeconfinement

var Profil = require('../profil.js').Profil
var profil = new Profil('mes_infos')

describe('Algorithme déconfinement', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    describe('Quarantaine sans personne fragile', function () {
        it('Faux si aujourd’hui', function () {
            const today = new Date()
            profil.symptomes_start_date = today
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), false)
        })

        it('Faux s’il y a 8 jours', function () {
            profil.symptomes_start_date = utils.joursAvant(8)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), false)
        })

        it('Vrai s’il y a 9 jours', function () {
            profil.symptomes_start_date = utils.joursAvant(9)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), true)
        })
    })

    describe('Quarantaine avec personne fragile', function () {
        it('Faux si aujourd’hui', function () {
            const data = {
                grossesse_3e_trimestre: true,
            }
            profil.fillData(data)
            const today = new Date()
            profil.symptomes_start_date = today
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), false)
        })

        it('Faux s’il y a 10 jours', function () {
            const data = {
                grossesse_3e_trimestre: true,
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(10)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), false)
        })

        it('Vrai s’il y a 11 jours', function () {
            const data = {
                grossesse_3e_trimestre: true,
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(11)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), true)
        })
    })

    describe('Régularité', function () {
        it('Vrai si une entrée ces dernières 24h + une entrée ces dernières 48h', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), true)
        })

        it('Faux si une entrée ces dernières 24h seulement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), false)
        })

        it('Faux si une entrée ces dernières 48h seulement', function () {
            const data = {
                suivi: [
                    {
                        date: utils.joursAvant(1).toJSON(),
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), false)
        })
    })

    describe('Fièvre', function () {
        it('Vrai si suivi récent sans fièvre', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Vrai si suivi récent sans symptômes', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: false,
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Faux si suivi récent avec fièvre', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isFievreDone(), false)
        })

        it('Vrai si suivi > 48h sans fièvre', function () {
            const data = {
                suivi: [
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Vrai si suivi > 48h avec fièvre', function () {
            const data = {
                suivi: [
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Faux si suivi récent avec fièvre + > 48h avec fièvre', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isFievreDone(), false)
        })

        it('Vrai si suivi récent sans fièvre + > 48h avec fièvre', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })
    })

    describe('Essoufflement', function () {
        it('Vrai si suivi récent sans essoufflement (mieux)', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'mieux',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi récent sans essoufflement (stable)', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'stable',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi récent sans essoufflement (aucun)', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'aucun',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi récent sans symptômes', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: false,
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Faux si suivi récent avec essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), false)
        })

        it('Vrai si suivi > 48h sans essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'mieux',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi > 48h avec essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Faux si suivi récent avec essoufflement + > 48h avec essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), false)
        })

        it('Vrai si suivi récent sans essoufflement + > 48h avec essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })
    })

    describe('Déconfinable sans personne fragile', function () {
        it('Vrai s’il y a 9 jours et plus de fièvre ni essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(9)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), true)
        })

        it('Vrai s’il y a 9 jours et plus de symptômes', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: false,
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: false,
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(9)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), true)
        })

        it('Faux s’il y a 9 jours et plus de fièvre ni essoufflement mais sans régularité', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(9)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 8 jours et plus de fièvre ni essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(8)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 9 jours et fièvre récente mais pas essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(9)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 9 jours et plus de fièvre mais essoufflement', function () {
            const data = {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'critique',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(9)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })
    })

    describe('Déconfinable avec personne fragile', function () {
        it('Vrai s’il y a 11 jours et plus de fièvre ni essoufflement', function () {
            const data = {
                grossesse_3e_trimestre: true,
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(11)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), true)
        })

        it('Vrai s’il y a 11 jours et plus de symptômes', function () {
            const data = {
                grossesse_3e_trimestre: true,
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: false,
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: false,
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(11)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), true)
        })

        it('Vrai s’il y a 11 jours et plus de fièvre ni essoufflement mais pas régularité', function () {
            const data = {
                grossesse_3e_trimestre: true,
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(11)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 10 jours et plus de fièvre ni essoufflement', function () {
            const data = {
                grossesse_3e_trimestre: true,
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(10)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 11 jours et fièvre récente mais pas essoufflement', function () {
            const data = {
                grossesse_3e_trimestre: true,
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(11)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 11 jours et plus de fièvre mais essoufflement', function () {
            const data = {
                grossesse_3e_trimestre: true,
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'critique',
                    },
                    {
                        date: utils.joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: utils.joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            }
            profil.fillData(data)
            profil.symptomes_start_date = utils.joursAvant(11)
            const algoOrientation = new AlgorithmeOrientation(profil)
            const algoDeconfinement = new AlgorithmeDeconfinement(
                profil,
                algoOrientation
            )
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })
    })
})
