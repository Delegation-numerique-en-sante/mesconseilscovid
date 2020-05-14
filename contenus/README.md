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

#### Localisation ([titre](question_résidence_titre.md), [libellé](question_résidence_libellé.md))

Si [Symptômes actuels](#symptomes-actuels), on n’affiche rien.

Si le département est `rouge`, on affiche [conseils_département_rouge.md](conseils_département_rouge.md).

Si le département est `vert`, on affiche [conseils_département_vert.md](conseils_département_vert.md).

Quelle que soit la couleur, on affiche [conseils_département_défaut.md](conseils_département_défaut.md).

#### Activité

#### Foyer

#### Caractéristiques et antécédents


#### Conseils d’ordre général

1. [conseils_généraux.md](conseils_généraux.md)
2. [conseils_généraux_faq.md](conseils_généraux_faq.md)
3. [conseils_généraux_autres_pathologies.md](conseils_généraux_autres_pathologies.md)


### Cas particuliers

#### Symptômes actuels ([titre](question_symptômes_actuels_titre.md), [libellé](question_symptômes_actuels_libellé.md), [aide](question_symptômes_aide.md))

On affiche :

1. [conseils_symptômes_actuels.md](conseils_symptômes_actuels.md)
2. [conseils_cartographie_dépistage.md](conseils_cartographie_dépistage.md)
3. [Conseils d’ordre général](conseils-dordre-general)


#### Symptômes passés


#### Contact à risque

