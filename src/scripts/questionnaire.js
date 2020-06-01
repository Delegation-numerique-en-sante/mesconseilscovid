var affichage = require('./affichage.js')
var formUtils = require('./formutils.js')
var geoloc = require('./geoloc.js')

function residence(form, profil, stockageLocal, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadForm(form, 'departement', profil)
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
    formUtils.preloadCheckboxForm(form, 'activite_pro', profil)
    formUtils.preloadCheckboxForm(form, 'activite_pro_public', profil)
    formUtils.preloadCheckboxForm(form, 'activite_pro_sante', profil)
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
    formUtils.preloadCheckboxForm(form, 'foyer_enfants', profil)
    formUtils.preloadCheckboxForm(form, 'foyer_fragile', profil)
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
    formUtils.preloadCheckboxForm(form, 'sup65', profil)
    formUtils.preloadCheckboxForm(form, 'grossesse_3e_trimestre', profil)
    formUtils.preloadForm(form, 'taille', profil)
    formUtils.preloadForm(form, 'poids', profil)
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
    formUtils.preloadCheckboxForm(form, 'antecedent_cardio', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_diabete', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_respi', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_dialyse', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_cancer', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_immunodep', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_cirrhose', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_drepano', profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_chronique_autre', profil)
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
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels', profil)
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
            profil.contact_a_risque_stop_covid = undefined
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
    formUtils.preloadCheckboxForm(form, 'symptomes_passes', profil)
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
            profil.contact_a_risque_stop_covid = undefined
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
    formUtils.preloadCheckboxForm(form, 'contact_a_risque', profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie', profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_contact_direct', profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_actes', profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_espace_confine', profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_classe', profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_stop_covid', profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_autre', profil)
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
        profil.contact_a_risque_stop_covid =
            event.target.elements['contact_a_risque_stop_covid'].checked
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
