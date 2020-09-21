const questions = {
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
    },
    antecedents: {
        previous: () => 'foyer',
        next: () => 'caracteristiques',
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
    },
    activitepro: {
        previous: () => 'caracteristiques',
        next: () => 'symptomesactuels',
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
    },
    contactarisque: {
        previous: () => 'symptomespasses',
        next: () => 'conseils',
    },
    suividate: {
        previous: () => 'suiviintroduction',
        next: () => 'suivisymptomes',
    },
    suivisymptomes: {
        previous: () => 'suiviintroduction',
        next: () => 'conseils',
    },
    conseils: {},
}

class Questionnaire {
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
