// Données privées, stockées uniquement en local

var localforage = require('localforage')

class StockageLocal {
    constructor(name) {
        this.name = name
    }

    supprimer() {
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

    charger(profil) {
        return localforage.getItem(this.name).then(
            function (data) {
                if (data !== null) {
                    console.debug('Données locales:')
                    console.log(data)
                    profil.fillData(data)
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

    enregistrer(profil) {
        return localforage
            .setItem(this.name, profil.getData())
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

module.exports = {
    StockageLocal,
}
