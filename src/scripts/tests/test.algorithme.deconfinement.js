import { assert } from 'chai'

import { joursAvant, heuresAvant } from '../utils.js'
import AlgorithmeDeconfinement from '../algorithme/deconfinement.js'

import Profil from '../profil.js'

describe('Algorithme déconfinement', function () {
    describe('Quarantaine pour tous', function () {
        it('Faux si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.symptomes_start_date = today
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), false)
        })

        it('Faux s’il y a 6 jours', function () {
            var profil = new Profil('mes_infos')
            profil.symptomes_start_date = joursAvant(6)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), false)
        })

        it('Vrai s’il y a 7 jours', function () {
            var profil = new Profil('mes_infos')
            profil.symptomes_start_date = heuresAvant(1, joursAvant(7))
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isQuarantaineDone(), true)
        })
    })

    describe('Régularité', function () {
        it('Vrai si une entrée ces dernières 24h + une entrée ces dernières 48h', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                    },
                    {
                        date: joursAvant(1).toJSON(),
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), true)
        })

        it('Faux si une entrée ces dernières 24h seulement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), false)
        })

        it('Faux si deux entrées ces dernières 24h seulement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                    },
                    {
                        date: new Date().toJSON(),
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), false)
        })

        it('Faux si une entrée ces dernières 48h seulement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: joursAvant(1).toJSON(),
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), false)
        })

        it('Faux si deux entrées ces dernières 48h seulement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: joursAvant(1).toJSON(),
                    },
                    {
                        date: joursAvant(1).toJSON(),
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isSuiviRegulier(), false)
        })
    })

    describe('Fièvre', function () {
        it('Vrai si suivi récent sans fièvre', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Vrai si suivi récent sans symptômes', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: false,
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Faux si suivi récent avec fièvre', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isFievreDone(), false)
        })

        it('Vrai si suivi > 48h sans fièvre', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Vrai si suivi > 48h avec fièvre', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })

        it('Faux si suivi récent avec fièvre + > 48h avec fièvre', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isFievreDone(), false)
        })

        it('Vrai si suivi récent sans fièvre + > 48h avec fièvre', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isFievreDone(), true)
        })
    })

    describe('Essoufflement', function () {
        it('Vrai si suivi récent sans essoufflement (mieux)', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'mieux',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi récent sans essoufflement (stable)', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'stable',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi récent sans essoufflement (aucun)', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'aucun',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi récent sans symptômes', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: false,
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Faux si suivi récent avec essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), false)
        })

        it('Vrai si suivi > 48h sans essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'mieux',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Vrai si suivi > 48h avec essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })

        it('Faux si suivi récent avec essoufflement + > 48h avec essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), false)
        })

        it('Vrai si suivi récent sans essoufflement + > 48h avec essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        essoufflement: 'critique',
                    },
                ],
            })
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isEssoufflementDone(), true)
        })
    })

    describe('Déconfinable pour tous', function () {
        it('Vrai s’il y a 7 jours et plus de fièvre ni essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            })
            profil.symptomes_start_date = heuresAvant(1, joursAvant(7))
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isDeconfinable(), true)
        })

        it('Vrai s’il y a 7 jours et plus de symptômes', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: false,
                    },
                    {
                        date: joursAvant(1).toJSON(),
                        symptomes: false,
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            })
            profil.symptomes_start_date = heuresAvant(1, joursAvant(7))
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isDeconfinable(), true)
        })

        it('Faux s’il y a 7 jours et plus de fièvre ni essoufflement mais sans régularité', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            })
            profil.symptomes_start_date = heuresAvant(1, joursAvant(7))
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 6 jours et plus de fièvre ni essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            })
            profil.symptomes_start_date = joursAvant(6)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 7 jours et fièvre récente mais pas essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            })
            profil.symptomes_start_date = heuresAvant(1, joursAvant(7))
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })

        it('Faux s’il y a 7 jours et plus de fièvre mais essoufflement', function () {
            var profil = new Profil('mes_infos', {
                suivi: [
                    {
                        date: new Date().toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'critique',
                    },
                    {
                        date: joursAvant(1).toJSON(),
                        symptomes: true,
                        fievre: 'non',
                        essoufflement: 'mieux',
                    },
                    {
                        date: joursAvant(3).toJSON(),
                        symptomes: true,
                        fievre: 'oui',
                        essoufflement: 'critique',
                    },
                ],
            })
            profil.symptomes_start_date = heuresAvant(1, joursAvant(7))
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.strictEqual(algoDeconfinement.isDeconfinable(), false)
        })
    })
})
