#!/usr/bin/env python3
import json
import logging
import re
from dataclasses import dataclass
from datetime import date, datetime
from html.parser import HTMLParser
from http import HTTPStatus
from pathlib import Path
from time import perf_counter

import httpx
import mistune
import pytz
from jinja2 import Environment as JinjaEnv
from jinja2 import FileSystemLoader, StrictUndefined
from minicli import cli, run, wrap
from mistune.directives import Directive
from slugify import slugify

from typographie import typographie

LOGGER = logging.getLogger(__name__)

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
CONTENUS_DIR = HERE / "contenus"
STATIC_DIR = HERE / "static"
TEMPLATES_DIR = HERE / "templates"
NB_OF_DISPLAYED_THEMATIQUES = 9

PARIS_TIMEZONE = pytz.timezone('Europe/Paris')

jinja_env = JinjaEnv(
    loader=FileSystemLoader(str(TEMPLATES_DIR)), undefined=StrictUndefined
)


class FrenchTypographyMixin:
    def text(self, text_):
        return typographie(super().text(text_))

    def block_html(self, html):
        return typographie(super().block_html(html))


class ClassMixin:
    """Possibilité d’ajouter une classe CSS sur un paragraphe ou un élément de liste.

    Par exemple :

    * {.maClasse} item classique de la liste en markdown
    """

    RE_CLASS = re.compile(
        r"""^
            (?P<before>.*?)
            (?:\s*\{\.(?P<class>[\w\- ]+?)\}\s*)
            (?P<after>.*)
            $
        """,
        re.MULTILINE | re.VERBOSE,
    )

    def paragraph(self, text):
        mo = self.RE_CLASS.match(text)
        if mo is not None:
            class_ = mo.group("class")
            text = " ".join(filter(None, [mo.group("before"), mo.group("after")]))
            return f'<p class="{class_}">{text}</p>\n'
        return super().paragraph(text)

    def list_item(self, text, level):
        mo = self.RE_CLASS.match(text)
        if mo is not None:
            class_ = mo.group("class")
            text = " ".join(filter(None, [mo.group("before"), mo.group("after")]))
            return f'<li class="{class_}">{text}</li>\n'
        return super().list_item(text, level)


class CustomHTMLRenderer(FrenchTypographyMixin, ClassMixin, mistune.HTMLRenderer):
    pass


class QuestionDirective(Directive):
    """
    Balisage FAQ pour les questions réponses

    https://developers.google.com/search/docs/data-types/faqpage?hl=fr
    """

    def parse(self, block, m, state):
        question = m.group("value")
        options = self.parse_options(m)
        level = int(dict(options).get("level")) if options else 2
        text = self.parse_text(m)
        children = block.parse(text, state, block.rules)
        if not children:
            raise ValueError(
                f"Question sans réponse : indentation manquante ?\n« {question} »"
            )
        return {"type": "question", "children": children, "params": (question, level)}

    def __call__(self, md):
        self.register_directive(md, "question")
        if md.renderer.NAME == "html":
            md.renderer.register("question", render_html_question)


def render_html_question(text, question, level):
    question_id = slugify(
        question,
        stopwords=["span", "class", "visually", "hidden", "sup"],
        replacements=[("’", "'")],
    )
    return f"""<div id="{question_id}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
<h{level} itemprop="name">
    {typographie(question)}
    <a href="#{question_id}" itemprop="url" title="Lien vers cette question" aria-hidden="true">#</a>
</h{level}>
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<div itemprop="text">
{text}</div>
</div>
<form class="question-feedback">
    <fieldset>
        <legend>Avez-vous trouvé cette réponse utile&#8239;?</legend>
        <div>
            <input type="submit" class="button-outline" data-value="non" value="🙁 Non" />
            <input type="submit" class="button-outline" data-value="bof" value="😐 Bof" />
            <input type="submit" class="button-outline" data-value="oui" value="🙂 Oui" />
        </div>
    </fieldset>
</form>
</div>
"""


class SummaryDirective(Directive):
    """
    Balisage <summary> pour les sections repliables
    """

    def parse(self, block, m, state):
        title = m.group("value")
        text = self.parse_text(m)
        children = block.parse(text, state, block.rules)
        return {"type": "summary", "children": children, "params": (title,)}

    def __call__(self, md):
        self.register_directive(md, "summary")
        if md.renderer.NAME == "html":
            md.renderer.register("summary", render_html_summary)


def render_html_summary(text, title):
    return f"""<summary>
    <h3>
        {title}
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
    </h3>
</summary>
"""


markdown = mistune.create_markdown(
    renderer=CustomHTMLRenderer(escape=False),
    plugins=[QuestionDirective(), SummaryDirective()],
)


class MarkdownContent:
    """Block content."""

    def __init__(self, text, markdown):
        self.text = text
        self.markdown = markdown

    def __str__(self):
        return self.render_block()

    def render_block(self):
        return self.markdown(self.text)

    def split(self, separator="\n---\n"):
        return [
            self.__class__(text.strip(), self.markdown)
            for text in self.text.split(separator)
        ]

    def render_me(self, tag="div"):
        return f'<{tag} class="me visible">{str(self).strip()}</{tag}>'

    def render_them(self, tag="div"):
        return f'<{tag} class="them" hidden>{str(self).strip()}</{tag}>'


