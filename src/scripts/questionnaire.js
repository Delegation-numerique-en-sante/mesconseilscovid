var affichage = require('./affichage.js')
var formUtils = require('./formutils.js')
var geoloc = require('./geoloc.js')

function residence(pageName, form) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadForm(form, 'departement')
    formUtils.toggleFormButtonOnSelectFieldsRequired(
        form,
        button.value,
        'Votre département de résidence est requis'
    )
    affichage.hideSelector(form, '#error-geolocalisation')
    form.querySelector('select').addEventListener('change', function () {
        affichage.hideSelector(form, '#error-geolocalisation')
    })
    form.addEventListener('submit', onSubmitFormScripts[pageName])
    document
        .getElementById('geolocalisation')
        .addEventListener('click', geoloc.geolocalisation)
}

function activitepro(pageName, form) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'activite_pro')
    formUtils.preloadCheckboxForm(form, 'activite_pro_public')
    formUtils.preloadCheckboxForm(form, 'activite_pro_sante')
    var primary = form.elements['activite_pro']
    formUtils.enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        formUtils.enableOrDisableSecondaryFields(form, primary)
    })
    formUtils.toggleFormButtonOnCheck(form, button.value, 'Continuer')
    form.addEventListener('submit', onSubmitFormScripts[pageName])
}

function foyer(pageName, form) {
    formUtils.preloadCheckboxForm(form, 'foyer_enfants')
    formUtils.preloadCheckboxForm(form, 'foyer_fragile')
    form.addEventListener('submit', onSubmitFormScripts[pageName])
}

function caracteristiques(pageName, form) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'sup65')
    formUtils.preloadCheckboxForm(form, 'grossesse_3e_trimestre')
    formUtils.preloadForm(form, 'taille')
    formUtils.preloadForm(form, 'poids')
    formUtils.toggleFormButtonOnTextFieldsRequired(
        form,
        button.value,
        'Les informations de poids et de taille sont requises'
    )
    form.addEventListener('submit', onSubmitFormScripts[pageName])
}

function antecedents(pageName, form) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'antecedent_cardio')
    formUtils.preloadCheckboxForm(form, 'antecedent_diabete')
    formUtils.preloadCheckboxForm(form, 'antecedent_respi')
    formUtils.preloadCheckboxForm(form, 'antecedent_dialyse')
    formUtils.preloadCheckboxForm(form, 'antecedent_cancer')
    formUtils.preloadCheckboxForm(form, 'antecedent_immunodep')
    formUtils.preloadCheckboxForm(form, 'antecedent_cirrhose')
    formUtils.preloadCheckboxForm(form, 'antecedent_drepano')
    formUtils.preloadCheckboxForm(form, 'antecedent_chronique_autre')
    formUtils.toggleFormButtonOnCheck(form, button.value, 'Continuer')
    form.addEventListener('submit', onSubmitFormScripts[pageName])
}

function symptomesactuels(pageName, form) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels')
    formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
    form.addEventListener('submit', onSubmitFormScripts[pageName])
}

function symptomespasses(pageName, form) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'symptomes_passes')
    formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
    form.addEventListener('submit', onSubmitFormScripts[pageName])
}

function contactarisque(pageName, form) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_contact_direct')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_actes')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_espace_confine')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_classe')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_autre')
    var primary = form.elements['contact_a_risque']
    formUtils.enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        formUtils.enableOrDisableSecondaryFields(form, primary)
    })
    formUtils.toggleFormButtonOnCheckRequired(
        form,
        button.value,
        'Terminer',
        'Vous devez saisir l’un des sous-choix proposés'
    )
    form.addEventListener('submit', onSubmitFormScripts[pageName])
}

module.exports = {
    residence,
    activitepro,
    foyer,
    caracteristiques,
    antecedents,
    symptomesactuels,
    symptomespasses,
    contactarisque,
}
