class AlgorithmeSuivi {
    constructor(profil) {
        this.suivi = profil.suivi
        this.dernierEtat = profil.dernierEtat()
    }

    get gravite() {
        let gravite = 0
        if (
            this.dernierEtat.fievre === 'oui' ||
            this.dernierEtat.diarrheeVomissements === 'oui'
        ) {
            gravite = 1
        }
        if (
            this.dernierEtat.essoufflement === 'pire' ||
            this.dernierEtat.etatGeneral === 'pire' ||
            this.dernierEtat.alimentationHydratation === 'oui'
        ) {
            gravite = 2
        }
        if (
            this.dernierEtat.essoufflement === 'critique' ||
            this.dernierEtat.etatGeneral === 'critique'
        ) {
            gravite = 3
        }
        return gravite
    }

    graviteBlockNameToDisplay() {
        return `suivi-gravite-${this.gravite}`
    }

    get psy() {
        let psy = 0
        if (this.dernierEtat.etatPsychologique === 'critique') {
            psy = this.gravite === 0 ? 1 : 2
        }
        return psy
    }

    psyBlockNameToDisplay() {
        return `suivi-psy-${this.psy}`
    }
}

module.exports = {
    AlgorithmeSuivi,
}
