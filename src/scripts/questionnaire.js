const questions = {
    nom: {
        next: () => 'residence',
    },
    residence: {
        next: () => 'foyer',
    },
    foyer: {
        next: () => 'antecedents',
    },
    antecedents: {
        next: () => 'caracteristiques',
    },
    caracteristiques: {
        next: (profil) => {
            if (profil.age < 15) {
                return 'pediatrie'
            } else {
                return 'activitepro'
            }
        },
    },
    activitepro: {
        next: () => 'symptomesactuels',
    },
    symptomesactuels: {
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
        next: (profil) => {
            if (profil.symptomes_passes) {
                return 'conseils'
            } else {
                return 'contactarisque'
            }
        },
    },
    contactarisque: {
        next: () => 'conseils',
    },
    suividate: {
        next: () => 'suivisymptomes',
    },
    suivisymptomes: {
        next: () => 'conseils',
    },
    conseils: {},
}

class Questionnaire {
    nextPage(currentPage, profil) {
        const question = questions[currentPage]
        if (typeof question.next !== 'undefined') return question.next(profil)
    }
}
export default Questionnaire
