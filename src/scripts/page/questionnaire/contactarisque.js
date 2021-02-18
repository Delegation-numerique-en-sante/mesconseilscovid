import {
    enableOrDisableSecondaryFields,
    getRadioValue,
    preloadCheckboxForm,
    toggleFormButtonOnCheckAndRadiosRequired,
} from '../../formutils.js'
import { hideVariante, showVariante } from './variante.js'

export default function contactarisque(form, app) {
    var button = form.querySelector('input[type=submit]')

    // Pré-remplit le formulaire
    preloadCheckboxForm(form, 'contact_a_risque', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_lieu_de_vie', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_contact_direct', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_actes', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_espace_confine', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_meme_classe', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_stop_covid', app.profil)
    preloadCheckboxForm(form, 'contact_a_risque_autre', app.profil)

    // Pré-remplit la variante
    const varianteRadio = form.querySelector('#contact-a-risque-variante')
    if (app.profil.contact_a_risque) {
        showVariante(varianteRadio)
        if (app.profil.contact_a_risque_variante === '20I/501Y.V1') {
            form.querySelector('#contact_a_risque_variante_v1').checked = true
        } else if (
            app.profil.contact_a_risque_variante === '20H/501Y.V2_ou_20J/501Y.V3'
        ) {
            form.querySelector('#contact_a_risque_variante_v2_ou_v3').checked = true
        } else if (app.profil.contact_a_risque_variante === 'autre') {
            form.querySelector('#contact_a_risque_variante_autre').checked = true
        }
    } else {
        hideVariante(varianteRadio)
    }

    var primary = form.elements['contact_a_risque']
    enableOrDisableSecondaryFields(form, primary)

    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
        if (primary.checked) {
            showVariante(varianteRadio)
        } else {
            hideVariante(varianteRadio)
        }
    })

    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas eu de contact à risque'
        : 'Cette personne n’a pas eu de contact à risque'
    toggleFormButtonOnCheckAndRadiosRequired(
        form,
        button.value,
        uncheckedLabel,
        'Veuillez remplir le formulaire au complet'
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
        if (app.profil.contact_a_risque) {
            app.profil.contact_a_risque_variante = getRadioValue(
                form,
                'contact_a_risque_variante'
            )
        }
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('contactarisque')
        })
    })
}
