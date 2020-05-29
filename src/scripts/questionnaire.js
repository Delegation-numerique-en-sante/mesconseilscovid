var affichage = require('./affichage.js')
var formUtils = require('./formutils.js')
var geoloc = require('./geoloc.js')

function residence(form, profil, stockageLocal, router) {
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
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.departement = event.target.elements['departement'].value
        stockageLocal.enregistrer(profil)
        router.navigate('activitepro')
    })
    document
        .getElementById('geolocalisation')
        .addEventListener('click', geoloc.geolocalisation)
}

function activitepro(form, profil, stockageLocal, router) {
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
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.activite_pro = event.target.elements['activite_pro'].checked
        profil.activite_pro_public =
            event.target.elements['activite_pro_public'].checked
        profil.activite_pro_sante = event.target.elements['activite_pro_sante'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('foyer')
    })
}

function foyer(form, profil, stockageLocal, router) {
    formUtils.preloadCheckboxForm(form, 'foyer_enfants')
    formUtils.preloadCheckboxForm(form, 'foyer_fragile')
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.foyer_enfants = event.target.elements['foyer_enfants'].checked
        profil.foyer_fragile = event.target.elements['foyer_fragile'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('caracteristiques')
    })
}

function caracteristiques(form, profil, stockageLocal, router) {
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
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.sup65 = event.target.elements['sup65'].checked
        profil.grossesse_3e_trimestre =
            event.target.elements['grossesse_3e_trimestre'].checked
        profil.poids = event.target.elements['poids'].value
        profil.taille = event.target.elements['taille'].value
        stockageLocal.enregistrer(profil)
        router.navigate('antecedents')
    })
}

function antecedents(form, profil, stockageLocal, router) {
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
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.antecedent_cardio = event.target.elements['antecedent_cardio'].checked
        profil.antecedent_diabete = event.target.elements['antecedent_diabete'].checked
        profil.antecedent_respi = event.target.elements['antecedent_respi'].checked
        profil.antecedent_dialyse = event.target.elements['antecedent_dialyse'].checked
        profil.antecedent_cancer = event.target.elements['antecedent_cancer'].checked
        profil.antecedent_immunodep =
            event.target.elements['antecedent_immunodep'].checked
        profil.antecedent_cirrhose =
            event.target.elements['antecedent_cirrhose'].checked
        profil.antecedent_drepano = event.target.elements['antecedent_drepano'].checked
        profil.antecedent_chronique_autre =
            event.target.elements['antecedent_chronique_autre'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('symptomesactuels')
    })
}

function symptomesactuels(form, profil, stockageLocal, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels')
    formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.symptomes_actuels = event.target.elements['symptomes_actuels'].checked
        if (profil.symptomes_actuels) {
            // On complète manuellement le formulaire pour le rendre complet.
            profil.symptomes_passes = false
            profil.contact_a_risque = false
            profil.contact_a_risque_meme_lieu_de_vie = undefined
            profil.contact_a_risque_contact_direct = undefined
            profil.contact_a_risque_actes = undefined
            profil.contact_a_risque_espace_confine = undefined
            profil.contact_a_risque_meme_classe = undefined
            profil.contact_a_risque_autre = undefined
            stockageLocal.enregistrer(profil)
            router.navigate('conseils')
        } else {
            stockageLocal.enregistrer(profil)
            router.navigate('symptomespasses')
        }
    })
}

function symptomespasses(form, profil, stockageLocal, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'symptomes_passes')
    formUtils.toggleFormButtonOnCheck(form, button.value, 'Terminer')
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.symptomes_passes = event.target.elements['symptomes_passes'].checked
        if (profil.symptomes_passes) {
            // On complète manuellement le formulaire pour le rendre complet.
            profil.contact_a_risque = false
            profil.contact_a_risque_meme_lieu_de_vie = undefined
            profil.contact_a_risque_contact_direct = undefined
            profil.contact_a_risque_actes = undefined
            profil.contact_a_risque_espace_confine = undefined
            profil.contact_a_risque_meme_classe = undefined
            profil.contact_a_risque_autre = undefined
            stockageLocal.enregistrer(profil)
            router.navigate('conseils')
        } else {
            stockageLocal.enregistrer(profil)
            router.navigate('contactarisque')
        }
    })
}

function contactarisque(form, profil, stockageLocal, router) {
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
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        profil.contact_a_risque = event.target.elements['contact_a_risque'].checked
        profil.contact_a_risque_meme_lieu_de_vie =
            event.target.elements['contact_a_risque_meme_lieu_de_vie'].checked
        profil.contact_a_risque_contact_direct =
            event.target.elements['contact_a_risque_contact_direct'].checked
        profil.contact_a_risque_actes =
            event.target.elements['contact_a_risque_actes'].checked
        profil.contact_a_risque_espace_confine =
            event.target.elements['contact_a_risque_espace_confine'].checked
        profil.contact_a_risque_meme_classe =
            event.target.elements['contact_a_risque_meme_classe'].checked
        profil.contact_a_risque_autre =
            event.target.elements['contact_a_risque_autre'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('conseils')
    })
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
