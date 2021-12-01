// Données privées, stockées uniquement en local.
import localforage from 'localforage'

export default class StockageLocal {
    getSource() {
        return localforage.getItem('source')
    }

    setSource(source) {
        return localforage.setItem('source', source)
    }

    getProfilActuel() {
        return localforage.getItem('profil')
    }

    setProfilActuel(nom) {
        return localforage.setItem('profil', nom)
    }

    unsetProfilActuel() {
        return localforage.removeItem('profil')
    }

    getProfil(nom) {
        return localforage.getItem(nom)
    }

    getProfils() {
        return localforage
            .keys()
            .then((noms) => {
                return noms.filter((nom) => nom != 'profil')
            })
            .then((noms) => {
                return noms.sort((a, b) => {
                    // Make sure we return my profile first.
                    if (a === 'mes_infos') return -1
                    else if (b === 'mes_infos') return 1
                    else if (a < b) return -1
                    else if (b > a) return 1
                    else return 0
                })
            })
    }

    supprimerTout() {
        return this.unsetProfilActuel().then(() =>
            this.getProfils().then((noms) => Promise.all(noms.map(this._supprimer)))
        )
    }

    supprimer(nom) {
        return this._supprimer(nom)
            .then(() => {
                console.debug(`Les données personnelles ont été supprimées (${nom})`)
                return
            })
            .catch((error) => {
                console.error(
                    `Erreur lors de la suppression des données personnelles (${nom})`
                )
                console.error(error)
            })
    }

    _supprimer(nom) {
        return localforage.removeItem(nom)
    }

    charger(profil) {
        return localforage
            .getItem(profil.nom)
            .then((data) => {
                if (data !== null) {
                    profil.fillData(data)
                } else {
                    profil.resetData()
                }
                return profil
            })
            .catch((error) => {
                console.error(
                    `Erreur de chargement des données locales (${profil.nom})`
                )
                console.error(error)
            })
    }

    enregistrer(profil) {
        return localforage
            .setItem(profil.nom, profil.getData())
            .then((data) => {
                console.debug(
                    `Les réponses au questionnaire ont bien été enregistrées (${profil.nom})`
                )
                console.debug(data)
            })
            .catch((error) => {
                console.error(
                    `Les réponses au questionnaire n’ont pas pu être enregistrées (${profil.nom})`
                )
                console.error(error)
            })
    }
}
