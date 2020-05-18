# Contenus

Les fichiers listés ci-dessus contiennent l’intégralité des contenus du site. Vous pouvez proposer des modifications en éditant directement ces fichiers, elles seront intégrées lors du prochain déploiement.

## Intitulés des questions

Les fichiers comportant un préfixe `question_` correspondent aux titres, libellés et aides relatifs aux question. Vous devez maintenir les caractères `<!---->` au début du fichier s’ils existent.

## Conseils personnalisés

Les fichiers comportant le préfixe `conseils_` correspondent aux différentes réponses possibles du questionnaire.

## Informations additionnelles

Les fichiers comportant le préfixe `meta_` correspondent aux informations additionnelles comme la page d’introduction ou le pied de page par exemple.


## Algorithme

### Cas nominal


#### Statut

* [statut_personne_fragile.md](statut_personne_fragile.md) (orange) si la personne présente un [Risque](#risque)
* [statut_foyer_fragile.md](statut_foyer_fragile.md) (jaune) si la case [Foyer](#foyer) fragile est cochée
* [statut_peu_de_risques.md](statut_peu_de_risques.md) (vert) par défaut


#### Localisation

[Titre](question_résidence_titre.md)

Question : [libellé](question_résidence_libellé.md)

Réponse : [réponse_département.md](réponse_département.md)

Conseils :

1. [conseils rouge](conseils_département_rouge.md) ou [conseils vert](conseils_département_vert.md) selon la [Couleur](#couleur) du département
2. [conseils par défaut](conseils_département_défaut.md).


#### Activité

[Titre](question_activité_pro_titre.md)

Question : [libellé](question_activité_pro_libellé.md)

Sous-question (contact public) : [libellé](question_activité_pro_public_libellé.md)

Sous-question (domaine santé) : [libellé](question_activité_pro_santé_libellé.md), [aide](question_activité_pro_santé_aide.md)

Réponse : 

* [réponse_activité_pro.md](réponse_activité_pro.md) si case cochée
* [réponse_activité_pro_public.md](réponse_activité_pro_public.md) si case cochée
* [réponse_activité_pro_santé.md](réponse_activité_pro_santé.md) si case cochée
* [réponse_activité_pro_public_santé.md](réponse_activité_pro_public_santé.md) si deux cases cochées

Conseils :

* [conseils_activité_pro.md](conseils_activité_pro.md) si case cochée
* [conseils_activité_pro_public.md](conseils_activité_pro_public.md) si case cochée
* [conseils_activité_pro_santé.md](conseils_activité_pro_santé.md) si case cochée
* [conseils_activité_pro_infos.md](conseils_activité_pro_infos.md) si case activité cochée et/ou case public cochée (mais pas la case santé)


#### Foyer

[Titre](question_activité_pro_titre.md)

Question (enfants) : [libellé](question_foyer_enfants_libellé.md)

Question (fragile) : [libellé](question_foyer_fragile_libellé.md), [aide](question_foyer_fragile_aide.md)

Réponse : 

* [réponse_foyer_enfants.md](réponse_foyer_enfants.md) si case cochée
* [réponse_foyer_fragile.md](réponse_foyer_fragile.md) si case cochée
* [réponse_foyer_enfants_fragile.md](réponse_foyer_enfants_fragile.md) si deux cases cochées

Conseils :

Si les cases enfants *et* fragile sont cochées :

* [conseils_foyer_enfants_fragile.md](conseils_foyer_enfants_fragile.md)
* [conseils_foyer_enfants_fragile_suivi.md](conseils_foyer_enfants_fragile_suivi.md)
* [conseils_prescription_masques.md](conseils_prescription_masques.md)

Si seule la case enfants est cochée :

* [conseils_foyer_enfants.md](conseils_foyer_enfants.md)
* [conseils_foyer_enfant_garde.md](conseils_foyer_enfant_garde.md)
* [conseils_foyer_enfants_vaccins.md](conseils_foyer_enfants_vaccins.md)

Si seule la case fragile est cochée :

* [conseils_accueil_enfants.md](conseils_accueil_enfants.md)
* [conseils_foyer_fragile_suivi.md](conseils_foyer_fragile_suivi.md)
* [conseils_prescription_masques.md](conseils_prescription_masques.md)
* [conseils_foyer_fragile_domicile.md](conseils_foyer_fragile_domicile.md)


#### Caractéristiques et antécédents

[Titre caractéristiques](question_caractéristiques_titre.md) 

Question (âge) : [libellé](question_caractéristiques_âge_libellé.md)

Question (grossesse) : [libellé](question_caractéristiques_grossesse_libellé.md)

Question (taille) : [libellé](question_caractéristiques_taille_libellé.md), [aide](question_caractéristiques_taille_poids_aide.md)

Question (poids) : [libellé](question_caractéristiques_poids_libellé.md), [aide](question_caractéristiques_taille_poids_aide.md)


[Titre antécédents](question_antécédents_titre.md)

Question (cardio) : [libellé](question_antécédents_cardio_libellé.md), [aide](question_antécédents_cardio_aide.md)

Question (diabète) : [libellé](question_antécédents_diabète_libellé.md)

Question (respi) : [libellé](question_antécédents_respi_libellé.md), [aide](question_antécédents_respi_aide.md)

Question (dialyse) : [libellé](question_antécédents_dialyse_libellé.md)

Question (cancer) : [libellé](question_antécédents_cancer_libellé.md)

Question (immunodépression) : [libellé](question_antécédents_immunodépression_libellé.md), [aide](question_antécédents_immunodépression_aide.md)

Question (cirrhose) : [libellé](question_antécédents_cirrhose_libellé.md)

Question (drépanocytose) : [libellé](question_antécédents_drépanocytose_libellé.md)

Question (chronique autre) : [libellé](question_antécédents_chronique_autre_libellé.md)

Conseils :

Si [Antécédents](#antécédents) (sauf grossesse) :

* [conseils_caractéristiques_antécédents.md](conseils_caractéristiques_antécédents.md)
* [conseils_prescription_masques.md](conseils_prescription_masques.md)
* [conseils_accueil_enfants.md](conseils_accueil_enfants.md)

Si case antécédents chroniques autres cochée :

* [conseils_antécédents_chroniques_autres.md](conseils_antécédents_chroniques_autres.md)

#### Conseils d’ordre général

1. [conseils_généraux.md](conseils_généraux.md)
2. [conseils_généraux_faq.md](conseils_généraux_faq.md)
3. [conseils_généraux_autres_pathologies.md](conseils_généraux_autres_pathologies.md)


### Cas particuliers

#### Symptômes actuels

[Titre](question_symptômes_actuels_titre.md)

Question : [libellé](question_symptômes_actuels_libellé.md), [aide](question_symptômes_aide.md)

Statut : [statut_risque_élevé_contamination.md](statut_risque_élevé_contamination.md) (rouge)

Conseils :

1. [conseils_symptômes_actuels.md](conseils_symptômes_actuels.md)
2. [conseils_cartographie_dépistage.md](conseils_cartographie_dépistage.md)
3. [Conseils d’ordre général](#conseils-dordre-général)


#### Symptômes passés

[Titre](question_symptômes_passés_titre.md)

Question : [libellé](question_symptômes_passés_libellé.md), [aide](question_symptômes_aide.md)

Statut : [statut_risque_élevé_contamination.md](statut_risque_élevé_contamination.md) (rouge)

Conseils :

1. [conseils_symptômes_passés_sans_risques.md](conseils_symptômes_passés_sans_risques.md) ou [conseils_symptômes_passés_avec_risques.md](conseils_symptômes_passés_avec_risques.md) selon la valeur de [Risque](#risque) (ou case foyer à risque cochée)
2. [conseils_symptômes_passés_défaut.md](conseils_symptômes_passés_défaut.md)
3. [conseils_cartographie_dépistage.md](conseils_cartographie_dépistage.md)
4. [Localisation](#localisation)
6. [conseils_foyer_fragile_suivi.md](conseils_foyer_fragile_suivi.md)
7. [conseils_foyer_enfants_fragile_suivi.md](conseils_foyer_enfants_fragile_suivi.md)
8. [conseils_antécédents_chroniques_autres.md](conseils_antécédents_chroniques_autres.md)
9. [Conseils d’ordre général](#conseils-dordre-général)


#### Contact à risque

[Titre](question_symptômes_contact_à_risque_titre.md)

Question : [libellé](question_symptômes_contact_à_risque_libellé.md), [aide](question_symptômes_contact_à_risque_aide.md)

Sous-question (même lieu de vie) : [libellé](question_symptômes_contact_à_risque_même_lieu_de_vie_libellé.md)

Sous-question (contact direct) : [libellé](question_symptômes_contact_à_risque_contact_direct_libellé.md), [aide](question_symptômes_contact_à_risque_contact_direct_aide.md)

Sous-question (actes) : [libellé](question_symptômes_contact_à_risque_actes_libellé.md), [aide](question_symptômes_contact_à_risque_actes_aide.md)

Sous-question (espace confiné) : [libellé](question_symptômes_contact_à_risque_espace_confiné_libellé.md)

Sous-question (même classe) : [libellé](question_symptômes_contact_à_risque_même_classe_libellé.md)

Statut : [statut_risque_élevé_contamination.md](statut_risque_élevé_contamination.md) (rouge)

Conseils :

1. [conseils_contact_à_risque.md](conseils_contact_à_risque.md)
2. [conseils_cartographie_dépistage.md](conseils_cartographie_dépistage.md)
3. [Localisation](#localisation)
4. [conseils_foyer_fragile_suivi.md](conseils_foyer_fragile_suivi.md)
5. [conseils_foyer_enfants_fragile_suivi.md](conseils_foyer_enfants_fragile_suivi.md)
6. [conseils_antécédents_chroniques_autres.md](conseils_antécédents_chroniques_autres.md)
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
* 3e trimestre grossesse

#### Risque

Est définie comme étant une personne à risque celle qui vérifie l’une de ces conditions :

* a des [Antécédents](#antécédents)
* a plus de 65 ans
* a un IMC > 30

