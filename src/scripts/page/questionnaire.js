import affichage from '../affichage.js'
import formUtils from '../formutils.js'
import geoloc from '../geoloc.js'

function nom(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    const requiredLabel = 'Cette information est requise'
    formUtils.toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const nom = event.target.elements['nom'].value
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
            router.navigate('conseils')
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

function suividate(form, app, router) {
    function dateFromPicker(element) {
        if (element.value !== '') {
            return new Date(element.value)
        }
    }
    function dateFromRadioButton(element) {
        let delta
        switch (element.value) {
            case 'aujourdhui':
                delta = 0
                break
            case 'hier':
                delta = 1
                break
            case 'avant_hier':
                delta = 2
                break
            case 'avant_avant_hier':
                delta = 3
                break
        }
        const today = new Date()
        return new Date(today.setDate(today.getDate() - delta))
    }

    // Enregistre le démarrage du suivi
    if (!app.profil.hasSuiviStartDate()) {
        app.profil.suivi_start_date = new Date()
        app.enregistrerProfilActuel()
    }

    function radioButtonChanged(event) {
        let datePicker = form.querySelector('#suivi_date_exacte')
        if (event.target.value === 'encore_avant_hier') {
            datePicker.removeAttribute('disabled')
            datePicker.setAttribute('max', new Date().toISOString().slice(0, 10))
            datePicker.focus()
        } else {
            datePicker.setAttribute('disabled', '')
        }
    }
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(
        form.querySelectorAll('[name="suivi_symptomes_date"]'),
        (radio) => {
            radio.addEventListener('change', radioButtonChanged)
        }
    )

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_start_date =
            dateFromPicker(event.target.elements['suivi_symptomes_date_exacte']) ||
            dateFromRadioButton(event.target.elements['suivi_symptomes_date'])
        app.enregistrerProfilActuel()
        router.navigate('suivisymptomes')
    })
}

function suivisymptomes(form, app, router) {
    // Question affichée seulement si on répond pour un proche
    const pourUnProche = !app.profil.estMonProfil()
    var themOnly = form.querySelector('.them-only')
    if (pourUnProche) {
        affichage.showElement(themOnly)
        themOnly.classList.add('required')
    } else {
        affichage.hideElement(themOnly)
        themOnly.classList.remove('required')
    }

    var button = form.querySelector('input[type=submit]')
    // On pré-suppose que la personne qui fait son auto-suivi a des symptômes
    form['suivi_symptomes'].checked = true
    var primary = form.elements['suivi_symptomes']
    formUtils.enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        formUtils.enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de symptômes aujourd’hui'
        : 'Cette personne n’a pas de symptômes aujourd’hui'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    formUtils.toggleFormButtonOnRadioRequired(
        form,
        button.value,
        uncheckedLabel,
        requiredLabel
    )
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        let etat = {
            date: new Date().toJSON(),
            symptomes: event.target.elements['suivi_symptomes'].checked,
            essoufflement: event.target.elements['suivi_symptomes_essoufflement'].value,
            etatGeneral: event.target.elements['suivi_symptomes_etat_general'].value,
            alimentationHydratation:
                event.target.elements['suivi_symptomes_alimentation_hydratation'].value,
            etatPsychologique:
                event.target.elements['suivi_symptomes_etat_psychologique'].value,
            fievre: event.target.elements['suivi_symptomes_fievre'].value,
            diarrheeVomissements:
                event.target.elements['suivi_symptomes_diarrhee_vomissements'].value,
            mauxDeTete: event.target.elements['suivi_symptomes_maux_de_tete'].value,
            toux: event.target.elements['suivi_symptomes_toux'].value,
        }
        if (pourUnProche) {
            etat.confusion = event.target.elements['suivi_symptomes_confusion'].value
        }

        app.profil.ajouterEtat(etat)
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
    suividate,
    suivisymptomes,
}
