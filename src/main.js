// Rétro-compatibilité de l'élément <template> pour IE.
;(function () {
    // Voir https://github.com/jeffcarp/template-polyfill (Licence MIT)
    if ('content' in document.createElement('template')) {
        return false
    }

    var templates = document.getElementsByTagName('template')
    var plateLen = templates.length

    for (var x = 0; x < plateLen; ++x) {
        var template = templates[x]
        var content = template.childNodes
        var fragment = document.createDocumentFragment()

        while (content[0]) {
            fragment.appendChild(content[0])
        }

        template.content = fragment
    }
})()

// Données privées, stockées uniquement en local
var StockageLocal = function () {
    this.supprimer = function () {
        localforage
            .dropInstance()
            .then(function () {
                console.debug('Les données personnelles ont été supprimées')
            })
            .catch(function (error) {
                console.error(
                    'Erreur lors de la suppression des données personnelles ' + error
                )
            })
    }

    this.charger = function (questionnaire) {
        return localforage.getItem('mes_infos').then(
            function (data) {
                if (data !== null) {
                    console.debug('Données locales:')
                    console.table(data)
                    questionnaire.fillData(data)
                } else {
                    console.debug('Pas de données locales pour l’instant')
                }
            },
            function (error) {
                console.error('Erreur de chargement des données locales ' + error)
            }
        )
    }

    this.enregistrer = function (questionnaire) {
        return localforage
            .setItem('mes_infos', questionnaire.getData())
            .then(function (data) {
                console.debug('Les réponses au questionnaire ont bien été enregistrées')
                console.debug(data)
            })
            .catch(function (error) {
                console.error(
                    'Les réponses au questionnaire n’ont pas pu être enregistrées'
                )
                console.error(error)
            })
    }
}
var stockageLocal = new StockageLocal()

