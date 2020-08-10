# Contenus

Les dossiers listés ci-dessus contiennent l’intégralité des contenus du site. Vous pouvez proposer des modifications en éditant directement ces fichiers, elles seront intégrées lors du prochain déploiement.

## Description

### Questions

Les fichiers dans le dossier [`questions/`](questions/) correspondent aux titres, libellés et aides relatifs aux question. Vous devez maintenir les caractères `<!---->` au début du fichier s’ils existent.

Afin de pouvoir effectuer le formulaire pour soi-même et/ou pour un proche, les différentes versions du texte sont dupliqués et séparés par `---`, il faut conserver cette séparation.

### Réponses

Les fichiers dans le dossier [`réponses/`](réponses/) correspondent à l’affichage des réponses saisies par l’utilisateur·ice.

### Statuts

Les fichiers dans le dossier [`statuts/`](statuts/) correspondent aux différents statuts possible suite au remplissage du questionnaire.

### Conseils

Les fichiers dans le dossier [`conseils/`](conseils/) correspondent aux différents conseils prodigués par le questionnaire.

### Meta

Les fichiers dans le dossier [`meta/`](meta/) correspondent aux informations additionnelles comme la page d’introduction ou le pied de page par exemple.


## Algorithme

Les règles d’affichage des conseils en fonction des réponses sont décrites ci-dessous :

### Cas nominal


#### Statut

