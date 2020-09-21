import { preloadCheckboxForm, toggleFormButtonOnCheck } from '../../formutils.js'

import { beforeSymptomesActuels } from './symptomesactuels.js'

export function beforeSymptomesPasses(profil) {
    const target = beforeSymptomesActuels(profil)
    if (target) return target
    if (!profil.isSymptomesActuelsComplete()) return 'symptomesactuels'
    if (profil.symptomes_actuels === true && profil.symptomes_actuels_autre === false)
        return 'conseils'
}

export function symptomespasses(form, app) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'symptomes_passes', app.profil)
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de symptômes dans les 14 derniers jours'
        : 'Cette personne n’a pas eu de symptômes dans les 14 derniers jours'
    toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.symptomes_passes = event.target.elements['symptomes_passes'].checked

        // On complète manuellement le formulaire pour le rendre complet.
        if (app.profil.symptomes_passes) {
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
            app.goToNextPage('symptomespasses')
        })
    })
}
