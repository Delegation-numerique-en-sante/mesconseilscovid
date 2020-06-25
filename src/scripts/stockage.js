// Données privées, stockées uniquement en local

var localforage = require('localforage')

class StockageLocal {
    constructor() {
        this.localforage = localforage
    }

    getProfilActuel() {
        return localforage.getItem('profil').then(function (value) {
            return value || 'mes_infos'
        })
    }

    setProfilActuel(nom) {
        return localforage.setItem('profil', nom)
    }

    getProfils() {
        return localforage.keys().then((noms) => {
            return noms.filter((nom) => nom != 'profil')
        })
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

    charger(profil) {
        return localforage.getItem(profil.nom).then(
            function (data) {
                if (data !== null) {
                    console.debug('Données locales (' + profil.nom + ') :')
                    console.log(data)
                    profil.fillData(data)
                    return profil
                } else {
                    console.debug(
                        'Pas de données locales pour l’instant (' + profil.nom + ')'
                    )
                }
            },
            function (error) {
                console.error('Erreur de chargement des données locales ' + error)
            }
        )
    }

    enregistrer(profil) {
        return localforage
            .setItem(profil.nom, profil.getData())
            .then(function (data) {
                console.debug(
                    'Les réponses au questionnaire ont bien été enregistrées (' +
                        profil.nom +
                        ')'
                )
                console.debug(data)
            })
            .catch(function (error) {
                console.error(
                    'Les réponses au questionnaire n’ont pas pu être enregistrées (' +
                        profil.nom +
                        ')'
                )
                console.error(error)
            })
    }
}

module.exports = {
    StockageLocal,
}
