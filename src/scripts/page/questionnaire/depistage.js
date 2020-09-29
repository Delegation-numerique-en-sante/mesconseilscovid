import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnCheck,
} from '../../formutils.js'

export default function depistage(form, app) {
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
    toggleFormButtonOnCheck(form, button.value, uncheckedLabel)

    // Soumission du formulaire
    form.addEventListener('submit', function (event) {
        event.preventDefault()

        app.profil.depistage = event.target.elements['depistage'].checked
        app.profil.depistage_resultat =
            event.target.elements['depistage_resultat'].value || undefined

        app.enregistrerProfilActuel().then(() => {
            // app.goToNextPage('depistage')
            // On redirige manuellement vers le suivi pour conserver une `nextPage`
            // conseils qui va permettre de considérer la page comme étant accessible.
            let nextPage = app.questionnaire.nextPage('depistage', app.profil)
            if (nextPage === 'conseils')
                nextPage = app.profil.suivi_start_date ? 'suivisymptomes' : 'suividate'
            app.router.navigate(nextPage)
        })
    })
}
