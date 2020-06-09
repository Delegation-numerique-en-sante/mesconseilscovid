var carteDepartements = require('./carte.js')

module.exports = {
    departement: function (element, departement) {
        element.textContent = carteDepartements.nom(departement)
    },

    lienPrefecture: function (element, departement) {
        element.setAttribute('href', carteDepartements.lien_prefecture(departement))
    },

    caracteristiques: function (element, algorithme) {
        if (
            algorithme.profil.sup65 ||
            algorithme.profil.grossesse_3e_trimestre ||
            algorithme.imc > 30
        ) {
            var content = ''
            if (algorithme.profil.sup65) {
                content = 'vous êtes âgé·e de plus de 65 ans'
            } else if (algorithme.profil.grossesse_3e_trimestre) {
                content = 'vous êtes au 3e trimestre de votre grossesse'
            }
            if (algorithme.imc > 30) {
                content += content ? ' et ' : ''
                content +=
                    'vous avez un IMC supérieur à 30 (' +
                    Math.round(algorithme.imc) +
                    ')'
            }
            content += '.'
            element.textContent = content
        }
    },

    antecedents: function (element, algorithme) {
        if (algorithme.antecedents || algorithme.profil.antecedent_chronique_autre) {
            var content = ''
            if (algorithme.antecedents) {
                content = 'Vous avez des antécédents à risque'
            }
            if (algorithme.profil.antecedent_chronique_autre) {
                content += content ? ' et vous ' : 'Vous '
                content +=
                    'avez une maladie chronique, un handicap ' +
                    'ou vous prenez un traitement au long cours'
            }
            content += '.'
            element.textContent = content
        }
    },

    symptomesactuels: function (element, algorithme) {
        if (algorithme.symptomesActuelsReconnus) {
            var symptomes = []
            if (
                algorithme.profil.symptomes_actuels_temperature ||
                algorithme.profil.symptomes_actuels_temperature_inconnue
            ) {
                symptomes.push('vous avez de la température (ou vous ne savez pas)')
            }
            if (algorithme.profil.symptomes_actuels_toux) {
                symptomes.push('vous avez de la toux')
            }
            if (algorithme.profil.symptomes_actuels_odorat) {
                symptomes.push('vous avez perdu l’odorat')
            }
            if (algorithme.profil.symptomes_actuels_douleurs) {
                symptomes.push('vous avez des douleurs')
            }
            if (algorithme.profil.symptomes_actuels_diarrhee) {
                symptomes.push('vous avez de la diarrhée')
            }
            if (algorithme.profil.symptomes_actuels_fatigue) {
                symptomes.push('vous êtes fatigué·e')
            }
            if (algorithme.profil.symptomes_actuels_alimentation) {
                symptomes.push('vous avez arrêté de boire ou de manger')
            }
            if (algorithme.profil.symptomes_actuels_souffle) {
                symptomes.push('vous êtes essouflé·e')
            }
            var content = symptomes.join(' ; ') + '.'
            element.textContent = content
        }
    },
}
