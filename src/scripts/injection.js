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
                if (content !== '') {
                    content += ' et '
                }
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
                content = 'vous avez des antécédents à risque'
            }
            if (algorithme.profil.antecedent_chronique_autre) {
                if (content !== '') {
                    content += ' et '
                }
                content +=
                    'vous avez une maladie chronique, un handicap ' +
                    'ou vous prenez un traitement au long cours'
            }
            content += '.'
            affichage.injectContent(element, content, '#nom-antecedents')
        }
    },
}
