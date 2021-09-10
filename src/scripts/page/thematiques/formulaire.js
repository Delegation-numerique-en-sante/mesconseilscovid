import { hideElement, hideSelector, showElement } from '../../affichage'
import { uncheckAllRadio } from '../../formutils'

export class Formulaire {
    constructor(prefixe) {
        this.prefixe = prefixe
    }

    demarre(etape = 'demarrage') {
        const form = document.querySelector(`#${this.prefixe}-${etape}-form`)
        this.appelleGestionnaire(form, etape)
    }

    transitionneVersEtape(etape) {
        const form = document.querySelector(`#${this.prefixe}-${etape}-form`)
        showElement(form)
        this.gereBoutonRetour(form)
        this.appelleGestionnaire(form, etape)
    }

    appelleGestionnaire(form, etape) {
        const gestionnaire = this.GESTIONNAIRES[etape]
        gestionnaire(form)
    }

    gereBoutonRetour(form) {
        const boutonRetour = form.querySelector('.back-button')
        if (!boutonRetour) return
        boutonRetour.addEventListener('click', (event) => {
            event.preventDefault()
            const etapePrecedente = boutonRetour.dataset.precedent
            hideElement(form)
            this.transitionneVersEtape(etapePrecedente)
        })
    }

    afficheReponse(nom) {
        const reponse = document.querySelector(`#${this.prefixe}-${nom}-reponse`)
        showElement(reponse)
        this.gereBoutonRefaire()
    }

    gereBoutonRefaire() {
        const boutonRefaire = document.querySelector(`#${this.prefixe}-refaire`)
        showElement(boutonRefaire)
        boutonRefaire.addEventListener('click', (event) => {
            event.preventDefault()
            hideElement(boutonRefaire)
            hideSelector(document, '.statut')
            uncheckAllRadio(document)
            // On fait un reset des intitulés de boutons.
            Array.from(
                document.querySelectorAll('[data-initial-value]'),
                (inputWithInitial) => {
                    inputWithInitial.value = inputWithInitial.dataset.initialValue
                    inputWithInitial.removeAttribute('data-initial-value')
                }
            )
            const nomPremierFormulaire = Object.keys(this.GESTIONNAIRES)[1]
            this.transitionneVersEtape(nomPremierFormulaire)
        })
    }
}
