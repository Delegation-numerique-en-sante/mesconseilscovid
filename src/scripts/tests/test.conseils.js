import { assert } from 'chai'
import { JSDOM } from 'jsdom'

import { cacherElementsConditionnels } from '../page/conseils'
import Profil from '../profil'

describe('Conseils personnels', function () {
    it('Je n’ai pas d’activité pro', function () {
        let dom = new JSDOM(`<!DOCTYPE html>
            <section id="conseils">
                <div id="conseils-personnels" class="conseils">
                    <ol>
                        <li id="isolement">Rester isolé</li>
                        <li id="arret-de-travail" class="seulement-si-activite-pro">Obtenir un arrêt de travail</li>
                    </ol>
                </div>
            </section>
        `)
        let element = dom.window.document.querySelector('#conseils')
        let profil = new Profil('mes_infos', {
            activite_pro: false,
        })
        cacherElementsConditionnels(element, profil)
        assert.isTrue(element.querySelector('#arret-de-travail').hidden)
    })

    it('J’ai une activité pro', function () {
        let dom = new JSDOM(`<!DOCTYPE html>
            <section id="conseils">
                <div id="conseils-personnels" class="conseils">
                    <ol>
                        <li id="isolement">Rester isolé</li>
                        <li id="arret-de-travail" class="seulement-si-activite-pro">Obtenir un arrêt de travail</li>
                    </ol>
                </div>
            </section>
        `)
        let element = dom.window.document.querySelector('#conseils')
        let profil = new Profil('mes_infos', {
            activite_pro: true,
        })
        cacherElementsConditionnels(element, profil)
        assert.isFalse(element.querySelector('#arret-de-travail').hidden)
    })

    it('Je vis seul', function () {
        let dom = new JSDOM(`<!DOCTYPE html>
            <section id="conseils">
                <div id="conseils-personnels" class="conseils">
                    <ol>
                        <li id="isolement">Rester isolé</li>
                        <li id="foyer" class="seulement-si-foyer">Manger tout seul</li>
                    </ol>
                </div>
            </section>
        `)
        let element = dom.window.document.querySelector('#conseils')
        let profil = new Profil('mes_infos', {
            foyer_autres_personnes: false,
        })
        cacherElementsConditionnels(element, profil)
        assert.isTrue(element.querySelector('#foyer').hidden)
    })

    it('Je partage mon foyer avec d’autres personnes', function () {
        let dom = new JSDOM(`<!DOCTYPE html>
            <section id="conseils">
                <div id="conseils-personnels" class="conseils">
                    <ol>
                        <li id="isolement">Rester isolé</li>
                        <li id="foyer" class="seulement-si-foyer">Manger tout seul</li>
                    </ol>
                </div>
            </section>
        `)
        let element = dom.window.document.querySelector('#conseils')
        let profil = new Profil('mes_infos', {
            foyer_autres_personnes: true,
        })
        cacherElementsConditionnels(element, profil)
        assert.isFalse(element.querySelector('#foyer').hidden)
    })
})
