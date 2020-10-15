import { assert } from 'chai'

import { createProfil } from './helpers.js'

import AlgorithmeOrientation from '../algorithme/orientation.js'

describe('Situation', function () {
    it('Non testé et asymptomatique', function () {
        const profil = createProfil()
        const algo = new AlgorithmeOrientation(profil, {})
        assert.equal(algo.situation, 'pas_teste_asymptomatique')
    })

    it('En attente et contact pas vraiment à risque', function () {
        const profil = createProfil({
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        })
        const algo = new AlgorithmeOrientation(profil, {})
        assert.equal(algo.situation, 'en_attente_contact_pas_vraiment_a_risque')
    })

    it('Négatif et contact à risque', function () {
        const profil = createProfil({
            contact_a_risque: true,
            contact_a_risque_meme_lieu_de_vie: true,
            depistage: true,
            depistage_resultat: 'negatif',
        })
        const algo = new AlgorithmeOrientation(profil, {})
        assert.equal(algo.situation, 'negatif_contact_a_risque')
    })

    it('Positif et symptômes passés', function () {
        const profil = createProfil({
            symptomes_passes: true,
            depistage: true,
            depistage_resultat: 'positif',
        })
        const algo = new AlgorithmeOrientation(profil, {})
        assert.equal(algo.situation, 'positif_symptomes_passes')
    })

    it('Négatif et symptômes actuels pas graves', function () {
        const profil = createProfil({
            symptomes_actuels: true,
            symptomes_actuels_diarrhee: true,
            depistage: true,
            depistage_resultat: 'negatif',
        })
        const algo = new AlgorithmeOrientation(profil, {})
        assert.equal(algo.situation, 'negatif_symptomes_actuels')
    })

    it('En attente et symptômes actuels graves', function () {
        const profil = createProfil({
            symptomes_actuels: true,
            symptomes_actuels_souffle: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        })
        const algo = new AlgorithmeOrientation(profil, {})
        assert.equal(algo.situation, 'en_attente_symptomes_actuels_graves')
    })
})
