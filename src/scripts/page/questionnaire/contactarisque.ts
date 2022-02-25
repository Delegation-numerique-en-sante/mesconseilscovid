import type App from '../../app'
import type { ProfilDataContactARisque } from '../../profil'
import {
    Form,
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    someChecked,
} from '../../formutils'

export default function contactarisque(page: HTMLElement, app: App) {
    const form = page.querySelector('form')!

    const button = form.querySelector<HTMLInputElement>('input[type=submit]')!

    // Pré-remplit le formulaire
    preloadCheckboxForm(form, 'contact_a_risque', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_contact_direct', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_actes', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_espace_confine', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_tousse_eternue', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_classe', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_autre', app.profil)

    preloadCheckboxForm(form, 'contact_a_risque_stop_covid', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_assurance_maladie', app.profil)

    const primary = <HTMLInputElement>form.elements.namedItem('contact_a_risque')
    enableOrDisableSecondaryFields(form, primary)

    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })

    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de contact à risque'
        : 'Cette personne n’a pas eu de contact à risque'
    toggleFormButtonOnCheckAndRadiosRequired(
        form,
        button.value,
        uncheckedLabel,
        'Veuillez remplir le formulaire au complet'
    )

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const target = <HTMLFormElement>event.target
        const profilItems = <(keyof ProfilDataContactARisque)[]>[
            'contact_a_risque',
            'contact_a_risque_meme_lieu_de_vie',
            'contact_a_risque_contact_direct',
            'contact_a_risque_actes',
            'contact_a_risque_espace_confine',
            'contact_a_risque_tousse_eternue',
            'contact_a_risque_meme_classe',
            'contact_a_risque_stop_covid',
            'contact_a_risque_assurance_maladie',
            'contact_a_risque_autre',
        ]
        for (const item of profilItems) {
            app.profil[item] = (<HTMLInputElement>(
                target.elements.namedItem(item)
            ))!.checked
        }
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('contactarisque')
        })
    })
}

function toggleFormButtonOnCheckAndRadiosRequired(
    formElement: HTMLFormElement,
    continueLabel: string,
    uncheckedLabel: string,
    requiredLabel: string
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const primaryCheckbox = form.primaryCheckbox
    const secondaryCheckboxes = form.secondaryCheckboxes
    // Warning: removes otherCheckbox from secondaryCheckboxes:
    const otherCheckbox = <HTMLInputElement>secondaryCheckboxes.pop()
    const TACCheckbox = <HTMLInputElement>(
        form.qS('input[type=checkbox]#contact_a_risque_stop_covid')
    )
    const AMCheckbox = <HTMLInputElement>(
        form.qS('input[type=checkbox]#contact_a_risque_assurance_maladie')
    )

    function updateSubmitButtonLabelRequired() {
        const hasSecondaryChecks =
            someChecked(secondaryCheckboxes) || otherCheckbox.checked
        const canContinue = !primaryCheckbox.checked || hasSecondaryChecks

        if (canContinue) {
            button.disabled = false
            if (TACCheckbox.checked || AMCheckbox.checked) {
                button.value = continueLabel
            } else {
                button.value = primaryCheckbox.checked ? continueLabel : uncheckedLabel
            }
        } else {
            button.disabled = true
            button.value = requiredLabel
        }
    }
    updateSubmitButtonLabelRequired()
    primaryCheckbox.addEventListener('change', updateSubmitButtonLabelRequired)
    TACCheckbox.addEventListener('change', updateSubmitButtonLabelRequired)
    AMCheckbox.addEventListener('change', updateSubmitButtonLabelRequired)
    secondaryCheckboxes.forEach((elem) => {
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    })
    otherCheckbox.addEventListener('change', updateSubmitButtonLabelRequired)

    function updateToggleOnOther() {
        if (otherCheckbox.checked) {
            secondaryCheckboxes.forEach((secondaryCheckbox) => {
                secondaryCheckbox.checked = false
                secondaryCheckbox.disabled = true
            })
        } else {
            secondaryCheckboxes.forEach((secondaryCheckbox) => {
                secondaryCheckbox.disabled = false
            })
        }
    }
    updateToggleOnOther()
    otherCheckbox.addEventListener('change', updateToggleOnOther)
}
