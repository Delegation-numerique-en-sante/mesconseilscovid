import type Profil from './profil'

export class Form {
    form: HTMLFormElement

    constructor(form: HTMLFormElement) {
        this.form = form
    }

    qS(selector: string) {
        return this.form.querySelector(selector)
    }

    qSA(selector: string) {
        return this.form.querySelectorAll(selector)
    }

    get submitButton() {
        return this.qS('input[type=submit]') as HTMLInputElement
    }

    get requiredTextFields() {
        return Array.from(
            this.qSA('input[type=text][required], input[type=date][required]')
        ) as HTMLInputElement[]
    }

    get selectFields() {
        return Array.from(this.qSA('select')) as HTMLSelectElement[]
    }

    get checkbox() {
        return this.qS('input[type=checkbox]') as HTMLInputElement
    }
    get checkboxes() {
        return Array.from(this.qSA('input[type=checkbox]')) as HTMLInputElement[]
    }

    get primaryCheckbox() {
        return this.qS('input[type=checkbox].primary') as HTMLInputElement
    }

    get secondaryCheckboxes() {
        return Array.from(
            this.qSA('.secondary input[type=checkbox]')
        ) as HTMLInputElement[]
    }

    get radios() {
        return Array.from(
            this.qSA('.secondary input[type=radio]')
        ) as HTMLInputElement[]
    }
    get secondariesRequired() {
        return Array.from(this.qSA('.secondary.required [role="radiogroup"]'))
    }
}

export function getRadioValue(form: HTMLFormElement, key: string) {
    const elem = form.querySelector<HTMLInputElement>(`input[name="${key}"]:checked`)
    return elem?.value
}

export function uncheckAllRadio(element: HTMLElement) {
    const radioButtons = Array.from(
        element.querySelectorAll('[type="radio"]')
    ) as HTMLInputElement[]
    radioButtons.forEach((radioButton) => {
        radioButton.checked = false
    })
}

export function preloadForm(form: HTMLFormElement, key: string, profil: Profil) {
    const value = profil.getData()[key]
    if (typeof value !== 'undefined' && value !== '') {
        form[key].value = value
    }
}

export function preloadCheckboxForm(
    form: HTMLFormElement,
    key: string,
    profil: Profil
) {
    const value = profil.getData()[key]
    if (typeof value !== 'undefined' && value) {
        form[key].checked = true
        form[key].dispatchEvent(createEvent('change'))
    }
}

export function createEvent(name: string) {
    const event = document.createEvent('Event')
    event.initEvent(name, true, true)
    return event
}

export function someChecked(checkboxes: HTMLInputElement[]) {
    return checkboxes.some((checkbox) => checkbox.checked)
}

function everyFilled(textFields: HTMLInputElement[]) {
    return textFields.every((textField) => textField.value !== '')
}

export function toggleFormButtonOnCheck(
    form: HTMLFormElement,
    continueLabel: string,
    uncheckedLabel: string
) {
    const button: HTMLInputElement | null = form.querySelector('input[type=submit]')
    if (!button) return
    const checkboxes: HTMLInputElement[] | null = Array.from(
        form.querySelectorAll('input[type=checkbox]')
    )
    if (!checkboxes || checkboxes.length === 0) return
    function updateSubmitButtonLabel() {
        ;(button as HTMLInputElement).value = someChecked(
            checkboxes as HTMLInputElement[]
        )
            ? continueLabel
            : uncheckedLabel
    }
    updateSubmitButtonLabel()
    checkboxes.forEach((elem) =>
        elem.addEventListener('change', updateSubmitButtonLabel)
    )
}

export function toggleFormButtonOnCheckRequired(
    formElement: HTMLFormElement,
    continueLabel: string,
    uncheckedLabel: string,
    requiredLabel: string
) {
    const form = new Form(formElement)
    const button = form.submitButton as HTMLInputElement
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
            if (!hasSecondaryChecks && !otherCheckbox?.checked) {
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
        if (otherCheckbox?.checked) {
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
    otherCheckbox?.addEventListener('change', updateToggleOnOther)
}

export function toggleFormButtonOnRadioRequired(
    formElement: HTMLFormElement,
    continueLabel: string,
    requiredLabel: string
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const radios = Array.from(form.qSA('input[type=radio]')) as HTMLInputElement[]
    continueLabel = button.dataset.initialValue || continueLabel
    button.dataset.initialValue = continueLabel

    function updateSubmitButtonLabelRequired() {
        button.disabled = false
        button.value = continueLabel
        if (!someChecked(radios)) {
            button.disabled = true
            button.value = requiredLabel
        }
    }
    updateSubmitButtonLabelRequired()
    radios.forEach((elem) =>
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    )
}

export function toggleFormButtonOnCheckboxAndRadioRequired(
    formElement: HTMLFormElement,
    continueLabel: string,
    uncheckedLabel: string,
    requiredLabel: string
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
    formElement: HTMLFormElement,
    continueLabel: string,
    requiredLabel: string
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const requiredTextFields = form.requiredTextFields

    function updateSubmitButtonLabelRequired() {
        const allFilled = everyFilled(requiredTextFields)
        button.disabled = !allFilled
        button.value = allFilled ? continueLabel : requiredLabel
    }
    updateSubmitButtonLabelRequired()
    requiredTextFields.forEach((elem) =>
        elem.addEventListener('input', updateSubmitButtonLabelRequired)
    )
}

export function toggleFormButtonOnTextFieldsAndRadioRequired(
    formElement: HTMLFormElement,
    continueLabel: string,
    uncheckedLabel: string,
    requiredLabel: string
) {
    const form = new Form(formElement)
    const button = form.submitButton
    const requiredTextFields = form.requiredTextFields
    const checkbox = form.checkbox
    const radios = form.radios

    function updateSubmitButtonLabelRequired() {
        const allFilled = everyFilled(requiredTextFields)

        button.disabled = false
        button.value = checkbox.checked ? continueLabel : uncheckedLabel

        if (checkbox.checked) {
            const hasAllRequiredRadioChecks = form.secondariesRequired.every(
                (secondary) =>
                    someChecked(
                        Array.from(secondary.querySelectorAll('input[type=radio]'))
                    )
            )
            if (!hasAllRequiredRadioChecks || !allFilled) {
                button.disabled = true
                button.value = requiredLabel
            }
        }
    }

    updateSubmitButtonLabelRequired()
    requiredTextFields.forEach((elem) => {
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
            requiredTextFields.forEach((text) => {
                text.value = ''
            })
        }
    }
    updateToggleOnCheckbox()
    checkbox.addEventListener('change', updateToggleOnCheckbox)

    return updateSubmitButtonLabelRequired
}

export function toggleFormButtonOnSelectFieldsRequired(
    formElement: HTMLFormElement,
    continueLabel: string,
    requiredLabel: string
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

export function enableOrDisableSecondaryFields(
    form: HTMLFormElement,
    primary: HTMLInputElement,
    secondaries?: HTMLInputElement[]
) {
    secondaries = Array.from(secondaries || form.querySelectorAll('.secondary'))
    const primaryDisabled = !primary.checked
    secondaries.forEach((elem) => {
        const secondaryInputs = Array.from(elem.querySelectorAll('input'))
        secondaryInputs.forEach((secondaryInput) => {
            if (secondaryInput.checked && primaryDisabled) {
                secondaryInput.checked = false
                secondaryInput.dispatchEvent(createEvent('change'))
            }
            secondaryInput.disabled = primaryDisabled
        })
        if (primaryDisabled) {
            elem.classList.add('disabled')
        } else {
            elem.classList.remove('disabled')
        }
    })
}
