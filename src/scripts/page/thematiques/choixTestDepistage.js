import { hideElement, hideSelector, showElement } from '../../affichage'
import {
    getRadioValue,
    toggleFormButtonOnRadioRequired,
    uncheckAllRadio,
} from '../../formutils'

export function dynamiseLeChoixDuTest() {
    const formulaire = new FormulaireTestDepistage()
    formulaire.demarre()
}

class Formulaire {
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

    afficheReponse(etape) {
        const reponse = document.querySelector(`#${this.prefixe}-${etape}-reponse`)
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
            Array.from(
                document.querySelectorAll('[data-initial-value]'),
                (inputWithInitial) => {
                    inputWithInitial.value = inputWithInitial.dataset.initialValue
                    inputWithInitial.removeAttribute('data-initial-value')
                }
            )
            this.transitionneVersEtape('symptomes')
        })
    }
}

class FormulaireTestDepistage extends Formulaire {
    constructor() {
        super('tests-de-depistage')
    }

    GESTIONNAIRES = {
        'demarrage': (form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                hideElement(form)
                this.transitionneVersEtape('symptomes')
            })
        },
        'symptomes': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, 'tests_de_depistage_symptomes_radio')
                hideElement(form)
                if (value === 'oui') {
                    this.transitionneVersEtape('depuis-quand')
                } else if (value === 'non') {
                    this.transitionneVersEtape('cas-contact')
                }
            })
        },
        'depuis-quand': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'tests_de_depistage_depuis_quand_radio'
                )
                hideElement(form)
                this.afficheReponse(`symptomes-${value}`)
            })
        },
        'cas-contact': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(
                    form,
                    'tests_de_depistage_cas_contact_radio'
                )
                hideElement(form)
                if (value === 'oui') {
                    this.afficheReponse(`pas-symptomes-cas-contact-${value}`)
                } else if (value === 'non') {
                    this.transitionneVersEtape('auto-test')
                }
            })
        },
        'auto-test': (form) => {
            const button = form.querySelector('input[type=submit]')
            const requiredLabel = 'Cette information est requise'
            toggleFormButtonOnRadioRequired(form, button.value, requiredLabel)
            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const value = getRadioValue(form, 'tests_de_depistage_auto_test_radio')
                hideElement(form)
                this.afficheReponse(`pas-symptomes-pas-cas-contact-auto-test-${value}`)
            })
        },
    }
}
