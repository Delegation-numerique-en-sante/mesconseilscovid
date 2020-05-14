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

#### Localisation

Question : [titre](question_résidence_titre.md), [libellé](question_résidence_libellé.md)

Conseils :

1. [conseils_département_rouge.md](conseils_département_rouge.md) ou [conseils_département_vert.md](conseils_département_vert.md) selon la [Couleur](#couleur) du département
2. [conseils_département_défaut.md](conseils_département_défaut.md).

#### Activité

Question : [titre](question_activité_pro_titre.md), [libellé](question_activité_pro_libellé.md)

Sous-question (contact public) : [libellé](question_activité_pro_public_libellé.md)

Sous-question (domaine santé) : [libellé](question_activité_pro_santé_libellé.md), [aide](question_activité_pro_santé_aide.md)

#### Foyer

#### Caractéristiques et antécédents

#### Conseils d’ordre général

1. [conseils_généraux.md](conseils_généraux.md)
2. [conseils_généraux_faq.md](conseils_généraux_faq.md)
3. [conseils_généraux_autres_pathologies.md](conseils_généraux_autres_pathologies.md)


### Cas particuliers

#### Symptômes actuels

Question : [titre](question_symptômes_actuels_titre.md), [libellé](question_symptômes_actuels_libellé.md), [aide](question_symptômes_aide.md)

Conseils :

1. [conseils_symptômes_actuels.md](conseils_symptômes_actuels.md)
2. [conseils_cartographie_dépistage.md](conseils_cartographie_dépistage.md)
3. [Conseils d’ordre général](#conseils-dordre-général)


#### Symptômes passés

Question : [titre](question_symptômes_passés_titre.md), [libellé](question_symptômes_passés_libellé.md), [aide](question_symptômes_aide.md)

Conseils :

1. [conseils_symptômes_passés_sans_risques.md](conseils_symptômes_passés_sans_risques.md) ou [conseils_symptômes_passés_avec_risques.md](conseils_symptômes_passés_avec_risques.md) selon la valeur de [Risque](#risque)
2. [conseils_symptômes_passés_défaut.md](conseils_symptômes_passés_défaut.md)
3. [conseils_cartographie_dépistage.md](conseils_cartographie_dépistage.md)
4. [Localisation](#localisation)
5. [Foyer](#foyer) (cas particulier à détailler)
6. [conseils_antécédents_chroniques_autres.md](conseils_antécédents_chroniques_autres.md)
7. [Conseils d’ordre général](#conseils-dordre-général)

#### Contact à risque

Question : [titre](question_symptômes_contact_à_risque_titre.md), [libellé](question_symptômes_contact_à_risque_libellé.md), [aide](question_symptômes_contact_à_risque_aide.md)

Sous-question (même lieu de vie) : [libellé](question_symptômes_contact_à_risque_même_lieu_de_vie_libellé.md)

Sous-question (contact direct) : [libellé](question_symptômes_contact_à_risque_contact_direct_libellé.md), [aide](question_symptômes_contact_à_risque_contact_direct_aide.md)

Sous-question (actes) : [libellé](question_symptômes_contact_à_risque_actes_libellé.md), [aide](question_symptômes_contact_à_risque_actes_aide.md)

Sous-question (espace confiné) : [libellé](question_symptômes_contact_à_risque_espace_confiné_libellé.md)

Sous-question (même classe) : [libellé](question_symptômes_contact_à_risque_même_classe_libellé.md)


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
* habite dans un foyer fragile