class MarkdownInlineContent(MarkdownContent):
    """Inline content."""

    def __str__(self):
        return self.render_inline()

    def render_inline(self):
        return self.markdown.inline(self.text, {}).strip()

    def render_me(self):
        return super().render_me(tag="span")

    def render_them(self):
        return super().render_them(tag="span")


@cli
def all():
    index()
    thematiques()
    sitemap()


@cli
def index():
    """Build the index with contents from markdown dedicated folder."""
    responses = build_responses(CONTENUS_DIR)

    thematiques = get_thematiques()[:NB_OF_DISPLAYED_THEMATIQUES]
    responses["thematiques"] = thematiques
    responses["autres_thematiques"] = [
        thematique
        for thematique in thematiques
        if thematique.name != "j-ai-des-symptomes-covid"
    ]

    content = render_template("index.html", **responses)
    content = cache_external_pdfs(content)
    (SRC_DIR / "index.html").write_text(content)


@dataclass
class Thematique:
    path: Path
    title: str
    body: str
    header: str
    imgsrc: str
    last_modified: datetime

    @property
    def name(self):
        stem = self.path.stem
        if stem[0].isdigit():
            return stem[2:]
        return stem


@cli
def thematiques():
    """Build the theme pages with contents from thematiques folder."""
    responses = build_responses(CONTENUS_DIR)
    version = get_version()
    meta_pied_de_page = str(responses["meta_pied_de_page"]).replace(
        '<span class="js-latest-update"></span>',
        f" - Mise à jour le {version.strftime('%d-%m-%Y')}",
    )
    thematiques = get_thematiques()
    for thematique in thematiques:
        autres_thematiques = [t for t in thematiques if t != thematique]
        content = render_template(
            "thematique.html",
            **{
                "thematique": thematique,
                "thematiques": autres_thematiques[:NB_OF_DISPLAYED_THEMATIQUES],
                "config_stats_url": responses["config_stats_url"],
                "meta_entretiens_utilisateurs": responses[
                    "meta_entretiens_utilisateurs"
                ],
                "meta_feedback_conseils": responses["meta_feedback_conseils"],
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
    thematique_names = [thematique.name for thematique in get_thematiques()]
    content = render_template(
        "sitemap.html", thematique_names=thematique_names, lastmod_date=date.today()
    )
    (STATIC_DIR / "sitemap.xml").write_text(content)


def get_thematiques():
    thematiques = []
    for path in each_file_from(CONTENUS_DIR / "thematiques", exclude=(".DS_Store",)):
        html_content = str(render_markdown_file(path))
        title = extract_title(html_content)
        image = extract_image(html_content)
        header = extract_header(html_content)
        body = extract_body(html_content)
        thematiques.append(
            Thematique(
                path=path,
                title=title,
                header=header,
                body=body,
                imgsrc=image,
                last_modified=last_modified_time(path),
            )
        )
    return thematiques


def last_modified_time(path):
    return PARIS_TIMEZONE.localize(datetime.fromtimestamp(path.stat().st_mtime))


def extract_title(html_content):
    html_title, _ = html_content.split("</h1>", 1)
    return html_title.split("<h1>", 1)[1]


def extract_image(html_content):
    _, from_src = html_content.split('<img src="', 1)
    return from_src.split('"', 1)[0]


def extract_header(html_content):
    html_header, _ = html_content.split("</header>", 1)
    return html_header.split("<header>", 1)[1]


def extract_body(html_content):
    return html_content.split("</header>", 1)[1]


def build_responses(source_dir):
    """Extract and convert markdown from a `source_dir` directory into a dict."""
    responses = {}
    for folder in each_folder_from(source_dir):
        for path in each_file_from(folder, pattern="*.md"):
            html_content = render_markdown_file(path)
            responses[path.stem] = html_content

    return responses


def render_markdown_file(file_path):
    return MarkdownContent(file_path.read_text(), markdown)


def _each_path_from(source_dir, pattern="*", exclude=None):
    for path in sorted(Path(source_dir).glob(pattern)):
        if exclude is not None and path.name in exclude:
            continue
        yield path


def each_folder_from(source_dir, exclude=None):
    """Walk across the `source_dir` and return the folder paths."""
    for path in _each_path_from(source_dir, exclude=exclude):
        if path.is_dir():
            yield path


def each_file_from(source_dir, pattern="*", exclude=None):
    """Walk across the `source_dir` and return the md file paths."""
    for path in _each_path_from(source_dir, pattern=pattern, exclude=exclude):
        if path.is_file():
            yield path


def render_template(src, **context):
    jinja_env.filters["me_or_them"] = me_or_them_filter
    jinja_env.filters["inline"] = inline_filter
    template = jinja_env.get_template(src)
    return template.render(**context)


def me_or_them_filter(value):
    assert isinstance(value, MarkdownContent)
    me, them = value.split()
    return me.render_me() + them.render_them()


def inline_filter(value):
    """Convert block content (default) to inline content."""
    assert isinstance(value, MarkdownContent)
    return MarkdownInlineContent(value.text, value.markdown)


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


@wrap
def perf_wrapper():
    start = perf_counter()
    yield
    elapsed = perf_counter() - start
    print(f"Done in {elapsed:.5f} seconds.")


if __name__ == "__main__":
    run()
