<form id="{{prefixe}}-demarrage-form">
    <fieldset>
        <legend>
            Suis-je concerné par la <strong>dose de rappel</strong> ? À partir de <strong>quelle date</strong> pourrai-je la recevoir ? Quelle est la date limite pour ne pas perdre mon <strong>passe vaccinal</strong> ?
        </legend>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p></p>
            <input type="submit" class="button button-arrow" value=" C’est parti !   ">
        </div>
    </div>
</form>

<form id="{{prefixe}}-age-form" hidden>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-age-label">Mon âge</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-age-label">
            <input id="{{prefixe}}_age_radio_plus65" type="radio" required name="{{prefixe}}_age_radio" value="plus65">
            <label for="{{prefixe}}_age_radio_plus65">J’ai 65 ans ou plus</label>
            <input id="{{prefixe}}_age_radio_moins65" type="radio" required name="{{prefixe}}_age_radio" value="moins65">
            <label for="{{prefixe}}_age_radio_moins65">J’ai entre 18 et 64 ans</label>
            <input id="{{prefixe}}_age_radio_moins18" type="radio" required name="{{prefixe}}_age_radio" value="moins18">
            <label for="{{prefixe}}_age_radio_moins18">J’ai entre 12 et 17 ans</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-age" class="progress">Il vous reste 2 étapes</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-age">
        </div>
    </div>
</form>

<form id="{{prefixe}}-vaccination-initiale-form" hidden>
    <a href="javascript:;" data-precedent="age" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-vaccination-initiale-label">Ma vaccination initiale</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-vaccination-initiale-label">
            <input id="{{prefixe}}_vaccination_initiale_radio_autre" type="radio" required name="{{prefixe}}_vaccination_initiale_radio" value="autre">
            <label for="{{prefixe}}_vaccination_initiale_radio_autre">J’ai été vacciné avec Pfizer, Moderna ou AstraZeneca</label>
            <input id="{{prefixe}}_vaccination_initiale_radio_janssen" type="radio" required name="{{prefixe}}_vaccination_initiale_radio" value="janssen">
            <label for="{{prefixe}}_vaccination_initiale_radio_janssen">J’ai été vacciné avec Janssen</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-situation" class="progress">Il vous reste 1 étape</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-situation">
        </div>
    </div>
</form>

<form id="{{prefixe}}-date-derniere-dose-form" hidden>
    <a href="javascript:;" data-precedent="age" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-date-derniere-dose-label">La date de ma dernière injection</h3></legend>
        <input type="date" lang="fr" id="{{prefixe}}_date_derniere_dose" name="{{prefixe}}_date_derniere_dose" required>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-situation" class="progress">C’est la dernière étape !</p>
            <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-{{prefixe}}-situation">
        </div>
    </div>
</form>

<div id="{{prefixe}}-rappel-et-pass-reponse" class="statut statut-bleu" hidden>

Vous avez <strong class="age"></strong> et avez été vacciné(e) avec le vaccin <span class="vaccin"></span>.

Votre dernière injection date du <strong class="date-derniere-dose"></strong>.

Vous pourrez recevoir votre <span class="type-dose">dose de rappel</span> à partir du <strong class="date-eligibilite-rappel"></strong>.

En l’absence de cette injection, votre passe vaccinal actuel ne sera plus valide à partir du <strong class="desactivation-passe-vaccinal"></strong>.

Si vous recevez votre <span class="type-dose">dose de rappel</span> avant cette date, alors vous pourrez prolonger votre passe vaccinal sans discontinuité.

</div>

<div id="{{prefixe}}-rappel-reponse" class="statut statut-bleu" hidden>

Vous avez <strong class="age"></strong> et avez été vacciné(e) avec le vaccin <span class="vaccin"></span>.

Votre dernière injection date du <strong class="date-derniere-dose"></strong>.

Vous pourrez recevoir votre dose de rappel à partir du <strong class="date-eligibilite-rappel"></strong>.

Vous ne serez **pas concerné(e)** par la désactivation du passe vaccinal, qui restera valable au delà du 15 décembre 2021.

</div>

<div id="{{prefixe}}-pas-concerne-reponse" class="statut statut-bleu" hidden>

Vous avez **moins de 18 ans** et avez été vacciné(e) avec le vaccin **Pfizer, Moderna ou AstraZeneca**.

Vous n’êtes actuellement **pas concerné** par la campagne de rappel.

Votre **passe vaccinal** restera également valable au delà du 15 décembre 2021.

</div>

<p id="{{prefixe}}-refaire" hidden>
<a href="javascript:;" role="button" class="button button-outline button-half-width">Recommencer le questionnaire</a>
</p>