// Carte des départements (vert / rouge)
var CarteDepartements = function () {
    this.dateMiseAJour = '2020-05-07'
    this._couleurs = {
        '01': 'vert',
        '02': 'rouge',
        '03': 'vert',
        '04': 'vert',
        '05': 'vert',
        '06': 'vert',
        '07': 'vert',
        '08': 'rouge',
        '09': 'vert',
        '10': 'rouge',
        '11': 'vert',
        '12': 'vert',
        '13': 'vert',
        '14': 'vert',
        '15': 'vert',
        '16': 'vert',
        '17': 'vert',
        '18': 'vert',
        '19': 'vert',
        '21': 'rouge',
        '22': 'vert',
        '23': 'vert',
        '24': 'vert',
        '25': 'rouge',
        '26': 'vert',
        '27': 'vert',
        '28': 'vert',
        '29': 'vert',
        '2A': 'vert',
        '2B': 'vert',
        '30': 'vert',
        '31': 'vert',
        '32': 'vert',
        '33': 'vert',
        '34': 'vert',
        '35': 'vert',
        '36': 'vert',
        '37': 'vert',
        '38': 'vert',
        '39': 'rouge',
        '40': 'vert',
        '41': 'vert',
        '42': 'vert',
        '43': 'vert',
        '44': 'vert',
        '45': 'vert',
        '46': 'vert',
        '47': 'vert',
        '48': 'vert',
        '49': 'vert',
        '50': 'vert',
        '51': 'rouge',
        '52': 'rouge',
        '53': 'vert',
        '54': 'rouge',
        '55': 'rouge',
        '56': 'vert',
        '57': 'rouge',
        '58': 'rouge',
        '59': 'rouge',
        '60': 'rouge',
        '61': 'vert',
        '62': 'rouge',
        '63': 'vert',
        '64': 'vert',
        '65': 'vert',
        '66': 'vert',
        '67': 'rouge',
        '68': 'rouge',
        '69': 'vert',
        '70': 'rouge',
        '71': 'rouge',
        '72': 'vert',
        '73': 'vert',
        '74': 'vert',
        '75': 'rouge',
        '76': 'vert',
        '77': 'rouge',
        '78': 'rouge',
        '79': 'vert',
        '80': 'rouge',
        '81': 'vert',
        '82': 'vert',
        '83': 'vert',
        '84': 'vert',
        '85': 'vert',
        '86': 'vert',
        '87': 'vert',
        '88': 'rouge',
        '89': 'rouge',
        '90': 'rouge',
        '91': 'rouge',
        '92': 'rouge',
        '93': 'rouge',
        '94': 'rouge',
        '95': 'rouge',
        '971': 'vert',
        '972': 'vert',
        '973': 'vert',
        '974': 'vert',
        '976': 'rouge',
    }
    this.couleur = function (departement) {
        return this._couleurs[departement]
    }
    this._liens_prefectures = {
        '01': 'http://www.ain.gouv.fr/strategie-locale-de-deconfinement-a6156.html',
        '02': 'http://www.aisne.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '03': 'http://www.allier.gouv.fr/strategie-locale-de-deconfinement-a2967.html',
        '04':
            'http://www.alpes-de-haute-provence.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '05':
            'http://www.hautes-alpes.gouv.fr/strategie-locale-de-deconfinement-a7932.html',
        '06':
            'http://www.alpes-maritimes.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '07': 'http://www.ardeche.gouv.fr/strategie-locale-de-deconfinement-a9810.html',
        '08':
            'http://www.ardennes.gouv.fr/strategie-locale-de-deconfinement-a3016.html',
        '09': 'http://www.ariege.gouv.fr/Actualites/Plan-de-deconfinement',
        '10': 'https://www.aube.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '11': 'http://www.aude.gouv.fr/strategie-locale-de-deconfinement-a11212.html',
        '12': 'http://www.aveyron.gouv.fr/strategie-locale-de-deconfinement-a7183.html',
        '13':
            'http://www.bouches-du-rhone.gouv.fr/Actualites/A-la-Une/Actualites-COVID-19/Covid-19-Strategie-locale-de-deconfinement',
        '14':
            'http://www.calvados.gouv.fr/strategie-locale-de-deconfinement-r1962.html',
        '15': 'http://www.cantal.gouv.fr/strategie-locale-de-deconfinement-a6525.html',
        '16': 'http://www.charente.gouv.fr/deconfinement',
        '17':
            'http://www.charente-maritime.gouv.fr/Politiques-publiques/Securite/Securite-sanitaire/COVID19-Strategie-locale-de-deconfinement',
        '18': 'http://www.cher.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '19':
            'http://www.correze.gouv.fr/Politiques-publiques/Sante/Strategie-locale-de-deconfinement',
        '21':
            'http://www.cote-dor.gouv.fr/strategie-locale-de-deconfinement-a8876.html',
        '22':
            'http://www.cotes-darmor.gouv.fr/Politiques-publiques/Sante/Covid-19/Mesures-pour-le-deconfinement',
        '23':
            'http://www.creuse.gouv.fr/Actualites/Covid-19/Strategie-locale-de-deconfinement',
        '24':
            'http://www.dordogne.gouv.fr/Politiques-publiques/Sante-solidarite-et-cohesion-sociale/Informations-coronavirus-COVID19/COVID-19-Strategie-locale-de-deconfinement',
        '25':
            'http://www.doubs.gouv.fr/Actualites/Actualites-2020/COVID19-Strategie-locale-de-deconfinement',
        '26':
            'http://www.drome.gouv.fr/strategie-locale-de-deconfinement-en-drome-a7414.html',
        '27':
            'http://www.eure.gouv.fr/Politiques-publiques/Sante/Coronavirus-COVID-19/Strategie-locale-de-deconfinement',
        '28':
            'http://www.eure-et-loir.gouv.fr/Actualites/Annee-2020/INFORMATIONS-CORONAVIRUS-COVID-19/Strategie-nationale-et-locale-du-plan-de-deconfinement/Strategie-locale-de-deconfinement',
        '29':
            'http://www.finistere.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '2A':
            'http://www.corse-du-sud.gouv.fr/strategie-locale-de-deconfinement-a2375.html',
        '2B':
            'http://www.haute-corse.gouv.fr/strategie-locale-de-deconfinement-a3331.html',
        '30': 'http://www.gard.gouv.fr/Actualites/Strategie-de-deconfinement',
        '31': 'http://www.haute-garonne.gouv.fr/Deconfinement',
        '32':
            'http://www.gers.gouv.fr/Actualites/Dossiers-d-actualite/COVID-19-Deconfinement',
        '33':
            'http://www.gironde.gouv.fr/Actualites/Breves/Strategie-locale-de-deconfinement.',
        '34':
            'http://www.herault.gouv.fr/Actualites/INFOS/Covid19-Strategie-locale-de-deconfinement',
        '35': 'http://www.ille-et-vilaine.gouv.fr/deconfinement',
        '36':
            'http://www.indre.gouv.fr/Politiques-publiques/Securite-et-protection-de-la-population/COVID-19/Strategie-locale-de-deconfinement',
        '37':
            'http://www.indre-et-loire.gouv.fr/Actualites/COVID-19-Strategie-locale-de-deconfinement',
        '38':
            'http://www.isere.gouv.fr/Politiques-publiques/Risques/Risques-sanitaires/Covid-19/Strategie-locale-de-deconfinement',
        '39':
            'http://www.jura.gouv.fr/Actualites/Breves/Strategie-locale-de-deconfinement',
        '40': 'http://www.landes.gouv.fr/strategie-locale-de-deconfinement-a5921.html',
        '41':
            'http://www.loir-et-cher.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '42':
            'http://www.loire.gouv.fr/coronavirus-covid19-strategie-de-deconfinement-a7474.html',
        '43':
            'http://www.haute-loire.gouv.fr/covid-19-strategie-de-deconfinement-a3212.html',
        '44':
            'http://www.loire-atlantique.gouv.fr/Actualites/COVID-19-Point-sur-la-situation-en-Loire-Atlantique/Covid-19-strategie-locale-de-deconfinement',
        '45': 'http://www.loiret.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '46': 'http://www.lot.gouv.fr/strategie-locale-de-deconfinement-a12917.html',
        '47':
            'http://www.lot-et-garonne.gouv.fr/strategie-locale-de-deconfinement-a6330.html',
        '48':
            'http://www.lozere.gouv.fr/Actualites/Actualites-des-services/2020/Mai/Strategie-locale-de-deconfinement',
        '49':
            'http://www.maine-et-loire.gouv.fr/coronavirus-covid-19-strategie-de-deconfinement-a6929.html',
        '50':
            'http://www.manche.gouv.fr/Politiques-publiques/Sante/Coronavirus-COVID-19/Strategie-locale-de-deconfinement',
        '51':
            'http://www.marne.gouv.fr/Actualites/Infos/Coronavirus-COVID-19/Strategie-locale-du-plan-de-deconfinement',
        '52':
            'http://www.haute-marne.gouv.fr/Politiques-publiques/Securite/Securite-sanitaire/Strategie-locale-de-deconfinement',
        '53':
            'http://www.mayenne.gouv.fr/Politiques-publiques/Sante/Coronavirus-COVID-19-Informations-recommandations-et-mesures-sanitaires/Strategie-de-deconfinement/Strategie-de-deconfinement',
        '54':
            'http://www.meurthe-et-moselle.gouv.fr/Politiques-publiques/Securite-et-protection-de-la-population/Coronavirus-COVID-19/Strategie-locale-de-deconfinement/Strategie-locale-de-deconfinement',
        '55':
            'http://www.meuse.gouv.fr/Actualites/Mesures-relatives-a-la-lutte-contre-le-virus-Covid-19/Strategie-locale-de-deconfinement',
        '56':
            'http://www.morbihan.gouv.fr/Actualites/Actus/Le-Morbihan-face-au-Coronavirus-Covid19/Deconfinement/Strategie-locale-de-deconfinement',
        '57':
            'http://www.seine-et-marne.gouv.fr/Actualites/Actualite-du-prefet/Presentation-des-grands-axes-du-plan-de-deconfinement-a-compter-du-11-mai-2020',
        '58': 'http://www.nievre.gouv.fr/strategie-locale-de-deconfinement-a4734.html',
        '59':
            'http://www.nord.gouv.fr/Actualites/Actualites/Covid-19-Strategie-locale-de-deconfinement',
        '60':
            'http://www.oise.gouv.fr/Actualites/Coronavirus-mesures-applicables-dans-le-departement-de-l-Oise',
        '61':
            'http://www.orne.gouv.fr/point-de-situation-de-la-semaine-en-cours-a10153.html',
        '62':
            'http://www.pas-de-calais.gouv.fr/Actualites/Actualites/Strategie-locale-de-deconfinement',
        '63':
            'http://www.puy-de-dome.gouv.fr/strategie-locale-de-deconfinement-a8240.html',
        '64':
            'http://www.pyrenees-atlantiques.gouv.fr/Politiques-publiques/Securite/Gestion-de-crise/COVID-19-Strategie-de-deconfinement',
        '65':
            'http://www.hautes-pyrenees.gouv.fr/strategie-locale-de-deconfinement-a5451.html',
        '66':
            'http://www.pyrenees-orientales.gouv.fr/Actualites/Coronavirus-Covid-19/Strategie-locale-de-deconfinement-dans-les-Pyrenees-Orientales',
        '67':
            'http://www.bas-rhin.gouv.fr/Actualites/Sante/Strategie-locale-de-deconfinement',
        '68':
            'http://www.haut-rhin.gouv.fr/Actualites/Actualites-du-Prefet-et-des-Sous-Prefets/Strategie-locale-de-deconfinement',
        '69': 'http://www.rhone.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '70':
            'http://www.haute-saone.gouv.fr/Politiques-publiques/Sante/Coronavirus/Deconfinement/Strategie-locale-de-deconfinement',
        '71':
            'http://www.saone-et-loire.gouv.fr/strategie-locale-de-deconfinement-a12500.html',
        '72':
            'http://www.sarthe.gouv.fr/covid-19-strategie-locale-de-deconfinement-a4720.html',
        '73':
            'http://www.savoie.gouv.fr/Actualites/Actualites/Strategie-locale-de-deconfinement',
        '74':
            'http://www.haute-savoie.gouv.fr/Actualites/Actualites/Coronavirus-Covid-19/Strategie-nationale-locale-du-plan-de-deconfinement',
        '75':
            'https://www.prefectures-regions.gouv.fr/ile-de-france/Actualites/Strategie-locale-de-deconfinement',
        '75':
            'https://www.prefecturedepolice.interieur.gouv.fr/Nous-connaitre/Actualites/Prevention/Strategie-locale-de-deconfinement',
        '76':
            'http://www.seine-maritime.gouv.fr/Actualites/COVID-19/Covid-19-Strategie-de-deconfinement-progressif-Economie-Ecoles-Informations-Reglementation',
        '77':
            'http://www.seine-et-marne.gouv.fr/Actualites/Actualite-du-prefet/Presentation-des-grands-axes-du-plan-de-deconfinement-a-compter-du-11-mai-2020',
        '78':
            'http://www.yvelines.gouv.fr/Actualites/Strategie-locale-de-deconfinement-dans-les-Yvelines',
        '79':
            'http://www.deux-sevres.gouv.fr/Actualites/Coronavirus-Covid-19/Strategie-locale-de-deconfinement',
        '80':
            'http://www.somme.gouv.fr/Actualites/Strategie-locale-du-plan-de-deconfinement',
        '81': 'http://www.tarn.gouv.fr/coronavirus-deconfinement-a8446.html',
        '82':
            'http://www.tarn-et-garonne.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '83': 'http://www.var.gouv.fr/strategie-locale-de-deconfinement-a8545.html',
        '84':
            'http://www.vaucluse.gouv.fr/strategie-locale-de-deconfinement-a13170.html',
        '85':
            'http://www.vendee.gouv.fr/covid-19-coronavirus-strategie-locale-de-a3396.html',
        '86': 'http://www.vienne.gouv.fr/Actualites/Coronavirus-Covid19-deconfinement',
        '87':
            'http://www.haute-vienne.gouv.fr/Actualites/COVID-19-le-deconfinement-en-Haute-Vienne/Strategie-locale-de-deconfinement',
        '88':
            'http://www.vosges.gouv.fr/Actualites/Coronavirus-Covid-19/Deconfinement/Strategie-locale-de-deconfinement',
        '89':
            'http://www.yonne.gouv.fr/Actualites/COVID-19-Coronavirus-toutes-les-informations/Strategie-locale-de-deconfinement',
        '90':
            'http://www.territoire-de-belfort.gouv.fr/Politiques-publiques/Sante-Solidarites-et-cohesion-sociale/Coronavirus-COVID-19/Deconfinement/Strategie-locale-de-deconfinemen',
        '91':
            'http://www.essonne.gouv.fr/Actualites/Coronavirus-Strategie-locale-de-deconfinement',
        '92':
            'http://www.hauts-de-seine.gouv.fr/COVID-19-Les-informations/Strategie-locale-de-deconfinement',
        '93':
            'https://www.seine-saint-denis.gouv.fr/Actualites/COVID-19-Informations/Strategie-locale-de-deconfinement',
        '94':
            'http://www.val-de-marne.gouv.fr/Actualites/Coronavirus-COVID-19-Informations-recommandations-mesures-sanitaires/Gouvernement-COVID-19-plan-de-deconfinement-et-organisation-de-la-vie-quotidienne',
        '95':
            'http://www.val-doise.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
        '971':
            'http://www.guadeloupe.gouv.fr/Politiques-publiques/Risques-naturels-technologiques-et-sanitaires/Securite-sanitaire/Informations-coronavirus/La-strategie-de-deconfinement-en-Guadeloupe',
        '971':
            'http://www.saint-barth-saint-martin.gouv.fr/Actualites/LA-UNE/Actualites/Strategie-locale-de-deconfinement',
        '971':
            'http://www.saint-barth-saint-martin.gouv.fr/Actualites/LA-UNE/Actualites/Strategie-locale-de-deconfinement',
        '972':
            'http://www.martinique.gouv.fr/Politiques-publiques/Environnement-sante-publique/Sante/Informations-COVID-19/Le-plan-de-deconfinement/Strategie-locale-de-deconfinement',
        '973':
            'http://www.guyane.gouv.fr/Politiques-publiques/Sante/Coronavirus-Covid-19/Deconfinement',
        '974': 'http://www.reunion.gouv.fr/strategie-locale-de-deconfinement-r480.html',
        '975':
            'http://www.saint-pierre-et-miquelon.gouv.fr/Publications/Communiques/Communiques-2020/Deconfinement-individuel-Saint-Pierre-et-Miquelon',
        '976':
            'http://www.mayotte.gouv.fr/Politiques-publiques/Sante/CORONAVIRUS-COVID-19/Strategie-locale-de-deconfinement/Informations-sur-la-strategie-de-fin-de-confinement-a-Mayotte',
    }
    this.lien_prefecture = function (departement) {
        return this._liens_prefectures[departement]
    }
}
var carteDepartements = new CarteDepartements()

