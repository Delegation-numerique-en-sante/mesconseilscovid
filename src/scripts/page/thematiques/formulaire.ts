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
        const form = document.querySelector<HTMLFormElement>(
            `#${this.prefixe}-${etape}-form`
        )!
        this.appelleGestionnaire(form, etape)
        form.dataset.ready = 'true'
    }

    transitionneVersEtape(
        currentForm: HTMLFormElement | null,
        etape: string,
        precedent?: string
    ) {
        if (currentForm) {
            currentForm.dataset.ready = 'false'
            hideElement(currentForm)
        }
        const nextForm = document.querySelector<HTMLFormElement>(
            `#${this.prefixe}-${etape}-form`
        )!
        showElement(nextForm)
        this.gereBoutonRetour(nextForm, precedent)
        this.appelleGestionnaire(nextForm, etape)
        nextForm.dataset.ready = 'true'
    }

    appelleGestionnaire(form: HTMLFormElement, etape: string) {
        const gestionnaire = this.GESTIONNAIRES[etape]
        gestionnaire(form)
    }

    gereBoutonRetour(form: HTMLFormElement, precedent: string | undefined) {
        const boutonRetour = form.querySelector<HTMLElement>('.back-button')
        if (!boutonRetour) return
        boutonRetour.addEventListener('click', (event) => {
            event.preventDefault()
            if (!precedent) return
            const etapePrecedente = precedent || boutonRetour.dataset.precedent!
            this.transitionneVersEtape(form, etapePrecedente)
        })
    }

    transitionneVersReponse(
        form: HTMLFormElement,
        nom: string,
        params?: { [key: string]: any }
    ) {
        form.dataset.ready = 'false'
        hideElement(form)
        const reponse = document.querySelector<HTMLElement>(
            `#${this.prefixe}-${nom}-reponse`
        )!
        for (const name in params) {
            Array.from(reponse.querySelectorAll(`.${name}`)).forEach((elem) => {
                elem.innerHTML = params[name]
            })
        }
        showElement(reponse)
        this.gereBoutonRefaire()
    }

    resetFormulaire(element: HTMLElement) {
        uncheckAllRadio(element)
    }

    gereBoutonRefaire() {
        const boutonRefaire = document.querySelector<HTMLElement>(
            `#${this.prefixe}-refaire`
        )!
        showElement(boutonRefaire)
        boutonRefaire.addEventListener('click', (event) => {
            event.preventDefault()
            const element = document as never as HTMLElement
            hideElement(boutonRefaire)
            hideSelector(element, '.statut')
            this.resetFormulaire(element)
            // On fait un reset des intitulés de boutons.
            const inputsWithInitial = Array.from(
                document.querySelectorAll<HTMLInputElement>('[data-initial-value]')!
            )
            inputsWithInitial.forEach((inputWithInitial) => {
                inputWithInitial.value = inputWithInitial.dataset.initialValue || ''
                inputWithInitial.removeAttribute('data-initial-value')
            })
            this.transitionneVersEtape(null, this.nomPremierFormulaire)
        })
    }
}
