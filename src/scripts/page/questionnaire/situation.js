import { hideSelector } from '../../affichage'
import {
    enableOrDisableSecondaryFields,
    preloadForm,
    preloadCheckboxForm,
    toggleFormButtonOnSelectFieldsRequired,
} from '../../formutils'
import geolocalisation from '../../geoloc'

export default function situation(form, app) {
    // Pré-remplir le formulaire avec le profil.
    preloadForm(form, 'departement', app.profil)
    preloadCheckboxForm(form, 'foyer_autres_personnes', app.profil)
    preloadCheckboxForm(form, 'foyer_enfants', app.profil)
    preloadCheckboxForm(form, 'activite_pro', app.profil)
    preloadCheckboxForm(form, 'activite_pro_sante', app.profil)

    // Activer ou pas le bouton de validation.
    const button = form.querySelector('input[type=submit]')
    const requiredLabel = app.profil.estMonProfil()
        ? 'Votre département de résidence est requis'
        : 'Son département de résidence est requis'
    toggleFormButtonOnSelectFieldsRequired(form, button.value, requiredLabel)

    // Essaie d’éviter la confusion liée au sélecteur natif sur iOS pour le
    // choix manuel du département.
    //
    // Le problème : la valeur affichée dans le champ ne change que lorsque
    // l’utilisateur clique sur OK, ce qui peut donner l’impression que le sélecteur
    // ne fonctionne pas.
    //
    // La solution :
    // - on efface la valeur du champ lorsque l’élément gagne le focus, de manière
    //   à afficher le choix par défaut (« Choisir dans la liste... ») pendant
    //   la sélection avec le contrôle natif ;
    // - une fois la sélection effectuée, on utilise blur() pour retirer le focus
    //   de l’élément afin que l’événement précédent soit bien déclenché si
    //   l’utilisateur touche à nouveau le sélecteur.
    //
    const selectElement = form.elements['departement']
    selectElement.addEventListener('focus', function (event) {
        event.target.value = ''
    })
    selectElement.addEventListener('change', function (event) {
        event.target.blur()
    })

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

    // Bouton de géolocalisation.
    document
        .getElementById('geolocalisation')
        .addEventListener('click', geolocalisation)

    // Message d’erreur en cas de géolocalisation impossible.
    hideSelector(form, '#error-geolocalisation')
    form.querySelector('select').addEventListener('change', function () {
        hideSelector(form, '#error-geolocalisation')
    })

    // Soumission du formulaire.
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        app.profil.departement = event.target.elements['departement'].value
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
