// Représentation de la structure du questionnaire d’orientation
export const ORDRE = [
    'symptomesactuels',
    'depistage',
    'symptomespasses',
    'contactarisque',
    'residence',
    'foyer',
    'antecedents',
    'caracteristiques',
    'activitepro',
]

export const TRANSITIONS = {
    nom: {
        previous: () => 'introduction',
        next: { residence: (profil) => profil.nom },
    },
    residence: {
        previous: () => 'contactarisque',
        next: { foyer: (profil) => profil.isResidenceComplete() },
    },
    foyer: {
        previous: () => 'residence',
        next: { antecedents: (profil) => profil.isFoyerComplete() },
    },
    antecedents: {
        previous: () => 'foyer',
        next: { caracteristiques: (profil) => profil.isAntecedentsComplete() },
    },
    caracteristiques: {
        previous: () => 'antecedents',
        next: {
            activitepro: (profil) =>
                profil.isCaracteristiquesComplete() && profil.age >= 15,
            pediatrie: (profil) =>
                profil.isCaracteristiquesComplete() && profil.age < 15,
        },
    },
    activitepro: {
        previous: () => 'caracteristiques',
        next: {
            conseils: (profil) => profil.isActiviteProComplete(),
        },
    },
    symptomesactuels: {
        previous: () => 'introduction',
        next: {
            depistage: (profil) => profil.isSymptomesActuelsComplete(),
        },
    },
    depistage: {
        previous: () => 'symptomesactuels',
        next: {
            conseils: (profil) =>
                profil.isDepistageComplete() &&
                (profil.hasSymptomesActuelsReconnus() ||
                    profil.depistage_resultat === 'positif') &&
                !profil.estAsymptomatique(),
            symptomespasses: (profil) => profil.isDepistageComplete(),
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
        previous: () => 'depistage',
        next: {
            conseils: (profil) =>
                profil.isSymptomesPassesComplete() && profil.symptomes_passes,
            contactarisque: (profil) => profil.isSymptomesPassesComplete(),
        },
    },
    contactarisque: {
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
        const question = this.transitions[currentPage]
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
        const num = this.ordre.indexOf(currentPage) + 1
        if (num === 0) return ''

        return `${num}/${this.total} - `
    }

    // Détermine la page précédente du questionnaire, pour pouvoir inclure
    // un lien « Retour » à chaque étape.
    previousPage(currentPage) {
        const question = this.transitions[currentPage]
        if (typeof question.previous === 'undefined') return

        return question.previous()
    }
}
export default Questionnaire
