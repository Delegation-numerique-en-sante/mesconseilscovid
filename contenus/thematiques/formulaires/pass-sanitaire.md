<form id="{{prefixe}}-demarrage-form">
    <fieldset>
        <legend>
            Je vérifie <b>quel type de pass sanitaire</b> correspond à ma situation : attestation de vaccination, test de dépistage ou certificat de rétablissement.
        </legend>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p></p>
            <input type="submit" class="button button-arrow" value=" C’est parti !   ">
        </div>
    </div>
</form>

<form id="{{prefixe}}-vaccination-form" hidden>
    <a href="javascript:;" data-precedent="demarrage" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-vaccination-label">Avez-vous reçu des doses de vaccin ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-vaccination-label">
            <input id="{{prefixe}}_vaccination_radio_deux_doses" type="radio" required name="{{prefixe}}_vaccination_radio" value="2">
            <label for="{{prefixe}}_vaccination_radio_deux_doses">2 doses (ou plus)</label>
            <input id="{{prefixe}}_vaccination_radio_une_dose" type="radio" required name="{{prefixe}}_vaccination_radio" value="1">
            <label for="{{prefixe}}_vaccination_radio_une_dose">1 dose</label>
            <input id="{{prefixe}}_vaccination_radio_aucune_dose" type="radio" required name="{{prefixe}}_vaccination_radio" value="0">
            <label for="{{prefixe}}_vaccination_radio_aucune_dose">Aucune dose</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-vaccination" class="progress">Il vous reste moins de 3 étapes</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-vaccination">
        </div>
    </div>
</form>

<form id="{{prefixe}}-date-1re-dose-janssen-form" hidden>
    <a href="javascript:;" data-precedent="type-vaccin" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-date-1re-dose-janssen-label">À quelle date avez-vous reçu cette dose ?</h3></legend>
        <input type="date" lang="fr" id="{{prefixe}}_date_1re_dose_janssen" name="{{prefixe}}_date_1re_dose_janssen" required>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-date-1re-dose-janssen" class="progress">C’est la dernière étape !</p>
            <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-{{prefixe}}-date-1re-dose-janssen">
        </div>
    </div>
</form>

<form id="{{prefixe}}-date-1re-dose-autres-form" hidden>
    <a href="javascript:;" data-precedent="guerison-avant-1re-dose" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-date-1re-dose-autres-label">Quand avez-vous reçu cette dose ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-date-1re-dose-autres-label">
            <input id="{{prefixe}}_date_1re_dose_autres_radio_moins_de_7_jours" type="radio" required name="{{prefixe}}_date_1re_dose_autres_radio" value="moins_de_7_jours">
            <label for="{{prefixe}}_date_1re_dose_autres_radio_moins_de_7_jours">il y a moins de 7 jours</label>
            <input id="{{prefixe}}_date_1re_dose_autres_radio_7_jours_ou_plus" type="radio" required name="{{prefixe}}_date_1re_dose_autres_radio" value="7_jours_ou_plus">
            <label for="{{prefixe}}_date_1re_dose_autres_radio_7_jours_ou_plus">il y a 7 jours ou plus</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-date-1re-dose-autres" class="progress">C’est la dernière étape !</p>
            <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-{{prefixe}}-date-1re-dose-autres">
        </div>
    </div>
</form>

<form id="{{prefixe}}-date-2e-dose-form" hidden>
    <a href="javascript:;" data-precedent="vaccination" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-date-2e-dose-label">Quand avez-vous reçu la deuxième dose ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-date-2e-dose-label">
            <input id="{{prefixe}}_date_2e_dose_radio_moins_de_7_jours" type="radio" required name="{{prefixe}}_date_2e_dose_radio" value="moins_de_7_jours">
            <label for="{{prefixe}}_date_2e_dose_radio_moins_de_7_jours">il y a moins de 7 jours</label>
            <input id="{{prefixe}}_date_2e_dose_radio_7_jours_ou_plus" type="radio" required name="{{prefixe}}_date_2e_dose_radio" value="7_jours_ou_plus">
            <label for="{{prefixe}}_date_2e_dose_radio_7_jours_ou_plus">il y a 7 jours ou plus</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-date-2e-dose" class="progress">C’est la dernière étape !</p>
            <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-{{prefixe}}-date-2e-dose">
        </div>
    </div>
</form>

