import { hideSelector } from '../../affichage.js'
import { preloadForm, toggleFormButtonOnSelectFieldsRequired } from '../../formutils.js'
import geolocalisation from '../../geoloc.js'

export default function residence(form, app) {
    var button = form.querySelector('input[type=submit]')
    preloadForm(form, 'departement', app.profil)
    const requiredLabel = app.profil.estMonProfil()
        ? 'Votre département de résidence est requis'
        : 'Son département de résidence est requis'
    toggleFormButtonOnSelectFieldsRequired(form, button.value, requiredLabel)
    hideSelector(form, '#error-geolocalisation')
    form.querySelector('select').addEventListener('change', function () {
        hideSelector(form, '#error-geolocalisation')
    })
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.departement = event.target.elements['departement'].value
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('residence')
        })
    })
    document
        .getElementById('geolocalisation')
        .addEventListener('click', geolocalisation)
}
