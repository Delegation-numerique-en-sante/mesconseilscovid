import { hideElement, showElement } from '../../affichage'

export function filtreEnFonctionDeLAge() {
    const url = new URL(window.location.href)

    const choixPossibles = ['trois-ans-moins', 'quatre-onze-ans', 'douze-dix-huit-ans']

    const choixSelectionnes = choixPossibles.filter(
        (choix) => url.searchParams.get(choix) === 'on'
    )

    choixSelectionnes.forEach((choix) => {
        document.querySelector(`#${choix}`).setAttribute('checked', '')
    })

    Array.from(document.querySelectorAll('[data-filter="true"]')).forEach((partie) => {
        const filters = partie.dataset.filters
        const matches = choixSelectionnes.filter((choix) => filters.indexOf(choix) >= 0)
        if (matches.length > 0 || choixSelectionnes.length === 0) {
            showElement(partie)
        } else {
            hideElement(partie)
        }
    })
}
