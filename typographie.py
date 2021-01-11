import unicodedata

import regex  # pour le support de "\p{}"


def assemble_regexes(*regexes):
    return "|".join(regexes)


def build_regex(avant, apres):
    # \p{} permet de reconnaître un caractère par sa catégorie Unicode
    # "Zs" est la catégorie des espaces
    return rf"((?P<avant>{avant})" + r"\p{Zs}" + rf"(?P<apres>{apres}))"


RE_ESPACES = regex.compile(
    assemble_regexes(
        build_regex(r"\w?", r"[:;!\?]"),  # Ponctuations doubles.
        build_regex(r"«", r"\w"),  # Guillemets typographiques.
        build_regex(r"\w", r"»"),  # Guillemets typographiques.
        build_regex(r"\d", r"([ghj]|jours?|mg)(\b|$)"),  # Unités.
        build_regex(r"\d", r"%"),  # Pourcentages.
        build_regex(r"\d", r"\d"),  # Séparateurs de milliers.
    )
)


ESPACE_FINE_INSECABLE = unicodedata.lookup("NARROW NO-BREAK SPACE")


def typographie(texte):
    """
    Utilise des espaces fines insécables lorsque c’est approprié
    """
    return RE_ESPACES.sub(r"\g<avant>" + ESPACE_FINE_INSECABLE + r"\g<apres>", texte)
