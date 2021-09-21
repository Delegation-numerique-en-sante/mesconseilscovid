from collections import Counter
from datetime import date, timedelta
from itertools import groupby
from operator import itemgetter
from pathlib import Path
import argparse
import locale
import os

from more_itertools import collapse

import httpx
from jinja2 import Environment as JinjaEnv
from jinja2 import FileSystemLoader, StrictUndefined

HERE = Path(__file__).parent

jinja_env = JinjaEnv(loader=FileSystemLoader(str(HERE)), undefined=StrictUndefined)


def main():
    locale.setlocale(locale.LC_ALL, "")

    args = parse_args()

    api = PlausibleAPI(
        host=args.host,
        site_id=args.site_id,
        token=args.token or os.getenv("PLAUSIBLE_TOKEN"),
    )

    feedback = FeedbackQuestions(plausible_api=api)

    # Retours du jour choisi (hier par défaut).
    le_jour = args.date
    if le_jour == "hier":
        le_jour = date.today() - timedelta(days=1)
    else:
        le_jour = date.fromisoformat(args.date)
    stats_du_jour = feedback.stats_du_jour(date=le_jour)

    # On filtre avec un nombre de réponses minimales.
    stats_du_jour = filtrer(stats_du_jour, args.reponses_min)

    # Comparer avec les stats moyennes de la période de référence.
    stats_de_reference = feedback.stats_moyennes(
        start=le_jour - timedelta(days=args.jours_precedents),
        end=le_jour - timedelta(days=1),
    )

    # On trie selon le critère choisi.
    stats_du_jour = trier(stats_du_jour, critere=args.trier_par)

    # Produit un tableau ou une page web.
    if args.format == "tsv":
        # On évite de calculer des variations non significatives.
        stats_de_reference = filtrer(stats_de_reference, args.reponses_min)

        sortie_format_tsv(stats_du_jour, stats_de_reference)

    elif args.format == "html":
        libelle_le_jour = le_jour.strftime("%A %-d/%-m/%Y").capitalize()

        if args.jours_precedents == 1:
            la_veille = le_jour - timedelta(days=1)
            libelle_reference = la_veille.strftime("%A %-d/%-m/%Y").capitalize()
        else:
            libelle_reference = f"Moyenne des {args.jours_precedents} jours précédents"

        sortie_format_html(
            titre=titre_du_graphique(args.reponses_min, args.trier_par),
            sous_titre=f"{libelle_le_jour} vs. {libelle_reference}",
            periodes={
                libelle_le_jour: stats_du_jour,
                libelle_reference: stats_de_reference,
            },
            output_path=(HERE / "build" / "index.html"),
        )


def filtrer(stats, reponses_min):
    return {
        question: reponses
        for question, reponses in stats.items()
        if reponses.total() >= reponses_min
    }


def trier(stats, critere):
    if critere == "popularité":
        sort_key = lambda t: t[1].total()
    elif critere == "satisfaction":
        sort_key = lambda t: t[1].pourcentage_de_satisfaits()
    elif critere == "insatisfaction":
        sort_key = lambda t: t[1].pourcentage_d_insatisfaits()
    elif critere == "satisfaits":
        sort_key = lambda t: t[1].nombre_de_satisfaits()
    elif critere == "insatisfaits":
        sort_key = lambda t: t[1].nombre_d_insatisfaits()

    return dict(sorted(stats.items(), key=sort_key, reverse=True))


def titre_du_graphique(nb_min, critere):
    titre = f"Questions populaires (n≥{nb_min})"
    if critere == "popularité":
        titre += " triées par nombre total de réponses"
    elif critere == "satisfaction":
        titre += " triées par taux de satisfaction"
    elif critere == "insatisfaction":
        titre += " triées par taux d’insatisfaction"
    elif critere == "satisfaits":
        titre += " triées par nombre de personnes satisfaites"
    elif critere == "insatisfaits":
        titre += " triées par nombre de personnes insatisfaites"
    return titre


def sortie_format_tsv(stats, stats_de_reference, sep="\t"):
    print(
        "Question",
        "Nombre de retours",
        "🙂",
        "😐",
        "🙁",
        "😐 + 🙁",
        "Taux de satisfaction",
        "Évolution",
        sep=sep,
    )
    for question, reponses in stats.items():
        print(
            question,
            reponses.total(),
            reponses.get("oui", 0),
            reponses.get("bof", 0),
            reponses.get("non", 0),
            reponses.nombre_d_insatisfaits(),
            f"{reponses.pourcentage_de_satisfaits():.0f} %",
            reponses.variation(stats_de_reference.get(question)),
            sep=sep,
        )