<form id="{{prefixe}}-type-vaccin-form" hidden>
    <a href="javascript:;" data-precedent="vaccination" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-type-vaccin-label">Quel vaccin avez-vous reçu ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-type-vaccin-label">
            <input id="{{prefixe}}_type_vaccin_radio_pfizer" type="radio" required name="{{prefixe}}_type_vaccin_radio" value="pfizer">
            <label for="{{prefixe}}_type_vaccin_radio_pfizer">Pfizer-BioNTech (<i>Comirnaty</i><sup>®</sup>)</label>
            <input id="{{prefixe}}_type_vaccin_radio_moderna" type="radio" required name="{{prefixe}}_type_vaccin_radio" value="moderna">
            <label for="{{prefixe}}_type_vaccin_radio_moderna">Moderna (<i>Spikevax</i><sup>®</sup>)</label>
            <input id="{{prefixe}}_type_vaccin_radio_astrazeneca" type="radio" required name="{{prefixe}}_type_vaccin_radio" value="astrazeneca">
            <label for="{{prefixe}}_type_vaccin_radio_astrazeneca">AstraZeneca (<i>Vaxzevria</i><sup>®</sup>)</label>
            <input id="{{prefixe}}_type_vaccin_radio_janssen" type="radio" required name="{{prefixe}}_type_vaccin_radio" value="janssen">
            <label for="{{prefixe}}_type_vaccin_radio_janssen">Janssen</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-type-vaccin" class="progress">Il vous reste moins de 2 étapes</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-type-vaccin">
        </div>
    </div>
</form>

<form id="{{prefixe}}-guerison-avant-1re-dose-form" hidden>
    <a href="javascript:;" data-precedent="type-vaccin" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-guerison-avant-1re-dose-label">Aviez-vous eu la Covid avant cette dose de vaccin ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-guerison-avant-1re-dose-label">
            <input id="{{prefixe}}_guerison_avant_1re_dose_radio_oui" type="radio" required name="{{prefixe}}_guerison_avant_1re_dose_radio" value="oui">
            <label for="{{prefixe}}_guerison_avant_1re_dose_radio_oui">Oui</label>
            <input id="{{prefixe}}_guerison_avant_1re_dose_radio_non" type="radio" required name="{{prefixe}}_guerison_avant_1re_dose_radio" value="non">
            <label for="{{prefixe}}_guerison_avant_1re_dose_radio_non">Non</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-guerison-avant-1re-dose" class="progress">Plus qu’une étape</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-guerison-avant-1re-dose">
        </div>
    </div>
</form>

<form id="{{prefixe}}-guerison-avant-1re-dose-autres-form" hidden>
    <a href="javascript:;" data-precedent="type-vaccin" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-guerison-avant-1re-dose-autres-label">Aviez-vous eu la Covid avant cette dose de vaccin ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-guerison-avant-1re-dose-autres-label">
            <input id="{{prefixe}}_guerison_avant_1re_dose_autres_radio_oui" type="radio" required name="{{prefixe}}_guerison_avant_1re_dose_autres_radio" value="oui">
            <label for="{{prefixe}}_guerison_avant_1re_dose_autres_radio_oui">Oui</label>
            <input id="{{prefixe}}_guerison_avant_1re_dose_autres_radio_non" type="radio" required name="{{prefixe}}_guerison_avant_1re_dose_autres_radio" value="non">
            <label for="{{prefixe}}_guerison_avant_1re_dose_autres_radio_non">Non</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-guerison-avant-1re-dose-autres" class="progress">Il vous reste moins de 2 étapes</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-guerison-avant-1re-dose-autres">
        </div>
    </div>
</form>

<form id="{{prefixe}}-depistage-positif-form" hidden>
    <a href="javascript:;" data-precedent="vaccination" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-depistage-positif-label">Avez-vous déjà été positif à un test PCR ou antigénique ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-depistage-positif-label">
            <input id="{{prefixe}}_depistage_positif_radio_oui" type="radio" required name="{{prefixe}}_depistage_positif_radio" value="oui">
            <label for="{{prefixe}}_depistage_positif_radio_oui">Oui</label>
            <input id="{{prefixe}}_depistage_positif_radio_non" type="radio" required name="{{prefixe}}_depistage_positif_radio" value="non">
            <label for="{{prefixe}}_depistage_positif_radio_non">Non</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-depistage-positif" class="progress">Il vous reste moins de 2 étapes</p>
            <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-{{prefixe}}-depistage-positif">
        </div>
    </div>
</form>

<form id="{{prefixe}}-date-derniere-covid-form" hidden>
    <a href="javascript:;" data-precedent="depistage-positif" class="back-button">Retour</a>
    <fieldset class="required">
        <legend><h3 id="{{prefixe}}-date-derniere-covid-label">De quand date ce test positif ?</h3></legend>
        <div role="radiogroup" aria-labelledby="{{prefixe}}-date-derniere-covid-label">
            <input id="{{prefixe}}_date_derniere_covid_radio_moins_de_6_mois" type="radio" required name="{{prefixe}}_date_derniere_covid_radio" value="moins_de_6_mois">
            <label for="{{prefixe}}_date_derniere_covid_radio_moins_de_6_mois">Moins de 6  mois</label>
            <input id="{{prefixe}}_date_derniere_covid_radio_plus_de_6_mois" type="radio" required name="{{prefixe}}_date_derniere_covid_radio" value="plus_de_6_mois">
            <label for="{{prefixe}}_date_derniere_covid_radio_plus_de_6_mois">Plus de 6 mois</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-{{prefixe}}-date-derniere-covid" class="progress">C’est la dernière étape !</p>
            <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-{{prefixe}}-date-derniere-covid">
        </div>
    </div>
