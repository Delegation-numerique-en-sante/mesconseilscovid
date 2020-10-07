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

### Suivi

Les fichiers dans le dossier [`suivi/`](suivi/) correspondent aux différents messages relatifs à l’évolution des symptômes de la personne.

### Meta

Les fichiers dans le dossier [`meta/`](meta/) correspondent aux informations additionnelles comme la page d’introduction ou le pied de page par exemple.


## Algorithme

Les règles d’affichage des conseils en fonction des réponses sont décrites ci-dessous :

### Parcours

La première question est relative au dépistage :

* Si le test est positif ou que la personne est en attente de résultats, elle est redirigée vers le suivi (`Date de premiers symptômes` + `Évolution des symptômes`)
* Si le test est négatif ou que la personne n’a pas effectué de test, elle est redirigée vers la description de ses `Symptômes actuels` puis `Symptômes passés` et enfin `Contact à risque`.

Si la personne a des `Symptômes actuels` ou `Symptômes passés`, elle est redirigée vers le suivi (`Date de premiers symptômes` + `Évolution des symptômes`).

Tous les parcours se terminent par les 5 étapes suivantes :

1. `Résidence`
2. `Foyer`
3. `Antécédents`
4. `Caractéristiques`
5. `Activité professionnelle`

Les fichiers pour modifier ces pages de parcours se situent dans le dossier [`questions/`](questions/).


### Conseils

#### Suivi ou statut

Il s’agit de la phrase de résumé en haut de page, elle correspond aux fichiers dans les dossiers [`suivi/`](suivi/) et [`statuts/`](statuts/).


#### Conseils personnels

Il s’agit de la première partie de la page intitulée « Vos conseils personnalisés », les fichiers relatifs sont dans le dossier [`conseils/`](conseils/) et commencent tous par `conseils_personnels_*`.


#### Conseils blocs

Il s’agit de la seconde partie de la page constituée de blocs dépliables, les fichiers relatifs sont dans le dossier [`conseils/`](conseils/) et NE commencent PAS par `conseils_personnels_*`.


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
