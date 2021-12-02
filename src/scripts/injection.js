import { format } from 'timeago.js'

import { titleCase } from './utils'

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

export function dateConseils(element) {
    if (!element) return
    const now = new Date()
    const nowISO = now.toISOString().substring(0, 10)
    const nowReadable = now.toLocaleDateString()
    element.innerHTML = `au <time datetime="${nowISO}">${nowReadable}</time>`
}

export function caracteristiquesOuAntecedentsARisques(element, algoOrientation) {
    let caracteristiques = _caracteristiquesARisques(algoOrientation)
    caracteristiques.push(..._antecedentsARisques(algoOrientation))
    if (caracteristiques) {
        element.textContent = formatListe(caracteristiques)
    }
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
    let antecedents = _antecedentsARisques(algoOrientation)
    if (antecedents) {
        var content = formatListe(antecedents)
        element.textContent = titleCase(content) + '.'
    }
}

export function _antecedentsARisques(algoOrientation) {
    let antecedents = []
    if (algoOrientation.antecedents) {
        antecedents.push('vous avez des antécédents à risque')
    }
    if (algoOrientation.profil.antecedent_chronique_autre) {
        antecedents.push(
            'vous avez une maladie chronique, un handicap ' +
                'ou vous prenez un traitement au long cours'
        )
    }
    return antecedents
}

export function suiviRepetition(element, profil) {
    element.textContent = profil.suivi.length
}

export function suiviDerniereFois(element, profil) {
    const dernierEtat = profil.dernierEtat()
    element.textContent = dernierEtat ? format(new Date(dernierEtat.date), 'fr') : ''
}
