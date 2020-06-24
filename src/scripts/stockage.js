// Données privées, stockées uniquement en local

var localforage = require('localforage')

class StockageLocal {
    getProfilActuel() {
        return localforage.getItem('profil').then(function (value) {
            return value || 'mes_infos'
        })
    }

    setProfilActuel(nom) {
        return localforage.setItem('profil', nom)
    }

    supprimer() {
        return localforage
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

    charger(profil, nom) {
        return localforage.getItem(nom).then(
            function (data) {
                if (data !== null) {
                    console.debug('Données locales:')
                    console.log(data)
                    profil.fillData(data)
                } else {
                    console.debug('Pas de données locales pour l’instant')
                }
            },
            function (error) {
                console.error('Erreur de chargement des données locales ' + error)
            }
        )
    }

    enregistrer(profil, nom) {
        return localforage
            .setItem(nom, profil.getData())
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
