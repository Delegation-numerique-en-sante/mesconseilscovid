import prefectures from './data/prefectures.js'
import departements from './data/departements.js'

export function nomProfil(element, app) {
    if (!element) return
    element.textContent = app.profil.affichageNom()
}

export function titreConseils(element, profil) {
    if (!element) return
    if (profil.estMonProfil()) element.textContent = `Mes conseils`
    else element.textContent = `Conseils pour « ${profil.nom} »`
}

export function departement(element, departement) {
    element.textContent = departements[departement] || 'Inconnu'
}

export function lienPrefecture(element, departement) {
    element.setAttribute('href', prefectures[departement])
}

export function caracteristiquesARisques(element, algoOrientation) {
    if (
        algoOrientation.sup65 ||
        algoOrientation.profil.grossesse_3e_trimestre ||
        algoOrientation.imc > 30
    ) {
        var content = ''
        if (algoOrientation.sup65) {
            content = 'vous êtes âgé·e de plus de 65 ans'
        } else if (algoOrientation.profil.grossesse_3e_trimestre) {
            content = 'vous êtes au 3e trimestre de votre grossesse'
        }
        if (algoOrientation.imc > 30) {
            content += content ? ' et ' : ''
            content +=
                'vous avez un IMC supérieur à 30 (' +
                Math.round(algoOrientation.imc) +
                ')'
        }
        content += '.'
        element.textContent = content
    }
}

export function antecedents(element, algoOrientation) {
    if (
        algoOrientation.antecedents ||
        algoOrientation.profil.antecedent_chronique_autre
    ) {
        var content = ''
        if (algoOrientation.antecedents) {
            content = 'Vous avez des antécédents à risque'
        }
        if (algoOrientation.profil.antecedent_chronique_autre) {
            content += content ? ' et vous ' : 'Vous '
            content +=
                'avez une maladie chronique, un handicap ' +
                'ou vous prenez un traitement au long cours'
        }
        content += '.'
        element.textContent = content
    }
}