var Questionnaire = function () {
    this.resetData = function () {
        this._departement = undefined
        this._activite_pro = undefined
        this._activite_pro_public = undefined
        this._activite_pro_sante = undefined
        this._foyer_enfants = undefined
        this._foyer_fragile = undefined
        this._sup65 = undefined
        this._grossesse_3e_trimestre = undefined
        this._poids = undefined
        this._taille = undefined
        this._antecedent_cardio = undefined
        this._antecedent_diabete = undefined
        this._antecedent_respi = undefined
        this._antecedent_dialyse = undefined
        this._antecedent_cancer = undefined
        this._antecedent_immunodep = undefined
        this._antecedent_cirrhose = undefined
        this._antecedent_drepano = undefined
        this._antecedent_chronique_autre = undefined
        this._symptomes_actuels = undefined
        this._symptomes_passes = undefined
        this._contact_a_risque = undefined
    }

    this.fillData = function (data) {
        this._departement = data['departement']
        this._activite_pro = data['activite_pro']
        this._activite_pro_public = data['activite_pro_public']
        this._activite_pro_sante = data['activite_pro_sante']
        this._foyer_enfants = data['foyer_enfants']
        this._foyer_fragile = data['foyer_fragile']
        this._sup65 = data['sup65']
        this._grossesse_3e_trimestre = data['grossesse_3e_trimestre']
        this._poids = data['poids']
        this._taille = data['taille']
        this._antecedent_cardio = data['antecedent_cardio']
        this._antecedent_diabete = data['antecedent_diabete']
        this._antecedent_respi = data['antecedent_respi']
        this._antecedent_dialyse = data['antecedent_dialyse']
        this._antecedent_cancer = data['antecedent_cancer']
        this._antecedent_immunodep = data['antecedent_immunodep']
        this._antecedent_cirrhose = data['antecedent_cirrhose']
        this._antecedent_drepano = data['antecedent_drepano']
        this._antecedent_chronique_autre = data['antecedent_chronique_autre']
        this._symptomes_actuels = data['symptomes_actuels']
        this._symptomes_passes = data['symptomes_passes']
        this._contact_a_risque = data['contact_a_risque']
    }

    this.getData = function () {
        return {
            departement: this._departement,
            activite_pro: this._activite_pro,
            activite_pro_public: this._activite_pro_public,
            activite_pro_sante: this._activite_pro_sante,
            foyer_enfants: this._foyer_enfants,
            foyer_fragile: this._foyer_fragile,
            sup65: this._sup65,
            grossesse_3e_trimestre: this._grossesse_3e_trimestre,
            poids: this._poids,
            taille: this._taille,
            antecedent_cardio: this._antecedent_cardio,
            antecedent_diabete: this._antecedent_diabete,
            antecedent_respi: this._antecedent_respi,
            antecedent_dialyse: this._antecedent_dialyse,
            antecedent_cancer: this._antecedent_cancer,
            antecedent_immunodep: this._antecedent_immunodep,
            antecedent_cirrhose: this._antecedent_cirrhose,
            antecedent_drepano: this._antecedent_drepano,
            antecedent_chronique_autre: this._antecedent_chronique_autre,
            symptomes_actuels: this._symptomes_actuels,
            symptomes_passes: this._symptomes_passes,
            contact_a_risque: this._contact_a_risque,
        }
    }

    this.setResidence = function (departement) {
        this._departement = departement
    }

    this.setActivitePro = function (activite_pro) {
        this._activite_pro = activite_pro
    }

    this.setActiviteProPublic = function (activite_pro_public) {
        this._activite_pro_public = activite_pro_public
    }

    this.setActiviteProSante = function (activite_pro_sante) {
        this._activite_pro_sante = activite_pro_sante
    }

    this.setFoyerEnfants = function (foyer_enfants) {
        this._foyer_enfants = foyer_enfants
    }

    this.setFoyerFragile = function (foyer_fragile) {
        this._foyer_fragile = foyer_fragile
    }

    this.setSup65 = function (sup65) {
        this._sup65 = sup65
    }

    this.setGrossesse3eTrimestre = function (grossesse_3e_trimestre) {
        this._grossesse_3e_trimestre = grossesse_3e_trimestre
    }

    this.setPoidsTaille = function (poids, taille) {
        this._poids = poids
        this._taille = taille
    }

    this.setAntecedentCardio = function (antecedent_cardio) {
        this._antecedent_cardio = antecedent_cardio
    }

    this.setAntecedentDiabete = function (antecedent_diabete) {
        this._antecedent_diabete = antecedent_diabete
    }

    this.setAntecedentRespi = function (antecedent_respi) {
        this._antecedent_respi = antecedent_respi
    }

    this.setAntecedentDialyse = function (antecedent_dialyse) {
        this._antecedent_dialyse = antecedent_dialyse
    }

    this.setAntecedentCancer = function (antecedent_cancer) {
        this._antecedent_cancer = antecedent_cancer
    }

    this.setAntecedentImmunodep = function (antecedent_immunodep) {
        this._antecedent_immunodep = antecedent_immunodep
    }

    this.setAntecedentCirrhose = function (antecedent_cirrhose) {
        this._antecedent_cirrhose = antecedent_cirrhose
    }

    this.setAntecedentDrepano = function (antecedent_drepano) {
        this._antecedent_drepano = antecedent_drepano
    }

    this.setAntecedentChroniqueAutre = function (antecedent_chronique_autre) {
        this._antecedent_chronique_autre = antecedent_chronique_autre
    }

    this.setSymptomesActuels = function (symptomes_actuels) {
        this._symptomes_actuels = symptomes_actuels
    }

    this.setSymptomesPasses = function (symptomes_passes) {
        this._symptomes_passes = symptomes_passes
    }

    this.setContactARisque = function (contact_a_risque) {
        this._contact_a_risque = contact_a_risque
    }
}
var questionnaire = new Questionnaire()

