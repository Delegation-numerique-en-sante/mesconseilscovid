import pytest


@pytest.mark.parametrize(
    "in_,out_",
    [
        ("", ""),
        (" ", " "),
        (" ", " "),
        ("ici !", "ici\u202f!"),
        ("non ?", "non\u202f?"),
        ("infos :", "infos\u202f:"),
        ("entre « guillemets »", "entre «\u202fguillemets\u202f»"),
        ("18 h", "18\u202fh"),
        ("24 heures", "24\u202fheures"),
        ("24 heures", "24\u202fheures"),
        ("18 hibous", "18 hibous"),
        ("1 j", "1\u202fj"),
        ("1 jour", "1\u202fjour"),
        ("2 j", "2\u202fj"),
        ("2 jours", "2\u202fjours"),
        ("65 ans", "65\u202fans"),
        ("150 g", "150\u202fg"),
        ("150 g de farine", "150\u202fg de farine"),
        ("150 gibbons", "150 gibbons"),
        ("200 mg", "200\u202fmg"),
        ("à 10 000 kilomètres", "à 10\u202f000 kilomètres"),
        ("100 %", "100\u202f%"),
        ("pour 100 % des cas", "pour 100\u202f% des cas"),
    ],
)
def test_espaces(in_, out_):
    from typographie import typographie

    assert typographie(in_) == out_
