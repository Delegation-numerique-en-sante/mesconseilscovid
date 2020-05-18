// Object.assign polyfill for IE 11
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, 'assign', {
        value: function assign(target, varArgs) {
            // .length of function is 2
            'use strict'
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object')
            }

            var to = Object(target)

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index]

                if (nextSource !== null && nextSource !== undefined) {
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey]
                        }
                    }
                }
            }
            return to
        },
        writable: true,
        configurable: true,
    })
}

var Affichage = function () {
    this.hideElement = function (element) {
        element.setAttribute('hidden', '')
        element.classList.remove('visible')
    }

    this.hideSelector = function (element, selector) {
        ;[].forEach.call(element.querySelectorAll(selector), this.hideElement)
    }

    this.displayElement = function (element, id) {
        var block = element.querySelector('#' + id)
        block.removeAttribute('hidden')
        block.classList.add('visible')

        var customDisplayEvent = document.createEvent('CustomEvent')
        customDisplayEvent.initCustomEvent('elementDisplayed:' + id, true, true, block)
        document.dispatchEvent(customDisplayEvent)
    }

    this.displayBlocks = function (element, blockNames) {
        var that = this
        blockNames.forEach(function (block) {
            that.displayElement(element, block)
        })
    }

    this.injectContent = function (element, content, selector) {
        var childElement = element.querySelector(selector)
        childElement.innerText = content
    }

    this.injectAttribute = function (element, attrName, attrValue, selector) {
        var childElement = element.querySelector(selector)
        childElement.setAttribute(attrName, attrValue)
    }
}
var affichage = new Affichage()

