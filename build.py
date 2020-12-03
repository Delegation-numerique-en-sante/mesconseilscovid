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

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
CONTENUS_DIR = HERE / "contenus"

jinja_env = JinjaEnv(loader=FileSystemLoader(str(SRC_DIR)), undefined=StrictUndefined)

markdown = mistune.create_markdown(escape=False)


@cli
def all():
    index()
    readmes()


def each_folder_from(source_dir, exclude=None):
    """Walk across the `source_dir` and return the folder paths."""
    for direntry in os.scandir(source_dir):
        if direntry.is_dir():
            if exclude is not None and direntry.name in exclude:
                continue
            yield direntry


def each_file_from(source_dir, file_name="*", exclude=None):
    """Walk across the `source_dir` and return the md file paths."""
    for filename in fnmatch.filter(sorted(os.listdir(source_dir)), file_name):
        if exclude is not None and filename in exclude:
            continue
        yield os.path.join(source_dir, filename), filename


def build_responses(source_dir):
    """Extract and convert markdown from a `source_dir` directory into a dict."""
    responses = {}
    for folder in each_folder_from(source_dir):
        for file_path, filename in each_file_from(folder, file_name="*.md"):
            html_content = markdown.read(file_path)
            # Remove empty comments set to hack markdown rendering
            # when we do not want paragraphs.
            html_content = html_content.replace("<!---->", "")
            responses[filename[: -len(".md")]] = html_content

    return responses


class PDFLinkExtractor(HTMLParser):
    def reset(self):
        HTMLParser.reset(self)
        self.pdf_links = set()

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            attrs = dict(attrs)
            url = attrs["href"]
            if url.startswith("http") and url.endswith(".pdf"):
                self.pdf_links.update([url])


def url_to_file_name(url: str) -> str:
    file_name = (
        url.replace("http://", "")
        .replace("https://", "")
        .replace(".", "-")
        .replace("/", "-")
        # Tempting to do `.replace("-pdf", ".pdf")` here but there are some
        # use-cases where it fails if the URL contains `/pdf/` for instance.
    )
    return file_name


def save_binary_response(file_path: Path, response: "httpx.Response"):
    with open(file_path, "wb") as download_file:
        for chunk in response.iter_bytes():
            download_file.write(chunk)


def cache_external_pdfs(content: str, timeout: int = 10) -> str:
    """
    Download external PDFs and replace links with the local copy
    """
    pdfs_file_path = HERE / "src" / "pdfs"
    if not pdfs_file_path.exists():
        pdfs_file_path.mkdir(parents=True)
    parser = PDFLinkExtractor()
    parser.feed(content)
    for pdf_link in sorted(parser.pdf_links):
        file_name = url_to_file_name(pdf_link)
        target = f"pdfs/{file_name}.pdf"
        if (SRC_DIR / target).exists():
            print(f"SKIP: {pdf_link} exists in {SRC_DIR / target}")
        else:
            print(f"FETCH: {pdf_link} to {SRC_DIR / target}")

            with httpx.stream(
                "GET",
                pdf_link,
                timeout=timeout,
                verify=False,  # ignore SSL certificate validation errors
            ) as response:
                if response.status_code == HTTPStatus.TOO_MANY_REQUESTS:
                    print("Warning: we’re being throttled, skipping link (429)")
                    continue
                if response.status_code != HTTPStatus.OK:
                    raise Exception(f"{pdf_link} is broken! ({response.status_code})")
                save_binary_response(pdfs_file_path / f"{file_name}.pdf", response)
        content = content.replace(pdf_link, target)
    return content


@cli
def index():
    """Build the index with contents from markdown dedicated folder."""
    responses = build_responses(CONTENUS_DIR)
    content = render_template("template.html", **responses)
    content = cache_external_pdfs(content)
    (SRC_DIR / "index.html").write_text(content)


def me_or_them(value):
    separator = "<hr />"
    if separator in value:
        me, them = (part.strip() for part in value.split(separator))
        value = f'<span class="me visible">{me}</span><span class="them" hidden>{them}</span>'
    return value


def render_template(src, **context):
    jinja_env.filters["me_or_them"] = me_or_them
    template = jinja_env.get_template(src)
    return template.render(**context)


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
