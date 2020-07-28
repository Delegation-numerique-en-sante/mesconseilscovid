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
        return utils.joursAvant(delta) > this.profil.symptomes_start_date
    }

    isFievreDone() {
        return this.profil.suiviDernieres48h().every((etat) => etat.fievre === 'non')
    }

    isEssoufflementDone() {
        return this.profil
            .suiviDernieres48h()
            .every((etat) => etat.essoufflement === 'non')
    }

    isDeconfinable() {
        return (
            this.isQuarantaineDone() &&
            this.isFievreDone() &&
            this.isEssoufflementDone()
        )
    }
}

module.exports = {
    AlgorithmeDeconfinement,
}
