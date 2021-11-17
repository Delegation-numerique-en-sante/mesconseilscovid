#!/usr/bin/env python3
import json
import logging
import re
from dataclasses import dataclass
from datetime import date, datetime
from html.parser import HTMLParser
from http import HTTPStatus
from io import StringIO
from pathlib import Path
from time import perf_counter

import httpx
import mistune
import pytz
from jinja2 import Environment as JinjaEnv
from jinja2 import FileSystemLoader, StrictUndefined
from minicli import cli, run, wrap
from mistune.directives import Directive
from mistune.markdown import preprocess
from selectolax.parser import HTMLParser as SelectolaxHTMLParser
from slugify import slugify

from construction.mistune_toc import DirectiveToc
from construction.typographie import typographie
from construction.utils import each_file_from, each_folder_from

LOGGER = logging.getLogger(__name__)

HERE = Path(__file__).parent
SRC_DIR = HERE / "src"
CONTENUS_DIR = HERE / "contenus"
STATIC_DIR = HERE / "static"
TEMPLATES_DIR = HERE / "templates"
NB_OF_DISPLAYED_THEMATIQUES = 9

PARIS_TIMEZONE = pytz.timezone("Europe/Paris")

jinja_env = JinjaEnv(
    loader=FileSystemLoader(str(TEMPLATES_DIR)), undefined=StrictUndefined
)


class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.text = StringIO()

    def handle_data(self, d):
        self.text.write(d)

    def get_data(self):
        return self.text.getvalue()


def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()


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
        return self._element_with_classes("p", text) or super().paragraph(text)

    def list_item(self, text, level):
        return self._element_with_classes("li", text) or super().list_item(text, level)

    def _element_with_classes(self, name, text):
        mo = self.RE_CLASS.match(text)
        if mo is not None:
            class_ = mo.group("class")
            content = " ".join(filter(None, [mo.group("before"), mo.group("after")]))
            return f'<{name} class="{class_}">{content}</{name}>\n'


class CustomHTMLRenderer(FrenchTypographyMixin, ClassMixin, mistune.HTMLRenderer):
    pass


def slugify_title(title):
    return slugify(
        title,
        stopwords=["span", "class", "visually", "hidden", "sup"],
        replacements=[("’", "'")],
    )


class SectionDirective(Directive):
    def __call__(self, md):
        self.register_directive(md, "section")

    def parse(self, block, m, state):
        text = m.group("value")
        options = dict(self.parse_options(m))
        if options and "slug" in options:
            tid = options["slug"]
        else:
            tid = slugify_title(text)
        if options and "level" in options:
            level = int(options["level"])
        else:
            level = 2
        if options and "tags" in options:
            tags = [tag.strip() for tag in options["tags"].split(",")]
        else:
            tags = []
        folded = options.get("folded") == "true"
        children = block.parse(self.parse_text(m), state, block.rules)
        if children:
            raise ValueError(
                f"Section avec des enfants : indentation en trop ?\n« {text} »"
            )
        state["toc_headings"].append((tid, text, level, tags))
        return {"type": "theading", "text": text, "params": (level, tid, tags, folded)}


class QuestionDirective(Directive):
    """
    Balisage FAQ pour les questions réponses

    https://developers.google.com/search/docs/data-types/faqpage?hl=fr
    """

    def parse(self, block, m, state):
        question = m.group("value")
        options = self.parse_options(m)
        if options:
            level = int(dict(options).get("level", 2))
            feedback = dict(options).get("feedback", "keep")
            nom_formulaire = dict(options).get("formulaire")
        else:
            level = 2
            feedback = "keep"
            nom_formulaire = None

        text = self.parse_text(m)
        children = block.parse(text, state, block.rules)

        if nom_formulaire:
            path = CONTENUS_DIR / "thematiques" / "formulaires" / f"{nom_formulaire}.md"
            with path.open() as f:
                nodes = block.parse(*preprocess(f.read(), {"__file__": str(path)}))
                children = nodes + children

        if not children:
            raise ValueError(
                f"Question sans réponse : indentation manquante ?\n« {question} »"
            )

        return {
            "type": "question",
            "children": children,
            "params": (question, level, feedback),
        }

    def __call__(self, md):
        self.register_directive(md, "question")
        if md.renderer.NAME == "html":
            md.renderer.register("question", self.render_html)
        else:
            md.renderer.register("question", self.render_ast)

    @staticmethod
    def render_ast(text, question, level, feedback):
        return {
            "type": "question",
            "titre": question,
            "level": level,
            "feedback": feedback,
            "text": text,
        }

    @staticmethod
    def render_html(text, question, level, feedback):
        question_id = slugify_title(question)
        feedback_html = (
            """<form class="question-feedback">
    <fieldset>
        <legend>Avez-vous trouvé cette réponse utile&#8239;?</legend>
        <div>
            <label><input type="submit" class="button-invisible" data-value="non" value="🙁">Non</label>
            <label><input type="submit" class="button-invisible" data-value="bof" value="😐">Bof</label>
            <label><input type="submit" class="button-invisible" data-value="oui" value="🙂">Oui</label>
        </div>
    </fieldset>
</form>"""
            if feedback == "keep"
            else ""
        )
        return f"""<details id="{question_id}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
{render_html_summary('', typographie(question), level, extra_span=' itemprop="name"')}
<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
<div itemprop="text">
{text}</div>
</div>
{feedback_html}
</details>
"""


