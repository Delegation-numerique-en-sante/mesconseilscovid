export function beforeConseils(profil, questionnaire) {
    if (!profil.isComplete()) return questionnaire.checkPathTo('conseils', profil)
}

export function beforeSuiviIntroduction(profil, questionnaire) {
    if (!profil.suivi_active) return questionnaire.checkPathTo('conseils', profil)
}

export function beforeSuiviSymptomes(profil, questionnaire) {
    if (!profil.suivi_active) return questionnaire.checkPathTo('conseils', profil)
}

export function beforeSuiviHistorique(profil, questionnaire) {
    if (!profil.suivi_active) return questionnaire.checkPathTo('conseils', profil)
}

// Représentation de la structure du questionnaire d’orientation.
export const ORDRE = [
    'vaccins',
    'historique',
    'symptomes',
    'contactarisque',
    'depistage',
    'situation',
    'sante',
]

export const TRANSITIONS = {
    nom: {
        previous: { introduction: () => true },
        next: { symptomes: (profil) => profil.nom },
    },
    vaccins: {
        previous: { introduction: () => true },
        next: {
            historique: (profil) => profil.isVaccinsComplete(),
        },
    },
    historique: {
        previous: { vaccins: () => true },
        next: {
            symptomes: (profil) => profil.isHistoriqueComplete(),
        },
    },
    symptomes: {
        previous: { historique: () => true },
        next: {
            depistage: (profil) =>
                profil.isSymptomesComplete() &&
                profil.hasSymptomesStartDate() &&
                (profil.hasSymptomesActuelsReconnus() || profil.symptomes_passes),
            contactarisque: (profil) =>
                profil.isSymptomesComplete() &&
                !profil.hasSymptomesActuelsReconnus() &&
                !profil.symptomes_passes,
        },
    },
    contactarisque: {
        previous: { symptomes: () => true },
        next: {
            depistage: (profil) => profil.isContactARisqueComplete(),
        },
    },
    depistage: {
        previous: {
            symptomes: (profil) =>
                profil.isSymptomesComplete() &&
                profil.hasSymptomesStartDate() &&
                (profil.hasSymptomesActuelsReconnus() || profil.symptomes_passes),
            contactarisque: (profil) => profil.isContactARisqueComplete(),
        },
        next: {
            situation: (profil) => profil.isDepistageComplete(),
        },
    },
    situation: {
        previous: {
            depistage: (profil) => profil.isDepistageComplete(),
        },
        next: {
            sante: (profil) => profil.isSituationComplete(),
        },
    },
    sante: {
        previous: { situation: () => true },
        next: {
            conseils: (profil) => profil.isSanteComplete(),
        },
    },
    conseils: {},
    suivisymptomes: {
        previous: { conseils: () => true },
        next: {
            conseils: (profil) => profil.isComplete(),
        },
    },
    suivihistorique: {
        previous: { conseils: () => true },
    },
}

export class Questionnaire {
    constructor(transitions = TRANSITIONS, ordre = ORDRE) {
        this.transitions = transitions
        this.ordre = ordre
        this.total = ordre.length
        this.firstPage = ordre[0]
    }

    before(page, profil) {
        const question = this.transitions[page]
        if (typeof question === 'undefined') return

        return this.checkPathTo(page, profil)
    }

    // Vérifie si la page du questionnaire est accessible en l’état.
    // Renvoie `undefined` si c’est OK, ou le nom d’une autre page
    // accessible vers laquelle renvoyer l’utilisateur.
    checkPathTo(page, profil) {
        let step = this.firstPage
        let steps = [step]
        while (typeof step !== 'undefined') {
            if (step === page) {
                return
            }

            const nextStep = this.nextPage(step, profil)
            if (typeof nextStep === 'undefined') break
            if (steps.indexOf(nextStep) > -1) break // avoid loops

            step = nextStep
            steps.push(step)
        }

        const lastReachablePage = steps[steps.length - 1]
        return lastReachablePage
    }

    // Détermine la page suivante du questionnaire en fonction des réponses
    // données jusqu’ici. Les pages suivantes potentielles sont listées de
    // manière ordonnée. La page choisie est la première dont le prédicat
    // est vérifié.
    nextPage(pageName, profil) {
        return this.findNeighbor('next', pageName, profil)
    }

    // Détermine la page précédente du questionnaire, pour pouvoir inclure
    // un lien « Retour » à chaque étape.
    previousPage(pageName, profil) {
        return this.findNeighbor('previous', pageName, profil)
    }

    findNeighbor(direction, pageName, profil) {
        const question = this.transitions[pageName]
        if (typeof question === 'undefined') return
        if (typeof question[direction] === 'undefined') return

        let firstMatch
        Object.keys(question[direction]).forEach((dest) => {
            const predicate = question[direction][dest]
            if (predicate(profil)) {
                if (!firstMatch) firstMatch = dest
            }
        })
        return firstMatch
    }

    numeroEtape(pageName, profil) {
        return this._previousPages(pageName, profil).length
    }

    _previousPages(pageName, profil) {
        let result = []
        pageName = this.previousPage(pageName, profil)
        while (typeof pageName !== 'undefined') {
            result.push(pageName)
            pageName = this.previousPage(pageName, profil)
        }
        return result
    }

    // Détermine la progression dans le questionnaire (p. ex. « 2/8 »)
    etapesRestantes(pageName) {
        const num = this.ordre.indexOf(pageName) + 1
        if (num === 0) return ''

        let message
        const remainingSteps = this.ordre.length - num
        switch (remainingSteps) {
            case 0:
                message = `C’est la dernière étape !`
                break
            case 1:
                message = `Plus qu’une étape !`
                break
            default:
                message = `Il vous reste ${remainingSteps} étapes.`
        }

        return message
    }
}
export default Questionnaire
