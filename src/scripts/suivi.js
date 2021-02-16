import { format } from 'timeago.js'
import { createElementFromHTML, safeHtml } from './affichage.js'

import AlgorithmeSuivi from './algorithme/suivi.js'

export default class SuiviView {
    constructor(profil) {
        this.profil = profil
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
                >Voir ${possessifPluriel} conseils</a>
        `
        let deleteLink = ''
        if (this.profil.hasSuiviStartDate()) {
            deleteLink = safeHtml`
                <a data-delete-suivi="${this.profil.nom}" href=""
                    >Supprimer ${possessifMasculinSingulier} suivi</a>
            `
        }
        return suiviButton + conseilsButton + deleteLink
    }

    renderDernierSuivi() {
        const dernierEtat = this.profil.dernierEtat()
        if (dernierEtat) {
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
            ${this.profil.symptomes_start_date.toLocaleString()}
            (<a href="#symptomes">modifier</a>)
        </p>`
    }

    renderDebutSuivi() {
        return `<p>Début du suivi : ${this.profil.suivi_start_date.toLocaleString()}</p>`
    }

    suiviParSymptome(symptome) {
        return this.profil.suivi.map((etat) => {
            return { date: etat.date, statut: etat[symptome] }
        })
    }

    switchSymptomeTitre(value) {
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

    switchStatut(value) {
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

    switchBooleen(value) {
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

    switchBooleenOptionnel(value) {
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

    switchGravite(value) {
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

    switchIcone(value) {
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

    renderIcone(statut) {
        const imgSrc = `../suivi_${this.switchIcone(statut)}.svg`
        return `<img src="${imgSrc}" width="40px" height="40px" />`
    }

    renderSymptomeStatutTableCell(etat) {
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchStatut(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeStatutTable(data) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data.map((etat) => this.renderSymptomeStatutTableCell(etat)).join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeStatut(symptome, data) {
        const title = `<h3>${this.switchSymptomeTitre(symptome)}</h3>`
        return `${title}
            ${this.renderSymptomeStatutTable(data)}
        `
    }

    renderSymptomeBooleenTableCell(etat) {
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchBooleen(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeBooleenTable(data) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data.map((etat) => this.renderSymptomeBooleenTableCell(etat)).join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeBooleen(symptome, data) {
        const title = `<h3>${this.switchSymptomeTitre(symptome)}</h3>`
        return `${title}
            ${this.renderSymptomeBooleenTable(data)}
        `
    }

    renderSymptomeBooleenOptionnelTableCell(etat) {
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(etat.statut)}</td>
            <td>${this.switchBooleenOptionnel(etat.statut)}</td>
        </tr>`
    }

    renderSymptomeBooleenOptionnelTable(data) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data
                .map((etat) => this.renderSymptomeBooleenOptionnelTableCell(etat))
                .join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderSymptomeBooleenOptionnel(symptome, data) {
        const title = `<h3>${this.switchSymptomeTitre(symptome)}</h3>`
        return `${title}
            ${this.renderSymptomeBooleenOptionnelTable(data)}
        `
    }

    renderGraviteTableCell(etat, algoSuivi) {
        const gravite = `gravite_${algoSuivi.calculGravite(etat)}`
        return `<tr>
            <td>${new Date(etat.date).toLocaleString()}</td>
            <td>${this.renderIcone(gravite)}</td>
            <td>${this.switchGravite(gravite)}</td>
        </tr>`
    }

    renderGraviteTable(data, algoSuivi) {
        const header = `<thead><tr><td>Date</td><td colspan="2">Statut</td></tr></thead>`
        const body = `<tbody>
            ${data
                .map((etat) => this.renderGraviteTableCell(etat, algoSuivi))
                .join('\n')}
        </tbody>`
        return `<table>
            ${header}
            ${body}
        </table>`
    }

    renderGravite() {
        const algoSuivi = new AlgorithmeSuivi(this.profil)
        return `<h3>Bilan de votre situation</h3>
            ${this.renderGraviteTable(this.profil.suivi, algoSuivi)}
        `
    }

    renderHistorique() {
        const symptomesStatuts = ['essoufflement', 'etatGeneral', 'etatPsychologique']
        const symptomesBooleens = [
            'alimentationHydratation',
            'diarrheeVomissements',
            'fievre',
        ]
        if (!this.profil.estMonProfil()) {
            symptomesBooleens.push('confusion')
        }
        const symptomesBooleensOptionnels = ['mauxDeTete', 'toux']
        return createElementFromHTML(`
            <div>
                ${this.renderDebutSymptomes()}
                ${this.renderDebutSuivi()}
                ${this.renderGravite()}
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