function preloadForm(form, key) {
    var value = questionnaire.getData()[key]
    if (typeof value !== 'undefined' && value !== '') {
        form[key].value = value
    }
}

function preloadCheckboxForm(form, key) {
    var value = questionnaire.getData()[key]
    if (typeof value !== 'undefined' && value) {
        form[key].checked = true
    }
}

function submitResidenceForm(event) {
    event.preventDefault()
    questionnaire.setResidence(event.target.elements['departement'].value)
    stockageLocal.enregistrer(questionnaire)
    navigation.goToPage('activite-pro')
}

function submitActiviteProForm(event) {
    event.preventDefault()
    questionnaire.setActivitePro(event.target.elements['activite_pro'].checked)
    questionnaire.setActiviteProPublic(
        event.target.elements['activite_pro_public'].checked
    )
    questionnaire.setActiviteProSante(
        event.target.elements['activite_pro_sante'].checked
    )
    stockageLocal.enregistrer(questionnaire)
    navigation.goToPage('foyer')
}

function submitFoyerForm(event) {
    event.preventDefault()
    questionnaire.setFoyerEnfants(event.target.elements['foyer_enfants'].checked)
    questionnaire.setFoyerFragile(event.target.elements['foyer_fragile'].checked)
    stockageLocal.enregistrer(questionnaire)
    navigation.goToPage('caracteristiques')
}

