from datetime import datetime
from pathlib import Path

import pytz
from dataclasses import dataclass

from .markdown import render_markdown_file
from .strip import strip_tags
from .utils import each_file_from

HERE = Path(__file__).parent
THEMATIQUES_DIR = HERE.parent / "contenus" / "thematiques"

PARIS_TIMEZONE = pytz.timezone("Europe/Paris")


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


def get_thematiques(markdown_parser):
    thematiques = []
    for path in each_file_from(THEMATIQUES_DIR, exclude=(".DS_Store",)):
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
