import regex  # pour le support de "\p{}"

ESPACE_INSECABLE = "&nbsp;"
ESPACE_FINE_INSECABLE = "&#8239;"


def assemble_regexes(*regexes):
    return "|".join(regexes)


def build_regex(avant, apres):
    # \p{} permet de reconnaître un caractère par sa catégorie Unicode
    # "Zs" est la catégorie "Separator, space".
    return (
        rf"((?P<avant>{avant})"
        + rf"(\p{{Zs}}|{ESPACE_INSECABLE})"
        + rf"(?P<apres>{apres}))"
    )


RE_ESPACE_FINE_INSECABLE = regex.compile(
    assemble_regexes(
        build_regex(r"\w?", r"[;\?!]"),  # Ponctuations doubles.
        build_regex(r"\d", r"([ghj]|mg|°C)(\b|$)"),  # Unités.
        build_regex(r"\d", r"%"),  # Pourcentages.
        build_regex(r"\d", r"€"),  # Symboles monétaires.
        build_regex(r"\d", r"\d"),  # Séparateurs de milliers.
    )
)


def insere_espaces_fines_insecables(texte):
    return RE_ESPACE_FINE_INSECABLE.sub(
        r"\g<avant>" + ESPACE_FINE_INSECABLE + r"\g<apres>", texte
    )


RE_ESPACE_INSECABLE = regex.compile(
    assemble_regexes(
        build_regex(r"\w?", r":"),  # Deux points.
        build_regex(r"«", r"\w"),  # Guillemets en chevrons.
        # "Po" est la catégorie "Punctuation, other".
        build_regex(r"[\w\p{Po}]", r"»"),  # Guillemets en chevrons.
        build_regex(r"\d", r"(?!\d)\w"),  # Chiffre suivi de lettres.
    )
)


def insere_espaces_insecables(texte):
    return RE_ESPACE_INSECABLE.sub(
        r"\g<avant>" + ESPACE_INSECABLE + r"\g<apres>", texte
    )


def typographie(texte):
    """
    Utilise les espaces insécables fines ou normales lorsque c’est approprié

    https://fr.wikipedia.org/wiki/Espace_ins%C3%A9cable#En_France
    """
    return insere_espaces_fines_insecables(insere_espaces_insecables(texte))
