// Représentation de la structure du questionnaire d’orientation
export const ORIENTATION = {
    nom: {
        previous: () => 'introduction',
        next: { residence: (profil) => profil.nom },
    },
    residence: {
        num: 4,
        previous: () => 'contactarisque',
        next: { foyer: (profil) => profil.isResidenceComplete() },
    },
    foyer: {
        num: 5,
        previous: () => 'residence',
        next: { antecedents: (profil) => profil.isFoyerComplete() },
    },
    antecedents: {
        num: 6,
        previous: () => 'foyer',
        next: { caracteristiques: (profil) => profil.isAntecedentsComplete() },
    },
    caracteristiques: {
        num: 7,
        previous: () => 'antecedents',
        next: {
            activitepro: (profil) =>
                profil.isCaracteristiquesComplete() && profil.age >= 15,
            pediatrie: (profil) =>
                profil.isCaracteristiquesComplete() && profil.age < 15,
        },
    },
    activitepro: {
        num: 8,
        previous: () => 'caracteristiques',
        next: {
            conseils: (profil) => profil.isActiviteProComplete(),
        },
    },
    symptomesactuels: {
        num: 1,
        previous: () => 'introduction',
        next: {
            conseils: (profil) =>
                profil.isSymptomesActuelsComplete() &&
                profil.hasSymptomesActuelsReconnus(),
            symptomespasses: (profil) =>
                profil.isSymptomesActuelsComplete() &&
                !profil.hasSymptomesActuelsReconnus(),
        },
    },
    suividate: {
        previous: () => 'suiviintroduction',
        next: {
            suivisymptomes: (profil) => profil.suivi_start_date,
        },
    },
    suivisymptomes: {
        previous: () => 'suiviintroduction',
        next: {
            conseils: () => true,
        },
    },
    symptomespasses: {
        num: 2,
        previous: () => 'symptomesactuels',
        next: {
            conseils: (profil) =>
                profil.isSymptomesPassesComplete() && profil.symptomes_passes,
            contactarisque: (profil) => profil.isSymptomesPassesComplete(),
        },
    },
    contactarisque: {
        num: 3,
        previous: () => 'symptomespasses',
        next: {
            conseils: (profil) =>
                profil.isContactARisqueComplete() &&
                profil.contact_a_risque &&
                !profil.contact_a_risque_autre,
            residence: (profil) => profil.isContactARisqueComplete(),
        },
    },
    conseils: {},
}

export class Questionnaire {
    constructor(orientation = ORIENTATION) {
        this.orientation = orientation
        this.total = 0
        Object.keys(orientation).forEach((pageName) => {
            const question = orientation[pageName]
            if (question.num == 1) {
                this.firstPage = pageName
            }
            if (question.num > this.total) {
                this.total = question.num
            }
        })
    }

    before(page, profil) {
        const question = this.orientation[page]
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
        const question = this.orientation[currentPage]
        if (typeof question === 'undefined') return
        if (typeof question.next === 'undefined') return

        let nextPage
        Object.keys(question.next).forEach((dest) => {
            const predicate = question.next[dest]
            if (predicate(profil)) {
                console.debug(`matched predicate for ${dest}:`, predicate)
                if (!nextPage) nextPage = dest
            } else {
                console.debug(`did not match predicate for ${dest}:`, predicate)
            }
        })
        if (nextPage) return nextPage
        console.debug(`no reachable page after ${currentPage}`)
    }

    // Détermine la progression dans le questionnaire (p. ex. « 2/8»)
    progress(currentPage) {
        const question = this.orientation[currentPage]
        if (typeof question.num === 'undefined') return ''

        return `${question.num}/${this.total} - `
    }

    // Détermine la page précédente du questionnaire, pour pouvoir inclure
    // un lien « Retour » à chaque étape.
    previousPage(currentPage) {
        const question = this.orientation[currentPage]
        if (typeof question.previous === 'undefined') return

        return question.previous()
    }
}
export default Questionnaire