var FormUtils = function () {
    this.preloadForm = function (form, key) {
        var value = questionnaire.getData()[key]
        if (typeof value !== 'undefined' && value !== '') {
            form[key].value = value
        }
    }

    this.preloadCheckboxForm = function (form, key) {
        var value = questionnaire.getData()[key]
        if (typeof value !== 'undefined' && value) {
            form[key].checked = true
        }
    }

    this.toggleFormButtonOnCheck = function (form, initialLabel, alternateLabel) {
        var button = form.querySelector('input[type=submit]')
        var checkboxes = [].slice.call(form.querySelectorAll('input[type=checkbox]'))
        function updateSubmitButtonLabel(event) {
            var hasChecks = checkboxes.some(function (checkbox) {
                return checkbox.checked
            })
            button.value = hasChecks ? alternateLabel : initialLabel
        }
        updateSubmitButtonLabel()
        checkboxes.forEach(function (elem) {
            elem.addEventListener('change', updateSubmitButtonLabel)
        })
    }

    this.enableOrDisableSecondaryFields = function (form, primary) {
        var primaryDisabled = !primary.checked
        ;[].forEach.call(form.querySelectorAll('.secondary'), function (elem) {
            var secondary = elem.querySelector('input')
            if (secondary.checked && primaryDisabled) {
                secondary.checked = false
                secondary.dispatchEvent(new Event('change'))
            }
            secondary.disabled = primaryDisabled
            if (primaryDisabled) {
                elem.classList.add('disabled')
            } else {
                elem.classList.remove('disabled')
            }
        })
    }
}
var formUtils = new FormUtils()

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
                    console.log(data)
                    questionnaire.fillData(data)
                } else {
                    console.debug('Pas de données locales pour l’instant')
                }
                var customLoadingEvent = document.createEvent('CustomEvent')
                customLoadingEvent.initCustomEvent('dataLoaded', true, true, data)
                document.dispatchEvent(customLoadingEvent)
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
    this._noms = {
        '01': 'Ain',
        '02': 'Aisne',
        '03': 'Allier',
        '05': 'Hautes-Alpes',
        '04': 'Alpes-de-Haute-Provence',
        '06': 'Alpes-Maritimes',
        '07': 'Ardèche',
        '08': 'Ardennes',
        '09': 'Ariège',
        '10': 'Aube',
        '11': 'Aude',
        '12': 'Aveyron',
        '13': 'Bouches-du-Rhône',
        '14': 'Calvados',
        '15': 'Cantal',
        '16': 'Charente',
        '17': 'Charente-Maritime',
        '18': 'Cher',
        '19': 'Corrèze',
        '2A': 'Corse-du-sud',
        '2B': 'Haute-corse',
        '21': 'Côte-d’or',
        '22': 'Côtes-d’armor',
        '23': 'Creuse',
        '24': 'Dordogne',
        '25': 'Doubs',
        '26': 'Drôme',
        '27': 'Eure',
        '28': 'Eure-et-Loir',
        '29': 'Finistère',
        '30': 'Gard',
        '31': 'Haute-Garonne',
        '32': 'Gers',
        '33': 'Gironde',
        '34': 'Hérault',
        '35': 'Ile-et-Vilaine',
        '36': 'Indre',
        '37': 'Indre-et-Loire',
        '38': 'Isère',
        '39': 'Jura',
        '40': 'Landes',
        '41': 'Loir-et-Cher',
        '42': 'Loire',
        '43': 'Haute-Loire',
        '44': 'Loire-Atlantique',
        '45': 'Loiret',
        '46': 'Lot',
        '47': 'Lot-et-Garonne',
        '48': 'Lozère',
        '49': 'Maine-et-Loire',
        '50': 'Manche',
        '51': 'Marne',
        '52': 'Haute-Marne',
        '53': 'Mayenne',
        '54': 'Meurthe-et-Moselle',
        '55': 'Meuse',
        '56': 'Morbihan',
        '57': 'Moselle',
        '58': 'Nièvre',
        '59': 'Nord',
        '60': 'Oise',
        '61': 'Orne',
        '62': 'Pas-de-Calais',
        '63': 'Puy-de-Dôme',
        '64': 'Pyrénées-Atlantiques',
        '65': 'Hautes-Pyrénées',
        '66': 'Pyrénées-Orientales',
        '67': 'Bas-Rhin',
        '68': 'Haut-Rhin',
        '69': 'Rhône',
        '70': 'Haute-Saône',
        '71': 'Saône-et-Loire',
        '72': 'Sarthe',
        '73': 'Savoie',
        '74': 'Haute-Savoie',
        '75': 'Paris',
        '76': 'Seine-Maritime',
        '77': 'Seine-et-Marne',
        '78': 'Yvelines',
        '79': 'Deux-Sèvres',
        '80': 'Somme',
        '81': 'Tarn',
        '82': 'Tarn-et-Garonne',
        '83': 'Var',
        '84': 'Vaucluse',
        '85': 'Vendée',
        '86': 'Vienne',
        '87': 'Haute-Vienne',
        '88': 'Vosges',
        '89': 'Yonne',
        '90': 'Territoire de Belfort',
        '91': 'Essonne',
        '92': 'Hauts-de-Seine',
        '93': 'Seine-Saint-Denis',
        '94': 'Val-de-Marne',
        '95': 'Val-d’oise',
        '971': 'Guadeloupe',
        '972': 'Martinique',
        '973': 'Guyane',
        '974': 'Réunion',
        '975': 'Saint-Pierre-et-Miquelon',
        '976': 'Mayotte',
        '977': 'Saint-Barthélemy',
        '978': 'Saint-Martin',
    }
    this.nom = function (departementId) {
        return this._noms[departementId]
    }
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
    this.couleur = function (departementId) {
        return this._couleurs[departementId] || 'inconnue'
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
    this.lien_prefecture = function (departementId) {
        return this._liens_prefectures[departementId]
    }
}
var carteDepartements = new CarteDepartements()

