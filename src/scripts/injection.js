var affichage = require('./affichage.js')
var carteDepartements = require('./carte.js')

module.exports = {
    departement: function (element, departement) {
        affichage.injectContent(
            element,
            carteDepartements.nom(departement),
            '#nom-departement'
        )
        affichage.injectAttribute(
            element,
            'href',
            carteDepartements.lien_prefecture(departement),
            '#lien-prefecture'
        )
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
            affichage.injectContent(element, content, '#nom-caracteristiques')
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
            affichage.injectContent(element, content, '#nom-antecedents')
        }
    },

    symptomesactuels: function (element, algorithme) {
        if (algorithme.symptomesActuelsReconnus) {
            var content = ''
            if (
                algorithme.profil.symptomes_actuels_temperature ||
                algorithme.profil.symptomes_actuels_temperature_inconnue
            ) {
                content = 'vous avez de la température (ou vous ne savez pas)'
            }
            if (algorithme.profil.symptomes_actuels_toux) {
                content += content ? ' et ' : ''
                content += 'vous avez de la toux'
            }
            if (algorithme.profil.symptomes_actuels_odorat) {
                content += content ? ' et ' : ''
                content += 'vous avez perdu l’odorat'
            }
            if (algorithme.profil.symptomes_actuels_douleurs) {
                content += content ? ' et ' : ''
                content += 'vous avez des douleurs'
            }
            if (algorithme.profil.symptomes_actuels_diarrhee) {
                content += content ? ' et ' : ''
                content += 'vous avez de la diarrhée'
            }
            if (algorithme.profil.symptomes_actuels_fatigue) {
                content += content ? ' et ' : ''
                content += 'vous êtes fatigué·e'
            }
            if (algorithme.profil.symptomes_actuels_alimentation) {
                content += content ? ' et ' : ''
                content += 'vous avez arrêté de boire ou de manger'
            }
            if (algorithme.profil.symptomes_actuels_souffle) {
                content += content ? ' et ' : ''
                content += 'vous êtes essouflé·e'
            }
            content += '.'
            affichage.injectContent(element, content, '#nom-symptomesactuels')
        }
    },
}
