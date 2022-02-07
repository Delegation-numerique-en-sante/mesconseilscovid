import { format } from 'timeago.js'

import type Profil from './profil'
import type {Etat} from './profil'
import { createElementFromHTML, safeHtml } from './affichage'
import AlgorithmeSuivi from './algorithme/suivi'
import { titleCase } from './utils'

type SuiviImages = {
    gravite: string
    gravite_superieure: string
    interrogation: string
    ok: string
    stable: string
}

type Symptomes =
    | 'symptomes'
    | 'essoufflement'
    | 'etatGeneral'
    | 'etatPsychologique'
    | 'alimentationHydratation'
    | 'fievre'
    | 'diarrheeVomissements'
    | 'mauxDeTete'
    | 'toux'
    | 'confusion'

export default class SuiviView {
    profil: Profil
    suiviImages: SuiviImages

    constructor(profil: Profil, suiviImages: SuiviImages) {
        this.profil = profil
        this.suiviImages = suiviImages
    }

    renderButtonSuivi() {
        const possessifMasculinSingulier = this.profil.estMonProfil() ? 'mon' : 'son'
        const possessifPluriel = this.profil.estMonProfil() ? 'mes' : 'ses'
        const label =
            this.profil.hasSuiviStartDate() && this.profil.hasHistorique()
                ? 'Continuer'
                : 'Démarrer'
        const nextPage = this.profil.hasSymptomesStartDate()
            ? 'suivisymptomes'
            : 'symptomes'
        const suiviButton = safeHtml`
            <a class="button button-full-width conseils-link"
                data-set-profil="${this.profil.nom}" href="#${nextPage}"
                >${label} ${possessifMasculinSingulier} suivi</a>
        `
        const conseilsButton = safeHtml`
            <a class="button button-outline button-full-width conseils-link"
                data-set-profil="${this.profil.nom}" href="#conseils"
                >Retrouver ${possessifPluriel} conseils</a>
        `
        let deleteLink = ''
        if (this.profil.hasSuiviStartDate()) {
            deleteLink = safeHtml`
                <a data-delete-suivi="${this.profil.nom}" href="" role="button"
                    >Supprimer ${possessifMasculinSingulier} suivi</a>
            `
        }
        return suiviButton + conseilsButton + deleteLink
    }

    renderDernierSuivi() {
        const dernierEtat = this.profil.dernierEtat()
        if (dernierEtat && Object.keys(dernierEtat).length !== 0) {
            const relativeDate = format(new Date(dernierEtat.date), 'fr')
            return `<small>Dernière réponse : ${relativeDate}</small>`
        }
        return ''
    }

    renderCardSuivi() {
        return createElementFromHTML(`
        <li class="card">
            ${this.profil.renderNom()}
            ${this.renderDernierSuivi()}
            <div>${this.renderButtonSuivi()}</div>
        </li>
        `)
    }

    renderDebutSymptomes() {
        return `<p>Début des symptômes :
            ${this.renderDate(this.profil.symptomes_start_date)}
            (<a href="#symptomes">modifier</a>)
        </p>`
    }

    renderDebutSuivi() {
        return `<p>Début du suivi : ${this.renderDate(
            this.profil.suivi_start_date
        )}</p>`
    }

    suiviParSymptome(
        symptome: Symptomes
    ): { date: string; statut: string }[] {
        return this.profil.suivi.map((etat) => {
            // TS: potentiellement on veut pouvoir garder une valeur
            // booléenne ici.
            return { date: etat.date, statut: String(etat[symptome]) }
        })
    }

    switchSymptomeTitre(value: Symptomes) {
        switch (value) {
            case 'essoufflement':
                return 'Manque de souffle'
            case 'etatGeneral':
                return 'État général'
            case 'etatPsychologique':
                return 'État psychologique'
            case 'alimentationHydratation':
                return 'Absence d’alimentation ou d’hydratation'
            case 'diarrheeVomissements':
                return 'Diarrhée ou vomissements'
            case 'fievre':
                return 'Fièvre supérieure à 39°C'
            case 'confusion':
                return 'Somnolence ou confusion'
            case 'mauxDeTete':
                return 'Maux de tête'
            case 'toux':
                return 'Toux'
            default:
                return ''
        }
    }

    switchStatut(value: string) {
        switch (value) {
            case 'critique':
                return 'Beaucoup moins bien'
            case 'pire':
                return 'Un peu moins bien'
            case 'stable':
                return 'Stable'
            case 'aucun':
                return 'Pas ce symptôme'
            case 'mieux':
                return 'Mieux'
            case '':
                return 'Pas de symptômes'
            default:
                return ''
        }
    }

    switchBooleen(value: string) {
        switch (value) {
            case 'oui':
                return 'Oui'
            case 'non':
                return 'Non'
            case '':
                return 'Pas de symptômes'
            default:
                return ''
        }
    }

    switchBooleenOptionnel(value: string) {
        switch (value) {
            case 'oui':
                return 'Oui'
            case 'non':
                return 'Non'
            case '':
                return 'Pas d’information'
            default:
                return ''
        }
    }

    switchGravite(value: string) {
        switch (value) {
            case 'gravite_3':
                return 'État grave, il est recommandé d’appeler le SAMU (15)'
            case 'gravite_2':
                return 'État préoccupant, consulter un médecin ou à défaut le SAMU (15)'
            case 'gravite_1':
                return 'État à vérifier, consulter votre médecin traitant'
            case 'gravite_0':
                return 'État correct'
            default:
                return ''
        }
    }

