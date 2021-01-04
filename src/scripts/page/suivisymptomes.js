import { hideElement, showElement } from '../affichage.js'
import {
    enableOrDisableSecondaryFields,
    getRadioValue,
    toggleFormButtonOnRadioRequired,
} from '../formutils.js'

import AlgorithmeDeconfinement from '../algorithme/deconfinement.js'

export default function suivisymptomes(form, app) {
    // Enregistre le démarrage du suivi si la date n’est pas renseignée
    // (elle a pu être mise à zéro en cas d’effacement du suivi).
    if (!app.profil.hasSuiviStartDate()) {
        app.profil.suivi_start_date = new Date()
    }

    // Question affichée seulement si on répond pour un proche.
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
    // On pré-suppose que la personne qui fait son auto-suivi a des symptômes.
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
        const form = event.target
        let etat = {
            date: new Date().toJSON(),
            symptomes: form.elements['suivi_symptomes'].checked,
            essoufflement: getRadioValue(form, 'suivi_symptomes_essoufflement'),
            etatGeneral: getRadioValue(form, 'suivi_symptomes_etat_general'),
            alimentationHydratation: getRadioValue(
                form,
                'suivi_symptomes_alimentation_hydratation'
            ),
            etatPsychologique: getRadioValue(
                form,
                'suivi_symptomes_etat_psychologique'
            ),
            fievre: getRadioValue(form, 'suivi_symptomes_fievre'),
            diarrheeVomissements: getRadioValue(
                form,
                'suivi_symptomes_diarrhee_vomissements'
            ),
            mauxDeTete: getRadioValue(form, 'suivi_symptomes_maux_de_tete'),
            toux: getRadioValue(form, 'suivi_symptomes_toux'),
        }
        if (pourUnProche) {
            etat.confusion = getRadioValue(form, 'suivi_symptomes_confusion')
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

        const estOui = (symptome) => symptome === 'oui'
        const estCritiqueOuPire = (symptome) =>
            symptome === 'pire' || symptome === 'critique'

        if (etat.symptomes) {
            // Pour les asymptomatiques qui deviennent symptomatiques.
            if (typeof app.profil.symptomes_start_date === 'undefined') {
                app.profil.symptomes_start_date = new Date()
            }
            app.profil.symptomes_passes = false
            // Met à jour symptômes actuels (approximation).
            app.profil.symptomes_actuels = true
            app.profil.symptomes_actuels_temperature = estOui(etat.fievre)
            app.profil.symptomes_actuels_temperature_inconnue = false
            app.profil.symptomes_actuels_toux = estOui(etat.toux)
            // app.profil.symptomes_actuels_odorat = false // ???
            app.profil.symptomes_actuels_douleurs = estCritiqueOuPire(etat.etatGeneral)
            app.profil.symptomes_actuels_diarrhee = estOui(etat.diarrheeVomissements)
            app.profil.symptomes_actuels_fatigue = estCritiqueOuPire(etat.etatGeneral)
            app.profil.symptomes_actuels_alimentation = estOui(
                etat.alimentationHydratation
            )
            app.profil.symptomes_actuels_souffle = estCritiqueOuPire(etat.essoufflement)
        } else {
            app.profil.symptomes_passes = true
            // Mise à zéro symptômes actuels.
            app.profil.symptomes_actuels = false
            app.profil.symptomes_actuels_temperature = false
            app.profil.symptomes_actuels_temperature_inconnue = false
            app.profil.symptomes_actuels_toux = false
            // app.profil.symptomes_actuels_odorat = false // ???
            app.profil.symptomes_actuels_douleurs = false
            app.profil.symptomes_actuels_diarrhee = false
            app.profil.symptomes_actuels_fatigue = false
            app.profil.symptomes_actuels_alimentation = false
            app.profil.symptomes_actuels_souffle = false
        }

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
