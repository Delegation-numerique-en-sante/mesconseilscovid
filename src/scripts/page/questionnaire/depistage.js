import { hideElement, showElement } from '../../affichage'
import { addDatePickerPolyfill } from '../../datepicker'
import {
    enableOrDisableSecondaryFields,
    getRadioValue,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils'

export default function depistage(page, app) {
    const form = page.querySelector('form')

    const datePicker = form.querySelector('#depistage_start_date')
    // Autorise seulement une date passée.
    const now = new Date()
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))

    // Remplir le formulaire avec les données du profil.
    preloadCheckboxForm(form, 'depistage', app.profil)
    if (app.profil.depistage) {
        if (typeof app.profil.depistage_start_date !== 'undefined') {
            datePicker.value = app.profil.depistage_start_date
                .toISOString()
                .substring(0, 10)
        }

        if (app.profil.depistage_type === 'antigenique') {
            form.querySelector('#depistage_type_antigenique').checked = true
        } else if (app.profil.depistage_type === 'rt-pcr') {
            form.querySelector('#depistage_type_rtpcr').checked = true
        } else if (app.profil.depistage_type === 'antigenique_autotest') {
            form.querySelector('#depistage_type_antigenique_autotest').checked = true
        }

        if (app.profil.depistage_resultat === 'positif') {
            form.querySelector('#depistage_resultat_positif').checked = true
        } else if (app.profil.depistage_resultat === 'negatif') {
            form.querySelector('#depistage_resultat_negatif').checked = true
        } else if (app.profil.depistage_resultat === 'en_attente') {
            form.querySelector('#depistage_resultat_en_attente').checked = true
        }
    }

    // La première case active ou désactive les autres.
    var primary = form.elements['depistage']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })

    // On ne propose "en attente" que pour les tests RT-PCR.
    const enAttente = form.querySelector('#depistage_resultat_en_attente')
    const enAttenteLabel = form.querySelector(
        'label[for="depistage_resultat_en_attente"]'
    )
    function afficherOuCacherEnAttente() {
        if (getRadioValue(form, 'depistage_type') == 'rt-pcr') {
            showElement(enAttente)
            showElement(enAttenteLabel)
        } else {
            enAttente.checked = false
            hideElement(enAttente)
            hideElement(enAttenteLabel)
        }
    }
    afficherOuCacherEnAttente()
    Array.from(form.querySelectorAll('input[name="depistage_type"]')).forEach(
        (elem) => {
            elem.addEventListener('change', afficherOuCacherEnAttente)
        }
    )

    // Le libellé du bouton change en fonction des choix.
    var button = form.querySelector('input[type=submit]')
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas passé de test'
        : 'Cette personne n’a pas passé de test'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'

    const updateSubmitButtonLabel = toggleFormButtonOnTextFieldsAndRadioRequired(
        form,
        button.value,
        uncheckedLabel,
        requiredLabel
    )

    addDatePickerPolyfill(datePicker, now, updateSubmitButtonLabel)

    // Soumission du formulaire.
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const form = event.target
        app.profil.depistage = form.elements['depistage'].checked
        if (app.profil.depistage) {
            app.profil.depistage_start_date = new Date(
                form.elements['depistage_start_date'].value
            )
            app.profil.depistage_type = getRadioValue(form, 'depistage_type')
            app.profil.depistage_resultat = getRadioValue(form, 'depistage_resultat')
        } else {
            app.profil.depistage_start_date = undefined
            app.profil.depistage_type = undefined
            app.profil.depistage_resultat = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('depistage')
        })
    })
}
