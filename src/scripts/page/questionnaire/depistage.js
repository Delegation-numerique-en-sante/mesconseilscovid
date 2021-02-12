import { hideElement, showElement } from '../../affichage.js'
import { addDatePickerPolyfill } from '../../datepicker'
import {
    enableOrDisableSecondaryFields,
    getRadioValue,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsAndRadioRequired,
} from '../../formutils.js'

export default function depistage(form, app) {
    const datePicker = form.querySelector('#depistage_start_date')
    // Autorise seulement une date passée.
    const now = new Date()
    datePicker.setAttribute('max', now.toISOString().substring(0, 10))
    addDatePickerPolyfill(datePicker, now)

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
        }

        if (app.profil.depistage_resultat === 'positif') {
            form.querySelector('#depistage_resultat_positif').checked = true
        } else if (app.profil.depistage_resultat === 'negatif') {
            form.querySelector('#depistage_resultat_negatif').checked = true
        } else if (app.profil.depistage_resultat === 'en_attente') {
            form.querySelector('#depistage_resultat_en_attente').checked = true
        }

        const varianteRadio = form.querySelector('#depistage-variante')
        if (
            app.profil.depistage_type === 'rt-pcr' &&
            app.profil.depistage_resultat === 'positif'
        ) {
            showVariante(varianteRadio)
            if (app.profil.depistage_variante === '20I/501Y.V1') {
                form.querySelector('#depistage_variante_v1').checked = true
            } else if (app.profil.depistage_variante === '20H/501Y.V2_ou_20J/501Y.V3') {
                form.querySelector('#depistage_variante_v2_ou_v3').checked = true
            } else {
                form.querySelector('#depistage_variante_autre').checked = true
            }
        } else {
            hideVariante(varianteRadio)
        }
    }

    // La première case active ou désactive les autres.
    var primary = form.elements['depistage']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })

    // Le libellé du bouton change en fonction des choix.
    var button = form.querySelector('input[type=submit]')
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas passé de test'
        : 'Cette personne n’a pas passé de test'
    const requiredLabel = 'Veuillez remplir le formulaire au complet'
    const updateSubmitButton = toggleFormButtonOnTextFieldsAndRadioRequired(
        form,
        button.value,
        uncheckedLabel,
        requiredLabel
    )

    // La variante n’est demandée que si le test est RT-PCR et positif
    // eslint-disable-next-line no-extra-semi
    ;[].forEach.call(
        form.querySelectorAll(
            'input[name="depistage_type"],input[name="depistage_resultat"]'
        ),
        (elem) => {
            elem.addEventListener('change', function () {
                const type = getRadioValue(form, 'depistage_type')
                const resultat = getRadioValue(form, 'depistage_resultat')
                const varianteRadio = form.querySelector('#depistage-variante')
                if (type === 'rt-pcr' && resultat === 'positif') {
                    showVariante(varianteRadio)
                } else {
                    hideVariante(varianteRadio)
                }
                updateSubmitButton()
            })
        }
    )

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
            if (
                app.profil.depistage_type === 'rt-pcr' &&
                app.profil.depistage_resultat === 'positif'
            ) {
                app.profil.depistage_variante = getRadioValue(
                    form,
                    'depistage_variante'
                )
            } else {
                app.profil.depistage_variante = undefined
            }
        } else {
            app.profil.depistage_start_date = undefined
            app.profil.depistage_type = undefined
            app.profil.depistage_resultat = undefined
            app.profil.depistage_variante = undefined
        }

        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('depistage')
        })
    })
}

function showVariante(varianteRadio) {
    showElement(varianteRadio)
    varianteRadio.classList.add('required')
    Array.from(varianteRadio.querySelectorAll('input[type=radio')).forEach((elem) => {
        elem.required = true
    })
}

function hideVariante(varianteRadio) {
    hideElement(varianteRadio)
    varianteRadio.classList.remove('required')
    Array.from(varianteRadio.querySelectorAll('input[type=radio')).forEach((elem) => {
        elem.required = false
    })
}
