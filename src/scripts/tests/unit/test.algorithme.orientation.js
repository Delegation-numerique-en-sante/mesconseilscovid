import { assert } from 'chai'

import { joursAvant } from '../../utils'
import AlgorithmeOrientation from '../../algorithme/orientation'
import Profil from '../../profil'

describe('Frise chronologique sur l’isolement', function () {
    describe('Pas de frise', function () {
        it('La frise ne s’affiche pas par défaut', function () {
            const profil = new Profil('mes_infos', {})
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [])
        })

        it('La frise ne s’affiche pas avec symptômes actuels et dépistage en attente', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                depistage: true,
                depistage_resultat: 'en_attente',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [])
        })

        it('La frise ne s’affiche pas avec symptômes passés et dépistage en attente', function () {
            const profil = new Profil('mes_infos', {
                symptomes_passes: true,
                depistage: true,
                depistage_resultat: 'en_attente',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [])
        })

        it('La frise ne s’affiche pas avec symptômes actuels et sans dépistage', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                depistage: false,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [])
        })

        it('La frise ne s’affiche pas avec symptômes passés et sans dépistage', function () {
            const profil = new Profil('mes_infos', {
                symptomes_passes: true,
                depistage: false,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [])
        })
    })

    describe('Frise dynamique n°1 : positif avec symptômes', function () {
        it('La frise n°1 s’affiche avec symptômes actuels et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-avec-symptomes',
            ])
        })

        it('La frise n°1 s’affiche avec symptômes actuels, dépistage positif et vaccination', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
                vaccins: 'completement',
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-avec-symptomes',
            ])
        })

        it('La frise n°1 s’affiche avec symptômes passés et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                symptomes_passes: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-avec-symptomes',
            ])
        })
    })

    describe('Frise dynamique n°2A : positif sans symptômes', function () {
        it('La frise n°2A s’affiche avec contact à risque et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_contact_direct: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })

        it('La frise n°2A s’affiche avec contact à risque même lieu de vie et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })

        it('La frise n°2A s’affiche avec contact pas vraiment à risque et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_autre: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })

        it('La frise n°2A s’affiche avec rien de tout ça et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })
    })

    describe('Frise dynamique n°2B : positif sans symptômes', function () {
        it('La frise n°2B s’affiche avec contact à risque et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_contact_direct: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })

        it('La frise n°2B s’affiche avec contact à risque même lieu de vie et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })

        it('La frise n°2B s’affiche avec contact pas vraiment à risque et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_autre: true,
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })

        it('La frise n°2B s’affiche avec rien de tout ça et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-positif-sans-symptomes',
            ])
        })
    })

    describe('Frise statique n°3 : je vis avec une personne malade', function () {
        it('La frise n°3 s’affiche avec contact à risque même lieu de vie et dépistage négatif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
                depistage: true,
                depistage_resultat: 'negatif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-foyer-malade',
            ])
        })

        it('La frise n°3 s’affiche avec contact à risque même lieu de vie et dépistage en attente', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
                depistage: true,
                depistage_resultat: 'en_attente',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-foyer-malade',
            ])
        })

        it('La frise n°3 s’affiche avec contact à risque même lieu de vie et sans dépistage', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
                depistage: false,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-foyer-malade',
            ])
        })
    })
})

