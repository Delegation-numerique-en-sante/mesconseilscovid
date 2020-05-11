# Mes Conseils Covid

Informations et conseils personnalisés autour du Covid-19 pour se protéger et protéger les autres.

**En construction !**

## Données

-   Contours administratifs des départements (fichier `departements-1000m.geojson`) : http://etalab-datasets.geo.data.gouv.fr/contours-administratifs/latest/geojson/
-   Indicateurs d’activité épidémique vert/rouge (fichier `donnees-carte-synthese-tricolore.csv`) : https://www.data.gouv.fr/fr/datasets/indicateurs-dactivite-epidemique-covid-19-par-departement/
-   Liens vers les préfectures (fichier `pages-consignes-prefectorales-covid19.json`) : https://www.data.gouv.fr/fr/datasets/liste-des-liens-url-redirigeant-vers-les-consignes-prefectorales-dans-le-cadre-du-covid-19/

## Développement

### Générer le fichier `index.html`

```
$ pip install -r requirements.txt
$ make build
```

NB : il est conseillé d’installer les modules Python dans un [environnement virtuel](https://docs.python.org/3/tutorial/venv.html).

### Lancer un serveur local

Pour lancer un serveur local sur https://localhost:8443/ :

```
$ make serve
```

### Lancer les tests

Pour lancer les tests dans le navigateur avec Mocha, allez sur https://localhost:8443/tests/
