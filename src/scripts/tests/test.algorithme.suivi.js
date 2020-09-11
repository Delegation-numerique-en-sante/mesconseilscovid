import { assert } from 'chai'

import AlgorithmeSuivi from '../algorithme/suivi.js'

import Profil from '../profil.js'
var profil = new Profil('mes_infos')

describe('Algorithme auto-suivi', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    describe('Gravité', function () {
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 0)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-0')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [])
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 1)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-1')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'fievre-gravite-1',
            ])
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 1)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-1')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'diarrhee-vomissements-gravite-1',
            ])
        })

        it('Un suivi a une gravité 1 si toux', function () {
            var data = {
                suivi: [
                    {
                        essoufflement: 'mieux',
                        etatGeneral: 'mieux',
                        toux: 'oui',
                    },
                ],
            }
            profil.fillData(data)
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 1)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-1')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'toux-gravite-1',
            ])
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 2)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-2')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'essoufflement-gravite-2',
            ])
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 2)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-2')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'etat-general-gravite-2',
            ])
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 2)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-2')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'alimentation-hydratation-gravite-2',
            ])
        })

        it('Un suivi a une gravité 2 si maux de tête', function () {
            var data = {
                suivi: [
                    {
                        essoufflement: 'mieux',
                        etatGeneral: 'mieux',
                        mauxDeTete: 'oui',
                    },
                ],
            }
            profil.fillData(data)
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 2)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-2')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'maux-de-tete-gravite-2',
            ])
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 3)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-3')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'essoufflement-gravite-3',
            ])
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.gravite, 3)
            assert.strictEqual(algoSuivi.graviteBlockNameToDisplay(), 'suivi-gravite-3')
            assert.deepEqual(algoSuivi.evolutionsBlockNamesToDisplay(), [
                'etat-general-gravite-3',
            ])
        })
    })

    describe('Psy', function () {
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.psy, 0)
            assert.strictEqual(algoSuivi.psyBlockNameToDisplay(), 'suivi-psy-0')
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.psy, 1)
            assert.strictEqual(algoSuivi.psyBlockNameToDisplay(), 'suivi-psy-1')
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
            var algoSuivi = new AlgorithmeSuivi(profil)
            assert.strictEqual(algoSuivi.psy, 2)
            assert.strictEqual(algoSuivi.psyBlockNameToDisplay(), 'suivi-psy-2')
        })
    })
})
