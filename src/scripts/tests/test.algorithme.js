var chai = require('chai')

var Algorithme = require('../algorithme.js').Algorithme

var Profil = require('../profil.js')
var profil = new Profil()

describe('Algorithme statut', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Un profil sans risques affiche le statut par défaut', function () {
        var data = {}
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('peu-de-risques')
    })

    it('Un profil avec foyer à risque', function () {
        var data = {
            foyer_fragile: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('foyer-fragile')
    })

    it('Un profil avec personne à risque', function () {
        var data = {
            antecedent_cardio: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('personne-fragile')
    })

    it('Un profil avec personne à risque + foyer à risque', function () {
        var data = {
            antecedent_cardio: true,
            foyer_fragile: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('personne-fragile')
    })

    it('Un profil avec des symptômes actuels est symptomatique', function () {
        var data = {
            symptomes_actuels: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('symptomatique')
    })

    it('Un profil avec des symptômes actuels et facteurs de gravité majeurs est symptomatique urgent', function () {
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_souffle: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('symptomatique-urgent')
    })

    it('Un profil avec des symptômes actuels autres', function () {
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_autre: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('peu-de-risques')
    })

    it('Un profil avec des symptômes passés présente un risque élevé', function () {
        var data = {
            symptomes_passes: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('risque-eleve')
    })

    it('Un profil avec un contact à risque présente un risque élevé', function () {
        var data = {
            contact_a_risque: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('risque-eleve')
    })

    it('Un profil avec un contact à risque mais autre ne présente pas un risque élevé', function () {
        var data = {
            contact_a_risque: true,
            contact_a_risque_autre: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.statut).to.equal('peu-de-risques')
    })
})

describe('Algorithme conseils personnels', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Un profil sans risques n’affiche rien de particulier', function () {
        var data = {}
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal(
            []
        )
    })

    it('Un profil avec des symptômes actuels', function () {
        var data = {
            symptomes_actuels: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
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
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
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
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
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
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
            'conseils-personnels-symptomes-actuels-gravite3',
        ])
    })

    it('Un profil avec des symptômes actuels + température + toux + fragile', function () {
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_toux: true,
            symptomes_actuels_temperature: true,
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
            'conseils-personnels-symptomes-actuels-gravite3',
        ])
    })

    it('Un profil avec des symptômes actuels + température + toux + fatigue + fragile', function () {
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_toux: true,
            symptomes_actuels_temperature: true,
            symptomes_actuels_fatigue: true,
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
            'conseils-personnels-symptomes-actuels-gravite2',
        ])
    })

    it('Un profil avec des symptômes actuels + sans température + toux + fragile', function () {
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_toux: true,
            symptomes_actuels_temperature: false,
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
            'conseils-personnels-symptomes-actuels-gravite3',
        ])
    })

    it('Un profil avec des symptômes actuels majeurs', function () {
        var data = {
            symptomes_actuels: true,
            symptomes_actuels_alimentation: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-actuels',
            'conseils-personnels-symptomes-actuels-gravite4',
        ])
    })

    it('Un profil avec des symptômes passés', function () {
        var data = {
            symptomes_passes: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-passes',
            'conseils-personnels-symptomes-passes-sans-risques',
        ])
    })

    it('Un profil avec des symptômes passés + personne à risque', function () {
        var data = {
            symptomes_passes: true,
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
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
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-symptomes-passes',
            'conseils-personnels-symptomes-passes-avec-risques',
        ])
    })

    it('Un profil avec un contact à risque', function () {
        var data = {
            contact_a_risque: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
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
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.conseilsPersonnelsBlockNamesToDisplay()).to.deep.equal([
            'conseils-personnels-contact-a-risque',
            'conseils-personnels-contact-a-risque-autre',
        ])
    })
})

describe('Algorithme département', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Un département vert affiche le bloc vert', function () {
        var data = {
            departement: '01',
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.departementBlockNamesToDisplay()).to.deep.equal([
            'conseils-departement',
            'conseils-departement-vert',
        ])
    })

    it('Un département orange affiche le bloc orange', function () {
        var data = {
            departement: '75',
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.departementBlockNamesToDisplay()).to.deep.equal([
            'conseils-departement',
            'conseils-departement-orange',
        ])
    })

    it('Un département inconnu n’affiche pas de bloc couleur', function () {
        var data = {
            departement: '977',
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.departementBlockNamesToDisplay()).to.deep.equal([
            'conseils-departement',
        ])
    })

    it('Un département + symptômes actuels n’affiche pas la localisation', function () {
        var data = {
            departement: '01',
            symptomes_actuels: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.departementBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Un département + symptômes passés affiche la localisation', function () {
        var data = {
            departement: '01',
            symptomes_passes: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.departementBlockNamesToDisplay()).to.deep.equal([
            'conseils-departement',
            'conseils-departement-vert',
        ])
    })

    it('Un département + contact à risque affiche la localisation', function () {
        var data = {
            departement: '01',
            contact_a_risque: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.departementBlockNamesToDisplay()).to.deep.equal([
            'conseils-departement',
            'conseils-departement-vert',
        ])
    })
})

