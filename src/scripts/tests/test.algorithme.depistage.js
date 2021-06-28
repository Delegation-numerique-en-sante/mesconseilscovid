import { assert } from 'chai'

import { joursAvant, heuresAvant } from '../utils'

import Profil from '../profil'

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

        it('Vrai s’il y a 29 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(29))
            assert.strictEqual(profil.depistagePositifRecent(), true)
        })

        it('Faux s’il y a 30 jours', function () {
            var profil = new Profil('mes_infos')
            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'positif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(30))
            assert.strictEqual(profil.depistagePositifRecent(), false)
        })
    })

    describe('Prise en compte d’un test négatif', function () {
        it('Valable s’il date d’aujourd’hui et pas de symptômes', function () {
            var profil = new Profil('mes_infos')
            const today = new Date()

            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = today

            assert.isFalse(profil.hasSymptomesActuelsReconnus())
            assert.isTrue(profil.depistageNegatifRecent())
            assert.isFalse(profil.depistageNegatifObsolete())
        })

        it('Valable s’il date d’il y a 6 jours et pas de symptômes', function () {
            var profil = new Profil('mes_infos')

            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))

            assert.isFalse(profil.hasSymptomesActuelsReconnus())
            assert.isTrue(profil.depistageNegatifRecent())
            assert.isFalse(profil.depistageNegatifObsolete())
        })

        it('Valable s’il date d’il y a 6 jours et symptômes plus anciens', function () {
            var profil = new Profil('mes_infos')

            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))

            profil.symptomes_actuels = true
            profil.symptomes_actuels_temperature = true
            profil.symptomes_start_date = heuresAvant(1, joursAvant(7))

            assert.isTrue(profil.hasSymptomesActuelsReconnus())
            assert.isTrue(profil.depistageNegatifRecent())
            assert.isFalse(profil.depistageNegatifObsolete())
        })

        it('Obsolète s’il date d’il y a 6 jours et symptômes plus récents', function () {
            var profil = new Profil('mes_infos')

            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(6))

            profil.symptomes_actuels = true
            profil.symptomes_actuels_temperature = true
            profil.symptomes_start_date = heuresAvant(1, joursAvant(5))

            assert.isTrue(profil.hasSymptomesActuelsReconnus())
            assert.isFalse(profil.depistageNegatifRecent())
            assert.isTrue(profil.depistageNegatifObsolete())
        })

        it('Obsolète s’il date d’il y a 7 jours', function () {
            var profil = new Profil('mes_infos')

            profil.depistage = true
            profil.depistage_type = 'rt-pcr'
            profil.depistage_resultat = 'negatif'
            profil.depistage_start_date = heuresAvant(1, joursAvant(7))

            assert.isFalse(profil.hasSymptomesActuelsReconnus())
            assert.isFalse(profil.depistageNegatifRecent())
            assert.isTrue(profil.depistageNegatifObsolete())
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
