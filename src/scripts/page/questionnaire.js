import affichage from '../affichage.js'
import formUtils from '../formutils.js'
import geoloc from '../geoloc.js'

function nom(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    formUtils.toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const nom = event.target.elements['name'].value
        app.creerProfil(nom).then(() => {
            router.navigate('residence')
        })
    })
}

function residence(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadForm(form, 'departement', app.profil)
    const requiredLabel = app.profil.estMonProfil()
        ? 'Votre département de résidence est requis'
        : 'Son département de résidence est requis'
    formUtils.toggleFormButtonOnSelectFieldsRequired(form, button.value, requiredLabel)
    affichage.hideSelector(form, '#error-geolocalisation')
    form.querySelector('select').addEventListener('change', function () {
        affichage.hideSelector(form, '#error-geolocalisation')
    })
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.departement = event.target.elements['departement'].value
        app.enregistrerProfilActuel()
        router.navigate('activitepro')
    })
    document
        .getElementById('geolocalisation')
        .addEventListener('click', geoloc.geolocalisation)
}

function activitepro(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'activite_pro', app.profil)
    formUtils.preloadCheckboxForm(form, 'activite_pro_public', app.profil)
    formUtils.preloadCheckboxForm(form, 'activite_pro_sante', app.profil)
    formUtils.preloadCheckboxForm(form, 'activite_pro_liberal', app.profil)
    var primary = form.elements['activite_pro']
    formUtils.enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        formUtils.enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas d’activité professionnelle ou bénévole'
        : 'Cette personne n’a pas d’activité professionnelle ou bénévole'
    formUtils.toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.activite_pro = event.target.elements['activite_pro'].checked
        app.profil.activite_pro_public =
            event.target.elements['activite_pro_public'].checked
        app.profil.activite_pro_sante =
            event.target.elements['activite_pro_sante'].checked
        app.profil.activite_pro_liberal =
            event.target.elements['activite_pro_liberal'].checked
        app.enregistrerProfilActuel()
        router.navigate('foyer')
    })
}

function foyer(form, app, router) {
    formUtils.preloadCheckboxForm(form, 'foyer_enfants', app.profil)
    formUtils.preloadCheckboxForm(form, 'foyer_fragile', app.profil)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.foyer_enfants = event.target.elements['foyer_enfants'].checked
        app.profil.foyer_fragile = event.target.elements['foyer_fragile'].checked
        app.enregistrerProfilActuel()
        router.navigate('caracteristiques')
    })
}

function caracteristiques(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadForm(form, 'age', app.profil)
    formUtils.preloadForm(form, 'taille', app.profil)
    formUtils.preloadForm(form, 'poids', app.profil)
    formUtils.preloadCheckboxForm(form, 'grossesse_3e_trimestre', app.profil)
    const requiredLabel = 'Les informations d’âge, de poids et de taille sont requises'
    formUtils.toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.age = event.target.elements['age'].value
        app.profil.poids = event.target.elements['poids'].value
        app.profil.taille = event.target.elements['taille'].value
        app.profil.grossesse_3e_trimestre =
            event.target.elements['grossesse_3e_trimestre'].checked
        app.enregistrerProfilActuel()
        if (app.profil.age < 15) {
            router.navigate('pediatrie')
        } else {
            router.navigate('antecedents')
        }
    })
}

function antecedents(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'antecedent_cardio', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_diabete', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_respi', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_dialyse', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_cancer', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_immunodep', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_cirrhose', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_drepano', app.profil)
    formUtils.preloadCheckboxForm(form, 'antecedent_chronique_autre', app.profil)
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Aucun de ces éléments ne correspond à ma situation'
        : 'Aucun de ces éléments ne correspond à sa situation'
    formUtils.toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.antecedent_cardio =
            event.target.elements['antecedent_cardio'].checked
        app.profil.antecedent_diabete =
            event.target.elements['antecedent_diabete'].checked
        app.profil.antecedent_respi = event.target.elements['antecedent_respi'].checked
        app.profil.antecedent_dialyse =
            event.target.elements['antecedent_dialyse'].checked
        app.profil.antecedent_cancer =
            event.target.elements['antecedent_cancer'].checked
        app.profil.antecedent_immunodep =
            event.target.elements['antecedent_immunodep'].checked
        app.profil.antecedent_cirrhose =
            event.target.elements['antecedent_cirrhose'].checked
        app.profil.antecedent_drepano =
            event.target.elements['antecedent_drepano'].checked
        app.profil.antecedent_chronique_autre =
            event.target.elements['antecedent_chronique_autre'].checked
        app.enregistrerProfilActuel()
        router.navigate('symptomesactuels')
    })
}

