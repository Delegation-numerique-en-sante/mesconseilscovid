#!/usr/bin/env python3
import fnmatch
import os
from html.parser import HTMLParser
from http import HTTPStatus
from pathlib import Path
from time import perf_counter

import httpx
import mistune
from jinja2 import Environment as JinjaEnv
from jinja2 import FileSystemLoader, StrictUndefined
from minicli import cli, run, wrap

from typographie import typographie

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
CONTENUS_DIR = HERE / "contenus"

jinja_env = JinjaEnv(loader=FileSystemLoader(str(SRC_DIR)), undefined=StrictUndefined)


class FrenchTypographyRenderer(mistune.HTMLRenderer):
    def text(self, text_):
        return typographie(super().text(text_))


markdown = mistune.create_markdown(
    escape=False, renderer=FrenchTypographyRenderer(escape=False)
)


@cli
def all():
    index()
    readmes()


@cli
def index():
    """Build the index with contents from markdown dedicated folder."""
    responses = build_responses(CONTENUS_DIR)
    content = render_template("template.html", **responses)
    content = cache_external_pdfs(content)
    (SRC_DIR / "index.html").write_text(content)


def build_responses(source_dir):
    """Extract and convert markdown from a `source_dir` directory into a dict."""
    responses = {}
    for folder in each_folder_from(source_dir):
        for file_path, filename in each_file_from(folder, pattern="*.md"):
            html_content = render_markdown_file(file_path)
            responses[filename[: -len(".md")]] = html_content

    return responses


def render_markdown_file(file_path):
    html_content = markdown.read(file_path)
    # Remove empty comments set to hack markdown rendering
    # when we do not want paragraphs.
    return html_content.replace("<!---->", "")


def each_folder_from(source_dir, exclude=None):
    """Walk across the `source_dir` and return the folder paths."""
    for direntry in os.scandir(source_dir):
        if direntry.is_dir():
            if exclude is not None and direntry.name in exclude:
                continue
            yield direntry


def each_file_from(source_dir, pattern="*", exclude=None):
    """Walk across the `source_dir` and return the md file paths."""
    for filename in fnmatch.filter(sorted(os.listdir(source_dir)), pattern):
        if exclude is not None and filename in exclude:
            continue
        yield os.path.join(source_dir, filename), filename


def render_template(src, **context):
    jinja_env.filters["me_or_them"] = me_or_them
    template = jinja_env.get_template(src)
    return template.render(**context)


def me_or_them(value):
    separator = "<hr />"
    if separator in value:
        me, them = (part.strip() for part in value.split(separator))
        value = f'<span class="me visible">{me}</span><span class="them" hidden>{them}</span>'
    return value


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
        content = content.replace(url, f"pdfs/{filename}")
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
            url = attrs["href"]
            if url.startswith("http") and url.endswith(".pdf"):
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
        print(f"SKIP: {url} exists in {local_path}")
    else:
        print(f"FETCH: {url} to {local_path}")
        _download_file(url, local_path, timeout)


def _download_file(url, local_path, timeout):
    with httpx.stream(
        "GET",
        url,
        timeout=timeout,
        verify=False,  # ignore SSL certificate validation errors
    ) as response:
        if response.status_code != HTTPStatus.OK:
            raise Exception(f"{url} is broken! ({response.status_code})")
        _save_binary_response(local_path, response)


def _save_binary_response(file_path: Path, response: "httpx.Response"):
    if not file_path.parent.exists():
        file_path.parent.mkdir(parents=True)
    with open(file_path, "wb") as download_file:
        for chunk in response.iter_bytes():
            download_file.write(chunk)


@cli
def readmes():
    """Build the readmes with all content from markdown files in it."""
    for folder in each_folder_from(CONTENUS_DIR):
        folder_content = f"""
# {folder.name.title()}

*Ce fichier est généré automatiquement pour pouvoir accéder rapidement aux contenus,\
il ne doit pas être édité !*

"""
        for file_path, filename in each_file_from(folder):
            if filename in ("README.md", ".DS_Store"):
                continue
            file_content = open(file_path).read()
            folder_content += f"""
## [{filename}]({filename})

{file_content}

"""
        (Path(folder.path) / "README.md").open("w").write(folder_content)


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
