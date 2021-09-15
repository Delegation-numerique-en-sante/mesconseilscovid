from collections import Counter
from datetime import date, timedelta
from itertools import groupby
from operator import itemgetter
from pathlib import Path
import argparse
import os

from more_itertools import collapse

import httpx
from jinja2 import Environment as JinjaEnv
from jinja2 import FileSystemLoader, StrictUndefined

HERE = Path(__file__).parent

jinja_env = JinjaEnv(loader=FileSystemLoader(str(HERE)), undefined=StrictUndefined)


def main():
    args = parse_args()

    api = PlausibleAPI(
        host=args.host,
        site_id=args.site_id,
        token=args.token or os.getenv("PLAUSIBLE_TOKEN"),
    )

    feedback = FeedbackQuestions(plausible_api=api)

    # Retours du jour choisi (hier par défaut).
    le_jour = args.date
    if le_jour == "yesterday":
        le_jour = date.today() - timedelta(days=1)
    stats_du_jour = feedback.stats_du_jour(date=le_jour)

    # On filtre avec un nombre de réponses minimales.
    stats_du_jour = filtrer(stats_du_jour, args.reponses_min)

    # Comparer avec les stats du jour précédent.
    la_veille = le_jour - timedelta(days=1)
    stats_de_la_veille = feedback.stats_du_jour(date=la_veille)

    # On évite de calculer des variations non significatives.
    stats_de_la_veille = filtrer(stats_de_la_veille, args.reponses_min)

    # On trie selon le critère choisi.
    stats_du_jour = trier(stats_du_jour, critere=args.trier_par)

    for question, reponses_jour in stats_du_jour.items():
        reponses_veille = stats_de_la_veille.get(question)
        if reponses_veille is None:
            continue
        reponses_jour["oui_veille"] = reponses_veille.get("oui")
        reponses_jour["bof_veille"] = reponses_veille.get("bof")
        reponses_jour["non_veille"] = reponses_veille.get("non")

    # On affiche les résultats (TSV).
    # affiche_tableau(stats_du_jour, stats_de_la_veille)

    # On génère la page HTML.
    template = jinja_env.get_template("template.html")
    content = template.render(**{"stats_du_jour": stats_du_jour})
    (HERE / "index.html").write_text(content)


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


def affiche_tableau(stats, stats_de_reference, sep="\t"):
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


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="stats.mesconseilscovid.fr")
    parser.add_argument("--site-id", default="mesconseilscovid.sante.gouv.fr")
    parser.add_argument("--token", default=None)
    parser.add_argument("--date", default="yesterday", help="YYYY-MM-DD")
    parser.add_argument("--reponses-min", type=int, default=10)
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
        return sum(self.values())

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


if __name__ == "__main__":
    main()
