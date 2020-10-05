import { preloadCheckboxForm, toggleFormButtonOnCheck } from '../../formutils.js'

export default function symptomespasses(form, app) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'symptomes_passes', app.profil)
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de symptômes dans les 7 derniers jours'
        : 'Cette personne n’a pas eu de symptômes dans les 7 derniers jours'
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
            // On redirige manuellement vers le suivi pour conserver une `nextPage`
            // conseils qui va permettre de considérer la page comme étant accessible.
            let nextPage = app.questionnaire.nextPage('symptomespasses', app.profil)
            if (nextPage === 'conseils')
                nextPage = app.profil.suivi_start_date ? 'suivisymptomes' : 'suividate'
            app.router.navigate(nextPage)
        })
    })
}
