import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnRadioRequired,
} from '../../formutils.js'

export default function depistage(form, app) {
    // Premier démarrage du formulaire ?
    if (!app.profil.questionnaire_started) {
        app.profil.questionnaire_started = true
        app.enregistrerProfilActuel()
        window.plausible(`Questionnaire commencé`)
    }

    // Remplir le formulaire avec les données du profil
    preloadCheckboxForm(form, 'depistage', app.profil)
    if (app.profil.depistage) {
        if (app.profil.depistage_resultat === 'positif') {
            form.querySelector('#depistage_resultat_positif').checked = true
        } else if (app.profil.depistage_resultat === 'negatif') {
            form.querySelector('#depistage_resultat_negatif').checked = true
        } else if (app.profil.depistage_resultat === 'en_attente') {
            form.querySelector('#depistage_resultat_en_attente').checked = true
        }
    }

    // La première case active ou désactive les autres
    var primary = form.elements['depistage']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })

    // Le libellé du bouton change en fonction des choix
    var button = form.querySelector('input[type=submit]')
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas passé de test'
        : 'Cette personne n’a pas passé de test'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnRadioRequired(form, button.value, uncheckedLabel, requiredLabel)

    // Soumission du formulaire
    form.addEventListener('submit', function (event) {
        event.preventDefault()

        app.profil.depistage = event.target.elements['depistage'].checked
        app.profil.depistage_resultat =
            event.target.elements['depistage_resultat'].value || undefined

        // On complète manuellement le formulaire pour le rendre complet.
        if (app.profil.requiertSuivi()) {
            app.profil.symptomes_actuels = false // Temporaire.
            app.profil.symptomes_actuels_alimentation = undefined
            app.profil.symptomes_actuels_autre = undefined
            app.profil.symptomes_actuels_diarrhee = undefined
            app.profil.symptomes_actuels_douleurs = undefined
            app.profil.symptomes_actuels_fatigue = undefined
            app.profil.symptomes_actuels_odorat = undefined
            app.profil.symptomes_actuels_souffle = undefined
            app.profil.symptomes_actuels_temperature = undefined
            app.profil.symptomes_actuels_temperature_inconnue = undefined
            app.profil.symptomes_actuels_toux = undefined
            app.profil.symptomes_passes = false
            app.profil.contact_a_risque = false
            app.profil.contact_a_risque_meme_lieu_de_vie = undefined
            app.profil.contact_a_risque_contact_direct = undefined
            app.profil.contact_a_risque_actes = undefined
            app.profil.contact_a_risque_espace_confine = undefined
            app.profil.contact_a_risque_meme_classe = undefined
            app.profil.contact_a_risque_stop_covid = undefined
            app.profil.contact_a_risque_autre = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('depistage')
        })
    })
}
