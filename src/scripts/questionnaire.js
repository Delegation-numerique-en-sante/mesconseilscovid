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
            symptomes: (profil) => profil.isVaccinsComplete(),
        },
    },
    symptomes: {
        previous: { vaccins: () => true },
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
            conseils: (profil) => profil.isSanteComplete() && profil.age >= 15,
            pediatrie: (profil) => profil.isSanteComplete() && profil.age < 15,
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
        while (step) {
            if (step === page) {
                console.debug('success!')
                return
            }

            const nextStep = this.nextPage(step, profil)
            if (!nextStep) break
            if (steps.indexOf(nextStep) > -1) break // avoid loops

            console.debug(`next step: ${nextStep}`)
            step = nextStep
            steps.push(step)
        }
        console.debug(`could not reach ${page} via steps:`, steps)

        const lastReachablePage = steps[steps.length - 1]
        console.debug(`redirecting to ${lastReachablePage}`)
        return lastReachablePage
    }

    // Détermine la page suivante du questionnaire en fonction des réponses
    // données jusqu’ici. Les pages suivantes potentielles sont listées de
    // manière ordonnée. La page choisie est la première dont le prédicat
    // est vérifié.
    nextPage(currentPage, profil) {
        return this.findNeighbor('next', currentPage, profil)
    }

    // Détermine la page précédente du questionnaire, pour pouvoir inclure
    // un lien « Retour » à chaque étape.
    previousPage(currentPage, profil) {
        return this.findNeighbor('previous', currentPage, profil)
    }

    findNeighbor(direction, currentPage, profil) {
        const question = this.transitions[currentPage]
        if (typeof question === 'undefined') return
        if (typeof question[direction] === 'undefined') return

        let result
        Object.keys(question[direction]).forEach((dest) => {
            const predicate = question[direction][dest]
            if (predicate(profil)) {
                console.debug(`matched predicate for ${dest}:`, predicate)
                if (!result) result = dest
            } else {
                console.debug(`did not match predicate for ${dest}:`, predicate)
            }
        })
        if (result) return result
        console.debug(`no ${direction} reachable page for ${currentPage}`)
    }

    // Détermine la progression dans le questionnaire (p. ex. « 2/8»)
    progress(currentPage) {
        const num = this.ordre.indexOf(currentPage) + 1
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
