import { assert } from 'chai'
import { itParam } from 'mocha-param'

import { createProfil } from './helpers.js'

import AlgorithmeOrientation from '../algorithme/orientation.js'

const matrice = [
    {
        description: 'Non testé et asymptomatique',
        profil: {},
        situation: 'pas_teste_asymptomatique',
        statut: 'peu-de-risques',
        conseils: null,
    },
    {
        description: 'En attente et contact pas vraiment à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        },
        situation: 'en_attente_contact_pas_vraiment_a_risque',
        statut: 'en-attente',
        conseils: 'contact-a-risque-autre',
    },
    {
        description: 'Négatif et contact à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_meme_lieu_de_vie: true,
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_contact_a_risque',
        statut: 'contact-a-risque-avec-test',
        conseils: 'contact-a-risque',
    },
    {
        description: 'Positif et symptômes passés',
        profil: {
            symptomes_passes: true,
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_symptomes_passes',
        statut: 'symptomatique-positif',
        conseils: 'symptomes-passes-positif',
    },
    {
        description: 'Négatif et symptômes actuels pas graves',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_diarrhee: true,
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_symptomes_actuels',
        statut: 'symptomatique-negatif',
        conseils: null,
    },
    {
        description: 'En attente et symptômes actuels graves',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_souffle: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        },
        situation: 'en_attente_symptomes_actuels_graves',
        statut: 'symptomatique-urgent',
        conseils: 'symptomes-actuels-sans-depistage-critique',
    },
]

describe('Situation, statut et conseils personnels selon profil', function () {
    itParam('${value.description}', matrice, function (cas) {
        const profil = createProfil(cas.profil)
        const algo = new AlgorithmeOrientation(profil, {})
        assert.equal(algo.situation, cas.situation)
        assert.deepEqual(algo.statutEtConseils, {
            statut: cas.statut,
            conseils: cas.conseils,
        })
    })
})
