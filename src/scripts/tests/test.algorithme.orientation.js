import { assert } from 'chai'

import AlgorithmeOrientation from '../algorithme/orientation.js'

import Profil from '../profil.js'

describe('Algorithme d’orientation', function () {
    describe('Statut', function () {
        it('Un profil sans risques affiche le statut par défaut', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'peu-de-risques')
        })

        it('Un profil avec foyer à risque', function () {
            var profil = new Profil('mes_infos', {
                foyer_fragile: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'foyer-fragile')
        })

        it('Un profil avec personne à risque', function () {
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'personne-fragile')
        })

        it('Un profil avec personne à risque + foyer à risque', function () {
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
                foyer_fragile: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'personne-fragile')
        })

        it('Un profil avec des symptômes actuels est symptomatique', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'symptomatique')
        })

        it('Un profil avec des symptômes actuels + dépistage? est symptomatique', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                depistage: true,
                depistage_resultat: 'en_attente',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'symptomatique')
        })

        it('Un profil avec des symptômes actuels + dépistage+ est symptomatique positif', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                depistage: true,
                depistage_resultat: 'positif',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'symptomatique-positif')
        })

        it('Un profil avec des symptômes actuels + dépistage- est symptomatique négatif', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                depistage: true,
                depistage_resultat: 'negatif',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'symptomatique-negatif')
        })

        it('Un profil avec des symptômes actuels et facteurs de gravité majeurs est symptomatique urgent', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_souffle: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'symptomatique-urgent')
        })

        it('Un profil avec des symptômes actuels autres', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'peu-de-risques')
        })

        it('Un profil avec des symptômes passés présente un risque élevé', function () {
            var profil = new Profil('mes_infos', {
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'risque-eleve')
        })

        it('Un profil avec un contact à risque présente un risque élevé', function () {
            var profil = new Profil('mes_infos', {
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'risque-eleve')
        })

        it('Un profil avec un contact à risque mais autre ne présente pas un risque élevé', function () {
            var profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_autre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.strictEqual(algoOrientation.statut, 'peu-de-risques')
        })
    })

    describe('Conseils personnels', function () {
        it('Un profil sans risques n’affiche rien de particulier', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(
                algoOrientation.conseilsPersonnelsBlockNamesToDisplay(),
                []
            )
        })

        it('Un profil avec des symptômes actuels', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite1',
            ])
        })

        it('Un profil avec des symptômes actuels + température inconnue + diarrhée + fatigue + fragile', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: true,
                symptomes_actuels_diarrhee: true,
                symptomes_actuels_fatigue: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite2',
            ])
        })

        it('Un profil avec des symptômes actuels + température inconnue + toux + douleurs + fragile', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_douleurs: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + sans température + toux + odorat + sup65', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: false,
                symptomes_actuels_toux: true,
                symptomes_actuels_odorat: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + sans température + toux + douleurs + sup50', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: false,
                symptomes_actuels_toux: true,
                symptomes_actuels_odorat: true,
                age: 50,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + température + toux + fragile', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_temperature: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + température + toux + fatigue + fragile', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_temperature: true,
                symptomes_actuels_fatigue: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite2',
            ])
        })

        it('Un profil avec des symptômes actuels + sans température + toux + fragile', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_temperature: false,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels majeurs', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_alimentation: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite4',
            ])
        })

        it('Un profil avec des symptômes actuels + un suivi', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_alimentation: true,
                suivi: [{ foo: 'bar' }],
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-suivi',
            ])
        })

        it('Un profil avec des symptômes actuels autres', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(
                algoOrientation.conseilsPersonnelsBlockNamesToDisplay(),
                []
            )
        })

        it('Un profil avec des symptômes passés', function () {
            var profil = new Profil('mes_infos', {
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-passes',
                'conseils-personnels-symptomes-passes-sans-risques',
            ])
        })

        it('Un profil avec des symptômes passés + personne à risque', function () {
            var profil = new Profil('mes_infos', {
                symptomes_passes: true,
                age: 65,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-passes',
                'conseils-personnels-symptomes-passes-avec-risques',
            ])
        })

        it('Un profil avec des symptômes passés + foyer à risque', function () {
            var profil = new Profil('mes_infos', {
                symptomes_passes: true,
                foyer_fragile: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-passes',
                'conseils-personnels-symptomes-passes-avec-risques',
            ])
        })

        it('Un profil avec un contact à risque', function () {
            var profil = new Profil('mes_infos', {
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-contact-a-risque',
                'conseils-personnels-contact-a-risque-default',
                'conseils-contact-a-risque',
            ])
        })

        it('Un profil avec un contact à risque + autre seulement', function () {
            var profil = new Profil('mes_infos', {
                contact_a_risque: true,
                contact_a_risque_autre: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-contact-a-risque',
                'conseils-personnels-contact-a-risque-autre',
                'conseils-contact-a-risque',
            ])
        })
    })

    describe('Vie quotidienne', function () {
        it('Un département à circulation faible', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-departement-circulation-faible',
            ])
        })

        it('Un département à circulation élevée', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 10.1 })
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-departement-circulation-elevee',
            ])
        })

        it('Un département inconnu n’affiche pas la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [])
        })

        it('Un département + symptômes actuels n’affiche pas la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [])
        })

        it('Un département + symptômes passés affiche la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-departement-circulation-faible',
            ])
        })

        it('Un département + contact à risque affiche la localisation', function () {
            var profil = new Profil('mes_infos', {
                departement: '01',
                contact_a_risque: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.vieQuotidienneBlockNamesToDisplay(), [
                'conseils-vie-quotidienne',
                'conseils-departement-circulation-faible',
            ])
        })
    })

    describe('Les tests de dépistage', function () {
        it('Cas général', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [
                'conseils-tests',
            ])
        })
        it('En attente de résultat', function () {
            var profil = new Profil('mes_infos', {
                depistage_resultat: 'en_attente',
            })
            var algoOrientation = new AlgorithmeOrientation(profil, { '01': 9.9 })
            assert.deepEqual(algoOrientation.depistageBlockNamesToDisplay(), [
                'conseils-tests',
                'conseils-tests-resultats',
            ])
        })
    })

    describe('Activité pro', function () {
        it('Aucune activité pro n’affiche rien', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Symptômes actuels n’affiche rien', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Symptômes passés n’affiche rien', function () {
            var profil = new Profil('mes_infos', {
                symptomes_passes: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Contact à risque n’affiche rien', function () {
            var profil = new Profil('mes_infos', {
                contact_a_risque: true,
            })
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
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
                'reponse-activite-pro-personne-fragile',
                'conseils-activite-pro-personne-fragile',
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
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
                'reponse-activite-pro-personne-fragile',
                'conseils-activite-pro-personne-fragile',
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
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
                'reponse-activite-pro-personne-fragile',
                'conseils-activite-pro-personne-fragile',
                'reponse-activite-pro-antecedents',
                'conseils-activite-pro-arret',
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

    describe('Algorithme orientation foyer', function () {
        it('Aucun risque foyer n’affiche rien', function () {
            var profil = new Profil('mes_infos', {})
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [])
        })

        it('Symptômes actuels n’affiche rien', function () {
            var profil = new Profil('mes_infos', {
                symptomes_actuels: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [])
        })

        it('Risque enfant', function () {
            var profil = new Profil('mes_infos', {
                foyer_enfants: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-enfants',
            ])
        })

        it('Risque fragile', function () {
            var profil = new Profil('mes_infos', {
                foyer_fragile: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile',
            ])
        })

        it('Risque enfant ET fragile', function () {
            var profil = new Profil('mes_infos', {
                foyer_enfants: true,
                foyer_fragile: true,
            })
            var algoOrientation = new AlgorithmeOrientation(profil, {})
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-enfants-fragile',
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
            ])
        })
    })
})