describe('Blocs d’informations additionnels', function () {
    describe('Bloc isolement', function () {
        it('Le bloc isolement ne s’affiche pas par défaut', function () {
            const profil = new Profil('mes_infos', {})
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [])
        })

        it('Le bloc isolement s’affiche avec dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement',
                'conseils-isolement-depistage-positif',
                'conseils-isolement-personne-seule',
            ])
        })

        it('Le bloc isolement vacciné s’affiche avec dépistage positif et vaccination', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
                vaccins: 'completement',
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement',
                'conseils-isolement-depistage-positif-vaccine',
                'conseils-isolement-personne-seule',
            ])
        })

        it('Le bloc isolement ne s’affiche pas si contact à risque', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'negatif',
                _depistage_start_date: new Date().toJSON(),
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [])
        })

        it('Le bloc isolement s’affiche avec dépistage en attente et symptômes', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'en_attente',
                _depistage_start_date: new Date().toJSON(),
                symptomes_passes: true,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement',
                'conseils-isolement-personne-seule',
            ])
        })

        it('Le bloc isolement vacciné s’affiche avec dépistage en attente et symptômes et vaccination', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'en_attente',
                _depistage_start_date: new Date().toJSON(),
                symptomes_passes: true,
                vaccins: 'completement',
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement',
                'conseils-isolement-personne-seule',
            ])
        })

        it('Le bloc isolement s’affiche sans dépistage et symptômes', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_passes: true,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement',
                'conseils-isolement-personne-seule',
            ])
        })

        it('Le bloc isolement s’affiche si je ne suis pas seule', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_passes: true,
                foyer_autres_personnes: true,
            })
            const algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement',
                'conseils-isolement-autres-personnes',
            ])
        })
    })

    describe('Bloc tests de dépistage', function () {
        it('Cas général', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [
                'conseils-tests',
                'conseils-tests-general',
            ])
        })
        it('Cas particulier antigénique faux négatif', function () {
            var profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'antigenique',
                depistage_resultat: 'negatif',
                _depistage_start_date: new Date().toJSON(),
                symptomes_passes: true,
                age: 70,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [
                'conseils-tests',
                'conseils-tests-rt-pcr',
            ])
        })
        it('En attente de résultat', function () {
            var profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'en_attente',
                _depistage_start_date: new Date().toJSON(),
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [
                'conseils-tests',
                'conseils-tests-resultats',
            ])
        })
        it('Positif', function () {
            var profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
                _depistage_start_date: new Date().toJSON(),
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [])
        })
        it('Négatif', function () {
            var profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'negatif',
                _depistage_start_date: new Date().toJSON(),
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [])
        })
    })

    describe('Bloc vaccins', function () {
        it('Cas général (pas encore vacciné, sans historique)', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-sans',
                'conseils-vaccins-pas-encore-vaccine',
            ])
        })

        it('Cas général (pas encore vacciné, avec historique 6 mois+)', function () {
            var profil = new Profil('mes_infos', {
                covid_passee: true,
            })
            profil.covid_passee_date = joursAvant(30 * 7)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-6-mois-plus',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-6-mois-plus',
            ])
        })

        it('Cas général (pas encore vacciné, avec historique 2-6 mois)', function () {
            var profil = new Profil('mes_infos', {
                covid_passee: true,
            })
            profil.covid_passee_date = joursAvant(30 * 4)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-2-6-mois',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-2-6-mois',
            ])
        })

        it('Cas général (pas encore vacciné, avec historique 2 mois -)', function () {
            var profil = new Profil('mes_infos', {
                covid_passee: true,
            })
            profil.covid_passee_date = joursAvant(30 * 1)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-2-mois-moins',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-2-mois-moins',
            ])
        })

        it('Cas général (déjà vacciné)', function () {
            var profil = new Profil('mes_infos', { vaccins: 'completement' })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-completement',
                'conseils-vaccins-deja-vaccine',
            ])
        })

        it('Cas 12 à 18 ans', function () {
            var profil = new Profil('mes_infos', {
                age: 12,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-sans',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-12-ans',
            ])
        })

        it('Cas 12 à 18 ans à risque (comorbidité)', function () {
            var profil = new Profil('mes_infos', {
                age: 12,
                antecedent_cardio: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-sans',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-12-ans',
                'conseils-vaccins-a-risque',
            ])
        })

        it('Cas ≥ 18 ans', function () {
            var profil = new Profil('mes_infos', {
                age: 18,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-sans',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-18-ans',
            ])
        })

        it('Cas ≥ 18 ans (professionnel de santé)', function () {
            var profil = new Profil('mes_infos', {
                age: 18,
                activite_pro: true,
                activite_pro_sante: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-sans',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-obligation-pro-sante',
                'conseils-vaccins-18-ans',
            ])
        })

        it('Cas ≥ 18 ans à risque (comorbidité)', function () {
            var profil = new Profil('mes_infos', {
                age: 18,
                antecedent_cardio: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-sans',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-18-ans',
                'conseils-vaccins-a-risque',
            ])
        })

        it('Cas ≥ 18 ans très haut risque', function () {
            var profil = new Profil('mes_infos', {
                age: 18,
                antecedent_greffe: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.vaccinBlockNamesToDisplay(), [
                'reponse-vaccins-pas-encore',
                'reponse-historique-sans',
                'conseils-vaccins-pas-encore-vaccine',
                'conseils-vaccins-18-ans',
                'conseils-vaccins-tres-haut-risque',
            ])
        })
    })

    describe('Bloc mesures barrières et le masque', function () {
        // rien pour l’instant
    })

    describe('Bloc Covid', function () {
        // rien pour l’instant
    })

    describe('Bloc grossesse', function () {
        it('Le bloc grossesse ne s’affiche pas par défaut', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [])
        })

        it('Grossesse 3e trimestre', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })

        it('Même avec symptômes actuels', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })

        it('Même avec symptômes passés', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })

        it('Même avec contact à risque', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })
    })

    describe('Bloc santé', function () {
        it('Le bloc santé ne s’affiche pas par défaut', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [])
        })

        it('Même avec symptômes actuels', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [])
        })

        it('Même avec symptômes passés', function () {
            var profil = new Profil('mes_infos', {
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [])
        })

        it('Même avec contact à risque', function () {
            var profil = new Profil('mes_infos', {
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [])
        })

        it('Risque âge', function () {
            var profil = new Profil('mes_infos', {
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile',
            ])
        })

        it('Risque âge + symptomatique', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile-symptomatique',
            ])
        })

        it('Risque IMC > 30', function () {
            var profil = new Profil('mes_infos', {
                taille: 150,
                poids: 100,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile',
            ])
        })

        it('Risque grossesse 3e trimestre', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile',
            ])
        })

        it('Risque cardio', function () {
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-antecedents',
                'conseils-sante-personne-fragile',
            ])
        })

        it('Risque antécédent chronique autre', function () {
            var profil = new Profil('mes_infos', {
                antecedent_chronique_autre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [])
        })
    })

    describe('Bloc enfants', function () {
        it('Aucun risque foyer (enfants) n’affiche rien', function () {
            var profil = new Profil('mes_infos', {
                age: 20,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.enfantsBlockNamesToDisplay(), [])
        })

        it('Risque foyer (enfant)', function () {
            var profil = new Profil('mes_infos', {
                foyer_enfants: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.enfantsBlockNamesToDisplay(), [
                'reponse-foyer-enfants',
                'conseils-foyer-enfants',
            ])
        })

        it('Pour un enfant de moins de 15 ans', function () {
            var profil = new Profil('mes_infos', {
                age: 14,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.enfantsBlockNamesToDisplay(), [
                'reponse-enfants-inf-15',
                'conseils-foyer-enfants',
            ])
        })
    })

    describe('Bloc activité pro', function () {
        it('Aucune activité pro n’affiche rien', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Une activité pro affiche des conseils + pro + infos', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + grossesse affiche des conseils + pro + infos', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                grossesse_3e_trimestre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + 65 ans affiche des conseils + pro + infos', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + antecedents affiche des conseils + pro + infos + arrêt', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                antecedent_cancer: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'reponse-activite-pro-antecedents',
                'conseils-activite-pro-arret',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro avec sante affiche des conseils + sante', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                activite_pro_sante: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-sante',
            ])
        })

        it('Une activité pro avec symptômes sans test affiche lien arrêt de travail', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                symptomes_actuels: true,
                symptomes_actuels_temperature: true,
                depistage: false,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-arret-de-travail-isolement',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro avec symptômes en attente de résultat affiche lien arrêt de travail', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                symptomes_actuels: true,
                symptomes_actuels_temperature: true,
                depistage: true,
                depistage_resultat: 'en_attente',
                _depistage_start_date: new Date().toJSON(),
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-arret-de-travail-isolement',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro avec alerte TAC affiche infos téléprocédure arrêt de travail', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                contact_a_risque_stop_covid: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-arret-de-travail-tac',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
            ])
        })
    })
})

