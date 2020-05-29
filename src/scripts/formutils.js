function preloadForm(form, key) {
    var value = profil.getData()[key]
    if (typeof value !== 'undefined' && value !== '') {
        form[key].value = value
    }
}

function preloadCheckboxForm(form, key) {
    var value = profil.getData()[key]
    if (typeof value !== 'undefined' && value) {
        form[key].checked = true
    }
}

function toggleFormButtonOnCheck(form, initialLabel, alternateLabel) {
    var button = form.querySelector('input[type=submit]')
    var checkboxes = [].slice.call(form.querySelectorAll('input[type=checkbox]'))
    function updateSubmitButtonLabel() {
        var hasChecks = checkboxes.some(function (checkbox) {
            return checkbox.checked
        })
        button.value = hasChecks ? alternateLabel : initialLabel
    }
    updateSubmitButtonLabel()
    checkboxes.forEach(function (elem) {
        elem.addEventListener('change', updateSubmitButtonLabel)
    })
}

function toggleFormButtonOnCheckRequired(
    form,
    initialLabel,
    alternateLabel,
    requiredLabel
) {
    var button = form.querySelector('input[type=submit]')
    var checkboxes = [].slice.call(form.querySelectorAll('input[type=checkbox]'))
    var secondaryCheckboxes = [].slice.call(
        form.querySelectorAll('.secondary input[type=checkbox]')
    )

    function updateSubmitButtonLabelRequired() {
        var hasChecks = checkboxes.some(function (checkbox) {
            return checkbox.checked
        })
        button.disabled = false
        button.value = hasChecks ? alternateLabel : initialLabel
        if (hasChecks) {
            var hasSecondaryChecks = secondaryCheckboxes.some(function (checkbox) {
                return checkbox.checked
            })
            if (!hasSecondaryChecks) {
                button.disabled = true
                button.value = requiredLabel
            }
        }
    }
    updateSubmitButtonLabelRequired()
    checkboxes.forEach(function (elem) {
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    })
}

function toggleFormButtonOnTextFieldsRequired(form, initialLabel, requiredLabel) {
    var button = form.querySelector('input[type=submit]')
    var textFields = [].slice.call(form.querySelectorAll('input[type=text]'))

    function updateSubmitButtonLabelRequired() {
        var allFilled = textFields.every(function (textField) {
            return textField.value !== ''
        })
        button.disabled = !allFilled
        button.value = allFilled ? initialLabel : requiredLabel
    }
    updateSubmitButtonLabelRequired()
    textFields.forEach(function (elem) {
        elem.addEventListener('input', updateSubmitButtonLabelRequired)
    })
}

function toggleFormButtonOnSelectFieldsRequired(form, initialLabel, requiredLabel) {
    var button = form.querySelector('input[type=submit]')
    var selectFields = [].slice.call(form.querySelectorAll('select'))

    function updateSubmitButtonLabelRequired() {
        var allFilled = selectFields.every(function (selectField) {
            return selectField.value !== selectField.options[0].value
        })
        button.disabled = !allFilled
        button.value = allFilled ? initialLabel : requiredLabel
    }
    updateSubmitButtonLabelRequired()
    selectFields.forEach(function (elem) {
        elem.addEventListener('change', updateSubmitButtonLabelRequired)
    })
}

function enableOrDisableSecondaryFields(form, primary) {
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

module.exports = {
    preloadForm,
    preloadCheckboxForm,
    toggleFormButtonOnCheck,
    toggleFormButtonOnCheckRequired,
    toggleFormButtonOnTextFieldsRequired,
    toggleFormButtonOnSelectFieldsRequired,
    enableOrDisableSecondaryFields,
}
