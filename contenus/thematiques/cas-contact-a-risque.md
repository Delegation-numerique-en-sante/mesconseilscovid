# Je suis cas contact Covid, que faire ?

<div class="illustration">
    <img src="illustrations/contactarisque.svg" alt="">
</div>

<div id="conseils-personnels" class="conseils">

<p>
<big>Vous avez passé du temps avec une personne <b>positive à la Covid</b> ? Vous avez été contacté·e par l’<b>Assurance Maladie</b> ? Vous avez reçu une notification « Exposition à risque » de l’application <b>TousAntiCovid</b> ?</big>
</p>

<div class="conseil">

<span class="nouveau">nouveau</span> Les personnes vacciné(e)s avec un schéma vaccinal complet (toutes les doses nécéssaires) n’ont plus l’obligation de s’isoler après un contact à risque.

</div>

<form id="contact-a-risque-vaccine-form">
    <fieldset>
        <legend><h2 id="contact-a-risque-vaccine-label">Je suis cas contact et :</h2></legend>
        <div role="radiogroup" aria-labelledby="contact-a-risque-vaccine-label">
            <input id="contact_a_risque_vaccine_radio_vaccine" type="radio" required name="contact_a_risque_vaccine_radio" value="vaccine">
            <label for="contact_a_risque_vaccine_radio_vaccine">Je suis complètement vacciné(e)</label>
            <input id="contact_a_risque_vaccine_radio_pas_vaccine" type="radio" required name="contact_a_risque_vaccine_radio" value="pas-vaccine">
            <label for="contact_a_risque_vaccine_radio_pas_vaccine">Je ne suis pas complètement vacciné(e)</label>
        </div>
    </fieldset>
    <div class="form-controls">
        <div class="button-with-progress">
            <p id="aria-description-progress-contact-a-risque" class="progress visually-hidden">C’est la seule question</p>
            <input type="submit" class="button" value="Terminer" aria-describedby="aria-description-progress-contact-a-risque">
        </div>
    </div>
</form>


<div id="contact-a-risque-pas-vaccine-reponse" class="conseils" hidden>

## Vous n’êtes pas complètement vacciné(e), voici ce que nous vous conseillons de faire :

### 1. Vous isoler

<div class="conseil">

Restez isolé·e **au minimum 7 jours** après votre dernier contact à risque.

</div>

Si vous ne pouvez pas **télétravailler**, vous pouvez [demander un arrêt de travail](https://declare.ameli.fr/isolement/conditions) sans délai de carence, pour pouvoir vous isoler en attendant le résultat du test.

### 2. Faire un test

<div class="conseil">

Faire un **test antigénique** en pharmacie **immédiatement** (voir la [carte des lieux de test](https://www.sante.fr/cf/centres-depistage-covid.html)).

</div>

* Si le test est **positif**, restez en **isolement au moins 10 jours** à partir de la date du test.

* Si le test est **négatif**, restez **en isolement**, et **refaites un test 7 jours après** le dernier contact à risque :

    * s’il est **négatif**, vous pourrez lever votre isolement ;
    * s’il est **positif**, restez en isolement au moins 10 jours à partir de la date du test, et surveillez l’apparition de symptômes.


Si votre test est **positif**, les autres membres de votre foyer seront considérés comme **cas contact**, et devront :

* se maintenir **en isolement** eux aussi (les enfants ne doivent pas aller à l’**école**) ;
* faire un **test antigénique immédiatement** (voir la [carte des lieux de test](https://www.sante.fr/cf/centres-depistage-covid.html)).

</div>

<div id="contact-a-risque-vaccine-reponse" class="conseils" hidden>

## Vous êtes complètement vacciné(e), voici ce que nous vous conseillons de faire :

### 1. Faire un test

<div class="conseil">

Faire un **test antigénique** en pharmacie **immédiatement** (voir la [carte des lieux de test](https://www.sante.fr/cf/centres-depistage-covid.html)).

</div>

* Si le test est **positif**, restez en **isolement au moins 10 jours** à partir de la date du test. Pas besoin de faire un test de contrôle pour sortir de l’isolement.

* Si le test est **négatif** :
    * portez le masque à l’intérieur et à l’extérieur, même dans les lieux qui ne l’exigent plus (restaurant, musées…) ;
    * évitez de rencontrer des personnes vulnérables ou fragiles ;
    * surveillez votre état : température, symptômes…
    
### 2. Faire un test de contrôle

<div class="conseil">

Si votre premier test était **négatif**, faire un test de contrôle 7 jours après le dernier contact à risque.

</div>

* s’il est **négatif**, vous pourrez retirer le masque dans les lieux où il n’est plus obligatoire et reprendre prudemment votre vie sociale ;
* s’il est **positif**, restez en isolement au moins 10 jours à partir de la date du test, et surveillez l’apparition de symptômes. Il n’est pas nécessaire de faire un test de contrôle pour sortir de l’isolement.

Si votre test est **positif**, les autres membres de votre foyer seront considérés comme **cas contact**, et devront, selon leur situation personnelle (schéma vaccinal complet ou non) :

* se maintenir **en isolement** eux aussi (les enfants ne doivent pas aller à l’**école**) ;
* faire un **test antigénique immédiatement** (voir la [carte des lieux de test](https://www.sante.fr/cf/centres-depistage-covid.html)).

</div>

<p id="contact-a-risque-refaire" data-initial-form="vaccine" hidden>
<a href="#" role="button" class="button button-outline button-half-width">Recommencer le questionnaire</a>
</p>

<div class="conseil conseil-jaune">

**L’Assurance maladie peut vous contacter par SMS** pour vous informer que vous êtes cas contact ou positif et vous inviter à vous isoler. Les SMS peuvent prendre la forme d’un échange guidé, mais **l’Assurance maladie ne vous demandera pas de partager des informations personnelles telles que : numéro de sécurité sociale, numéro de carte bancaire, mot de  passe...** Face à la recrudescence des fraudes, restez vigilants. Pour plus d’information à ce sujet, rendez-vous sur le [site de l’Assurance maladie](https://www.ameli.fr/hauts-de-seine/assure/droits-demarches/principes/attention-appels-courriels-frauduleux).

</div>

</div>