describe('Paxlovid', function () {
    it('Éligible si immunodéprimé', function () {
        var profil = new Profil('mes_infos', {
            age: 18,
            antecedent_immunodep: true,
        })
        profil.symptomes_start_date = joursAvant(4)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isTrue(algoOrientation.eligibleAuPaxlovid)
    })
    it('Éligible si obésité morbide', function () {
        var profil = new Profil('mes_infos', {
            age: 18,
            taille: 160,
            poids: 110,
        })
        profil.symptomes_start_date = joursAvant(4)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isTrue(algoOrientation.eligibleAuPaxlovid)
    })
    it('Éligible si trisomie', function () {
        var profil = new Profil('mes_infos', {
            age: 18,
            antecedent_trisomie: true,
        })
        profil.symptomes_start_date = joursAvant(4)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isTrue(algoOrientation.eligibleAuPaxlovid)
    })
    it('Éligible si autre maladie chronique', function () {
        var profil = new Profil('mes_infos', {
            age: 18,
            antecedent_chronique_autre: true,
        })
        profil.symptomes_start_date = joursAvant(4)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isTrue(algoOrientation.eligibleAuPaxlovid)
    })
    it('Éligible si plus de 65 ans et comorbidité', function () {
        var profil = new Profil('mes_infos', {
            age: 65,
            antecedent_diabete: true,
        })
        profil.symptomes_start_date = joursAvant(4)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isTrue(algoOrientation.eligibleAuPaxlovid)
    })
    it('Pas éligible si moins de 65 ans et comorbidité', function () {
        var profil = new Profil('mes_infos', {
            age: 64,
            antecedent_diabete: true,
        })
        profil.symptomes_start_date = joursAvant(4)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isFalse(algoOrientation.eligibleAuPaxlovid)
    })
    it('Pas éligible si mineur', function () {
        var profil = new Profil('mes_infos', {
            age: 17,
            antecedent_immunodep: true,
        })
        profil.symptomes_start_date = joursAvant(4)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isFalse(algoOrientation.eligibleAuPaxlovid)
    })
    it('Pas éligible si symptômes depuis plus de 5 jours', function () {
        var profil = new Profil('mes_infos', {
            age: 18,
            antecedent_immunodep: true,
        })
        profil.symptomes_start_date = joursAvant(5)
        var algoOrientation = new AlgorithmeOrientation(profil)
        assert.isFalse(algoOrientation.eligibleAuPaxlovid)
    })
})
