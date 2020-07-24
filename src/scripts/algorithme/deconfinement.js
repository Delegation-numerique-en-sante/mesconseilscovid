class AlgorithmeDeconfinement {
    constructor(profil, algoOrientation) {
        this.profil = profil
        this.algoOrientation = algoOrientation
    }

    isQuarantaineDone() {
        let delta = 8
        if (this.algoOrientation.facteursDeGraviteMajeurs) {
            delta = 10
        }
        const today = new Date()
        const target = new Date(
            today.setDate(this.profil.symptomes_start_date.getDate() + delta)
        )
        return new Date() > target
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
