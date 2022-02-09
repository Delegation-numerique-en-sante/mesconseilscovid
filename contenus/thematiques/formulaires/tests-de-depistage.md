<form id="{{prefixe}}-demarrage-form">
    <fieldset>
        <legend>
            <h3>Pass sanitaire, symptômes, cas contact ?</h3>
            En quelques clics, découvrez quel test de dépistage est le plus adapté à votre situation.
        </legend>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p></p>
            <input type="submit" class="button button-arrow" value=" C’est parti !   ">
        </div>
    </div>
</form>

<form id="{{prefixe}}-symptomes-form" hidden>
    <a href="javascript:;" data-precedent="demarrage" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-symptomes-label">Avez-vous des symptômes qui peuvent évoquer la Covid ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-symptomes-label">
            <input id="{{prefixe}}_symptomes_radio_oui" type="radio" required name="{{prefixe}}_symptomes_radio" value="oui">
            <label for="{{prefixe}}_symptomes_radio_oui">Oui</label>
            <input id="{{prefixe}}_symptomes_radio_non" type="radio" required name="{{prefixe}}_symptomes_radio" value="non">
            <label for="{{prefixe}}_symptomes_radio_non">Non</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-symptomes" class="progress">Il vous reste moins de 2 étapes</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-symptomes">
        </div>
    </div>
</form>

<form id="{{prefixe}}-depuis-quand-form" hidden>
    <a href="javascript:;" data-precedent="symptomes" class="back-button">Retour</a>
    <fieldset class="required" id="{{prefixe}}-depuis-quand">
        <legend><h3 id="{{prefixe}}-depuis-quand-label">Depuis quand avez-vous des symptômes ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-depuis-quand-label">
            <input id="{{prefixe}}_depuis_quand_radio_moins_4_jours" type="radio" required name="{{prefixe}}_depuis_quand_radio" value="moins-4-jours">
            <label for="{{prefixe}}_depuis_quand_radio_moins_4_jours">depuis 4 jours ou moins</label>
            <input id="{{prefixe}}_depuis_quand_radio_plus_4_jours" type="radio" required name="{{prefixe}}_depuis_quand_radio" value="plus-4-jours">
            <label for="{{prefixe}}_depuis_quand_radio_plus_4_jours">depuis 5 jours ou plus</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-depuis-quand" class="progress">C’est la dernière étape !</p>
            <input type="submit" class="button" value="Terminer" aria-describedby="aria-description-progress-{{prefixe}}-depuis-quand">
        </div>
    </div>
</form>

<form id="{{prefixe}}-cas-contact-form" hidden>
    <a href="javascript:;" data-precedent="symptomes" class="back-button">Retour</a>
    <fieldset class="required" id="{{prefixe}}-cas-contact">
        <legend><h3 id="{{prefixe}}-cas-contact-label">Êtes-vous cas contact ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-cas-contact-label">
            <input id="{{prefixe}}_cas_contact_radio_oui" type="radio" required name="{{prefixe}}_cas_contact_radio" value="oui">
            <label for="{{prefixe}}_cas_contact_radio_oui">Oui</label>
            <input id="{{prefixe}}_cas_contact_radio_non" type="radio" required name="{{prefixe}}_cas_contact_radio" value="non">
            <label for="{{prefixe}}_cas_contact_radio_non">Non</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-cas-contact" class="progress">Plus qu’une étape</p>
            <input type="submit" class="button" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-cas-contact">
        </div>
    </div>
</form>

<form id="{{prefixe}}-auto-test-form" hidden>
    <a href="javascript:;" data-precedent="cas-contact" class="back-button">Retour</a>
    <fieldset id="{{prefixe}}-auto-test">
        <legend><h3 id="{{prefixe}}-auto-test-label">Je veux faire un test pour…</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-auto-test-label">
            <input id="{{prefixe}}_auto_test_radio_oui" type="radio" required name="{{prefixe}}_auto_test_radio" value="oui">
            <label for="{{prefixe}}_auto_test_radio_oui">confirmer un autotest positif</label>
            <input id="{{prefixe}}_auto_test_radio_non" type="radio" required name="{{prefixe}}_auto_test_radio" value="non">
            <label for="{{prefixe}}_auto_test_radio_non">obtenir un « passe sanitaire » (mineurs de 12 à 15 ans), rendre visite à une personne vulnérable, etc.</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-auto-test" class="progress">C’est la dernière étape !</p>
            <input type="submit" class="button" value="Terminer" aria-describedby="aria-description-progress-{{prefixe}}-auto-test">
        </div>
    </div>
</form>

<div id="{{prefixe}}-symptomes-moins-4-jours-reponse" class="statut statut-bleu" hidden>

Vous avez des symptômes qui peuvent évoquer la Covid depuis moins de 4 jours, nous vous recommandons de faire un test **antigénique** ou **PCR nasopharyngé**. Consultez notre page thématique [« J’ai des symptômes de la Covid, que faire ? »](j-ai-des-symptomes-covid.html).

</div>

<div id="{{prefixe}}-symptomes-plus-4-jours-reponse" class="statut statut-bleu" hidden>

Vous avez des symptômes qui peuvent évoquer la Covid depuis plus de 4 jours, nous vous recommandons de faire un **test PCR nasopharyngé**. Consultez notre page thématique [« J’ai des symptômes de la Covid, que faire ? »](j-ai-des-symptomes-covid.html).

</div>

<div id="{{prefixe}}-pas-symptomes-cas-contact-oui-reponse" class="statut statut-bleu" hidden>

Vous n’avez pas de symptômes qui peuvent évoquer la Covid mais vous êtes cas contact, nous vous recommandons de faire un **test antigénique** si vous venez de l’apprendre.

Pour un test de contrôle (7 jours après votre contact à risque ), les tests **antigénique** ou **PCR nasopharyngé** sont indiqués.  Consultez notre page thématique [« Je suis cas contact Covid, que faire ? »](cas-contact-a-risque.html).

</div>

<div id="{{prefixe}}-pas-symptomes-pas-cas-contact-auto-test-oui-reponse" class="statut statut-bleu" hidden>

Vous n’avez pas de symptômes qui peuvent évoquer la Covid, vous n’êtes pas cas contact mais votre autotest est positif. Vous devez confirmer ce résultat avec un test **PCR nasopharyngé** et rester en isolement le temps d’obtenir cette confirmation.

</div>

<div id="{{prefixe}}-pas-symptomes-pas-cas-contact-auto-test-non-reponse" class="statut statut-bleu" hidden>

Vous n’avez pas de symptômes qui peuvent évoquer la Covid et vous n’êtes pas cas contact :

* Si vous souhaitez obtenir un « [passe sanitaire](pass-sanitaire-qr-code-voyages.html) » (mineurs de 12 à 15 ans), un test négatif **PCR nasopharyngé** ou **antigénique**, réalisé il y a moins de **24 h** est nécessaire.
* Si vous rendez visite à des personnes vulnérables, un test **antigénique** ou **PCR nasopharyngé** est indiqué.
* Si vous travaillez régulièrement avec des personnes fragiles, il est recommandé de vous tester régulièrement avec les **autotests** vendus en pharmacie (les professionnels exerçant à domicile auprès de personnes vulnérables peuvent obtenir la prise en charge de 10 autotests par mois en présentant leur carte professionnelle au pharmacien).

</div>

<p id="{{prefixe}}-refaire" hidden>
<a href="javascript:;" role="button" class="button button-outline button-half-width">Recommencer le questionnaire</a>
</p>
