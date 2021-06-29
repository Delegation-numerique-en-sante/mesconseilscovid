import {
    Form,
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    someChecked,
} from '../../formutils'

export default function contactarisque(element, app) {
    const form = element.querySelector('form')

    var button = form.querySelector('input[type=submit]')

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

    var primary = form.elements['contact_a_risque']
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
        app.profil.contact_a_risque = event.target.elements['contact_a_risque'].checked
        app.profil.contact_a_risque_meme_lieu_de_vie =
            event.target.elements['contact_a_risque_meme_lieu_de_vie'].checked
        app.profil.contact_a_risque_contact_direct =
            event.target.elements['contact_a_risque_contact_direct'].checked
        app.profil.contact_a_risque_actes =
            event.target.elements['contact_a_risque_actes'].checked
        app.profil.contact_a_risque_espace_confine =
            event.target.elements['contact_a_risque_espace_confine'].checked
        app.profil.contact_a_risque_tousse_eternue =
            event.target.elements['contact_a_risque_tousse_eternue'].checked
        app.profil.contact_a_risque_meme_classe =
            event.target.elements['contact_a_risque_meme_classe'].checked
        app.profil.contact_a_risque_stop_covid =
            event.target.elements['contact_a_risque_stop_covid'].checked
        app.profil.contact_a_risque_assurance_maladie =
            event.target.elements['contact_a_risque_assurance_maladie'].checked
        app.profil.contact_a_risque_autre =
            event.target.elements['contact_a_risque_autre'].checked
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('contactarisque')
        })
    })
}

function toggleFormButtonOnCheckAndRadiosRequired(
    formElement,
    continueLabel,
    uncheckedLabel,
    requiredLabel
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const primaryCheckbox = form.primaryCheckbox
    const secondaryCheckboxes = form.secondaryCheckboxes
    // Warning: removes otherCheckbox from secondaryCheckboxes:
    const otherCheckbox = secondaryCheckboxes.pop()
    const TACCheckbox = form.qS('input[type=checkbox]#contact_a_risque_stop_covid')
    const AMCheckbox = form.qS(
        'input[type=checkbox]#contact_a_risque_assurance_maladie'
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
