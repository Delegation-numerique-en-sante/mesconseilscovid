var assert = require('chai').assert

var AlgorithmeOrientation = require('../algorithme/orientation.js')
    .AlgorithmeOrientation

var Profil = require('../profil.js').Profil
var profil = new Profil('mes_infos')

describe('Algorithme d’orientation', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    describe('Statut', function () {
        it('Un profil sans risques affiche le statut par défaut', function () {
            var data = {}
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'peu-de-risques')
        })

        it('Un profil avec foyer à risque', function () {
            var data = {
                foyer_fragile: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'foyer-fragile')
        })

        it('Un profil avec personne à risque', function () {
            var data = {
                antecedent_cardio: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'personne-fragile')
        })

        it('Un profil avec personne à risque + foyer à risque', function () {
            var data = {
                antecedent_cardio: true,
                foyer_fragile: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'personne-fragile')
        })

        it('Un profil avec des symptômes actuels est symptomatique', function () {
            var data = {
                symptomes_actuels: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'symptomatique')
        })

        it('Un profil avec des symptômes actuels et facteurs de gravité majeurs est symptomatique urgent', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_souffle: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'symptomatique-urgent')
        })

        it('Un profil avec des symptômes actuels autres', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'peu-de-risques')
        })

        it('Un profil avec des symptômes passés présente un risque élevé', function () {
            var data = {
                symptomes_passes: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'risque-eleve')
        })

        it('Un profil avec un contact à risque présente un risque élevé', function () {
            var data = {
                contact_a_risque: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'risque-eleve')
        })

        it('Un profil avec un contact à risque mais autre ne présente pas un risque élevé', function () {
            var data = {
                contact_a_risque: true,
                contact_a_risque_autre: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.strictEqual(algoOrientation.statut, 'peu-de-risques')
        })
    })

    describe('Conseils personnels', function () {
        it('Un profil sans risques n’affiche rien de particulier', function () {
            var data = {}
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.conseilsPersonnelsBlockNamesToDisplay(),
                []
            )
        })

        it('Un profil avec des symptômes actuels', function () {
            var data = {
                symptomes_actuels: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite1',
            ])
        })

        it('Un profil avec des symptômes actuels + température inconnue + diarrhée + fatigue + fragile', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: true,
                symptomes_actuels_diarrhee: true,
                symptomes_actuels_fatigue: true,
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite2',
            ])
        })

        it('Un profil avec des symptômes actuels + température inconnue + toux + douleurs + fragile', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_douleurs: true,
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + sans température + toux + odorat + sup65', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: false,
                symptomes_actuels_toux: true,
                symptomes_actuels_odorat: true,
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + sans température + toux + douleurs + sup50', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_temperature: false,
                symptomes_actuels_temperature_inconnue: false,
                symptomes_actuels_toux: true,
                symptomes_actuels_odorat: true,
                age: 50,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + température + toux + fragile', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_temperature: true,
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels + température + toux + fatigue + fragile', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_temperature: true,
                symptomes_actuels_fatigue: true,
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite2',
            ])
        })

        it('Un profil avec des symptômes actuels + sans température + toux + fragile', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_toux: true,
                symptomes_actuels_temperature: false,
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-caracteristiques',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite3',
            ])
        })

        it('Un profil avec des symptômes actuels majeurs', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_alimentation: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-gravite4',
            ])
        })

        it('Un profil avec des symptômes actuels + un suivi', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_alimentation: true,
                suivi: [{ foo: 'bar' }],
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-actuels',
                'reponse-symptomes-actuels-symptomesactuelsreconnus',
                'conseils-personnels-symptomes-actuels-suivi',
            ])
        })

        it('Un profil avec des symptômes actuels autres', function () {
            var data = {
                symptomes_actuels: true,
                symptomes_actuels_autre: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.conseilsPersonnelsBlockNamesToDisplay(),
                []
            )
        })

        it('Un profil avec des symptômes passés', function () {
            var data = {
                symptomes_passes: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-passes',
                'conseils-personnels-symptomes-passes-sans-risques',
            ])
        })

        it('Un profil avec des symptômes passés + personne à risque', function () {
            var data = {
                symptomes_passes: true,
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-passes',
                'conseils-personnels-symptomes-passes-avec-risques',
            ])
        })

        it('Un profil avec des symptômes passés + foyer à risque', function () {
            var data = {
                symptomes_passes: true,
                foyer_fragile: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-symptomes-passes',
                'conseils-personnels-symptomes-passes-avec-risques',
            ])
        })

        it('Un profil avec un contact à risque', function () {
            var data = {
                contact_a_risque: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-contact-a-risque',
                'conseils-personnels-contact-a-risque-default',
            ])
        })

        it('Un profil avec un contact à risque + autre seulement', function () {
            var data = {
                contact_a_risque: true,
                contact_a_risque_autre: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.conseilsPersonnelsBlockNamesToDisplay(), [
                'conseils-personnels-contact-a-risque',
                'conseils-personnels-contact-a-risque-autre',
            ])
        })
    })

    describe('Activité pro', function () {
        it('Aucune activité pro n’affiche rien', function () {
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Symptômes actuels n’affiche rien', function () {
            var data = {
                symptomes_actuels: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Symptômes passés n’affiche rien', function () {
            var data = {
                symptomes_passes: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Contact à risque n’affiche rien', function () {
            var data = {
                contact_a_risque: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [])
        })

        it('Une activité pro affiche des conseils + pro + infos', function () {
            var data = {
                activite_pro: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro + personne fragile affiche des conseils + pro + infos + arrêt', function () {
            var data = {
                activite_pro: true,
                grossesse_3e_trimestre: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
                'conseils-activite-pro-arret',
            ])
        })

        it('Une activité pro avec public affiche des conseils + public + infos', function () {
            var data = {
                activite_pro: true,
                activite_pro_public: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-public',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro avec sante affiche des conseils + sante', function () {
            var data = {
                activite_pro: true,
                activite_pro_sante: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-sante',
            ])
        })

        it('Une activité pro avec libéral affiche des conseils + liberal', function () {
            var data = {
                activite_pro: true,
                activite_pro_liberal: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-liberal',
                'conseils-activite-pro',
                'conseils-activite-pro-infos',
            ])
        })

        it('Une activité pro avec public et sante affiche des conseils + public + sante', function () {
            var data = {
                activite_pro: true,
                activite_pro_public: true,
                activite_pro_sante: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-public',
                'conseils-activite-pro-sante',
            ])
        })

        it('Une activité pro avec public et sante et libéral affiche des conseils + public + sante + liberal', function () {
            var data = {
                activite_pro: true,
                activite_pro_public: true,
                activite_pro_sante: true,
                activite_pro_liberal: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.activiteProBlockNamesToDisplay(), [
                'conseils-activite',
                'reponse-activite-pro',
                'conseils-activite-pro-liberal',
                'conseils-activite-pro-public',
                'conseils-activite-pro-sante',
            ])
        })
    })

    describe('Algorithme orientation foyer', function () {
        beforeEach(function () {
            profil.resetData()
        })

        afterEach(function () {
            profil.resetData()
        })

        it('Aucun risque foyer n’affiche rien', function () {
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [])
        })

        it('Symptômes actuels n’affiche rien', function () {
            var data = {
                symptomes_actuels: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [])
        })

        it('Symptômes passés affiche suivi', function () {
            var data = {
                symptomes_passes: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile-suivi',
            ])
        })

        it('Contact à risque affiche suivi', function () {
            var data = {
                contact_a_risque: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile-suivi',
            ])
        })

        it('Risque enfant', function () {
            var data = {
                foyer_enfants: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-enfants',
            ])
        })

        it('Risque fragile', function () {
            var data = {
                foyer_fragile: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-fragile',
            ])
        })

        it('Risque enfant ET fragile', function () {
            var data = {
                foyer_enfants: true,
                foyer_fragile: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [
                'conseils-foyer',
                'conseils-foyer-enfants-fragile',
            ])
        })
    })

    describe('Caractéristiques et antécédents', function () {
        it('Aucun antécédent n’affiche rien', function () {
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(algoOrientation.foyerBlockNamesToDisplay(), [])
        })

        it('Symptômes actuels n’affiche rien', function () {
            var data = {
                symptomes_actuels: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                []
            )
        })

        it('Symptômes passés n’affiche rien', function () {
            var data = {
                symptomes_passes: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                []
            )
        })

        it('Contact à risque n’affiche rien', function () {
            var data = {
                contact_a_risque: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                []
            )
        })

        it('Risque âge', function () {
            var data = {
                age: 65,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                [
                    'conseils-caracteristiques',
                    'reponse-caracteristiques-a-risques',
                    'conseils-caracteristiques-antecedents',
                    'conseils-caracteristiques-antecedents-info',
                ]
            )
        })

        it('Risque IMC > 30', function () {
            var data = {
                taille: 150,
                poids: 100,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                [
                    'conseils-caracteristiques',
                    'reponse-caracteristiques-a-risques',
                    'conseils-caracteristiques-antecedents',
                    'conseils-caracteristiques-antecedents-info',
                ]
            )
        })

        it('Risque grossesse 3e trimestre', function () {
            var data = {
                grossesse_3e_trimestre: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                [
                    'conseils-caracteristiques',
                    'reponse-caracteristiques-a-risques',
                    'conseils-caracteristiques-antecedents',
                    'conseils-caracteristiques-antecedents-info',
                    'conseils-caracteristiques-antecedents-femme-enceinte',
                ]
            )
        })

        it('Risque cardio', function () {
            var data = {
                antecedent_cardio: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                [
                    'conseils-caracteristiques',
                    'reponse-antecedents',
                    'conseils-caracteristiques-antecedents',
                    'conseils-caracteristiques-antecedents-info-risque',
                ]
            )
        })

        it('Risque + activité pro', function () {
            var data = {
                antecedent_cardio: true,
                activite_pro: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                [
                    'conseils-caracteristiques',
                    'reponse-antecedents',
                    'conseils-caracteristiques-antecedents-activite-pro',
                    'conseils-caracteristiques-antecedents-info-risque',
                ]
            )
        })

        it('Risque antécédent chronique autre', function () {
            var data = {
                antecedent_chronique_autre: true,
            }
            profil.fillData(data)
            var algoOrientation = new AlgorithmeOrientation(profil)
            assert.deepEqual(
                algoOrientation.caracteristiquesAntecedentsBlockNamesToDisplay(),
                [
                    'conseils-caracteristiques',
                    'reponse-antecedents',
                    'conseils-caracteristiques-antecedents',
                    'conseils-caracteristiques-antecedents-info-risque',
                    'conseils-antecedents-chroniques-autres',
                ]
            )
        })
    })
})
