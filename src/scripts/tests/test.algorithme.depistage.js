import { assert } from 'chai'

import { joursAvant, heuresAvant } from '../utils.js'

import Profil from '../profil.js'

describe('Algorithme dépistage', function () {
    describe('Dépistage positif récent', function () {
        it('Vrai si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = today
            assert.strictEqual(profil.depistagePositifRecent(), true)
        })

        it('Vrai s’il y a 13 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(13))
            assert.strictEqual(profil.depistagePositifRecent(), true)
        })

        it('Faux s’il y a 14 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(14))
            assert.strictEqual(profil.depistagePositifRecent(), false)
        })
    })

    describe('Dépistage négatif récent', function () {
        it('Vrai si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = today
            assert.strictEqual(profil.depistageNegatifRecent(), true)
        })

        it('Vrai s’il y a 6 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))
            assert.strictEqual(profil.depistageNegatifRecent(), true)
        })

        it('Faux s’il y a 7 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(7))
            assert.strictEqual(profil.depistageNegatifRecent(), false)
        })
    })

    describe('Dépistage en attente récent', function () {
        it('Vrai si aujourd’hui', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'en_attente'
            profil.depistage_start_date = today
            assert.strictEqual(profil.depistageEnAttenteRecent(), true)
        })

        it('Vrai s’il y a 6 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'en_attente'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))
            assert.strictEqual(profil.depistageEnAttenteRecent(), true)
        })

        it('Faux s’il y a 7 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'en_attente'
            profil.depistage_start_date = heuresAvant(1, joursAvant(7))
            assert.strictEqual(profil.depistageEnAttenteRecent(), false)
        })
    })
})