describe('Algorithme activité pro', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Aucune activité pro n’affiche rien', function () {
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Symptômes actuels n’affiche rien', function () {
        var data = {
            symptomes_actuels: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Symptômes passés n’affiche rien', function () {
        var data = {
            symptomes_passes: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Contact à risque n’affiche rien', function () {
        var data = {
            contact_a_risque: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Une activité pro affiche des conseils + pro + infos', function () {
        var data = {
            activite_pro: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro',
            'conseils-activite-pro',
            'conseils-activite-pro-infos',
        ])
    })

    it('Une activité pro avec public affiche des conseils + public + infos', function () {
        var data = {
            activite_pro: true,
            activite_pro_public: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro-public',
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
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro-sante',
            'conseils-activite-pro-sante',
        ])
    })

    it('Une activité pro avec public et sante affiche des conseils + public + sante', function () {
        var data = {
            activite_pro: true,
            activite_pro_public: true,
            activite_pro_sante: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.activiteProBlockNamesToDisplay()).to.deep.equal([
            'conseils-activite',
            'reponse-activite-pro-public-sante',
            'conseils-activite-pro-public',
            'conseils-activite-pro-sante',
        ])
    })
})

describe('Algorithme foyer', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Aucun risque foyer n’affiche rien', function () {
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Symptômes actuels n’affiche rien', function () {
        var data = {
            symptomes_actuels: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Symptômes passés affiche suivi', function () {
        var data = {
            symptomes_passes: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([
            'conseils-foyer',
            'conseils-foyer-fragile-suivi',
        ])
    })

    it('Contact à risque affiche suivi', function () {
        var data = {
            contact_a_risque: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([
            'conseils-foyer',
            'conseils-foyer-fragile-suivi',
        ])
    })

    it('Risque enfant', function () {
        var data = {
            foyer_enfants: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([
            'conseils-foyer',
            'conseils-foyer-enfants',
        ])
    })

    it('Risque fragile', function () {
        var data = {
            foyer_fragile: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([
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
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([
            'conseils-foyer',
            'conseils-foyer-enfants-fragile',
        ])
    })
})

describe('Algorithme caractéristiques et antécédents', function () {
    beforeEach(function () {
        profil.resetData()
    })

    afterEach(function () {
        profil.resetData()
    })

    it('Aucun antécédent n’affiche rien', function () {
        var algorithme = new Algorithme(profil)
        chai.expect(algorithme.foyerBlockNamesToDisplay()).to.deep.equal([])
    })

    it('Symptômes actuels n’affiche rien', function () {
        var data = {
            symptomes_actuels: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([])
    })

    it('Symptômes passés n’affiche rien', function () {
        var data = {
            symptomes_passes: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([])
    })

    it('Contact à risque n’affiche rien', function () {
        var data = {
            contact_a_risque: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([])
    })

    it('Risque âge', function () {
        var data = {
            sup65: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([
            'conseils-caracteristiques',
            'reponse-caracteristiques',
            'conseils-caracteristiques-antecedents',
            'conseils-caracteristiques-antecedents-info',
        ])
    })

    it('Risque IMC > 30', function () {
        var data = {
            taille: 150,
            poids: 100,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([
            'conseils-caracteristiques',
            'reponse-caracteristiques',
            'conseils-caracteristiques-antecedents',
            'conseils-caracteristiques-antecedents-info',
        ])
    })

    it('Risque grossesse 3e trimestre', function () {
        var data = {
            grossesse_3e_trimestre: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([
            'conseils-caracteristiques',
            'reponse-caracteristiques',
            'conseils-caracteristiques-antecedents',
            'conseils-caracteristiques-antecedents-info',
        ])
    })

    it('Risque cardio', function () {
        var data = {
            antecedent_cardio: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([
            'conseils-caracteristiques',
            'reponse-antecedents',
            'conseils-caracteristiques-antecedents',
            'conseils-caracteristiques-antecedents-info-risque',
        ])
    })

    it('Risque + activité pro', function () {
        var data = {
            antecedent_cardio: true,
            activite_pro: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([
            'conseils-caracteristiques',
            'reponse-antecedents',
            'conseils-caracteristiques-antecedents-activite-pro',
            'conseils-caracteristiques-antecedents-info-risque',
        ])
    })

    it('Risque antécédent chronique autre', function () {
        var data = {
            antecedent_chronique_autre: true,
        }
        profil.fillData(data)
        var algorithme = new Algorithme(profil)
        chai.expect(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay()
        ).to.deep.equal([
            'conseils-caracteristiques',
            'reponse-antecedents',
            'conseils-caracteristiques-antecedents',
            'conseils-caracteristiques-antecedents-info-risque',
            'conseils-antecedents-chroniques-autres',
        ])
    })
})
