var utils = require('../utils.js')

class AlgorithmeDeconfinement {
    constructor(profil, algoOrientation) {
        this.profil = profil
        this.algoOrientation = algoOrientation
    }

    isQuarantaineDone() {
        let delta = 8
        if (this.algoOrientation.personne_fragile) {
            delta = 10
        }
        const now = new Date()
        const finDeQuarantaine = utils.joursApres(
            delta,
            this.profil.symptomes_start_date
        )
        return now > finDeQuarantaine
    }

    isSuiviRegulier() {
        // Au moins une entrée ces dernières 24h + une entrée ces dernières 48h.
        const maintenant = utils.joursAvant(0)
        const ilYA24h = utils.joursAvant(1)
        const ilYA48h = utils.joursAvant(2)
        return (
            this.profil.suiviEntre(ilYA24h, maintenant).length >= 1 &&
            this.profil.suiviEntre(ilYA48h, ilYA24h).length >= 1
        )
    }

    isFievreDone() {
        return this.profil.suiviDerniersJours(2).every((etat) => {
            if (etat.symptomes) {
                return etat.fievre === 'non'
            } else {
                return true
            }
        })
    }

    isEssoufflementDone() {
        return this.profil.suiviDerniersJours(2).every((etat) => {
            if (etat.symptomes) {
                return (
                    etat.essoufflement === 'mieux' ||
                    etat.essoufflement === 'stable' ||
                    etat.essoufflement === 'aucun'
                )
            } else {
                return true
            }
        })
    }

    isDeconfinable() {
        return (
            this.isQuarantaineDone() &&
            this.isSuiviRegulier() &&
            this.isFievreDone() &&
            this.isEssoufflementDone()
        )
    }
}

module.exports = {
    AlgorithmeDeconfinement,
}
