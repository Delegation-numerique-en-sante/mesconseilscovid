require('./polyfills/custom_event.js')

var Updater = require('./updater.js')

var StockageLocal = require('./stockage.js')
var stockageLocal = new StockageLocal()
window.stockageLocal = stockageLocal

var Profil = require('./profil.js')
var profil = new Profil()
window.profil = profil

window.resetPrivateData = function (event) {
    event.preventDefault()
    profil.resetData()
    stockageLocal.supprimer()
    router.navigate('introduction')
}

window.updater = new Updater()

var OnSubmitFormScripts = function () {
    this.residence = function (event) {
        event.preventDefault()
        profil.departement = event.target.elements['departement'].value
        stockageLocal.enregistrer(profil)
        router.navigate('activitepro')
    }

    this.activitepro = function (event) {
        event.preventDefault()
        profil.activite_pro = event.target.elements['activite_pro'].checked
        profil.activite_pro_public =
            event.target.elements['activite_pro_public'].checked
        profil.activite_pro_sante = event.target.elements['activite_pro_sante'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('foyer')
    }

    this.foyer = function (event) {
        event.preventDefault()
        profil.foyer_enfants = event.target.elements['foyer_enfants'].checked
        profil.foyer_fragile = event.target.elements['foyer_fragile'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('caracteristiques')
    }

    this.caracteristiques = function (event) {
        event.preventDefault()
        profil.sup65 = event.target.elements['sup65'].checked
        profil.grossesse_3e_trimestre =
            event.target.elements['grossesse_3e_trimestre'].checked
        profil.poids = event.target.elements['poids'].value
        profil.taille = event.target.elements['taille'].value
        stockageLocal.enregistrer(profil)
        router.navigate('antecedents')
    }

    this.antecedents = function (event) {
        event.preventDefault()
        profil.antecedent_cardio = event.target.elements['antecedent_cardio'].checked
        profil.antecedent_diabete = event.target.elements['antecedent_diabete'].checked
        profil.antecedent_respi = event.target.elements['antecedent_respi'].checked
        profil.antecedent_dialyse = event.target.elements['antecedent_dialyse'].checked
        profil.antecedent_cancer = event.target.elements['antecedent_cancer'].checked
        profil.antecedent_immunodep =
            event.target.elements['antecedent_immunodep'].checked
        profil.antecedent_cirrhose =
            event.target.elements['antecedent_cirrhose'].checked
        profil.antecedent_drepano = event.target.elements['antecedent_drepano'].checked
        profil.antecedent_chronique_autre =
            event.target.elements['antecedent_chronique_autre'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('symptomesactuels')
    }

    this.symptomesactuels = function (event) {
        event.preventDefault()
        profil.symptomes_actuels = event.target.elements['symptomes_actuels'].checked
        if (profil.symptomes_actuels) {
            // On complète manuellement le formulaire pour le rendre complet.
            profil.symptomes_passes = false
            profil.contact_a_risque = false
            profil.contact_a_risque_meme_lieu_de_vie = undefined
            profil.contact_a_risque_contact_direct = undefined
            profil.contact_a_risque_actes = undefined
            profil.contact_a_risque_espace_confine = undefined
            profil.contact_a_risque_meme_classe = undefined
            profil.contact_a_risque_autre = undefined
            stockageLocal.enregistrer(profil)
            router.navigate('conseils')
        } else {
            stockageLocal.enregistrer(profil)
            router.navigate('symptomespasses')
        }
    }

    this.symptomespasses = function (event) {
        event.preventDefault()
        profil.symptomes_passes = event.target.elements['symptomes_passes'].checked
        if (profil.symptomes_passes) {
            // On complète manuellement le formulaire pour le rendre complet.
            profil.contact_a_risque = false
            profil.contact_a_risque_meme_lieu_de_vie = undefined
            profil.contact_a_risque_contact_direct = undefined
            profil.contact_a_risque_actes = undefined
            profil.contact_a_risque_espace_confine = undefined
            profil.contact_a_risque_meme_classe = undefined
            profil.contact_a_risque_autre = undefined
            stockageLocal.enregistrer(profil)
            router.navigate('conseils')
        } else {
            stockageLocal.enregistrer(profil)
            router.navigate('contactarisque')
        }
    }

    this.contactarisque = function (event) {
        event.preventDefault()
        profil.contact_a_risque = event.target.elements['contact_a_risque'].checked
        profil.contact_a_risque_meme_lieu_de_vie =
            event.target.elements['contact_a_risque_meme_lieu_de_vie'].checked
        profil.contact_a_risque_contact_direct =
            event.target.elements['contact_a_risque_contact_direct'].checked
        profil.contact_a_risque_actes =
            event.target.elements['contact_a_risque_actes'].checked
        profil.contact_a_risque_espace_confine =
            event.target.elements['contact_a_risque_espace_confine'].checked
        profil.contact_a_risque_meme_classe =
            event.target.elements['contact_a_risque_meme_classe'].checked
        profil.contact_a_risque_autre =
            event.target.elements['contact_a_risque_autre'].checked
        stockageLocal.enregistrer(profil)
        router.navigate('conseils')
    }
}

window.onSubmitFormScripts = new OnSubmitFormScripts()

var Router = require('./router.js')
window.router = Router.initRouter()
;(function () {
    document.addEventListener('dataLoaded', function () {
        router.resolve()
        updater.checkForUpdatesEvery(10) // Minutes.
    })
    stockageLocal.charger(profil)
    document.getElementById('delete-data').addEventListener('click', resetPrivateData)
})()
