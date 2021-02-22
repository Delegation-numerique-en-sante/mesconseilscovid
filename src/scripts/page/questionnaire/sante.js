import {
    enableOrDisableSecondaryFields,
    preloadForm,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsRequired,
} from '../../formutils'
import AlgorithmeOrientation from '../../algorithme/orientation'

export default function sante(form, app) {
    const button = form.querySelector('input[type=submit]')
    preloadForm(form, 'age', app.profil)
    preloadForm(form, 'taille', app.profil)
    preloadForm(form, 'poids', app.profil)
    preloadCheckboxForm(form, 'grossesse_3e_trimestre', app.profil)
    const algoOrientation = new AlgorithmeOrientation(app.profil)
    form['antecedent_chronique'].checked = algoOrientation.antecedents
    preloadCheckboxForm(form, 'antecedent_cardio', app.profil)
    preloadCheckboxForm(form, 'antecedent_diabete', app.profil)
    preloadCheckboxForm(form, 'antecedent_respi', app.profil)
    preloadCheckboxForm(form, 'antecedent_dialyse', app.profil)
    preloadCheckboxForm(form, 'antecedent_greffe', app.profil)
    preloadCheckboxForm(form, 'antecedent_cancer', app.profil)
    preloadCheckboxForm(form, 'antecedent_immunodep', app.profil)
    preloadCheckboxForm(form, 'antecedent_cirrhose', app.profil)
    preloadCheckboxForm(form, 'antecedent_drepano', app.profil)
    preloadCheckboxForm(form, 'antecedent_trisomie', app.profil)
    preloadCheckboxForm(form, 'antecedent_chronique_autre', app.profil)
    const primary = form.elements['antecedent_chronique']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', () =>
        enableOrDisableSecondaryFields(form, primary)
    )
    const requiredLabel = 'Les informations d’âge, de poids et de taille sont requises'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.age = parseEntier(event.target.elements['age'])
        app.profil.poids = parseEntier(event.target.elements['poids'])
        app.profil.taille = parseTaille(event.target.elements['taille'])
        app.profil.grossesse_3e_trimestre =
            event.target.elements['grossesse_3e_trimestre'].checked
        app.profil.antecedent_cardio =
            event.target.elements['antecedent_cardio'].checked
        app.profil.antecedent_diabete =
            event.target.elements['antecedent_diabete'].checked
        app.profil.antecedent_respi = event.target.elements['antecedent_respi'].checked
        app.profil.antecedent_dialyse =
            event.target.elements['antecedent_dialyse'].checked
        app.profil.antecedent_greffe =
            event.target.elements['antecedent_greffe'].checked
        app.profil.antecedent_cancer =
            event.target.elements['antecedent_cancer'].checked
        app.profil.antecedent_immunodep =
            event.target.elements['antecedent_immunodep'].checked
        app.profil.antecedent_cirrhose =
            event.target.elements['antecedent_cirrhose'].checked
        app.profil.antecedent_drepano =
            event.target.elements['antecedent_drepano'].checked
        app.profil.antecedent_trisomie =
            event.target.elements['antecedent_trisomie'].checked
        app.profil.antecedent_chronique_autre =
            event.target.elements['antecedent_chronique_autre'].checked
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('sante')
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
