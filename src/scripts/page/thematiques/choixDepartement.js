import { hideElement, hideSelector, showElement, showSelector } from '../../affichage'
import masques from '../../data/masques'

export function dynamiseLeChoixDuDepartement() {
    const form = document.querySelector('#masque-obligatoire-form')
    // Essaie d’éviter la confusion liée au sélecteur natif sur iOS pour le
    // choix manuel du département.
    //
    // Le problème : la valeur affichée dans le champ ne change que lorsque
    // l’utilisateur clique sur OK, ce qui peut donner l’impression que le sélecteur
    // ne fonctionne pas.
    //
    // La solution :
    // - on efface la valeur du champ lorsque l’élément gagne le focus, de manière
    //   à afficher le choix par défaut (« Choisir dans la liste... ») pendant
    //   la sélection avec le contrôle natif ;
    // - une fois la sélection effectuée, on utilise blur() pour retirer le focus
    //   de l’élément afin que l’événement précédent soit bien déclenché si
    //   l’utilisateur touche à nouveau le sélecteur.
    //
    const selectElement = form.elements['departement']
    selectElement.addEventListener('focus', (event) => {
        event.target.value = ''
    })
    selectElement.addEventListener('change', (event) => {
        event.target.blur()
    })

    // Soumission du formulaire.
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const departement = event.target.elements['departement'].value
        const necessiteMasque = masques[departement]
        if (necessiteMasque) {
            showSelector(form.parentElement, '#js-masque-obligatoire')
            hideSelector(form.parentElement, '#js-masque-non-obligatoire')
        } else {
            hideSelector(form.parentElement, '#js-masque-obligatoire')
            showSelector(form.parentElement, '#js-masque-non-obligatoire')
        }
        hideElement(form)
        const boutonRefaire = document.querySelector('#masque-obligatoire-refaire')
        showElement(boutonRefaire)
        boutonRefaire.addEventListener('click', (event) => {
            event.preventDefault()
            hideElement(boutonRefaire)
            hideSelector(document, '.statut')
            showElement(form)
        })
    })
}
