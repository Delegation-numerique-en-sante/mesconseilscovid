# Contenus

Les dossiers listés ci-dessus contiennent l’intégralité des contenus du site. Vous pouvez proposer des modifications en éditant directement ces fichiers, elles seront intégrées lors du prochain déploiement.

## Description

### Questions

Les fichiers dans le dossier [`questions/`](questions/) correspondent aux titres, libellés et aides relatifs aux question. Vous devez maintenir les caractères `<!---->` au début du fichier s’ils existent.

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


#### Localisation

[Titre](questions/question_résidence_titre.md)

Question : [libellé](questions/question_résidence_libellé.md)

Réponse : [réponse_département.md](réponses/réponse_département.md)

Conseils :

1. [conseils rouge](conseils/conseils_département_rouge.md) ou [conseils vert](conseils/conseils_département_vert.md) selon la [Couleur](#couleur) du département
2. [conseils par défaut](conseils/conseils_département_défaut.md).


#### Activité

[Titre](questions/question_activité_pro_titre.md)

Question : [libellé](questions/question_activité_pro_libellé.md)

Sous-question (contact public) : [libellé](questions/question_activité_pro_public_libellé.md)

Sous-question (domaine santé) : [libellé](questions/question_activité_pro_santé_libellé.md), [aide](questions/question_activité_pro_santé_aide.md)

Réponse : 

* [réponse_activité_pro.md](réponses/réponse_activité_pro.md) si case cochée
* [réponse_activité_pro_public.md](réponses/réponse_activité_pro_public.md) si case cochée
* [réponse_activité_pro_santé.md](réponses/réponse_activité_pro_santé.md) si case cochée
* [réponse_activité_pro_public_santé.md](réponses/réponse_activité_pro_public_santé.md) si deux cases cochées

Conseils :

* [conseils_activité_pro.md](conseils/conseils_activité_pro.md) si case cochée
* [conseils_activité_pro_public.md](conseils/conseils_activité_pro_public.md) si case cochée
* [conseils_activité_pro_santé.md](conseils/conseils_activité_pro_santé.md) si case cochée
* [conseils_activité_pro_infos.md](conseils/conseils_activité_pro_infos.md) si case activité cochée et/ou case public cochée (mais pas la case santé)


#### Foyer

[Titre](questions/question_activité_pro_titre.md)

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
* [conseils_foyer_enfant_garde.md](conseils/conseils_foyer_enfant_garde.md)
* [conseils_foyer_enfants_vaccins.md](conseils/conseils_foyer_enfants_vaccins.md)

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

Question (âge) : [libellé](questions/question_caractéristiques_âge_libellé.md)

Question (grossesse) : [libellé](questions/question_caractéristiques_grossesse_libellé.md)

Question (taille) : [libellé](questions/question_caractéristiques_taille_libellé.md), [aide](questions/question_caractéristiques_taille_poids_aide.md)

Question (poids) : [libellé](questions/question_caractéristiques_poids_libellé.md), [aide](questions/question_caractéristiques_taille_poids_aide.md)


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

Conseils :

Si âge > 65 ou grossesse 3e trimestre ou IMC > 30 ou [Antécédents](#antécédents) ou antécédents chroniques autres :

* [conseils_caractéristiques_antécédents.md](conseils/conseils_caractéristiques_antécédents.md) si pas d’activité pro
* [conseils_caractéristiques_antécédents_activité_pro.md](conseils/conseils_caractéristiques_antécédents.md) si activité pro

* [conseils_caractéristiques_antécédents_info_risque.md](conseils/conseils_caractéristiques_antécédents_info_risque.md) si [Antécédents](#antécédents) ou maladie chronique autre.
* [conseils_caractéristiques_antécédents_info.md](conseils/conseils_caractéristiques_antécédents_info.md) sinon

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

Statut : [statut_risque_élevé_contamination.md](statuts/statut_risque_élevé_contamination.md) (rouge)

Conseils :

1. [conseils_symptômes_actuels.md](conseils/conseils_symptômes_actuels.md)
2. [conseils_cartographie_dépistage.md](conseils/conseils_cartographie_dépistage.md)
3. [Conseils d’ordre général](#conseils-dordre-général)


#### Symptômes passés

[Titre](questions/question_symptômes_passés_titre.md)

Question : [libellé](questions/question_symptômes_passés_libellé.md), [aide](questions/question_symptômes_aide.md)

Statut : [statut_risque_élevé_contamination.md](statuts/statut_risque_élevé_contamination.md) (rouge)

Conseils :

1. [conseils_symptômes_passés_sans_risques.md](conseils/conseils_symptômes_passés_sans_risques.md) + [conseils_symptômes_passés_sans_risques_info.md](conseils/conseils_symptômes_passés_sans_risques_info.md) ou [conseils_symptômes_passés_avec_risques.md](conseils/conseils_symptômes_passés_avec_risques.md) + [conseils_symptômes_passés_avec_risques_info.md](conseils/conseils_symptômes_passés_avec_risques_info.md) selon la valeur de [Risque](#risque) (ou case foyer à risque cochée)
2. [conseils_symptômes_passés_défaut.md](conseils/conseils_symptômes_passés_défaut.md)
3. [conseils_cartographie_dépistage.md](conseils/conseils_cartographie_dépistage.md)
4. [Localisation](#localisation)
6. [conseils_foyer_fragile_suivi.md](conseils/conseils_foyer_fragile_suivi.md)
7. [conseils_foyer_enfants_fragile_suivi.md](conseils/conseils_foyer_enfants_fragile_suivi.md)
8. [conseils_antécédents_chroniques_autres.md](conseils/conseils_antécédents_chroniques_autres.md)
9. [Conseils d’ordre général](#conseils-dordre-général)


#### Contact à risque

[Titre](questions/question_symptômes_contact_à_risque_titre.md)

Question : [libellé](questions/question_symptômes_contact_à_risque_libellé.md), [aide](questions/question_symptômes_contact_à_risque_aide.md)

Sous-question (même lieu de vie) : [libellé](questions/question_symptômes_contact_à_risque_même_lieu_de_vie_libellé.md)

Sous-question (contact direct) : [libellé](questions/question_symptômes_contact_à_risque_contact_direct_libellé.md), [aide](questions/question_symptômes_contact_à_risque_contact_direct_aide.md)

Sous-question (actes) : [libellé](questions/question_symptômes_contact_à_risque_actes_libellé.md), [aide](questions/question_symptômes_contact_à_risque_actes_aide.md)

Sous-question (espace confiné) : [libellé](questions/question_symptômes_contact_à_risque_espace_confiné_libellé.md)

Sous-question (même classe) : [libellé](questions/question_symptômes_contact_à_risque_même_classe_libellé.md)

Statut : [statut_risque_élevé_contamination.md](statuts/statut_risque_élevé_contamination.md) (rouge)

Conseils :

1. [conseils_contact_à_risque.md](conseils/conseils_contact_à_risque.md) + [conseils_contact_à_risque_info.md](conseils/conseils_contact_à_risque_info.md)
2. [conseils_cartographie_dépistage.md](conseils/conseils_cartographie_dépistage.md)
3. [Localisation](#localisation)
4. [conseils_foyer_fragile_suivi.md](conseils/conseils_foyer_fragile_suivi.md)
5. [conseils_foyer_enfants_fragile_suivi.md](conseils/conseils_foyer_enfants_fragile_suivi.md)
6. [conseils_antécédents_chroniques_autres.md](conseils/conseils_antécédents_chroniques_autres.md)
7. [Conseils d’ordre général](#conseils-dordre-général)


### Critères

#### Couleur

La couleur d’un département (`rouge` ou `verte` si on a les données) est déterminée en fonction de l’[Indicateurs d’activité épidémique vert/rouge](https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/) (fichier `donnees-carte-synthese-tricolore.json`, attention il est cumulatif au fil du temps).

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
* a des antécédents chroniques autres

