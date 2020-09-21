import {
    preloadForm,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsRequired,
} from '../../formutils.js'

export function caracteristiques(form, app) {
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
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('caracteristiques')
        })
    })
}
