import {
    enableOrDisableSecondaryFields,
    preloadCheckboxForm,
    toggleFormButtonOnCheck,
} from '../../formutils.js'

import { beforeCaracteristiques } from './caracteristiques.js'

export function beforeActivitePro(profil) {
    const target = beforeCaracteristiques(profil)
    if (target) return target
    if (profil.age < 15) return 'pediatrie'
    if (!profil.isCaracteristiquesComplete()) return 'caracteristiques'
}

export function activitepro(form, app) {
    var button = form.querySelector('input[type=submit]')
    preloadCheckboxForm(form, 'activite_pro', app.profil)
    preloadCheckboxForm(form, 'activite_pro_public', app.profil)
    preloadCheckboxForm(form, 'activite_pro_sante', app.profil)
    preloadCheckboxForm(form, 'activite_pro_liberal', app.profil)
    var primary = form.elements['activite_pro']
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', function () {
        enableOrDisableSecondaryFields(form, primary)
    })
    const uncheckedLabel = app.profil.estMonProfil()
        ? 'Je n’ai pas d’activité professionnelle ou bénévole'
        : 'Cette personne n’a pas d’activité professionnelle ou bénévole'
    toggleFormButtonOnCheck(form, button.value, uncheckedLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.activite_pro = event.target.elements['activite_pro'].checked
        app.profil.activite_pro_public =
            event.target.elements['activite_pro_public'].checked
        app.profil.activite_pro_sante =
            event.target.elements['activite_pro_sante'].checked
        app.profil.activite_pro_liberal =
            event.target.elements['activite_pro_liberal'].checked
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('activitepro')
        })
    })
}
