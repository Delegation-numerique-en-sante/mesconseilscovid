import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnRadioRequired,
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
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    toggleFormButtonOnRadioRequired(form, button.value, uncheckedLabel, requiredLabel)

    // Soumission du formulaire
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const depistageChecked = event.target.elements['depistage'].checked
        const resultatValue =
            event.target.elements['depistage_resultat'].value || undefined

        // On ne veut écraser depistage_start_date que si la valeur du
        // résultat à changé, sinon on veut pouvoir se servir de la date
        // originale pour calculer un éventuel déconfinement et/ou rendre
        // caduque le résultat du test.
        if (depistageChecked) {
            const initialDepistage = app.profil.depistage
            const initialDepistageResultat = app.profil.depistage_resultat
            if (initialDepistage) {
                if (initialDepistageResultat !== resultatValue) {
                    app.profil.depistage_resultat = resultatValue
                    app.profil.depistage_start_date = new Date()
                } else {
                    // Do nothing, we want to keep the original date.
                }
            } else {
                app.profil.depistage = depistageChecked
                app.profil.depistage_resultat = resultatValue
                app.profil.depistage_start_date = new Date()
            }
        } else {
            app.profil.depistage = depistageChecked
            app.profil.depistage_resultat = resultatValue
            app.profil.depistage_start_date = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('depistage')
        })
    })
}
