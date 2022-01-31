import { hideElement, hideSelector, showElement } from '../../affichage'
import { uncheckAllRadio } from '../../formutils'

export class Formulaire {
    constructor(prefixe, nomPremierFormulaire) {
        this.prefixe = prefixe
        this.nomPremierFormulaire = nomPremierFormulaire
    }

    demarre(etape = 'demarrage') {
        const form = document.querySelector(`#${this.prefixe}-${etape}-form`)
        this.appelleGestionnaire(form, etape)
        form.dataset.ready = true
    }

    transitionneVersEtape(currentForm, etape, precedent) {
        if (currentForm) {
            currentForm.dataset.ready = false
            hideElement(currentForm)
        }
        const nextForm = document.querySelector(`#${this.prefixe}-${etape}-form`)
        showElement(nextForm)
        this.gereBoutonRetour(nextForm, precedent)
        this.appelleGestionnaire(nextForm, etape)
        nextForm.dataset.ready = true
    }

    appelleGestionnaire(form, etape) {
        const gestionnaire = this.GESTIONNAIRES[etape]
        gestionnaire(form)
    }

    gereBoutonRetour(form, precedent) {
        const boutonRetour = form.querySelector('.back-button')
        if (!boutonRetour) return
        boutonRetour.addEventListener('click', (event) => {
            event.preventDefault()
            const etapePrecedente = precedent || boutonRetour.dataset.precedent
            this.transitionneVersEtape(form, etapePrecedente)
        })
    }

    transitionneVersReponse(form, nom, params) {
        form.dataset.ready = false
        hideElement(form)
        const reponse = document.querySelector(`#${this.prefixe}-${nom}-reponse`)
        for (const name in params) {
            Array.from(reponse.querySelectorAll(`.${name}`)).forEach((elem) => {
                elem.innerHTML = params[name]
            })
        }
        showElement(reponse)
        this.gereBoutonRefaire()
    }

    resetFormulaire(document) {
        uncheckAllRadio(document)
    }

    gereBoutonRefaire() {
        const boutonRefaire = document.querySelector(`#${this.prefixe}-refaire`)
        showElement(boutonRefaire)
        boutonRefaire.addEventListener('click', (event) => {
            event.preventDefault()
            hideElement(boutonRefaire)
            hideSelector(document, '.statut')
            this.resetFormulaire(document)
            // On fait un reset des intitulés de boutons.
            Array.from(
                document.querySelectorAll('[data-initial-value]'),
                (inputWithInitial) => {
                    inputWithInitial.value = inputWithInitial.dataset.initialValue
                    inputWithInitial.removeAttribute('data-initial-value')
                }
            )
            this.transitionneVersEtape(null, this.nomPremierFormulaire)
        })
    }
}
