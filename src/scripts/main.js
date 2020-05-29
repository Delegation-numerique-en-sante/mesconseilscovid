require('./polyfills/custom_event.js')

var Updater = require('./updater.js')
var Questionnaire = require('./questionnaire.js')
var StockageLocal = require('./stockage.js')

var FormUtils = function () {
    this.preloadForm = function (form, key) {
        var value = questionnaire.getData()[key]
        if (typeof value !== 'undefined' && value !== '') {
            form[key].value = value
        }
    }

    this.preloadCheckboxForm = function (form, key) {
        var value = questionnaire.getData()[key]
        if (typeof value !== 'undefined' && value) {
            form[key].checked = true
        }
    }

    this.toggleFormButtonOnCheck = function (form, initialLabel, alternateLabel) {
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

    this.toggleFormButtonOnCheckRequired = function (
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

    this.toggleFormButtonOnTextFieldsRequired = function (
        form,
        initialLabel,
        requiredLabel
    ) {
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

    this.toggleFormButtonOnSelectFieldsRequired = function (
        form,
        initialLabel,
        requiredLabel
    ) {
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

    this.enableOrDisableSecondaryFields = function (form, primary) {
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
}
window.formUtils = new FormUtils()

window.stockageLocal = new StockageLocal()

// window.carteDepartements = new CarteDepartements()

window.questionnaire = new Questionnaire()

window.resetPrivateData = function (event) {
    event.preventDefault()
    questionnaire.resetData()
    stockageLocal.supprimer()
    router.navigate('introduction')
}

window.updater = new Updater()

var OnSubmitFormScripts = function () {
    this.residence = function (event) {
        event.preventDefault()
        questionnaire.departement = event.target.elements['departement'].value
        stockageLocal.enregistrer(questionnaire)
        router.navigate('activitepro')
    }

    this.activitepro = function (event) {
        event.preventDefault()
        questionnaire.activite_pro = event.target.elements['activite_pro'].checked
        questionnaire.activite_pro_public =
            event.target.elements['activite_pro_public'].checked
        questionnaire.activite_pro_sante =
            event.target.elements['activite_pro_sante'].checked
        stockageLocal.enregistrer(questionnaire)
        router.navigate('foyer')
    }

    this.foyer = function (event) {
        event.preventDefault()
        questionnaire.foyer_enfants = event.target.elements['foyer_enfants'].checked
        questionnaire.foyer_fragile = event.target.elements['foyer_fragile'].checked
        stockageLocal.enregistrer(questionnaire)
        router.navigate('caracteristiques')
    }

    this.caracteristiques = function (event) {
        event.preventDefault()
        questionnaire.sup65 = event.target.elements['sup65'].checked
        questionnaire.grossesse_3e_trimestre =
            event.target.elements['grossesse_3e_trimestre'].checked
        questionnaire.poids = event.target.elements['poids'].value
        questionnaire.taille = event.target.elements['taille'].value
        stockageLocal.enregistrer(questionnaire)
        router.navigate('antecedents')
    }

    this.antecedents = function (event) {
        event.preventDefault()
        questionnaire.antecedent_cardio =
            event.target.elements['antecedent_cardio'].checked
        questionnaire.antecedent_diabete =
            event.target.elements['antecedent_diabete'].checked
        questionnaire.antecedent_respi =
            event.target.elements['antecedent_respi'].checked
        questionnaire.antecedent_dialyse =
            event.target.elements['antecedent_dialyse'].checked
        questionnaire.antecedent_cancer =
            event.target.elements['antecedent_cancer'].checked
        questionnaire.antecedent_immunodep =
            event.target.elements['antecedent_immunodep'].checked
        questionnaire.antecedent_cirrhose =
            event.target.elements['antecedent_cirrhose'].checked
        questionnaire.antecedent_drepano =
            event.target.elements['antecedent_drepano'].checked
        questionnaire.antecedent_chronique_autre =
            event.target.elements['antecedent_chronique_autre'].checked
        stockageLocal.enregistrer(questionnaire)
        router.navigate('symptomesactuels')
    }

    this.symptomesactuels = function (event) {
        event.preventDefault()
        questionnaire.symptomes_actuels =
            event.target.elements['symptomes_actuels'].checked
        if (questionnaire.symptomes_actuels) {
            // On complète manuellement le formulaire pour le rendre complet.
            questionnaire.symptomes_passes = false
            questionnaire.contact_a_risque = false
            questionnaire.contact_a_risque_meme_lieu_de_vie = undefined
            questionnaire.contact_a_risque_contact_direct = undefined
            questionnaire.contact_a_risque_actes = undefined
            questionnaire.contact_a_risque_espace_confine = undefined
            questionnaire.contact_a_risque_meme_classe = undefined
            questionnaire.contact_a_risque_autre = undefined
            stockageLocal.enregistrer(questionnaire)
            router.navigate('conseils')
        } else {
            stockageLocal.enregistrer(questionnaire)
            router.navigate('symptomespasses')
        }
    }

    this.symptomespasses = function (event) {
        event.preventDefault()
        questionnaire.symptomes_passes =
            event.target.elements['symptomes_passes'].checked
        if (questionnaire.symptomes_passes) {
            // On complète manuellement le formulaire pour le rendre complet.
            questionnaire.contact_a_risque = false
            questionnaire.contact_a_risque_meme_lieu_de_vie = undefined
            questionnaire.contact_a_risque_contact_direct = undefined
            questionnaire.contact_a_risque_actes = undefined
            questionnaire.contact_a_risque_espace_confine = undefined
            questionnaire.contact_a_risque_meme_classe = undefined
            questionnaire.contact_a_risque_autre = undefined
            stockageLocal.enregistrer(questionnaire)
            router.navigate('conseils')
        } else {
            stockageLocal.enregistrer(questionnaire)
            router.navigate('contactarisque')
        }
    }

    this.contactarisque = function (event) {
        event.preventDefault()
        questionnaire.contact_a_risque =
            event.target.elements['contact_a_risque'].checked
        questionnaire.contact_a_risque_meme_lieu_de_vie =
            event.target.elements['contact_a_risque_meme_lieu_de_vie'].checked
        questionnaire.contact_a_risque_contact_direct =
            event.target.elements['contact_a_risque_contact_direct'].checked
        questionnaire.contact_a_risque_actes =
            event.target.elements['contact_a_risque_actes'].checked
        questionnaire.contact_a_risque_espace_confine =
            event.target.elements['contact_a_risque_espace_confine'].checked
        questionnaire.contact_a_risque_meme_classe =
            event.target.elements['contact_a_risque_meme_classe'].checked
        questionnaire.contact_a_risque_autre =
            event.target.elements['contact_a_risque_autre'].checked
        stockageLocal.enregistrer(questionnaire)
        router.navigate('conseils')
    }
}

window.onSubmitFormScripts = new OnSubmitFormScripts()

var Router = require('./router.js')
window.router = Router.initRouter()
;(function () {
    document.addEventListener('dataLoaded', function () {
        router.resolve()
        updater.checkForUpdatesEvery(10) // Minutes.
    })
    stockageLocal.charger(questionnaire)
    document.getElementById('delete-data').addEventListener('click', resetPrivateData)
})()
