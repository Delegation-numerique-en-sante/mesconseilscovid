import {
    preloadForm,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsRequired,
} from '../../formutils.js'

export default function caracteristiques(form, app) {
    var button = form.querySelector('input[type=submit]')
    preloadForm(form, 'age', app.profil)
    preloadForm(form, 'taille', app.profil)
    preloadForm(form, 'poids', app.profil)
    preloadCheckboxForm(form, 'grossesse_3e_trimestre', app.profil)
    const requiredLabel = 'Les informations d’âge, de poids et de taille sont requises'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.age = parseEntier(event.target.elements['age'])
        app.profil.poids = parseEntier(event.target.elements['poids'])
        app.profil.taille = parseTaille(event.target.elements['taille'])
        app.profil.grossesse_3e_trimestre =
            event.target.elements['grossesse_3e_trimestre'].checked
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('caracteristiques')
        })
    })
}

function parseEntier(element) {
    let taille = parseFloat(element.value.replace(',', '.'))
    return Math.round(taille)
}

function parseTaille(element) {
    let taille = parseFloat(element.value.replace(',', '.'))
    if (taille < 3) {
        // mètres au lieu de centimètres ?
        taille *= 100
    }
    return Math.round(taille)
}