    switchIcone(value: string) {
        switch (value) {
            case 'critique':
            case 'oui':
            case 'gravite_3':
                return 'gravite_superieure'
            case 'pire':
            case 'gravite_2':
                return 'gravite'
            case 'stable':
            case 'aucun':
            case 'gravite_1':
                return 'stable'
            case 'mieux':
            case 'non':
            case 'gravite_0':
                return 'ok'
            default:
                return 'interrogation'
        }
    }

    renderDate(date: string) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' }
        return titleCase(new Date(date).toLocaleString('fr-FR', options))
    }

    renderIcone(statut: string) {
        const icone = this.switchIcone(statut)
        const imgSrc = this.suiviImages[icone]
        return `<img src="${imgSrc}" width="40px" height="40px"
                     alt="${titleCase(icone)}" title="${titleCase(icone)}" />`
    }

    renderSymptomeStatutTableCell(etat: { date: string; statut: string }) {
        return `<tr>
            <td>${this.renderDate(etat.date)}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchStatut(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeStatut(
        symptome: Symptomes,
        data: { date: string; statut: string }[]
    ) {
        const caption = `<caption><h3>${this.switchSymptomeTitre(
            symptome
        )}</h3></caption>`
        const header = `<thead>
            <tr>
                <th scope="col">Date</th>
                <th scope="col">Statut</th>
                <th scope="col">Réponse</th>
            </tr>
        </thead>`
        const body = `<tbody>
            ${data.map((etat) => this.renderSymptomeStatutTableCell(etat)).join('\n')}
        </tbody>`
        return `<table>
            ${caption}
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeBooleenTableCell(etat: { date: string; statut: string }) {
        return `<tr>
            <td>${this.renderDate(etat.date)}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchBooleen(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeBooleen(
        symptome: Symptomes,
        data: { date: string; statut: string }[]
    ) {
        const caption = `<caption><h3>${this.switchSymptomeTitre(
            symptome
        )}</h3></caption>`
        const header = `<thead>
            <tr>
                <th scope="col">Date</th>
                <th scope="col">Statut</th>
                <th scope="col">Réponse</th>
            </tr>
        </thead>`
        const body = `<tbody>
            ${data.map((etat) => this.renderSymptomeBooleenTableCell(etat)).join('\n')}
        </tbody>`
        return `<table>
            ${caption}
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeBooleenOptionnelTableCell(etat: { date: string; statut: string }) {
        return `<tr>
            <td>${this.renderDate(etat.date)}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchBooleenOptionnel(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeBooleenOptionnel(
        symptome: Symptomes,
        data: { date: string; statut: string }[]
    ) {
        const caption = `<caption><h3>${this.switchSymptomeTitre(
            symptome
        )}</h3></caption>`
        const header = `<thead>
            <tr>
                <th scope="col">Date</th>
                <th scope="col">Statut</th>
                <th scope="col">Réponse</th>
            </tr>
        </thead>`
        const body = `<tbody>
            ${data
                .map((etat) => this.renderSymptomeBooleenOptionnelTableCell(etat))
                .join('\n')}
        </tbody>`
        return `<table>
            ${caption}
            ${header}
            ${body}
        </table>`
    }

    // TS: celle-ci est intrigante, etat est considéré comme étant un Profil.
    renderGraviteTableCell(etat: Etat, algoSuivi: AlgorithmeSuivi) {
        const gravite = `gravite_${algoSuivi.calculGravite(etat)}`
        return `<tr>
            <td>${this.renderDate(etat.date)}</td>
            <td>${this.renderIcone(gravite)}</td>
            <td>${this.switchGravite(gravite)}</td>
        </tr>`
    }

    renderGravite() {
        const algoSuivi = new AlgorithmeSuivi(this.profil)
        const caption = `<caption><h2>Bilan de votre situation</h2></caption>`
        const header = `<thead>
            <tr>
                <th scope="col">Date</th>
                <th scope="col" colspan="2">Statut</th>
            </tr>
        </thead>`
        const body = `<tbody>
            ${this.profil.suivi
                .map((etat) => this.renderGraviteTableCell(etat, algoSuivi))
                .join('\n')}
        </tbody>`
        return `<table>
            ${caption}
            ${header}
            ${body}
        </table>`
    }

    renderHistorique() {
        const symptomesStatuts: (
            | 'essoufflement'
            | 'etatGeneral'
            | 'etatPsychologique'
        )[] = ['essoufflement', 'etatGeneral', 'etatPsychologique']
        const symptomesBooleens: (
            | 'alimentationHydratation'
            | 'diarrheeVomissements'
            | 'fievre'
            | 'confusion'
        )[] = ['alimentationHydratation', 'diarrheeVomissements', 'fievre']
        if (!this.profil.estMonProfil()) {
            symptomesBooleens.push('confusion')
        }
        const symptomesBooleensOptionnels: ('mauxDeTete' | 'toux')[] = [
            'mauxDeTete',
            'toux',
        ]
        return createElementFromHTML(`
            <div>
                ${this.renderDebutSymptomes()}
                ${this.renderDebutSuivi()}
                ${this.renderGravite()}
                <h2>Détail de vos symptômes</h2>
                ${symptomesStatuts
                    .map((symptome) =>
                        this.renderSymptomeStatut(
                            symptome,
                            this.suiviParSymptome(symptome)
                        )
                    )
                    .join('\n')}
                ${symptomesBooleens
                    .map((symptome) =>
                        this.renderSymptomeBooleen(
                            symptome,
                            this.suiviParSymptome(symptome)
                        )
                    )
                    .join('\n')}
                ${symptomesBooleensOptionnels
                    .map((symptome) =>
                        this.renderSymptomeBooleenOptionnel(
                            symptome,
                            this.suiviParSymptome(symptome)
                        )
                    )
                    .join('\n')}
            </div>
        `)
    }
}
