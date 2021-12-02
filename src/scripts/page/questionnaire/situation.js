import { enableOrDisableSecondaryFields, preloadCheckboxForm } from '../../formutils'

export default function situation(page, app) {
    const form = page.querySelector('form')

    // Pré-remplir le formulaire avec le profil.
    preloadCheckboxForm(form, 'foyer_autres_personnes', app.profil)
    preloadCheckboxForm(form, 'foyer_enfants', app.profil)
    preloadCheckboxForm(form, 'activite_pro', app.profil)
    preloadCheckboxForm(form, 'activite_pro_sante', app.profil)

    // Montrer les questions secondaires en cas de foyer autres personnes.
    const primary_foyer = form.elements['foyer_autres_personnes']
    const secondaries_foyer = form.querySelectorAll(`#${primary_foyer.id} ~ .secondary`)
    enableOrDisableSecondaryFields(form, primary_foyer, secondaries_foyer)
    primary_foyer.addEventListener('click', () =>
        enableOrDisableSecondaryFields(form, primary_foyer, secondaries_foyer)
    )

    // Montrer les questions secondaires en cas d’activité pro.
    const primary_activite_pro = form.elements['activite_pro']
    const secondaries_activite_pro = form.querySelectorAll(
        `#${primary_activite_pro.id} ~ .secondary`
    )
    enableOrDisableSecondaryFields(form, primary_activite_pro, secondaries_activite_pro)
    primary_activite_pro.addEventListener('click', () =>
        enableOrDisableSecondaryFields(
            form,
            primary_activite_pro,
            secondaries_activite_pro
        )
    )

    // Soumission du formulaire.
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.foyer_autres_personnes =
            event.target.elements['foyer_autres_personnes'].checked
        app.profil.foyer_enfants = event.target.elements['foyer_enfants'].checked
        app.profil.activite_pro = event.target.elements['activite_pro'].checked
        app.profil.activite_pro_sante =
            event.target.elements['activite_pro_sante'].checked
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('situation')
        })
    })
}
