import { assert } from 'chai'

import { joursAvant } from '../../utils'
import AlgorithmeDeconfinement from '../../algorithme/deconfinement'

import Profil from '../../profil'

describe('Algorithme déconfinement', function () {
    describe('Quarantaine pour tous', function () {
        it('Faux si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.symptomes_start_date = today
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isQuarantaineDone())
        })

        it('Faux s’il y a 9 jours', function () {
            var profil = new Profil('mes_infos')
            profil.symptomes_start_date = joursAvant(9)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isQuarantaineDone())
        })

        it('Vrai s’il y a 10 jours', function () {
            var profil = new Profil('mes_infos')
            profil.symptomes_start_date = joursAvant(10)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isTrue(algoDeconfinement.isQuarantaineDone())
        })

        it('Faux s’il y a 6 jours et vacciné', function () {
            var profil = new Profil('mes_infos')
            profil.symptomes_start_date = joursAvant(6)
            profil.vaccins = 'completement'
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isQuarantaineDone())
        })

        it('Vrai s’il y a 7 jours et vacciné', function () {
            var profil = new Profil('mes_infos')
            profil.symptomes_start_date = joursAvant(7)
            profil.vaccins = 'completement'
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isTrue(algoDeconfinement.isQuarantaineDone())
        })

        describe('Isolement de 7 jours pour les moins de 12 ans vaccinés', function () {
            it('Après 6 jours : pas encore', function () {
                var profil = new Profil('mes_infos', {
                    age: 11,
                    vaccins: 'completement',
                })
                profil.symptomes_start_date = joursAvant(6)
                const algoDeconfinement = new AlgorithmeDeconfinement(profil)
                assert.isFalse(algoDeconfinement.isQuarantaineDone())
            })

            it('Après 7 jours : c’est bon', function () {
                var profil = new Profil('mes_infos', {
                    age: 11,
                    vaccins: 'completement',
                })
                profil.symptomes_start_date = joursAvant(7)
                const algoDeconfinement = new AlgorithmeDeconfinement(profil)
                assert.isTrue(algoDeconfinement.isQuarantaineDone())
            })
        })

        describe('Isolement de 7 jours pour les moins de 12 ans non vaccinés', function () {
            it('Après 6 jours : pas encore', function () {
                var profil = new Profil('mes_infos', {
                    age: 11,
                    vaccins: 'pas_encore',
                })
                profil.symptomes_start_date = joursAvant(6)
                const algoDeconfinement = new AlgorithmeDeconfinement(profil)
                assert.isFalse(algoDeconfinement.isQuarantaineDone())
            })

            it('Après 7 jours : c’est bon', function () {
                var profil = new Profil('mes_infos', {
                    age: 11,
                    vaccins: 'pas_encore',
                })
                profil.symptomes_start_date = joursAvant(7)
                const algoDeconfinement = new AlgorithmeDeconfinement(profil)
                assert.isTrue(algoDeconfinement.isQuarantaineDone())
            })
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
            assert.isTrue(algoDeconfinement.isSuiviRegulier())
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
            assert.isFalse(algoDeconfinement.isSuiviRegulier())
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
            assert.isFalse(algoDeconfinement.isSuiviRegulier())
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
            assert.isFalse(algoDeconfinement.isSuiviRegulier())
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
            assert.isFalse(algoDeconfinement.isSuiviRegulier())
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
            assert.isTrue(algoDeconfinement.isFievreDone())
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
            assert.isTrue(algoDeconfinement.isFievreDone())
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
            assert.isFalse(algoDeconfinement.isFievreDone())
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
            assert.isTrue(algoDeconfinement.isFievreDone())
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
            assert.isTrue(algoDeconfinement.isFievreDone())
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
            assert.isFalse(algoDeconfinement.isFievreDone())
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
            assert.isTrue(algoDeconfinement.isFievreDone())
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
            assert.isTrue(algoDeconfinement.isEssoufflementDone())
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
            assert.isTrue(algoDeconfinement.isEssoufflementDone())
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
            assert.isTrue(algoDeconfinement.isEssoufflementDone())
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
            assert.isTrue(algoDeconfinement.isEssoufflementDone())
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
            assert.isFalse(algoDeconfinement.isEssoufflementDone())
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
            assert.isTrue(algoDeconfinement.isEssoufflementDone())
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
            assert.isTrue(algoDeconfinement.isEssoufflementDone())
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
            assert.isFalse(algoDeconfinement.isEssoufflementDone())
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
            assert.isTrue(algoDeconfinement.isEssoufflementDone())
        })
    })

    describe('Déconfinable pour tous', function () {
        it('Vrai s’il y a 10 jours et plus de fièvre ni essoufflement', function () {
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
            profil.symptomes_start_date = joursAvant(10)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isTrue(algoDeconfinement.isDeconfinable())
        })

        it('Vrai s’il y a 10 jours et plus de symptômes', function () {
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
            profil.symptomes_start_date = joursAvant(10)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isTrue(algoDeconfinement.isDeconfinable())
        })

        it('Faux s’il y a 10 jours et plus de fièvre ni essoufflement mais sans régularité', function () {
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
            profil.symptomes_start_date = joursAvant(10)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
        })

        it('Faux s’il y a 9 jours et plus de fièvre ni essoufflement', function () {
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
            profil.symptomes_start_date = joursAvant(9)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
        })

        it('Faux s’il y a 10 jours et fièvre récente mais pas essoufflement', function () {
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
            profil.symptomes_start_date = joursAvant(10)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
        })

        it('Faux s’il y a 10 jours et plus de fièvre mais essoufflement', function () {
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
            profil.symptomes_start_date = joursAvant(10)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
        })
    })

    describe('Déconfinable pour vaccinés', function () {
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
            profil.symptomes_start_date = joursAvant(7)
            profil.vaccins = 'completement'
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isTrue(algoDeconfinement.isDeconfinable())
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
            profil.symptomes_start_date = joursAvant(7)
            profil.vaccins = 'completement'
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isTrue(algoDeconfinement.isDeconfinable())
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
            profil.symptomes_start_date = joursAvant(7)
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
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
            profil.vaccins = 'completement'
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
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
            profil.symptomes_start_date = joursAvant(7)
            profil.vaccins = 'completement'
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
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
            profil.symptomes_start_date = joursAvant(7)
            profil.vaccins = 'completement'
            const algoDeconfinement = new AlgorithmeDeconfinement(profil)
            assert.isFalse(algoDeconfinement.isDeconfinable())
        })
    })
})
