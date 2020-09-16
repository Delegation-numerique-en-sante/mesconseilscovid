import { hideSelector } from '../affichage.js'
import {
    enableOrDisableSecondaryFields,
    preloadForm,
    preloadCheckboxForm,
    toggleFormButtonOnCheck,
    toggleFormButtonOnCheckRequired,
    toggleFormButtonOnSelectFieldsRequired,
    toggleFormButtonOnTextFieldsRequired,
} from '../formutils.js'
import geolocalisation from '../geoloc.js'

export function nom(form, app, router) {
    // Premier démarrage du formulaire ?
    if (!app.profil.questionnaire_started) {
        app.profil.questionnaire_started = true
        app.enregistrerProfilActuel()
        window.plausible(`Questionnaire commencé`)
    }

    var button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const nom = event.target.elements['name'].value
        app.creerProfil(nom).then(() => {
            router.navigate('residence')
        })
    })
}

export function residence(form, app, router) {
    // Premier démarrage du formulaire ?
    if (!app.profil.questionnaire_started) {
        app.profil.questionnaire_started = true
        app.enregistrerProfilActuel()
        window.plausible(`Questionnaire commencé`)
    }

    var button = form.querySelector('input[type=submit]')
    preloadForm(form, 'departement', app.profil)
    const requiredLabel = app.profil.estMonProfil()
        ? 'Votre département de résidence est requis'
        : 'Son département de résidence est requis'
    toggleFormButtonOnSelectFieldsRequired(form, button.value, requiredLabel)
    hideSelector(form, '#error-geolocalisation')
    form.querySelector('select').addEventListener('change', function () {
        hideSelector(form, '#error-geolocalisation')
    })
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.departement = event.target.elements['departement'].value
        app.enregistrerProfilActuel()
        router.navigate('foyer')
    })
    document
        .getElementById('geolocalisation')
        .addEventListener('click', geolocalisation)
}

export function beforeFoyer(profil) {
    if (!profil.isResidenceComplete()) return 'residence'
}

export function foyer(form, app, router) {
    preloadCheckboxForm(form, 'foyer_enfants', app.profil)
    preloadCheckboxForm(form, 'foyer_fragile', app.profil)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.foyer_enfants = event.target.elements['foyer_enfants'].checked
        app.profil.foyer_fragile = event.target.elements['foyer_fragile'].checked
        app.enregistrerProfilActuel()
        router.navigate('antecedents')
    })
}

export function beforeAntecedents(profil) {
    beforeFoyer(profil)
    if (!profil.isFoyerComplete()) return 'foyer'
}

export function antecedents(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'antecedent_cardio', app.profil)
    preloadCheckboxForm(form, 'antecedent_diabete', app.profil)
    preloadCheckboxForm(form, 'antecedent_respi', app.profil)
    preloadCheckboxForm(form, 'antecedent_dialyse', app.profil)
    preloadCheckboxForm(form, 'antecedent_cancer', app.profil)
    preloadCheckboxForm(form, 'antecedent_immunodep', app.profil)
    preloadCheckboxForm(form, 'antecedent_cirrhose', app.profil)
    preloadCheckboxForm(form, 'antecedent_drepano', app.profil)
    preloadCheckboxForm(form, 'antecedent_chronique_autre', app.profil)
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Aucun de ces éléments ne correspond à ma situation'
        : 'Aucun de ces éléments ne correspond à sa situation'
    toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
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
        router.navigate('caracteristiques')
    })
}

export function beforeCaracteristiques(profil) {
    beforeAntecedents(profil)
    if (!profil.isAntecedentsComplete()) return 'antecedents'
}

export function caracteristiques(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadForm(form, 'age', app.profil)
    preloadForm(form, 'taille', app.profil)
    preloadForm(form, 'poids', app.profil)
    preloadCheckboxForm(form, 'grossesse_3e_trimestre', app.profil)
    const requiredLabel = 'Les informations d’âge, de poids et de taille sont requises'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
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
            router.navigate('activitepro')
        }
    })
}

export function beforeActivitePro(profil) {
    const target = beforeCaracteristiques(profil)
    if (target) return target
    if (profil.age < 15) return 'pediatrie'
    if (!profil.isCaracteristiquesComplete()) return 'caracteristiques'
}

export function activitepro(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'activite_pro', app.profil)
    preloadCheckboxForm(form, 'activite_pro_public', app.profil)
    preloadCheckboxForm(form, 'activite_pro_sante', app.profil)
    preloadCheckboxForm(form, 'activite_pro_liberal', app.profil)
    var primary = form.elements['activite_pro']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas d’activité professionnelle ou bénévole'
        : 'Cette personne n’a pas d’activité professionnelle ou bénévole'
    toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
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
        router.navigate('symptomesactuels')
    })
}

export function beforeSymptomesActuels(profil) {
    const target = beforeActivitePro(profil)
    if (target) return target

    // Si la personne a coché une activité pro, on propose à nouveau cet écran
    // pour prendre en compte la nouvelle case : profession libérale.
    if (profil.activite_pro && typeof profil.activite_pro_liberal === 'undefined')
        return 'activitepro'

    if (!profil.isActiviteProComplete()) return 'activitepro'
}

export function symptomesactuels(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'symptomes_actuels', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_temperature', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_temperature_inconnue', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_toux', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_odorat', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_douleurs', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_diarrhee', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_fatigue', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_alimentation', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_souffle', app.profil)
    preloadCheckboxForm(form, 'symptomes_actuels_autre', app.profil)
    var primary = form.elements['symptomes_actuels']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas de symptômes actuellement'
        : 'Cette personne n’a pas de symptômes actuellement'
    const requiredLabel = 'Vous devez saisir l’un des sous-choix proposés'
    toggleFormButtonOnCheckRequired(form, button.value, uncheckedLabel, requiredLabel)
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
            if (app.profil.symptomes_start_date) {
                router.navigate('suiviintroduction')
            } else {
                router.navigate('suivimedecin')
            }
        } else {
            app.enregistrerProfilActuel()
            router.navigate('symptomespasses')
        }
    })
}

export function beforeSymptomesPasses(profil) {
    const target = beforeSymptomesActuels(profil)
    if (target) return target
    if (!profil.isSymptomesActuelsComplete()) return 'symptomesactuels'
    if (profil.symptomes_actuels === true && profil.symptomes_actuels_autre === false)
        return 'conseils'
}

export function symptomespasses(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'symptomes_passes', app.profil)
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de symptômes dans les 14 derniers jours'
        : 'Cette personne n’a pas eu de symptômes dans les 14 derniers jours'
    toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
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

export function beforeContactARisque(profil) {
    const target = beforeSymptomesPasses(profil)
    if (target) return target
    if (!profil.isSymptomesPassesComplete()) return 'symptomespasses'
    if (profil.symptomes_passes === true) return 'conseils'
}

export function contactarisque(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'contact_a_risque', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_contact_direct', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_actes', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_espace_confine', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_classe', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_stop_covid', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_autre', app.profil)
    var primary = form.elements['contact_a_risque']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })
    toggleFormButtonOnCheckRequired(
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
