import { hideElement, hideSelector, showElement } from '../../affichage'
import { uncheckAllRadio } from '../../formutils'

export class Formulaire {
    prefixe: string
    nomPremierFormulaire: string
    GESTIONNAIRES: { [key: string]: any }

    constructor(prefixe: string, nomPremierFormulaire: string) {
        this.prefixe = prefixe
        this.nomPremierFormulaire = nomPremierFormulaire
        this.GESTIONNAIRES = {}
    }

    demarre(etape = 'demarrage') {
        const form: HTMLFormElement | null = document.querySelector(
            `#${this.prefixe}-${etape}-form`
        )
        if (!form) return
        this.appelleGestionnaire(form, etape)
        form.dataset.ready = true
    }

    transitionneVersEtape(
        currentForm: HTMLFormElement | null,
        etape: string,
        precedent?: string
    ) {
        if (currentForm) {
            currentForm.dataset.ready = false
            hideElement(currentForm)
        }
        const nextForm: HTMLFormElement | null = document.querySelector(
            `#${this.prefixe}-${etape}-form`
        )
        if (!nextForm) return
        showElement(nextForm)
        this.gereBoutonRetour(nextForm, precedent)
        this.appelleGestionnaire(nextForm, etape)
        nextForm.dataset.ready = true
    }

    appelleGestionnaire(form: HTMLFormElement, etape: string) {
        const gestionnaire = this.GESTIONNAIRES[etape]
        gestionnaire(form)
    }

    gereBoutonRetour(form: HTMLFormElement, precedent: string | undefined) {
        const boutonRetour = form.querySelector('.back-button')
        if (!boutonRetour) return
        boutonRetour.addEventListener('click', (event) => {
            event.preventDefault()
            const etapePrecedente = precedent || boutonRetour.dataset.precedent
            this.transitionneVersEtape(form, etapePrecedente)
        })
    }

    transitionneVersReponse(
        form: HTMLFormElement,
        nom: string,
        params?: { [key: string]: any }
    ) {
        form.dataset.ready = false
        hideElement(form)
        const reponse: HTMLElement | null = document.querySelector(
            `#${this.prefixe}-${nom}-reponse`
        )
        if (!reponse) return
        for (const name in params) {
            Array.from(reponse.querySelectorAll(`.${name}`)).forEach((elem) => {
                elem.innerHTML = params[name]
            })
        }
        showElement(reponse)
        this.gereBoutonRefaire()
    }

    resetFormulaire(document: Document) {
        uncheckAllRadio(document as never as HTMLElement)
    }

    gereBoutonRefaire() {
        const boutonRefaire: HTMLElement | null = document.querySelector(
            `#${this.prefixe}-refaire`
        )
        if (!boutonRefaire) return
        showElement(boutonRefaire)
        boutonRefaire.addEventListener('click', (event) => {
            event.preventDefault()
            hideElement(boutonRefaire)
            hideSelector(document as never as HTMLElement, '.statut')
            this.resetFormulaire(document)
            // On fait un reset des intitulés de boutons.
            const inputsWithInitial: HTMLInputElement[] | null = Array.from(
                document.querySelectorAll('[data-initial-value]')
            )
            if (!inputsWithInitial) return
            inputsWithInitial.forEach((inputWithInitial) => {
                inputWithInitial.value = inputWithInitial.dataset.initialValue || ''
                inputWithInitial.removeAttribute('data-initial-value')
            })
            this.transitionneVersEtape(null, this.nomPremierFormulaire)
        })
    }
}
