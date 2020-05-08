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
    this.db = new PouchDB('local')

    this.supprimer = function () {
        var that = this
        this.db
            .destroy()
            .then(function (response) {
                that.db = new PouchDB('local')
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    this.charger = function (questionnaire) {
        return this.db.get('mes_infos').then(
            function (data) {
                console.debug('Données locales:')
                console.table(data)
                questionnaire.fillData(data)
            },
            function (err) {
                console.debug('Pas de données locales pour l’instant')
            }
        )
    }

    this.enregistrer = function (questionnaire) {
        return this._upsert('mes_infos', questionnaire.getData())
            .then(function (response) {
                console.debug('Les réponses au questionnaire ont bien été enregistrées')
                console.debug(response)
            })
            .catch(function (error) {
                console.error(
                    'Les réponses au questionnaire n’ont pas pu être enregistrées'
                )
                console.error(error)
            })
    }

    this._upsert = function (_id, data) {
        var that = this
        return this.db
            .get(_id)
            .then(function (doc) {
                var record = Object.assign(
                    {
                        _id: _id,
                        _rev: doc._rev,
                    },
                    data
                )
                return that.db.put(record)
            })
            .catch(function (error) {
                if (error.name === 'not_found') {
                    var record = Object.assign(
                        {
                            _id: _id,
                        },
                        data
                    )
                    return that.db.put(record)
                }
                throw error
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
}
var carteDepartements = new CarteDepartements()

var Questionnaire = function () {
    this.resetData = function () {
        this._departement = ''
        this._activite_pro = false
        this._activite_pro_public = false
        this._activite_pro_sante = false
        this._foyer_enfants = false
        this._foyer_fragile = false
        this._sup65 = false
        this._grossesse_3e_trimestre = false
        this._poids = ''
        this._taille = ''
        this._antecedent_cardio = false
        this._antecedent_diabete = false
        this._antecedent_respi = false
        this._antecedent_dialyse = false
        this._antecedent_cancer = false
        this._antecedent_immunodep = false
        this._antecedent_cirrhose = false
        this._antecedent_drepano = false
        this._antecedent_chronique_autre = false
        this._symptomes_actuels = false
        this._symptomes_passes = false
        this._contact_a_risque = false
    }

    this.fillData = function (data) {
        this._departement = data['departement'] || ''
        this._activite_pro = data['activite_pro'] || false
        this._activite_pro_public = data['activite_pro_public'] || false
        this._activite_pro_sante = data['activite_pro_sante'] || false
        this._foyer_enfants = data['foyer_enfants'] || false
        this._foyer_fragile = data['foyer_fragile'] || false
        this._sup65 = data['sup65'] || false
        this._grossesse_3e_trimestre = data['grossesse_3e_trimestre'] || false
        this._poids = data['poids'] || ''
        this._taille = data['taille'] || ''
        this._antecedent_cardio = data['antecedent_cardio'] || false
        this._antecedent_diabete = data['antecedent_diabete'] || false
        this._antecedent_respi = data['antecedent_respi'] || false
        this._antecedent_dialyse = data['antecedent_dialyse'] || false
        this._antecedent_cancer = data['antecedent_cancer'] || false
        this._antecedent_immunodep = data['antecedent_immunodep'] || false
        this._antecedent_cirrhose = data['antecedent_cirrhose'] || false
        this._antecedent_drepano = data['antecedent_drepano'] || false
        this._antecedent_chronique_autre = data['antecedent_chronique_autre'] || false
        this._symptomes_actuels = data['symptomes_actuels'] || false
        this._symptomes_passes = data['symptomes_passes'] || false
        this._contact_a_risque = data['contact_a_risque'] || false
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

    this.setDomicile = function (departement) {
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

function submitDomicileForm(event) {
    event.preventDefault()
    questionnaire.setDomicile(event.target.elements['departement'].value)
    goToPage('activite-pro')
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
    goToPage('foyer')
}

function submitFoyerForm(event) {
    event.preventDefault()
    questionnaire.setFoyerEnfants(event.target.elements['foyer_enfants'].checked)
    questionnaire.setFoyerFragile(event.target.elements['foyer_fragile'].checked)
    goToPage('caracteristiques')
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
    goToPage('antecedents')
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
    goToPage('symptomes')
}

function submitSymptomesForm(event) {
    event.preventDefault()
    questionnaire.setSymptomesActuels(
        event.target.elements['symptomes_actuels'].checked
    )
    questionnaire.setSymptomesPasses(
        event.target.elements['symptomes_passes'].checked
    )
    questionnaire.setContactARisque(
        event.target.elements['contact_a_risque'].checked
    )
    stockageLocal.enregistrer(questionnaire)
    goToPage('conseils')
}

function resetPrivateData(event) {
    event.preventDefault()
    questionnaire.resetData()
    stockageLocal.supprimer()
    console.debug('Les données personnelles ont été supprimées')
    goToPage('introduction')
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

function displaySymptomesConseils(data, element) {
    if (data.symptomes) {
        displayElement(element, 'conseils-symptomes')
    }
    if (data.symptomes_actuels) {
        displayElement(element, 'conseils-symptomes-actuels')
    }
    if (data.symptomes_passes) {
        if (data.risques) {
            displayElement(element, 'conseils-symptomes-passes-avec-risques')
        } else {
            displayElement(element, 'conseils-symptomes-passes-sans-risques')
        }
    }
    if (data.contact_a_risque) {
        displayElement(element, 'conseils-contact-a-risque')
    }
}

function displayDepartementConseils(data, element) {
    displayElement(element, 'conseils-departement')
    if (data.couleur === 'rouge') {
        displayElement(element, 'conseils-departement-rouge')
    }
    if (data.couleur === 'vert') {
        displayElement(element, 'conseils-departement-vert')
    }
}

function displayActiviteProConseils(data, element) {
    if (!data.contact_a_risque) {
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

function displayCaracteristiquesAntecedentsConseils(data, element) {
    if (data.symptomes_passes) {
        if (data.antecedent_chronique_autre) {
            displayElement(element, 'conseils-caracteristiques')
            displayElement(element, 'conseils-antecedents-chroniques-autres')
        }
    } else {
        if (data.contact_a_risque) {
            displayElement(element, 'conseils-caracteristiques')
            if (data.antecedent_chronique_autre) {
                displayElement(element, 'conseils-antecedents-chroniques-autres')
            }
        } else {
            displayElement(element, 'conseils-caracteristiques')
            if (data.sup65 || data.imc > 30 || data.antecedents) {
                displayElement(element, 'conseils-caracteristiques-antecedents')
            }
            if (data.antecedent_chronique_autre) {
                displayElement(element, 'conseils-antecedents-chroniques-autres')
            }
        }
    }
}

function displayGeneralConseils(data, element) {
    if (!data.contact_a_risque) {
        displayElement(element, 'conseils-generaux')
    }
}

function displayConseils(element) {
    // Hide all conseils that might have been made visible on previous runs.
    Array.from(element.querySelectorAll('.visible')).forEach(hideElement)
    var algorithme = new Algorithme(questionnaire, carteDepartements)
    var data = algorithme.getData()
    displaySymptomesConseils(data, element)
    displayDepartementConseils(data, element)
    displayActiviteProConseils(data, element)
    displayFoyerConseils(data, element)
    displayCaracteristiquesAntecedentsConseils(data, element)
    displayGeneralConseils(data, element)
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
        return (
            data.symptomes_actuels ||
            data.symptomes_passes ||
            data.contact_a_risque
        )
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

function goToPage(name) {
    document.location.hash = name
}

function loadPage(name) {
    var page = document.querySelector('section#page')
    var template = document.querySelector('#' + name)
    var clone = template.content.cloneNode(true)
    page.innerHTML = '' // Flush the current content.
    var element = page.insertAdjacentElement('afterbegin', clone.firstElementChild)
    element.scrollIntoView({behavior: 'smooth'})
}

;(function () {
    stockageLocal.charger(questionnaire).finally(function () {
        var hash = document.location.hash
        loadPage(hash ? hash.slice(1) : 'introduction')

        window.addEventListener('hashchange', function (event) {
            var hash = document.location.hash && document.location.hash.slice(1)
            hash && loadPage(hash)
        })
    })
})()