function submitCaracteristiquesForm(event) {
    event.preventDefault()
    questionnaire.setSup65(event.target.elements['sup65'].checked)
    questionnaire.setGrossesse3eTrimestre(
        event.target.elements['grossesse_3e_trimestre'].checked
    )
    questionnaire.setPoidsTaille(
        event.target.elements['poids'].value,
        event.target.elements['taille'].value
    )
    stockageLocal.enregistrer(questionnaire)
    navigation.goToPage('antecedents')
}

function submitAntecedentsForm(event) {
    event.preventDefault()
    questionnaire.setAntecedentCardio(
        event.target.elements['antecedent_cardio'].checked
    )
    questionnaire.setAntecedentDiabete(
        event.target.elements['antecedent_diabete'].checked
    )
    questionnaire.setAntecedentRespi(event.target.elements['antecedent_respi'].checked)
    questionnaire.setAntecedentDialyse(
        event.target.elements['antecedent_dialyse'].checked
    )
    questionnaire.setAntecedentCancer(
        event.target.elements['antecedent_cancer'].checked
    )
    questionnaire.setAntecedentImmunodep(
        event.target.elements['antecedent_immunodep'].checked
    )
    questionnaire.setAntecedentCirrhose(
        event.target.elements['antecedent_cirrhose'].checked
    )
    questionnaire.setAntecedentDrepano(
        event.target.elements['antecedent_drepano'].checked
    )
    questionnaire.setAntecedentChroniqueAutre(
        event.target.elements['antecedent_chronique_autre'].checked
    )
    stockageLocal.enregistrer(questionnaire)
    navigation.goToPage('symptomes-actuels')
}

