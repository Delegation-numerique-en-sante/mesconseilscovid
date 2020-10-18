import { assert } from 'chai'

import { joursAvant, heuresAvant } from '../utils.js'

import Profil from '../profil.js'

describe('Algorithme dépistage', function () {
    describe('Positif', function () {
        it('Vrai si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.depistage = true
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = today
            assert.strictEqual(profil.estPositif(), true)
        })

        it('Vrai s’il y a 6 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))
            assert.strictEqual(profil.estPositif(), true)
        })

        it('Faux s’il y a 7 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(7))
            assert.strictEqual(profil.estPositif(), false)
        })
    })

    describe('Négatif', function () {
        it('Vrai si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.depistage = true
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = today
            assert.strictEqual(profil.estNegatif(), true)
        })

        it('Vrai s’il y a 6 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))
            assert.strictEqual(profil.estNegatif(), true)
        })

        it('Faux s’il y a 7 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(7))
            assert.strictEqual(profil.estNegatif(), false)
        })
    })

    describe('En attente', function () {
        it('Vrai si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.depistage = true
            profil.depistage_resultat = 'en_attente'
            profil.depistage_start_date = today
            assert.strictEqual(profil.estEnAttente(), true)
        })

        it('Vrai s’il y a 6 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_resultat = 'en_attente'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))
            assert.strictEqual(profil.estEnAttente(), true)
        })

        it('Faux s’il y a 7 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_resultat = 'en_attente'
            profil.depistage_start_date = heuresAvant(1, joursAvant(7))
            assert.strictEqual(profil.estEnAttente(), false)
        })
    })
})
