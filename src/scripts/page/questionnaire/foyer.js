import { preloadCheckboxForm } from '../../formutils.js'

export default function foyer(form, app) {
    preloadCheckboxForm(form, 'foyer_enfants', app.profil)
    preloadCheckboxForm(form, 'foyer_fragile', app.profil)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.foyer_enfants = event.target.elements['foyer_enfants'].checked
        app.profil.foyer_fragile = event.target.elements['foyer_fragile'].checked
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('foyer')
        })
    })
}