function submitSymptomesActuelsForm(event) {
    event.preventDefault()
    var symptomesActuels = event.target.elements['symptomes_actuels'].checked
    questionnaire.setSymptomesActuels(symptomesActuels)
    stockageLocal.enregistrer(questionnaire)
    if (symptomesActuels) {
        navigation.goToPage('conseils-symptomes-actuels')
    } else {
        navigation.goToPage('symptomes-passes')
    }
}

function submitSymptomesPassesForm(event) {
    event.preventDefault()
    var symptomesPasses = event.target.elements['symptomes_passes'].checked
    questionnaire.setSymptomesPasses(symptomesPasses)
    stockageLocal.enregistrer(questionnaire)
    if (symptomesPasses) {
        navigation.goToPage('conseils-symptomes-passes')
    } else {
        navigation.goToPage('contact-a-risque')
    }
}

function submitContactARisqueForm(event) {
    event.preventDefault()
    var contactARisque = event.target.elements['contact_a_risque'].checked
    questionnaire.setContactARisque(contactARisque)
    stockageLocal.enregistrer(questionnaire)
    if (contactARisque) {
        navigation.goToPage('conseils-contact-a-risque')
    } else {
        navigation.goToPage('conseils')
    }
}

function resetPrivateData(event) {
    event.preventDefault()
    questionnaire.resetData()
    stockageLocal.supprimer()
    navigation.goToPage('introduction')
}

