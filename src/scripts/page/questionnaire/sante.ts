import type App from '../../app'
import {
    enableOrDisableSecondaryFields,
    preloadForm,
    preloadCheckboxForm,
    toggleFormButtonOnTextFieldsRequired,
} from '../../formutils'
import AlgorithmeOrientation from '../../algorithme/orientation'
import type { ProfilDataAntecedent } from '../../profil'

export default function sante(page: HTMLElement, app: App) {
    const form = page.querySelector('form')!
    const button = form.querySelector<HTMLInputElement>('input[type=submit]')!

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
    const primary = <HTMLInputElement>form.elements.namedItem('antecedent_chronique')
    enableOrDisableSecondaryFields(form, primary)
    primary.addEventListener('click', () =>
        enableOrDisableSecondaryFields(form, primary)
    )
    const requiredLabel = 'Les informations d’âge, de poids et de taille sont requises'
    toggleFormButtonOnTextFieldsRequired(form, button.value, requiredLabel)
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const target = <HTMLFormElement>event.target
        app.profil.age = parseEntier(<HTMLInputElement>target.elements.namedItem('age'))
        app.profil.poids = parseEntier(
            <HTMLInputElement>target.elements.namedItem('poids')
        )
        app.profil.taille = parseTaille(
            <HTMLInputElement>target.elements.namedItem('taille')
        )
        app.profil.grossesse_3e_trimestre = (<HTMLInputElement>(
            target.elements.namedItem('grossesse_3e_trimestre')
        )).checked
        const antecedentItems = <(keyof ProfilDataAntecedent)[]>[
            'antecedent_cardio',
            'antecedent_diabete',
            'antecedent_respi',
            'antecedent_dialyse',
            'antecedent_greffe',
            'antecedent_cancer',
            'antecedent_immunodep',
            'antecedent_cirrhose',
            'antecedent_drepano',
            'antecedent_trisomie',
            'antecedent_chronique_autre',
        ]
        for (const item of antecedentItems) {
            app.profil[item] = (<HTMLInputElement>(
                target.elements.namedItem(item)
            ))!.checked
        }
        app.enregistrerProfilActuel().then(() => {
            app.goToNextPage('sante')
        })
    })
}

function parseEntier(element: HTMLInputElement) {
    let taille = parseFloat(element.value.replace(',', '.'))
    return Math.round(taille)
}

function parseTaille(element: HTMLInputElement) {
    let taille = parseFloat(element.value.replace(',', '.'))
    if (taille < 3) {
        // mètres au lieu de centimètres ?
        taille *= 100
    }
    return Math.round(taille)
}
