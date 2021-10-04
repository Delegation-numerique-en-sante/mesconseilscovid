# Pass sanitaire, QR code et voyages, que faut-il savoir ?

<img src="illustrations/pass_sanitaire.svg">

<header>
    <p class="big">Pass sanitaire européen, certificat de vaccination, attestations, QR code… MesConseilsCovid vous propose une synthèse des informations importantes.</p>
</header>

<div itemscope itemtype="https://schema.org/FAQPage">

<details>
    <summary>
        <h2>
            L’usage du pass sanitaire en France
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
        </h2>
    </summary>

.. question:: Qu’est-ce que le pass sanitaire ?
    :level: 3

    En France, le pass sanitaire peut être, **selon votre situation** :

    - un [test de dépistage négatif](#comment-obtenir-un-certificat-de-depistage-avec-qr-code) : **test PCR**, **test antigénique** ou **autotest supervisé par un professionnel de santé**, datant de moins de **72 h** (**sauf** pour les voyages en **Corse** et **Dom-Tom** : le test antigénique est valable **48 h** et les autotests ne sont pas acceptés) ;

    - un [certificat de rétablissement](#comment-obtenir-un-certificat-de-retablissement-avec-qr-code) : un test de dépistage **positif**, **PCR** ou **antigénique** de **plus de 11 jours** et **moins de 6 mois** ;

    - une [attestation de vaccination complète](#comment-obtenir-une-attestation-de-vaccination-complete-avec-un-qr-code) : qui indique que votre **schéma vaccinal est complet** (après 1 ou 2 doses [selon les cas](/je-veux-me-faire-vacciner.html#suis-je-immunise-e-apres-une-seule-dose-de-vaccin)).

    <div class="conseil conseil-jaune">

    Ces documents sont valables **à condition qu’ils comportent un QR code.**

    </div>

    <div class="conseil conseil-jaune">

    Les **tests sérologiques** et les **autotests non supervisés** par un professionnel de santé ne sont **pas** des pass sanitaires.

    </div>

    <div class="voir-aussi">

    - [Comment faire pour obtenir une attestation de vaccination, certificat de rétablissement ou de dépistage avec un QR Code ?](#obtenir-son-justificatif-avec-qr-code)
    - [J’ai été vacciné à l’étranger avec un vaccin reconnu en France, comment obtenir un QR code valable en France ?](#j-ai-ete-vaccine-a-l-etranger-avec-un-vaccin-reconnu-en-france-comment-obtenir-un-qr-code-valable-en-france)

    </div>


.. question:: Quel justificatif utiliser comme pass sanitaire en France ?
    :level: 3

    <form id="pass-sanitaire-demarrage-form">
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

    <form id="pass-sanitaire-vaccination-form" hidden>
        <a href="#" data-precedent="demarrage" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-vaccination-label">Avez-vous reçu des doses de vaccin ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-vaccination-label">
                <input id="pass_sanitaire_vaccination_radio_deux_doses" type="radio" required name="pass_sanitaire_vaccination_radio" value="2">
                <label for="pass_sanitaire_vaccination_radio_deux_doses">2 doses (ou plus)</label>
                <input id="pass_sanitaire_vaccination_radio_une_dose" type="radio" required name="pass_sanitaire_vaccination_radio" value="1">
                <label for="pass_sanitaire_vaccination_radio_une_dose">1 dose</label>
                <input id="pass_sanitaire_vaccination_radio_aucune_dose" type="radio" required name="pass_sanitaire_vaccination_radio" value="0">
                <label for="pass_sanitaire_vaccination_radio_aucune_dose">Aucune dose</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-vaccination" class="progress">Il vous reste moins de 3 étapes</p>
                <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-pass-sanitaire-vaccination">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-date-1re-dose-janssen-form" hidden>
        <a href="#" data-precedent="type-vaccin" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-date-1re-dose-janssen-label">À quelle date avez-vous reçu cette dose ?</h3></legend>
            <input type="date" lang="fr" id="pass_sanitaire_date_1re_dose_janssen" name="pass_sanitaire_date_1re_dose_janssen" required>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-date-1re-dose-janssen" class="progress">C’est la dernière étape !</p>
                <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-pass-sanitaire-date-1re-dose-janssen">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-date-1re-dose-autres-form" hidden>
        <a href="#" data-precedent="guerison-avant-1re-dose" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-date-1re-dose-autres-label">Quand avez-vous reçu cette dose ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-date-1re-dose-autres-label">
                <input id="pass_sanitaire_date_1re_dose_autres_radio_moins_de_7_jours" type="radio" required name="pass_sanitaire_date_1re_dose_autres_radio" value="moins_de_7_jours">
                <label for="pass_sanitaire_date_1re_dose_autres_radio_moins_de_7_jours">il y a moins de 7 jours</label>
                <input id="pass_sanitaire_date_1re_dose_autres_radio_7_jours_ou_plus" type="radio" required name="pass_sanitaire_date_1re_dose_autres_radio" value="7_jours_ou_plus">
                <label for="pass_sanitaire_date_1re_dose_autres_radio_7_jours_ou_plus">il y a 7 jours ou plus</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-date-1re-dose-autres" class="progress">C’est la dernière étape !</p>
                <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-pass-sanitaire-date-1re-dose-autres">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-date-2e-dose-form" hidden>
        <a href="#" data-precedent="vaccination" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-date-2e-dose-label">Quand avez-vous reçu la deuxième dose ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-date-2e-dose-label">
                <input id="pass_sanitaire_date_2e_dose_radio_moins_de_7_jours" type="radio" required name="pass_sanitaire_date_2e_dose_radio" value="moins_de_7_jours">
                <label for="pass_sanitaire_date_2e_dose_radio_moins_de_7_jours">il y a moins de 7 jours</label>
                <input id="pass_sanitaire_date_2e_dose_radio_7_jours_ou_plus" type="radio" required name="pass_sanitaire_date_2e_dose_radio" value="7_jours_ou_plus">
                <label for="pass_sanitaire_date_2e_dose_radio_7_jours_ou_plus">il y a 7 jours ou plus</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-date-2e-dose" class="progress">C’est la dernière étape !</p>
                <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-pass-sanitaire-date-2e-dose">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-type-vaccin-form" hidden>
        <a href="#" data-precedent="vaccination" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-type-vaccin-label">Quel vaccin avez-vous reçu ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-type-vaccin-label">
                <input id="pass_sanitaire_type_vaccin_radio_pfizer" type="radio" required name="pass_sanitaire_type_vaccin_radio" value="pfizer">
                <label for="pass_sanitaire_type_vaccin_radio_pfizer">Pfizer-BioNTech (<i>Cominarty</i><sup>®</sup>)</label>
                <input id="pass_sanitaire_type_vaccin_radio_moderna" type="radio" required name="pass_sanitaire_type_vaccin_radio" value="moderna">
                <label for="pass_sanitaire_type_vaccin_radio_moderna">Moderna (<i>Spikevax</i><sup>®</sup>)</label>
                <input id="pass_sanitaire_type_vaccin_radio_astrazeneca" type="radio" required name="pass_sanitaire_type_vaccin_radio" value="astrazeneca">
                <label for="pass_sanitaire_type_vaccin_radio_astrazeneca">AstraZeneca (<i>Vaxzevria</i><sup>®</sup>)</label>
                <input id="pass_sanitaire_type_vaccin_radio_janssen" type="radio" required name="pass_sanitaire_type_vaccin_radio" value="janssen">
                <label for="pass_sanitaire_type_vaccin_radio_janssen">Janssen</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-type-vaccin" class="progress">Il vous reste moins de 2 étapes</p>
                <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-pass-sanitaire-type-vaccin">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-guerison-avant-1re-dose-form" hidden>
        <a href="#" data-precedent="type-vaccin" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-guerison-avant-1re-dose-label">Aviez-vous eu la Covid avant cette dose de vaccin ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-guerison-avant-1re-dose-label">
                <input id="pass_sanitaire_guerison_avant_1re_dose_radio_oui" type="radio" required name="pass_sanitaire_guerison_avant_1re_dose_radio" value="oui">
                <label for="pass_sanitaire_guerison_avant_1re_dose_radio_oui">Oui</label>
                <input id="pass_sanitaire_guerison_avant_1re_dose_radio_non" type="radio" required name="pass_sanitaire_guerison_avant_1re_dose_radio" value="non">
                <label for="pass_sanitaire_guerison_avant_1re_dose_radio_non">Non</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-guerison-avant-1re-dose" class="progress">Plus qu’une étape</p>
                <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-pass-sanitaire-guerison-avant-1re-dose">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-guerison-avant-1re-dose-autres-form" hidden>
        <a href="#" data-precedent="type-vaccin" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-guerison-avant-1re-dose-autres-label">Aviez-vous eu la Covid avant cette dose de vaccin ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-guerison-avant-1re-dose-autres-label">
                <input id="pass_sanitaire_guerison_avant_1re_dose_autres_radio_oui" type="radio" required name="pass_sanitaire_guerison_avant_1re_dose_autres_radio" value="oui">
                <label for="pass_sanitaire_guerison_avant_1re_dose_autres_radio_oui">Oui</label>
                <input id="pass_sanitaire_guerison_avant_1re_dose_autres_radio_non" type="radio" required name="pass_sanitaire_guerison_avant_1re_dose_autres_radio" value="non">
                <label for="pass_sanitaire_guerison_avant_1re_dose_autres_radio_non">Non</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-guerison-avant-1re-dose-autres" class="progress">Il vous reste moins de 2 étapes</p>
                <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-pass-sanitaire-guerison-avant-1re-dose-autres">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-depistage-positif-form" hidden>
        <a href="#" data-precedent="vaccination" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-depistage-positif-label">Avez-vous déjà été positif à un test PCR ou antigénique ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-depistage-positif-label">
                <input id="pass_sanitaire_depistage_positif_radio_oui" type="radio" required name="pass_sanitaire_depistage_positif_radio" value="oui">
                <label for="pass_sanitaire_depistage_positif_radio_oui">Oui</label>
                <input id="pass_sanitaire_depistage_positif_radio_non" type="radio" required name="pass_sanitaire_depistage_positif_radio" value="non">
                <label for="pass_sanitaire_depistage_positif_radio_non">Non</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-depistage-positif" class="progress">Il vous reste moins de 2 étapes</p>
                <input type="submit" class="button button-arrow" value="Continuer" aria-describedby="aria-description-progress-pass-sanitaire-depistage-positif">
            </div>
        </div>
    </form>

    <form id="pass-sanitaire-date-derniere-covid-form" hidden>
        <a href="#" data-precedent="depistage-positif" class="back-button">Retour</a>
        <fieldset class="required">
            <legend><h3 id="pass-sanitaire-date-derniere-covid-label">De quand date ce test positif ?</h3></legend>
            <div role="radiogroup" aria-labelledby="pass-sanitaire-date-derniere-covid-label">
                <input id="pass_sanitaire_date_derniere_covid_radio_moins_de_6_mois" type="radio" required name="pass_sanitaire_date_derniere_covid_radio" value="moins_de_6_mois">
                <label for="pass_sanitaire_date_derniere_covid_radio_moins_de_6_mois">Moins de 6  mois</label>
                <input id="pass_sanitaire_date_derniere_covid_radio_plus_de_6_mois" type="radio" required name="pass_sanitaire_date_derniere_covid_radio" value="plus_de_6_mois">
                <label for="pass_sanitaire_date_derniere_covid_radio_plus_de_6_mois">Plus de 6 mois</label>
            </div>
        </fieldset>
        <div class="form-controls">
            <div class="button-with-progress">
                <p id="aria-description-progress-pass-sanitaire-date-derniere-covid" class="progress">C’est la dernière étape !</p>
                <input type="submit" class="button button-arrow" value="Terminer" aria-describedby="aria-description-progress-pass-sanitaire-date-derniere-covid">
            </div>
        </div>
    </form>

    <div id="pass-sanitaire-vaccination-complete-reponse" class="statut statut-bleu" hidden>

    Félicitations, votre schéma vaccinal est **complet** ! 🎉

    Votre **attestation de vaccination**, munie d’un QR code, fait office de pass sanitaire.

    [Comment obtenir mon attestation de vaccination ?](#comment-obtenir-une-attestation-de-vaccination-complete-avec-un-qr-code)

    *Note : même si vous êtes éligible à une dose de rappel (dite 3<sup>e</sup> dose), votre pass sanitaire reste valide.*

    </div>

    <div id="pass-sanitaire-vaccination-delai-7-jours-reponse" class="statut statut-bleu" hidden>

    Vous devez **attendre 7 jours** après votre injection pour que votre schéma vaccinal soit complet. Vous ne pourrez donc pas faire valoir votre attestation de vaccination comme pass sanitaire pour l’instant.

    En attendant, vous pouvez présenter soit un **test de dépistage négatif** de **moins de 72 h**, soit un **test de dépistage positif** de plus de **11 jours** et de moins de **6 mois**.

    *Attention : pour voyager vers la Corse ou l’Outre-mer, un test négatif datant de moins de 48 h sera demandé.*

    </div>

    <div id="pass-sanitaire-vaccination-delai-28-jours-reponse" class="statut statut-bleu" hidden>

    Vous devez **attendre 28 jours** (4 semaines) après votre injection pour que votre schéma vaccinal soit complet. Vous ne pourrez donc pas faire valoir votre attestation de vaccination comme pass sanitaire pour l’instant.

    En attendant, un **test de dépistage négatif** (test PCR, antigénique, ou autotest supervisé par un professionnel) datant de **moins de 72 h** fera office de pass sanitaire.

    *Attention : pour voyager vers la Corse ou l’Outre-mer, un test négatif datant de moins de 48 h sera demandé.*

    </div>

    <div id="pass-sanitaire-vaccination-incomplete-reponse" class="statut statut-bleu" hidden>

    Votre schéma vaccinal est **incomplet** tant que vous n’avez pas reçu la dose de rappel (2<sup>e</sup> dose). Vous ne pourrez donc pas le faire valoir comme pass sanitaire pour l’instant.

    En attendant, un **test de dépistage négatif** (test PCR, antigénique, ou autotest supervisé par un professionnel) datant de **moins de 72 h** fera office de pass sanitaire.

    *Attention : pour voyager vers la Corse ou l’Outre-mer, un test négatif datant de moins de 48 h sera demandé.*

    </div>

    <div id="pass-sanitaire-non-vaccine-reponse" class="statut statut-bleu" hidden>

    Vous avez **2 possibilités** pour obtenir un pass sanitaire :

    1. présenter un **test de dépistage négatif** (test PCR, antigénique, ou autotest supervisé par un professionnel) de moins de **72 h** (*pour voyager vers la Corse ou l’Outre-mer, il devra dater de moins de 48 h*) ;

    2. vous faire **vacciner** : l’attestation de vaccination fera office de pass sanitaire **7 jours après la 2<sup>e</sup> dose**.


    </div>

    <div id="pass-sanitaire-test-positif-moins-de-6-mois-reponse" class="statut statut-bleu" hidden>

    Vous avez **3 possibilités** pour obtenir un pass sanitaire :

    1. présenter votre **test de dépistage positif** (aussi appelé *certificat de rétablissement*), datant de plus de **11 jours** et de moins de **6 mois**, et comportant un QR code ;

    2. présenter un **test de dépistage négatif** de moins de **72 h** (*pour voyager vers la Corse ou l’Outre-mer, il devra dater de moins de 48 h*) ;

    3. vous faire **vacciner** (comme vous avez déjà eu la Covid, **une seule dose** sera nécessaire, mais il est recommandé d’attendre 2 mois minimum après la guérison, idéalement jusqu’à 6 mois) : l’attestation de vaccination fera office de pass sanitaire **7 jours** après cette dose.

    </div>

    <div id="pass-sanitaire-test-positif-plus-de-6-mois-reponse" class="statut statut-bleu" hidden>

    Vous avez **2 possibilités** pour obtenir un pass sanitaire :

    1. présenter un **test de dépistage négatif** de moins de **72 h** (*pour voyager vers la Corse ou l’Outre-mer, il devra dater de moins de 48 h*) ;

    2. vous faire **vacciner** (comme vous avez déjà eu la Covid, **une seule dose** sera nécessaire) : l’attestation de vaccination fera office de pass sanitaire **7 jours** après cette dose.


    </div>

    <p id="pass-sanitaire-refaire" hidden>
    <a href="#" role="button" class="button button-outline button-half-width">Recommencer le questionnaire</a>
    </p>

    <div class="voir-aussi">

    - Si vous partez à l’étranger, consultez la rubrique « [Les voyages à l’étranger](#les-voyages-a-l-etranger) ».

    </div>


.. question:: Est-ce que je dois être vacciné pour avoir un pass sanitaire ?
    :level: 3

    **Non.** La vaccination n’est pas la seule façon d’obtenir un pass sanitaire.

    Si vous n’êtes pas encore complètement vacciné, vous pouvez présenter soit un **test de dépistage négatif** de **moins de 72 h**, soit un **test de dépistage positif** de plus de **11 jours** et de moins de **6 mois**.

    Si vous ne [pouvez-pas vous faire vacciner](#je-ne-peux-pas-me-faire-vacciner-comment-obtenir-un-pass-sanitaire) (en raison d’une **contre-indication médicale**), vous pouvez présenter le **certificat médical** établi par votre médecin.

    <div class="voir-aussi">

    - Consultez la [liste de tous les justificatifs](#qu-est-ce-que-le-pass-sanitaire) qui sont des pass sanitaires.

    </div>


.. question:: Je ne peux pas me faire vacciner, comment obtenir un pass sanitaire ?
    :level: 3

    En cas de **contre-indication médicale** (voir la [liste des contre-indications à la vaccination](/je-veux-me-faire-vacciner.html#y-a-t-il-des-contre-indications-a-la-vaccination)), vous pouvez demander à votre médecin de vous faire un **certificat médical**, qui fera office de **pass sanitaire**.
    
    Attention, si vous ne pouvez pas vous faire vacciner parce que **vous avez eu la Covid** il y a moins de **6 mois**, votre [**certificat de rétablissement**](#comment-obtenir-un-certificat-de-retablissement-avec-qr-code) (test de dépistage positif) avec **QR code** fera office de pass sanitaire.


.. question:: Où le pass sanitaire est-il obligatoire ?
    :level: 3

    Depuis le 9 juin, l’usage du pass sanitaire a été progressivement étendu aux lieux où le brassage de personnes pose des risques sanitaires.

    Il est notamment **obligatoire** pour accéder :
    - aux lieux de loisir et de culture : **cinéma, musées, théâtres, parc d’attraction…** ;
    - aux lieux de convivialité :  **restaurants**, **bars** et **cafés** (même en terrasse) ;
    - aux établissements médicaux-sociaux (**hôpitaux, EHPAD…**), pour les soins programmés, les accompagnateurs et visiteurs, mais **pas pour les urgences** ;
    - à certains grands centres commerciaux ;
    - aux **séminaires professionnels** de plus de 50 personnes organisés en dehors des locaux de l’entreprise.

    <div class="exemple">

    Par exemple, une personne vaccinée qui doit se rendre à sa consultation médicale non urgente dans un hôpital devra présenter son attestation de vaccination complète.

    </div>

    <div class="voir-aussi">

    - Consultez la [liste détaillée des lieux concernés par l’obligation du pass sanitaire](https://www.gouvernement.fr/ou-le-pass-sanitaire-est-il-obligatoire).

    </div>


.. question:: Le pass sanitaire est-il obligatoire pour accéder aux établissements d’enseignement ?
    :level: 3

    **Non**, le pass sanitaire n’est **pas obligatoire** pour accéder aux établissements d’enseignement : écoles, collèges, lycées ou universités.

    <div class="voir-aussi">

    - Consultez notre [page de conseils pour les mineurs](/conseils-pour-les-enfants.html) pour plus d’informations sur leur vaccination et sur le protocole sanitaire dans les établissements scolaires.

    </div>


.. question:: Dans quels moyens de transport (avion, car, train…) le pass sanitaire s’applique t-il ?
    :level: 3

    Le pass sanitaire est **obligatoire** pour accéder aux moyens de transport **longue distance** en France : **avions**, **trains** (TGV, Intercités, Ouigo), et **cars inter-régionaux**.

    Les **trains régionaux** (TER) et les **transports urbains** (bus, métros, RER, trains de banlieue…) ne sont **pas concernés** par cette obligation.

    <div class="exemple">

    Par exemple, une personne non vaccinée devra présenter un test de dépistage négatif de moins de 72 h réalisé par un professionnel de santé ou un certificat de rétablissement pour voyager en car de Bordeaux à Toulouse.

    </div>


.. question:: Qui est concerné par le pass sanitaire ?
    :level: 3

    Toutes les personnes âgées de plus de **12 ans et 2 mois**.
    
    <div class="voir-aussi">

    - Consultez notre page « [Conseils pour les mineurs : vaccination et scolarité](/conseils-pour-les-enfants.html) ».

    - Consultez notre page « [Je souhaite me faire vacciner, que faut-il savoir ?](/je-veux-me-faire-vacciner.html) ».

    </div>


.. question:: Est-ce que mon employeur peut exiger mon pass sanitaire ?
    :level: 3

    Cela dépend de votre **secteur d’activité**.

    Vous devez présenter un pass sanitaire valide à votre employeur si vous travaillez dans un lieu où il est **exigé des clients ou des usagers** (restaurant, cinéma, parc d’attraction…) et que vous êtes en **contact avec le public.**

    <div class="exemple">

    Par exemple, un chef cuisinier ne participant pas au service du restaurant et travaillant dans une cuisine fermée, non accessible au public, n’est pas dans l’obligation de présenter un pass sanitaire.

    En revanche, si la cuisine est ouverte ou s’il participe au service, alors il devra présenter à son employeur : un test de dépistage négatif toutes les 72 h **ou** un certificat de rétablissement de plus de 11 jours et moins de 6 mois **ou** une attestation de vaccination complète.

    </div>

    Les professionnels **soumis à une obligation vaccinale**, doivent actuellement présenter un pass sanitaire, et devront justifier d’une 1<sup>re</sup> dose de vaccination à partir du **15 septembre**, et d’une vaccination complète à partir du **16 octobre** (sauf contre-indications) :
    - professionnels de santé (y compris étudiants en santé) ;
    - personnels des établissements de santé : administratifs… ;
    - professionnels du secteur médico-social : pompiers, aides à domicile…

    <div class="voir-aussi">

    - Consultez la foire aux questions sur la [mise en place du pass sanitaire dans le milieu professionnel](https://travail-emploi.gouv.fr/le-ministere-en-action/coronavirus-covid-19/questions-reponses-par-theme/article/obligation-de-vaccination-ou-de-detenir-un-pass-sanitaire-pour-certaines) sur le site du ministère du Travail.

    - Consultez l’[article 12 de la loi du 5 août 2021 relative à la gestion de la crise sanitaire](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000043909691) qui liste les professions concernées par l’obligation vaccinale.

    </div>

</details>

<details>
    <summary>
        <h2 id="les-voyages-a-l-etranger">
            Les voyages à l’étranger
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
        </h2>
    </summary>

.. question:: Est-ce que le pass sanitaire européen est différent du pass sanitaire français ?
    :level: 3

    Le pass sanitaire européen regroupe les mêmes 3 **preuves sanitaires** que le pass sanitaire français à quelques détails près :

    - un **test de dépistage négatif** : **test PCR** de moins de **72 h** ou **test antigénique** de moins de **48 h** ;
    - un **test de dépistage positif** : **test PCR** ou **test antigénique** daté de **plus de 11 jours** et moins de **6 mois**, appelé [certificat de rétablissement](#comment-obtenir-un-certificat-de-retablissement-avec-qr-code) ;
    - une **attestation de vaccination complète**, soit **14 jours** (*Pfizer*, *Moderna*, *AstraZeneca*) ou **28 jours** (*Janssen*) après la dernière dose nécessaire.

    <div class="conseil conseil-jaune">

    * Ces documents sont valables **à condition qu’ils comportent un QR code**.
    * Les **tests sérologiques** et les **autotests** (même supervisés) ne sont **pas des pass sanitaires européens**.
    * Assurez vous de **vérifier quelle preuve sanitaire est exigée** par votre pays de destination sur [le portail France Diplomatie](https://www.diplomatie.gouv.fr/fr/je-pars-a-l-etranger/).

    </div>


.. question:: Est-ce que ma vaccination suffit pour voyager à l’étranger ?
    :level: 3

    Cela dépend de votre **pays de destination**. Même dans l’**espace européen**, les exigences ne sont pas les mêmes pour chaque pays.

    Une **preuve de vaccination**, même complète, **ne suffit pas toujours**.

    Avant de partir en voyage, **même dans l’espace européen**, nous vous conseillons de vérifier les **conditions d’accès à votre pays de destination** sur [le portail France Diplomatie](https://www.diplomatie.gouv.fr/fr/je-pars-a-l-etranger/).


.. question:: Est-ce que mon certificat de rétablissement suffit pour voyager à l’étranger ?
    :level: 3

    Cela dépend de votre **pays de destination**. Même dans l’**espace européen**, les exigences ne sont pas les mêmes pour chaque pays.

    Avant de partir en voyage, nous vous conseillons de vérifier les **conditions d’accès à votre pays de destination** sur [le portail France Diplomatie](https://www.diplomatie.gouv.fr/fr/je-pars-a-l-etranger/).


.. question:: À quoi sert le pass sanitaire dans l’espace européen ?
    :level: 3

    Le pass sanitaire **facilite les contrôles des preuves sanitaires** aux frontières entre les pays européens. Une attestation vaccinale ou un test de dépistage français peuvent ainsi être lus et authentifiés par l’administration de n’importe quel pays de l’espace européen.

    <div class="conseil conseil-jaune">

    **Vérifiez les règles qui s’appliquent selon votre destination** sur [le portail France Diplomatie](https://www.diplomatie.gouv.fr/fr/je-pars-a-l-etranger/). Chaque pays reste libre d’exiger une attestation de vaccination **ou** un test de dépistage **ou** un certificat de rétablissement.

    </div>

</details>

<details>
    <summary>
        <h2 id="obtenir-son-justificatif-avec-qr-code">
            Obtenir son justificatif avec QR code
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
        </h2>
    </summary>

.. question:: Comment obtenir une attestation de vaccination complète avec un QR code ?
    :level: 3

    Lors de votre rendez-vous de vaccination, le professionnel de santé vous remet **une attestation de vaccination avec un QR code**.

    Il existe **2 autres moyens** d’obtenir une attestation de vaccination complète avec un QR code aux normes européennes :

    * le **télécharger** à partir du [téléservice de l’Assurance maladie](https://attestation-vaccin.ameli.fr/) à l’aide de votre **numéro de sécurité sociale** (si vous en avez un) ;
    * se rendre chez chez un **professionnel de santé** (médecin, pharmacien, infirmier, sage-femme…), muni de votre **carte vitale** (si vous en avez une) afin qu’il vous en édite une nouvelle.

    <div class="conseil conseil-jaune">

    Si vous avez reçu toutes les doses nécessaires, mais que votre attestation indique que **votre vaccination est incomplète**, rendez-vous chez un **professionnel de santé** (médecin, pharmacien, infirmier, sage-femme…) afin qu’il mette à jour votre statut vaccinal et vous édite une nouvelle attestation.

    </div>


.. question:: Comment obtenir un certificat de dépistage avec QR code ?
    :level: 3

    Suite à un test **PCR**, **antigénique** ou un **autotest supervisé par un professionnel de santé**, un courriel (*e-mail*) ou un SMS vous est adressé pour vous inviter à **télécharger le certificat de dépistage** avec QR code sur le [**portail SI-DEP**](https://sidep.gouv.fr/cyberlab/patientviewer.jsp).

    Nous vous conseillons de **le télécharger immédiatement** pour le conserver aussi longtemps que nécessaire.


.. question:: Comment obtenir un certificat de rétablissement avec QR code ?
    :level: 3

    Si vous avez eu la Covid il y a **plus de 11 jours**, alors votre test de dépistage (PCR ou antigénique) positif devient votre **certificat de rétablissement**, pour une **durée de 6 mois** depuis la date du test.

    Vous pouvez le **télécharger** sur le [**portail SI-DEP**](https://sidep.gouv.fr/cyberlab/patientviewer.jsp). Nous vous conseillons de le faire **immédiatement** pour le conserver aussi longtemps que nécessaire.

    <div class="conseil conseil-jaune">

    Si vous aviez fait votre test positif **entre le 10 mars et le 10 mai 2021**, alors vous devrez demander au laboratoire où le test a été effectué qu’il saisisse le dossier dans SI-DEP pour générer le certificat.

    </div>


.. question:: Je rencontre des difficultés techniques sur le portail SI-DEP, que faire ?
    :level: 3

    <div class="voir-aussi">

    - Consultez la [foire au questions du portail SI-DEP](https://sidep.gouv.fr/cyberlab/Customer/FAQ_FR.pdf)

    </div>


.. question:: Comment intégrer mon certificat de rétablissement, test de dépistage ou attestation de vaccination dans mon application TousAntiCovid ?
    :level: 3

    <div class="voir-aussi">

    - Consultez la [page d’aide de l’application TousAntiCovid](https://tousanticovid.stonly.com/kb/fr/mon-carnet-51371)

    </div>


.. question:: Je n’ai pas l’application TousAntiCovid, comment présenter mon pass sanitaire ?
    :level: 3

    Vous pouvez présenter votre pass sanitaire (attestation de vaccination, certificat de rétablissement ou de dépistage) au **format papier ou numérique (PDF)** sans passer par l’application TousAntiCovid.


.. question:: J’ai été vacciné à l’étranger avec un vaccin reconnu en France, comment obtenir un QR code valable en France ?
    :level: 3

    Pour que votre vaccination soit reconnue comme pass sanitaire en France il faut : être complètement vacciné(e) avec un vaccin reconnu en France (ou équivalent) et obtenir un QR code.
    
    #### Vaccins reconnus en France

    Les vaccins reconnus par l’Agence européenne du médicament sont : **Pfizer**, **Moderna**, **AstraZeneca** et **Janssen**.

    Les vaccins **Covishield**, **R-Covi** et **Fiocruz** sont considérés équivalents à AstraZeneca.


    #### Pour justifier d’une vaccination complète

    * Si vous avez reçu **2 doses** de vaccin à l’étranger, alors votre vaccination est considérée comme **complète**.

    * Si vous n’avez reçu qu’**une seule dose** de vaccin à l’étranger, vous devrez recevoir une **2<sup>e</sup>** injection de vaccin à **ARNm** (*Pfizer* ou *Moderna*) pour valider votre vaccination en France.


    #### Pour obtenir un QR code (pass sanitaire)

    L’administration a mis en place des **démarches en ligne** permettant de demander à **convertir votre certificat de vaccination étranger** en pass sanitaire francais :

    * si vous êtes **français** ou ayant droit de français, âgé de plus de 18 ans, [rendez-vous sur cette démarche en ligne](https://www.demarches-simplifiees.fr/commencer/passe-sanitaire-francais-de-l-etranger) ;

    * si vous êtes **étudiant étranger** inscrit dans un établissement d’enseignement supérieur français pour la rentrée 2021-2022 et que vous possédez un visa d’études, [rendez-vous sur cette démarche en ligne](https://www.demarches-simplifiees.fr/commencer/passe-sanitaire-etudiants) ;

    * si vous êtes **touriste** de nationalité extra-européenne, âgé de plus de 18 ans, [rendez-vous sur cette démarche en ligne](https://www.demarches-simplifiees.fr/commencer/passe-sanitaire-etrangers).

    En attendant, un **test de dépistage négatif de moins de 72 h** pourra faire office de pass sanitaire.

    <div class="conseil conseil-jaune">

    Attention, les tests de dépistage sont gratuits pour les assurés sociaux français ou européens mais **payants** pour les personnes qui ne bénéficient pas de cette couverture sociale.

    </div>

    <div class="voir-aussi">

    - Pour savoir où faire un test (laboratoire, pharmacie…), consultez l’[annuaire des lieux de dépistage sur sante.fr](https://www.sante.fr/cf/centres-depistage-covid.html).

    - Pour en savoir plus sur les différents tests, consultez notre page « [Les tests de dépistage](/tests-de-depistage.html) »

    </div>


.. question:: J’ai été vacciné à l’étranger avec un vaccin non reconnu en France (Sinovac, Sinopharm), comment faire valoir ma vaccination en France et obtenir un pass sanitaire ?
    :level: 3

    Les vaccins **Sinopharm et Sinovac** sont reconnus par l’Organisation mondiale de la santé (OMS) mais pas par l’Agence européenne du médicament.

    Pour faire valoir votre vaccination en France et obtenir un pass sanitaire il faut :

    * recevoir **2 doses** de vaccin à ARNm (**Pfizer** ou **Moderna**), si vous avez reçu une dose de Sinopharm ou Sinovac ;

    * recevoir **1 dose** de vaccin à ARNm (**Pfizer** ou **Moderna**), si vous avez reçu 2 doses de Sinopharm ou Sinovac.

    Dans les 2 cas, l’injection doit se faire au moins **4 semaines** après la dernière injection de Sinopharm ou Sinovac.

    La vaccination sera considérée comme complète **7 jours** après votre dernière injection de vaccin à ARNm, et le **QR code** de l’attestation de vaccination sera alors valable comme **pass sanitaire**.

    En attendant, un **test de dépistage négatif de moins de 72 h** pourra faire office de pass sanitaire.

    <div class="conseil conseil-jaune">

    Attention, les tests de dépistage sont gratuits pour les assurés sociaux français ou européens mais **payants** pour les personnes qui ne bénéficient pas de cette couverture sociale.

    </div>

    <div class="voir-aussi">

    - Pour savoir où faire un test (laboratoire, pharmacie…), consultez l’[annuaire des lieux de dépistage sur sante.fr](https://www.sante.fr/cf/centres-depistage-covid.html).

    - Pour en savoir plus sur les différents tests, consultez notre page « [Les tests de dépistage](/tests-de-depistage.html) »

    </div>

</details>
</div>