var Geolocaliseur = function () {
    this.matchDepartement = function (lat, lon, callback) {
        // Warning, in case of multiple polygons, you can have multiple matches.
        var that = this
        this.loadMap().then(function (featureCollection) {
            featureCollection.features.forEach(function (departement) {
                if (departement.geometry.type === 'Polygon') {
                    var polyCoordinates = [departement.geometry.coordinates]
                } else {
                    var polyCoordinates = departement.geometry.coordinates
                }
                polyCoordinates.forEach(function (polyCoordinate) {
                    polyCoordinate.forEach(function (coord) {
                        if (that.booleanPointInPolygon([lon, lat], coord)) {
                            callback(departement.properties)
                        }
                    })
                })
            })
        })
    }

    this.loadMap = function () {
        return fetch('departements-1000m.geojson').then(function (response) {
            return response.json()
        })
    }

    this.booleanPointInPolygon = function (point, vs) {
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        var x = point[0],
            y = point[1]

        var inside = false
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0],
                yi = vs[i][1]
            var xj = vs[j][0],
                yj = vs[j][1]

            var intersect =
                yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
            if (intersect) inside = !inside
        }

        return inside
    }
}
geolocaliseur = new Geolocaliseur()

function geolocalisation(event) {
    event.preventDefault()
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            geolocaliseur.matchDepartement(
                pos.coords.latitude,
                pos.coords.longitude,
                function (dpt) {
                    if (typeof dpt !== 'undefined') {
                        document.getElementById('departement').value = dpt.code
                    }
                }
            )
        },
        function (err) {
            console.warn('ERREUR (' + err.code + '): ' + err.message)
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    )
}

function hideElement(element) {
    element.setAttribute('hidden', '')
    element.classList.remove('visible')
}

function displayElement(element, id) {
    var block = element.querySelector('#' + id)
    block.removeAttribute('hidden')
    block.classList.add('visible')
}

function displayDepartementConseils(data, element) {
    displayElement(element, 'conseils-departement')
    if (data.couleur === 'rouge') {
        displayElement(element, 'conseils-departement-rouge')
    }
    if (data.couleur === 'vert') {
        displayElement(element, 'conseils-departement-vert')
    }
    var lienPrefecture = element.querySelector('#lien-prefecture')
    lienPrefecture.setAttribute(
        'href',
        carteDepartements.lien_prefecture(data.departement)
    )
}

function displayActiviteProConseils(data, element) {
    if (data.activite_pro || data.activite_pro_public || data.activite_pro_sante) {
        displayElement(element, 'conseils-activite')
        if (data.activite_pro) {
            displayElement(element, 'conseils-activite-pro')
        }
        if (data.activite_pro_public) {
            displayElement(element, 'conseils-activite-pro-public')
        }
        if (data.activite_pro_sante) {
            displayElement(element, 'conseils-activite-pro-sante')
        }
    }
}

function displayFoyerConseils(data, element) {
    if (data.foyer_enfants || data.foyer_fragile) {
        displayElement(element, 'conseils-foyer')
        if (data.foyer_enfants && data.foyer_fragile) {
            displayElement(element, 'conseils-foyer-enfants-fragile')
            return
        }
        if (data.foyer_enfants) {
            displayElement(element, 'conseils-foyer-enfants')
        }
        if (data.foyer_fragile) {
            displayElement(element, 'conseils-foyer-fragile')
        }
    }
}

function displayCaracteristiquesAntecedentsConseils(data, element) {
    if (
        data.sup65 ||
        data.imc > 30 ||
        data.antecedents ||
        data.antecedent_chronique_autre
    ) {
        displayElement(element, 'conseils-caracteristiques')
        if (data.sup65 || data.imc > 30 || data.antecedents) {
            displayElement(element, 'conseils-caracteristiques-antecedents')
        }
        if (data.antecedent_chronique_autre) {
            displayElement(element, 'conseils-antecedents-chroniques-autres')
        }
    }
}

function displayGeneralConseils(data, element) {
    displayElement(element, 'conseils-generaux')
}

function displayConseils(element) {
    // Hide all conseils that might have been made visible on previous runs.
    ;[].forEach.call(element.querySelectorAll('.visible'), hideElement)
    var algorithme = new Algorithme(questionnaire, carteDepartements)
    var data = algorithme.getData()
    displayDepartementConseils(data, element)
    displayActiviteProConseils(data, element)
    displayFoyerConseils(data, element)
    displayCaracteristiquesAntecedentsConseils(data, element)
    displayGeneralConseils(data, element)
}

function displayConseilsSymptomesPasses(element) {
    // Hide all conseils that might have been made visible on previous runs.
    ;[].forEach.call(element.querySelectorAll('.visible'), hideElement)
    var algorithme = new Algorithme(questionnaire, carteDepartements)
    var data = algorithme.getData()
    if (data.risques) {
        displayElement(element, 'conseils-symptomes-passes-avec-risques')
    } else {
        displayElement(element, 'conseils-symptomes-passes-sans-risques')
    }
    displayDepartementConseils(data, element)
}

