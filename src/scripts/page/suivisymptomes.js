import { hideElement, showElement } from '../affichage.js'
import {
    enableOrDisableSecondaryFields,
    toggleFormButtonOnRadioRequired,
} from '../formutils.js'

import AlgorithmeDeconfinement from '../algorithme/deconfinement.js'

export default function suivisymptomes(form, app) {
    // Enregistre le démarrage du suivi si la date n’est pas renseignée
    // (elle a pu être mise à zéro en cas d’effacement du suivi).
    if (!app.profil.hasSuiviStartDate()) {
        app.profil.suivi_start_date = new Date()
    }

    // Question affichée seulement si on répond pour un proche
    const pourUnProche = !app.profil.estMonProfil()
    var themOnly = form.querySelector('.them-only')
    if (pourUnProche) {
        showElement(themOnly)
        themOnly.classList.add('required')
    } else {
        hideElement(themOnly)
        themOnly.classList.remove('required')
    }

    var button = form.querySelector('input[type=submit]')
    // On pré-suppose que la personne qui fait son auto-suivi a des symptômes
    form['suivi_symptomes'].checked = true
    var primary = form.elements['suivi_symptomes']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = pourUnProche
        ? 'Cette personne n’a pas de symptômes aujourd’hui'
        : 'Je n’ai pas eu de symptômes aujourd’hui'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnRadioRequired(form, button.value, uncheckedLabel, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const elements = event.target.elements
        let etat = {
            date: new Date().toJSON(),
            symptomes: elements['suivi_symptomes'].checked,
            essoufflement: elements['suivi_symptomes_essoufflement'].value,
            etatGeneral: elements['suivi_symptomes_etat_general'].value,
            alimentationHydratation:
                elements['suivi_symptomes_alimentation_hydratation'].value,
            etatPsychologique: elements['suivi_symptomes_etat_psychologique'].value,
            fievre: elements['suivi_symptomes_fievre'].value,
            diarrheeVomissements:
                elements['suivi_symptomes_diarrhee_vomissements'].value,
            mauxDeTete: elements['suivi_symptomes_maux_de_tete'].value,
            toux: elements['suivi_symptomes_toux'].value,
        }
        if (pourUnProche) {
            etat.confusion = elements['suivi_symptomes_confusion'].value
        }

        app.profil.ajouterEtat(etat)

        window.plausible(`Suivi rempli`)

        if (app.profil.suivi.length === 1) {
            window.plausible(`Premier suivi`)
        } else if (app.profil.suivi.length === 2) {
            window.plausible(`Deuxième suivi`)
        } else if (app.profil.suivi.length === 3) {
            window.plausible(`Troisième suivi`)
        }

        app.profil.symptomes_actuels = etat.symptomes
        app.profil.symptomes_actuels_temperature = etat.fievre === 'oui'
        app.profil.symptomes_actuels_temperature_inconnue = false
        app.profil.symptomes_actuels_toux = etat.toux === 'oui'
        // app.profil.symptomes_actuels_odorat = false // ???
        app.profil.symptomes_actuels_douleurs =
            etat.etatGeneral === 'pire' || etat.etatGeneral === 'critique'
        app.profil.symptomes_actuels_diarrhee = etat.diarrheeVomissements === 'oui'
        app.profil.symptomes_actuels_fatigue =
            etat.etatGeneral === 'pire' || etat.etatGeneral === 'critique'
        app.profil.symptomes_actuels_alimentation =
            etat.alimentationHydratation === 'oui'
        app.profil.symptomes_actuels_souffle =
            etat.essoufflement === 'pire' || etat.etatGeneral === 'critique'

        const algoDeconfinement = new AlgorithmeDeconfinement(app.profil)
        if (algoDeconfinement.isDeconfinable()) {
            if (!app.profil.hasDeconfinementDate()) {
                app.profil.deconfinement_date = new Date()
                window.plausible(`Suivi deconfinement`)
            }
        } else {
            app.profil.deconfinement_date = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('suivisymptomes')
        })
    })
}
