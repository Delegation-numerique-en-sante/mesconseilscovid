export default class AlgorithmeSuivi {
    constructor(profil) {
        this.profil = profil
        this.dernierEtat = profil.dernierEtat()
    }

    calculGravite(etat) {
        let gravite = 0
        if (
            etat.fievre === 'oui' ||
            etat.diarrheeVomissements === 'oui' ||
            etat.toux === 'oui'
        ) {
            gravite = 1
        }
        if (
            etat.essoufflement === 'pire' ||
            etat.etatGeneral === 'pire' ||
            etat.confusion === 'oui' ||
            etat.alimentationHydratation === 'oui' ||
            etat.mauxDeTete === 'oui'
        ) {
            gravite = 2
        }
        if (etat.essoufflement === 'critique' || etat.etatGeneral === 'critique') {
            gravite = 3
        }
        return gravite
    }

    get gravite() {
        return this.calculGravite(this.dernierEtat)
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

    evolutionsBlockNamesToDisplay() {
        let evolutions = []
        const etat = this.dernierEtat
        if (etat.essoufflement === 'critique') {
            evolutions.push('essoufflement-gravite-3')
        }
        if (etat.essoufflement === 'pire') {
            evolutions.push('essoufflement-gravite-2')
        }
        if (etat.etatGeneral === 'critique') {
            evolutions.push('etat-general-gravite-3')
        }
        if (etat.etatGeneral === 'pire') {
            evolutions.push('etat-general-gravite-2')
        }
        if (etat.confusion === 'oui') {
            evolutions.push('confusion-gravite-2')
        }
        if (etat.alimentationHydratation === 'oui') {
            evolutions.push('alimentation-hydratation-gravite-2')
        }
        if (etat.etatPsychologique === 'critique') {
            evolutions.push('etat-psychologique-gravite-3')
        }
        if (etat.fievre === 'oui') {
            evolutions.push('fievre-gravite-1')
        }
        if (etat.diarrheeVomissements === 'oui') {
            evolutions.push('diarrhee-vomissements-gravite-1')
        }
        if (etat.mauxDeTete === 'oui') {
            evolutions.push('maux-de-tete-gravite-2')
        }
        if (etat.toux === 'oui') {
            evolutions.push('toux-gravite-1')
        }
        return evolutions
    }
}
