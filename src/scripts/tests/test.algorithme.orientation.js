import { assert } from 'chai'

import AlgorithmeOrientation from '../algorithme/orientation.js'

import Profil from '../profil.js'

describe('Algorithme d’orientation', function () {
    describe('Vie quotidienne', function () {
        it('Un département inconnu n’affiche pas la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {}, {})
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-confinement',
            ])
        })

        it('Un département + symptômes actuels affiche la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(
                profil,
                { '01': 9.9 },
                { '01': false }
            )
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-confinement',
            ])
        })

        it('Un département + symptômes passés affiche la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(
                profil,
                { '01': 9.9 },
                { '01': false }
            )
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-confinement',
            ])
        })

        it('Un département + contact à risque affiche la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(
                profil,
                { '01': 9.9 },
                { '01': false }
            )
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-confinement',
            ])
        })
    })

    describe('Les tests de dépistage', function () {
        it('Cas général', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
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
                symptomes_passes: true,
                age: 70,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
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
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
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
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [])
        })
        it('Négatif', function () {
            var profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'negatif',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [])
        })
    })

    describe('Activité pro', function () {
        it('Aucune activité pro n’affiche rien', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Une activité pro affiche des conseils + pro + infos', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + grossesse affiche des conseils + pro + infos + personne fragile', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                grossesse_3e_trimestre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'reponse-activite-pro-personne-fragile',
                'conseils-activite-pro-personne-fragile',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + 65 ans affiche des conseils + pro + infos + personne fragile', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'reponse-activite-pro-personne-fragile',
                'conseils-activite-pro-personne-fragile',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + antecedents affiche des conseils + pro + infos + personne fragile + arrêt', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                antecedent_cancer: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'reponse-activite-pro-antecedents',
                'conseils-activite-pro-arret',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + foyer fragile affiche des conseils + pro + infos + foyer fragile', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                foyer_fragile: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
                'reponse-activite-pro-foyer-fragile',
                'conseils-activite-pro-foyer-fragile',
            ])
        })

        it('Une activité pro avec sante affiche des conseils + sante', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                activite_pro_sante: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-sante',
            ])
        })

        it('Une activité pro avec libéral affiche des conseils + liberal', function () {
            var profil = new Profil('mes_infos', {
                activite_pro: true,
                activite_pro_liberal: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
                'conseils-activite-pro-liberal',
            ])
        })
    })

    describe('Algorithme orientation foyer (fragile)', function () {
        it('Aucun risque foyer (fragile) n’affiche rien', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [])
        })

        it('Risque foyer (fragile)', function () {
            var profil = new Profil('mes_infos', {
                foyer_fragile: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile',
            ])
        })

        it('Même avec symptômes actuels', function () {
            var profil = new Profil('mes_infos', {
                foyer_fragile: true,
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile',
            ])
        })

        it('Même avec symptômes passés', function () {
            var profil = new Profil('mes_infos', {
                foyer_fragile: true,
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile',
            ])
        })

        it('Même avec contact à risque', function () {
            var profil = new Profil('mes_infos', {
                foyer_fragile: true,
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile',
            ])
        })
    })

    describe('Algorithme orientation foyer (enfants)', function () {
        it('Aucun risque foyer (enfants) n’affiche rien', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.enfantsBlockNamesToDisplay(), [])
        })

        it('Risque foyer (enfant)', function () {
            var profil = new Profil('mes_infos', {
                foyer_enfants: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.enfantsBlockNamesToDisplay(), [
                'conseils-foyer-enfants',
            ])
        })
    })

    describe('L’isolement', function () {
        it('Le bloc isolement ne s’affiche pas par défaut', function () {
            const profil = new Profil('mes_infos', {})
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [])
        })

        it('Le bloc isolement s’affiche avec dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'positif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement-depistage-positif',
                'conseils-isolement',
            ])
        })

        it('Le bloc isolement s’affiche avec dépistage négatif et contact à risque', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'negatif',
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement-contact-a-risque',
                'conseils-isolement',
            ])
        })

        it('Le bloc isolement s’affiche avec dépistage en attente et symptômes', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_type: 'rt-pcr',
                depistage_resultat: 'en_attente',
                symptomes_passes: true,
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement-symptomes',
                'conseils-isolement',
            ])
        })

        it('Le bloc isolement s’affiche sans dépistage et symptômes', function () {
            const profil = new Profil('mes_infos', {
                depistage: false,
                symptomes_passes: true,
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.isolementBlockNamesToDisplay(), [
                'conseils-isolement-symptomes',
                'conseils-isolement',
            ])
        })
    })

    describe('La frise chronologique sur l’isolement', function () {
        it('La frise ne s’affiche pas par défaut', function () {
            const profil = new Profil('mes_infos', {})
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [])
        })

        it('La frise n°1 s’affiche avec symptômes actuels et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                depistage: true,
                depistage_resultat: 'positif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-avec-symptomes',
            ])
        })

        it('La frise n°1 s’affiche avec symptômes passés et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                symptomes_passes: true,
                depistage: true,
                depistage_resultat: 'positif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-avec-symptomes',
            ])
        })

        it('La frise n°1 s’affiche avec symptômes actuels et dépistage en attente', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                depistage: true,
                depistage_resultat: 'en_attente',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-avec-symptomes',
            ])
        })

        it('La frise n°1 s’affiche avec symptômes passés et dépistage en attente', function () {
            const profil = new Profil('mes_infos', {
                symptomes_passes: true,
                depistage: true,
                depistage_resultat: 'en_attente',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-avec-symptomes',
            ])
        })

        it('La frise n°1 s’affiche avec symptômes actuels et sans dépistage', function () {
            const profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                depistage: false,
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-avec-symptomes',
            ])
        })

        it('La frise n°1 s’affiche avec symptômes passés et sans dépistage', function () {
            const profil = new Profil('mes_infos', {
                symptomes_passes: true,
                depistage: false,
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-avec-symptomes',
            ])
        })

        it('La frise n°2 s’affiche avec contact à risque et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_contact_direct: true,
                depistage: true,
                depistage_resultat: 'positif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-sans-symptomes',
            ])
        })

        it('La frise n°2 s’affiche avec contact à risque même lieu de vie et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
                depistage: true,
                depistage_resultat: 'positif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-sans-symptomes',
            ])
        })

        it('La frise n°2 s’affiche avec contact pas vraiment à risque et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_autre: true,
                depistage: true,
                depistage_resultat: 'positif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-sans-symptomes',
            ])
        })

        it('La frise n°2 s’affiche avec rien de tout ça et dépistage positif', function () {
            const profil = new Profil('mes_infos', {
                depistage: true,
                depistage_resultat: 'positif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-sans-symptomes',
            ])
        })

        it('La frise n°3 s’affiche avec contact à risque même lieu de vie et dépistage négatif', function () {
            const profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_meme_lieu_de_vie: true,
                depistage: true,
                depistage_resultat: 'negatif',
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
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
            })
            const algoOrientation = new AlgorithmeOrientation(profil, {})
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
            const algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.timelineBlockNamesToDisplay(), [
                'conseils-timeline-isolement-foyer-malade',
            ])
        })
    })

    describe('Ma santé', function () {
        it('Le bloc santé s’affiche par défaut', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'conseils-sante-general',
                'conseils-sante-grippe',
            ])
        })

        it('Même avec symptômes actuels', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'conseils-sante-general',
                'conseils-sante-grippe',
            ])
        })

        it('Même avec symptômes passés', function () {
            var profil = new Profil('mes_infos', {
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'conseils-sante-general',
                'conseils-sante-grippe',
            ])
        })

        it('Même avec contact à risque', function () {
            var profil = new Profil('mes_infos', {
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'conseils-sante-general',
                'conseils-sante-grippe',
            ])
        })

        it('Risque âge', function () {
            var profil = new Profil('mes_infos', {
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile',
                'conseils-sante-grippe-fragile',
            ])
        })

        it('Risque âge + symptomatique', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_douleurs: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile-symptomatique',
                'conseils-sante-grippe-fragile',
            ])
        })

        it('Risque IMC > 30', function () {
            var profil = new Profil('mes_infos', {
                taille: 150,
                poids: 100,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile',
                'conseils-sante-grippe-fragile',
            ])
        })

        it('Risque grossesse 3e trimestre', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-caracteristiques-a-risques',
                'conseils-sante-personne-fragile',
                'conseils-sante-grippe-fragile',
            ])
        })

        it('Risque cardio', function () {
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-antecedents',
                'conseils-sante-personne-fragile',
                'conseils-sante-maladie-chronique',
                'conseils-sante-grippe-fragile',
            ])
        })

        it('Risque antécédent chronique autre', function () {
            var profil = new Profil('mes_infos', {
                antecedent_chronique_autre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.santeBlockNamesToDisplay(), [
                'conseils-sante',
                'reponse-sante-antecedents',
                'conseils-sante-general',
                'conseils-sante-maladie-chronique',
                'conseils-sante-grippe',
            ])
        })
    })

    describe('Ma grossesse', function () {
        it('Le bloc grossesse ne s’affiche pas par défaut', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [])
        })

        it('Grossesse 3e trimestre', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })

        it('Même avec symptômes actuels', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })

        it('Même avec symptômes passés', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })

        it('Même avec contact à risque', function () {
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.grossesseBlockNamesToDisplay(), [
                'conseils-grossesse',
            ])
        })
    })
})
