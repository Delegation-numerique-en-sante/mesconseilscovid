#!/usr/bin/env python3
import csv
from collections import defaultdict
from pathlib import Path
from time import perf_counter

import httpx
from minicli import cli, run, wrap

HERE = Path(__file__).parent
DATA_DIR = HERE / "src" / "scripts" / "data"

DATA_URL = "https://www.data.gouv.fr/fr/datasets/r/4180a181-a648-402b-92e4-f7574647afa6"


def retrieve_data(url):
    try:
        response = httpx.get(url)
        response.raise_for_status()
    except httpx.RequestError as exc:
        print(f"An error occured while requesting {exc.request.url!r}.")
    except httpx.HTTPStatusError as exc:
        print(
            f"Error response {exc.response.status_code} "
            f"while requesting {exc.request.url!r}."
        )
    return response.text.splitlines()


def aggregate_by_departement(data):
    reader = csv.DictReader(data, delimiter=";")
    by_departement = defaultdict(list)
    for row in reader:
        by_departement[row["dep"]].append((row["jour"], row["tx_std"]))
    return by_departement


def aggregate_by_week(by_departement):
    by_week = {}
    for departement, data in by_departement.items():
        by_week[departement] = round(
            sum(float(item[1]) for item in sorted(data, reverse=True)[:7]), 1
        )
    return by_week


@cli
def generate():
    data = retrieve_data(DATA_URL)
    by_departement = aggregate_by_departement(data)
    by_week = aggregate_by_week(by_departement)
    open(DATA_DIR / "incidence.js", "w").write(
        f"const incidence = {by_week}\nmodule.exports = {{incidence}}"
    )


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
