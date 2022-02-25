import type App from '../../app'
import { enableOrDisableSecondaryFields, preloadCheckboxForm } from '../../formutils'
import type { ProfilDataSituation } from '../../profil'

export default function situation(page: HTMLElement, app: App) {
    const form = page.querySelector('form')!

    // Pré-remplir le formulaire avec le profil.
    preloadCheckboxForm(form, 'foyer_autres_personnes', app.profil)
    preloadCheckboxForm(form, 'foyer_enfants', app.profil)
    preloadCheckboxForm(form, 'activite_pro', app.profil)
    preloadCheckboxForm(form, 'activite_pro_sante', app.profil)

    // Montrer les questions secondaires en cas de foyer autres personnes.
    const primary_foyer = <HTMLInputElement>(
        form.elements.namedItem('foyer_autres_personnes')
    )
    const secondaries_foyer: HTMLInputElement[] | null = Array.from(
        form.querySelectorAll(`#${primary_foyer.id} ~ .secondary`)
    )
    enableOrDisableSecondaryFields(form, primary_foyer, secondaries_foyer)
    primary_foyer.addEventListener('click', () =>
        enableOrDisableSecondaryFields(form, primary_foyer, secondaries_foyer)
    )

    // Montrer les questions secondaires en cas d’activité pro.
    const primary_activite_pro = <HTMLInputElement>(
        form.elements.namedItem('activite_pro')
    )
    const secondaries_activite_pro: HTMLInputElement[] | null = Array.from(
        form.querySelectorAll(`#${primary_activite_pro.id} ~ .secondary`)
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
        const target = <HTMLFormElement>event.target
        const situationItems = <(keyof ProfilDataSituation)[]>[
            'foyer_enfants',
            'foyer_autres_personnes',
            'activite_pro',
            'activite_pro_sante',
        ]
        for (const item of situationItems) {
            app.profil[item] = (<HTMLInputElement>(
                target.elements.namedItem(item)
            ))!.checked
        }
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('situation')
        })
    })
}
