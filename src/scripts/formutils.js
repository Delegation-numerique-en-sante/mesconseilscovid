class Form {
    constructor(form) {
        this.form = form
    }

    get submitButton() {
        return this.form.querySelector('input[type=submit]')
    }

    get textFields() {
        return Array.from(
            this.form.querySelectorAll('input[type=text], input[type=date]')
        )
    }

    get selectFields() {
        return Array.from(this.form.querySelectorAll('select'))
    }

    get checkbox() {
        return this.form.querySelector('input[type=checkbox]')
    }
    get checkboxes() {
        return Array.from(this.form.querySelectorAll('input[type=checkbox]'))
    }

    get secondaryCheckboxes() {
        return Array.from(this.form.querySelectorAll('.secondary input[type=checkbox]'))
    }

    get radios() {
        return Array.from(this.form.querySelectorAll('.secondary input[type=radio]'))
    }
    get secondariesRequired() {
        return Array.from(
            this.form.querySelectorAll('.secondary.required [role="radiogroup"]')
        )
    }
}

export function getRadioValue(form, key) {
    const elem = form.querySelector(`input[name="${key}"]:checked`)
    if (elem) {
        return elem.value
    }
}

export function preloadForm(form, key, profil) {
    const value = profil.getData()[key]
    if (typeof value !== 'undefined' && value !== '') {
        form[key].value = value
    }
}

export function preloadCheckboxForm(form, key, profil) {
    const value = profil.getData()[key]
    if (typeof value !== 'undefined' && value) {
        form[key].checked = true
        form[key].dispatchEvent(createEvent('change'))
    }
}

export function createEvent(name) {
    const event = document.createEvent('Event')
    event.initEvent(name, true, true)
    return event
}

function someChecked(checkboxes) {
    return checkboxes.some((checkbox) => checkbox.checked)
}

function everyFilled(textFields) {
    return textFields.every((textField) => textField.value !== '')
}

export function toggleFormButtonOnCheck(form, continueLabel, uncheckedLabel) {
    const button = form.querySelector('input[type=submit]')
    const checkboxes = Array.from(form.querySelectorAll('input[type=checkbox]'))
    function updateSubmitButtonLabel() {
        button.value = someChecked(checkboxes) ? continueLabel : uncheckedLabel
    }
    updateSubmitButtonLabel()
    checkboxes.forEach((elem) =>
        elem.addEventListener('change', updateSubmitButtonLabel)
    )
}

