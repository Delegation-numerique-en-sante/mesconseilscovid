from slugify import slugify


def slugify_title(title):
    return slugify(
        title,
        stopwords=["span", "class", "visually", "hidden", "sup"],
        replacements=[("’", "'")],
    )
