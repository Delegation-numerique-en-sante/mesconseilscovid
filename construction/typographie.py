from dataclasses import dataclass
import html.entities
import unicodedata

import regex  # pour le support de "\p{}"


@dataclass
class Caractere:
    unicode: str
    html: str

    def __init__(self, name: str):
        self.unicode = unicodedata.lookup(name)
        codepoint = ord(self.unicode)
        html_name = html.entities.codepoint2name.get(codepoint, f"#{codepoint}")
        self.html = f"&{html_name};"


ESPACE_INSECABLE = Caractere(name="NO-BREAK SPACE")
ESPACE_FINE_INSECABLE = Caractere(name="NARROW NO-BREAK SPACE")


def assemble_regexes(*regexes):
    return "|".join(regexes)


def build_regex(avant, apres):
    # \p{} permet de reconnaître un caractère par sa catégorie Unicode
    # "Zs" est la catégorie "Separator, space".
    return (
        rf"((?P<avant>{avant})"
        + rf"(\p{{Zs}}|{ESPACE_INSECABLE.html})"
        + rf"(?P<apres>{apres}))"
        + r"(?!(.(?!<svg))*<\/svg>)"
    )


RE_ESPACE_FINE_INSECABLE = regex.compile(
    assemble_regexes(
        build_regex(r"\w?", r"[;\?!]"),  # Ponctuations doubles.
        build_regex(r"\d", r"([ghj]|µg|mg|°C)(\b|$)"),  # Unités.
        build_regex(r"\d", r"%"),  # Pourcentages.
        build_regex(r"\d", r"€"),  # Symboles monétaires.
        build_regex(r"\d", r"\d"),  # Séparateurs de milliers.
    )
)


def insere_espaces_fines_insecables(texte):
    return RE_ESPACE_FINE_INSECABLE.sub(
        r"\g<avant>" + ESPACE_FINE_INSECABLE.unicode + r"\g<apres>", texte
    )


RE_ESPACE_INSECABLE = regex.compile(
    assemble_regexes(
        build_regex(r"\w?", r":"),  # Deux points.
        build_regex(r"«", r""),  # Guillemets en chevrons.
        build_regex(r"", r"»"),  # Guillemets en chevrons.
        build_regex(
            rf"\b(\d|{ESPACE_FINE_INSECABLE.html})+", r"(?!\d)\w"
        ),  # Nombre suivi de lettres.
    )
)


def insere_espaces_insecables(texte):
    return RE_ESPACE_INSECABLE.sub(
        r"\g<avant>" + ESPACE_INSECABLE.unicode + r"\g<apres>", texte
    )


def encode_espaces_insecables_en_html(texte):
    for caractere in (ESPACE_INSECABLE, ESPACE_FINE_INSECABLE):
        texte = texte.replace(caractere.unicode, caractere.html)
    return texte


def typographie(texte, html=False):
    """
    Utilise les espaces insécables fines ou normales lorsque c’est approprié

    https://fr.wikipedia.org/wiki/Espace_ins%C3%A9cable#En_France
    """
    res = insere_espaces_fines_insecables(insere_espaces_insecables(texte))
    if html:
        res = encode_espaces_insecables_en_html(res)
    return res