var Questionnaire = function () {
    this.resetData = function () {
        this.departement = undefined
        this.activite_pro = undefined
        this.activite_pro_public = undefined
        this.activite_pro_sante = undefined
        this.foyer_enfants = undefined
        this.foyer_fragile = undefined
        this.sup65 = undefined
        this.grossesse_3e_trimestre = undefined
        this.poids = undefined
        this.taille = undefined
        this.antecedent_cardio = undefined
        this.antecedent_diabete = undefined
        this.antecedent_respi = undefined
        this.antecedent_dialyse = undefined
        this.antecedent_cancer = undefined
        this.antecedent_immunodep = undefined
        this.antecedent_cirrhose = undefined
        this.antecedent_drepano = undefined
        this.antecedent_chronique_autre = undefined
        this.symptomes_actuels = undefined
        this.symptomes_passes = undefined
        this.contact_a_risque = undefined
    }

    this.fillData = function (data) {
        this.departement = data['departement']
        this.activite_pro = data['activite_pro']
        this.activite_pro_public = data['activite_pro_public']
        this.activite_pro_sante = data['activite_pro_sante']
        this.foyer_enfants = data['foyer_enfants']
        this.foyer_fragile = data['foyer_fragile']
        this.sup65 = data['sup65']
        this.grossesse_3e_trimestre = data['grossesse_3e_trimestre']
        this.poids = data['poids']
        this.taille = data['taille']
        this.antecedent_cardio = data['antecedent_cardio']
        this.antecedent_diabete = data['antecedent_diabete']
        this.antecedent_respi = data['antecedent_respi']
        this.antecedent_dialyse = data['antecedent_dialyse']
        this.antecedent_cancer = data['antecedent_cancer']
        this.antecedent_immunodep = data['antecedent_immunodep']
        this.antecedent_cirrhose = data['antecedent_cirrhose']
        this.antecedent_drepano = data['antecedent_drepano']
        this.antecedent_chronique_autre = data['antecedent_chronique_autre']
        this.symptomes_actuels = data['symptomes_actuels']
        this.symptomes_passes = data['symptomes_passes']
        this.contact_a_risque = data['contact_a_risque']
    }

    this.getData = function () {
        return {
            departement: this.departement,
            activite_pro: this.activite_pro,
            activite_pro_public: this.activite_pro_public,
            activite_pro_sante: this.activite_pro_sante,
            foyer_enfants: this.foyer_enfants,
            foyer_fragile: this.foyer_fragile,
            sup65: this.sup65,
            grossesse_3e_trimestre: this.grossesse_3e_trimestre,
            poids: this.poids,
            taille: this.taille,
            antecedent_cardio: this.antecedent_cardio,
            antecedent_diabete: this.antecedent_diabete,
            antecedent_respi: this.antecedent_respi,
            antecedent_dialyse: this.antecedent_dialyse,
            antecedent_cancer: this.antecedent_cancer,
            antecedent_immunodep: this.antecedent_immunodep,
            antecedent_cirrhose: this.antecedent_cirrhose,
            antecedent_drepano: this.antecedent_drepano,
            antecedent_chronique_autre: this.antecedent_chronique_autre,
            symptomes_actuels: this.symptomes_actuels,
            symptomes_passes: this.symptomes_passes,
            contact_a_risque: this.contact_a_risque,
        }
    }

    this.isComplete = function () {
        return (
            typeof this.departement !== 'undefined' &&
            typeof this.activite_pro !== 'undefined' &&
            typeof this.activite_pro_public !== 'undefined' &&
            typeof this.activite_pro_sante !== 'undefined' &&
            typeof this.foyer_enfants !== 'undefined' &&
            typeof this.foyer_fragile !== 'undefined' &&
            typeof this.sup65 !== 'undefined' &&
            typeof this.grossesse_3e_trimestre !== 'undefined' &&
            typeof this.poids !== 'undefined' &&
            typeof this.taille !== 'undefined' &&
            typeof this.antecedent_cardio !== 'undefined' &&
            typeof this.antecedent_diabete !== 'undefined' &&
            typeof this.antecedent_respi !== 'undefined' &&
            typeof this.antecedent_dialyse !== 'undefined' &&
            typeof this.antecedent_cancer !== 'undefined' &&
            typeof this.antecedent_immunodep !== 'undefined' &&
            typeof this.antecedent_cirrhose !== 'undefined' &&
            typeof this.antecedent_drepano !== 'undefined' &&
            typeof this.antecedent_chronique_autre !== 'undefined' &&
            typeof this.symptomes_actuels !== 'undefined' &&
            typeof this.symptomes_passes !== 'undefined' &&
            typeof this.contact_a_risque !== 'undefined'
        )
    }
}
var questionnaire = new Questionnaire()

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
        this.loadMap(function (featureCollection) {
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

    this.loadMap = function (callback) {
        var xhr = new XMLHttpRequest()
        xhr.overrideMimeType('application/json')
        xhr.open('GET', 'departements-1000m.geojson', true)
        xhr.onload = function () {
            var jsonResponse = JSON.parse(xhr.responseText)
            callback(jsonResponse)
        }
        xhr.send()
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
            var latitude = pos.coords.latitude
            var longitude = pos.coords.longitude
            geolocaliseur.matchDepartement(latitude, longitude, function (dpt) {
                if (typeof dpt !== 'undefined') {
                    document.getElementById('departement').value = dpt.code
                }
            })
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

var Algorithme = function (questionnaire, carteDepartements) {
    this.questionnaire = questionnaire
    this.carteDepartements = carteDepartements

    this.computeIMC = function (poids, taille) {
        var taille_en_metres = taille / 100
        return poids / (taille_en_metres * taille_en_metres)
    }

    this.hasRisques = function (data) {
        return this.hasAntecedents(data) || data.sup65 || data.imc > 30
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

    this.statutBlockNamesToDisplay = function (data) {
        var blockNames = []
        // L’ordre est important car risques > foyer_fragile.
        if (data.risques) {
            blockNames.push('statut-personne-fragile')
        } else if (data.foyer_fragile) {
            blockNames.push('statut-foyer-fragile')
        } else {
            blockNames.push('statut-peu-de-risques')
        }
        return blockNames
    }

    this.departementBlockNamesToDisplay = function (data) {
        var blockNames = []
        blockNames.push('conseils-departement')
        if (data.couleur === 'rouge') {
            blockNames.push('conseils-departement-rouge')
        }
        if (data.couleur === 'vert') {
            blockNames.push('conseils-departement-vert')
        }
        return blockNames
    }

    this.activiteProBlockNamesToDisplay = function (data) {
        var blockNames = []
        if (data.activite_pro || data.activite_pro_public || data.activite_pro_sante) {
            blockNames.push('conseils-activite')
            // Les blocs de réponses sont exclusifs.
            if (data.activite_pro_public && data.activite_pro_sante) {
                blockNames.push('reponse-activite-pro-public-sante')
            } else if (data.activite_pro_public) {
                blockNames.push('reponse-activite-pro-public')
            } else if (data.activite_pro_sante) {
                blockNames.push('reponse-activite-pro-sante')
            } else {
                blockNames.push('reponse-activite-pro')
            }
            // Les blocs de conseils sont quasi-exclusifs aussi.
            if (data.activite_pro_public && data.activite_pro_sante) {
                blockNames.push('conseils-activite-pro-public')
                blockNames.push('conseils-activite-pro-sante')
            } else if (data.activite_pro_public) {
                blockNames.push('conseils-activite-pro-public')
                blockNames.push('conseils-activite-pro-infos')
            } else if (data.activite_pro_sante) {
                blockNames.push('conseils-activite-pro-sante')
            } else {
                blockNames.push('conseils-activite-pro')
                blockNames.push('conseils-activite-pro-infos')
            }
        }
        return blockNames
    }

    this.foyerBlockNamesToDisplay = function (data) {
        var blockNames = []
        if (data.foyer_enfants || data.foyer_fragile) {
            blockNames.push('conseils-foyer')
            if (data.foyer_enfants && data.foyer_fragile) {
                blockNames.push('conseils-foyer-enfants-fragile')
            } else if (data.foyer_enfants) {
                blockNames.push('conseils-foyer-enfants')
            } /* if (data.foyer_fragile) inutile mais logique */ else {
                blockNames.push('conseils-foyer-fragile')
            }
        }
        return blockNames
    }

    this.caracteristiquesAntecedentsBlockNamesToDisplay = function (data) {
        var blockNames = []
        if (
            data.sup65 ||
            data.imc > 30 ||
            data.antecedents ||
            data.antecedent_chronique_autre
        ) {
            blockNames.push('conseils-caracteristiques')
            if (data.sup65 || data.imc > 30 || data.antecedents) {
                blockNames.push('conseils-caracteristiques-antecedents')
            }
            if (data.antecedent_chronique_autre) {
                blockNames.push('conseils-antecedents-chroniques-autres')
            }
        }
        return blockNames
    }

    this.symptomesPassesBlockNamesToDisplay = function (data) {
        var blockNames = []
        if (data.risques || data.foyer_fragile) {
            blockNames.push('conseils-symptomes-passes-avec-risques')
        } else {
            blockNames.push('conseils-symptomes-passes-sans-risques')
        }
        return blockNames
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
        this.checkForUpdatesEvery(10) // Minutes.
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
        if (page === 'conditionsutilisation') return

        // Questions obligatoires

        if (typeof questionnaire.departement === 'undefined' && page !== 'residence')
            return 'introduction' // aucune réponse = retour à l’accueil

        if (page === 'residence') return

        if (typeof questionnaire.activite_pro === 'undefined' && page !== 'activitepro')
            return 'activitepro'

        if (page === 'activitepro') return

        if (typeof questionnaire.foyer_enfants === 'undefined' && page !== 'foyer')
            return 'foyer'

        if (page === 'foyer') return

        if (typeof questionnaire.sup65 === 'undefined' && page !== 'caracteristiques')
            return 'caracteristiques'

        if (page === 'caracteristiques') return

        if (
            typeof questionnaire.antecedent_cardio === 'undefined' &&
            page !== 'antecedents'
        )
            return 'antecedents'

        if (page === 'antecedents') return

        if (
            typeof questionnaire.symptomes_actuels === 'undefined' &&
            page !== 'symptomesactuels'
        )
            return 'symptomesactuels'

        if (page === 'symptomesactuels') return

        if (questionnaire.symptomes_actuels === true)
            return page === 'conseilssymptomesactuels'
                ? undefined
                : 'conseilssymptomesactuels'

        if (
            typeof questionnaire.symptomes_passes === 'undefined' &&
            page !== 'symptomespasses'
        )
            return 'symptomespasses'

        if (page === 'symptomespasses') return

        if (questionnaire.symptomes_passes === true)
            return page === 'conseilssymptomespasses'
                ? undefined
                : 'conseilssymptomespasses'

        if (
            typeof questionnaire.contact_a_risque === 'undefined' &&
            page !== 'contactarisque'
        )
            return 'contactarisque'

        if (page === 'contactarisque') return

        if (questionnaire.contact_a_risque === true)
            return page === 'conseilscontactarisque'
                ? undefined
                : 'conseilscontactarisque'

        if (questionnaire.contact_a_risque === false)
            return page === 'conseils' ? undefined : 'conseils'
    }

    this.checkForUpdatesEvery = function (intervalInMinutes) {
        this.checkForUpdate()
        setInterval(this.checkForUpdate.bind(this), intervalInMinutes * 60 * 1000)
    }

    this.checkForUpdate = function () {
        if (document.location.hash === '#nouvelle-version-disponible') {
            return
        }
        var that = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'version.json?' + new Date().getTime(), true)
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.onload = function () {
            var jsonResponse = JSON.parse(xhr.responseText)
            that.updateVersion(jsonResponse.version)
        }
        xhr.send()
    }

    this.currentVersion = null

    this.updateVersion = function (fetchedVersion) {
        if (this.currentVersion === null || this.currentVersion === fetchedVersion) {
            this.currentVersion = fetchedVersion
            return
        } else {
            var that = this
            if (this.isFillingQuestionnaire()) {
                document.addEventListener('elementDisplayed:update-banner', function (
                    event
                ) {
                    // Even with an event, we need to wait for the next few
                    // ticks to be able to scroll to the newly visible element.
                    setTimeout(function () {
                        event.detail.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                    var refreshButton = event.detail.querySelector(
                        '#refresh-button-banner'
                    )
                    refreshButton.setAttribute('href', window.location.hash)
                    refreshButton.addEventListener(
                        'click',
                        that.forceReloadCurrentPageWithHash
                    )
                })
                affichage.displayElement(document, 'update-banner')
            } else {
                var previousHash = document.location.hash
                document.addEventListener(
                    'pageChanged:nouvelleversiondisponible',
                    function (event) {
                        var refreshButton = document.querySelector(
                            '#nouvelle-version-disponible-block #refresh-button'
                        )
                        refreshButton.setAttribute('href', previousHash)
                        refreshButton.addEventListener(
                            'click',
                            that.forceReloadCurrentPageWithHash
                        )
                    }
                )
                this.goToPage('nouvelleversiondisponible')
            }
        }
    }

    this.forceReloadCurrentPageWithHash = function (event) {
        // This one is tricky: we let the browser go to the anchor we just set
        // (no preventDefault) and just after that (timeout=1) we reload the
        // page with `true` parameter == reload from server.
        setTimeout(function () {
            window.location.reload(true)
        }, 1)
    }

    this.isFillingQuestionnaire = function () {
        var page = document.location.hash.slice(1)
        return (
            page === 'residence' ||
            page === 'activitepro' ||
            page === 'foyer' ||
            page === 'caracteristiques' ||
            page === 'antecedents' ||
            page === 'symptomesactuels' ||
            page === 'symptomespasses' ||
            page === 'contactarisque'
        )
    }

    this.goToPage = function (name) {
        document.location.hash = name
    }

    this.loadPage = function (pageName) {
        var page = document.querySelector('section#page')
        var section = document.querySelector('#' + pageName)
        var clone = section.cloneNode(true)
        page.innerHTML = '' // Flush the current content.
        var element = page.insertAdjacentElement('afterbegin', clone.firstElementChild)
        element.scrollIntoView({ behavior: 'smooth' })

        onPageLoadScripts[pageName] && onPageLoadScripts[pageName](element, pageName)

        var customPageEvent = document.createEvent('CustomEvent')
        customPageEvent.initCustomEvent('pageChanged:' + pageName, true, true, name)
        document.dispatchEvent(customPageEvent)
    }
}
navigation = new Navigation()

var OnSubmitFormScripts = function () {
    this.residence = function (event) {
        event.preventDefault()
        questionnaire.departement = event.target.elements['departement'].value
        stockageLocal.enregistrer(questionnaire)
        navigation.goToPage('activitepro')
    }

    this.activitepro = function (event) {
        event.preventDefault()
        questionnaire.activite_pro = event.target.elements['activite_pro'].checked
        questionnaire.activite_pro_public =
            event.target.elements['activite_pro_public'].checked
        questionnaire.activite_pro_sante =
            event.target.elements['activite_pro_sante'].checked
        stockageLocal.enregistrer(questionnaire)
        navigation.goToPage('foyer')
    }

    this.foyer = function (event) {
        event.preventDefault()
        questionnaire.foyer_enfants = event.target.elements['foyer_enfants'].checked
        questionnaire.foyer_fragile = event.target.elements['foyer_fragile'].checked
        stockageLocal.enregistrer(questionnaire)
        navigation.goToPage('caracteristiques')
    }

    this.caracteristiques = function (event) {
        event.preventDefault()
        questionnaire.sup65 = event.target.elements['sup65'].checked
        questionnaire.grossesse_3e_trimestre =
            event.target.elements['grossesse_3e_trimestre'].checked
        questionnaire.poids = event.target.elements['poids'].value
        questionnaire.taille = event.target.elements['taille'].value
        stockageLocal.enregistrer(questionnaire)
        navigation.goToPage('antecedents')
    }

    this.antecedents = function (event) {
        event.preventDefault()
        questionnaire.antecedent_cardio =
            event.target.elements['antecedent_cardio'].checked
        questionnaire.antecedent_diabete =
            event.target.elements['antecedent_diabete'].checked
        questionnaire.antecedent_respi =
            event.target.elements['antecedent_respi'].checked
        questionnaire.antecedent_dialyse =
            event.target.elements['antecedent_dialyse'].checked
        questionnaire.antecedent_cancer =
            event.target.elements['antecedent_cancer'].checked
        questionnaire.antecedent_immunodep =
            event.target.elements['antecedent_immunodep'].checked
        questionnaire.antecedent_cirrhose =
            event.target.elements['antecedent_cirrhose'].checked
        questionnaire.antecedent_drepano =
            event.target.elements['antecedent_drepano'].checked
        questionnaire.antecedent_chronique_autre =
            event.target.elements['antecedent_chronique_autre'].checked
        stockageLocal.enregistrer(questionnaire)
        navigation.goToPage('symptomesactuels')
    }

    this.symptomesactuels = function (event) {
        event.preventDefault()
        questionnaire.symptomes_actuels =
            event.target.elements['symptomes_actuels'].checked
        if (questionnaire.symptomes_actuels) {
            // On complète manuellement le formulaire pour le rendre complet.
            questionnaire.symptomes_passes = false
            questionnaire.contact_a_risque = false
            stockageLocal.enregistrer(questionnaire)
            navigation.goToPage('conseilssymptomesactuels')
        } else {
            stockageLocal.enregistrer(questionnaire)
            navigation.goToPage('symptomespasses')
        }
    }

    this.symptomespasses = function (event) {
        event.preventDefault()
        questionnaire.symptomes_passes =
            event.target.elements['symptomes_passes'].checked
        if (questionnaire.symptomes_passes) {
            // On complète manuellement le formulaire pour le rendre complet.
            questionnaire.contact_a_risque = false
            stockageLocal.enregistrer(questionnaire)
            navigation.goToPage('conseilssymptomespasses')
        } else {
            stockageLocal.enregistrer(questionnaire)
            navigation.goToPage('contactarisque')
        }
    }

    this.contactarisque = function (event) {
        event.preventDefault()
        questionnaire.contact_a_risque =
            event.target.elements['contact_a_risque'].checked
        stockageLocal.enregistrer(questionnaire)
        if (questionnaire.contact_a_risque) {
            navigation.goToPage('conseilscontactarisque')
        } else {
            navigation.goToPage('conseils')
        }
    }
}

var onSubmitFormScripts = new OnSubmitFormScripts()

var OnPageLoadScripts = function () {
    this.introduction = function (element, pageName) {
        if (questionnaire.isComplete()) {
            affichage.displayElement(element, 'js-questionnaire-full')
            affichage.hideElement(element.querySelector('#js-questionnaire-empty'))
            var mesConseilsLink = element.querySelector('#mes-conseils-link')
            var target = navigation.redirectIfMissingData(
                'findCorrectExit',
                questionnaire
            )
            mesConseilsLink.setAttribute('href', '#' + target)
        }
    }

    this.residence = function (form, pageName) {
        formUtils.preloadForm(form, 'departement')
        form.addEventListener('submit', onSubmitFormScripts[pageName])
        document
            .getElementById('geolocalisation')
            .addEventListener('click', geolocalisation)
    }

    this.activitepro = function (form, pageName) {
        formUtils.preloadCheckboxForm(form, 'activite_pro')
        formUtils.preloadCheckboxForm(form, 'activite_pro_public')
        formUtils.preloadCheckboxForm(form, 'activite_pro_sante')
        var primary = form.elements['activite_pro']
        formUtils.enableOrDisableSecondaryFields(form, primary)
        primary.addEventListener('click', function () {
            formUtils.enableOrDisableSecondaryFields(form, primary)
        })
        form.addEventListener('submit', onSubmitFormScripts[pageName])
    }

    this.foyer = function (form, pageName) {
        formUtils.preloadCheckboxForm(form, 'foyer_enfants')
        formUtils.preloadCheckboxForm(form, 'foyer_fragile')
        form.addEventListener('submit', onSubmitFormScripts[pageName])
    }

    this.caracteristiques = function (form, pageName) {
        formUtils.preloadCheckboxForm(form, 'sup65')
        formUtils.preloadCheckboxForm(form, 'grossesse_3e_trimestre')
        formUtils.preloadForm(form, 'taille')
        formUtils.preloadForm(form, 'poids')
        form.addEventListener('submit', onSubmitFormScripts[pageName])
    }

    this.antecedents = function (form, pageName) {
        var button = form.querySelector('input[type=submit]')
        formUtils.preloadCheckboxForm(form, 'antecedent_cardio')
        formUtils.preloadCheckboxForm(form, 'antecedent_diabete')
        formUtils.preloadCheckboxForm(form, 'antecedent_respi')
        formUtils.preloadCheckboxForm(form, 'antecedent_dialyse')
        formUtils.preloadCheckboxForm(form, 'antecedent_cancer')
        formUtils.preloadCheckboxForm(form, 'antecedent_immunodep')
        formUtils.preloadCheckboxForm(form, 'antecedent_cirrhose')
        formUtils.preloadCheckboxForm(form, 'antecedent_drepano')
        formUtils.preloadCheckboxForm(form, 'antecedent_chronique_autre')
        formUtils.toggleFormButtonOnCheck(form, button.value, 'Continuer')
        form.addEventListener('submit', onSubmitFormScripts[pageName])
    }

    this.symptomesactuels = function (form, pageName) {
        var button = form.querySelector('input[type=submit]')
        formUtils.preloadCheckboxForm(form, 'symptomes_actuels')
        formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
        form.addEventListener('submit', onSubmitFormScripts[pageName])
    }

    this.symptomespasses = function (form, pageName) {
        var button = form.querySelector('input[type=submit]')
        formUtils.preloadCheckboxForm(form, 'symptomes_passes')
        formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
        form.addEventListener('submit', onSubmitFormScripts[pageName])
    }

    this.contactarisque = function (form, pageName) {
        var button = form.querySelector('input[type=submit]')
        formUtils.preloadCheckboxForm(form, 'contact_a_risque')
        var primary = form.elements['contact_a_risque']
        formUtils.enableOrDisableSecondaryFields(form, primary)
        primary.addEventListener('click', function () {
            formUtils.enableOrDisableSecondaryFields(form, primary)
        })
        formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
        form.addEventListener('submit', onSubmitFormScripts[pageName])
    }

    this.conseils = function (element, pageName) {
        // Hide all conseils that might have been made visible on previous runs.
        affichage.hideSelector(element, '.visible')

        // Display appropriate conseils.
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        var data = algorithme.getData()

        var blockNames = algorithme.statutBlockNamesToDisplay(data)
        blockNames = blockNames.concat(algorithme.departementBlockNamesToDisplay(data))
        blockNames = blockNames.concat(algorithme.activiteProBlockNamesToDisplay(data))
        blockNames = blockNames.concat(algorithme.foyerBlockNamesToDisplay(data))
        blockNames = blockNames.concat(
            algorithme.caracteristiquesAntecedentsBlockNamesToDisplay(data)
        )

        affichage.displayBlocks(element, blockNames)

        // Dynamic data injections.
        injectionScripts.departement(element, data)
    }

    this.conseilssymptomespasses = function (element, pageName) {
        // Hide all conseils that might have been made visible on previous runs.
        affichage.hideSelector(element, '.visible')

        // Display appropriate conseils.
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        var data = algorithme.getData()

        var blockNames = algorithme.symptomesPassesBlockNamesToDisplay(data)
        blockNames = blockNames.concat(algorithme.departementBlockNamesToDisplay(data))

        affichage.displayBlocks(element, blockNames)

        // Dynamic data injections.
        injectionScripts.departement(element, data)
    }

    this.conseilscontactarisque = function (element, pageName) {
        // Hide all conseils that might have been made visible on previous runs.
        affichage.hideSelector(element, '.visible')

        // Display appropriate conseils.
        var algorithme = new Algorithme(questionnaire, carteDepartements)
        var data = algorithme.getData()

        var blockNames = algorithme.departementBlockNamesToDisplay(data)

        affichage.displayBlocks(element, blockNames)

        // Dynamic data injections.
        injectionScripts.departement(element, data)
    }
}

var onPageLoadScripts = new OnPageLoadScripts()

var InjectionScrips = function () {
    this.departement = function (element, data) {
        affichage.injectContent(
            element,
            carteDepartements.nom(data.departement),
            '#nom-departement'
        )
        affichage.injectAttribute(
            element,
            'href',
            carteDepartements.lien_prefecture(data.departement),
            '#lien-prefecture'
        )
    }
}

var injectionScripts = new InjectionScrips()