export function toggleFormButtonOnCheckRequired(
    formElement,
    continueLabel,
    uncheckedLabel,
    requiredLabel
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const checkboxes = form.checkboxes
    const secondaryCheckboxes = form.secondaryCheckboxes
    // Warning: removes otherCheckbox from secondaryCheckboxes:
    const otherCheckbox = secondaryCheckboxes.pop()

    function updateSubmitButtonLabelRequired() {
        const hasChecks = someChecked(checkboxes)
        button.disabled = false
        button.value = hasChecks ? continueLabel : uncheckedLabel
        if (hasChecks) {
            const hasSecondaryChecks = someChecked(secondaryCheckboxes)
            if (!hasSecondaryChecks && !otherCheckbox.checked) {
                button.disabled = true
                button.value = requiredLabel
            }
        }
    }
    updateSubmitButtonLabelRequired()
    checkboxes.forEach((elem) =>
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    )

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

export function toggleFormButtonOnRadioRequired(
    formElement,
    continueLabel,
    uncheckedLabel,
    requiredLabel
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const checkbox = form.checkbox
    const radios = form.radios
    const secondariesRequired = form.secondariesRequired

    function updateSubmitButtonLabelRequired() {
        button.disabled = false
        button.value = checkbox.checked ? continueLabel : uncheckedLabel
        if (checkbox.checked) {
            const hasAllRequiredRadioChecks = secondariesRequired.every((secondary) =>
                someChecked(Array.from(secondary.querySelectorAll('input[type=radio]')))
            )
            if (!hasAllRequiredRadioChecks) {
                button.disabled = true
                button.value = requiredLabel
            }
        }
    }
    updateSubmitButtonLabelRequired()
    radios.forEach((elem) =>
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    )

    function updateToggleOnCheckbox() {
        updateSubmitButtonLabelRequired()
        if (checkbox.checked) {
            radios.forEach((radio) => {
                radio.disabled = false
            })
        } else {
            radios.forEach((radio) => {
                radio.checked = false
                radio.disabled = true
            })
        }
    }
    updateToggleOnCheckbox()
    checkbox.addEventListener('change', updateToggleOnCheckbox)
}

export function toggleFormButtonOnTextFieldsRequired(
    formElement,
    continueLabel,
    requiredLabel
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const textFields = form.textFields

    function updateSubmitButtonLabelRequired() {
        const allFilled = everyFilled(textFields)
        button.disabled = !allFilled
        button.value = allFilled ? continueLabel : requiredLabel
    }
    updateSubmitButtonLabelRequired()
    textFields.forEach((elem) =>
        elem.addEventListener('input', updateSubmitButtonLabelRequired)
    )
}

export function toggleFormButtonOnTextFieldsAndRadioRequired(
    formElement,
    continueLabel,
    uncheckedLabel,
    requiredLabel
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const textFields = form.textFields
    const checkbox = form.checkbox
    const secondariesRequired = form.secondariesRequired
    const radios = form.radios

    function updateSubmitButtonLabelRequired() {
        const allFilled = everyFilled(textFields)

        button.disabled = false
        button.value = checkbox.checked ? continueLabel : uncheckedLabel

        if (checkbox.checked) {
            const hasAllRequiredRadioChecks = secondariesRequired.every((secondary) =>
                someChecked(Array.from(secondary.querySelectorAll('input[type=radio]')))
            )
            if (!hasAllRequiredRadioChecks || !allFilled) {
                button.disabled = true
                button.value = requiredLabel
            }
        }
    }

    updateSubmitButtonLabelRequired()
    textFields.forEach((elem) => {
        elem.addEventListener('input', updateSubmitButtonLabelRequired)
    })
    radios.forEach((elem) => {
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    })

    function updateToggleOnCheckbox() {
        updateSubmitButtonLabelRequired()
        if (checkbox.checked) {
            radios.forEach((radio) => {
                radio.disabled = false
            })
        } else {
            radios.forEach((radio) => {
                radio.checked = false
                radio.disabled = true
            })
            textFields.forEach((text) => {
                text.value = ''
            })
        }
    }
    updateToggleOnCheckbox()
    checkbox.addEventListener('change', updateToggleOnCheckbox)
}

export function toggleFormButtonOnSelectFieldsRequired(
    formElement,
    continueLabel,
    requiredLabel
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const selectFields = form.selectFields

    function updateSubmitButtonLabelRequired() {
        const allFilled = selectFields.every(
            (selectField) => selectField.value !== selectField.options[0].value
        )
        button.disabled = !allFilled
        button.value = allFilled ? continueLabel : requiredLabel
    }
    updateSubmitButtonLabelRequired()
    selectFields.forEach((elem) =>
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    )
}

export function enableOrDisableSecondaryFields(form, primary) {
    const primaryDisabled = !primary.checked
    ;[].forEach.call(form.querySelectorAll('.secondary'), (elem) => {
        const secondary = elem.querySelector('input')
        if (secondary.checked && primaryDisabled) {
            secondary.checked = false
            secondary.dispatchEvent(createEvent('change'))
        }
        secondary.disabled = primaryDisabled
        if (primaryDisabled) {
            elem.classList.add('disabled')
        } else {
            elem.classList.remove('disabled')
        }
    })
}

export function toggleFormButtonOnSymptomesFieldsRequired(formElement, dateFromForm) {
    const form = new Form(formElement)
    const button = form.submitButton
    const continueLabel = 'Continuer'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    const statuts = formElement.elements['symptomes_actuels_statuts']
    const datePicker = formElement.querySelector('#debut_symptomes_exacte')

    function updateSubmitButtonLabelRequired() {
        const allFilled =
            formElement.elements['symptomes_non'].checked ||
            (formElement.elements['symptomes_passes'].checked &&
                dateFromForm(formElement)) ||
            (formElement.elements['symptomes_actuels'].checked &&
                someChecked(form.checkboxes) &&
                dateFromForm(formElement))
        button.disabled = !allFilled
        button.value = allFilled ? continueLabel : requiredLabel
    }

    updateSubmitButtonLabelRequired()

    Array.from(statuts).forEach((statut) =>
        statut.addEventListener('change', updateSubmitButtonLabelRequired)
    )
    form.checkboxes.forEach((checkbox) =>
        checkbox.addEventListener('change', updateSubmitButtonLabelRequired)
    )
    Array.from(formElement.querySelectorAll('[name="suivi_symptomes_date"]')).forEach(
        (radio) => {
            radio.addEventListener('change', updateSubmitButtonLabelRequired)
        }
    )
    datePicker.addEventListener('change', updateSubmitButtonLabelRequired)
}
