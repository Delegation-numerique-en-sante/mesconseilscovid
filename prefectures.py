#!/usr/bin/env python3
from pathlib import Path
from time import perf_counter

import httpx
from minicli import cli, run, wrap

HERE = Path(__file__).parent
DATA_DIR = HERE / "src" / "scripts" / "data"

DATA_URL = "https://www.data.gouv.fr/fr/datasets/r/0b245875-b964-4c26-9765-c0e7498d39c5"


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
    return response.json()


@cli
def generate():
    data = retrieve_data(DATA_URL)
    prefectures = {item["codeDepartement"]: item["pagePrefecture"] for item in data}
    open(DATA_DIR / "prefectures.js", "w").write(f"export default {prefectures}\n")


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
