import { assert } from 'chai'
import { itParam } from 'mocha-param'

import { createProfil } from './helpers.js'

import AlgorithmeOrientation from '../algorithme/orientation.js'

// On parcourt tous les cas possibles par colonnes
const matrice = [
    {
        description: 'Positif et symptômes actuels graves',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_souffle: true,
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_symptomes_actuels_graves',
        statut: 'positif-symptomatique-urgent',
        conseils: 'symptomes-actuels-positif-critique',
    },
    {
        description: 'Positif et symptômes actuels',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_diarrhee: true,
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_symptomes_actuels',
        statut: 'symptomatique-positif',
        conseils: 'depistage-positif-symptomatique',
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
        description: 'Positif et contact à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_contact_direct: true,
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_contact_a_risque',
        statut: 'asymptomatique',
        conseils: 'depistage-positif-asymptomatique',
    },
    {
        description: 'Positif et contact à risque même lieu de vie',
        profil: {
            contact_a_risque: true,
            contact_a_risque_meme_lieu_de_vie: true,
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_contact_a_risque_meme_lieu_de_vie',
        statut: 'asymptomatique',
        conseils: 'depistage-positif-asymptomatique',
    },
    {
        description: 'Positif et contact pas vraiment à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_contact_pas_vraiment_a_risque',
        statut: 'asymptomatique',
        conseils: 'depistage-positif-asymptomatique',
    },
    {
        description: 'Positif et symptômes actuels autres',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_autre: true,
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_asymptomatique',
        statut: 'asymptomatique',
        conseils: 'depistage-positif-asymptomatique',
    },
    {
        description: 'Positif et rien de tout ça',
        profil: {
            depistage: true,
            depistage_resultat: 'positif',
        },
        situation: 'positif_asymptomatique',
        statut: 'asymptomatique',
        conseils: 'depistage-positif-asymptomatique',
    },
    {
        description: 'Négatif et symptômes actuels graves',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_souffle: true,
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_symptomes_actuels_graves',
        statut: 'symptomatique-urgent',
        conseils: 'symptomes-actuels-sans-depistage-critique',
    },
    {
        description: 'Négatif et symptômes actuels',
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
        description: 'Négatif et symptômes passés',
        profil: {
            symptomes_passes: true,
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_symptomes_passes',
        statut: 'peu-de-risques',
        conseils: null,
    },
    {
        description: 'Négatif et symptômes passés + personne fragile',
        profil: {
            symptomes_passes: true,
            depistage: true,
            age: 70,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_symptomes_passes',
        statut: 'personne-fragile',
        conseils: null,
    },
    {
        description: 'Négatif et symptômes passés + foyer fragile',
        profil: {
            symptomes_passes: true,
            depistage: true,
            foyer_fragile: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_symptomes_passes',
        statut: 'foyer-fragile',
        conseils: null,
    },
    {
        description: 'Négatif et contact à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_contact_direct: true,
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_contact_a_risque',
        statut: 'contact-a-risque-avec-test',
        conseils: 'contact-a-risque',
    },
    {
        description: 'Négatif et contact à risque même lieu de vie',
        profil: {
            contact_a_risque: true,
            contact_a_risque_meme_lieu_de_vie: true,
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_contact_a_risque_meme_lieu_de_vie',
        statut: 'contact-a-risque-meme-lieu-de-vie',
        conseils: 'contact-a-risque-meme-lieu-de-vie',
    },
    {
        description: 'Négatif et contact pas vraiment à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_contact_pas_vraiment_a_risque',
        statut: 'peu-de-risques',
        conseils: 'contact-a-risque-autre',
    },
    {
        description: 'Négatif et contact pas vraiment à risque + personne fragile',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: true,
            depistage_resultat: 'negatif',
            age: 70,
        },
        situation: 'negatif_contact_pas_vraiment_a_risque',
        statut: 'personne-fragile',
        conseils: 'contact-a-risque-autre',
    },
    {
        description: 'Négatif et contact pas vraiment à risque + foyer fragile',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: true,
            depistage_resultat: 'negatif',
            foyer_fragile: true,
        },
        situation: 'negatif_contact_pas_vraiment_a_risque',
        statut: 'foyer-fragile',
        conseils: 'contact-a-risque-autre',
    },
    {
        description: 'Négatif et rien de tout ça',
        profil: {
            depistage: true,
            depistage_resultat: 'negatif',
        },
        situation: 'negatif_asymptomatique',
        statut: 'peu-de-risques',
        conseils: null,
    },
    {
        description: 'Négatif et rien de tout ça + personne fragile',
        profil: {
            depistage: true,
            depistage_resultat: 'negatif',
            age: 70,
        },
        situation: 'negatif_asymptomatique',
        statut: 'personne-fragile',
        conseils: null,
    },
    {
        description: 'Négatif et rien de tout ça + foyer fragile',
        profil: {
            depistage: true,
            depistage_resultat: 'negatif',
            foyer_fragile: true,
        },
        situation: 'negatif_asymptomatique',
        statut: 'foyer-fragile',
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
    {
        description: 'En attente et symptômes actuels',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_diarrhee: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        },
        situation: 'en_attente_symptomes_actuels',
        statut: 'symptomatique-en-attente',
        conseils: 'symptomes-actuels-en-attente',
    },
    {
        description: 'En attente et symptômes passés',
        profil: {
            symptomes_passes: true,
            foyer_fragile: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        },
        situation: 'en_attente_symptomes_passes',
        statut: 'symptomatique-en-attente',
        conseils: 'symptomes-passes-en-attente',
    },
    {
        description: 'En attente et contact à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_contact_direct: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        },
        situation: 'en_attente_contact_a_risque',
        statut: 'contact-a-risque-avec-test',
        conseils: 'contact-a-risque',
    },
    {
        description: 'En attente et contact à risque même lieu de vie',
        profil: {
            contact_a_risque: true,
            contact_a_risque_meme_lieu_de_vie: true,
            depistage: true,
            depistage_resultat: 'en_attente',
        },
        situation: 'en_attente_contact_a_risque_meme_lieu_de_vie',
        statut: 'contact-a-risque-meme-lieu-de-vie',
        conseils: 'contact-a-risque-meme-lieu-de-vie',
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
        description: 'En attente et rien de tout ça',
        profil: {
            depistage: true,
            depistage_resultat: 'en_attente',
        },
        situation: 'en_attente_asymptomatique',
        statut: 'en-attente',
        conseils: null,
    },
    {
        description: 'Pas testé et symptômes actuels graves',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_souffle: true,
            depistage: false,
        },
        situation: 'pas_teste_symptomes_actuels_graves',
        statut: 'symptomatique-urgent',
        conseils: 'symptomes-actuels-sans-depistage-critique',
    },
    {
        description: 'Pas testé et symptômes actuels',
        profil: {
            symptomes_actuels: true,
            symptomes_actuels_diarrhee: true,
            depistage: false,
        },
        situation: 'pas_teste_symptomes_actuels',
        statut: 'symptomatique-sans-test',
        conseils: 'symptomes-actuels-sans-depistage',
    },
    {
        description: 'Pas testé et symptômes passés',
        profil: {
            symptomes_passes: true,
            depistage: false,
        },
        situation: 'pas_teste_symptomes_passes',
        statut: 'symptomatique-sans-test',
        conseils: 'symptomes-passes-sans-depistage',
    },
    {
        description: 'Pas testé et contact à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_contact_direct: true,
            depistage: false,
        },
        situation: 'pas_teste_contact_a_risque',
        statut: 'contact-a-risque-sans-test',
        conseils: 'contact-a-risque',
    },
    {
        description: 'Pas testé et contact à risque même lieu de vie',
        profil: {
            contact_a_risque: true,
            contact_a_risque_meme_lieu_de_vie: true,
            depistage: false,
        },
        situation: 'pas_teste_contact_a_risque_meme_lieu_de_vie',
        statut: 'contact-a-risque-meme-lieu-de-vie',
        conseils: 'contact-a-risque-meme-lieu-de-vie-sans-test',
    },
    {
        description: 'Pas testé et contact pas vraiment à risque',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: false,
        },
        situation: 'pas_teste_contact_pas_vraiment_a_risque',
        statut: 'peu-de-risques',
        conseils: 'contact-a-risque-autre',
    },
    {
        description: 'Pas testé et contact pas vraiment à risque + personne fragile',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: false,
            age: 70,
        },
        situation: 'pas_teste_contact_pas_vraiment_a_risque',
        statut: 'personne-fragile',
        conseils: 'contact-a-risque-autre',
    },
    {
        description: 'Pas testé et contact pas vraiment à risque + foyer fragile',
        profil: {
            contact_a_risque: true,
            contact_a_risque_autre: true,
            depistage: false,
            foyer_fragile: true,
        },
        situation: 'pas_teste_contact_pas_vraiment_a_risque',
        statut: 'foyer-fragile',
        conseils: 'contact-a-risque-autre',
    },
    {
        description: 'Pas testé et rien de tout ça',
        profil: {},
        situation: 'pas_teste_asymptomatique',
        statut: 'peu-de-risques',
        conseils: null,
    },
    {
        description: 'Pas testé et rien de tout ça + personne fragile',
        profil: {
            age: 70,
        },
        situation: 'pas_teste_asymptomatique',
        statut: 'personne-fragile',
        conseils: null,
    },
    {
        description: 'Pas testé et rien de tout ça + foyer fragile',
        profil: {
            foyer_fragile: true,
        },
        situation: 'pas_teste_asymptomatique',
        statut: 'foyer-fragile',
        conseils: null,
    },
    {
        description: 'Personne fragile prime sur foyer fragile',
        profil: {
            age: 70,
            foyer_fragile: true,
        },
        situation: 'pas_teste_asymptomatique',
        statut: 'personne-fragile',
        conseils: null,
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
