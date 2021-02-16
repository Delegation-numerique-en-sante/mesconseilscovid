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
        let titre = ''
        switch (value) {
            case 'essoufflement':
                titre = 'Manque de souffle'
                break
            case 'etatGeneral':
                titre = 'État général'
                break
            case 'etatPsychologique':
                titre = 'État psychologique'
                break
            case 'alimentationHydratation':
                titre = 'Absence d’alimentation ou d’hydratation'
                break
            case 'diarrheeVomissements':
                titre = 'Diarrhée ou vomissements'
                break
            case 'fievre':
                titre = 'Fièvre supérieure à 39°C'
                break
            case 'confusion':
                titre = 'Somnolence ou confusion'
                break
            case 'mauxDeTete':
                titre = 'Maux de tête'
                break
            case 'toux':
                titre = 'Toux'
                break
        }
        return titre
    }

    switchStatut(value) {
        let statut = ''
        switch (value) {
            case 'critique':
                statut = 'Beaucoup moins bien'
                break
            case 'pire':
                statut = 'Un peu moins bien'
                break
            case 'stable':
                statut = 'Stable'
                break
            case 'aucun':
                statut = 'Pas ce symptôme'
                break
            case 'mieux':
                statut = 'Mieux'
                break
            case '':
                statut = 'Pas de symptômes'
                break
        }
        return statut
    }

    switchBooleen(value) {
        let booleen = ''
        switch (value) {
            case 'oui':
                booleen = 'Oui'
                break
            case 'non':
                booleen = 'Non'
                break
            case '':
                booleen = 'Pas de symptômes'
                break
        }
        return booleen
    }

    switchBooleenOptionnel(value) {
        let booleen = ''
        switch (value) {
            case 'oui':
                booleen = 'Oui'
                break
            case 'non':
                booleen = 'Non'
                break
            case '':
                booleen = 'Pas d’information'
                break
        }
        return booleen
    }

    switchGravite(value) {
        let gravite = ''
        switch (value) {
            case 'gravite_3':
                gravite = 'État grave, il est recommandé d’appeler le SAMU (15)'
                break
            case 'gravite_2':
                gravite =
                    'État préoccupant, consulter un médecin ou à défaut le SAMU (15)'
                break
            case 'gravite_1':
                gravite = 'État à vérifier, consulter votre médecin traitant'
                break
            case 'gravite_0':
                gravite = 'État correct'
                break
        }
        return gravite
    }

    switchIcone(value) {
        let icone = ''
        switch (value) {
            case 'critique':
            case 'oui':
            case 'gravite_3':
                icone = 'gravite_superieure'
                break
            case 'pire':
            case 'gravite_2':
                icone = 'gravite'
                break
            case 'stable':
            case 'aucun':
            case 'gravite_1':
                icone = 'stable'
                break
            case 'mieux':
            case 'non':
            case 'gravite_0':
                icone = 'ok'
                break
            default:
                icone = 'interrogation'
                break
        }
        return icone
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