class RenvoiDirective(Directive):
    def __init__(self, questions_index=None):
        self.questions_index = questions_index or {}

    def parse(self, block, m, state):
        ref = m.group("value")
        nom_page, id_question = ref.split("#")
        nom_page = nom_page.lstrip("/")
        page = self.questions_index[nom_page]
        titre_page = page["titre"]
        titre_question = page["questions"][id_question]["titre"]

        options = self.parse_options(m)
        if options:
            level = int(dict(options).get("level", 2))
        else:
            level = 2
        return {
            "type": "renvoi",
            "children": [],
            "params": (nom_page, titre_page, id_question, titre_question, level),
        }

    def __call__(self, md):
        self.register_directive(md, "renvoi")
        if md.renderer.NAME == "html":
            md.renderer.register("renvoi", self.render_html)

    @staticmethod
    def render_html(text, nom_page, titre_page, id_question, titre_question, level):
        return f"""<details id="{id_question}">
    {render_html_summary('', typographie(titre_question), level)}
    <p>
        Voir la réponse sur notre page
        « <a href="/{nom_page}#{id_question}">{typographie(titre_page)}</a> ».
    </p>
</details>
"""


class InjectionDirective(Directive):
    def __init__(self, questions_index=None):
        self.questions_index = questions_index or {}

    def parse(self, block, m, state):
        ref = m.group("value")
        nom_page, id_question = ref.split("#")
        nom_page = nom_page.lstrip("/")
        page = self.questions_index[nom_page]
        details_question = page["questions"][id_question]["details"]

        return {
            "type": "injection",
            "children": [],
            "params": (details_question,),
        }

    def __call__(self, md):
        self.register_directive(md, "injection")
        if md.renderer.NAME == "html":
            md.renderer.register("injection", self.render_html)

    @staticmethod
    def render_html(text, details_question):
        return details_question


def render_html_summary(text, title, level=3, extra_span=""):
    return f"""<summary>
    <h{level}>
        <span{extra_span}>{title}</span>
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs"><path d="m6 9 6 6 6-6"/></svg>
    </h{level}>
</summary>
"""


def create_markdown_parser(questions_index=None):
    plugins = [
        SectionDirective(),
        QuestionDirective(),
        DirectiveToc(),
    ]
    if questions_index is not None:
        plugins.append(RenvoiDirective(questions_index=questions_index))
        plugins.append(InjectionDirective(questions_index=questions_index))
    return mistune.create_markdown(
        renderer=CustomHTMLRenderer(escape=False),
        plugins=plugins,
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
    markdown_parser = create_markdown_parser()
    responses = build_responses(CONTENUS_DIR, markdown_parser)

    thematiques = get_thematiques(markdown_parser)[:NB_OF_DISPLAYED_THEMATIQUES]
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
    lang: str

    def __repr__(self):
        return f"Thematique {self.id}: {self.name}"

    def __lt__(self, other):
        return self.id < other.id

    @property
    def id(self):
        stem = self.path.stem
        if stem[0].isdigit():
            return int(stem.split("-", 1)[0])
        return stem

    @property
    def name(self):
        stem = self.path.stem
        if stem[0].isdigit():
            return stem.split("-", 1)[1]
        return stem

    @property
    def headerstr(self):
        return strip_tags(self.header).strip()

    @property
    def imgsrcpng(self):
        return self.imgsrc.replace(".svg", ".png")


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
    markdown_parser = create_markdown_parser()
    content = render_template(
        "sitemap.html",
        thematiques=get_thematiques(markdown_parser),
        lastmod_date=date.today(),
    )
    (STATIC_DIR / "sitemap.xml").write_text(content)


def get_thematiques(markdown_parser):
    thematiques = []
    for path in each_file_from(CONTENUS_DIR / "thematiques", exclude=(".DS_Store",)):
        html_content = str(render_markdown_file(path, markdown_parser))
        title = extract_title(html_content)
        image = extract_image(html_content)
        header = extract_header(html_content)
        body = extract_body(html_content)
        lang = "en" if title == "Covid in France as a foreigner" else "fr"
        thematiques.append(
            Thematique(
                path=path,
                title=title,
                header=header,
                body=body,
                imgsrc=image,
                last_modified=last_modified_time(path),
                lang=lang,
            )
        )
    return sorted(thematiques)


def build_questions_index():
    html_parser = create_markdown_parser()
    return {
        page.name + ".html": {"titre": page.title, "questions": extract_questions(page)}
        for page in get_thematiques(html_parser)
    }


def extract_questions(page):
    ast_parser = mistune.create_markdown(
        renderer=mistune.AstRenderer(), plugins=[QuestionDirective()]
    )
    ast_tree = ast_parser.read(page.path)

    html_parser = create_markdown_parser()
    html = html_parser.read(page.path)
    html_tree = SelectolaxHTMLParser(html)

    def _extract_questions(tree):
        if isinstance(tree, list):
            for node in tree:
                if node["type"] == "question":
                    yield node
                else:
                    if "children" in node:
                        yield from _extract_questions(node["children"])

    questions = {}
    for node in _extract_questions(ast_tree):
        slug = slugify_title(node["titre"])
        questions[slug] = {
            "titre": node["titre"],
            "details": html_tree.css_first(f"#{slug}").html,
        }
    return questions


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


def build_responses(source_dir, markdown_parser):
    """Extract and convert markdown from a `source_dir` directory into a dict."""
    responses = {}
    for folder in each_folder_from(source_dir):
        for path in each_file_from(folder, pattern="*.md"):
            html_content = render_markdown_file(path, markdown_parser)
            responses[path.stem] = html_content

    return responses


def render_markdown_file(file_path, markdown_parser):
    return MarkdownContent(file_path.read_text(), markdown_parser)


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
        follow_redirects=True,
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
