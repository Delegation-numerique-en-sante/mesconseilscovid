// Données privées, stockées uniquement en local

var localforage = require('localforage')

module.exports = function () {
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
