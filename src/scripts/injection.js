var affichage = require('./affichage.js')
var carteDepartements = require('./carte.js')

module.exports = {
    departement: function (element, data) {
        affichage.injectContent(
            element,
            carteDepartements.nom(data.departement),
            '#nom-departement'
        )
        affichage.injectAttribute(
            element,
            'href',
            carteDepartements.lien_prefecture(data.departement),
            '#lien-prefecture'
        )
    },

    caracteristiques: function (element, data) {
        if (data.sup65 || data.grossesse_3e_trimestre || data.imc > 30) {
            var content = ''
            if (data.sup65) {
                content = 'vous êtes âgé·e de plus de 65 ans'
            } else if (data.grossesse_3e_trimestre) {
                content = 'vous êtes au 3e trimestre de votre grossesse'
            }
            if (data.imc > 30) {
                if (content !== '') {
                    content += ' et '
                }
                content +=
                    'vous avez un IMC supérieur à 30 (' + Math.round(data.imc) + ')'
            }
            content += '.'
            affichage.injectContent(element, content, '#nom-caracteristiques')
        }
    },

    antecedents: function (element, data) {
        if (data.antecedents || data.antecedent_chronique_autre) {
            var content = ''
            if (data.antecedents) {
                content = 'vous avez des antécédents à risque'
            }
            if (data.antecedent_chronique_autre) {
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