</form>

<div id="{{prefixe}}-vaccination-complete-reponse" class="statut statut-bleu" hidden>

Félicitations, votre schéma vaccinal est **complet** ! 🎉

Votre **attestation de vaccination**, munie d’un QR code, fait office de pass sanitaire. **Attention**, si vous êtes éligible à une **dose de rappel** (dite 3<sup>e</sup> dose), votre pass sanitaire pourrait devenir invalide prochainement.

[Comment obtenir mon attestation de vaccination ?](#comment-obtenir-une-attestation-de-vaccination-complete-avec-un-qr-code)

[Avant quelle date dois-je recevoir la dose de rappel, dite 3e dose, pour conserver mon pass vaccinal ?](#avant-quelle-date-dois-je-recevoir-la-dose-de-rappel-dite-3-e-dose-pour-conserver-mon-pass-vaccinal)

</div>

<div id="{{prefixe}}-vaccination-delai-7-jours-reponse" class="statut statut-bleu" hidden>

Vous devez **attendre 7 jours** après votre injection pour que votre schéma vaccinal soit complet. Vous ne pourrez donc pas faire valoir votre attestation de vaccination comme pass sanitaire pour l’instant.

En attendant, vous pouvez présenter soit un **test de dépistage négatif** de **moins de 24 h**, soit un **test de dépistage positif** de plus de **11 jours** et de moins de **6 mois**.

</div>

<div id="{{prefixe}}-vaccination-delai-28-jours-reponse" class="statut statut-bleu" hidden>

Vous devez **attendre 28 jours** (4 semaines) après votre injection pour que votre schéma vaccinal soit complet. Vous ne pourrez donc pas faire valoir votre attestation de vaccination comme pass sanitaire pour l’instant.

En attendant, un **test de dépistage négatif** (test PCR ou antigénique) datant de **moins de 24 h** fera office de pass sanitaire.

</div>

<div id="{{prefixe}}-vaccination-incomplete-reponse" class="statut statut-bleu" hidden>

Votre schéma vaccinal est **incomplet** tant que vous n’avez pas reçu la dose de rappel (2<sup>e</sup> dose). Vous ne pourrez donc pas le faire valoir comme pass sanitaire pour l’instant.

En attendant, un **test de dépistage négatif** (test PCR ou antigénique) datant de **moins de 24 h** fera office de pass sanitaire.

</div>

<div id="{{prefixe}}-non-vaccine-reponse" class="statut statut-bleu" hidden>

Vous avez **2 possibilités** pour obtenir un pass sanitaire :

1. présenter un **test de dépistage négatif** (test PCR ou antigénique) de moins de **24 h** ;

2. vous faire **vacciner** : l’attestation de vaccination fera office de pass sanitaire **7 jours après la 2<sup>e</sup> dose**.


</div>

<div id="{{prefixe}}-test-positif-moins-de-6-mois-reponse" class="statut statut-bleu" hidden>

Vous avez **3 possibilités** pour obtenir un pass sanitaire :

1. présenter votre **test de dépistage positif** (aussi appelé *certificat de rétablissement*), datant de plus de **11 jours** et de moins de **6 mois**, et comportant un QR code ;

2. présenter un **test de dépistage négatif** de moins de **24 h** ;

3. vous faire **vacciner** (comme vous avez déjà eu la Covid, **une seule dose** sera nécessaire, mais il est recommandé d’attendre 2 mois minimum après la guérison, idéalement jusqu’à 6 mois) : l’attestation de vaccination fera office de pass sanitaire **7 jours** après cette dose.

</div>

<div id="{{prefixe}}-test-positif-plus-de-6-mois-reponse" class="statut statut-bleu" hidden>

Vous avez **2 possibilités** pour obtenir un pass sanitaire :

1. présenter un **test de dépistage négatif** de moins de **24 h** ;

2. vous faire **vacciner** (comme vous avez déjà eu la Covid, **une seule dose** sera nécessaire) : l’attestation de vaccination fera office de pass sanitaire **7 jours** après cette dose.


</div>

<p id="{{prefixe}}-refaire" hidden>
<a href="javascript:;" role="button" class="button button-outline button-half-width">Recommencer le questionnaire</a>
</p>
