const prefectures = {
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
    '08': 'http://www.ardennes.gouv.fr/strategie-locale-de-deconfinement-a3016.html',
    '09': 'http://www.ariege.gouv.fr/Actualites/Plan-de-deconfinement',
    '10': 'https://www.aube.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
    '11': 'http://www.aude.gouv.fr/strategie-locale-de-deconfinement-a11212.html',
    '12': 'http://www.aveyron.gouv.fr/strategie-locale-de-deconfinement-a7183.html',
    '13':
        'http://www.bouches-du-rhone.gouv.fr/Actualites/A-la-Une/Actualites-COVID-19/Covid-19-Strategie-locale-de-deconfinement',
    '14': 'http://www.calvados.gouv.fr/strategie-locale-de-deconfinement-r1962.html',
    '15': 'http://www.cantal.gouv.fr/strategie-locale-de-deconfinement-a6525.html',
    '16': 'http://www.charente.gouv.fr/deconfinement',
    '17':
        'http://www.charente-maritime.gouv.fr/Politiques-publiques/Securite/Securite-sanitaire/COVID19-Strategie-locale-de-deconfinement',
    '18': 'http://www.cher.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
    '19':
        'http://www.correze.gouv.fr/Politiques-publiques/Sante/Strategie-locale-de-deconfinement',
    '21': 'http://www.cote-dor.gouv.fr/strategie-locale-de-deconfinement-a8876.html',
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
    '29': 'http://www.finistere.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
    '2A':
        'http://www.corse-du-sud.gouv.fr/strategie-locale-de-deconfinement-a2375.html',
    '2B': 'http://www.haute-corse.gouv.fr/strategie-locale-de-deconfinement-a3331.html',
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
    '39': 'http://www.jura.gouv.fr/Actualites/Breves/Strategie-locale-de-deconfinement',
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
    '63': 'http://www.puy-de-dome.gouv.fr/strategie-locale-de-deconfinement-a8240.html',
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
    '84': 'http://www.vaucluse.gouv.fr/strategie-locale-de-deconfinement-a13170.html',
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
    '95': 'http://www.val-doise.gouv.fr/Actualites/Strategie-locale-de-deconfinement',
    '971':
        'http://www.guadeloupe.gouv.fr/Politiques-publiques/Risques-naturels-technologiques-et-sanitaires/Securite-sanitaire/Informations-coronavirus/La-strategie-de-deconfinement-en-Guadeloupe',
    '972':
        'http://www.martinique.gouv.fr/Politiques-publiques/Environnement-sante-publique/Sante/Informations-COVID-19/Le-plan-de-deconfinement/Strategie-locale-de-deconfinement',
    '973':
        'http://www.guyane.gouv.fr/Politiques-publiques/Sante/Coronavirus-Covid-19/Deconfinement',
    '974': 'http://www.reunion.gouv.fr/strategie-locale-de-deconfinement-r480.html',
    '975':
        'http://www.saint-pierre-et-miquelon.gouv.fr/Publications/Communiques/Communiques-2020/Deconfinement-individuel-Saint-Pierre-et-Miquelon',
    '976':
        'http://www.mayotte.gouv.fr/Politiques-publiques/Sante/CORONAVIRUS-COVID-19/Strategie-locale-de-deconfinement/Informations-sur-la-strategie-de-fin-de-confinement-a-Mayotte',
    '977':
        'http://www.saint-barth-saint-martin.gouv.fr/Actualites/LA-UNE/Actualites/Strategie-locale-de-deconfinement',
    '978':
        'http://www.saint-barth-saint-martin.gouv.fr/Actualites/LA-UNE/Actualites/Strategie-locale-de-deconfinement',
}

module.exports = { prefectures }
