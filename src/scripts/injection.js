import { format } from 'timeago.js'

import prefectures from './data/prefectures'
import ctaiTelephones from './data/ctaiTelephones'
import ctaiCourriels from './data/ctaiCourriels'
import departements from './data/departements'

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

export function departement(element, departement) {
    element.textContent = departements[departement] || 'Inconnu'
}

export function lienPrefecture(element, departement) {
    element.setAttribute('href', prefectures[departement])
}

export function CTAIContact(element, departement) {
    const telephone = ctaiTelephones[departement]
    const courriel = ctaiCourriels[departement]
    if (telephone === '' && courriel === '') return
    const contactHTML = []
    if (telephone) {
        contactHTML.push(
            ` au <a href="tel:${telephone}" style="white-space: nowrap;">${telephone
                .match(/.{1,2}/g)
                .join(' ')}</a>`
        )
    }
    if (courriel) {
        contactHTML.push(` à l’adresse <a href="mailto:${courriel}">${courriel}</a>`)
    }
    element.innerHTML = contactHTML.join(' ou ')
}

export function lienVaccination(element, departement) {
    // Pas de distinction pour la Corse sur le site de sante.fr.
    if (departement === '2A' || departement == '2B') {
        departement = '20'
    }
    element.setAttribute(
        'href',
        `https://www.sante.fr/centres-vaccination-covid.html#dep-${departement}`
    )
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
        element.textContent = content.charAt(0).toUpperCase() + content.slice(1) + '.'
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