function displayConseilsContactARisque(element) {
    // Hide all conseils that might have been made visible on previous runs.
    ;[].forEach.call(element.querySelectorAll('.visible'), hideElement)
    var algorithme = new Algorithme(questionnaire, carteDepartements)
    var data = algorithme.getData()
    displayDepartementConseils(data, element)
}

var Algorithme = function (questionnaire, carteDepartements) {
    this.questionnaire = questionnaire
    this.carteDepartements = carteDepartements

    this.computeIMC = function (poids, taille) {
        var taille_en_metres = taille / 100
        return poids / (taille_en_metres * taille_en_metres)
    }

    this.hasRisques = function (data) {
        return (
            this.hasAntecedents(data) ||
            data.sup65 ||
            data.imc > 30 ||
            data.foyer_fragile
        )
    }

    this.hasAntecedents = function (data) {
        return (
            data.antecedent_cardio ||
            data.antecedent_diabete ||
            data.antecedent_respi ||
            data.antecedent_dialyse ||
            data.antecedent_cancer ||
            data.antecedent_immunodep ||
            data.antecedent_cirrhose ||
            data.antecedent_drepano ||
            data.grossesse_3e_trimestre
        )
    }

    this.hasSymptomes = function (data) {
        return data.symptomes_actuels || data.symptomes_passes || data.contact_a_risque
    }

    this.getData = function () {
        var data = questionnaire.getData()
        return Object.assign({}, data, {
            couleur: this.carteDepartements.couleur(data.departement),
            imc: this.computeIMC(data.poids, data.taille),
            antecedents: this.hasAntecedents(data),
            symptomes: this.hasSymptomes(data),
            risques: this.hasRisques(data),
        })
    }
}

var Navigation = function () {
    this.init = function () {
        var that = this
        window.addEventListener('hashchange', function (event) {
            var hash = document.location.hash && document.location.hash.slice(1)
            hash && that.loadPage(hash)
        })
        this.loadInitialPage()
    }

    this.loadInitialPage = function () {
        var hash = document.location.hash
        var requestedPage = hash ? hash.slice(1) : 'introduction'
        var redirectedPage = this.redirectIfMissingData(requestedPage, questionnaire)
        if (redirectedPage) {
            this.goToPage(redirectedPage)
        } else {
            this.loadPage(requestedPage)
        }
    }

    this.redirectIfMissingData = function (page, questionnaire) {
        if (page === 'introduction') return

        // Questions obligatoires

        if (typeof questionnaire._departement === 'undefined' && page !== 'residence')
            return 'introduction' // aucune réponse = retour à l’accueil

        if (page === 'residence') return

        if (
            typeof questionnaire._activite_pro === 'undefined' &&
            page !== 'activite-pro'
        )
            return 'activite-pro'

        if (page === 'activite-pro') return

        if (typeof questionnaire._foyer_enfants === 'undefined' && page !== 'foyer')
            return 'foyer'

        if (page === 'foyer') return

        if (typeof questionnaire._sup65 === 'undefined' && page !== 'caracteristiques')
            return 'caracteristiques'

        if (page === 'caracteristiques') return

        if (
            typeof questionnaire._antecedent_cardio === 'undefined' &&
            page !== 'antecedents'
        )
            return 'antecedents'

        if (page === 'antecedents') return

        if (
            typeof questionnaire._symptomes_actuels === 'undefined' &&
            page !== 'symptomes-actuels'
        )
            return 'symptomes-actuels'

        if (page === 'symptomes-actuels') return

        if (questionnaire._symptomes_actuels === true)
            return page === 'conseils-symptomes-actuels'
                ? undefined
                : 'conseils-symptomes-actuels'

        if (
            typeof questionnaire._symptomes_passes === 'undefined' &&
            page !== 'symptomes-passes'
        )
            return 'symptomes-passes'

        if (page === 'symptomes-passes') return

        if (questionnaire._symptomes_passes === true)
            return page === 'conseils-symptomes-passes'
                ? undefined
                : 'conseils-symptomes-passes'

        if (
            typeof questionnaire._contact_a_risque === 'undefined' &&
            page !== 'contact-a-risque'
        )
            return 'contact-a-risque'

        if (page === 'contact-a-risque') return

        if (questionnaire._contact_a_risque === true)
            return page === 'conseils-contact-a-risque'
                ? undefined
                : 'conseils-contact-a-risque'

        if (questionnaire._contact_a_risque === false)
            return page === 'conseils' ? undefined : 'conseils'
    }

    this.goToPage = function (name) {
        document.location.hash = name
    }

    this.loadPage = function (name) {
        var page = document.querySelector('section#page')
        var template = document.querySelector('#' + name)
        var clone = template.content.cloneNode(true)
        page.innerHTML = '' // Flush the current content.
        var element = page.insertAdjacentElement('afterbegin', clone.firstElementChild)
        element.scrollIntoView({ behavior: 'smooth' })
    }
}
navigation = new Navigation()