def sortie_format_html(titre, sous_titre, periodes, output_path):
    template = jinja_env.get_template("template.html")
    content = template.render(
        **{
            "titre": titre,
            "sous_titre": sous_titre,
            "periodes": periodes,
            "labels": list(periodes.values())[0].keys(),
        }
    )
    if not output_path.parent.exists():
        output_path.parent.mkdir(parents=True)
    output_path.write_text(content)


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--host",
        default="stats.mesconseilscovid.fr",
        help="serveur Plausible (par défaut: stats.mesconseilscovid.fr)",
    )
    parser.add_argument(
        "--site-id",
        default="mesconseilscovid.sante.gouv.fr",
        help="site (par défaut: mesconseilscovid.sante.gouv.fr)",
    )
    parser.add_argument(
        "--token", default=None, help="jeton d’authentification Plausible"
    )
    parser.add_argument(
        "--date",
        default="hier",
        help="date à regarder, au format YYYY-MM-DD (par défaut: hier)",
    )
    parser.add_argument(
        "--jours-precedents",
        metavar="N",
        type=int,
        default=1,
        help="comparer avec la moyenne des N jours précédents (par défaut: 1)",
    )
    parser.add_argument(
        "--reponses-min",
        metavar="N",
        type=int,
        default=10,
        help="nombre minimum de réponses (par défaut: 10)",
    )
    parser.add_argument(
        "--trier-par",
        default="popularité",
        choices=[
            "popularité",  # nombre total de réponses
            "satisfaction",  # taux de satisfaction
            "insatisfaction",  # taux d’insatisfaction
            "satisfaits",  # nombre de personnes satisfaites
            "insatisfaits",  # nombre de personnes insatisfaites
        ],
        help="critère de tri (par défaut: popularité)",
    )
    parser.add_argument(
        "--format",
        default="html",
        choices=["html", "tsv"],
        help="format de sortie (par défaut: html)",
    )
    return parser.parse_args()


class FeedbackQuestions:
    def __init__(self, plausible_api):
        self.plausible_api = plausible_api

    def stats_du_jour(self, date):
        response = self.plausible_api.breakdown_for_day(
            date=date, property="reponse", name="Avis par question"
        )
        return self._regroupe_par_question(
            self._separe_question_et_reponse(response["results"]), dict_class=Reponses
        )

    def stats_moyennes(self, start, end):
        response = self.plausible_api.breakdown_for_period(
            start=start, end=end, property="reponse", name="Avis par question"
        )
        nb_jours = (end - start).days + 1
        return self._regroupe_par_question(
            self._moyenne_quotidienne(
                self._separe_question_et_reponse(response["results"]), nb_jours
            ),
            dict_class=Reponses,
        )

    @staticmethod
    def _moyenne_quotidienne(results, nb_jours):
        return (
            (question, reponse, round(nombre / nb_jours, 1))
            for question, reponse, nombre in results
        )

    @staticmethod
    def _separe_question_et_reponse(results):
        return (
            tuple(collapse((result["reponse"].rsplit(" : ", 1), result["visitors"])))
            for result in results
        )

    @staticmethod
    def _regroupe_par_question(items, dict_class=dict):
        return {
            key: dict_class(dict(item[1:] for item in group))
            for key, group in groupby(sorted(items), key=itemgetter(0))
        }


class Reponses(Counter):
    def nombre_de_satisfaits(self):
        return self.get("oui", 0)

    def pourcentage_de_satisfaits(self):
        return self.nombre_de_satisfaits() * 100.0 / self.total()

    def nombre_d_insatisfaits(self):
        nb_bof = self.get("bof", 0)
        nb_non = self.get("non", 0)
        return nb_bof + nb_non

    def pourcentage_d_insatisfaits(self):
        return self.nombre_d_insatisfaits() * 100.0 / self.total()

    def total(self):
        return self.nombre_de_satisfaits() + self.nombre_d_insatisfaits()

    def variation(self, reference):
        if reference is None:
            return ""

        satisfaction = self.pourcentage_de_satisfaits()
        precedemment = reference.pourcentage_de_satisfaits()
        variation = satisfaction - precedemment

        if variation >= 5:
            return f"{variation:>+3.0f} ↗"
        elif variation <= -5:
            return f"{variation:>+3.0f} ↘"
        else:
            return f"{variation:>+3.0f} ➡"


class PlausibleAPI:
    def __init__(self, host, token, site_id):
        self.host = host
        self.token = token
        self.site_id = site_id

    def breakdown_for_day(self, date, property, name):
        resp = httpx.get(
            f"https://{self.host}/api/v1/stats/breakdown",
            params={
                "site_id": self.site_id,
                "period": "day",
                "date": date.isoformat(),
                "property": f"event:props:{property}",
                "names": f"event:name=={name}",
            },
            headers={"Authorization": f"Bearer {self.token}"},
        )
        return resp.json()

    def breakdown_for_period(self, start, end, property, name):
        resp = httpx.get(
            f"https://{self.host}/api/v1/stats/breakdown",
            params={
                "site_id": self.site_id,
                "period": "custom",
                "date": start.isoformat() + "," + end.isoformat(),
                "property": f"event:props:{property}",
                "names": f"event:name=={name}",
            },
            headers={"Authorization": f"Bearer {self.token}"},
        )
        return resp.json()


if __name__ == "__main__":
    main()
