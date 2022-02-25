import type Profil from '../profil'
import { differenceEnJours, joursAvant } from '../utils'

export default class AlgorithmeDeconfinement {
    profil: Profil

    constructor(profil: Profil) {
        this.profil = profil
    }

    isQuarantaineDone() {
        return (
            differenceEnJours(this.profil.symptomes_start_date!, new Date()) >=
            this.profil.dureeIsolement()
        )
    }

    isSuiviRegulier() {
        // Au moins une entrée ces dernières 24h + une entrée ces dernières 48h.
        const maintenant = joursAvant(0)
        const ilYA24h = joursAvant(1)
        const ilYA48h = joursAvant(2)
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
