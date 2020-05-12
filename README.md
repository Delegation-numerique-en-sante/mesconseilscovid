# Mes Conseils Covid

## Pour que chacun puisse agir contre le virus.

**🚧  Ce site est encore en construction !  🚧**


## Données

### Données personelles

**Aucune donnée n’est envoyée vers un serveur.**

Les données saisies restent uniquement dans le navigateur et peuvent être supprimées à tout moment. La bibliothèque [localForage](https://github.com/localForage/localForage/) est utilisée pour stocker ces données *localement* et pouvoir y avoir accès à nouveau lors d’une future soumission du questionnaire.


### Source des données permettant de générer les réponses

-   Contours administratifs des départements (fichier `departements-1000m.geojson`) : http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson/
-   Indicateurs d’activité épidémique vert/rouge (fichier `donnees-carte-synthese-tricolore.csv`) : https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/
-   Liens vers les préfectures (fichier `pages-consignes-prefectorales-covid19.json`) : https://www.data.gouv.fr/fr/datasets/liste-des-liens-url-redirigeant-vers-les-consignes-prefectorales-dans-le-cadre-du-covid-19/


## Développement

### Proposer une amélioration du contenu

Aller dans le dossier [`/contenus/`](contenus/) qui contient les fichiers au format [CommonMark](https://commonmark.org/) (aussi appelé Markdown), vous pouvez éditer les fichiers disponibles et proposer une `pull-request` à partir de ces suggestions. Il est conseillé de [lire la documentation](contenus#contenus) associée à ces fichiers.

### Générer le fichier `index.html`

NB : il est conseillé d’installer les modules Python dans un [environnement virtuel](https://docs.python.org/3/tutorial/venv.html).

```
$ make install
$ make build
```

### Lancer un serveur local

Pour lancer un serveur local sur [https://localhost:8443/](https://localhost:8443/) :

```
$ make serve
```

### Lancer les tests

Pour lancer les tests dans le navigateur avec [Mocha](https://mochajs.org/), allez sur [https://localhost:8443/tests/](https://localhost:8443/tests/).
