import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnCheckRequired,
} from '../../formutils.js'

export default function contactarisque(form, app) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'contact_a_risque', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_contact_direct', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_actes', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_espace_confine', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_classe', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_stop_covid', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_autre', app.profil)
    var primary = form.elements['contact_a_risque']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de contact récents'
        : 'Cette personne n’a pas eu de contact récents'
    toggleFormButtonOnCheckRequired(
        form,
        button.value,
        uncheckedLabel,
        'Vous devez saisir l’un des sous-choix proposés'
    )
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.contact_a_risque = event.target.elements['contact_a_risque'].checked
        app.profil.contact_a_risque_meme_lieu_de_vie =
            event.target.elements['contact_a_risque_meme_lieu_de_vie'].checked
        app.profil.contact_a_risque_contact_direct =
            event.target.elements['contact_a_risque_contact_direct'].checked
        app.profil.contact_a_risque_actes =
            event.target.elements['contact_a_risque_actes'].checked
        app.profil.contact_a_risque_espace_confine =
            event.target.elements['contact_a_risque_espace_confine'].checked
        app.profil.contact_a_risque_meme_classe =
            event.target.elements['contact_a_risque_meme_classe'].checked
        app.profil.contact_a_risque_stop_covid =
            event.target.elements['contact_a_risque_stop_covid'].checked
        app.profil.contact_a_risque_autre =
            event.target.elements['contact_a_risque_autre'].checked
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('contactarisque')
        })
    })
}
