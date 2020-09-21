export const questions = {
    nom: {
        previous: () => 'introduction',
        next: () => 'residence',
    },
    residence: {
        previous: () => 'introduction',
        next: () => 'foyer',
    },
    foyer: {
        previous: () => 'residence',
        next: () => 'antecedents',
        before: (profil) => {
            if (!profil.isResidenceComplete()) return 'residence'
        },
    },
    antecedents: {
        previous: () => 'foyer',
        next: () => 'caracteristiques',
        before: (profil) => {
            const target = questions.foyer.before(profil)
            if (target) return target

            if (!profil.isFoyerComplete()) return 'foyer'
        },
    },
    caracteristiques: {
        previous: () => 'antecedents',
        next: (profil) => {
            if (profil.age < 15) {
                return 'pediatrie'
            } else {
                return 'activitepro'
            }
        },
        before: (profil) => {
            const target = questions.antecedents.before(profil)
            if (target) return target

            if (!profil.isAntecedentsComplete()) return 'antecedents'
        },
    },
    activitepro: {
        previous: () => 'caracteristiques',
        next: () => 'symptomesactuels',
        before: (profil) => {
            const target = questions.caracteristiques.before(profil)
            if (target) return target
            if (profil.age < 15) return 'pediatrie'
            if (!profil.isCaracteristiquesComplete()) return 'caracteristiques'
        },
    },
    symptomesactuels: {
        previous: () => 'activitepro',
        next: (profil) => {
            if (profil.symptomes_actuels && !profil.symptomes_actuels_autre) {
                if (profil.symptomes_start_date) {
                    return 'suiviintroduction'
                } else {
                    return 'suividate'
                }
            } else {
                return 'symptomespasses'
            }
        },
        before: (profil) => {
            const target = questions.activitepro.before(profil)
            if (target) return target

            // Si la personne a coché une activité pro, on propose à nouveau cet écran
            // pour prendre en compte la nouvelle case : profession libérale.
            if (
                profil.activite_pro &&
                typeof profil.activite_pro_liberal === 'undefined'
            )
                return 'activitepro'

            if (!profil.isActiviteProComplete()) return 'activitepro'
        },
    },
    symptomespasses: {
        previous: () => 'symptomesactuels',
        next: (profil) => {
            if (profil.symptomes_passes) {
                return 'conseils'
            } else {
                return 'contactarisque'
            }
        },
        before: (profil) => {
            const target = questions.symptomesactuels.before(profil)
            if (target) return target
            if (!profil.isSymptomesActuelsComplete()) return 'symptomesactuels'
            if (
                profil.symptomes_actuels === true &&
                profil.symptomes_actuels_autre === false
            )
                return 'conseils'
        },
    },
    contactarisque: {
        previous: () => 'symptomespasses',
        next: () => 'conseils',
        before: (profil) => {
            const target = questions.symptomespasses.before(profil)
            if (target) return target
            if (!profil.isSymptomesPassesComplete()) return 'symptomespasses'
            if (profil.symptomes_passes === true) return 'conseils'
        },
    },
    suiviintroduction: {
        before: (profil) => {
            if (!profil.isComplete()) return 'conseils'
        },
    },
    suividate: {
        previous: () => 'suiviintroduction',
        next: () => 'suivisymptomes',
        before: (profil) => {
            if (!profil.isComplete()) return 'conseils'
        },
    },
    suivisymptomes: {
        previous: () => 'suiviintroduction',
        next: () => 'conseils',
        before: (profil) => {
            if (!profil.isComplete()) return 'conseils'
            if (!profil.hasSymptomesStartDate()) return 'suividate'
        },
    },
    suivihistorique: {
        before: (profil) => {
            if (!profil.isComplete()) return 'conseils'
            if (!profil.hasSymptomesStartDate()) return 'suividate'
            if (!profil.hasHistorique()) return 'suiviintroduction'
        },
    },
    conseils: {
        before: (profil) => {
            if (profil.isContactARisqueComplete()) {
                return questions.contactarisque.before(profil)
            } else if (profil.isSymptomesPassesComplete()) {
                if (profil.symptomes_passes === false) {
                    return 'contactarisque'
                } else {
                    return questions.symptomespasses.before(profil)
                }
            } else if (profil.isSymptomesActuelsComplete()) {
                if (
                    profil.symptomes_actuels === false ||
                    profil.symptomes_actuels_autre === true
                ) {
                    return 'symptomespasses'
                } else {
                    return questions.symptomesactuels.before(profil)
                }
            } else {
                return questions.symptomesactuels.before(profil) || 'symptomesactuels'
            }
        },
    },
}

class Questionnaire {
    before(page) {
        const question = questions[page]
        if (typeof question !== 'undefined') return question.before
    }
    nextPage(currentPage, profil) {
        const question = questions[currentPage]
        if (typeof question.next !== 'undefined') return question.next(profil)
    }
    previousPage(currentPage) {
        const question = questions[currentPage]
        if (typeof question.previous !== 'undefined') return question.previous()
    }
}
export default Questionnaire
