export function preloadForm(form, key, profil) {
    var value = profil.getData()[key]
    if (typeof value !== 'undefined' && value !== '') {
        form[key].value = value
    }
}

export function preloadCheckboxForm(form, key, profil) {
    var value = profil.getData()[key]
    if (typeof value !== 'undefined' && value) {
        form[key].checked = true
    }
}

export function toggleFormButtonOnCheck(form, continueLabel, uncheckedLabel) {
    var button = form.querySelector('input[type=submit]')
    var checkboxes = [].slice.call(form.querySelectorAll('input[type=checkbox]'))
    function updateSubmitButtonLabel() {
        var hasChecks = checkboxes.some(function (checkbox) {
            return checkbox.checked
        })
        button.value = hasChecks ? continueLabel : uncheckedLabel
    }
    updateSubmitButtonLabel()
    checkboxes.forEach(function (elem) {
        elem.addEventListener('change', updateSubmitButtonLabel)
    })
}

export function toggleFormButtonOnCheckRequired(
    form,
    continueLabel,
    uncheckedLabel,
    requiredLabel
) {
    var button = form.querySelector('input[type=submit]')
    var checkboxes = [].slice.call(form.querySelectorAll('input[type=checkbox]'))
    var secondaryCheckboxes = [].slice.call(
        form.querySelectorAll('.secondary input[type=checkbox]')
    )
    // Warning: removes otherCheckbox from secondaryCheckboxes:
    var otherCheckbox = secondaryCheckboxes.pop()

    function updateSubmitButtonLabelRequired() {
        var hasChecks = checkboxes.some(function (checkbox) {
            return checkbox.checked
        })
        button.disabled = false
        button.value = hasChecks ? continueLabel : uncheckedLabel
        if (hasChecks) {
            var hasSecondaryChecks = secondaryCheckboxes.some(function (checkbox) {
                return checkbox.checked
            })
            if (!hasSecondaryChecks && !otherCheckbox.checked) {
                button.disabled = true
                button.value = requiredLabel
            }
        }
    }
    updateSubmitButtonLabelRequired()
    checkboxes.forEach(function (elem) {
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    })

    function updateToggleOnOther() {
        if (otherCheckbox.checked) {
            secondaryCheckboxes.forEach(function (secondaryCheckbox) {
                secondaryCheckbox.checked = false
                secondaryCheckbox.disabled = true
            })
        } else {
            secondaryCheckboxes.forEach(function (secondaryCheckbox) {
                secondaryCheckbox.disabled = false
            })
        }
    }
    updateToggleOnOther()
    otherCheckbox.addEventListener('change', updateToggleOnOther)
}

export function toggleFormButtonOnRadioRequired(
    form,
    continueLabel,
    uncheckedLabel,
    requiredLabel
) {
    var button = form.querySelector('input[type=submit]')
    var checkbox = form.querySelector('input[type=checkbox]')
    var secondariesRequired = [].slice.call(
        form.querySelectorAll('.secondary.required[role="radiogroup"]')
    )
    var radios = [].slice.call(form.querySelectorAll('.secondary input[type=radio]'))

    function updateSubmitButtonLabelRequired() {
        button.disabled = false
        button.value = checkbox.checked ? continueLabel : uncheckedLabel
        if (checkbox.checked) {
            var hasAllRequiredRadioChecks = secondariesRequired.every(function (
                secondary
            ) {
                return [].slice
                    .call(secondary.querySelectorAll('input[type=radio]'))
                    .some(function (radio) {
                        return radio.checked
                    })
            })
            if (!hasAllRequiredRadioChecks) {
                button.disabled = true
                button.value = requiredLabel
            }
        }
    }
    updateSubmitButtonLabelRequired()
    radios.forEach(function (elem) {
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    })

    function updateToggleOnCheckbox() {
        updateSubmitButtonLabelRequired()
        if (checkbox.checked) {
            radios.forEach(function (radio) {
                radio.disabled = false
            })
        } else {
            radios.forEach(function (radio) {
                radio.checked = false
                radio.disabled = true
            })
        }
    }
    updateToggleOnCheckbox()
    checkbox.addEventListener('change', updateToggleOnCheckbox)
}

export function toggleFormButtonOnTextFieldsRequired(
    form,
    continueLabel,
    requiredLabel
) {
    var button = form.querySelector('input[type=submit]')
    var textFields = [].slice.call(form.querySelectorAll('input[type=text]'))

    function updateSubmitButtonLabelRequired() {
        var allFilled = textFields.every(function (textField) {
            return textField.value !== ''
        })
        button.disabled = !allFilled
        button.value = allFilled ? continueLabel : requiredLabel
    }
    updateSubmitButtonLabelRequired()
    textFields.forEach(function (elem) {
        elem.addEventListener('input', updateSubmitButtonLabelRequired)
    })
}

export function toggleFormButtonOnTextFieldsAndRadioRequired(
    form,
    continueLabel,
    uncheckedLabel,
    requiredLabel
) {
    const button = form.querySelector('input[type=submit]')
    const textFields = [].slice.call(
        form.querySelectorAll('input[type=text], input[type=date]')
    )
    const checkbox = form.querySelector('input[type=checkbox]')
    const secondariesRequired = [].slice.call(
        form.querySelectorAll('.secondary.required[role="radiogroup"]')
    )
    const radios = [].slice.call(form.querySelectorAll('.secondary input[type=radio]'))

    function updateSubmitButtonLabelRequired() {
        const allFilled = textFields.every((textField) => textField.value !== '')

        button.disabled = false
        button.value = checkbox.checked ? continueLabel : uncheckedLabel

        if (checkbox.checked) {
            const hasAllRequiredRadioChecks = secondariesRequired.every((secondary) => {
                return [].slice
                    .call(secondary.querySelectorAll('input[type=radio]'))
                    .some((radio) => radio.checked)
            })
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
    form,
    continueLabel,
    requiredLabel
) {
    var button = form.querySelector('input[type=submit]')
    var selectFields = [].slice.call(form.querySelectorAll('select'))

    function updateSubmitButtonLabelRequired() {
        var allFilled = selectFields.every(function (selectField) {
            return selectField.value !== selectField.options[0].value
        })
        button.disabled = !allFilled
        button.value = allFilled ? continueLabel : requiredLabel
    }
    updateSubmitButtonLabelRequired()
    selectFields.forEach(function (elem) {
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    })
}

export function enableOrDisableSecondaryFields(form, primary) {
    var primaryDisabled = !primary.checked
    ;[].forEach.call(form.querySelectorAll('.secondary'), function (elem) {
        var secondary = elem.querySelector('input')
        if (secondary.checked && primaryDisabled) {
            secondary.checked = false
            secondary.dispatchEvent(new Event('change'))
        }
        secondary.disabled = primaryDisabled
        if (primaryDisabled) {
            elem.classList.add('disabled')
        } else {
            elem.classList.remove('disabled')
        }
    })
}
