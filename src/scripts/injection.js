import { format } from 'timeago.js'

import prefectures from './data/prefectures.js'
import departements from './data/departements.js'

export function nomProfil(element, app) {
    if (!element) return
    element.textContent = app.profil.affichageNom()
}

export function titreConseils(element, profil) {
    if (!element) return
    const titre = profil.estMonProfil()
        ? 'Mes conseils'
        : `Conseils pour « ${profil.nom} »`
    element.textContent = titre
}

export function departement(element, departement) {
    element.textContent = departements[departement] || 'Inconnu'
}

export function lienPrefecture(element, departement) {
    element.setAttribute('href', prefectures[departement])
}

export function caracteristiquesARisques(element, algoOrientation) {
    let caracteristiques = _caracteristiquesARisques(algoOrientation)
    if (caracteristiques) {
        var content = formatListe(caracteristiques)
        element.textContent = content + '.'
    }
}

function _caracteristiquesARisques(algoOrientation) {
    let caracteristiques = []
    if (algoOrientation.sup65) {
        caracteristiques.push('vous êtes âgé·e de plus de 65 ans')
    } else if (algoOrientation.profil.grossesse_3e_trimestre) {
        caracteristiques.push('vous êtes au 3e trimestre de votre grossesse')
    }
    if (algoOrientation.imc > 30) {
        caracteristiques.push(
            'vous avez un IMC supérieur à 30 (' + Math.round(algoOrientation.imc) + ')'
        )
    }
    return caracteristiques
}

function formatListe(liste) {
    if (liste.length === 1) {
        return liste[0]
    }
    if (liste.length === 2) {
        return liste.join(' et ')
    }
    return (
        liste.slice(0, liste.length - 1).join(', ') + ' et ' + liste[liste.length - 1]
    )
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

export function suiviRepetition(element, profil) {
    element.textContent = profil.suivi.length
}

export function suiviDerniereFois(element, profil) {
    const dernierEtat = profil.dernierEtat()
    element.textContent = dernierEtat ? format(new Date(dernierEtat.date), 'fr') : ''
}
