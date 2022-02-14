#!/usr/bin/env python3
import json
import locale
import logging
import warnings
from datetime import date
from html.parser import HTMLParser
from http import HTTPStatus
from operator import itemgetter
from pathlib import Path
from time import perf_counter

import httpx
import toml
from minicli import cli, run, wrap

from construction.markdown import create_markdown_parser, render_markdown_file
from construction.questions import build_questions_index
from construction.templates import render_template
from construction.thematiques import get_thematiques
from construction.utils import each_file_from, each_folder_from

LOGGER = logging.getLogger(__name__)

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
CONTENUS_DIR = HERE / "contenus"
STATIC_DIR = HERE / "static"
NB_OF_DISPLAYED_THEMATIQUES = 12

locale.setlocale(locale.LC_ALL, "fr_FR.UTF-8")


# Ignore dateparser warnings regarding pytz
warnings.filterwarnings(
    "ignore",
    message=(
        "The localize method is no longer necessary, "
        "as this time zone supports the fold attribute"
    ),
)


@cli
def all():
    index()
    thematiques()
    sitemap()


@cli
def index():
    """Build the index with contents from markdown dedicated folder."""
    markdown_parser = create_markdown_parser()
    responses = build_responses(CONTENUS_DIR, markdown_parser)

    thematiques = get_thematiques(markdown_parser)
    fr_thematiques = [
        thematique for thematique in thematiques if thematique.lang != "en"
    ]
    thematiques = fr_thematiques[:NB_OF_DISPLAYED_THEMATIQUES]
    responses["thematiques"] = thematiques
    responses["autres_thematiques"] = [
        thematique
        for thematique in thematiques
        if thematique.name != "j-ai-des-symptomes-covid"
    ]

    content = render_template(
        "index.html", actualites=extrait_actualites(), **responses
    )
    content = cache_external_pdfs(content)
    (SRC_DIR / "index.html").write_text(content)


def extrait_actualites():
    actualites = [toml.load(f) for f in each_file_from(CONTENUS_DIR / "actualites")]
    return sorted(actualites, key=itemgetter("date"), reverse=True)


@cli
def thematiques():
    """Build the theme pages with contents from thematiques folder."""
    questions_index = build_questions_index()
    markdown_parser = create_markdown_parser(questions_index=questions_index)
    responses = build_responses(CONTENUS_DIR, markdown_parser)
    version = get_version()
    meta_pied_de_page = str(responses["meta_pied_de_page"]).replace(
        '<span class="js-latest-update"></span>',
        f" - Mise à jour le {version.strftime('%d-%m-%Y')}",
    )
    thematiques = get_thematiques(markdown_parser)
    for thematique in thematiques:
        autres_thematiques = [t for t in thematiques if t != thematique]
        content = render_template(
            "thematique.html",
            **{
                "thematique": thematique,
                "thematiques": autres_thematiques[:NB_OF_DISPLAYED_THEMATIQUES],
                "config_stats_url": responses["config_stats_url"],
                "meta_feedback_conseils": responses["meta_feedback_conseils"],
                "meta_unsupported_browser": responses["meta_unsupported_browser"],
                "meta_pied_de_page": meta_pied_de_page,
            },
        )
        (SRC_DIR / f"{thematique.name}.html").write_text(content)


def get_version() -> date:
    content = open(HERE / "static" / "version.json").read()
    data = json.loads(content)
    # We might have a version with more characters than a date
    # if multiple releases are required within the same day.
    version = data["version"][:10]
    return date(*(int(item) for item in version.split("-")))


@cli
def sitemap():
    """Build the sitemap for index + themes pages."""
    markdown_parser = create_markdown_parser()
    content = render_template(
        "sitemap.html",
        thematiques=get_thematiques(markdown_parser),
        lastmod_date=date.today(),
    )
    (STATIC_DIR / "sitemap.xml").write_text(content)


def build_responses(source_dir, markdown_parser):
    """Extract and convert markdown from a `source_dir` directory into a dict."""
    responses = {}
    for folder in each_folder_from(source_dir):
        for path in each_file_from(folder, pattern="*.md"):
            html_content = render_markdown_file(path, markdown_parser)
            responses[path.stem] = html_content

    return responses


def cache_external_pdfs(content: str, timeout: int = 10) -> str:
    """
    Download external PDFs and replace links with the local copy
    """
    for url in _extract_pdf_links(content):
        filename = url_to_filename(url)
        download_file_if_needed(
            url=url,
            local_path=SRC_DIR / "pdfs" / filename,
            timeout=timeout,
        )
        content = content.replace(
            f'href="{url}"', f'href="pdfs/{filename}" data-original-link="{url}"'
        )
    return content


def _extract_pdf_links(content):
    parser = PDFLinkExtractor()
    parser.feed(content)
    return sorted(parser.pdf_links)


class PDFLinkExtractor(HTMLParser):
    def reset(self):
        HTMLParser.reset(self)
        self.pdf_links = set()

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            attrs = dict(attrs)
            url = attrs.get("href")
            if url and url.startswith("http") and url.endswith(".pdf"):
                self.pdf_links.add(url)


def url_to_filename(url: str) -> str:
    basename, extension = url.rsplit(".", 1)
    filename = (
        basename.replace("http://", "")
        .replace("https://", "")
        .replace(".", "-")
        .replace("/", "-")
    )
    return f"{filename}.{extension}"


def download_file_if_needed(url, local_path, timeout):
    if local_path.exists():
        LOGGER.info(f"SKIP: {url} exists in {local_path}")
    else:
        LOGGER.info(f"FETCH: {url} to {local_path}")
        _download_file(url, local_path, timeout)


def _download_file(url, local_path, timeout):
    try:
        with httpx.stream(
            "GET",
            url,
            follow_redirects=True,
            timeout=timeout,
            verify=False,  # ignore SSL certificate validation errors
        ) as response:
            if response.status_code != HTTPStatus.OK:
                raise Exception(f"{url} is broken! ({response.status_code})")
            _save_binary_response(local_path, response)
    except httpx.ReadError:
        # It (may?) happen in Github CI which prevents
        # downloading external/big files.
        return


def _save_binary_response(file_path: Path, response: "httpx.Response"):
    if not file_path.parent.exists():
        file_path.parent.mkdir(parents=True)
    with open(file_path, "wb") as download_file:
        for chunk in response.iter_bytes():
            download_file.write(chunk)


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