function symptomesactuels(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_temperature', app.profil)
    formUtils.preloadCheckboxForm(
        form,
        'symptomes_actuels_temperature_inconnue',
        app.profil
    )
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_toux', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_odorat', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_douleurs', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_diarrhee', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_fatigue', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_alimentation', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_souffle', app.profil)
    formUtils.preloadCheckboxForm(form, 'symptomes_actuels_autre', app.profil)
    var primary = form.elements['symptomes_actuels']
    formUtils.enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        formUtils.enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas de symptômes actuellement'
        : 'Cette personne n’a pas de symptômes actuellement'
    const requiredLabel = 'Vous devez saisir l’un des sous-choix proposés'
    formUtils.toggleFormButtonOnCheckRequired(
        form,
        button.value,
        uncheckedLabel,
        requiredLabel
    )
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_actuels =
            event.target.elements['symptomes_actuels'].checked
        app.profil.symptomes_actuels_temperature =
            event.target.elements['symptomes_actuels_temperature'].checked
        app.profil.symptomes_actuels_temperature_inconnue =
            event.target.elements['symptomes_actuels_temperature_inconnue'].checked
        app.profil.symptomes_actuels_toux =
            event.target.elements['symptomes_actuels_toux'].checked
        app.profil.symptomes_actuels_odorat =
            event.target.elements['symptomes_actuels_odorat'].checked
        app.profil.symptomes_actuels_douleurs =
            event.target.elements['symptomes_actuels_douleurs'].checked
        app.profil.symptomes_actuels_diarrhee =
            event.target.elements['symptomes_actuels_diarrhee'].checked
        app.profil.symptomes_actuels_fatigue =
            event.target.elements['symptomes_actuels_fatigue'].checked
        app.profil.symptomes_actuels_alimentation =
            event.target.elements['symptomes_actuels_alimentation'].checked
        app.profil.symptomes_actuels_souffle =
            event.target.elements['symptomes_actuels_souffle'].checked
        app.profil.symptomes_actuels_autre =
            event.target.elements['symptomes_actuels_autre'].checked
        if (app.profil.symptomes_actuels && !app.profil.symptomes_actuels_autre) {
            // On complète manuellement le formulaire pour le rendre complet.
            app.profil.symptomes_passes = false
            app.profil.contact_a_risque = false
            app.profil.contact_a_risque_meme_lieu_de_vie = undefined
            app.profil.contact_a_risque_contact_direct = undefined
            app.profil.contact_a_risque_actes = undefined
            app.profil.contact_a_risque_espace_confine = undefined
            app.profil.contact_a_risque_meme_classe = undefined
            app.profil.contact_a_risque_stop_covid = undefined
            app.profil.contact_a_risque_autre = undefined
            app.enregistrerProfilActuel()
            router.navigate('suivimedecin')
        } else {
            app.enregistrerProfilActuel()
            router.navigate('symptomespasses')
        }
    })
}

function symptomespasses(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'symptomes_passes', app.profil)
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de symptômes dans les 14 derniers jours'
        : 'Cette personne n’a pas eu de symptômes dans les 14 derniers jours'
    formUtils.toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_passes = event.target.elements['symptomes_passes'].checked
        if (app.profil.symptomes_passes) {
            // On complète manuellement le formulaire pour le rendre complet.
            app.profil.contact_a_risque = false
            app.profil.contact_a_risque_meme_lieu_de_vie = undefined
            app.profil.contact_a_risque_contact_direct = undefined
            app.profil.contact_a_risque_actes = undefined
            app.profil.contact_a_risque_espace_confine = undefined
            app.profil.contact_a_risque_meme_classe = undefined
            app.profil.contact_a_risque_stop_covid = undefined
            app.profil.contact_a_risque_autre = undefined
            app.enregistrerProfilActuel()
            router.navigate('conseils')
        } else {
            app.enregistrerProfilActuel()
            router.navigate('contactarisque')
        }
    })
}

function contactarisque(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    formUtils.preloadCheckboxForm(form, 'contact_a_risque', app.profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie', app.profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_contact_direct', app.profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_actes', app.profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_espace_confine', app.profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_meme_classe', app.profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_stop_covid', app.profil)
    formUtils.preloadCheckboxForm(form, 'contact_a_risque_autre', app.profil)
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
        app.profil.contact_a_risque = event.target.elements['contact_a_risque'].checked
        app.profil.contact_a_risque_meme_lieu_de_vie =
            event.target.elements['contact_a_risque_meme_lieu_de_vie'].checked
        app.profil.contact_a_risque_contact_direct =
            event.target.elements['contact_a_risque_contact_direct'].checked
        app.profil.contact_a_risque_actes =
            event.target.elements['contact_a_risque_actes'].checked
        app.profil.contact_a_risque_espace_confine =
            event.target.elements['contact_a_risque_espace_confine'].checked
        app.profil.contact_a_risque_meme_classe =
            event.target.elements['contact_a_risque_meme_classe'].checked
        app.profil.contact_a_risque_stop_covid =
            event.target.elements['contact_a_risque_stop_covid'].checked
        app.profil.contact_a_risque_autre =
            event.target.elements['contact_a_risque_autre'].checked
        app.enregistrerProfilActuel()
        router.navigate('conseils')
    })
}

module.exports = {
    nom,
    residence,
    activitepro,
    foyer,
    caracteristiques,
    antecedents,
    symptomesactuels,
    symptomespasses,
    contactarisque,
}
