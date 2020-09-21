import { preloadCheckboxForm, toggleFormButtonOnCheck } from '../../formutils.js'

import { beforeFoyer } from './foyer.js'

export function beforeAntecedents(profil) {
    beforeFoyer(profil)
    if (!profil.isFoyerComplete()) return 'foyer'
}

export function antecedents(form, app, router) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'antecedent_cardio', app.profil)
    preloadCheckboxForm(form, 'antecedent_diabete', app.profil)
    preloadCheckboxForm(form, 'antecedent_respi', app.profil)
    preloadCheckboxForm(form, 'antecedent_dialyse', app.profil)
    preloadCheckboxForm(form, 'antecedent_cancer', app.profil)
    preloadCheckboxForm(form, 'antecedent_immunodep', app.profil)
    preloadCheckboxForm(form, 'antecedent_cirrhose', app.profil)
    preloadCheckboxForm(form, 'antecedent_drepano', app.profil)
    preloadCheckboxForm(form, 'antecedent_chronique_autre', app.profil)
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Aucun de ces éléments ne correspond à ma situation'
        : 'Aucun de ces éléments ne correspond à sa situation'
    toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.antecedent_cardio =
            event.target.elements['antecedent_cardio'].checked
        app.profil.antecedent_diabete =
            event.target.elements['antecedent_diabete'].checked
        app.profil.antecedent_respi = event.target.elements['antecedent_respi'].checked
        app.profil.antecedent_dialyse =
            event.target.elements['antecedent_dialyse'].checked
        app.profil.antecedent_cancer =
            event.target.elements['antecedent_cancer'].checked
        app.profil.antecedent_immunodep =
            event.target.elements['antecedent_immunodep'].checked
        app.profil.antecedent_cirrhose =
            event.target.elements['antecedent_cirrhose'].checked
        app.profil.antecedent_drepano =
            event.target.elements['antecedent_drepano'].checked
        app.profil.antecedent_chronique_autre =
            event.target.elements['antecedent_chronique_autre'].checked
        app.enregistrerProfilActuel()
        router.navigate('caracteristiques')
    })
}