* [statut_personne_fragile.md](statuts/statut_personne_fragile.md) (orange) si la personne présente un [Risque](#risque)
* [statut_foyer_fragile.md](statuts/statut_foyer_fragile.md) (jaune) si la case [Foyer](#foyer) fragile est cochée
* [statut_peu_de_risques.md](statuts/statut_peu_de_risques.md) (vert) par défaut


#### Nom (uniquement pour un proche)

[Titre](questions/question_nom_titre.md)

Aide : [aide](questions/question_nom_aide.md)

Question : [libellé](questions/question_nom_libellé.md)


#### Localisation

[Titre](questions/question_résidence_titre.md)

Question : [libellé](questions/question_résidence_libellé.md)

Réponse : [réponse_département.md](réponses/réponse_département.md)

Conseils :

1. [conseils circulation faible](conseils/conseils_département_circulation_faible.md) ou [conseils circulation élevée](conseils/conseils_département_circulation_élevée.md) selon le taux d’[Incidence](#incidence) du département
2. [conseils par défaut](conseils/conseils_département_défaut.md)


#### Activité

[Titre](questions/question_activité_pro_titre.md)

Question : [libellé](questions/question_activité_pro_libellé.md)

Sous-question (contact public) : [libellé](questions/question_activité_pro_public_libellé.md)

Sous-question (libéral) : [libellé](questions/question_activité_pro_libéral_libellé.md)

Sous-question (domaine santé) : [libellé](questions/question_activité_pro_santé_libellé.md), [aide](questions/question_activité_pro_santé_aide.md)

Réponse :

* [réponse_activité_pro.md](réponses/réponse_activité_pro.md) si case cochée

Conseils :

* [conseils_activité_pro.md](conseils/conseils_activité_pro.md) si case cochée
* [conseils_activité_pro_public.md](conseils/conseils_activité_pro_public.md) si case cochée
* [conseils_activité_pro_santé.md](conseils/conseils_activité_pro_santé.md) si case cochée
* [conseils_activité_pro_arrêt.md](conseils/conseils_activité_pro_arrêt.md) si personne à [Risque](#risque)
* [conseils_activité_pro_libéral.md](conseils/conseils_activité_pro_libéral.md) si case cochée
* [conseils_activité_pro_infos.md](conseils/conseils_activité_pro_infos.md) si case activité cochée et/ou case public cochée (mais pas la case santé)


#### Foyer

[Titre](questions/question_foyer_titre.md)

Question (enfants) : [libellé](questions/question_foyer_enfants_libellé.md)

Question (fragile) : [libellé](questions/question_foyer_fragile_libellé.md), [aide](questions/question_foyer_fragile_aide.md)

Réponse :

* [réponse_foyer_enfants.md](réponses/réponse_foyer_enfants.md) si case cochée
* [réponse_foyer_fragile.md](réponses/réponse_foyer_fragile.md) si case cochée
* [réponse_foyer_enfants_fragile.md](réponses/réponse_foyer_enfants_fragile.md) si deux cases cochées

Conseils :

Si les cases enfants *et* fragile sont cochées :

* [conseils_foyer_fragile.md](conseils/conseils_foyer_fragile.md)
* [conseils_maladie_chronique_info.md](conseils/conseils_maladie_chronique_info.md)
* [conseils_foyer_enfants_fragile.md](conseils/conseils_foyer_enfants_fragile.md)
* [conseils_foyer_enfants_info.md](conseils/conseils_foyer_enfants_infos.md)

Si seule la case enfants est cochée :

* [conseils_foyer_enfants.md](conseils/conseils_foyer_enfants.md)
* [conseils_foyer_enfant_garde.md](conseils/conseils_foyer_enfant_garde.md)
* [conseils_foyer_enfants_vaccins.md](conseils/conseils_foyer_enfants_vaccins.md)

Si seule la case fragile est cochée :

* [conseils_foyer_fragile.md](conseils/conseils_foyer_fragile.md)
* [conseils_foyer_fragile_accueil_enfant.md](conseils/conseils_foyer_fragile_accueil_enfant.md)
* [conseils_maladie_chronique_info.md](conseils/conseils_maladie_chronique_info.md)


#### Caractéristiques et antécédents

[Titre caractéristiques](questions/question_caractéristiques_titre.md)

Aide : [aide](questions/question_caractéristiques_aide.md)

Question (âge) : [libellé](questions/question_caractéristiques_âge_libellé.md)

Question (taille) : [libellé](questions/question_caractéristiques_taille_libellé.md)

Question (poids) : [libellé](questions/question_caractéristiques_poids_libellé.md)

Question (grossesse) : [libellé](questions/question_caractéristiques_grossesse_libellé.md)


[Titre antécédents](questions/question_antécédents_titre.md)

Question (cardio) : [libellé](questions/question_antécédents_cardio_libellé.md), [aide](questions/question_antécédents_cardio_aide.md)

Question (diabète) : [libellé](questions/question_antécédents_diabète_libellé.md)

Question (respi) : [libellé](questions/question_antécédents_respi_libellé.md), [aide](questions/question_antécédents_respi_aide.md)

Question (dialyse) : [libellé](questions/question_antécédents_dialyse_libellé.md)

Question (cancer) : [libellé](questions/question_antécédents_cancer_libellé.md)

Question (immunodépression) : [libellé](questions/question_antécédents_immunodépression_libellé.md), [aide](questions/question_antécédents_immunodépression_aide.md)

Question (cirrhose) : [libellé](questions/question_antécédents_cirrhose_libellé.md)

Question (drépanocytose) : [libellé](questions/question_antécédents_drépanocytose_libellé.md)

Question (chronique autre) : [libellé](questions/question_antécédents_chronique_autre_libellé.md)

Réponse :

* [réponse_caractéristiques_à_risques.md](réponses/réponse_caractéristiques_à_risques.md) si âge > 65 ou grossesse 3e trimestre ou IMC > 30
* [réponse_antécédents.md](réponses/réponse_antécédents.md) si [Antécédents](#antécédents) ou antécédents chroniques autres
* [réponse_symptômes_actuels_reconnus.md](réponses/réponse_symptômes_actuels_reconnus.md) si [Antécédents](#antécédents) mais pas antécédents chroniques autres

Conseils :

Si âge > 65 ou grossesse 3e trimestre ou IMC > 30 ou [Antécédents](#antécédents) ou antécédents chroniques autres :

* [conseils_caractéristiques_antécédents.md](conseils/conseils_caractéristiques_antécédents.md) si pas d’activité pro
* [conseils_caractéristiques_antécédents_activité_pro.md](conseils/conseils_caractéristiques_antécédents.md) si activité pro

* [conseils_caractéristiques_antécédents_info_risque.md](conseils/conseils_caractéristiques_antécédents_info_risque.md) si [Antécédents](#antécédents) ou maladie chronique autre.

* [conseils_caractéristiques_antécédents_femme_enceinte.md](conseils/conseils_caractéristiques_antécédents_femme_enceinte.md) si grossesse 3e trimestre

Si case antécédents chroniques autres cochée :

* [conseils_antécédents_chroniques_autres.md](conseils/conseils_antécédents_chroniques_autres.md)
* [conseils_maladie_chronique_info.md](conseils/conseils_maladie_chronique_info.md)

#### Conseils d’ordre général

1. [conseils_généraux.md](conseils/conseils_généraux.md)
2. [conseils_généraux_info.md](conseils/conseils_généraux_info.md)


### Cas particuliers

#### Symptômes actuels

[Titre](questions/question_symptômes_actuels_titre.md)

Question : [libellé](questions/question_symptômes_actuels_libellé.md), [aide](questions/question_symptômes_aide.md)

Sous-question (température) : [libellé](questions/question_symptômes_actuels_température_libellé.md)

Sous-question (température inconnue) : [libellé](questions/question_symptômes_actuels_température_inconnue_libellé.md)

Sous-question (toux) : [libellé](questions/question_symptômes_actuels_toux_libellé.md)

Sous-question (odorat) : [libellé](questions/question_symptômes_actuels_odorat_libellé.md)

Sous-question (douleurs) : [libellé](questions/question_symptômes_actuels_douleurs_libellé.md), [aide](questions/question_symptômes_actuels_douleurs_aide.md)

Sous-question (diarrhée) : [libellé](questions/question_symptômes_actuels_diarrhée_libellé.md)

Sous-question (fatigue) : [libellé](questions/question_symptômes_actuels_fatigue_libellé.md)

Sous-question (alimentation) : [libellé](questions/question_symptômes_actuels_alimentation_libellé.md)

Sous-question (souffle) : [libellé](questions/question_symptômes_actuels_souffle_libellé.md)

Sous-question (autre) : [libellé](questions/question_symptômes_actuels_autre_libellé.md)

Cas particulier : si [Symptôme actuel autre](#symptôme-actuel-autre) (`Sous-question (autre)` est cochée), la personne continue vers les questions relatives aux symptômes passés (cas nominal).

Statut : [statut_symptomatique.md](statuts/statut_symptomatique.md) (orange) ou [statut_symptomatique_urgent.md](statuts/statut_symptomatique_urgent.md) (orange) si [Gravité majeure](#gravité-majeure)

Réponse :

* [réponse_antécédents.md](réponses/réponse_antécédents.md) si [Antécédents](#antécédents) ou antécédents chroniques autres
* [réponse_caractéristiques_à_risques.md](réponses/réponse_caractéristiques_à_risques.md) si âge > 65 ou grossesse 3e trimestre ou IMC > 30
* [réponse_symptômes_actuels.md](réponses/réponse_symptômes_actuels.md) si pas [Symptôme actuel autre](#symptôme-actuel-autre)

Conseils :

1. Plusieurs options :
    * [conseils_symptômes_actuels_gravité4.md](conseils/conseils_symptômes_actuels_gravité4.md) si [Gravité majeure](#gravité-majeure)
    * ou [conseils_symptômes_actuels_gravité3.md](conseils/conseils_symptômes_actuels_gravité3.md) si (température et toux, personne à [Risque](#risque) mais *un seul* facteur de [gravité mineure](#gravité-mineure)) OU (pas de température et (toux ou douleurs ou odorat) et personne à [Risque](#risque)) OU (avec fièvre ou (sans fièvre et avec (diarrhée ou (toux et douleurs) ou (toux et anosmie)) et (personne à [Risque](#risque) *sans* facteur de [gravité mineure](#gravité-mineure) OU âge supérieur à 50 ans OU *un* ou *plusieurs* facteur de [gravité mineure](#gravité-mineure)))
    * ou [conseils_symptômes_actuels_gravité2.md](conseils/conseils_symptômes_actuels_gravité2.md) si (température et toux, personne à [Risque](#risque) et *plusieurs* facteur de [gravité mineure](#gravité-mineure)) OU (avec fièvre ou (sans fièvre et avec (diarrhée ou (toux et douleurs) ou (toux et anosmie)) et personne à [Risque](#risque) et *plusieurs* facteur de [gravité mineure](#gravité-mineure))
    * ou [conseils_symptômes_actuels_gravité1.md](conseils/conseils_symptômes_actuels_gravité1.md) par défaut
2. [conseils_symptômes_actuels_autosuivi.md](conseils/conseils_symptômes_actuels_autosuivi.md), [bouton](conseils/conseils_symptômes_actuels_autosuivi_bouton.md)
3. [conseils_isolement.md](conseils/conseils_isolement.md)
4. [conseils_cartographie_dépistage.md](conseils/conseils_cartographie_dépistage.md)
5. [conseils_symptômes_défaut.md](conseils/conseils_symptômes_défaut.md)
6. [Conseils d’ordre général](#conseils-dordre-général)

Cas particulier : si [Symptôme actuel autre](#symptôme-actuel-autre), aucun de ces conseils n’est affiché.

Note : par défaut, lorsqu’un symptôme actuel est déclaré, la personne est redirigée ensuite vers le [suivi médecin](#suivi-conseils).


#### Symptômes passés

[Titre](questions/question_symptômes_passés_titre.md)

Question : [libellé](questions/question_symptômes_passés_libellé.md), [aide](questions/question_symptômes_aide.md)

Statut : [statut_risque_élevé_contamination.md](statuts/statut_risque_élevé_contamination.md) (orange)

Conseils :

1. [conseils_symptômes_passés_sans_risques.md](conseils/conseils_symptômes_passés_sans_risques.md) + [conseils_symptômes_passés_sans_risques_info.md](conseils/conseils_symptômes_passés_sans_risques_info.md) ou [conseils_symptômes_passés_avec_risques.md](conseils/conseils_symptômes_passés_avec_risques.md) + [conseils_symptômes_passés_avec_risques_info.md](conseils/conseils_symptômes_passés_avec_risques_info.md) selon la valeur de [Risque](#risque) (ou case foyer à risque cochée)
2. [conseils_symptômes_défaut.md](conseils/conseils_symptômes_défaut.md)
3. [conseils_isolement.md](conseils/conseils_isolement.md)
4. [conseils_cartographie_dépistage.md](conseils/conseils_cartographie_dépistage.md)
5. [Localisation](#localisation)
6. [conseils_foyer_fragile_suivi.md](conseils/conseils_foyer_fragile_suivi.md)
7. [Conseils d’ordre général](#conseils-dordre-général)


#### Contact à risque

[Titre](questions/question_symptômes_contact_à_risque_titre.md)

Question : [libellé](questions/question_symptômes_contact_à_risque_libellé.md), [aide](questions/question_symptômes_contact_à_risque_aide.md)

Sous-question (même lieu de vie) : [libellé](questions/question_symptômes_contact_à_risque_même_lieu_de_vie_libellé.md)

Sous-question (contact direct) : [libellé](questions/question_symptômes_contact_à_risque_contact_direct_libellé.md), [aide](questions/question_symptômes_contact_à_risque_contact_direct_aide.md)

Sous-question (actes) : [libellé](questions/question_symptômes_contact_à_risque_actes_libellé.md), [aide](questions/question_symptômes_contact_à_risque_actes_aide.md)

Sous-question (espace confiné) : [libellé](questions/question_symptômes_contact_à_risque_espace_confiné_libellé.md)

Sous-question (même classe) : [libellé](questions/question_symptômes_contact_à_risque_même_classe_libellé.md)

Sous-question (stop covid) : [libellé](questions/question_symptômes_contact_à_risque_stop_covid_libellé.md)

Sous-question (autre) : [libellé](questions/question_symptômes_contact_à_risque_autre_libellé.md)

Statut : [statut_risque_élevé_contamination.md](statuts/statut_risque_élevé_contamination.md) (orange) ou [statut_peu_de_risques.md](statuts/statut_peu_de_risques.md) (vert) si [Contact à risque autre](#contact-à-risque-autre)

Conseils :

1. [conseils_contact_à_risque.md](conseils/conseils_contact_à_risque.md) ou [conseils_contact_à_risque_autre.md](conseils/conseils_contact_à_risque_autre.md) si [Contact à risque autre](#contact-à-risque-autre)
2. [conseils_contact_à_risque_info.md](conseils/conseils_contact_à_risque_info.md)
3. [conseils_cartographie_dépistage.md](conseils/conseils_cartographie_dépistage.md)
4. [Localisation](#localisation)
5. [conseils_foyer_fragile_suivi.md](conseils/conseils_foyer_fragile_suivi.md)
6. [Conseils d’ordre général](#conseils-dordre-général)


### Auto-suivi

#### Suivi médecin

[Titre](questions/question_suivi_médecin_titre.md)

Question : [libellé](questions/question_suivi_médecin_libellé.md)

Algorithme :

* Si la personne répond « Non » au consentement médecin, elle est redirigée vers les conseils
* Si elle répond « Oui » au consentement médecin, elle est redirigée vers le [Suivi date](#suivi-date)


#### Suivi date

[Titre](questions/question_suivi_date_titre.md)

Question : [libellé](questions/question_suivi_date_libellé.md)


#### Suivi symptômes

[Titre](questions/question_suivi_symptômes_titre.md)

Question : [libellé](questions/question_suivi_symptômes_libellé.md)

Sous-question (essoufflement) : [libellé](questions/question_suivi_symptômes_essoufflement_libellé.md)

Sous-question (état général) : [libellé](questions/question_suivi_symptômes_état_général_libellé.md)

Sous-question (alimentation et hydratation) : [libellé](questions/question_suivi_symptômes_alimentation_hydratation_libellé.md)

Sous-question (état psychologique) : [libellé](questions/question_suivi_symptômes_état_psychologique_libellé.md)

Sous-question (fièvre) : [libellé](questions/question_suivi_symptômes_fièvre_libellé.md)

Sous-question (diarrhée ou vomissements) : [libellé](questions/question_suivi_symptômes_diarrhée_vomissements_libellé.md)

Sous-question (confusion) [pour un proche seulement] : [libellé](questions/question_suivi_symptômes_confusion_libellé.md)

Sous-question (toux) [optionnelle] : [libellé](questions/question_suivi_symptômes_toux_libellé.md)

Sous-question (maux de tête) [optionnelle] : [libellé](questions/question_suivi_symptômes_maux_de_tête_libellé.md), [aide](questions/question_suivi_symptômes_maux_de_tête_aide.md)


#### Suivi conseils

Dans ce cas particulier, les [conseils relatifs aux symptômes actuels](#symptomes-actuels) ne sont pas affichés. Les conseils suivants s’affichent :

* Si au moins une réponse « Beaucoup moins bien » alors [suivi_gravité_3.md](suivi/suivi_gravité_3.md)
* Si au moins une réponse « Un peu moins bien » OU « Oui » à `alimentation et hydratation` OU « Oui » à `maux de tête` alors [suivi_gravité_2.md](suivi/suivi_gravité_2.md)
* Si (« Oui » à `fièvre`) OU (« Oui » à `diarrhée ou vomissements`) OU (« Oui » à `toux`) alors [suivi_gravité_1.md](suivi/suivi_gravité_1.md)
* Si (que des réponses « Mieux » OU « Stable ») ET (« Non » à `alimentation et hydratation`) ET (« Non » à `fièvre`) ET (« Non » à `diarrhée ou vomissements`) alors [suivi_gravité_0.md](suivi/suivi_gravité_0.md)


#### Suivi plus d’infos

* Si réponse « Oui » à `état psychologique` on affiche en plus [suivi_psy_2.md](suivi/suivi_psy_2.md) si gravité > 0 OU [suivi_psy_1.md](suivi/suivi_psy_1.md) si gravité = 0.
* [conseils_autosuivi_régularité.md](conseils/conseils_autosuivi_régularité.md) s’affiche lorsque le suivi est activé (date de début + une entrée saisie).
* [conseils_autosuivi_historique.md](conseils/conseils_autosuivi_historique.md) s’affiche lorsque le suivi est activé (date de début + une entrée saisie).


#### Suivi déconfinement

La sortie de confinement est proposée si toutes les conditions suivantes sont réunies :

* le début des symptômes était il y a 8 jours (ou 10 si personne à [Risque](#risque)) ;
* il y a eu (au moins) une entrée dans le suivi par 24h ces dernières 48h ;
* il n’y a pas eu de fièvre ni d’essoufflement ces dernières 48h.

Dans ce cas particulier, le fichier [suivi_déconfinement.md](suivi/suivi_déconfinement.md) est affiché à la place du [statut de suivi](#suivi-conseils) + [infos](#suivi-plus-dinfos) ou des [conseils relatifs aux symptômes actuels](#symptomes-actuels).


### Critères

#### Incidence

L’incidence d’un département est déterminée en fonction du [Taux d’incidence de l'épidémie de COVID-19](https://www.data.gouv.fr/fr/datasets/taux-dincidence-de-lepidemie-de-covid-19/) (fichier `sp-pe-tb-quot-dep-2020-08-07-19h15.csv`, attention il est cumulatif au fil du temps). La somme de ce taux sur les 7 derniers jours en cumulé est utilisée.


#### Antécédents

Est définie comme étant une personne à antécédents celle qui vérifie l’une de ces conditions :

* cardio
* diabète
* maladie respiratoire
* dialyse
* cancer
* immuno-dépression
* cirrhose
* drépanocytose


#### Risque

Est définie comme étant une personne à risque celle qui vérifie l’une de ces conditions :

* a plus de 65 ans
* est au 3e trimestre de sa grossesse
* a un IMC > 30
* a des [Antécédents](#antécédents)


#### Gravité majeure

Est définie comme étant une personne à gravité majeure celle qui vérifie l’une de ces conditions :

* a une gêne respiratoire (essoufflement)
* a des difficulté importantes pour s’alimenter ou boire depuis plus de 24 heures

#### Gravité mineure

Est définie comme étant une personne à gravité mineure celle qui vérifie l’une de ces conditions :

* a une température < 35,5°C ou ≥ 39°C (ou ne sait pas)
* a une fatigue inhabituelle


#### Symptôme actuel autre

Cas particulier lorsque la personne a coché la case « Je n’ai aucun de ces symptômes » pour ses symptômes actuels.


#### Contact à risque autre

Cas particulier lorsque la personne a coché la case « Je n’étais dans aucune de ces situations » pour ses contacts récents.
