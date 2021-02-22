import { assert } from 'chai'
import { JSDOM } from 'jsdom'

import AlgorithmeOrientation from '../algorithme/orientation.js'

import * as injection from '../injection.js'

import Profil from '../profil.js'

describe('Injection', function () {
    it('Départements', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<b id="nom-departement"></b>'
        injection.departement(element.querySelector('#nom-departement'), '01')

        assert.strictEqual(element.innerHTML, '<b id="nom-departement">Ain</b>')
    })

    it('Lien préfecture', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML =
            '<a href="#conseils-departement" id="lien-prefecture">Site</a>'
        injection.lienPrefecture(element.querySelector('#lien-prefecture'), '01')

        assert.strictEqual(
            element.innerHTML,
            '<a href="http://www.ain.gouv.fr/coronavirus-covid-19-r1627.html" id="lien-prefecture">Site</a>'
        )
    })

    it('Contact CTAI téléphone + courriel', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<span id="ctai-contact-placeholder"></span>'
        injection.CTAIContact(element.querySelector('#ctai-contact-placeholder'), '03')

        assert.strictEqual(
            element.innerHTML,
            '<span id="ctai-contact-placeholder"> au <a href="tel:0470483048" style="white-space: nowrap;">04 70 48 30 48</a> ou  à l’adresse <a href="mailto:pref-ctai@allier.gouv.fr">pref-ctai@allier.gouv.fr</a></span>'
        )
    })

    it('Contact CTAI téléphone uniquement', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<span id="ctai-contact-placeholder"></span>'
        injection.CTAIContact(element.querySelector('#ctai-contact-placeholder'), '52')

        assert.strictEqual(
            element.innerHTML,
            '<span id="ctai-contact-placeholder"> au <a href="tel:0325305252" style="white-space: nowrap;">03 25 30 52 52</a></span>'
        )
    })

    it('Contact CTAI courriel uniquement', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<span id="ctai-contact-placeholder"></span>'
        injection.CTAIContact(element.querySelector('#ctai-contact-placeholder'), '01')

        assert.strictEqual(
            element.innerHTML,
            '<span id="ctai-contact-placeholder"> à l’adresse <a href="mailto:pref-covid-isolement@ain.gouv.fr">pref-covid-isolement@ain.gouv.fr</a></span>'
        )
    })

    it('Contact CTAI manquant', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML = '<span id="ctai-contact-placeholder"></span>'
        injection.CTAIContact(element.querySelector('#ctai-contact-placeholder'), '976')

        assert.strictEqual(
            element.innerHTML,
            '<span id="ctai-contact-placeholder"></span>'
        )
    })

    it('Lien vaccination', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML =
            '<a href="#conseils-departement" id="lien-vaccination">Site</a>'
        injection.lienVaccination(element.querySelector('#lien-vaccination'), '01')

        assert.strictEqual(
            element.innerHTML,
            '<a href="https://www.sante.fr/centres-vaccination-covid.html#dep-01" id="lien-vaccination">Site</a>'
        )
    })

    it('Lien vaccination Corse', function () {
        var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        var element = dom.window.document.querySelector('div')
        element.innerHTML =
            '<a href="#conseils-departement" id="lien-vaccination">Site</a>'
        injection.lienVaccination(element.querySelector('#lien-vaccination'), '2A')

        assert.strictEqual(
            element.innerHTML,
            '<a href="https://www.sante.fr/centres-vaccination-covid.html#dep-20" id="lien-vaccination">Site</a>'
        )
    })

    describe('Caractéristiques à risques', function () {
        it('âge', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'

            var profil = new Profil('mes_infos', {
                age: 65,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>'
            )
        })

        it('grossesse', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'

            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes au 3e trimestre de votre grossesse.</b>'
            )
        })

        it('âge + grossesse = âge', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'

            var profil = new Profil('mes_infos', {
                age: 65,
                grossesse_3e_trimestre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans.</b>'
            )
        })

        it('IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'
            var profil = new Profil('mes_infos', {
                taille: 150,
                poids: 150,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })

        it('âge + IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'
            var profil = new Profil('mes_infos', {
                age: 65,
                taille: 150,
                poids: 150,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes âgé·e de plus de 65&nbsp;ans et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })

        it('grossesse + IMC', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-caracteristiques-a-risques"></b>'
            var profil = new Profil('mes_infos', {
                grossesse_3e_trimestre: true,
                taille: 150,
                poids: 150,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.caracteristiquesARisques(
                element.querySelector('.nom-caracteristiques-a-risques'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-caracteristiques-a-risques">vous êtes au 3e trimestre de votre grossesse et vous avez un IMC supérieur&nbsp;à&nbsp;30&nbsp;(67).</b>'
            )
        })
    })

    describe('Antécédents', function () {
        it('cardio', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.antecedents(
                element.querySelector('.nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-antecedents">Vous avez des antécédents à risque.</b>'
            )
        })

        it('autres', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_chronique_autre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.antecedents(
                element.querySelector('.nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-antecedents">Vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>'
            )
        })

        it('cardio + autres', function () {
            var dom = new JSDOM(`<!DOCTYPE html><div></div>`)
            var element = dom.window.document.querySelector('div')
            element.innerHTML = '<b class="nom-antecedents"></b>'
            var profil = new Profil('mes_infos', {
                antecedent_cardio: true,
                antecedent_chronique_autre: true,
            })

            var algoOrientation = new AlgorithmeOrientation(profil)
            injection.antecedents(
                element.querySelector('.nom-antecedents'),
                algoOrientation
            )

            assert.strictEqual(
                element.innerHTML,
                '<b class="nom-antecedents">Vous avez des antécédents à risque et vous avez une maladie chronique, un handicap ou vous prenez un traitement au long cours.</b>'
            )
        })
    })

    it('Suivi répétition', function () {
        const dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        const element = dom.window.document.querySelector('div')
        element.innerHTML = '<span class="suivi-repetition"></span>'
        const profil = new Profil('mes_infos')
        profil.suivi = [{ date: 1 }, { date: 2 }, { date: 3 }]
        injection.suiviRepetition(element.querySelector('.suivi-repetition'), profil)

        assert.strictEqual(element.innerHTML, '<span class="suivi-repetition">3</span>')
    })

    it('Suivi dernière fois', function () {
        const dom = new JSDOM(`<!DOCTYPE html><div></div>`)
        const element = dom.window.document.querySelector('div')
        element.innerHTML = '<span class="suivi-derniere-fois"></span>'
        const profil = new Profil('mes_infos')
        profil.suivi = [{}, {}, { date: new Date() }]
        injection.suiviDerniereFois(
            element.querySelector('.suivi-derniere-fois'),
            profil
        )

        assert.strictEqual(
            element.innerHTML,
            '<span class="suivi-derniere-fois">just now</span>'
        )
    })
})
