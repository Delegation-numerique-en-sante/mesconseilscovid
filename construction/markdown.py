import re
from pathlib import Path
from textwrap import indent

import mistune
from jinja2 import Template

from .directives.injection import InjectionDirective
from .directives.renvoi import RenvoiDirective
from .directives.section import SectionDirective
from .directives.question import QuestionDirective
from .directives.toc import DirectiveToc
from .typographie import typographie


class FrenchTypographyMixin:
    def text(self, text_):
        return typographie(super().text(text_), html=True)

    def block_html(self, html):
        return typographie(super().block_html(html), html=True)


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


def render_markdown_file(file_path, markdown_parser):
    source = file_path.read_text()
    templated_source = Template(source).render(
        formulaire=render_formulaire,
        tableau_vaccination=render_tableau_vaccination,
        lexique=render_lexique,
    )
    return MarkdownContent(templated_source, markdown_parser)


def render_formulaire(nom_formulaire, prefixe=""):
    from .thematiques import THEMATIQUES_DIR

    path = THEMATIQUES_DIR / "formulaires" / f"{nom_formulaire}.md"
    with path.open() as f:
        template = Template(f.read())

    if prefixe:
        prefixe = nom_formulaire + "-" + prefixe
    else:
        prefixe = nom_formulaire

    markdown = (
        f'<div class="formulaire" data-nom="{nom_formulaire}" data-prefixe="{prefixe}">\n\n'
        + template.render(prefixe=prefixe)
        + "\n\n</div>"
    )
    return indent(markdown, "    ").lstrip()


def render_tableau_vaccination(nom_tableau):
    from .thematiques import THEMATIQUES_DIR

    path = THEMATIQUES_DIR / "tableaux_vaccination" / f"{nom_tableau}.md"
    with path.open() as f:
        template = Template(f.read())

    markdown = template.render()
    return indent(markdown, "    ").lstrip()


def render_lexique(nom, contexte=""):
    path = Path(__file__).parent.parent / "contenus" / "lexique" / f"{nom}.md"
    with path.open() as f:
        template = Template(f.read())

    markdown = template.render({"nom": nom, "contexte": contexte})
    return indent(markdown, "    ").lstrip()
